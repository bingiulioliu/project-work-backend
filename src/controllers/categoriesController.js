import connection from "../db/connections/connection.js";

async function index(request, response) {

    const query = `
    select name, description, slug
    from categories
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

async function show(request, response) {
    const { slug } = request.params;

    const query = `
        select id, name, slug, description
        from categories c
        where c.slug = ?
    `;

    try {
        const [rows] = await connection.execute(query, [slug]);

        // se array vuoto
        if (rows.length === 0) {
            return response.status(404).json({
                error: 'Categoria non trovata',
                results: null
            });
        }

        // se la categoria esiste
        const category = rows[0];

        // query per i prodotti associati
        const queryProducts = `
            select p.name, p.slug, p.price, p.rarity, p.image
            from category_product cp
                join products p
                    on cp.product_id = p.id
            where cp.category_id = ?
        `;

        // associo i prodotti
        const [products] = await connection.execute(queryProducts, [category.id]);

        category.product = products;

        response.json({
            error: null,
            results: category
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