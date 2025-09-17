from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

# Enums
class UserRole(str, Enum):
    admin = "admin"
    agent = "agent"
    supervisor = "supervisor"
    client = "client"

class UserStatus(str, Enum):
    online = "online"
    away = "away"
    offline = "offline"

class TicketStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class TicketPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class ClientStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    pending = "pending"

class ClientPlan(str, Enum):
    basic = "basic"
    pro = "pro"
    enterprise = "enterprise"

class MessageSender(str, Enum):
    user = "user"
    client = "client"

class MessageStatus(str, Enum):
    sent = "sent"
    delivered = "delivered"
    read = "read"

class ArticleStatus(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"

# Base Models
class BaseEntity(BaseModel):
    id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.client
    is_active: bool = True
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    position: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    position: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None

class User(UserBase, BaseEntity):
    status: UserStatus = UserStatus.offline
    last_active: Optional[datetime] = None
    join_date: Optional[datetime] = None
    stats: Optional[Dict[str, Any]] = None

class UserStats(BaseModel):
    tickets: int = 0
    conversations: int = 0
    rating: float = 0.0
    resolved_tickets: int = 0
    response_time: float = 0.0
    satisfaction: float = 0.0

# Client Models
class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    status: ClientStatus = ClientStatus.active
    plan: ClientPlan = ClientPlan.basic
    tags: List[str] = []
    priority: TicketPriority = TicketPriority.medium

class ClientCreate(ClientBase):
    user_id: Optional[str] = None

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    status: Optional[ClientStatus] = None
    plan: Optional[ClientPlan] = None
    tags: Optional[List[str]] = None
    priority: Optional[TicketPriority] = None

class Client(ClientBase, BaseEntity):
    user_id: Optional[str] = None
    join_date: Optional[datetime] = None
    last_contact: Optional[datetime] = None
    total_tickets: int = 0
    open_tickets: int = 0
    satisfaction: float = 0.0
    revenue: float = 0.0
    last_activity: Optional[str] = None

# Ticket Models
class TicketBase(BaseModel):
    title: str
    description: str
    status: TicketStatus = TicketStatus.open
    priority: TicketPriority = TicketPriority.medium
    category: Optional[str] = None
    tags: List[str] = []

class TicketCreate(TicketBase):
    client_id: str
    assigned_to: Optional[str] = None

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    assigned_to: Optional[str] = None

class Ticket(TicketBase, BaseEntity):
    client_id: str
    client_name: Optional[str] = None
    assigned_to: Optional[str] = None
    assignee_name: Optional[str] = None
    created_by: str
    creator_name: Optional[str] = None
    resolved_at: Optional[datetime] = None
    messages: int = 0

# Conversation Models
class ConversationBase(BaseModel):
    ticket_id: str
    sender_id: str
    sender_type: MessageSender
    message: str
    status: MessageStatus = MessageStatus.sent

class ConversationCreate(ConversationBase):
    pass

class Conversation(ConversationBase, BaseEntity):
    sender_name: Optional[str] = None

# Notification Models
class NotificationBase(BaseModel):
    user_id: str
    title: str
    message: str
    type: str = "info"
    read: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    read: Optional[bool] = None

class Notification(NotificationBase, BaseEntity):
    pass

# Knowledge Base Models
class CategoryBase(BaseModel):
    name: str
    color: str = "bg-gray-500"

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase, BaseEntity):
    count: int = 0

class ArticleBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    category_id: str
    status: ArticleStatus = ArticleStatus.draft
    tags: List[str] = []

class ArticleCreate(ArticleBase):
    author_id: str

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category_id: Optional[str] = None
    status: Optional[ArticleStatus] = None
    tags: Optional[List[str]] = None

class Article(ArticleBase, BaseEntity):
    author_id: str
    author_name: Optional[str] = None
    category_name: Optional[str] = None
    views: int = 0
    likes: int = 0
    dislikes: int = 0

# Dashboard Models
class DashboardStats(BaseModel):
    conversations_active: int
    tickets_open: int
    clients_active: int
    satisfaction: float
    total_tickets: int
    tickets_resolved: int
    tickets_in_progress: int
    high_priority_tickets: int

class ActivityItem(BaseModel):
    id: str
    type: str
    title: str
    description: str
    time: str
    priority: str
    user_id: Optional[str] = None

class TeamPerformance(BaseModel):
    name: str
    messages: int
    satisfaction: float
    avatar: str
    user_id: str

# Report Models
class ReportData(BaseModel):
    name: str
    tickets: int
    conversations: int
    satisfaction: float

class HourlyActivity(BaseModel):
    hour: str
    activity: int

class DepartmentStats(BaseModel):
    name: str
    value: int
    color: str

class TeamMemberPerformance(BaseModel):
    name: str
    tickets: int
    satisfaction: float
    response_time: float

# Settings Models
class UserPreferences(BaseModel):
    theme: str = "light"
    language: str = "pt-BR"
    timezone: str = "America/Sao_Paulo"
    date_format: str = "DD/MM/YYYY"
    auto_save: bool = True
    sound_notifications: bool = True

class NotificationSettings(BaseModel):
    email: bool = True
    push: bool = True
    sms: bool = False
    tickets: bool = True
    mentions: bool = True
    marketing: bool = False

class SecuritySettings(BaseModel):
    two_factor: bool = False
    session_timeout: str = "30"
    login_notifications: bool = True
    device_management: bool = True

class UserSettings(BaseModel):
    preferences: UserPreferences
    notifications: NotificationSettings
    security: SecuritySettings

# Search and Filter Models
class SearchFilters(BaseModel):
    search_term: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    assigned_to: Optional[str] = None
    client_id: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    tags: Optional[List[str]] = None

class PaginationParams(BaseModel):
    page: int = 1
    page_size: int = 20
    sort_by: str = "created_at"
    sort_order: str = "desc"

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int

# Response Models
class SuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Any] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None