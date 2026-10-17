# from instructions import INSTRUCTIONS
from pydantic import BaseModel, Field
from google.adk import Agent, Workflow
from .agent_tools.rubric_tool import get_rubric

class Classification(BaseModel):
    category: str
    team_email: str
    severity_score: int
    confidence: float = Field(ge=0, le=1)
    reason: str

lookup_agent = Agent(
    name="rubric_lookup",
    model="gemini-3.5-flash-lite",
    tools=[get_rubric],   # your existing tool, unchanged
    instruction="""
    The user's message contains a company name and an issue description.
    Extract the company name and call get_rubric with it.
    Do not classify the issue. Do not summarize the rubric.
    If the tool returns an error, reply with the error message and stop.
    """,
    )

classifier_agent = Agent(
    name="classifier",
    model="gemini-3.5-flash-lite",
    instruction="""
    Classify the issue in the user's message into exactly one category from the
    rubric below. Use only categories that appear in the rubric.

    Rubric:
    {rubric}

    Give a confidence from 0 to 1 and a one-sentence reason.
    Also use the rubric to assign a team to solve the issue and then take the eamil of that team and put it in team_email.
    FInally assign a severity level of 1-5 with 1 being low risk and 5 being high risk to the problem.
    """,
    output_schema=Classification,
    output_key="classification",
)

root_agent = Workflow(
    name="classification_pipeline",
    edges=[("START", lookup_agent, classifier_agent)],
)

#my company name is Acme Corp and my wifi is bad