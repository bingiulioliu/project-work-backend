import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import connection from "../db/connections/connection.js";
import { z } from "zod";

let anthropicClient;
let cachedSchemaSnapshot = "";
let cachedAt = 0;
const conversationHistory = new Map(); // Map<sessionId, Array<{user, assistant}>>
const sessionProductContext = new Map(); // Map<sessionId, productContext>

const SCHEMA_CACHE_TTL_MS = 60 * 1000;
const MAX_HISTORY_PER_SESSION = 10;
const DB_ONLY_REFUSAL = "Posso rispondere a domande relative a json quest";

function isLikelyCatalogQuestion(prompt) {
    const lowerPrompt = String(prompt || "").toLowerCase();
    const catalogKeywords = [
        "prodotto",
        "prodotti",
        "catalogo",
        "prezzo",
        "costo",
        "rar",
        "categoria",
        "carrello",
        "ordine",
        "acquisto",
        "spedizione",
        "disponibile",
        "questo",
        "questo prodotto",
        "json's quest",
        "json s quest",
        "bastone tra le ruote"
    ];

    const catalogPatterns = [
        /\bparlami\b.*\b(di|del|della|dello|dei|delle|su)\b/i,
        /\bcosa\s+fa\b/i,
        /\bche\s+prodotti\s+vendi\b/i,
        /\bquali\s+categorie\s+ci\s+sono\b/i
    ];

    if (catalogPatterns.some((pattern) => pattern.test(lowerPrompt))) {
        return true;
    }

    return catalogKeywords.some((keyword) => lowerPrompt.includes(keyword));
}

function isStorePresentationQuestion(prompt) {
    const lowerPrompt = String(prompt || "").toLowerCase();
    return lowerPrompt.includes("parlami di json's quest") || lowerPrompt.includes("parlami di json s quest");
}

function buildProductContextText(productContext) {
    if (!productContext) {
        return "";
    }

    const categories = Array.isArray(productContext.categories)
        ? productContext.categories.map((category) => category.name).filter(Boolean)
        : [];

    return [
        `id: ${productContext.id}`,
        `name: ${productContext.name || ""}`,
        `slug: ${productContext.slug || ""}`,
        `price: ${productContext.price ?? ""}`,
        `rarity: ${productContext.rarity || ""}`,
        `image: ${productContext.image || ""}`,
        `description: ${productContext.description || ""}`,
        `categories: ${categories.join(", ")}`
    ].join("\n");
}

function isPersonalQuestion(prompt) {
    const lower = prompt.toLowerCase();
    const personalPatterns = [
        /mi chiamo/i,
        /sono/i,
        /io sono/i,
        /il mio nome/i,
        /chiamo/i,
        /presentazione/i,
        /ciao/i,
        /salve/i,
        /come stai/i,
        /come va/i,
        /come ti chiami/i,
        /chi sei/i,
        /piacere/i,
        /te lo presento/i
    ];
    return personalPatterns.some(pattern => pattern.test(lower));
}
const SAFE_TABLES = ["products", "categories", "orders", "order_product", "category_product"];

const ColumnRowSchema = z.object({
    TABLE_NAME: z.string().optional(),
    COLUMN_NAME: z.string().optional(),
    DATA_TYPE: z.string().optional(),
    IS_NULLABLE: z.string().optional(),
    COLUMN_KEY: z.string().nullable().optional()
}).transform((data) => ({
    table_name: data.TABLE_NAME || data.table_name || "",
    column_name: data.COLUMN_NAME || data.column_name || "",
    data_type: data.DATA_TYPE || data.data_type || "",
    is_nullable: data.IS_NULLABLE || data.is_nullable || "YES",
    column_key: data.COLUMN_KEY || data.column_key
}));

const ColumnRowsSchema = z.array(ColumnRowSchema);

const QueryPlanSchema = z.object({
    isDatabaseQuestion: z.boolean(),
    sql: z.string().default(""),
    queryType: z.enum(["specific", "analytical", "fallback"]).default("specific")
});

const QueryRowsSchema = z.array(z.record(z.string(), z.unknown()));

function buildSchemaText(columns) {
    const tableMap = new Map();

    for (const row of columns) {
        const tableName = row.table_name;
        const columnInfo = `${row.column_name} (${row.data_type})${row.is_nullable === "NO" ? " NOT NULL" : ""}${row.column_key === "PRI" ? " PK" : ""}`;

        if (!tableMap.has(tableName)) {
            tableMap.set(tableName, []);
        }

        tableMap.get(tableName).push(columnInfo);
    }

    return Array.from(tableMap.entries())
        .map(([tableName, cols]) => `- ${tableName}: ${cols.join(", ")}`)
        .join("\n");
}

