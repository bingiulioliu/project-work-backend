import { askAnthropic } from "../services/anthropicService.js";

async function assistant(request, response) {
    const { message } = request.body;

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

    try {
        console.log("[assistant] Inizio elaborazione con prompt:", message);
        const result = await askAnthropic(message.trim());
        console.log("[assistant] Risposta generata con successo");

        return response.json({
            error: null,
            result
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

export { assistant };