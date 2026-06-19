import connection from "../db/connections/connection.js";

async function index(request, response) {

    const query = `
    select customer_name, customer_address, customer_city, order_number
    from orders
    `;

    try {

        const [rows] = await connection.query(query);

        response.json({
            error: null,
            results: rows
        })

    } catch (error) {
        console.error(error);

        response.status(500).json({
            error: "Internal Server Error",
            message: "Errore durante il recupero delle categorie",
        });
    }
};

async function show (request, response) {
    const { order_number } = request.params;

    const query = `
        select id, order_number customer_name, customer_address, customer_city, customer_postal_code, telephone_number, mail, created_at
        from orders o
        where o.order_number = ?
    `;

    try {
        const [rows] = await connection.execute(query, [order_number]);

        // se array vuoto
        if (rows.length === 0) {
            return response.status(404).json({
                error: 'Ordine non trovata',
                results: null
            });
        }

        // se l'ordine esiste
        const order = rows[0];

        // query per i prodotti associati
        const queryProducts = `
            select p.name, p.price, p.image, op.quantity, o.order_number, o.customer_name
            from order_product op
                join products p
                    on op.product_id = p.id
                join orders o
                    on op.order_id = o.id
            where op.order_id = 8;
        `;

        // associo i prodotti
        const [products] = await connection.execute(queryProducts, [order.id]);

        order.product = products;

        response.json({
            error: null,
            results: order
        });

    } catch (error) {
        response.status(500).json({
            error: 'È successo qualcosa',
            results: null
        });
        console.log(error);
    }
};

export { index, show }