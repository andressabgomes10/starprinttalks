#!/usr/bin/env python3
"""
Script para executar o schema diretamente no Supabase usando a API
"""

import requests
import json
import time

# Configuração do Supabase
SUPABASE_URL = "https://pzxqinijxqmiyvgkmohf.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eHFpbmlqeHFtaXl2Z2ttb2hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODEyMDMzOSwiZXhwIjoyMDczNjk2MzM5fQ.Y5b9U-fJdoW7kAYeH_J7nKWxeZCnJNbMSWXCMfZTM3o"

def executar_schema():
    print("🚀 Executando schema diretamente no Supabase...")
    print(f"📡 URL: {SUPABASE_URL}")
    print(f"🔑 Service Key: {SUPABASE_SERVICE_KEY[:30]}...")
    
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json"
    }
    
    # SQL para executar
    sql_commands = [
        # Habilitar extensões
        "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";",
        
        # Tabela de usuários
        """
        CREATE TABLE IF NOT EXISTS public.users (
            id UUID REFERENCES auth.users(id) PRIMARY KEY,
            email TEXT NOT NULL,
            full_name TEXT,
            avatar_url TEXT,
            role TEXT CHECK (role IN ('admin', 'agent', 'client')) DEFAULT 'client',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """,
        
        # Tabela de clientes
        """
        CREATE TABLE IF NOT EXISTS public.clients (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            company TEXT,
            status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
            user_id UUID REFERENCES public.users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """,
        
        # Tabela de tickets
        """
        CREATE TABLE IF NOT EXISTS public.tickets (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
            priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
            client_id UUID REFERENCES public.clients(id) NOT NULL,
            assigned_to UUID REFERENCES public.users(id),
            created_by UUID REFERENCES public.users(id) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            resolved_at TIMESTAMP WITH TIME ZONE
        );
        """,
        
        # Tabela de conversas
        """
        CREATE TABLE IF NOT EXISTS public.conversations (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            ticket_id UUID REFERENCES public.tickets(id) NOT NULL,
            message TEXT NOT NULL,
            sender_id UUID REFERENCES public.users(id) NOT NULL,
            sender_type TEXT CHECK (sender_type IN ('user', 'client')) DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """,
        
        # Tabela de notificações
        """
        CREATE TABLE IF NOT EXISTS public.notifications (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES public.users(id) NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
            read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """,
        
        # Habilitar RLS
        "ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;",
        
        # Remover políticas existentes
        "DROP POLICY IF EXISTS \"Users can view own profile\" ON public.users;",
        "DROP POLICY IF EXISTS \"Users can update own profile\" ON public.users;",
        "DROP POLICY IF EXISTS \"Admins and agents can view all clients\" ON public.clients;",
        "DROP POLICY IF EXISTS \"Clients can view own data\" ON public.clients;",
        "DROP POLICY IF EXISTS \"Users can view relevant tickets\" ON public.tickets;",
        "DROP POLICY IF EXISTS \"Users can view ticket conversations\" ON public.conversations;",
        "DROP POLICY IF EXISTS \"Users can view own notifications\" ON public.notifications;",
        "DROP POLICY IF EXISTS \"Users can update own notifications\" ON public.notifications;",
        
        # Criar políticas
        """
        CREATE POLICY "Users can view own profile" ON public.users
            FOR SELECT USING (auth.uid() = id);
        """,
        
        """
        CREATE POLICY "Users can update own profile" ON public.users
            FOR UPDATE USING (auth.uid() = id);
        """,
        
        """
        CREATE POLICY "Admins and agents can view all clients" ON public.clients
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE id = auth.uid() 
                    AND role IN ('admin', 'agent')
                )
            );
        """,
        
        """
        CREATE POLICY "Clients can view own data" ON public.clients
            FOR SELECT USING (user_id = auth.uid());
        """,
        
        """
        CREATE POLICY "Users can view relevant tickets" ON public.tickets
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE id = auth.uid() 
                    AND role IN ('admin', 'agent')
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.clients 
                    WHERE id = tickets.client_id 
                    AND user_id = auth.uid()
                )
                OR
                assigned_to = auth.uid()
            );
        """,
        
        """
        CREATE POLICY "Users can view ticket conversations" ON public.conversations
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.tickets t
                    WHERE t.id = ticket_id
                    AND (
                        EXISTS (
                            SELECT 1 FROM public.users 
                            WHERE id = auth.uid() 
                            AND role IN ('admin', 'agent')
                        )
                        OR
                        EXISTS (
                            SELECT 1 FROM public.clients 
                            WHERE id = t.client_id 
                            AND user_id = auth.uid()
                        )
                        OR
                        t.assigned_to = auth.uid()
                    )
                )
            );
        """,
        
        """
        CREATE POLICY "Users can view own notifications" ON public.notifications
            FOR SELECT USING (user_id = auth.uid());
        """,
        
        """
        CREATE POLICY "Users can update own notifications" ON public.notifications
            FOR UPDATE USING (user_id = auth.uid());
        """,
        
        # Índices
        "CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);",
        "CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);",
        "CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);",
        "CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);",
        "CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);",
        "CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.tickets(priority);",
        "CREATE INDEX IF NOT EXISTS idx_tickets_client_id ON public.tickets(client_id);",
        "CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON public.tickets(assigned_to);",
        "CREATE INDEX IF NOT EXISTS idx_conversations_ticket_id ON public.conversations(ticket_id);",
        "CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);",
        
        # Função para updated_at
        """
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        """,
        
        # Triggers
        "DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;",
        "DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;",
        "DROP TRIGGER IF EXISTS update_tickets_updated_at ON public.tickets;",
        
        """
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        """,
        
        """
        CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        """,
        
        """
        CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        """,
    ]
    
    # Executar cada comando
    sucesso = 0
    erros = 0
    
    for i, sql in enumerate(sql_commands, 1):
        print(f"\n{i}️⃣ Executando comando {i}/{len(sql_commands)}...")
        
        try:
            # Usar o endpoint de SQL do Supabase
            payload = {
                "query": sql.strip()
            }
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
                headers=headers,
                data=json.dumps(payload)
            )
            
            if response.status_code == 200:
                print(f"   ✅ Comando {i} executado com sucesso!")
                sucesso += 1
            else:
                print(f"   ⚠️ Erro no comando {i}: {response.status_code}")
                print(f"   Resposta: {response.text}")
                erros += 1
                
        except Exception as e:
            print(f"   ❌ Erro ao executar comando {i}: {e}")
            erros += 1
        
        # Pequena pausa entre comandos
        time.sleep(0.5)
    
    print(f"\n📊 Resumo da execução:")
    print(f"   ✅ Sucessos: {sucesso}")
    print(f"   ❌ Erros: {erros}")
    
    if erros == 0:
        print("\n🎉 Schema executado com sucesso!")
        
        # Inserir dados de exemplo
        print("\n📝 Inserindo dados de exemplo...")
        inserir_dados_exemplo()
        
    else:
        print(f"\n⚠️ Houve {erros} erros durante a execução")

