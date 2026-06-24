import { sendNewsletterWelcomeEmail } from "../services/emailService.js";

export async function subscribeToNewsletter(request, response) {
    const { email } = request.body;

    if (!email || typeof email !== "string" || email.trim() === "") {
        return response.status(400).json({
            error: "Email obbligatoria",
        });
    }

    try {
        await sendNewsletterWelcomeEmail(email);

        response.status(200).json({
            message: "Email di ringraziamento inviata con successo",
        });
    } catch (error) {
        console.error("Errore invio email newsletter:", error);

        response.status(500).json({
            error: "Errore durante l'invio della email",
        });
    }
}