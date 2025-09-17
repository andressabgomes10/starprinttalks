-- ============================================================================
-- STAR PRINT TALKS - SCHEMA COMPLETO
-- Execute este script no SQL Editor do Supabase
-- ============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABELA DE USUÁRIOS (estende auth.users)
-- ============================================================================
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

-- ============================================================================
-- TABELA DE CLIENTES
-- ============================================================================
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

-- ============================================================================
-- TABELA DE TICKETS
-- ============================================================================
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

-- ============================================================================
-- TABELA DE CONVERSAS/MENSAGENS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES public.tickets(id) NOT NULL,
    message TEXT NOT NULL,
    sender_id UUID REFERENCES public.users(id) NOT NULL,
    sender_type TEXT CHECK (sender_type IN ('user', 'client')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA DE NOTIFICAÇÕES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_client_id ON public.tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_conversations_ticket_id ON public.conversations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS DE SEGURANÇA
-- ============================================================================

-- Users: usuários podem ver/editar próprio perfil
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Clients: acesso baseado em role
CREATE POLICY "Admins and agents can view all clients" ON public.clients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'agent')
        )
    );

CREATE POLICY "Clients can view own data" ON public.clients
    FOR SELECT USING (user_id = auth.uid());

-- Tickets: acesso baseado em role e ownership
CREATE POLICY "Users can view relevant tickets" ON public.tickets
    FOR SELECT USING (
        -- Admins e agents veem todos
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'agent')
        )
        OR
        -- Clientes veem próprios tickets
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE id = tickets.client_id 
            AND user_id = auth.uid()
        )
        OR
        -- Tickets atribuídos ao usuário
        assigned_to = auth.uid()
    );

-- Conversations: baseado no acesso ao ticket
CREATE POLICY "Users can view ticket conversations" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tickets t
            WHERE t.id = ticket_id
            AND (
                -- Admins e agents veem todas
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE id = auth.uid() 
                    AND role IN ('admin', 'agent')
                )
                OR
                -- Clientes veem próprias conversas
                EXISTS (
                    SELECT 1 FROM public.clients 
                    WHERE id = t.client_id 
                    AND user_id = auth.uid()
                )
                OR
                -- Tickets atribuídos ao usuário
                t.assigned_to = auth.uid()
            )
        )
    );

-- Notifications: usuário vê próprias notificações
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- FUNÇÕES E TRIGGERS
-- ============================================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DADOS INICIAIS DE EXEMPLO
-- ============================================================================

-- Inserir alguns clientes de exemplo
INSERT INTO public.clients (name, email, company, status) VALUES
    ('João Silva', 'joao@exemplo.com', 'Empresa ABC', 'active'),
    ('Maria Santos', 'maria@exemplo.com', 'Empresa XYZ', 'active'),
    ('Pedro Oliveira', 'pedro@exemplo.com', 'Empresa 123', 'active'),
    ('Ana Costa', 'ana@exemplo.com', 'Freelancer', 'active'),
    ('Carlos Souza', 'carlos@exemplo.com', 'Empresa DEF', 'inactive')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- CONFIRMAÇÃO
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Schema do Star Print Talks criado com sucesso!';
    RAISE NOTICE '📊 Tabelas criadas: users, clients, tickets, conversations, notifications';
    RAISE NOTICE '🔒 Row Level Security habilitado';
    RAISE NOTICE '⚡ Índices de performance criados';
    RAISE NOTICE '🎯 Sistema pronto para uso!';
END $$;
