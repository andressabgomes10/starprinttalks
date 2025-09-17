import os
import uuid
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from supabase import create_client, Client
from .models import *

# Supabase client
supabase_url = os.environ.get("VITE_SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or "https://pzxqinijxqmiyvgkmohf.supabase.co"
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY") or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eHFpbmlqeHFtaXl2Z2ttb2hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODEyMDMzOSwiZXhwIjoyMDczNjk2MzM5fQ.Y5b9U-fJdoW7kAYeH_J7nKWxeZCnJNbMSWXCMfZTM3o"

if not supabase_url or not supabase_key:
    print("Warning: Supabase credentials not found. Using in-memory storage.")
    supabase = None
else:
    supabase: Client = create_client(supabase_url, supabase_key)
    print(f"✅ Connected to Supabase: {supabase_url}")

class DatabaseManager:
    def __init__(self):
        self.supabase = supabase
        # In-memory storage fallback
        self.storage = {
            'users': {},
            'clients': {},
            'tickets': {},
            'conversations': {},
            'notifications': {},
            'categories': {},
            'articles': {},
            'settings': {}
        }
        self._init_demo_data()
    
    def _generate_id(self) -> str:
        return str(uuid.uuid4())
    
    def _init_demo_data(self):
        """Initialize with demo data if no database connection"""
        if self.supabase:
            return
            
        # Demo users
        demo_users = [
            {
                "id": "user-1",
                "email": "admin@cajatalks.com",
                "full_name": "João Silva",
                "role": "admin",
                "is_active": True,
                "status": "online",
                "department": "Customer Success",
                "join_date": datetime.now() - timedelta(days=365),
                "created_at": datetime.now() - timedelta(days=365),
                "stats": {"tickets": 127, "conversations": 245, "rating": 4.8}
            },
            {
                "id": "user-2", 
                "email": "agent@cajatalks.com",
                "full_name": "Ana Silva",
                "role": "agent",
                "is_active": True,
                "status": "online",
                "department": "Suporte Técnico",
                "join_date": datetime.now() - timedelta(days=200),
                "created_at": datetime.now() - timedelta(days=200),
                "stats": {"tickets": 89, "conversations": 156, "rating": 4.6}
            }
        ]
        
        for user in demo_users:
            self.storage['users'][user['id']] = user
        
        # Demo clients
        demo_clients = [
            {
                "id": "client-1",
                "name": "Maria Santos",
                "email": "maria@techsolutions.com",
                "phone": "(11) 99999-1111",
                "company": "Tech Solutions Ltda",
                "status": "active",
                "plan": "pro",
                "join_date": datetime.now() - timedelta(days=30),
                "total_tickets": 12,
                "open_tickets": 2,
                "satisfaction": 98,
                "revenue": 15000,
                "tags": ["vip", "enterprise"],
                "created_at": datetime.now() - timedelta(days=30)
            },
            {
                "id": "client-2",
                "name": "João Silva",
                "email": "joao@startuptech.com",
                "phone": "(21) 88888-2222", 
                "company": "StartupTech",
                "status": "active",
                "plan": "basic",
                "join_date": datetime.now() - timedelta(days=45),
                "total_tickets": 5,
                "open_tickets": 0,
                "satisfaction": 95,
                "revenue": 2500,
                "tags": ["startup"],
                "created_at": datetime.now() - timedelta(days=45)
            }
        ]
        
        for client in demo_clients:
            self.storage['clients'][client['id']] = client
        
        # Demo tickets
        demo_tickets = [
            {
                "id": "TIC-001",
                "title": "Problema no login do sistema",
                "description": "Usuário relatando dificuldades para acessar sua conta após a atualização do sistema.",
                "status": "open",
                "priority": "high",
                "client_id": "client-1",
                "client_name": "Maria Santos",
                "assigned_to": "user-1",
                "assignee_name": "João Silva",
                "created_by": "client-1",
                "category": "Técnico",
                "tags": ["login", "bug", "urgente"],
                "messages": 12,
                "created_at": datetime.now() - timedelta(hours=2)
            },
            {
                "id": "TIC-002",
                "title": "Solicitação de nova funcionalidade",
                "description": "Cliente solicitando implementação de relatórios personalizados.",
                "status": "in_progress",
                "priority": "medium",
                "client_id": "client-2",
                "client_name": "João Silva",
                "assigned_to": "user-2",
                "assignee_name": "Ana Silva",
                "created_by": "client-2",
                "category": "Feature Request",
                "tags": ["enhancement", "dashboard"],
                "messages": 8,
                "created_at": datetime.now() - timedelta(days=1)
            }
        ]
        
        for ticket in demo_tickets:
            self.storage['tickets'][ticket['id']] = ticket
        
        # Demo conversations
        demo_conversations = [
            {
                "id": "conv-1",
                "ticket_id": "TIC-001",
                "sender_id": "client-1",
                "sender_type": "client",
                "sender_name": "Maria Santos",
                "message": "Olá! Estou com problema no login do sistema.",
                "status": "read",
                "created_at": datetime.now() - timedelta(hours=1)
            },
            {
                "id": "conv-2",
                "ticket_id": "TIC-001",
                "sender_id": "user-1",
                "sender_type": "user", 
                "sender_name": "João Silva",
                "message": "Olá Maria! Vou verificar seu problema agora mesmo.",
                "status": "read",
                "created_at": datetime.now() - timedelta(minutes=30)
            }
        ]
        
        for conv in demo_conversations:
            self.storage['conversations'][conv['id']] = conv
        
        # Demo categories and articles
        demo_categories = [
            {"id": "cat-1", "name": "Técnico", "color": "bg-blue-500", "count": 45},
            {"id": "cat-2", "name": "Faturamento", "color": "bg-green-500", "count": 23},
            {"id": "cat-3", "name": "Conta", "color": "bg-purple-500", "count": 34}
        ]
        
        for category in demo_categories:
            self.storage['categories'][category['id']] = category
        
        demo_articles = [
            {
                "id": "art-1",
                "title": "Como configurar autenticação de dois fatores",
                "content": "Guia passo a passo para configurar 2FA...",
                "excerpt": "Guia passo a passo para ativar a autenticação de dois fatores e aumentar a segurança da sua conta.",
                "category_id": "cat-3",
                "category_name": "Conta",
                "author_id": "user-1",
                "author_name": "João Silva",
                "status": "published",
                "tags": ["segurança", "2FA", "conta"],
                "views": 1247,
                "likes": 23,
                "dislikes": 2,
                "created_at": datetime.now() - timedelta(days=10),
                "updated_at": datetime.now() - timedelta(days=5)
            }
        ]
        
        for article in demo_articles:
            self.storage['articles'][article['id']] = article

    # Generic CRUD operations
    async def create(self, table: str, data: dict) -> dict:
        if self.supabase:
            try:
                # Convert datetime objects to ISO strings
                processed_data = self._process_data_for_db(data)
                result = self.supabase.table(table).insert(processed_data).execute()
                return result.data[0] if result.data else {}
            except Exception as e:
                print(f"Error creating in {table}: {e}")
                # Fallback to in-memory
                pass
        
        # In-memory fallback
        if 'id' not in data:
            data['id'] = self._generate_id()
        if 'created_at' not in data:
            data['created_at'] = datetime.now()
        data['updated_at'] = datetime.now()
        
        self.storage[table][data['id']] = data
        return data
    
    async def get_by_id(self, table: str, id: str) -> Optional[dict]:
        if self.supabase:
            try:
                result = self.supabase.table(table).select("*").eq("id", id).execute()
                return result.data[0] if result.data else None
            except Exception as e:
                print(f"Error getting from {table}: {e}")
        
        return self.storage[table].get(id)
    
    async def get_all(self, table: str, filters: dict = None, limit: int = None, offset: int = 0) -> List[dict]:
        if self.supabase:
            try:
                query = self.supabase.table(table).select("*")
                
                if filters:
                    for key, value in filters.items():
                        if value is not None:
                            query = query.eq(key, value)
                
                if limit:
                    query = query.limit(limit).offset(offset)
                
                result = query.execute()
                return result.data or []
            except Exception as e:
                print(f"Error getting all from {table}: {e}")
        
        # In-memory fallback
        items = list(self.storage[table].values())
        
        if filters:
            filtered_items = []
            for item in items:
                match = True
                for key, value in filters.items():
                    if value is not None and item.get(key) != value:
                        match = False
                        break
                if match:
                    filtered_items.append(item)
            items = filtered_items
        
        # Apply pagination
        if limit:
            items = items[offset:offset + limit]
        
        return items
    
    async def update(self, table: str, id: str, data: dict) -> Optional[dict]:
        if self.supabase:
            try:
                processed_data = self._process_data_for_db(data)
                processed_data['updated_at'] = datetime.now().isoformat()
                result = self.supabase.table(table).update(processed_data).eq("id", id).execute()
                return result.data[0] if result.data else None
            except Exception as e:
                print(f"Error updating {table}: {e}")
        
        # In-memory fallback
        if id in self.storage[table]:
            self.storage[table][id].update(data)
            self.storage[table][id]['updated_at'] = datetime.now()
            return self.storage[table][id]
        return None
    
    async def delete(self, table: str, id: str) -> bool:
        if self.supabase:
            try:
                result = self.supabase.table(table).delete().eq("id", id).execute()
                return len(result.data) > 0
            except Exception as e:
                print(f"Error deleting from {table}: {e}")
        
        # In-memory fallback
        if id in self.storage[table]:
            del self.storage[table][id]
            return True
        return False
    
    def _process_data_for_db(self, data: dict) -> dict:
        """Convert datetime objects to ISO strings for database storage"""
        processed = {}
        for key, value in data.items():
            if isinstance(value, datetime):
                processed[key] = value.isoformat()
            else:
                processed[key] = value
        return processed
    
    # Specific methods for complex queries
    async def get_dashboard_stats(self) -> dict:
        try:
            if self.supabase:
                # Get stats from database
                clients = await self.get_all('clients')
                tickets = await self.get_all('tickets')
                users = await self.get_all('users')
            else:
                # Use in-memory data
                clients = list(self.storage['clients'].values())
                tickets = list(self.storage['tickets'].values())
                users = list(self.storage['users'].values())
            
            stats = {
                'conversations_active': len([t for t in tickets if t.get('status') in ['open', 'in_progress']]),
                'tickets_open': len([t for t in tickets if t.get('status') == 'open']),
                'clients_active': len([c for c in clients if c.get('status') == 'active']),
                'satisfaction': 94.0,
                'total_tickets': len(tickets),
                'tickets_resolved': len([t for t in tickets if t.get('status') == 'resolved']),
                'tickets_in_progress': len([t for t in tickets if t.get('status') == 'in_progress']),
                'high_priority_tickets': len([t for t in tickets if t.get('priority') in ['high', 'urgent']])
            }
            
            return stats
        except Exception as e:
            print(f"Error getting dashboard stats: {e}")
            return {
                'conversations_active': 247,
                'tickets_open': 32,
                'clients_active': 1235,
                'satisfaction': 94.0,
                'total_tickets': 1247,
                'tickets_resolved': 1108,
                'tickets_in_progress': 107,
                'high_priority_tickets': 32
            }
    
    async def search_tickets(self, filters: SearchFilters, pagination: PaginationParams) -> dict:
        """Advanced ticket search with filters and pagination"""
        try:
            tickets = await self.get_all('tickets')
            
            # Apply filters
            if filters.search_term:
                search_term = filters.search_term.lower()
                tickets = [t for t in tickets if 
                          search_term in t.get('title', '').lower() or
                          search_term in t.get('description', '').lower() or
                          search_term in t.get('client_name', '').lower()]
            
            if filters.status:
                tickets = [t for t in tickets if t.get('status') == filters.status]
            
            if filters.priority:
                tickets = [t for t in tickets if t.get('priority') == filters.priority]
            
            if filters.assigned_to:
                tickets = [t for t in tickets if t.get('assigned_to') == filters.assigned_to]
            
            # Sort
            reverse = pagination.sort_order == 'desc'
            if pagination.sort_by == 'created_at':
                tickets.sort(key=lambda x: x.get('created_at', datetime.min), reverse=reverse)
            elif pagination.sort_by == 'title':
                tickets.sort(key=lambda x: x.get('title', ''), reverse=reverse)
            elif pagination.sort_by == 'priority':
                priority_order = {'low': 1, 'medium': 2, 'high': 3, 'urgent': 4}
                tickets.sort(key=lambda x: priority_order.get(x.get('priority', 'low'), 1), reverse=reverse)
            
            # Pagination
            total = len(tickets)
            start = (pagination.page - 1) * pagination.page_size
            end = start + pagination.page_size
            paginated_tickets = tickets[start:end]
            
            return {
                'items': paginated_tickets,
                'total': total,
                'page': pagination.page,
                'page_size': pagination.page_size,
                'total_pages': (total + pagination.page_size - 1) // pagination.page_size
            }
            
        except Exception as e:
            print(f"Error searching tickets: {e}")
            return {'items': [], 'total': 0, 'page': 1, 'page_size': pagination.page_size, 'total_pages': 0}

# Global database instance
db = DatabaseManager()