import { askAnthropic } from "../services/anthropicService.js";
import connection from "../db/connections/connection.js";

const AI_PRESET_QUESTIONS = [
    "che prodotti vendi?",
    "parlami di json's quest",
    "quali categorie ci sono",
    "cosa fa il bastone tra le ruote"
];

function getAiPresetQuestions() {
    return [...AI_PRESET_QUESTIONS];
}

function extractProductSlugFromSessionId(sessionId) {
    if (!sessionId || typeof sessionId !== "string") {
        return "";
    }

    const normalized = sessionId.trim();
    const patterns = [
        /^product[-:_](.+)$/i,
        /^show[-:_](.+)$/i,
        /^product-detail[-:_](.+)$/i
    ];

    for (const pattern of patterns) {
        const match = normalized.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }

    return "";
}

async function getProductContext({ productId, productSlug }) {
    if (!productId && !productSlug) {
        return null;
    }

    let query = `
        SELECT id, name, slug, description, price, rarity, image
        FROM products
        WHERE id = ?
        LIMIT 1
    `;
    let value = productId;

    if (!productId && productSlug) {
        query = `
            SELECT id, name, slug, description, price, rarity, image
            FROM products
            WHERE slug = ?
            LIMIT 1
        `;
        value = productSlug;
    }

    const [rows] = await connection.execute(query, [value]);

    if (!rows.length) {
        return null;
    }

    const product = rows[0];

    const [categories] = await connection.execute(
        `
            SELECT c.name, c.slug
            FROM category_product cp
            JOIN categories c ON c.id = cp.category_id
            WHERE cp.product_id = ?
        `,
        [product.id]
    );

    return {
        ...product,
        categories
    };
}

async function assistant(request, response) {
    const { message, sessionId, productId, productSlug } = request.body;

    if (!process.env.ANTHROPIC_API_KEY) {
        console.error("[assistant] ANTHROPIC_API_KEY non configurato");
        return response.status(500).json({
            error: "Configurazione mancante",
            result: null,
            message: "Imposta ANTHROPIC_API_KEY nel file .env"
        });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
        console.error("[assistant] Input message non valido:", message);
        return response.status(400).json({
            error: "Input non valido",
            result: null,
            message: "Il campo message e' obbligatorio"
        });
    }

    // Usa sessionId fornito o "default" se non presente
    const usedSessionId = sessionId && typeof sessionId === "string" ? sessionId.trim() : "default";

    try {
        console.log("[assistant] Inizio elaborazione con prompt:", message, "sessionId:", usedSessionId);
        const normalizedProductId = Number(productId);
        const hasValidProductId = Number.isInteger(normalizedProductId) && normalizedProductId > 0;
        const normalizedProductSlug = typeof productSlug === "string" ? productSlug.trim() : "";
        const inferredProductSlug = !hasValidProductId && !normalizedProductSlug
            ? extractProductSlugFromSessionId(usedSessionId)
            : "";
        const effectiveProductSlug = normalizedProductSlug || inferredProductSlug;

        const productContext = await getProductContext({
            productId: hasValidProductId ? normalizedProductId : null,
            productSlug: effectiveProductSlug || null
        });

        if ((hasValidProductId || effectiveProductSlug) && !productContext) {
            return response.status(404).json({
                error: "Prodotto non trovato",
                result: null,
                message: "Il prodotto passato nel contesto AI non esiste"
            });
        }

        const result = await askAnthropic(message.trim(), usedSessionId, {
            productContext
        });
        console.log("[assistant] Risposta generata con successo");

        return response.json({
            error: null,
            result,
            presetQuestions: getAiPresetQuestions()
        });
    } catch (error) {
        console.error("[assistant] Errore durante askAnthropic:", error.message);
        console.error("[assistant] Stack:", error.stack);

        const statusCode = error.message?.includes("JSON") ? 400 : 502;
        return response.status(statusCode).json({
            error: "Errore provider AI",
            result: null,
            message: error.message || "Chiamata ad Anthropic non riuscita"
        });
    }
}

async function assistantPresetQuestions(request, response) {
    return response.json({
        error: null,
        result: getAiPresetQuestions()
    });
}

export { assistant, assistantPresetQuestions };