Team #3 Json’s sons

### ⚔️ Project Work: JSON's Quest
Concept: L'E-commerce Fantasy per Avventurieri del Web

📖 Visione del Progetto
JSON's Quest è un'applicazione web SPA (Single Page Application) che reinterpreta il concetto di e-commerce classico, trasformandolo nello shop interno di un videogioco RPG o di una campagna di Dungeons & Dragons.
L'interfaccia adotta i pattern di design tipici dei videogiochi (gamification) per far percepire all'utente ogni singolo acquisto non come una fredda transazione finanziaria, ma come la scelta cruciale dell'equipaggiamento necessario per superare le sfide quotidiane.

🎯 Target & Identità del Brand
Nome del Sito: JSON's Quest
Slogan Ufficiale: "Le risposte alle tue API, l'equipaggiamento per le tue battaglie."
Utenti Target: Avventurieri itineranti, maghi alle prime armi, guerrieri stanchi della routine e moderni "eroi del quotidiano".
Categoria Merceologica: Accessori e articoli per il benessere quotidiano, reinterpretati in chiave High Fantasy (es. Cuscino dell'Invisibilità per riposini rigeneranti, Pozione della Focalizzazione al gusto caffè, Tazza del Mana Termica).
Sentiment & Tono di Voce:
Immersivo e Avventuroso: Grafica e copywriting trasportano l'utente direttamente in una taverna fantasy o davanti al bancone di un mercante.
Ironico e Leggero: Ricco di battute che fondono i cliché dei GDR con i drammi dello sviluppo software e della vita moderna.
Chiaro e Affidabile: L'esperienza d'acquisto (UX), i filtri e il checkout rimangono estremamente intuitivi.

🛠️ Architettura Dati (Database & Rotte)
Il backend si appoggia su una struttura solida a 8 tabelle, ottimizzata per gestire le relazioni logiche senza sovraccaricare il workflow dei developer:
Struttura DB
products: Il catalogo degli artefatti (gestito tramite slug puliti e descrizioni "flavour text").
categories: Equipaggiamento, Consumabili, Libri & Pergamene (Relazione $1:N$ con i prodotti).
tags: Filtri dinamici di gioco come Novità, Offerta, Imperdibili o Vita Quotidiana (Relazione $N:N$ con i prodotti).
product_tag: Tabella ponte per la relazione $N:N$ dei tag.
reviews: Le pergamene dei feedback lasciate dagli avventurieri precedenti.

🗺️ Mappa dell'Applicazione (Pagine & Funzionalità)
📌 Milestone Obbligatorie (Il Core Core del Gioco)
Homepage ("La Piazza del Mercato"): Spazio Hero immersivo e sezioni vetrina dedicate ai prodotti più caldi (es. "Ultimi Arrivi dalla Gilda", "Offerte del Mercante").
Pagina di Ricerca ("Esplora la Mappa"): Catalogo completo con filtri avanzati per categoria e ordinamento (prezzo in Monete d'Oro, rarità, novità).
Dettaglio Prodotto ("Analisi dell'Artefatto"): Pagina ricca di dettagli e "lore" sull'oggetto, con statistiche ironiche ed effetto zoom sull'equipaggiamento.
Carrello ("Lo Zaino del Viandante"): Gestione dinamica delle quantità prima di partire per la missione.
Checkout ("Il Banco del Pegno"): Inserimento dati di spedizione, fatturazione e riepilogo dell'oro da spendere.
Invio Email ("Corvo"): Sistema automatizzato di conferma ordine per acquirente e venditore.

🌟 Milestone Extra Selezionate (Totale: 10 Punti)
Per arricchire l'esperienza di gioco e completare i requisiti tecnici, il team ha implementato le seguenti funzionalità:
Pop-up di Benvenuto (Punti: 3) — L'Incontro con l'NPC: Un personaggio non giocante (un vecchio saggio o un mercante logorroico) accoglie l'utente al suo primo ingresso nel sito, offrendo una pergamena con un codice sconto speciale.
Wishlist (Punti: 2) — Il Libro dei Desideri: Consente agli avventurieri di salvare gli equipaggiamenti epici o le pozioni più costose in una lista dei desideri personalizzata, per poterli acquistare nelle missioni successive.
Assistente AI (Punti: 5) — La Sfera di Cristallo: Un assistente virtuale intelligente integrato nell'interfaccia. Agisce come un "Master" o un famiglio magico, guidando l'utente nella scelta del prodotto ideale in base alle risposte fornite in chat.

### Integrazione Anthropic con LangChain (Backend)

Per usare l'assistente AI via API:

1. Aggiungi queste variabili nel file `.env`:

```env
ANTHROPIC_API_KEY=la_tua_chiave
ANTHROPIC_MODEL=claude-3-5-haiku-20241022
```

`ANTHROPIC_MODEL` e' opzionale.

2. Avvia il backend:

```bash
pnpm start
```

3. Chiama l'endpoint:

```http
POST /ai/assistant
Content-Type: application/json

{
	"message": "Parlami di questo prodotto",
	"sessionId": "product-detail-session",
	"productSlug": "tazza-del-mana-termica"
}
```

`productSlug` (oppure `productId`) e' opzionale: se presente, l'assistente risponde solo in base al prodotto passato nel contesto.

Risposta attesa:

```json
{
	"error": null,
	"result": "...risposta del modello..."
}
```

---

## Guida Tecnica Completa (Backend + Frontend)

Questa sezione e' pensata per spiegare il progetto in modo semplice durante un colloquio.

## 1) Architettura generale

Il progetto e' diviso in due applicazioni separate:

- Frontend: React + Vite (interfaccia utente)
- Backend: Express + MySQL (API e logica server)

Flusso principale:

1. L'utente interagisce dal frontend (catalogo, carrello, checkout, chatbot).
2. Il frontend chiama le API REST del backend.
3. Il backend legge/scrive dati su MySQL.
4. Alcune azioni attivano servizi esterni:
	 - invio email (newsletter e conferma ordine)
	 - risposta AI (Anthropic via LangChain)

## 2) Backend spiegato in modo chiaro

### Avvio server

Il file `server.js`:

- crea app Express
- abilita CORS (`app.use(cors())`)
- abilita parsing JSON (`app.use(express.json())`)
- espone static assets (`app.use(express.static('public'))`)
- registra le rotte:
	- `/products`
	- `/categories`
	- `/orders`
	- `/newsletter`
	- `/ai`

### Organizzazione cartelle backend

- `src/routers`: definisce gli endpoint
- `src/controllers`: contiene la logica delle richieste
- `src/services`: integra AI e email
- `src/db`: connessione DB, dump e migrazioni
- `src/utils`: validazioni e helper

### Endpoint principali

- Prodotti:
	- `GET /products`
	- `GET /products/rarest`
	- `GET /products/cheapest`
	- `GET /products/:slug`
	- `GET /products/:slug/suggested`
	- `POST /products`
	- `PATCH /products/:slug`
	- `DELETE /products/:slug`
- Categorie:
	- `GET /categories`
	- `GET /categories/:slug`
- Ordini:
	- `GET /orders`
	- `GET /orders/:order_number`
	- `POST /orders`
	- `PUT /orders/:order_number`
	- `DELETE /orders/:order_number`
- Newsletter:
	- `POST /newsletter`
- AI:
	- `GET /ai/assistant/preset-questions`
	- `POST /ai/assistant`

## 3) Frontend spiegato in modo chiaro

Il frontend e' una SPA React con Router.

### Rotte principali (in `src/App.jsx`)

- `/` home
- `/products` catalogo
- `/products/:slug` dettaglio prodotto
- `/chi-siamo`
- `/preferiti`
- `/cart`
- `/checkout`
- `*` not found

### Stato globale

Usa Context API per:

- tema
- wishlist
- carrello
- newsletter

### Chatbot lato frontend

La chat usa:

- `src/components/ChatbotWidget.jsx` per UI e interazione
- `src/utils/chatWithJsonny.js` per chiamare il backend

Comportamento importante:

- genera e salva una sessione locale (`jsonny_session_id`)
- se sei nel dettaglio prodotto, passa `productSlug`
- carica domande preimpostate da `/ai/assistant/preset-questions`
- usa fallback locale se l'endpoint non risponde

## 4) Cosa abbiamo fatto (parte AI, ultima evoluzione)

Abbiamo implementato e rifinito una logica mirata nel backend (`src/services/anthropicService.js`) per garantire risposte consistenti su 4 domande chiave.

### 4.1 Domande preimpostate gestite sempre

Domande:

1. `che prodotti vendi?`
2. `parlami di json's quest`
3. `quali categorie ci sono`
4. `cosa fa il bastone tra le ruote`

Dettaglio tecnico:

- normalizzazione input (`normalizePresetPrompt`) per gestire maiuscole, accenti, apostrofi e punteggiatura
- riconoscimento intent (`getPresetIntent`)
- risposta preset prioritaria prima del flusso AI generico

### 4.2 Contenuto risposte preset

- prodotti: elenco fino a 50 prodotti dal DB (`SELECT ... FROM products ... LIMIT 50`)
- categorie: elenco categorie dal DB
- bastone tra le ruote: ricerca prodotto dedicata e risposta descrittiva
- parlami di JSON's Quest: risposta narrativa creativa coerente col brand

### 4.3 Personalizzazioni richieste

- aggiunte emoji nelle risposte
- formattazione piu' leggibile (titolo + elenco + chiusura)
- rimossi i link dalle risposte AI (ora solo testo pulito)

## 5) Comandi utili (quelli da mostrare a colloquio)

## 5.1 Setup iniziale

```bash
# Backend
cd project-work-backend
pnpm install

# Frontend
cd ../project-work-frontend
pnpm install
```

## 5.2 Avvio in sviluppo

```bash
# Terminale 1 - Backend
cd project-work-backend
pnpm start

# alternativa backend in watch
pnpm watch

# Terminale 2 - Frontend
cd ../project-work-frontend
pnpm dev
```

## 5.3 Qualita' e build frontend

```bash
cd project-work-frontend
pnpm lint
pnpm build
pnpm preview
```

## 5.4 Test veloce endpoint AI da terminale

```bash
curl -X POST http://localhost:3000/ai/assistant \
	-H "Content-Type: application/json" \
	-d '{"message":"che prodotti vendi?","sessionId":"demo-colloquio"}'
```

## 6) Variabili ambiente fondamentali

## 6.1 Backend (`project-work-backend/.env`)

```env
PORT=3000
HOST=localhost

DB_HOSTNAME=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=...
DB_DATABASE=...

SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=...
SELLER_EMAIL=...

ANTHROPIC_API_KEY=...
```

## 6.2 Frontend (`project-work-frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CHAT_ENDPOINT=/ai/assistant
VITE_CHAT_PRESET_ENDPOINT=/ai/assistant/preset-questions
```

## 7) Come raccontarlo bene a colloquio

Sequenza consigliata in 60-90 secondi:

1. "Abbiamo separato frontend React e backend Express, con DB MySQL."
2. "Il frontend gestisce UX e stato globale, il backend espone API e integra servizi esterni."
3. "Per la chat AI abbiamo implementato domande preset con riconoscimento robusto e risposte controllate su dati reali."
4. "Abbiamo reso le risposte piu' leggibili con emoji e testo curato, ma senza link per mantenere output pulito."
5. "Il sistema resta estendibile: nuove domande preset si aggiungono facilmente nel service AI."

## 8) Valore tecnico del lavoro fatto

- migliore prevedibilita' delle risposte AI su intent critici
- migliore UX (risposte piu' chiare e immediate)
- integrazione stretta tra contesto prodotto e conversazione
- struttura modulare e manutenibile (router/controller/service)