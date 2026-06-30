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

## 9) Perche' il codice e' stato fatto cosi'

Questa parte serve a spiegare le scelte tecniche, non solo cosa fa il sistema.

### 9.1 Separazione per responsabilita'

Abbiamo separato Router, Controller e Service per ridurre accoppiamento e aumentare manutenibilita'.

- Router: mappa URL -> funzione
- Controller: valida input e costruisce risposta HTTP
- Service: contiene logica di business e integrazioni esterne

Perche' e' utile:

1. Cambiare un endpoint senza toccare logica AI/email.
2. Testare la logica in modo piu' isolato.
3. Scalare il progetto con nuove feature senza file monolitici.

### 9.2 Perche' il chatbot e' stato progettato con fallback e regole

Nel mondo reale i modelli AI possono rispondere in modo non sempre coerente. Per questo abbiamo introdotto:

- domande preset ad alta priorita'
- normalizzazione robusta dell'input utente
- query SQL controllate e sicure
- fallback quando il piano AI non e' sufficiente

Obiettivo: rendere la UX prevedibile sulle domande business-critical (prodotti, categorie, informazioni store).

### 9.3 Perche' abbiamo usato sessione e contesto prodotto

Nel widget chat ogni utente ha un `sessionId`, e in pagina prodotto si usa anche `productSlug`.

Motivazione:

- mantenere continuita' conversazionale
- dare risposte pertinenti al prodotto aperto
- evitare suggerimenti generici quando l'utente e' su un item specifico

### 9.4 Perche' niente link nelle risposte preset

In fase di refinement abbiamo tolto i link per avere output:

- piu' pulito e leggibile in chat
- piu' semplice da raccontare e verificare in demo
- meno rumoroso su risposte lunghe (es. elenco 50 prodotti)

## 10) Come funziona il codice (end-to-end)

### 10.1 Flusso richiesta chat

1. Il frontend (`ChatbotWidget`) raccoglie il messaggio.
2. `chatWithJsonny` fa POST a `/ai/assistant`.
3. `aiController.assistant` valida input e prepara il contesto (`sessionId`, `productSlug`, `productId`).
4. `askAnthropic` nel service decide il percorso:
	- domanda preset -> risposta immediata da regole + DB
	- domanda su prodotto -> risposta confinata al prodotto
	- domanda generale -> piano AI + query SQL safe + risposta finale
5. Il backend restituisce JSON con `result`.
6. Il frontend estrae il testo e lo mostra in chat.

### 10.2 Flusso domande preset

Algoritmo sintetico:

1. normalizza testo (minuscole, apostrofi, punteggiatura)
2. identifica intent (`products`, `about_store`, `categories`, `bastone`)
3. esegue query DB dedicata se necessaria
4. costruisce risposta formattata con emoji
5. salva risposta nello storico sessione

Questo evita variabilita' non desiderata del modello su domande standard.

### 10.3 Sicurezza e affidabilita' query

Per la parte AI data-driven abbiamo messo guard-rail:

- solo query SELECT
- blocco statement multipli
- blocco keyword pericolose (`insert`, `update`, `delete`, ...)
- whitelist tabelle consentite
- `LIMIT` automatico se assente

Perche': prevenire query dannose e controllare costi/tempi di risposta.

### 10.4 Come il frontend rende robusta la risposta

`chatWithJsonny.js` prova a leggere il testo in modi diversi (`result`, `message`, `reply`, strutture annidate).

Perche': backend e provider AI possono restituire payload con shape differenti; cosi' la UI resta stabile.

## 11) Pitch tecnico pronto per colloquio (2 minuti)

"Abbiamo realizzato una SPA React con backend Express su MySQL, organizzata in modo modulare con router-controller-service. La parte piu' interessante e' il chatbot: non e' solo una chiamata al modello, ma un flusso ibrido con regole, contesto e query SQL sicure. Abbiamo gestito 4 domande preset in modo deterministico per garantire coerenza business, mantenendo comunque la flessibilita' AI per domande aperte. Sul frontend abbiamo sessione persistente, domande preset caricate da API e parsing robusto delle risposte. Il risultato e' una chat piu' affidabile, leggibile e facile da evolvere." 

## 12) Collegamento con database (come funziona davvero)

Il backend usa MySQL tramite mysql2/promise.

Punto di ingresso DB:

- `src/db/connections/connection.js` crea una connessione con variabili ambiente (`DB_HOSTNAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_PORT`).

Pattern usato nel codice:

1. I controller importano la connessione.
2. Eseguono query SQL parametrizzate (`?`) per evitare SQL injection.
3. Restituiscono JSON coerente (`error`, `results`, `message`).

Casi importanti:

- prodotti e categorie usano join con `category_product`
- ordini usano transazioni (`beginTransaction`, `commit`, `rollback`)
- AI legge schema DB e usa query SELECT protette con whitelist tabelle

Perche' questa scelta e' corretta:

1. Connessione centralizzata e facile da mantenere.
2. Query esplicite e leggibili in fase di debug.
3. Transazioni sugli ordini evitano inconsistenze tra ordine e righe prodotto.

## 13) Collegamento backend <-> frontend

Comunicazione via HTTP JSON.

Flusso tipico pagina catalogo:

