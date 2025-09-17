# Estrutura de Dados - Cajá Talks

## 📊 Visão Geral

Este documento descreve a estrutura completa de dados implementada no sistema Cajá Talks, baseada no diagrama ERD fornecido. A estrutura foi projetada para suportar todas as funcionalidades de um sistema completo de atendimento ao cliente.

## 🗄️ Entidades Principais

### **1. Usuários e Autenticação**

#### **Roles (Funções)**
```typescript
interface Role {
  id: number;
  name: 'admin' | 'supervisor' | 'agent';
  description: string;
  created_at: string;
  updated_at: string;
}
```

#### **Users (Usuários)**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role_id: number;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  role?: Role;
}
```

### **2. Clientes**

#### **Customers (Clientes)**
```typescript
interface Customer {
  id: number;
  name: string;
  document_number: string;
  email: string;
  phone_number: string;
  customer_type: 'individual' | 'corporate';
  created_at: string;
  updated_at: string;
  // Relacionamentos
  conversations?: Conversation[];
  tickets?: Ticket[];
  attendances?: Attendance[];
  feedbacks?: Feedback[];
  article_ratings?: ArticleRating[];
}
```

### **3. Sistema de Tickets**

#### **Tickets (Tickets)**
```typescript
interface Ticket {
  id: number;
  customer_id: number;
  assigned_to_user_id: number | null;
  conversation_id: number | null;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  // Relacionamentos
  customer?: Customer;
  assigned_to?: User;
  conversation?: Conversation;
}
```

### **4. Sistema de Conversas**

#### **Channels (Canais)**
```typescript
interface Channel {
  id: number;
  name: string;
  channel_type: 'messaging' | 'email' | 'chat';
  credentials: string;
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
  channel_id: number;
  assigned_to_user_id: number | null;
  status: 'open' | 'pending';
  external_conversation_id: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  customer?: Customer;
  channel?: Channel;
  assigned_to?: User;
  tickets?: Ticket[];
  messages?: Message[];
}
```

#### **Messages (Mensagens)**
```typescript
interface Message {
  id: number;
  conversation_id: number;
  sender_type: 'customer' | 'agent';
  sender_id: number; // ID do usuário ou cliente
  content: string;
  created_at: string;
  // Relacionamentos
  conversation?: Conversation;
}
```

### **5. Sistema de Atendimentos**

#### **Attendances (Atendimentos)**
```typescript
interface Attendance {
  id: number;
  customer_id: number;
  agent_id: number;
  start_time: string;
  end_time: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  customer?: Customer;
  agent?: User;
  feedbacks?: Feedback[];
}
```

#### **Feedbacks (Avaliações)**
```typescript
interface Feedback {
  id: number;
  customer_id: number;
  attendance_id: number;
  rating: number; // 1-5
  comments: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  customer?: Customer;
  attendance?: Attendance;
}
```

### **6. Base de Conhecimento**

#### **Article Categories (Categorias de Artigos)**
```typescript
interface ArticleCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
```

#### **Articles (Artigos)**
```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  article_category_id: number;
  views_count: number;
  created_by_user_id: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  category?: ArticleCategory;
  created_by?: User;
  ratings?: ArticleRating[];
}
```

#### **Article Ratings (Avaliações de Artigos)**
```typescript
interface ArticleRating {
  id: number;
  article_id: number;
  user_id: number | null;
  customer_id: number | null;
  rating_value: number; // 1-5
  created_at: string;
  // Relacionamentos
  article?: Article;
  user?: User;
  customer?: Customer;
}
```

### **7. Configurações do Sistema**

#### **Business Hours (Horários de Funcionamento)**
```typescript
interface BusinessHours {
  id: number;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}
