# Setup — Backend

## Prerequisiti

- Node.js (con supporto a `--env-file`, quindi versione 20.6+ consigliata)
- pnpm (versione `^11.1.3`, come indicato in `devEngines` del `package.json`)
- Un'istanza MySQL raggiungibile
- Una API key Anthropic
- Credenziali SMTP per l'invio email

## Installazione

```bash
pnpm install
cp .env.example .env
```

## Variabili ambiente

File `.env` (basato su `.env.example`):

```env
PORT=
URL=
DB_HOSTNAME=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

HOST=

ANTHROPIC_API_KEY=

SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
SELLER-EMAIL=
```

| Variabile | Descrizione |
|---|---|
| `PORT` | Porta su cui il server Express è in ascolto (default `3000` se non impostata) |
| `HOST` | Host su cui il server è in ascolto (default `localhost` se non impostata) |
| `URL` | URL pubblico dell'applicazione (es. per link nelle email) |
| `DB_HOSTNAME` | Host del database MySQL |
| `DB_PORT` | Porta del database MySQL |
| `DB_USERNAME` | Username per la connessione al database |
| `DB_PASSWORD` | Password per la connessione al database |
| `DB_DATABASE` | Nome del database |
| `ANTHROPIC_API_KEY` | API key per l'integrazione con Claude (Anthropic) |
| `SMTP_HOST` | Host del server SMTP per l'invio email |
| `SMTP_PORT` | Porta del server SMTP |
| `SMTP_SECURE` | Se `true`, usa connessione SMTP sicura (TLS) |
| `SMTP_USER` | Username per l'autenticazione SMTP |
| `SMTP_PASS` | Password per l'autenticazione SMTP |
| `MAIL_FROM` | Indirizzo mittente delle email inviate dal sistema |
| `SELLER-EMAIL` | Indirizzo email del venditore, a cui inviare le notifiche di nuovo ordine |

> ⚠️ **Nota**: `SELLER-EMAIL` usa il trattino invece dell'underscore, a differenza di tutte le altre variabili. In Node.js `process.env['SELLER-EMAIL']` funziona comunque (accesso tramite bracket notation), ma è un'inconsistenza rispetto alla convenzione `SNAKE_CASE` usata ovunque altrove — consigliato rinominarla in `SELLER_EMAIL` per uniformità ed evitare errori di battitura futuri.

## Comandi disponibili

Definiti in `package.json`:

```bash
# Avvio standard
pnpm start

# Avvio con hot-reload (node --watch)
pnpm watch
```

Entrambi i comandi usano `node --env-file=.env`, quindi le variabili ambiente vengono caricate **nativamente da Node.js**, senza bisogno della libreria `dotenv`.

## Package manager

Il progetto richiede **pnpm** (`^11.1.3`), come specificato in `devEngines.packageManager` nel `package.json`. Se pnpm non è installato, alcuni tool lo scaricano automaticamente (`"onFail": "download"`).

## Dipendenze principali

| Pacchetto | Ruolo |
|---|---|
| `express` | Framework HTTP |
| `cors` | Gestione CORS per le richieste dal frontend |
| `mysql2` | Driver MySQL (Promise-based) |
| `langchain`, `@langchain/anthropic`, `@langchain/core` | Integrazione dell'assistente AI |
| `zod` | Validazione degli schemi di input |
| `nodemailer` | Invio email (conferma ordini, newsletter) |

## Avvio completo del progetto (backend + frontend)

```bash
# Terminale 1 — Backend
cd project-work-backend
pnpm install
pnpm start

# Terminale 2 — Frontend
cd project-work-frontend
pnpm install
pnpm dev
```