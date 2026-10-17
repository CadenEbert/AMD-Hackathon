## Google ADK Version

Youll need google-adk == 2.12.0

## Agent API

Start the server (from `BACKEND/`, venv active):

    uvicorn main:app --reload --port 8000

### POST /chat

Request:

    { "message": "string", "session_id": "string", "user_id": "string (optional)" }

Response:

    { "reply": "string", "session_id": "string" }

- Reuse the same `session_id` to continue a conversation; generate a new one
  (e.g. `crypto.randomUUID()`) to start a new one.
- Errors return HTTP 500 with `{ "detail": "..." }`.

### GET /health

Returns `{ "status": "ok" }`.

### Example (Angular)

    this.http.post<{reply: string; session_id: string}>(
      'http://localhost:8000/chat',
      { message: 'Hi', session_id: this.sessionId }
    ).subscribe(res => console.log(res.reply));

### CORS

Set `ALLOWED_ORIGINS` (comma-separated) in `support_agent/.env` if the frontend
runs on a different origin than `http://localhost:4200`.