from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, clients, tickets, teams

app = FastAPI(title="Cajá Talks API (MVP)")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000", "http://localhost:3002", "http://127.0.0.1:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])
app.include_router(tickets.router, prefix="/api/tickets", tags=["tickets"])
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])

@app.get("/api/health")
def health():
    return {"ok": True}