import { transporter } from "../utils/mailer.js";

export async function sendNewsletterWelcomeEmail(email) {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: "📜 Una pergamena è arrivata dalla Gilda di JSON's Quest",
        text: `Benvenuto nella Gilda, avventuriero!

La tua iscrizione è stata registrata negli archivi reali.

Da oggi riceverai pergamene con offerte leggendarie, nuovi artefatti rari e segreti riservati solo ai membri della Gilda.

Che la fortuna guidi le tue prossime spedizioni.

— Il Mastro della Gilda, JSON's Quest`,
        html: `
            <div style="background-color: #1a1a2e; padding: 40px 20px; font-family: Georgia, 'Times New Roman', serif;">
                <div style="max-width: 480px; margin: 0 auto; background-color: #f4ecd8; border: 2px solid #c9a86a; border-radius: 8px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">

                    <p style="text-align: center; font-size: 28px; margin: 0 0 8px;">📜</p>

                    <h1 style="text-align: center; color: #5a3e1b; font-size: 24px; margin: 0 0 24px; letter-spacing: 0.5px;">
                        Benvenuto nella Gilda!
                    </h1>

                    <p style="color: #3a2c1a; font-size: 16px; line-height: 1.6;">
                        Salve, avventuriero.
                    </p>

                    <p style="color: #3a2c1a; font-size: 16px; line-height: 1.6;">
                        La tua iscrizione è stata <strong>registrata negli archivi reali</strong> di JSON's Quest. Il tuo nome figura ora tra i membri della Gilda.
                    </p>

                    <div style="background-color: #ffffff; border-left: 4px solid #c9a86a; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
                        <p style="color: #3a2c1a; font-size: 15px; line-height: 1.6; margin: 0;">
                            ⚔️ Offerte leggendarie riservate ai membri<br/>
                            🗝️ Accesso anticipato ai nuovi artefatti<br/>
                            🧙 Segreti e curiosità dal regno
                        </p>
                    </div>

                    <p style="color: #3a2c1a; font-size: 16px; line-height: 1.6;">
                        Che la fortuna guidi le tue prossime spedizioni.
                    </p>

                    <p style="text-align: center; margin-top: 32px;">
                        <a href="http://localhost:5173/products" style="background-color: #5a3e1b; color: #f4ecd8; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-size: 15px; display: inline-block;">
                            Esplora il Catalogo
                        </a>
                    </p>

                    <p style="text-align: center; color: #8a7a5c; font-size: 13px; margin-top: 32px; border-top: 1px solid #d9c9a3; padding-top: 16px;">
                        — Il Mastro della Gilda, JSON's Quest
                    </p>
                </div>
            </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
};

export async function sendOrderConfirmationEmail(orderData) {
    const productsList = orderData.products
    .map(
        (product) => `
            <tr>
                <td style="padding: 10px 8px; border-bottom: 1px solid #d9c9a3; color: #3a2c1a; font-size: 14px; font-family: Georgia, serif;">
                    ${product.name}
                </td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #d9c9a3; color: #3a2c1a; font-size: 14px; font-family: Georgia, serif; text-align: center;">
                    x${product.quantity}
                </td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #d9c9a3; color: #3a2c1a; font-size: 14px; font-family: Georgia, serif; text-align: right;">
                    ${Number(product.line_total).toFixed(2)} €
                </td>
            </tr>
        `
    )
    .join("");

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: orderData.mail,
        subject: `📦 Ordine confermato — ${orderData.order_number} | JSON's Quest`,
        text: `Ciao ${orderData.customer_name},

Il tuo ordine ${orderData.order_number} è stato registrato negli archivi della Gilda.

Totale ordine: ${orderData.total.toFixed(2)} €

Grazie per aver scelto JSON's Quest.

— Il Mastro della Gilda`,
        html: `
            <div style="background-color: #1a1a2e; padding: 40px 20px; font-family: Georgia, 'Times New Roman', serif;">
                <div style="max-width: 520px; margin: 0 auto; background-color: #f4ecd8; border: 2px solid #c9a86a; border-radius: 8px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">

                    <p style="text-align: center; font-size: 28px; margin: 0 0 8px;">📦</p>

                    <h1 style="text-align: center; color: #5a3e1b; font-size: 24px; margin: 0 0 24px; letter-spacing: 0.5px;">
                        Ordine confermato!
                    </h1>

                    <p style="color: #3a2c1a; font-size: 16px; line-height: 1.6;">
                        Ciao ${orderData.customer_name},
                    </p>

                    <p style="color: #3a2c1a; font-size: 16px; line-height: 1.6;">
                        La Gilda di JSON's Quest ha ricevuto correttamente il tuo ordine. La tua pergamena d'acquisto è stata registrata negli archivi del regno.
                    </p>

                    <div style="background-color: #ffffff; border-left: 4px solid #c9a86a; padding: 12px 20px; margin: 24px 0; border-radius: 4px;">
                        <p style="color: #3a2c1a; font-size: 15px; margin: 0;">
                            <strong>Numero ordine:</strong> ${orderData.order_number}
                        </p>
                    </div>

                    <h2 style="color: #5a3e1b; font-size: 18px; margin: 24px 0 12px; border-bottom: 2px solid #c9a86a; padding-bottom: 8px; font-family: Georgia, serif;">
                        Riepilogo artefatti
                    </h2>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                        <thead>
                            <tr>
                                <th align="left" style="padding: 8px; color: #5a3e1b; font-size: 12px; text-transform: uppercase; font-family: Georgia, serif; border-bottom: 2px solid #c9a86a;">
                                    Artefatto
                                </th>
                                <th align="center" style="padding: 8px; color: #5a3e1b; font-size: 12px; text-transform: uppercase; font-family: Georgia, serif; border-bottom: 2px solid #c9a86a;">
                                    Qtà
                                </th>
                                <th align="right" style="padding: 8px; color: #5a3e1b; font-size: 12px; text-transform: uppercase; font-family: Georgia, serif; border-bottom: 2px solid #c9a86a;">
                                    Subtotale
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productsList}
                        </tbody>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #5a3e1b; border-radius: 4px;">
                        <tr>
                            <td style="padding: 16px 20px; color: #f4ecd8; font-size: 16px; font-family: Georgia, serif;">
                                Totale ordine
                            </td>
                            <td align="right" style="padding: 16px 20px; color: #f4ecd8; font-size: 20px; font-family: Georgia, serif;">
                                <strong>${orderData.total.toFixed(2)} €</strong>
                            </td>
                        </tr>
                    </table>

                    <p style="color: #3a2c1a; font-size: 14px; line-height: 1.6; margin-top: 24px;">
                        Riceverai presto ulteriori aggiornamenti sulla spedizione del tuo equipaggiamento.
                    </p>

                    <div style="background-color: #ffffff; border-radius: 6px; padding: 16px; margin-top: 16px; text-align: center;">
                        <p style="color: #3a2c1a; font-size: 14px; line-height: 1.6; margin: 0 0 12px;">
                            🛠️ I nostri goblin dell'officina stanno già lavorando duramente per preparare il tuo ordine. Sono lenti, disordinati e rubano sempre qualche bullone di troppo, ma sul lavoro ci metton il cuore (e qualche morso, occasionalmente).
                        </p>

                        <img
                            src="https://raw.githubusercontent.com/bingiulioliu/project-work-backend/refs/heads/master/public/img/working-goblins.png"
                            alt="I goblin dell'officina al lavoro"
                            width="400"
                            style="max-width: 100%; height: auto; border-radius: 4px; display: block; margin: 0 auto;"
                        />
                    </div>

                    <p style="text-align: center; color: #8a7a5c; font-size: 13px; margin-top: 32px; border-top: 1px solid #d9c9a3; padding-top: 16px;">
                        — Il Mastro della Gilda, JSON's Quest
                    </p>
                </div>
            </div>
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