```

#### **System Settings (Configurações do Sistema)**
```typescript
interface SystemSettings {
  id: number;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
}
```

#### **SLA Policies (Políticas de SLA)**
```typescript
interface SlaPolicy {
  id: number;
  name: string;
  description: string;
  response_time_minutes: number;
  created_at: string;
  updated_at: string;
}
```

### **8. Notificações e Integrações**

#### **Notifications (Notificações)**
```typescript
interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
  // Relacionamentos
  user?: User;
}
```

#### **Integrations (Integrações)**
```typescript
interface Integration {
  id: number;
  name: string;
  type: 'messaging' | 'crm' | 'analytics' | 'productivity';
  channel_id?: number;
  is_active: boolean;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  channel?: Channel;
}
```

## 🔗 Relacionamentos

### **Relacionamentos Principais**

1. **User → Role** (N:1)
   - Um usuário tem uma função
   - Uma função pode ter vários usuários

2. **Customer → Conversation** (1:N)
   - Um cliente pode ter várias conversas
   - Uma conversa pertence a um cliente

3. **Conversation → Channel** (N:1)
   - Uma conversa usa um canal
   - Um canal pode ter várias conversas

4. **Conversation → User** (N:1)
   - Uma conversa pode ser atribuída a um usuário
   - Um usuário pode ter várias conversas atribuídas

5. **Ticket → Customer** (N:1)
   - Um ticket pertence a um cliente
   - Um cliente pode ter vários tickets

6. **Ticket → User** (N:1)
   - Um ticket pode ser atribuído a um usuário
   - Um usuário pode ter vários tickets atribuídos

7. **Ticket → Conversation** (N:1)
   - Um ticket pode estar associado a uma conversa
   - Uma conversa pode ter vários tickets

8. **Attendance → Customer** (N:1)
   - Um atendimento é para um cliente
   - Um cliente pode ter vários atendimentos

9. **Attendance → User** (N:1)
   - Um atendimento é realizado por um usuário
   - Um usuário pode realizar vários atendimentos

10. **Feedback → Attendance** (N:1)
    - Um feedback é sobre um atendimento
    - Um atendimento pode ter vários feedbacks

11. **Article → ArticleCategory** (N:1)
    - Um artigo pertence a uma categoria
    - Uma categoria pode ter vários artigos

12. **Article → User** (N:1)
    - Um artigo é criado por um usuário
    - Um usuário pode criar vários artigos

## 📊 Enums e Tipos

### **Enums do Sistema**

```typescript
// Funções de usuário
type UserRoleName = 'admin' | 'supervisor' | 'agent';

// Tipos de canal
type ChannelType = 'messaging' | 'email' | 'chat';

// Tipos de remetente de mensagem
type MessageSenderType = 'customer' | 'agent';

// Tipos de cliente
type CustomerType = 'individual' | 'corporate';

// Dias da semana
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Status de conversa
type ConversationStatus = 'open' | 'pending';

// Status de ticket
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

// Prioridade de ticket
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
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

### **Estatísticas de Tickets**

```typescript
interface TicketStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  by_priority: Record<TicketPriority, number>;
  by_status: Record<TicketStatus, number>;
}
```

### **Estatísticas de Conversas**

```typescript
interface ConversationStats {
  total: number;
  open: number;
  pending: number;
  by_channel: Record<ChannelType, number>;
}
```

### **Estatísticas de Atendimentos**

```typescript
interface AttendanceStats {
  total: number;
  active: number;
  completed: number;
  average_duration: number; // em minutos
  by_agent: Record<number, number>;
}
```

### **Estatísticas de Feedbacks**

```typescript
interface FeedbackStats {
  total: number;
  average_rating: number;
  by_rating: Record<number, number>; // 1-5
  satisfaction_percentage: number;
}
```

## 🛠️ Serviços e APIs

### **Serviços Principais**

1. **TicketService** - Gestão de tickets
2. **ConversationService** - Gestão de conversas
3. **ArticleService** - Gestão de artigos
4. **AttendanceService** - Gestão de atendimentos
5. **FeedbackService** - Gestão de feedbacks
6. **KpiService** - Cálculo de KPIs

### **Operações CRUD**

Cada entidade possui operações básicas:
- `getAll()` - Listar todos
- `getById(id)` - Buscar por ID
- `create(data)` - Criar novo
- `update(id, data)` - Atualizar
- `delete(id)` - Excluir

