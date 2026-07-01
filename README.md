# Project Work Backend

Backend RESTful per una piattaforma e-commerce con funzionalità di newsletter e integrazione AI (Anthropic Claude), sviluppato in Node.js secondo un'architettura **MVC a livelli** (Router → Controller → Service → Database).

---

## 📐 Architettura

Il progetto segue una separazione netta delle responsabilità, organizzata in layer indipendenti e testabili:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Router    │ ───▶ │ Middleware  │ ───▶ │ Controller  │ ───▶ │   Service   │
│ (endpoints) │      │ (auth/val.) │      │ (I/O HTTP)  │      │ (business)  │
└─────────────┘      └─────────────┘      └─────────────┘      └──────┬──────┘
                                                                       │
                                                                       ▼
                                                                ┌─────────────┐
                                                                │  Database   │
                                                                │ (connessioni│
                                                                │ /migrations)│
                                                                └─────────────┘
```

- **Router**: definisce gli endpoint e collega ciascuna rotta al relativo controller.
- **Controller**: gestisce request/response HTTP, delega la logica di business ai service.
- **Service**: incapsula la logica applicativa e le integrazioni esterne (es. Anthropic AI, invio email).
- **Utils**: funzioni di supporto trasversali (validazione, slugify, gestione errori "not found").
- **DB**: connessioni al database, migrazioni e dump SQL per il provisioning dei dati.

---

## 🗂️ Struttura del progetto

```
project-work-backend/
├── src/
│   ├── controllers/            # Logica di gestione delle richieste HTTP
│   │   ├── aiController.js
│   │   ├── categoriesController.js
│   │   ├── newsletterController.js
│   │   ├── ordersController.js
│   │   └── productsController.js
│   │
│   ├── db/
│   │   ├── connections/        # Configurazione connessione al database
│   │   ├── dumps/              # Dump SQL per popolamento/reset del DB
│   │   │   ├── categories_dumps.sql
│   │   │   ├── category_product_dumps.sql
│   │   │   ├── order_product.sql
│   │   │   ├── orders.sql
│   │   │   └── products_dumps.sql
│   │   └── migrations/         # Migrazioni dello schema del database
│   │
│   ├── middlewares/            # Middleware Express (auth, error handling, ecc.)
│   │
│   ├── routers/                # Definizione delle rotte REST
│   │   ├── aiRouter.js
│   │   ├── categoriesRouter.js
│   │   ├── newsletterRouter.js
│   │   ├── ordersRouter.js
│   │   └── productsRouter.js
│   │
│   ├── services/                # Logica di business e integrazioni esterne
│   │   ├── anthropicService.js  # Integrazione con le API Anthropic (Claude)
│   │   └── emailService.js      # Invio email transazionali
│   │
│   └── utils/                   # Funzioni di utilità condivise
│       ├── findOrNotFound.js
│       ├── mailer.js
│       ├── slugify.js
│       ├── validateOrders.js
│       └── validateProducts.js
│
├── server.js                    # Entry point dell'applicazione
├── package.json
├── pnpm-lock.yaml
├── .env.example                 # Template delle variabili d'ambiente
└── .gitignore
```

---

## 🧩 Moduli funzionali

| Modulo | Descrizione |
|---|---|
| **Categories** | CRUD delle categorie di prodotto |
| **Products** | CRUD dei prodotti, con validazione dedicata (`validateProducts.js`) |
| **Orders** | Gestione ordini e relazione ordine-prodotto, con validazione dedicata (`validateOrders.js`) |
| **Newsletter** | Iscrizione e invio comunicazioni via `emailService.js` / `mailer.js` |
| **AI** | Endpoint che sfrutta `anthropicService.js` per funzionalità basate su Claude |

---

## 🛠️ Stack tecnologico

- **Runtime**: Node.js
- **Package manager**: pnpm
- **Database**: relazionale (SQL), con connessioni dedicate e migrazioni versionate
- **AI Provider**: Anthropic API (Claude)
- **Email**: servizio di invio email dedicato

---

## 🚀 Getting Started

### Prerequisiti
- Node.js (versione LTS consigliata)
- pnpm
- Un'istanza del database relazionale configurato

### Installazione

```bash
# Clona la repository
git clone <repo-url>
cd project-work-backend

# Installa le dipendenze
pnpm install

# Copia il file di esempio e configura le variabili d'ambiente
cp .env.example .env
```
