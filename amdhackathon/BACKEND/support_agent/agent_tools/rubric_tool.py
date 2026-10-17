import json
from google.adk.tools import ToolContext
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_KEY"],
)

def get_rubric(company_id: str, message: str, tool_context: ToolContext) -> dict:
    """Fetch the classification rubric for a company.

    Args:
        company_id: The company id as given in the request.
    """
    
    tool_context.state["company_id"] = company_id
    tool_context.state["message"] = message
    
    issues = (
        supabase.table("issue_category")
        .select("category, description, id")
        .eq("company_id", company_id)
        .execute()
    )
    severity = (
        supabase.table("severity_levels")
        .select("rank, definition")
        .eq("company_id", company_id)
        .execute()
    )
    
    teams = (
            supabase.table("teams")
            .select("id, description")
            .eq("company_id", company_id)
            .execute()
        )
    
    issues = [
        {
            "category_id": issue["id"],
            "issue_category": issue["category"],
            "category_description": issue["description"]
        } for issue in issues.data
    ]
    
    severity = [
        {
            "severity_score": severities["rank"],
            "severity_description": severities["definition"],
        }  for severities in severity.data
    ]
    
    teams = [
        {
            "team_description": team["description"],
            "team_id": team["id"]
        } for team in teams.data
    ]
    
    company = [
        {
            "company_id": company_id
        }
    ]
    
    if not issues or not severity or not teams:
        return {"error": f"rubric not found for company {company_id}"}
    
    rubric = issues + severity + teams + company
    
    tool_context.state["rubric"] = json.dumps(
        rubric, indent=2, ensure_ascii=False, default=str
    )
    
    return {"status": "ok", "categories": len(rubric)}