function buildRelationshipHints() {
    return [
        "- products -> category_product -> categories",
        "- Per ottenere le categorie di un prodotto: FROM products p JOIN category_product cp ON cp.product_id = p.id JOIN categories c ON c.id = cp.category_id",
        "- Per ottenere i prodotti di una categoria: FROM categories c JOIN category_product cp ON cp.category_id = c.id JOIN products p ON p.id = cp.product_id"
    ].join("\n");
}

async function getSchemaContext() {
    const now = Date.now();

    if (cachedSchemaSnapshot && now - cachedAt < SCHEMA_CACHE_TTL_MS) {
        return cachedSchemaSnapshot;
    }

    const query = `
        SELECT
            table_name,
            column_name,
            data_type,
            is_nullable,
            column_key
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
        ORDER BY table_name, ordinal_position
    `;

    const [rows] = await connection.query(query);
    const parsedRows = ColumnRowsSchema.parse(rows);

    cachedSchemaSnapshot = `${buildSchemaText(parsedRows)}\n\nRelazioni utili:\n${buildRelationshipHints()}`;
    cachedAt = now;

    return cachedSchemaSnapshot;
}

function parseJsonResponse(text) {
    const str = String(text || "").trim();
    
    // Rimuovi markdown code block se presente
    let jsonStr = str;
    if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.slice(3);
    }
    
    if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.slice(0, -3);
    }
    
    jsonStr = jsonStr.trim();
    
    try {
        return JSON.parse(jsonStr);
    } catch {
        console.error("[parseJsonResponse] Failed to parse:", jsonStr);
        return null;
    }
}

function normalizeSql(sql) {
    return String(sql || "").replace(/\s+/g, " ").trim();
}

function buildFallbackQuery(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("bastone tra le ruote")) {
        return "SELECT id, name, slug, price, rarity, image, description FROM products WHERE name LIKE '%bastone tra le ruote%' OR description LIKE '%bastone tra le ruote%' LIMIT 5";
    }

    if (lowerPrompt.includes("ordine") || lowerPrompt.includes("acquist")) {
        return "SELECT * FROM orders LIMIT 25";
    } else if (lowerPrompt.includes("categor")) {
        return "SELECT * FROM categories LIMIT 25";
    } else if (lowerPrompt.includes("prezzo") || lowerPrompt.includes("costo") || lowerPrompt.includes("miglior") || lowerPrompt.includes("raro")) {
        return "SELECT id, name, slug, price, rarity, description FROM products LIMIT 25";
    }
    return "SELECT id, name, slug, price, rarity, image, description FROM products LIMIT 25";
}

function ensureSafeSelectQuery(sql) {
    const normalizedSql = normalizeSql(sql);

    if (!normalizedSql.toLowerCase().startsWith("select ")) {
        throw new Error("Sono consentite solo query SELECT");
    }

    if (normalizedSql.includes(";")) {
        throw new Error("Sono consentite solo query a statement singolo");
    }

    const forbidden = /\b(insert|update|delete|drop|alter|truncate|create|replace|grant|revoke)\b/i;
    if (forbidden.test(normalizedSql)) {
        throw new Error("Query non consentita");
    }

    const hasAllowedTable = SAFE_TABLES.some((tableName) => new RegExp(`\\b${tableName}\\b`, "i").test(normalizedSql));
    if (!hasAllowedTable) {
        throw new Error("La query deve usare tabelle consentite");
    }

    if (!/\blimit\b/i.test(normalizedSql)) {
        return `${normalizedSql} LIMIT 25`;
    }

    return normalizedSql;
}

