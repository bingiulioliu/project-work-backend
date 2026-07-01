# Scelte tecniche — Backend

Questo documento motiva le principali decisioni architetturali del progetto, non solo cosa fa il sistema ma perché è stato costruito così.

## Separazione Router / Controller / Service

Router, Controller e Service sono tenuti separati per ridurre l'accoppiamento e aumentare la manutenibilità:

- **Router**: mappa URL → funzione.
- **Controller**: valida l'input e costruisce la risposta HTTP.
- **Service**: contiene la logica di business e le integrazioni esterne.

Vantaggi concreti:

1. Si può cambiare un endpoint senza toccare la logica AI/email.
2. La logica di business è più facile da testare in isolamento.
3. Il progetto scala con nuove feature senza accumulare file monolitici.

## Chatbot con regole + fallback, non solo AI generativa

I modelli linguistici possono rispondere in modo non sempre coerente. Per questo il chatbot combina:

- domande preset ad alta priorità, gestite in modo deterministico;
- normalizzazione robusta dell'input utente;
- query SQL controllate e sicure (solo `SELECT`, whitelist tabelle);
- fallback quando il piano AI generico non è sufficiente.

Obiettivo: rendere l'esperienza **prevedibile** sulle domande business-critical (prodotti, categorie, informazioni sul negozio), pur mantenendo la flessibilità dell'AI per le domande aperte.

## Sessione e contesto prodotto nel chatbot

Ogni utente ha un `sessionId`, e nella pagina prodotto viene passato anche `productSlug`. Questo permette di:

- mantenere continuità conversazionale;
- dare risposte pertinenti al prodotto aperto;
- evitare suggerimenti generici quando l'utente è già su un item specifico.

## Nessun link nelle risposte preset

In fase di rifinitura, i link sono stati rimossi dalle risposte preset per ottenere un output:

- più pulito e leggibile in chat;
- più semplice da verificare in fase di demo;
- meno rumoroso su risposte lunghe (es. elenco di 50 prodotti).

## Query parametrizzate e transazioni sugli ordini

Tutte le query verso MySQL usano parametri (`?`), non concatenazione di stringhe, per prevenire SQL injection.

La creazione ordini (`POST /orders`) avviene in transazione (`beginTransaction` / `commit` / `rollback`), per evitare stati inconsistenti tra la tabella `orders` e le relative righe prodotto in `order_product` in caso di errore a metà operazione.

## `node --env-file` invece di `dotenv`

Gli script `start` e `watch` usano `node --env-file=.env`, funzionalità nativa di Node.js, evitando una dipendenza esterna (`dotenv`) solo per il caricamento delle variabili ambiente.

## Valore tecnico complessivo

- Maggiore prevedibilità delle risposte AI sugli intent critici.
- UX più chiara grazie a risposte immediate e ben formattate.
- Integrazione stretta tra contesto prodotto e conversazione.
- Struttura modulare e manutenibile (router/controller/service), facile da estendere con nuovi endpoint o nuove domande preset.