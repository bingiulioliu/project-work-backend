import connection from "../db/connections/connection.js";

async function index(request, response) {

    const query = `
    select 
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_address,
        o.customer_city,
        p.name as product_name,
        p.image,
        op.quantity,
        op.price as unit_price
    from orders o
    left join order_product op on o.id = op.order_id
    left join products p on op.product_id = p.id
    order by o.order_number
    `;

    try {

        const [rows] = await connection.query(query);

        // Raggruppa i risultati per ordine
        const orders = {};

        rows.forEach(row => {
            const { id, order_number, customer_name, customer_address, customer_city, product_name, price, image, quantity, unit_price } = row;

            if (!orders[order_number]) {
                orders[order_number] = {
                    id,
                    order_number,
                    customer_name,
                    customer_address,
                    customer_city,
                    products: []
                };
            }

            // Aggiungi il prodotto solo se esiste
            if (product_name) {
                orders[order_number].products.push({
                    name: product_name,
                    price: Number(price),
                    image,
                    quantity: Number(quantity),
                    unit_price: Number(unit_price),
                    line_total: Number(quantity) * Number(unit_price)
                });
            }
        });

        const results = Object.values(orders);

        response.json({
            error: null,
            results: results
        })

    } catch (error) {
        console.error(error);

        response.status(500).json({
            error: "Internal Server Error",
            message: "Errore durante il recupero degli ordini",
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
            select p.name, p.image, op.quantity, o.order_number, o.customer_name, op.price as unit_price, round(op.quantity * op.price, 2) as line_total
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
    const { customer_name, customer_address, customer_city, order_number, mail, products} = request.body;

    if (!customer_name || !customer_address || !customer_city || !order_number || !mail) {
        return response.status(400).json({
            error: 'Dati mancanti',
            results: null,
            message: 'customer_name, customer_address, customer_city, mail e order_number sono obbligatori'
        });
    }

    const query = `
        insert into orders (
            order_number,
            customer_name,
            customer_address,
            customer_city,
            mail,
            customer_postal_code,
            notes,
            telephone_number,
            created_at,
            updated_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, now(), now())
    `;

    const values = [
        order_number,
        customer_name,
        customer_address,
        customer_city,
        mail,
        '',
        '',
        ''
    ];

    try {
        const [result] = await connection.execute(query, values);
        const orderId = result.insertId;

        let orderProducts = [];

        // Se ci sono prodotti, aggiungili all'ordine
        if (products && Array.isArray(products) && products.length > 0) {
            for (const product of products) {
                const { product_id, quantity } = product;

                if (!product_id || !quantity) {
                    return response.status(400).json({
                        error: 'Dati prodotto mancanti',
                        results: null,
                        message: 'Ogni prodotto deve avere product_id e quantity'
                    });
                }

                // Recupera i dati del prodotto
                const [productData] = await connection.execute(
                    'select id, name, price, image from products where id = ?',
                    [product_id]
                );

                if (productData.length === 0) {
                    return response.status(404).json({
                        error: 'Prodotto non trovato',
                        results: null,
                        message: `Prodotto con id ${product_id} non esiste`
                    });
                }

                const productInfo = productData[0];
                const unitPrice = productInfo.price;

                // Aggiungi il prodotto all'ordine
                const queryInsertProduct = `
                    insert into order_product (order_id, product_id, quantity, price)
                    values (?, ?, ?, ?)
                `;

                await connection.execute(queryInsertProduct, [orderId, product_id, quantity, unitPrice]);

                // Aggiungi i dati del prodotto alla lista
                orderProducts.push({
                    product_id,
                    name: productInfo.name,
                    price: Number(productInfo.price),
                    image: productInfo.image,
                    quantity: Number(quantity),
                    unit_price: Number(unitPrice),
                    line_total: Number(quantity) * Number(unitPrice)
                });
            }
        }

        response.status(201).json({
            error: null,
            results: {
                id: orderId,
                customer_name,
                customer_address,
                customer_city,
                order_number,
                mail,
                products: orderProducts,
                total: orderProducts.reduce((sum, p) => sum + p.line_total, 0)
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