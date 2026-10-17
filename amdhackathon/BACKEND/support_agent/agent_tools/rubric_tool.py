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

def get_rubric(company_name: str, tool_context: ToolContext) -> dict:
    """Fetch the classification rubric for a company.

    Args:
        company_name: The company name exactly as given in the request.
    """
    company_query = (
        supabase.table("companies")
        .select("id")
        .eq("company_name", company_name)
        .execute()
    )
    company_id = company_query.data[0]["id"]
    company_id = int(company_id)
    
    issues = (
        supabase.table("issue_category")
        .select("category, description")
        .eq("company_id", company_id)
        .execute()
    )
    severity = (
        supabase.table("severity_levels")
        .select("rank, definition, name")
        .eq("company_id", company_id)
        .execute()
    )
    
    teams = (
        supabase.table("teams")
        .select("supervisors_email, description, name")
        .eq("company_id", company_id)
        .execute()
    )
    
    issues = [
        {
            "issue_category": issue["category"],
            "category_description": issue["description"]
        } for issue in issues.data
    ]
    
    severity = [
        {
            "severity_rank": severities["rank"],
            "severity_description": severities["definition"],
            "severity_name": severities["name"]
        }  for severities in severity.data
    ]
    
    teams = [
        {
            "email": team["supervisors_email"],
            "team_description": team["description"],
            "team_name": team["name"]
        } for team in teams.data
    ]
    
    rubric = issues + severity + teams
    
    if not rubric:
        return({"error": "rubric not found"})
    
    print(rubric)
    tool_context.state["rubric"] = json.dumps(
        rubric, indent=2, ensure_ascii=False, default=str
    )
    
    return {"status": "ok", "categories": len(rubric)}