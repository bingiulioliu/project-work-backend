# API Reference — Backend

Base URL di sviluppo: `http://localhost:3000` (o il valore configurato in `PORT`/`HOST`).

Tutte le risposte sono in formato JSON. Le risposte di errore seguono generalmente la forma `{ "error": "..." }`.

---

## 🛍️ Prodotti — `/products`

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/products` | Elenco prodotti, con supporto a filtri, ordinamento e paginazione |
| `GET` | `/products/rarest` | Prodotti con rarità *Leggendaria* |
| `GET` | `/products/cheapest` | Prodotti con il prezzo più basso |
| `GET` | `/products/:slug` | Dettaglio di un singolo prodotto |
| `GET` | `/products/:slug/suggested` | Prodotti correlati, in base alle categorie condivise |
| `POST` | `/products` | Creazione di un nuovo prodotto |
| `PATCH` | `/products/:slug` | Modifica parziale di un prodotto esistente |
| `DELETE` | `/products/:slug` | Cancellazione di un prodotto |

**Filtri supportati su `GET /products`** (query params): ricerca per nome, categoria, range di prezzo, rarità (multi-selezione), ordinamento per prezzo o data, paginazione.

---

## 🗂️ Categorie — `/categories`

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/categories` | Elenco di tutte le categorie |
| `GET` | `/categories/:slug` | Dettaglio categoria, con i prodotti associati |

---

## 📦 Ordini — `/orders`

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/orders` | Elenco ordini |
| `GET` | `/orders/:order_number` | Dettaglio di un ordine |
| `POST` | `/orders` | Creazione di un nuovo ordine (in transazione DB) |
| `PUT` | `/orders/:order_number` | Aggiornamento di un ordine esistente |
| `DELETE` | `/orders/:order_number` | Cancellazione di un ordine |

La creazione ordine (`POST /orders`) verifica l'esistenza dei prodotti, calcola il totale e invia (in modo non bloccante) l'email di conferma a cliente e venditore.

---

## 📬 Newsletter — `/newsletter`

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `POST` | `/newsletter` | Iscrizione alla newsletter, con invio email di benvenuto |

---

## 🤖 AI Assistant — `/ai`

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/ai/assistant/preset-questions` | Elenco delle domande preimpostate gestite dal chatbot |
| `POST` | `/ai/assistant` | Invia un messaggio all'assistente AI e riceve una risposta |

### `POST /ai/assistant`

**Request body:**

```json
{
  "message": "Parlami di questo prodotto",
  "sessionId": "product-detail-session",
  "productSlug": "tazza-del-mana-termica"
}
```

- `message` *(obbligatorio)*: testo del messaggio dell'utente.
- `sessionId` *(obbligatorio)*: identificativo di sessione, per mantenere lo storico conversazionale.
- `productSlug` / `productId` *(opzionale)*: se presente, l'assistente confina la risposta al contesto del prodotto indicato.

**Response:**

```json
{
  "error": null,
  "result": "...risposta del modello..."
}
```

Dettagli sul funzionamento interno dell'assistente in [`AI-ASSISTANT.md`](AI-ASSISTANT.md).