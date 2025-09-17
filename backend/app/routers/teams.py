from fastapi import APIRouter, Depends, HTTPException
from app.core.supa import supabase
from app.core.security import get_current_user

router = APIRouter()

@router.get("")
def list_teams(limit: int = 50, offset: int = 0, user=Depends(get_current_user)):
    try:
        data = supabase.table("teams").select("*").range(offset, offset + limit - 1).execute().data
        return {"ok": True, "data": data}
    except Exception as e:
        print(f"Error listing teams: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch teams")

@router.post("")
def create_team(body: dict, user=Depends(get_current_user)):
    try:
        # Validate required fields
        if not body.get("name"):
            raise HTTPException(status_code=400, detail="Team name is required")
        
        # Only allow name and department fields that exist in the schema
        team_data = {
            "name": body.get("name"),
            "department": body.get("department"),
            "org_id": "00000000-0000-0000-0000-000000000000"  # Default org from schema
        }
        # Remove None values
        team_data = {k: v for k, v in team_data.items() if v is not None}
        res = supabase.table("teams").insert(team_data).execute().data
        return {"ok": True, "data": res[0] if res else None}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating team: {e}")
        raise HTTPException(status_code=500, detail="Failed to create team")