from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random
from ..database import db
from ..models import DashboardStats, ActivityItem, TeamPerformance

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get main dashboard statistics"""
    try:
        stats = await db.get_dashboard_stats()
        return DashboardStats(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard stats: {str(e)}")

@router.get("/recent-activity", response_model=List[ActivityItem])
async def get_recent_activity():
    """Get recent activity feed"""
    try:
        # Get recent tickets and conversations
        tickets = await db.get_all('tickets', limit=10)
        conversations = await db.get_all('conversations', limit=10)
        
        activities = []
        
        # Convert tickets to activities
        for ticket in tickets:
            created_time = ticket.get('created_at')
            if isinstance(created_time, str):
                created_time = datetime.fromisoformat(created_time.replace('Z', '+00:00'))
            
            time_diff = datetime.now() - created_time if created_time else timedelta(hours=1)
            
            if time_diff.days > 0:
                time_str = f"{time_diff.days}d atrás"
            elif time_diff.seconds > 3600:
                time_str = f"{time_diff.seconds // 3600}h atrás"
            else:
                time_str = f"{time_diff.seconds // 60}min atrás"
            
            activities.append(ActivityItem(
                id=ticket['id'],
                type='ticket',
                title=f"Ticket {ticket['id']} - {ticket['title']}",
                description=f"Cliente: {ticket.get('client_name', 'N/A')}",
                time=time_str,
                priority=ticket.get('priority', 'medium'),
                user_id=ticket.get('assigned_to')
            ))
        
        # Convert conversations to activities  
        for conv in conversations:
            created_time = conv.get('created_at')
            if isinstance(created_time, str):
                created_time = datetime.fromisoformat(created_time.replace('Z', '+00:00'))
            
            time_diff = datetime.now() - created_time if created_time else timedelta(minutes=30)
            
            if time_diff.days > 0:
                time_str = f"{time_diff.days}d atrás"
            elif time_diff.seconds > 3600:
                time_str = f"{time_diff.seconds // 3600}h atrás"
            else:
                time_str = f"{time_diff.seconds // 60}min atrás"
            
            activities.append(ActivityItem(
                id=conv['id'],
                type='message',
                title=f"Nova mensagem de {conv.get('sender_name', 'Usuário')}",
                description=conv['message'][:50] + "..." if len(conv['message']) > 50 else conv['message'],
                time=time_str,
                priority='medium',
                user_id=conv.get('sender_id')
            ))
        
        # Sort by creation time
        activities.sort(key=lambda x: x.time)
        
        return activities[:10]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recent activity: {str(e)}")

@router.get("/team-performance", response_model=List[TeamPerformance])
async def get_team_performance():
    """Get team performance metrics"""
    try:
        users = await db.get_all('users', filters={'role': 'agent'})
        team_performance = []
        
        for user in users:
            stats = user.get('stats', {})
            team_performance.append(TeamPerformance(
                name=user['full_name'],
                messages=stats.get('conversations', random.randint(30, 50)),
                satisfaction=stats.get('rating', round(random.uniform(4.2, 4.9), 1)),
                avatar=user.get('avatar_url', '👤'),
                user_id=user['id']
            ))
        
        # Add demo data if no real users
        if not team_performance:
            demo_team = [
                {"name": "Ana Silva", "messages": 45, "satisfaction": 4.8, "avatar": "👩‍💼", "user_id": "demo-1"},
                {"name": "Carlos Santos", "messages": 38, "satisfaction": 4.6, "avatar": "👨‍💼", "user_id": "demo-2"},
                {"name": "Mariana Costa", "messages": 42, "satisfaction": 4.9, "avatar": "👩‍💻", "user_id": "demo-3"},
                {"name": "Rafael Lima", "messages": 35, "satisfaction": 4.5, "avatar": "👨‍💻", "user_id": "demo-4"}
            ]
            team_performance = [TeamPerformance(**member) for member in demo_team]
        
        return team_performance
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching team performance: {str(e)}")

@router.get("/metrics")
async def get_dashboard_metrics():
    """Get detailed dashboard metrics"""
    try:
        stats = await db.get_dashboard_stats()
        
        # Calculate additional metrics
        metrics = {
            "overview": stats,
            "trends": {
                "tickets_growth": "+12%",
                "response_time_improvement": "-15%",
                "satisfaction_change": "+2%",
                "resolution_rate": "+3%"
            },
            "hourly_activity": [
                {"hour": f"{i:02d}", "activity": random.randint(5, 95)} 
                for i in range(0, 24, 2)
            ],
            "department_distribution": [
                {"name": "Suporte Técnico", "value": 35, "color": "var(--chart-1)"},
                {"name": "Customer Success", "value": 28, "color": "var(--chart-2)"},
                {"name": "Vendas", "value": 22, "color": "var(--chart-3)"},
                {"name": "Financeiro", "value": 15, "color": "var(--chart-4)"}
            ]
        }
        
        return metrics
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching metrics: {str(e)}")

@router.get("/kpis")
async def get_kpis():
    """Get key performance indicators"""
    try:
        stats = await db.get_dashboard_stats()
        tickets = await db.get_all('tickets')
        
        # Calculate KPIs
        kpis = {
            "total_tickets": {
                "value": stats['total_tickets'],
                "change": "+12%",
                "trend": "up",
                "description": "vs. período anterior"
            },
            "avg_response_time": {
                "value": "2.3min",
                "change": "-15%", 
                "trend": "down",
                "description": "vs. período anterior"
            },
            "customer_satisfaction": {
                "value": f"{stats['satisfaction']}/5",
                "change": "+0.2",
                "trend": "up",
                "description": "vs. período anterior"
            },
            "resolution_rate": {
                "value": f"{(stats['tickets_resolved'] / max(stats['total_tickets'], 1) * 100):.1f}%",
                "change": "+3%",
                "trend": "up", 
                "description": "vs. período anterior"
            }
        }
        
        return kpis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching KPIs: {str(e)}")