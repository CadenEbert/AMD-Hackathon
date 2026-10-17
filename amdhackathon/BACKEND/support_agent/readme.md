## Requirements

- Python venv with `google-adk==2.12.0` (other versions may fail, e.g. `Workflow` import errors)
- Install dependencies: `pip install -r requirements.txt`
- Create `BACKEND/support_agent/.env` with your own keys (this file is not in git):

      GOOGLE_API_KEY=...
      SUPABASE_URL=...
      SUPABASE_KEY=...                         # service role key, so inserts work with RLS on
      ALLOWED_ORIGINS=http://localhost:4200    # optional, comma-separated

## Agent API

Start the server (from `BACKEND/`, venv active):

    uvicorn agent_api:app --reload --port 8000

Interactive docs: `http://localhost:8000/docs`

### POST /chat

Classifies a support message using the company's rubric (categories, severity
levels, and teams from Supabase), then **saves the result as a new row in the
`tickets` table**. The frontend does not need to write to the database itself.

Request:

    {
      "company_id": 3,
      "message": "I need Adobe Photoshop installed on my laptop"
    }

Response:

    {
      "company_id": 3,
      "category_id": 9,
      "description": "I need Adobe Photoshop installed on my laptop",
      "severity_score": 2,
      "resolve": false,
      "assigned_team": 5
    }

- `company_id` must exist in Supabase, otherwise the rubric lookup fails.
- `description` is always the exact message that was sent.
- `resolve` always starts as `false`.
- The saved row also gets an auto-generated `id` and `created_at`. These are
  not returned in the response.
- Each request is independent. There are no sessions, and the agent has no
  memory of earlier messages.
- Responses take a few seconds, so show a loading state.

Errors:

| Status | Meaning |
|---|---|
| 422 | Request body is missing a field or has the wrong type (e.g. `company_id` must be a number, `message` can't be empty) |
| 500 | `{ "detail": "..." }` with one of: `Agent error: ...` (classification failed, e.g. unknown company), `Agent did not return valid JSON: ...`, or `Classified, but failed to save: ...` (database insert failed) |

### GET /health

Returns `{ "status": "ok" }`.

### Example (Angular)

    this.http.post<{
      company_id: number;
      category_id: number;
      description: string;
      severity_score: number;
      resolve: boolean;
      assigned_team: number;
    }>('http://localhost:8000/chat', {
      company_id: 3,
      message: 'I need Adobe Photoshop installed on my laptop',
    }).subscribe({
      next: res => console.log(res.category_id, res.assigned_team),
      error: err => console.error(err.error?.detail),
    });

Remember `.subscribe()`, or the request is never sent.

### CORS

Set `ALLOWED_ORIGINS` (comma-separated) in `support_agent/.env` if the frontend
runs on a different origin than `http://localhost:4200` or `http://127.0.0.1:4200`.