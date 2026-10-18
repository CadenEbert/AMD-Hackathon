import os
import json
import uuid
import asyncio
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / "support_agent" / ".env")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from support_agent.agent import root_agent
from support_agent.agent_tools.rubric_tool import supabase

APP_NAME = "support_agent"

app = FastAPI(title="Support Agent API", version="1.0.0")

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:4200,http://127.0.0.1:4200").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

session_service = InMemorySessionService()
runner = Runner(agent=root_agent, app_name=APP_NAME, session_service=session_service)


class ChatRequest(BaseModel):
    company_id: int
    message: str = Field(..., min_length=1, description="The support message to classify")


class ChatResponse(BaseModel):
    company_id: int
    category_id: int
    description: str
    severity_score: int
    resolve: bool
    assigned_team: int


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    user_id = "anonymous"
    session_id = str(uuid.uuid4())
    reply = ""

    print(f"Processing chat request: {req}")

    try:
        await session_service.create_session(
            app_name=APP_NAME, user_id=user_id, session_id=session_id
        )

        text = f"company_id: {req.company_id}\nmessage: {req.message}"
        content = types.Content(role="user", parts=[types.Part(text=text)])

        async for event in runner.run_async(
            user_id=user_id, session_id=session_id, new_message=content
        ):
            if event.is_final_response() and event.content and event.content.parts:
                reply = event.content.parts[0].text or ""

        result = json.loads(reply)

        # Don't trust the model for these
        result["description"] = req.message
        result["company_id"] = req.company_id
        result["resolve"] = False

        # Only the columns you send; id and created_at fill in automatically
        row = {
            "company_id": result["company_id"],
            "category_id": result["category_id"],
            "description": result["description"],
            "severity_score": result["severity_score"],
            "resolved": result["resolve"],
            "assigned_team": result["assigned_team"],
        }

        try:
            inserted = await asyncio.to_thread(
                lambda: supabase.table("tickets").insert(row).execute()
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Classified, but failed to save: {e}")

        print(f"Ticket saved: {inserted}")
        return ChatResponse(**result)

    except HTTPException:
        raise
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail=f"Agent did not return valid JSON: {reply}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {e}")
    finally:
        try:
            await session_service.delete_session(
                app_name=APP_NAME, user_id=user_id, session_id=session_id
            )
        except Exception:
            pass
