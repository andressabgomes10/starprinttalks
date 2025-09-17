from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from ..database import db
from ..models import (
    Ticket, TicketCreate, TicketUpdate, TicketStatus, TicketPriority,
    SearchFilters, PaginationParams, PaginatedResponse, SuccessResponse
)

router = APIRouter(prefix="/api/tickets", tags=["tickets"])

@router.get("/", response_model=PaginatedResponse)
async def get_tickets(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[TicketStatus] = Query(None),
    priority: Optional[TicketPriority] = Query(None),
    assigned_to: Optional[str] = Query(None),
    client_id: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc")
):
    """Get tickets with pagination and filters"""
    try:
        filters = SearchFilters(
            search_term=search,
            status=status,
            priority=priority,
            assigned_to=assigned_to,
            client_id=client_id
        )
        
        pagination = PaginationParams(
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        result = await db.search_tickets(filters, pagination)
        return PaginatedResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tickets: {str(e)}")

@router.get("/stats")
async def get_ticket_stats():
    """Get ticket statistics"""
    try:
        tickets = await db.get_all('tickets')
        
        stats = {
            "total": len(tickets),
            "open": len([t for t in tickets if t.get('status') == 'open']),
            "in_progress": len([t for t in tickets if t.get('status') == 'in_progress']),
            "resolved": len([t for t in tickets if t.get('status') == 'resolved']),
            "closed": len([t for t in tickets if t.get('status') == 'closed']),
            "high_priority": len([t for t in tickets if t.get('priority') in ['high', 'urgent']]),
            "by_priority": {
                "low": len([t for t in tickets if t.get('priority') == 'low']),
                "medium": len([t for t in tickets if t.get('priority') == 'medium']),
                "high": len([t for t in tickets if t.get('priority') == 'high']),
                "urgent": len([t for t in tickets if t.get('priority') == 'urgent'])
            },
            "by_category": {}
        }
        
        # Count by category
        categories = {}
        for ticket in tickets:
            category = ticket.get('category', 'Sem categoria')
            categories[category] = categories.get(category, 0) + 1
        stats["by_category"] = categories
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching ticket stats: {str(e)}")

@router.get("/{ticket_id}", response_model=Ticket)
async def get_ticket(ticket_id: str):
    """Get ticket by ID"""
    try:
        ticket = await db.get_by_id('tickets', ticket_id)
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        return Ticket(**ticket)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching ticket: {str(e)}")

@router.post("/", response_model=Ticket)
async def create_ticket(ticket_data: TicketCreate):
    """Create new ticket"""
    try:
        # Get client info
        client = await db.get_by_id('clients', ticket_data.client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Get assignee info if provided
        assignee_name = None
        if ticket_data.assigned_to:
            assignee = await db.get_by_id('users', ticket_data.assigned_to)
            if assignee:
                assignee_name = assignee['full_name']
        
        # Create ticket data
        ticket_dict = ticket_data.dict()
        ticket_dict.update({
            'client_name': client['name'],
            'assignee_name': assignee_name,
            'created_by': ticket_data.client_id,  # Assuming client creates ticket
            'creator_name': client['name'],
            'messages': 0
        })
        
        created_ticket = await db.create('tickets', ticket_dict)
        
        # Update client's ticket count
        await db.update('clients', ticket_data.client_id, {
            'total_tickets': client.get('total_tickets', 0) + 1,
            'open_tickets': client.get('open_tickets', 0) + 1,
            'last_contact': datetime.now()
        })
        
        return Ticket(**created_ticket)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating ticket: {str(e)}")

@router.put("/{ticket_id}", response_model=Ticket)
async def update_ticket(ticket_id: str, ticket_data: TicketUpdate):
    """Update ticket"""
    try:
        existing_ticket = await db.get_by_id('tickets', ticket_id)
        if not existing_ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        update_dict = ticket_data.dict(exclude_unset=True)
        
        # If status is being changed to resolved, set resolved_at
        if ticket_data.status == TicketStatus.resolved and existing_ticket.get('status') != 'resolved':
            update_dict['resolved_at'] = datetime.now()
        
        # If assigned_to is changed, update assignee_name
        if ticket_data.assigned_to:
            assignee = await db.get_by_id('users', ticket_data.assigned_to)
            if assignee:
                update_dict['assignee_name'] = assignee['full_name']
        
        updated_ticket = await db.update('tickets', ticket_id, update_dict)
        
        # Update client's open tickets count if status changed
        if ticket_data.status and ticket_data.status != existing_ticket.get('status'):
            client = await db.get_by_id('clients', existing_ticket['client_id'])
            if client:
                open_tickets = client.get('open_tickets', 0)
                if existing_ticket.get('status') in ['open', 'in_progress'] and ticket_data.status not in ['open', 'in_progress']:
                    open_tickets = max(0, open_tickets - 1)
                elif existing_ticket.get('status') not in ['open', 'in_progress'] and ticket_data.status in ['open', 'in_progress']:
                    open_tickets += 1
                
                await db.update('clients', existing_ticket['client_id'], {
                    'open_tickets': open_tickets,
                    'last_contact': datetime.now()
                })
        
        return Ticket(**updated_ticket)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating ticket: {str(e)}")

@router.delete("/{ticket_id}", response_model=SuccessResponse)
async def delete_ticket(ticket_id: str):
    """Delete ticket"""
    try:
        ticket = await db.get_by_id('tickets', ticket_id)
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        deleted = await db.delete('tickets', ticket_id)
        if not deleted:
            raise HTTPException(status_code=500, detail="Failed to delete ticket")
        
        # Update client's ticket counts
        client = await db.get_by_id('clients', ticket['client_id'])
        if client:
            total_tickets = max(0, client.get('total_tickets', 0) - 1)
            open_tickets = client.get('open_tickets', 0)
            if ticket.get('status') in ['open', 'in_progress']:
                open_tickets = max(0, open_tickets - 1)
            
            await db.update('clients', ticket['client_id'], {
                'total_tickets': total_tickets,
                'open_tickets': open_tickets
            })
        
        return SuccessResponse(message="Ticket deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting ticket: {str(e)}")

@router.get("/{ticket_id}/conversations")
async def get_ticket_conversations(ticket_id: str):
    """Get conversations for a ticket"""
    try:
        conversations = await db.get_all('conversations', filters={'ticket_id': ticket_id})
        
        # Sort by creation time
        conversations.sort(key=lambda x: x.get('created_at', datetime.min))
        
        return conversations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversations: {str(e)}")

@router.post("/{ticket_id}/assign")
async def assign_ticket(ticket_id: str, assigned_to: str):
    """Assign ticket to user"""
    try:
        ticket = await db.get_by_id('tickets', ticket_id)
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        # Get assignee info
        assignee = await db.get_by_id('users', assigned_to)
        if not assignee:
            raise HTTPException(status_code=404, detail="User not found")
        
        updated_ticket = await db.update('tickets', ticket_id, {
            'assigned_to': assigned_to,
            'assignee_name': assignee['full_name'],
            'status': 'in_progress' if ticket.get('status') == 'open' else ticket.get('status')
        })
        
        return Ticket(**updated_ticket)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error assigning ticket: {str(e)}")

@router.get("/categories/list")
async def get_ticket_categories():
    """Get list of ticket categories"""
    try:
        tickets = await db.get_all('tickets')
        categories = set()
        
        for ticket in tickets:
            category = ticket.get('category')
            if category:
                categories.add(category)
        
        # Add default categories if empty
        if not categories:
            categories = {
                'Técnico', 'Suporte', 'Billing', 'Feature Request', 
                'Bug', 'Geral', 'Urgente', 'Consultoria'
            }
        
        return sorted(list(categories))
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")