### **Operações Especializadas**

- **Tickets**: `assignTicket()`, `updateTicketStatus()`
- **Conversations**: `assignConversation()`
- **Articles**: `incrementViews()`
- **Attendances**: `endAttendance()`
- **Feedbacks**: `createFeedback()`

## 📱 Hooks Customizados

### **useTickets**
```typescript
const { tickets, loading, error, createTicket, updateTicket, deleteTicket, assignTicket } = useTickets(filters);
```

### **useConversations**
```typescript
const { conversations, loading, error, createConversation, assignConversation } = useConversations(filters);
```

### **useArticles**
```typescript
const { articles, loading, error, createArticle, incrementViews } = useArticles(filters);
```

### **useAttendances**
```typescript
const { attendances, loading, error, createAttendance, endAttendance } = useAttendances();
```

### **useFeedbacks**
```typescript
const { feedbacks, loading, error, createFeedback } = useFeedbacks();
```

### **useStats**
```typescript
const { ticketStats, conversationStats, attendanceStats, feedbackStats, loading, error } = useStats();
```

### **useKpis**
```typescript
const { kpis, loading, error } = useKpis(period);
```

## 🔒 Segurança e Validação

### **Row Level Security (RLS)**

O sistema implementa RLS para:
- Usuários só veem seus próprios dados
- Tickets só são visíveis para usuários atribuídos ou admins
- Conversas só são visíveis para usuários atribuídos ou admins
- Mensagens só são visíveis para usuários da conversa

### **Validações**

- **Tickets**: Status e prioridade válidos
- **Feedbacks**: Rating entre 1-5
- **Articles**: Categoria válida
- **Attendances**: End time posterior ao start time
- **Messages**: Sender type válido

## 📈 Performance e Otimização

### **Índices de Banco**

- `idx_users_email` - Busca por email
- `idx_tickets_status` - Filtro por status
- `idx_tickets_priority` - Filtro por prioridade
- `idx_tickets_assigned_to` - Filtro por usuário atribuído
- `idx_conversations_status` - Filtro por status
- `idx_attendances_agent` - Filtro por agente
- `idx_messages_conversation` - Busca por conversa

### **Paginação**

Todas as listagens suportam paginação:
```typescript
interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### **Filtros Avançados**

```typescript
interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_to_user_id?: number;
  customer_id?: number;
  created_after?: string;
  created_before?: string;
}
```

## 🚀 Dados Mockados

### **Estrutura de Dados Mockados**

O sistema inclui dados mockados completos para desenvolvimento:
- 4 usuários (admin, supervisor, 2 agentes)
- 4 clientes (2 individuais, 2 corporativos)
- 5 tickets com diferentes status e prioridades
- 4 conversas em diferentes canais
- 5 artigos em diferentes categorias
- 4 atendimentos com feedbacks
- Configurações do sistema
- Políticas de SLA
- Horários de funcionamento

### **Simulação de API**

- Delay configurável para simular latência
- Simulação de erros para testes
- Dados consistentes entre sessões
- Fallback automático para modo demo

## 📋 Próximos Passos

### **Funcionalidades Planejadas**

1. **Tempo Real**: WebSocket para notificações
2. **Auditoria**: Log de todas as operações
3. **Backup**: Sistema de backup automático
4. **Analytics**: Métricas avançadas
5. **API REST**: Endpoints para integração
6. **Webhooks**: Eventos em tempo real
7. **Multi-tenant**: Suporte a múltiplas empresas

### **Melhorias Técnicas**

1. **Cache**: Redis para performance
2. **Search**: Elasticsearch para busca avançada
3. **Queue**: Sistema de filas para processamento
4. **Monitoring**: Observabilidade completa
5. **Testing**: Cobertura de testes 100%

---

**Esta estrutura de dados foi projetada para ser escalável, flexível e fácil de manter, suportando todas as funcionalidades necessárias para um sistema completo de atendimento ao cliente.**
