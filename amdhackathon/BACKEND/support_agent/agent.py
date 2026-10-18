from .instructions import CLASSIFIER_INSTRUCTIONS
from pydantic import BaseModel, Field
from google.adk import Agent, Workflow
from .agent_tools.rubric_tool import get_rubric

class Classification(BaseModel):
    company_id: int
    category_id: int
    description: str
    severity_score: int
    resolve: bool = False
    assigned_team: int

lookup_agent = Agent(
    name="rubric_lookup",
    model="gemini-3.5-flash-lite",
    tools=[get_rubric],
    instruction="""
    The input has two lines:
        company_id: <number>
        message: <support message>

    Your only job is to load the rubric.
    1. Read the number after "company_id:".
    2. Call get_rubric exactly once with that company_id.
    3. After the tool succeeds, reply with only the word "done".

    Do not classify the message. Do not summarize or repeat the rubric.
    If the tool returns an error, reply with the error message and stop.
    """,
    )

classifier_agent = Agent(
    name="classifier",
    model="gemini-3.5-flash-lite",
    instruction= CLASSIFIER_INSTRUCTIONS,
    output_schema=Classification,
    output_key="classification",
)

root_agent = Workflow(
    name="classification_pipeline",
    edges=[("START", lookup_agent, classifier_agent)],
)