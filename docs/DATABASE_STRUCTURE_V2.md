# Estrutura de Dados Atualizada - Cajá Talks

## 📊 Visão Geral

Este documento descreve a estrutura de dados atualizada do sistema Cajá Talks, baseada no novo diagrama ERD fornecido. A estrutura foi simplificada e otimizada para focar nas funcionalidades essenciais de atendimento ao cliente.

## 🗄️ Entidades Principais

### **1. Usuários e Autenticação**

#### **Users (Usuários)**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'Agente' | 'Supervisor' | 'Admin';
  theme_mode: 'Claro' | 'Escuro';
  created_at: string;
  updated_at: string;
}
```

**Características:**
- ✅ **Unificado**: Agentes e clientes são usuários do sistema
- ✅ **Roles**: Agente, Supervisor, Admin
- ✅ **Tema**: Suporte a modo claro e escuro
- ✅ **Autenticação**: Hash de senha seguro

### **2. Sistema de Conversas (Tickets)**

#### **Channels (Canais)**
```typescript
interface Channel {
  id: number;
  name: string;
  type: 'Mensagens' | 'Email' | 'Chat';
  credentials: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

#### **Conversations (Conversas)**
```typescript
interface Conversation {
  id: number;
  customer_id: number;
  agent_id: number | null;
  channel_id: number;
  status: 'Aberta' | 'Fechada' | 'Pendente';
  start_time: string;
  end_time: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  customer?: User;
  agent?: User;
  channel?: Channel;
  feedbacks?: Feedback[];
}
```

**Características:**
- ✅ **Status Simplificado**: Aberta, Fechada, Pendente
- ✅ **Atribuição**: Conversas podem ser atribuídas a agentes
- ✅ **Canais**: WhatsApp, Email, Chat
- ✅ **Tempo**: Controle de início e fim da conversa

### **3. Sistema de Feedbacks**

#### **Feedbacks (Avaliações)**
```typescript
interface Feedback {
  id: number;
  ticket_id: number;
  customer_id: number;
  agent_id: number;
  rating: number; // 1-5
  comments: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  ticket?: Conversation;
  customer?: User;
  agent?: User;
}
```

**Características:**
- ✅ **Avaliação**: Rating de 1 a 5 estrelas
- ✅ **Comentários**: Feedback textual opcional
- ✅ **Rastreamento**: Cliente e agente envolvidos

### **4. Base de Conhecimento**

#### **Article Categories (Categorias)**
```typescript
interface ArticleCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
```

#### **Knowledge Base Articles (Artigos)**
```typescript
interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  category_id: number | null;
  author_id: number | null;
  views_count: number;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  category?: ArticleCategory;
  author?: User;
  ratings?: ArticleRating[];
}
```

#### **Article Ratings (Avaliações de Artigos)**
```typescript
interface ArticleRating {
  id: number;
  article_id: number;
  user_id: number;
  rating: number; // 1-5
  created_at: string;
  updated_at: string;
  // Relacionamentos
  article?: KnowledgeBaseArticle;
  user?: User;
}
```

### **5. Sistema de Notificações**

#### **Notifications (Notificações)**
```typescript
interface Notification {
  id: number;
  user_id: number;
  type: 'info' | 'warning' | 'error' | 'success' | 'ticket' | 'conversation';
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  user?: User;
}
```

### **6. Configurações do Sistema**

#### **SLA Rules (Regras SLA)**
```typescript
interface SlaRule {
  id: number;
  name: string;
  description: string | null;
  priority: 'Baixa' | 'Media' | 'Alta' | 'Urgente';
  response_time_limit_minutes: number;
  resolution_time_limit_minutes: number;
  created_at: string;
  updated_at: string;
}
```

#### **Operating Hours (Horários de Funcionamento)**
```typescript
interface OperatingHours {
  id: number;
  day_of_week: 'Segunda' | 'Terca' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sabado' | 'Domingo';
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

#### **Customers (Clientes)**
```typescript
interface Customer {
  id: number;
  name: string;
  customer_type: 'Individual' | 'Corporativo' | null;
  created_at: string;
  updated_at: string;
}
```

## 🔗 Relacionamentos

### **Relacionamentos Principais**

1. **User → Conversation** (1:N)
   - Um usuário pode ser cliente em várias conversas
   - Um usuário pode ser agente em várias conversas

2. **Channel → Conversation** (1:N)
   - Um canal pode ter várias conversas
   - Uma conversa usa um canal específico

3. **Conversation → Feedback** (1:N)
   - Uma conversa pode ter vários feedbacks
   - Um feedback é sobre uma conversa específica

4. **User → KnowledgeBaseArticle** (1:N)
   - Um usuário pode criar vários artigos
   - Um artigo tem um autor específico

5. **ArticleCategory → KnowledgeBaseArticle** (1:N)
   - Uma categoria pode ter vários artigos
   - Um artigo pertence a uma categoria

6. **User → ArticleRating** (1:N)
   - Um usuário pode avaliar vários artigos
   - Uma avaliação é feita por um usuário

7. **User → Notification** (1:N)
   - Um usuário pode receber várias notificações
   - Uma notificação é para um usuário específico

## 📊 Enums e Tipos

### **Enums do Sistema**

```typescript
// Tipos de canal
type ChannelTypeEnum = 'Mensagens' | 'Email' | 'Chat';

// Modos de tema
type ThemeModeEnum = 'Claro' | 'Escuro';

// Tipos de notificação
type NotificationTypeEnum = 'info' | 'warning' | 'error' | 'success' | 'ticket' | 'conversation';

// Roles de usuário
type UserRoleEnum = 'Agente' | 'Supervisor' | 'Admin';

// Status de conversa
type ConversationStatusEnum = 'Aberta' | 'Fechada' | 'Pendente';

// Dias da semana
type DayOfWeekEnum = 'Segunda' | 'Terca' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sabado' | 'Domingo';

// Prioridades de ticket
type TicketPriorityEnum = 'Baixa' | 'Media' | 'Alta' | 'Urgente';

// Tipos de cliente
type CustomerTypeEnum = 'Individual' | 'Corporativo';
```

## 🎯 KPIs e Métricas

### **Indicadores de Performance**

```typescript
interface KpiData {
  remote_attendances: number;        // Nº de atendimentos remotos
  average_resolution_time: number;   // TMR em minutos
  customer_satisfaction: number;     // CSAT em porcentagem
  period: 'day' | 'week' | 'month';
  date: string;
}
```

### **Estatísticas de Conversas**

```typescript
interface ConversationStats {
  total: number;
  open: number;
  closed: number;
  pending: number;
  by_channel: Record<ChannelTypeEnum, number>;
  by_agent: Record<number, number>;
}
```

### **Estatísticas de Artigos**

```typescript
interface ArticleStats {
  total: number;
  by_category: Record<number, number>;
  by_author: Record<number, number>;
  total_views: number;
  average_rating: number;
}
```

### **Estatísticas de Feedbacks**

```typescript
interface FeedbackStats {
  total: number;
  average_rating: number;
  by_rating: Record<number, number>;
  satisfaction_percentage: number;
  by_agent: Record<number, number>;
}
```

## 🛠️ Serviços e APIs

### **Serviços Principais**

1. **ConversationService** - Gestão de conversas
2. **ArticleService** - Gestão de artigos
3. **FeedbackService** - Gestão de feedbacks
4. **NotificationService** - Gestão de notificações
5. **StatsService** - Estatísticas e métricas
6. **KpiService** - Cálculo de KPIs

### **Operações CRUD**

Cada entidade possui operações básicas:
- `getAll()` - Listar todos
- `getById(id)` - Buscar por ID
- `create(data)` - Criar novo
- `update(id, data)` - Atualizar
- `delete(id)` - Excluir

### **Operações Especializadas**

- **Conversations**: `assignConversation()`, `closeConversation()`
- **Articles**: `incrementViews()`
- **Feedbacks**: `createFeedback()`
- **Notifications**: `markAsRead()`, `markAllAsRead()`

## 📱 Hooks Customizados

### **useConversations**
```typescript
const { conversations, loading, error, createConversation, assignConversation, closeConversation } = useConversations(filters);
```

### **useArticles**
```typescript
const { articles, loading, error, createArticle, incrementViews } = useArticles(filters);
```

### **useFeedbacks**
```typescript
const { feedbacks, loading, error, createFeedback } = useFeedbacks();
```

### **useNotifications**
```typescript
const { notifications, loading, error, createNotification, markAsRead, markAllAsRead } = useNotifications(userId, filters);
```

### **useStats**
```typescript
const { ticketStats, conversationStats, articleStats, feedbackStats, loading, error } = useStats();
```

### **useKpis**
```typescript
const { kpis, loading, error } = useKpis(period);
```

### **useDashboard**
```typescript
const { dashboardStats, loading, error } = useDashboard();
```

## 🔒 Segurança e Validação

### **Row Level Security (RLS)**

O sistema implementa RLS para:
- Usuários só veem suas próprias notificações
- Conversas só são visíveis para clientes e agentes envolvidos
- Feedbacks só são visíveis para usuários envolvidos
- Dados públicos (canais, categorias, artigos publicados)

### **Validações**

- **Conversations**: Status válido, end_time posterior ao start_time
- **Feedbacks**: Rating entre 1-5
- **Articles**: Categoria válida
- **Notifications**: Tipo válido
- **Users**: Email único, role válido

## 📈 Performance e Otimização

### **Índices de Banco**

- `idx_users_email` - Busca por email
- `idx_conversations_customer` - Filtro por cliente
- `idx_conversations_agent` - Filtro por agente
- `idx_conversations_channel` - Filtro por canal
- `idx_conversations_status` - Filtro por status
- `idx_notifications_user` - Notificações por usuário
- `idx_articles_category` - Artigos por categoria
- `idx_articles_author` - Artigos por autor

### **Funções SQL**

```sql
-- Incrementar visualizações de artigos
CREATE OR REPLACE FUNCTION increment_article_views(article_id INTEGER)

-- Calcular estatísticas de tickets
CREATE OR REPLACE FUNCTION get_ticket_stats()

-- Calcular satisfação do cliente
CREATE OR REPLACE FUNCTION get_customer_satisfaction()
```

## 🚀 Dados Mockados

### **Estrutura de Dados Mockados**

O sistema inclui dados mockados completos para desenvolvimento:
- **6 Usuários**: 1 Admin, 1 Supervisor, 2 Agentes, 2 Clientes
- **5 Conversas**: Diferentes status e canais
- **5 Artigos**: Base de conhecimento
- **4 Feedbacks**: Avaliações de clientes
- **4 Notificações**: Diferentes tipos
- **3 Canais**: WhatsApp, Email, Chat
- **5 Categorias**: Artigos organizados
- **4 Regras SLA**: Diferentes prioridades
- **7 Horários**: Funcionamento por dia da semana

### **Simulação de API**

- Delay configurável para simular latência
- Simulação de erros para testes
- Dados consistentes entre sessões
- Fallback automático para modo demo

## 📋 Melhorias Implementadas

### **Simplificação da Estrutura**

1. **Unificação de Usuários**: Agentes e clientes são usuários do sistema
2. **Conversas como Tickets**: Sistema unificado de atendimento
3. **Enums em Português**: Interface mais amigável
4. **Relacionamentos Simplificados**: Menos complexidade

### **Funcionalidades Adicionadas**

1. **Sistema de Notificações**: Notificações em tempo real
2. **Avaliações de Artigos**: Feedback sobre base de conhecimento
3. **Regras SLA**: Controle de tempo de resposta
4. **Horários de Funcionamento**: Controle de disponibilidade
5. **Tema do Usuário**: Modo claro/escuro

### **Otimizações Técnicas**

1. **Índices Específicos**: Performance otimizada
2. **Funções SQL**: Cálculos no banco de dados
3. **RLS Aprimorado**: Segurança por contexto
4. **Hooks Especializados**: Lógica encapsulada

## 🎯 Próximos Passos

### **Funcionalidades Planejadas**

1. **Mensagens**: Sistema de chat em tempo real
2. **Templates**: Respostas padronizadas
3. **Tags**: Categorização de conversas
4. **Anexos**: Upload de arquivos
5. **Relatórios Avançados**: Analytics detalhados

### **Melhorias Técnicas**

1. **WebSocket**: Notificações em tempo real
2. **Cache Redis**: Performance otimizada
3. **Elasticsearch**: Busca avançada
4. **Queue System**: Processamento assíncrono
5. **Monitoring**: Observabilidade completa

---

**Esta estrutura de dados atualizada foi projetada para ser mais simples, eficiente e focada nas necessidades reais de um sistema de atendimento ao cliente, mantendo a flexibilidade para futuras expansões.**
