# AI Assistant — Backend

L'assistente conversazionale di JSON's Quest ("La Sfera di Cristallo") è integrato tramite **LangChain** + **Anthropic** (Claude), e vive principalmente in `src/services/anthropicService.js` e `src/controllers/aiController.js`.

## Stack

- [`langchain`](https://www.npmjs.com/package/langchain)
- [`@langchain/anthropic`](https://www.npmjs.com/package/@langchain/anthropic)
- [`@langchain/core`](https://www.npmjs.com/package/@langchain/core)

## Configurazione

```env
ANTHROPIC_API_KEY=la_tua_chiave
ANTHROPIC_MODEL=claude-3-5-haiku-20241022   # opzionale
```

## Endpoint

Vedi dettagli richiesta/risposta in [`API.md`](API.md#-ai-assistant--ai).

- `GET /ai/assistant/preset-questions`
- `POST /ai/assistant`

## Architettura del flusso

1. Il frontend invia `message`, `sessionId` e (opzionale) `productSlug`/`productId`.
2. `aiController` valida l'input e recupera il contesto prodotto, se presente.
3. Il service (`askAnthropic`) decide il percorso di risposta:
   - **Domanda preset** → risposta immediata generata da regole + query DB dedicata.
   - **Domanda su un prodotto specifico** → risposta confinata al contesto di quel prodotto.
   - **Domanda generale** → pipeline AI: generazione piano, query SQL sicura, risposta finale basata sui dati reali.
4. Il backend risponde con `{ "error": null, "result": "..." }`.

## Domande preimpostate

Per garantire risposte **deterministiche e coerenti** su 4 domande ad alta frequenza, il service gestisce un percorso prioritario rispetto al flusso AI generico:

1. *"che prodotti vendi?"*
2. *"parlami di json's quest"*
3. *"quali categorie ci sono"*
4. *"cosa fa il bastone tra le ruote"*

Meccanismo:

- **Normalizzazione dell'input** (`normalizePresetPrompt`): gestisce maiuscole/minuscole, accenti, apostrofi e punteggiatura, per riconoscere la domanda anche con formulazioni leggermente diverse.
- **Riconoscimento intent** (`getPresetIntent`): mappa il messaggio normalizzato a una delle 4 categorie preset.
- **Priorità preset**: se l'intent viene riconosciuto, la risposta preset viene restituita prima di attivare il flusso AI generico.

Contenuto delle risposte preset:

- **Prodotti**: elenco (fino a 50) letto direttamente dal database.
- **Categorie**: elenco letto dal database.
- **"Bastone tra le ruote"**: ricerca dedicata del prodotto e risposta descrittiva.
- **"Parlami di JSON's Quest"**: risposta narrativa coerente con il tono del brand.

Le risposte includono emoji e una formattazione leggibile (titolo + elenco + chiusura); **non contengono link**, per mantenere l'output pulito e facilmente verificabile in demo.

## Sicurezza delle query generate dall'AI

Per il percorso "domanda generale" (query SQL generate dinamicamente), sono applicati i seguenti guard-rail:

- solo query `SELECT` ammesse;
- blocco di statement multipli nella stessa query;
- blocco di keyword pericolose (`INSERT`, `UPDATE`, `DELETE`, ecc.);
- whitelist delle tabelle interrogabili;
- `LIMIT` automatico se assente nella query generata.

## Contesto di sessione

Ogni conversazione è associata a un `sessionId` (generato e persistito lato frontend). Quando l'utente si trova sulla pagina di un prodotto, viene passato anche `productSlug`, per:

- mantenere continuità conversazionale tra un messaggio e l'altro;
- restituire risposte pertinenti al prodotto attualmente visualizzato;
- evitare suggerimenti generici quando l'utente è già su un item specifico.

## Perché questo design

I modelli linguistici possono rispondere in modo non sempre prevedibile. Introdurre domande preset ad alta priorità, normalizzazione robusta dell'input, query SQL sicure e un fallback controllato serve a rendere l'esperienza **prevedibile sulle domande business-critical** (prodotti, categorie, informazioni sul negozio), mantenendo comunque la flessibilità dell'AI generativa per le domande aperte.

## Test rapido da terminale

```bash
curl -X POST http://localhost:3000/ai/assistant \
  -H "Content-Type: application/json" \
  -d '{"message":"che prodotti vendi?","sessionId":"demo"}'
```