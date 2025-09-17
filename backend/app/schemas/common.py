from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class Page(BaseModel):
    limit: int = Field(20, ge=1, le=100)
    offset: int = Field(0, ge=0)

class ClientIn(BaseModel):
    name: str = Field(..., max_length=160)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = Field("active", pattern="^(active|inactive|suspended)$")

class ClientOut(ClientIn):
    id: str

class TicketIn(BaseModel):
    title: str = Field(..., max_length=160)
    description: str | None = None
    status: str = Field("open", pattern="^(open|in_progress|resolved|closed)$")
    priority: str = Field("medium", pattern="^(low|medium|high|urgent)$")
    client_id: str
    assigned_to: str | None = None

class TicketOut(TicketIn):
    id: str