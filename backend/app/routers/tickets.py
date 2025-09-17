from fastapi import APIRouter, Depends, HTTPException
from app.core.supa import supabase
from app.core.security import get_current_user
from app.schemas.common import TicketIn
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
def list_tickets(status: str | None = None, priority: str | None = None, client_id: str | None = None,
                 limit: int = 20, offset: int = 0, user=Depends(get_current_user)):
    try:
        q = supabase.table("tickets").select("*").range(offset, offset + limit - 1).order("created_at", desc=True)
        if status:   q = q.eq("status", status)
        if priority: q = q.eq("priority", priority)
        if client_id: 
            if not is_valid_uuid(client_id):
                raise HTTPException(status_code=400, detail="Invalid client_id format")
            q = q.eq("client_id", client_id)
        data = q.execute().data
        return {"ok": True, "data": data}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error listing tickets: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch tickets")

@router.post("")
def create_ticket(body: TicketIn, user=Depends(get_current_user)):
    from app.core.supa import admin
    
    try:
        # Validate client_id format
        if not is_valid_uuid(body.client_id):
            raise HTTPException(status_code=400, detail="Invalid client_id format")
        
        # Ensure user exists in users table first
        try:
            # Try to get or create user record using admin client to bypass RLS
            existing_user = admin.table("users").select("*").eq("id", user.id).execute()
            if not existing_user.data:
                # Create user record if it doesn't exist
                user_data = {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.user_metadata.get("full_name", user.email.split("@")[0]),
                    "role": "agent",  # Default role
                    "org_id": "00000000-0000-0000-0000-000000000000"  # Default org from schema
                }
                result = admin.table("users").insert(user_data).execute()
                print(f"Created user record: {result.data}")
        except Exception as e:
            print(f"Error ensuring user exists: {e}")
            # If we can't create the user, we can't create the ticket
            raise HTTPException(status_code=500, detail=f"Could not ensure user exists: {e}")
        
        # Add created_by to ticket data
        ticket_data = body.model_dump()
        ticket_data["created_by"] = user.id
        
        res = supabase.table("tickets").insert(ticket_data).execute().data
        return {"ok": True, "data": res[0] if res else None}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating ticket: {e}")
        raise HTTPException(status_code=500, detail="Failed to create ticket")

@router.patch("/{id}")
def update_ticket(id: str, body: dict, user=Depends(get_current_user)):
    # Validate UUID format
    if not is_valid_uuid(id):
        raise HTTPException(status_code=400, detail="Invalid ticket ID format")
    
    try:
        # For updates, we accept a dict to allow partial updates
        # Filter out None values and only update provided fields
        update_data = {k: v for k, v in body.items() if v is not None}
        
        res = supabase.table("tickets").update(update_data).eq("id", id).execute().data
        if not res: 
            raise HTTPException(404, "Ticket not found")
        return {"ok": True, "data": res[0]}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating ticket: {e}")
        raise HTTPException(status_code=500, detail="Failed to update ticket")

@router.delete("/{id}")
def delete_ticket(id: str, user=Depends(get_current_user)):
    # Validate UUID format
    if not is_valid_uuid(id):
        raise HTTPException(status_code=400, detail="Invalid ticket ID format")
    
    try:
        res = supabase.table("tickets").delete().eq("id", id).execute().data
        return {"ok": True, "data": bool(res)}
    except Exception as e:
        print(f"Error deleting ticket: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete ticket")