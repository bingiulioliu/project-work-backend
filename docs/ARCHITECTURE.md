# Architettura — Backend

## Pattern generale

Il backend segue un'architettura **MVC a livelli**, con una netta separazione delle responsabilità tra i moduli:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Router    │ ───▶ │ Middleware  │ ───▶ │ Controller  │ ───▶ │   Service   │
│ (endpoints) │      │ (auth/val.) │      │ (I/O HTTP)  │      │ (business)  │
└─────────────┘      └─────────────┘      └─────────────┘      └──────┬──────┘
                                                                       │
                                                                       ▼
                                                                ┌─────────────┐
                                                                │  Database   │
                                                                │  (MySQL)    │
                                                                └─────────────┘
```

- **Router** (`src/routers/`): definisce gli endpoint e collega ciascuna rotta al relativo controller.
- **Controller** (`src/controllers/`): gestisce request/response HTTP, valida l'input e delega la logica di business ai service.
- **Service** (`src/services/`): incapsula la logica applicativa e le integrazioni esterne (Anthropic AI, invio email).
- **Utils** (`src/utils/`): funzioni di supporto trasversali (validazione, slugify, gestione errori "not found").
- **DB** (`src/db/`): connessioni al database, migrazioni e dump SQL.

## Bootstrap del server

Il file `server.js` è il punto di ingresso dell'applicazione:

```javascript
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/products', productRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/ai', aiRouter);
app.use('/newsletter', newsletterRouter);

app.listen(port, ...);
```

Cosa fa, in ordine:

1. Istanzia l'app Express.
2. Abilita **CORS**, per permettere le richieste dal frontend su un'origine diversa.
3. Abilita il **parsing automatico del body JSON** (`express.json()`).
4. Espone la cartella `public/` come contenuto statico.
5. Registra i cinque router principali, ciascuno sul proprio base path.
6. Avvia il server sulla porta e host configurati via variabili ambiente (`PORT`, `HOST`).

## Flusso di una richiesta

Esempio: `GET /products?category=pozioni&rarity=leggendario`

1. **Router** (`productsRouter`) instrada la richiesta al controller corretto.
2. **Controller** (`productsController`) legge i query params, li valida e costruisce la query.
3. **Service/DB layer**: la query viene eseguita tramite la connessione MySQL (`mysql2`), con parametri sanificati (`?` placeholder) per evitare SQL injection.
4. Il controller formatta la risposta in JSON coerente (`error`, `results`, eventuale `pagination`).

Per gli **ordini**, la creazione (`POST /orders`) avviene in **transazione** (`beginTransaction` / `commit` / `rollback`), per garantire coerenza tra l'ordine e le relative righe prodotto in caso di errore a metà operazione.

## Comunicazione col frontend

Il backend espone API REST in JSON, consumate dal frontend React tramite `fetch`. CORS è abilitato globalmente (`app.use(cors())`) per permettere le chiamate cross-origin in sviluppo (frontend su Vite, backend su Express, porte diverse).

## Perché questa architettura

1. **Separazione Router/Controller/Service** → si può cambiare un endpoint senza toccare la logica AI o email, e viceversa.
2. **Query parametrizzate ovunque** → protezione nativa da SQL injection.
3. **Transazioni sugli ordini** → nessun ordine "orfano" senza righe prodotto associate, o viceversa.
4. **Validazione centralizzata in `utils/`** (`validateOrders.js`, `validateProducts.js`) → regole di dominio riutilizzabili e testabili in isolamento.