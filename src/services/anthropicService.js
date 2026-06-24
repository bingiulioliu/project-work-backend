import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import connection from "../db/connections/connection.js";
import { z } from "zod";

let anthropicClient;
let cachedSchemaSnapshot = "";
let cachedAt = 0;

const SCHEMA_CACHE_TTL_MS = 60 * 1000;
const DB_ONLY_REFUSAL = "Posso rispondere solo a domande relative a json quest";
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
    sql: z.string().default("")
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
        new SystemMessage("ISTRUZIONI STRICT: Rispondi con SOLO JSON valido, nulla di più. Formato: {\"isDatabaseQuestion\":true/false,\"sql\":\"SELECT...\"}"),
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

async function buildFinalAnswer(model, prompt, querySql, queryRows) {
    const response = await model.invoke([
        new SystemMessage("Rispondi in italiano sintetico e conciso solo usando i dati forniti dal risultato query. Se i dati sono vuoti o insufficienti, dillo chiaramente."),
        new HumanMessage(`Domanda:\n${prompt}\n\nQuery eseguita:\n${querySql}\n\nRisultati query (JSON):\n${JSON.stringify(queryRows)}`)
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

async function askAnthropic(prompt) {
    try {
        console.log("[askAnthropic] Inizio con prompt:", prompt);
    
        const model = getAnthropicClient();
        console.log("[askAnthropic] Client creato");
    
        const schemaContext = await getSchemaContext();
        console.log("[askAnthropic] Schema recuperato, lunghezza:", schemaContext.length);
    
        const plan = await generateQueryPlan(model, prompt, schemaContext);
        console.log("[askAnthropic] Piano generato:", plan);
    
        if (!plan.isDatabaseQuestion) {
            console.log("[askAnthropic] Non è una domanda DB, rifiuto");
            return DB_ONLY_REFUSAL;
        }
    
        console.log("[askAnthropic] Piano SQL:", plan.sql);
        const safeSql = ensureSafeSelectQuery(plan.sql);
        console.log("[askAnthropic] Query safe:", safeSql);
    
        const [rows] = await connection.query(safeSql);
        console.log("[askAnthropic] Query eseguita, righe:", rows.length);
    
        const parsedRows = QueryRowsSchema.parse(rows);
        console.log("[askAnthropic] Righe parsate");
    
        return buildFinalAnswer(model, prompt, safeSql, parsedRows);
    } catch (error) {
        console.error("[askAnthropic] Errore catturato:", error.message, error.stack);
        throw error;
    }
}

export { askAnthropic };