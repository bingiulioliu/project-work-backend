// Se non trovo nulla riporto 404, altrimenti restituisco la prima riga

export async function findOrNotFound(connection, query, params, response, notFoundMessage) {
    const [rows] = await connection.execute(query, params);

    if (rows.length === 0){
        response.status(404).json({
            error: notFoundMessage,
            result: null
        });
        return null;
    }
    
    return rows[0];
};