def inserir_dados_exemplo():
    """Insere dados de exemplo"""
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        # Inserir clientes de exemplo
        clients_data = [
            {
                "name": "João Silva",
                "email": "joao@exemplo.com",
                "company": "Empresa ABC",
                "status": "active"
            },
            {
                "name": "Maria Santos",
                "email": "maria@exemplo.com",
                "company": "Empresa XYZ",
                "status": "active"
            },
            {
                "name": "Pedro Oliveira",
                "email": "pedro@exemplo.com",
                "company": "Empresa 123",
                "status": "active"
            },
            {
                "name": "Ana Costa",
                "email": "ana@exemplo.com",
                "company": "Freelancer",
                "status": "active"
            },
            {
                "name": "Carlos Souza",
                "email": "carlos@exemplo.com",
                "company": "Empresa DEF",
                "status": "inactive"
            }
        ]
        
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/clients",
            headers=headers,
            data=json.dumps(clients_data)
        )
        
        if response.status_code == 201:
            print("✅ Clientes de exemplo inseridos com sucesso!")
        else:
            print(f"⚠️ Erro ao inserir clientes: {response.status_code}")
            print(f"Resposta: {response.text}")
            
    except Exception as e:
        print(f"❌ Erro ao inserir dados de exemplo: {e}")

if __name__ == "__main__":
    executar_schema()
