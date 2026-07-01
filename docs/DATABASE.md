# Database — Backend

## Tecnologia

Database relazionale **MySQL**, gestito tramite [`mysql2`](https://www.npmjs.com/package/mysql2) (driver con supporto Promise, usato per query parametrizzate e transazioni).

La connessione è centralizzata in `src/db/connections/`, configurata tramite variabili ambiente (`DB_HOSTNAME`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`) — vedi [`SETUP.md`](SETUP.md).

## Struttura delle tabelle

| Tabella | Descrizione |
|---|---|
| `products` | Catalogo dei prodotti (slug, nome, descrizione, prezzo, rarità, ecc.) |
| `categories` | Categorie merceologiche (es. Equipaggiamento, Consumabili, Libri & Pergamene) |
| `category_product` | Tabella ponte per la relazione tra prodotti e categorie |
| `orders` | Ordini effettuati |
| `order_product` | Tabella ponte tra ordini e prodotti (righe d'ordine, quantità) |

> Gli script di popolamento per queste tabelle si trovano in `src/db/dumps/` (`categories_dumps.sql`, `category_product_dumps.sql`, `order_product.sql`, `orders.sql`, `products_dumps.sql`), mentre l'evoluzione dello schema è gestita in `src/db/migrations/`.

## Pattern di accesso ai dati

I controller interagiscono con il database seguendo queste regole:

1. **Query parametrizzate** (`?` placeholder) in tutte le query, per evitare SQL injection.
2. **Join** tra `products` e `categories` tramite `category_product` per recuperare prodotti con le rispettive categorie.
3. **Transazioni esplicite** (`beginTransaction`, `commit`, `rollback`) sulla creazione ordini, per mantenere coerenza tra `orders` e `order_product` in caso di errore.

## Accesso ai dati da parte dell'assistente AI

Il service `anthropicService.js` può interrogare lo schema del database per rispondere a domande generiche, ma con guard-rail dedicati (vedi [`AI-ASSISTANT.md`](AI-ASSISTANT.md)):

- solo query `SELECT`;
- nessuno statement multiplo;
- blocco di keyword pericolose (`INSERT`, `UPDATE`, `DELETE`, ecc.);
- whitelist delle tabelle interrogabili;
- `LIMIT` automatico se non specificato nella query generata.

## Non implementato

Nella fase di progettazione erano state previste anche le tabelle `tags` e `product_tag` (filtri dinamici come *Novità*, *Offerta*, *Imperdibili*) e `reviews` (recensioni sui prodotti), poi non realizzate nella versione attuale del progetto. Restano candidate naturali per un'estensione futura (vedi Roadmap nel README principale).

## Nota

Uno schema ER dettagliato (con tutte le colonne e i vincoli di chiave) non è ancora presente in repo — è consigliato aggiungerlo come miglioramento futuro.