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
        select id, order_number, customer_name, customer_address, customer_city, customer_postal_code, telephone_number, mail, created_at
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
            select p.name, p.price, p.image, op.quantity, o.order_number, o.customer_name, op.price as unit_price, (op.quantity * op.price) as line_total
            from order_product op
                join products p
                    on op.product_id = p.id
                join orders o
                    on op.order_id = o.id
            where op.order_id = ?;
        `;

        // associo i prodotti
        const [products] = await connection.execute(queryProducts, [order.id]);

        // in caso ci siano più prodotti nel ordine, sommo
        const orderTotal = products.reduce((sum, row) => sum + Number(row.line_total), 0);

        const orderWithNumbers = products.map(row => ({
            ...row,
            price: Number(row.price),
            unit_price: Number(row.unit_price),
            line_total: Number(row.line_total)
        }));
        
        order.product = orderWithNumbers;
        order.total = orderTotal;

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

async function create(request, response) {
    const { customer_name, customer_address, customer_city, order_number } = request.body;

    if (!customer_name || !customer_address || !customer_city || !order_number) {
        return response.status(400).json({
            error: 'Dati mancanti',
            results: null,
            message: 'customer_name, customer_address, customer_city e order_number sono obbligatori'
        });
    }

    const query = `
        insert into orders (
            order_number,
            customer_name,
            customer_address,
            customer_city,
            customer_postal_code,
            notes,
            telephone_number,
            mail,
            created_at,
            updated_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, now(), now())
    `;

    const values = [
        order_number,
        customer_name,
        customer_address,
        customer_city,
        '',
        '',
        '',
        ''
    ];

    try {
        const [result] = await connection.execute(query, values);

        response.status(201).json({
            error: null,
            results: {
                id: result.insertId,
                customer_name,
                customer_address,
                customer_city,
                order_number
            }
        });
    } catch (error) {
        console.error(error);

        if (error?.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({
                error: 'Ordine già esistente',
                results: null
            });
        }

        response.status(500).json({
            error: 'Errore interno del server',
            results: null
        });
    }
};

async function modify(request, response) {
    const { order_number } = request.params;
    const { customer_name, customer_address, customer_city, new_order_number } = request.body;

    const updates = [];
    const values = [];

    if (customer_name) {
        updates.push('customer_name = ?');
        values.push(customer_name);
    }
    if (customer_address) {
        updates.push('customer_address = ?');
        values.push(customer_address);
    }
    if (customer_city) {
        updates.push('customer_city = ?');
        values.push(customer_city);
    }
    if (new_order_number) {
        updates.push('order_number = ?');
        values.push(new_order_number);
    }

    if (updates.length === 0) {
        return response.status(400).json({
            error: 'Nessun dato aggiornato',
            results: null,
            message: 'Invia almeno uno dei campi customer_name, customer_address, customer_city, new_order_number'
        });
    }

    values.push(order_number);

    const query = `
        update orders
        set ${updates.join(', ')}, updated_at = now()
        where order_number = ?
    `;

    try {
        const [result] = await connection.execute(query, values);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                error: 'Ordine non trovato',
                results: null
            });
        }

        response.json({
            error: null,
            results: {
                order_number: new_order_number || order_number,
                customer_name,
                customer_address,
                customer_city
            }
        });
    } catch (error) {
        console.error(error);

        if (error?.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({
                error: 'order_number già esistente',
                results: null
            });
        }

        response.status(500).json({
            error: 'Errore interno del server',
            results: null
        });
    }
};

async function remove(request, response) {
    const { order_number } = request.params;

    const query = `
        delete from orders
        where order_number = ?
    `;

    try {
        const [result] = await connection.execute(query, [order_number]);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                error: 'Ordine non trovato',
                results: null
            });
        }

        response.status(200).json({
            error: null,
            results: {
                deleted: true,
                order_number
            }
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            error: 'Errore interno del server',
            results: null
        });
    }
};

export { index, show, create, modify, remove }