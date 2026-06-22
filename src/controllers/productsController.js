import connection from "../db/connections/connection.js";

async function index(request, response) {

    const query = `
    select name, slug, price, rarity, image
    from products
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
            message: "Errore durante il recupero dei prodotti",
        });
    }
};

async function show(request, response) {
    const { slug } = request.params;

    const query = `
        select id, name, slug, description, price, rarity, image
        from products p
        where p.slug = ?
    `;

    try {
        const [rows] = await connection.execute(query, [slug]);

        // se array vuoto
        if (rows.length === 0) {
            return response.status(404).json({
                error: 'Prodotto non trovato',
                results: null
            });
        }

        // se il prodotto esiste
        const product = rows[0];

        // query per le categorie
        const queryCategories = `
        select c.name, c.slug
        from category_product cp
            join categories c
                on cp.category_id = c.id
        where cp.product_id = ?
        `;

        // qui uso l'id del prodotto, non lo slug della rotta
        const [categories] = await connection.execute(queryCategories, [product.id]);

        // al prodotto attacco le categorie associate
        product.categories = categories;

        response.json({
            error: null,
            results: product
        });

    } catch (error) {
        response.status(500).json({
            error: 'È successo qualcosa',
            results: null
        });
        console.log(error);
    }
};

async function rarest(request, response) {
    const query = `
        SELECT name, slug, price, rarity, image
        FROM products
        ORDER BY 
            CASE rarity
                WHEN 'legendary' THEN 3
                WHEN 'rare' THEN 2
                WHEN 'common' THEN 1
                ELSE 0
            END DESC
        LIMIT 5
    `;

    try {
        const [rows] = await connection.query(query);

        response.json({
            error: null,
            results: rows
        });

    } catch (error) {
        console.error(error);

        response.status(500).json({
            error: "Internal Server Error",
            message: "Errore durante il recupero dei prodotti più rari",
        });
    }
}


export { index, show, rarest };