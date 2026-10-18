import os
import json
import uuid
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from contextlib import asynccontextmanager

load_dotenv(Path(__file__).parent / "support_agent" / ".env")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from support_agent.agent import root_agent
from support_agent.agent_tools.rubric_tool import supabase

APP_NAME = "support_agent"

async def poll_pending():
    # Rows stuck in "processing" from a crash or reload go back in the line
    await asyncio.to_thread(
        lambda: supabase.table("call_recordings")
        .update({"status": "pending"}).eq("status", "processing").execute()
    )

    while True:
        try:
            res = await asyncio.to_thread(
                lambda: supabase.table("call_recordings")
                .select("id").eq("status", "pending")
                .order("created_at").limit(1).execute()
            )
            if res.data:
                try:
                    await process_call(res.data[0]["id"])
                except Exception as e:
                    # process_call already marked the row "failed"
                    print(f"Call {res.data[0]['id']} failed: {e}")
            else:
                await asyncio.sleep(3)
        except Exception as e:
            print(f"Poll error: {e}")
            await asyncio.sleep(3)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(poll_pending())
    yield
    task.cancel()


app = FastAPI(title="Support Agent API", version="1.0.0", lifespan = lifespan)

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:4200,http://127.0.0.1:4200").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

session_service = InMemorySessionService()
runner = Runner(agent=root_agent, app_name=APP_NAME, session_service=session_service)
genai_client = genai.Client()  # reads GOOGLE_API_KEY from the environment
TRANSCRIBE_MODEL = "gemini-3.5-flash-lite"


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


async def classify_and_save(company_id: int, message: str) -> dict:
    """Run the agent on a message and save the ticket. Shared by /chat and /process-call."""
    user_id = "anonymous"
    session_id = str(uuid.uuid4())
    reply = ""

    print(f"Classifying for company {company_id}: {message[:80]}")

    try:
        await session_service.create_session(
            app_name=APP_NAME, user_id=user_id, session_id=session_id
        )

        text = f"company_id: {company_id}\nmessage: {message}"
        content = types.Content(role="user", parts=[types.Part(text=text)])

        async for event in runner.run_async(
            user_id=user_id, session_id=session_id, new_message=content
        ):
            if event.is_final_response() and event.content and event.content.parts:
                reply = event.content.parts[0].text or ""

        result = json.loads(reply)

        # Don't trust the model for these
        result["description"] = message
        result["company_id"] = company_id
        result["resolve"] = False

        # id and created_at fill in automatically
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
        result["ticket_id"] = inserted.data[0]["id"]
        return result

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


async def transcribe(audio: bytes, mime_type: str) -> str:
    try:
        response = await genai_client.aio.models.generate_content(
            model=TRANSCRIBE_MODEL,
            contents=[
                "Transcribe this audio exactly as spoken. "
                "Return only the transcript text, nothing else.",
                types.Part.from_bytes(data=audio, mime_type=mime_type),
            ],
        )
        return (response.text or "").strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    return ChatResponse(**await classify_and_save(req.company_id, req.message))


@app.post("/process-call/{call_id}")
async def process_call(call_id: int):
    table = supabase.table("call_recordings")
    rec = table.select("*").eq("id", call_id).single().execute().data

    try:
        table.update({"status": "processing"}).eq("id", call_id).execute()

        audio = supabase.storage.from_("call-recordings").download(rec["storage_path"])
        transcript = await transcribe(audio, rec["content_type"] or "audio/mpeg")
        if not transcript:
            raise HTTPException(status_code=422, detail="No speech found in the audio")

        result = await classify_and_save(rec["company_id"], transcript)

        table.update({
            "status": "done",
            "transcript": transcript,
            "ticket_id": result["ticket_id"],
        }).eq("id", call_id).execute()

        return {"transcript": transcript, **result}

    except Exception as e:
        msg = getattr(e, "detail", None) or str(e)
        table.update({"status": "failed", "error": str(msg)[:500]}).eq("id", call_id).execute()
        raise