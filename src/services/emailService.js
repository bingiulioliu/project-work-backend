import { transporter } from "../utils/mailer.js";

export async function sendNewsletterWelcomeEmail(email) {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: "Benvenuto in JSON's Quest!",
        text: "Grazie per esserti iscritto alla newsletter di JSON's Quest!",
        html: `
            <h1>Benvenuto in JSON's Quest!</h1>
            <p>Grazie per esserti iscritto alla nostra newsletter.</p>
            <p>Preparati a ricevere offerte leggendarie, artefatti rari e novità dal regno.</p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
}