1. Frontend chiama `/products` con filtri in querystring.
2. Backend costruisce query dinamica con validazioni.
3. Backend risponde con `results + pagination`.
4. Frontend aggiorna stato e URL (search params) per mantenere filtri condivisibili.

Flusso tipico checkout:

1. Frontend costruisce payload ordine da carrello locale.
2. POST a `/orders`.
3. Backend valida, salva ordine in transazione, invia email cliente/venditore.
4. Frontend mostra conferma con numero ordine e totale.

Flusso tipico chatbot:

1. Frontend invia messaggio a `/ai/assistant`.
2. Backend interpreta intent e contesto prodotto.
3. Se domanda preset, risposta immediata controllata.
4. Altrimenti usa pipeline AI + DB.
5. Frontend mostra la risposta markdown-friendly.

## 14) Descrizione completa codice backend (mappa per colloquio)

### 14.1 Router

- `productsRouter`: CRUD prodotti, cheapest, rarest, suggested.
- `categoriesRouter`: elenco e dettaglio categoria.
- `ordersRouter`: elenco, dettaglio, creazione, modifica, cancellazione ordini.
- `newsletterRouter`: iscrizione newsletter.
- `aiRouter`: preset questions + assistant endpoint.

### 14.2 Controller

- `productsController`:
	- filtri combinabili (search, category, rarity, min/max price)
	- ordinamento sicuro tramite mappa campi consentiti
	- paginazione server-side
	- validazione create/modify con utility dedicate
- `categoriesController`:
	- lista categorie
	- dettaglio categoria con prodotti associati
- `ordersController`:
	- normalizza risultato ordini in struttura leggibile
	- creazione ordine con transazione DB
	- verifica esistenza prodotti e calcolo totale
	- invio email non bloccante (gestisce eventuali errori SMTP senza annullare ordine)
- `newsletterController`:
	- validazione email minima
	- invio email di benvenuto con gestione errore
- `aiController`:
	- input validation
	- recupero contesto prodotto da `productSlug`/`productId`
	- forza modalità DB su preset
	- ritorna anche elenco domande preimpostate

### 14.3 Service

- `anthropicService`:
	- caching schema DB
	- storico conversazione per sessione
	- intent detection preset (4 domande)
	- fallback query generation
	- SQL safety checks (solo SELECT, una query, tabelle whitelist, LIMIT)
	- risposta finale basata su dati reali
- `emailService`:
	- template HTML/TXT per newsletter e ordini
	- invio mail cliente e notifica venditore

### 14.4 Utility

- `validateProducts`, `validateOrders`: regole di validazione dominio
- `slugify`: slug SEO e naming immagini
- `findOrNotFound`: helper per semplificare 404 da query
- `mailer`: configurazione transporter nodemailer

## 15) Descrizione completa codice frontend (mappa per colloquio)

### 15.1 Bootstrap e routing

- `main.jsx`: monta app React.
- `App.jsx`: definisce router e provider globali.
- `MainLayout.jsx`: layout condiviso tra pagine.

### 15.2 Pagine

- `HomePage`: hero + sezioni prodotti evidenza (rarest/cheapest).
- `ProductsList`: filtri, ordinamento, paginazione, sync con URL.
- `ProductDetails`: dettaglio prodotto + suggeriti + azioni carrello/wishlist.
- `Cart`: gestione inventario utente e quantity controls.
- `Checkout`: form ordine, invio API, stato successo/errore.
- `Wishlist`: lista desideri persistente.
- `ChiSiamo`, `NotFound`: contenuto istituzionale e fallback route.

### 15.3 Components

- `Header`, `Footer`: navigazione e link rapidi.
- `ProductCard`: card riusabile con CTA e stato wishlist/cart.
- `SuggestedProducts`: blocco correlati.
- `NewsletterBanner`: iscrizione newsletter.
- `ChatbotWidget`:
	- sessione locale persistente
	- loading domande preset da API
	- invio messaggi con contesto route prodotto
	- rendering markdown con remark-gfm
	- UX avanzata (drag widget, close outside, scroll gestione)

### 15.4 Context e Hook

- `CartContext`: persistenza localStorage, totali, quantità.
- `WishlistContext`: preferiti persistenti.
- `ThemeContext`: gestione tema applicazione.
- `NewsletterContext`: stato popup/banner newsletter.
- hook custom (`useCart`, `useWishlist`, `useTheme`, `useNewsletter`) per accesso pulito ai context.

### 15.5 Utility API

- `fetchProducts`, `fetchProduct`, `fetchRarestProducts`, `fetchCheapestProducts`, `fetchSuggestedProducts`.
- `createOrder` per checkout.
- `chatWithJsonny`:
	- endpoint configurabili via env
	- estrazione robusta del testo da payload diversi
	- fallback graceful su errori parsing/response shape

## 16) Perche' questa architettura e' efficace

1. Frontend e backend indipendenti, quindi deploy e scaling separati.
2. Struttura modulare, quindi onboarding rapido di nuovi developer.
3. Query e validazioni lato server, quindi maggiore affidabilita' dati.
4. AI controllata da regole business, quindi migliore coerenza in produzione.
5. UX solida con stato persistente (carrello, wishlist, sessione chat).