async function generateQueryPlan(model, prompt, schemaContext) {
    const response = await model.invoke([
        new SystemMessage(`ISTRUZIONI STRICT: Rispondi con SOLO JSON valido, nulla di più.
Formato: {"isDatabaseQuestion":true/false,"sql":"SELECT...","queryType":"specific|analytical|fallback"}

Regole:
1. isDatabaseQuestion=true se la domanda riguarda dati nel database (prodotti, categorie, ordini, etc.)
2. Includi domande analitiche/consigli basati sui dati (es: "qual'è il prodotto migliore?" è true)
3. queryType="specific" per query SQL dettagliate; "analytical" per analisi su dati generici; "fallback" per query generiche
4. isDatabaseQuestion=false SOLO per domande estranee ai dati`),
        new HumanMessage(`Database schema:\n${schemaContext}\n\nUser question:\n${prompt}\n\nRespond with ONLY valid JSON, no other text.`)
    ]);

    console.log("[generateQueryPlan] Raw response.content:", response.content);
    console.log("[generateQueryPlan] Content type:", typeof response.content);
    console.log("[generateQueryPlan] Content length:", String(response.content).length);
    
    const contentStr = parseResponseContent(response.content);
    console.log("[generateQueryPlan] Parsed content string:", contentStr);
    
    const parsed = parseJsonResponse(contentStr);
    console.log("[generateQueryPlan] JSON parsed:", parsed);

    if (!parsed || typeof parsed !== "object") {
        console.error("[generateQueryPlan] Parsed is not an object:", parsed);
        throw new Error(`Antropic non ha generato JSON valido nel piano: "${contentStr}"`);
    }

    return QueryPlanSchema.parse(parsed);
}

function getSessionHistory(sessionId) {
    if (!conversationHistory.has(sessionId)) {
        return [];
    }
    return conversationHistory.get(sessionId);
}

function addToHistory(sessionId, userMessage, assistantResponse) {
    if (!conversationHistory.has(sessionId)) {
        conversationHistory.set(sessionId, []);
    }
    const history = conversationHistory.get(sessionId);
    history.push({ user: userMessage, assistant: assistantResponse });
    
    // Mantieni solo gli ultimi 10 messaggi
    if (history.length > MAX_HISTORY_PER_SESSION) {
        history.shift();
    }
    console.log(`[addToHistory] Storico aggiornato per ${sessionId}. Totale conversazioni: ${history.length}`);
}

function getSessionProductContext(sessionId) {
    if (!sessionProductContext.has(sessionId)) {
        return null;
    }
    return sessionProductContext.get(sessionId);
}

function setSessionProductContext(sessionId, productContext) {
    if (!sessionId || !productContext) {
        return;
    }

    sessionProductContext.set(sessionId, productContext);
}

function buildHistoryContext(history) {
    if (!history || history.length === 0) {
        return "";
    }
    const historyText = history
        .map((item) => `Utente: ${item.user}\nAssistente: ${item.assistant}`)
        .join("\n---\n");
    return `\n\nStorico conversazioni precedenti (${history.length} messaggi):\n${historyText}\n---\n`;
}

async function buildPersonalAnswer(model, prompt, historyContext = "") {
    const response = await model.invoke([
        new SystemMessage("Sei un assistente amichevole e conversazionale. Rispondi in italiano in modo naturale e cortese. Puoi fare domande di ritorno, ricordare i nomi e gli interessi dell'utente dallo storico. Sii breve e sintetico."),
        new HumanMessage(`Messaggio:\n${prompt}${historyContext}`)
    ]);

    console.log("[buildPersonalAnswer] Risposta generata");
    return parseResponseContent(response.content);
}

async function buildProductScopedAnswer(model, prompt, productContext, historyContext = "") {
    const productContextText = buildProductContextText(productContext);

    const response = await model.invoke([
        new SystemMessage("Sei un assistente ecommerce in italiano. Devi rispondere usando soltanto il contesto del prodotto corrente. Se l'utente chiede altro, spiega che puoi aiutare solo su questo prodotto e invita a fare una domanda pertinente."),
        new HumanMessage(`Prodotto corrente:\n${productContextText}${historyContext}\n\nDomanda utente:\n${prompt}`)
    ]);

    return parseResponseContent(response.content);
}

async function buildFinalAnswer(model, prompt, querySql, queryRows, historyContext = "") {
    const response = await model.invoke([
        new SystemMessage("Rispondi in italiano sintetico e conciso solo usando i dati forniti dal risultato query. Se i dati sono vuoti o insufficienti, dillo chiaramente. Fai riferimento allo storico se rilevante per continuità."),
        new HumanMessage(`Domanda:\n${prompt}\n\nQuery eseguita:\n${querySql}\n\nRisultati query (JSON):\n${JSON.stringify(queryRows)}${historyContext}`)
    ]);

    console.log("[Anthropic Answer Response]", response.content);
    return parseResponseContent(response.content);
}

function getAnthropicClient() {
    if (!anthropicClient) {
        anthropicClient = new ChatAnthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            temperature: 0.2
        });
    }

    return anthropicClient;
}

function parseResponseContent(content) {
    if (typeof content === "string") {
        return content;
    }

    if (Array.isArray(content)) {
        return content
            .map((chunk) => (typeof chunk === "string" ? chunk : chunk?.text || ""))
            .join("\n")
            .trim();
    }

    return "";
}

