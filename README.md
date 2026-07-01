# JSON's Quest — Backend

> API REST per **JSON's Quest**, l'e-commerce a tema fantasy/RPG. Espone i dati di prodotti, categorie e ordini, gestisce l'invio email e integra un assistente AI conversazionale. Consumato dal frontend React ([repo separata](../project-work-frontend)).

---

## 📐 Stack tecnologico

| Ambito | Tecnologia |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework HTTP | [Express](https://expressjs.com/) 5 |
| Database | MySQL ([`mysql2`](https://www.npmjs.com/package/mysql2)) |
| AI | [LangChain](https://www.npmjs.com/package/langchain) + [`@langchain/anthropic`](https://www.npmjs.com/package/@langchain/anthropic) (Claude) |
| Validazione | [Zod](https://www.npmjs.com/package/zod) |
| Email | [Nodemailer](https://www.npmjs.com/package/nodemailer) |
| CORS | [`cors`](https://www.npmjs.com/package/cors) |
| Package manager | pnpm |

## 🗂️ Struttura del progetto

```
project-work-backend/
├── src/
│   ├── controllers/       # Logica di gestione delle richieste HTTP
│   ├── db/
│   │   ├── connections/   # Configurazione connessione al database
│   │   ├── dumps/         # Dump SQL per popolamento/reset del DB
│   │   └── migrations/    # Migrazioni dello schema del database
│   ├── middlewares/       # Middleware Express
│   ├── routers/           # Definizione delle rotte REST
│   ├── services/          # Logica di business e integrazioni esterne (AI, email)
│   └── utils/              # Funzioni di utilità condivise
├── server.js               # Entry point dell'applicazione
├── package.json
├── pnpm-lock.yaml
└── .env.example
```

## 🚀 Setup rapido

```bash
pnpm install
cp .env.example .env
pnpm start      # avvio standard
pnpm watch      # avvio con hot-reload (node --watch)
```

Il server usa `node --env-file=.env`, quindi **non serve `dotenv`**: le variabili in `.env` vengono caricate nativamente da Node.js all'avvio.

## 🛣️ Rotte principali

Montate in `server.js`:

| Base path | Router |
|---|---|
| `/products` | `productsRouter` |
| `/categories` | `categoriesRouter` |
| `/orders` | `ordersRouter` |
| `/ai` | `aiRouter` |
| `/newsletter` | `newsletterRouter` |

Elenco completo degli endpoint in [`docs/API.md`](docs/API.md).

## 📚 Documentazione

| Documento | Contenuto |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Pattern Router → Controller → Service, flusso richieste, integrazione col frontend |
| [`docs/API.md`](docs/API.md) | Elenco completo degli endpoint REST |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Schema dati, tabelle e relazioni |
| [`docs/AI-ASSISTANT.md`](docs/AI-ASSISTANT.md) | Funzionamento del chatbot AI (LangChain + Anthropic) |
| [`docs/SETUP.md`](docs/SETUP.md) | Variabili ambiente e comandi in dettaglio |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Motivazioni delle principali scelte tecniche |

---

## 👥 Team

| Nome  | GitHub ||
|---|---|---|
| Alessia di Ruggero | [@rAel-Ael](https://github.com/rAel-Ael) |
| Alessia Smeraglia | [@alessiaasmeraglia](https://github.com/alessiaasmeraglia) |
| Bin Giulio Liu | [@bingiulioliu](https://github.com/bingiulioliu) |
| Giovanni Ghinet | [@Giovanni-Ghinet](https://github.com/Giovanni-Ghinet) |
| Marco Fiordi | [@MarcoFiordi](https://github.com/MarcoFiordi) |