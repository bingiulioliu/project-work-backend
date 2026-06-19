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