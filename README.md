# Support Desk Triage Agent

An AI agent that reads customer support messages and call recordings, then assigns each one a category, a severity level, and a team. Each business defines its own rubric, so the same agent works for any company.

## Features

- Classifies text messages against a company's own categories, severity levels, and teams
- Transcribes uploaded call audio and triages it the same way
- Saves every result as a ticket
- Dashboard with severity chart, open and resolved counts, sorting, filtering, and one-click resolve

## Tech Stack

- **Frontend:** Angular, Angular Material, Chart.js
- **API:** Node.js, Express
- **Agent service:** Python, FastAPI, Google ADK, Gemini
- **Database and storage:** Supabase

## Getting Started

**Prerequisites:** Node.js, Angular CLI, Python 3.10+, a Supabase project, and a Google AI API key.

```bash
git clone https://github.com/CadenEbert/AMD-Hackathon.git
cd AMD-Hackathon/amdhackathon
npm install
```

Create `amdhackathon/.env`:

```
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
```

Create `amdhackathon/BACKEND/support_agent/.env`:

```
GOOGLE_API_KEY=...
SUPABASE_URL=...
SUPABASE_KEY=...
```

Run each service in its own terminal from `amdhackathon/`:

```bash
ng serve
npm run server

cd BACKEND # agent service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn agent_api:app --reload --port 8000
```