async function askAnthropic(prompt, sessionId = "default", options = {}) {
    try {
        console.log("[askAnthropic] Inizio con prompt:", prompt, "sessionId:", sessionId);
        const inputProductContext = options?.productContext || null;
        const productContext = inputProductContext || getSessionProductContext(sessionId);

        if (inputProductContext) {
            setSessionProductContext(sessionId, inputProductContext);
        }
    
        const model = getAnthropicClient();
        console.log("[askAnthropic] Client creato");
    
        const schemaContext = await getSchemaContext();
        console.log("[askAnthropic] Schema recuperato, lunghezza:", schemaContext.length);
    
        // Recupera storico conversazioni
        const history = getSessionHistory(sessionId);
        const historyContext = buildHistoryContext(history);
        console.log("[askAnthropic] Storico recuperato:", history.length, "conversazioni");

        if (isStorePresentationQuestion(prompt)) {
            const storeAnswer = "JSON's Quest e' uno shop fantasy per avventurieri del quotidiano: trovi articoli utili reinterpretati come artefatti, con tono ironico da RPG e checkout semplice. Se vuoi, posso anche consigliarti subito i prodotti migliori in base a quello che cerchi.";
            addToHistory(sessionId, prompt, storeAnswer);
            return storeAnswer;
        }

        // Se c'e' il contesto del prodotto aperto, la risposta viene confinata a quel prodotto.
        if (productContext) {
            console.log("[askAnthropic] Modalita prodotto singolo attiva per:", productContext.slug || productContext.id);
            const productAnswer = await buildProductScopedAnswer(model, prompt, productContext, historyContext);
            addToHistory(sessionId, prompt, productAnswer);
            return productAnswer;
        }
    
        const plan = await generateQueryPlan(model, prompt, schemaContext);
        console.log("[askAnthropic] Piano generato:", plan);
    
        // Controlla se è una domanda personale/conversazionale
        if (isPersonalQuestion(prompt)) {
            console.log("[askAnthropic] È una domanda personale, rispondo direttamente");
            const answer = await buildPersonalAnswer(model, prompt, historyContext);
            addToHistory(sessionId, prompt, answer);
            return answer;
        }
    
        if (!plan.isDatabaseQuestion) {
            const shouldFallbackToDb = isLikelyCatalogQuestion(prompt);

            if (!shouldFallbackToDb) {
                console.log("[askAnthropic] Non e' una domanda DB, rifiuto");
                return DB_ONLY_REFUSAL;
            }

            console.log("[askAnthropic] Piano non DB ma domanda compatibile con catalogo, uso fallback query");
            const fallbackSql = ensureSafeSelectQuery(buildFallbackQuery(prompt));
            const [fallbackRows] = await connection.query(fallbackSql);
            const parsedFallbackRows = QueryRowsSchema.parse(fallbackRows);
            const fallbackAnswer = await buildFinalAnswer(model, prompt, fallbackSql, parsedFallbackRows, historyContext);
            addToHistory(sessionId, prompt, fallbackAnswer);
            return fallbackAnswer;
        }
    
        // Determina quale query eseguire
        let safeSql = "";
        if (plan.sql && plan.sql.trim()) {
            console.log("[askAnthropic] Piano SQL fornito:", plan.sql);
            safeSql = ensureSafeSelectQuery(plan.sql);
        } else if (plan.queryType === "analytical" || plan.queryType === "fallback") {
            // Se la domanda è analitica ma non c'è query specifica, usa fallback
            console.log("[askAnthropic] Domanda analitica, uso fallback query");
            safeSql = ensureSafeSelectQuery(buildFallbackQuery(prompt));
        } else {
            console.log("[askAnthropic] Nessuna query disponibile, rifiuto");
            return DB_ONLY_REFUSAL;
        }
        
        console.log("[askAnthropic] Query safe:", safeSql);
    
        const [rows] = await connection.query(safeSql);
        console.log("[askAnthropic] Query eseguita, righe:", rows.length);
    
        const parsedRows = QueryRowsSchema.parse(rows);
        console.log("[askAnthropic] Righe parsate");
    
        const answer = await buildFinalAnswer(model, prompt, safeSql, parsedRows, historyContext);
        
        // Salva nella storia
        addToHistory(sessionId, prompt, answer);
        
        return answer;
    } catch (error) {
        console.error("[askAnthropic] Errore catturato:", error.message, error.stack);
        throw error;
    }
}

export { askAnthropic };