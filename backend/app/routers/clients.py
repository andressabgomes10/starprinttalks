from fastapi import APIRouter, Depends, HTTPException
from app.core.supa import supabase
from app.core.security import get_current_user
from app.schemas.common import ClientIn, ClientOut, Page
import uuid

router = APIRouter()

def is_valid_uuid(value: str) -> bool:
    """Check if string is a valid UUID"""
    try:
        uuid.UUID(value)
        return True
    except ValueError:
        return False

@router.get("")
def list_clients(q: str | None = None, limit: int = 20, offset: int = 0, user=Depends(get_current_user)):
    try:
        qsup = supabase.table("clients").select("*").range(offset, offset + limit - 1).order("created_at", desc=True)
        if q:
            qsup = qsup.ilike("name", f"%{q}%")
        data = qsup.execute().data
        return {"ok": True, "data": data}
    except Exception as e:
        print(f"Error listing clients: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch clients")

@router.post("", response_model=dict)
def create_client(body: ClientIn, user=Depends(get_current_user)):
    try:
        res = supabase.table("clients").insert(body.model_dump()).execute().data
        return {"ok": True, "data": res[0] if res else None}
    except Exception as e:
        print(f"Error creating client: {e}")
        raise HTTPException(status_code=500, detail="Failed to create client")

@router.patch("/{id}")
def update_client(id: str, body: ClientIn, user=Depends(get_current_user)):
    # Validate UUID format
    if not is_valid_uuid(id):
        raise HTTPException(status_code=400, detail="Invalid client ID format")
    
    try:
        res = supabase.table("clients").update(body.model_dump(exclude_unset=True)).eq("id", id).execute().data
        if not res: 
            raise HTTPException(404, "Client not found")
        return {"ok": True, "data": res[0]}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating client: {e}")
        raise HTTPException(status_code=500, detail="Failed to update client")

@router.delete("/{id}")
def delete_client(id: str, user=Depends(get_current_user)):
    # Validate UUID format
    if not is_valid_uuid(id):
        raise HTTPException(status_code=400, detail="Invalid client ID format")
    
    try:
        res = supabase.table("clients").delete().eq("id", id).execute().data
        return {"ok": True, "data": bool(res)}
    except Exception as e:
        print(f"Error deleting client: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete client")