     -- Schema do Banco de Dados - ST Talks v1
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE role AS ENUM ('admin', 'manager', 'agent', 'viewer', 'customer');
CREATE TYPE article_status AS ENUM ('rascunho', 'publicado', 'arquivado');
CREATE TYPE channel AS ENUM ('whatsapp', 'webchat', 'email', 'slack');

-- Tabela de organizações
CREATE TABLE IF NOT EXISTS public.orgs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários (estende auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role role NOT NULL,
    org_id UUID REFERENCES public.orgs(id) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de presença dos agentes
CREATE TABLE IF NOT EXISTS public.agent_presence (
    user_id UUID REFERENCES public.users(id) PRIMARY KEY,
    is_online BOOLEAN DEFAULT false,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos de analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    org_id UUID REFERENCES public.orgs(id) NOT NULL,
    user_id UUID REFERENCES public.users(id),
    event_name TEXT NOT NULL,
    metadata JSONB,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    org_id UUID REFERENCES public.orgs(id) NOT NULL,
    actor_id UUID REFERENCES public.users(id) NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias de artigos
CREATE TABLE IF NOT EXISTS public.article_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    org_id UUID REFERENCES public.orgs(id) NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de equipes
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    org_id UUID REFERENCES public.orgs(id) NOT NULL,
    name TEXT NOT NULL,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de artigos de conhecimento
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    org_id UUID REFERENCES public.orgs(id) NOT NULL,
    author_id UUID REFERENCES public.users(id) NOT NULL,
    category_id UUID REFERENCES public.article_categories(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status article_status DEFAULT 'rascunho',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tags de artigos
CREATE TABLE IF NOT EXISTS public.article_tags (
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    tag_id UUID DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (article_id, tag_id)
);

-- Tabela de feedback dos artigos
CREATE TABLE IF NOT EXISTS public.article_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    is_useful BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atribuições de tickets
CREATE TABLE IF NOT EXISTS public.ticket_assignees (
    ticket_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comentários de tickets
CREATE TABLE IF NOT EXISTS public.ticket_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES public.ticket_assignees(ticket_id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.users(id) NOT NULL,
    body TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tickets
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    client_id UUID REFERENCES public.clients(id) NOT NULL,
    assigned_to UUID REFERENCES public.users(id),
    created_by UUID REFERENCES public.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de conversas
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES public.tickets(id) NOT NULL,
    message TEXT NOT NULL,
    sender_id UUID REFERENCES public.users(id) NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'client')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para orgs
CREATE POLICY "Users can view own organization" ON public.orgs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = orgs.id
        )
    );

-- Políticas de RLS para users
CREATE POLICY "Users can view users in same org" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users u1 
            WHERE u1.id = auth.uid() AND u1.org_id = users.org_id
        )
    );

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas de RLS para agent_presence
CREATE POLICY "Users can view agent presence in same org" ON public.agent_presence
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = (
                SELECT org_id FROM public.users WHERE id = agent_presence.user_id
            )
        )
    );

-- Políticas de RLS para analytics_events
CREATE POLICY "Users can view analytics in same org" ON public.analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = analytics_events.org_id
        )
    );

-- Políticas de RLS para audit_logs
CREATE POLICY "Users can view audit logs in same org" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = audit_logs.org_id
        )
    );

-- Políticas de RLS para article_categories
CREATE POLICY "Users can manage categories in same org" ON public.article_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = article_categories.org_id
        )
    );

-- Políticas de RLS para teams
CREATE POLICY "Users can manage teams in same org" ON public.teams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = teams.org_id
        )
    );

-- Políticas de RLS para knowledge_articles
CREATE POLICY "Users can view articles in same org" ON public.knowledge_articles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = knowledge_articles.org_id
        )
    );

CREATE POLICY "Authors can manage own articles" ON public.knowledge_articles
    FOR ALL USING (author_id = auth.uid());

-- Políticas de RLS para article_tags
CREATE POLICY "Users can manage tags for articles in same org" ON public.article_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.knowledge_articles ka
            JOIN public.users u ON u.org_id = ka.org_id
            WHERE u.id = auth.uid() AND ka.id = article_tags.article_id
        )
    );

-- Políticas de RLS para article_feedback
CREATE POLICY "Users can manage feedback for articles in same org" ON public.article_feedback
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.knowledge_articles ka
            JOIN public.users u ON u.org_id = ka.org_id
            WHERE u.id = auth.uid() AND ka.id = article_feedback.article_id
        )
    );

-- Políticas de RLS para ticket_assignees
CREATE POLICY "Users can manage tickets in same org" ON public.ticket_assignees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = (
                SELECT org_id FROM public.users WHERE id = ticket_assignees.user_id
            )
        )
    );

-- Políticas de RLS para ticket_comments
CREATE POLICY "Users can manage comments for tickets in same org" ON public.ticket_comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.ticket_assignees ta
            JOIN public.users u ON u.id = ta.user_id
            WHERE u.id = auth.uid() AND ta.ticket_id = ticket_comments.ticket_id
        )
    );

-- Políticas de RLS para clients
CREATE POLICY "Users can manage clients in same org" ON public.clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = (
                SELECT org_id FROM public.users WHERE id = auth.uid()
            )
        )
    );

-- Políticas de RLS para tickets
CREATE POLICY "Users can manage tickets in same org" ON public.tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND org_id = (
                SELECT org_id FROM public.users WHERE id = auth.uid()
            )
        )
    );

-- Políticas de RLS para conversations
CREATE POLICY "Users can manage conversations for tickets in same org" ON public.conversations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.tickets t
            JOIN public.users u ON u.id = auth.uid()
            WHERE t.id = conversations.ticket_id AND u.org_id = (
                SELECT org_id FROM public.users WHERE id = auth.uid()
            )
        )
    );

-- Políticas de RLS para notifications
CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (user_id = auth.uid());

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

CREATE TRIGGER update_orgs_updated_at BEFORE UPDATE ON public.orgs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_categories_updated_at BEFORE UPDATE ON public.article_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_articles_updated_at BEFORE UPDATE ON public.knowledge_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_feedback_updated_at BEFORE UPDATE ON public.article_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_assignees_updated_at BEFORE UPDATE ON public.ticket_assignees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_comments_updated_at BEFORE UPDATE ON public.ticket_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir organização padrão
INSERT INTO public.orgs (id, name) VALUES
('00000000-0000-0000-0000-000000000000', 'ST Talks Organization')
ON CONFLICT (id) DO NOTHING;

-- Inserir categorias padrão de artigos
INSERT INTO public.article_categories (org_id, name) VALUES
('00000000-0000-0000-0000-000000000000', 'Geral'),
('00000000-0000-0000-0000-000000000000', 'Suporte Técnico'),
('00000000-0000-0000-0000-000000000000', 'FAQ'),
('00000000-0000-0000-0000-000000000000', 'Tutoriais')
ON CONFLICT DO NOTHING;

-- Inserir equipe padrão
INSERT INTO public.teams (org_id, name, department) VALUES
('00000000-0000-0000-0000-000000000000', 'Equipe Principal', 'Suporte'),
('00000000-0000-0000-0000-000000000000', 'Desenvolvimento', 'TI')
ON CONFLICT DO NOTHING;
