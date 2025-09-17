from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.core.supa import supabase

router = APIRouter()

class AuthIn(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(body: AuthIn):
    # signup simples
    res = supabase.auth.sign_up({"email": body.email, "password": body.password})
    return {"ok": True, "data": {"user": res.user.id if res.user else None}}

@router.post("/login")
def login(body: AuthIn):
    res = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
    return {"ok": True, "data": {"access_token": res.session.access_token, "user": res.user.id}}

@router.get("/me")
def me():
    # o front pode checar chamando /auth/me via token do Supabase (opcional: expandir com tabela 'users')
    return {"ok": True}