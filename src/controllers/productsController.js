import { error } from "console";
import connection from "../db/connections/connection.js";
import { slugify } from "../utils/slugify.js";
import { isValidPrice, isValidRarity, isValidNameLength, isValidDescriptionLength, MIN_NAME_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from "../utils/validations.js";
import { findOrNotFound } from "../utils/findOrNotFound.js";

async function index(request, response) {
    const {
        sort,
        order,
        rarity,
        search,
        category,
        min_price,
        max_price,
        page = 1,
        limit = 12
    } = request.query;

    const currentPage = Math.max(Number(page), 1);
    const productsPerPage = Math.max(Number(limit), 1);
    const offset = (currentPage - 1) * productsPerPage;

    const allowedSorts = {
        price: "p.price",
        name: "p.name",
        rarity: "p.rarity",
        updated_at: "p.updated_at"
    };

    const sortColumn = allowedSorts[sort] || "p.name";
    const sortOrder = order === "desc" ? "DESC" : "ASC";

    const conditions = [];
    const values = [];

    if (rarity) {
        const requestedRarities = rarity.split(',').map(r => r.trim()).filter(Boolean);
        const invalidRarities = requestedRarities.filter(r => !isValidRarity(r));

        if (invalidRarities.length > 0) {
            return response.status(400).json({
                error: "Rarità non valida",
                results: null
            });
        }

        conditions.push(`p.rarity IN (${requestedRarities.map(() => '?').join(', ')})`);
        values.push(...requestedRarities);
    }

    if (search) {
        conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
        values.push(`%${search}%`, `%${search}%`);
    }

    let joinCategory = "";

    if (category) {
        joinCategory = `
            JOIN category_product cp 
                ON cp.product_id = p.id
            JOIN categories c 
                ON c.id = cp.category_id
        `;

        conditions.push("c.slug = ?");
        values.push(category);
    }

    if (min_price) {
        conditions.push("p.price >= ?");
        values.push(Number(min_price));
    }

    if (max_price) {
        conditions.push("p.price <= ?");
        values.push(Number(max_price));
    }

    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const queryProducts = `
        SELECT DISTINCT 
            p.id,
            p.name,
            p.slug,
            p.price,
            p.rarity,
            p.image,
            p.description,
            p.updated_at
        FROM products p
        ${joinCategory}
        ${whereClause}
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT ? OFFSET ?
    `;

    const queryCount = `
        SELECT COUNT(DISTINCT p.id) AS totalProducts
        FROM products p
        ${joinCategory}
        ${whereClause}
    `;

    try {
        const productValues = [
            ...values,
            productsPerPage,
            offset
        ];

        const [rows] = await connection.query(queryProducts, productValues);
        const [countRows] = await connection.query(queryCount, values);

        const totalProducts = countRows[0].totalProducts;
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        response.json({
            error: null,
            results: rows,
            pagination: {
                currentPage,
                totalPages,
                totalProducts,
                limit: productsPerPage
            }
        });

    } catch (error) {
        console.error(error);

        response.status(500).json({
            error: "Internal Server Error",
            message: "Errore durante il recupero dei prodotti",
        });
    }
}

async function show(request, response) {
    const { slug } = request.params;

    try {
        const product = findOrNotFound(
            connection,
            `select id, name, slug, description, price, rarity, image
                from products p
                where p.slug = ?`,
            [slug],
            response,
            'Prodotto non trovato'
        );
        if (!product) return;

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

async function create(request, response) {

    const { name, description, price, rarity } = request.body;

    if (!name || !price || !rarity || !description) {
        return response.status(400).json({
            success: false,
            message: 'Inserire nome, prezzo e rarità'
        });
    }
    if (price <= 0 || isNaN(price)) {
        return response.status(400).json({
            success: false,
            message: 'Inserire un prezzo valido'
        });
    }

    if (name.length > 50 || description.length > 750) {
        return response.status(400).json({
            success: false,
            message: 'Nome o descrizione troppo lunghi'
        });
    }

    if (rarity != 'common' && rarity != 'rare' && rarity != 'legendary') {
        return response.status(400).json({
            success: false,
            message: 'La rarità deve esse common, rare o legendary'
        });
    }

    const slug = slugify(name);
    const image = `${slug}.png`;

    const query = `
    insert into products (name, slug, description, price, rarity, image, created_at, updated_at)
    values (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    try {

        const [result] = await connection.execute(query, [name, slug, description, price, rarity, image]);

        response.status(201).json({
            success: true,
            result: result,
            message: `${name} inserito con successo`
        })

    } catch (error) {
        // Errore duplicati (name, slug e img sono unique)
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({
                success: false,
                message: 'Esiste già un prodotto con questo nome'
            });
        }

        response.status(500).json({
            success: false,
            message: 'Errore durante la creazione del prodotto'
        });
    }
};

async function modify(request, response) {

    const { slug } = request.params;
    const { name, description, price, rarity } = request.body;

    const fields = [];
    const values = [];

    if (name !== undefined) {
        if (name.length > 50) {
            return response.status(400).json({
                success: false,
                message: 'Il nome è troppo lungo'
            });
        }

        if (name.length < 5) {
            return response.status(400).json({
                success: false,
                message: 'Il nome è troppo corto'
            });
        }

        const newSlug = slugify(name);
        const newImage = `${newSlug}.png`;

        fields.push('name = ?', 'slug = ?', 'image = ?');
        values.push(name, newSlug, newImage);
    }

    if (description !== undefined) {
        if (description.length > 750) {
            return response.status(400).json({
                success: false,
                message: 'La descrizione è troppo lunga'
            });
        }
        fields.push('description = ?');
        values.push(description);
    }

    if (price !== undefined) {
        if (price <= 0 || isNaN(price)) {
            return response.status(400).json({
                success: false,
                message: 'Inserire un prezzo valido'
            });
        }
        fields.push('price = ?');
        values.push(price);
    }

    if (rarity !== undefined) {
        const validRarities = ['common', 'rare', 'legendary'];
        if (!validRarities.includes(rarity)) {
            return response.status(400).json({
                success: false,
                message: 'La rarità deve essere common, rare o legendary'
            });
        }
        fields.push('rarity = ?');
        values.push(rarity);
    }

    if (fields.length === 0) {
        return response.status(400).json({
            success: false,
            message: 'Nessun campo da aggiornare'
        });
    }

    fields.push('updated_at = NOW()');
    values.push(slug);

    const query = `
        update products
        set ${fields.join(', ')}
        where slug = ?
    `;

    try {
        const [result] = await connection.execute(query, values);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                success: false,
                message: 'Prodotto non trovato'
            });
        }

        response.json({
            success: true,
            message: 'Prodotto aggiornato con successo'
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({
                success: false,
                message: 'Esiste già un prodotto con questo nome o slug'
            });
        }

        response.status(500).json({
            success: false,
            message: "Errore durante l'aggiornamento del prodotto"
        });
    }
};

async function destroy(request, response) {

    const { slug } = request.params;

    const query = `
        delete from products
        where slug = ?
    `;

    try {
        const [result] = await connection.execute(query, [slug]);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                success: false,
                message: 'Prodotto non trovato'
            });
        }

        response.json({
            success: true,
            message: `Prodotto con slug ${slug} eliminato con successo`
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return response.status(409).json({
                success: false,
                message: 'Non puoi eliminare questo prodotto: è presente in almeno un ordine esistente'
            });
        }

        response.status(500).json({
            success: false,
            message: "Errore durante l'eliminazione del prodotto"
        });
    }
};

// rarest e cheapest hanno lo stesso schema di query, qui estraggo la parte comune
// orderByClause cambia la orderby a seconda delle esigenze
async function getTopProducts(orderByClause){
    const query = `
        select name, slug, price, rarity, image
        from products
        order by ${orderByClause}
        limit 5
    `;

    const [rows] = await connection.execute(query);
    return rows;
};

async function rarest(request, response) {
    try {
        const rows = await getTopProducts(`
            CASE rarity
                WHEN 'legendary' THEN 3
                WHEN 'rare' THEN 2
                WHEN 'common' THEN 1
                ELSE 0
            END DESC
        `);

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
};

async function cheapest(request, response) {
    try {
        const rows = await getTopProducts('price asc');
        response.json({
            error: null,
            results: rows
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            error: "Internal Server Error",
            message: "Errore durante il recupero dei prodotti più economici",
        });
    }
};

async function suggested(request, response) {
    const {slug} = request.params;

    try {
        // Recupero l'id
        const [productRows] = await connection.execute(`
                select id from products where slug = ?
            `, [slug]);

        if (productRows.length === 0 ) {
            return response.status(404).json({
                error: 'Prodotto non trovato',
                results: null
            });
        }

        const productId = productRows[0].id;

        const querySuggested = `
            select distinct p.id, p.name, p.slug, p.price, p.rarity, p.image
            from products p
                join category_product cp on cp.product_id = p.id
            where cp.category_id in (
                select category_id from category_product where product_id = ?)
            and p.id != ?
            order by rand()
            limit 12
        `;

        const [suggested] = await connection.execute(querySuggested, [productId, productId]);

        response.json({
            error: null,
            results: suggested,
            message: 'Prodotti suggeriti caricati'
        });

    } catch(error) {
        response.status(500).json({
            error: 'Errore caricamento prodotti suggeriti',
            results: null
        });
        console.log(error);
    }
};


export { index, show, rarest, cheapest, create, modify, destroy, suggested };