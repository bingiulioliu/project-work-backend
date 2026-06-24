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

export async function sendOrderConfirmationEmail(orderData) {
    const productsList = orderData.products
        .map((product) => {
            return `
                <li>
                    ${product.name} - Quantità: ${product.quantity} - Totale: ${product.line_total.toFixed(2)} €
                </li>
            `;
        })
        .join("");

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: orderData.mail,
        subject: `Conferma ordine ${orderData.order_number} - JSON's Quest`,
        text: `Grazie per il tuo ordine ${orderData.order_number}. Totale: ${orderData.total.toFixed(2)} €`,
        html: `
            <h1>Ordine confermato!</h1>

            <p>Ciao ${orderData.customer_name},</p>

            <p>
                La Gilda di JSON's Quest ha ricevuto correttamente il tuo ordine.
            </p>

            <p>
                <strong>Numero ordine:</strong> ${orderData.order_number}
            </p>

            <h2>Riepilogo prodotti</h2>

            <ul>
                ${productsList}
            </ul>

            <p>
                <strong>Totale ordine:</strong> ${orderData.total.toFixed(2)} €
            </p>

            <p>
                La tua pergamena d'acquisto è stata registrata negli archivi del regno.
            </p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
}

export async function sendOrderNotificationEmail(orderData) {
    const productsList = orderData.products
        .map((product) => {
            return `
                <li>
                    ${product.name} - Quantità: ${product.quantity} - Totale: ${product.line_total.toFixed(2)} €
                </li>
            `;
        })
        .join("");

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: process.env.SELLER_EMAIL,
        subject: `Nuovo ordine ricevuto - ${orderData.order_number}`,
        text: `Nuovo ordine ricevuto da ${orderData.customer_name}. Totale: ${orderData.total.toFixed(2)} €`,
        html: `
            <h1>Nuovo ordine ricevuto</h1>

            <p>
                È arrivato un nuovo ordine su JSON's Quest.
            </p>

            <p>
                <strong>Numero ordine:</strong> ${orderData.order_number}
            </p>

            <h2>Dati cliente</h2>

            <p>
                <strong>Nome:</strong> ${orderData.customer_name}<br>
                <strong>Email:</strong> ${orderData.mail}<br>
                <strong>Telefono:</strong> ${orderData.telephone_number}<br>
                <strong>Indirizzo:</strong> ${orderData.customer_address}, ${orderData.customer_city} - ${orderData.customer_postal_code}
            </p>

            <h2>Prodotti ordinati</h2>

            <ul>
                ${productsList}
            </ul>

            <p>
                <strong>Totale ordine:</strong> ${orderData.total.toFixed(2)} €
            </p>

            <p>
                <strong>Note:</strong> ${orderData.notes || "Nessuna nota"}
            </p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
}