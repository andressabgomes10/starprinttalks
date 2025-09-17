// Enums baseados no novo ERD
export type ChannelTypeEnum = 'Mensagens' | 'Email' | 'Chat';
export type ThemeModeEnum = 'Claro' | 'Escuro';
export type MessageSenderTypeEnum = 'Agente' | 'Cliente';
export type NotificationTypeEnum = 'info' | 'warning' | 'error' | 'success' | 'ticket' | 'conversation';
export type UserRoleEnum = 'Agente' | 'Supervisor' | 'Admin';
export type ConversationStatusEnum = 'Aberta' | 'Fechada' | 'Pendente';
export type DayOfWeekEnum = 'Segunda' | 'Terca' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sabado' | 'Domingo';
export type TicketPriorityEnum = 'Baixa' | 'Media' | 'Alta' | 'Urgente';
export type CustomerTypeEnum = 'Individual' | 'Corporativo';

// Entidades principais
export interface Channel {
  id: number;
  name: string;
  type: ChannelTypeEnum;
  credentials: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRoleEnum;
  theme_mode: ThemeModeEnum;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationTypeEnum;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  user?: User;
}

export interface ArticleCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseArticle {
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

export interface ArticleRating {
  id: number;
  article_id: number;
  user_id: number;
  rating: number;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  article?: KnowledgeBaseArticle;
  user?: User;
}

export interface Conversation {
  id: number;
  customer_id: number;
  agent_id: number | null;
  channel_id: number;
  status: ConversationStatusEnum;
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

export interface Feedback {
  id: number;
  ticket_id: number;
  customer_id: number;
  agent_id: number;
  rating: number;
  comments: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  ticket?: Conversation;
  customer?: User;
  agent?: User;
}

export interface SlaRule {
  id: number;
  name: string;
  description: string | null;
  priority: TicketPriorityEnum;
  response_time_limit_minutes: number;
  resolution_time_limit_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface OperatingHours {
  id: number;
  day_of_week: DayOfWeekEnum;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  customer_type: CustomerTypeEnum | null;
  created_at: string;
  updated_at: string;
}

// Tipos para operações CRUD
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
  theme_mode?: ThemeModeEnum;
}

export interface CreateConversationData {
  customer_id: number;
  channel_id: number;
  agent_id?: number;
  status?: ConversationStatusEnum;
}

export interface CreateKnowledgeBaseArticleData {
  title: string;
  content: string;
  category_id?: number;
  author_id: number;
}

export interface CreateFeedbackData {
  ticket_id: number;
  customer_id: number;
  agent_id: number;
  rating: number;
  comments?: string;
}

export interface CreateNotificationData {
  user_id: number;
  type: NotificationTypeEnum;
  message: string;
}

// Tipos para filtros e busca
export interface ConversationFilters {
  status?: ConversationStatusEnum;
  customer_id?: number;
  agent_id?: number;
  channel_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface ArticleFilters {
  category_id?: number;
  author_id?: number;
  search?: string;
}

export interface NotificationFilters {
  user_id?: number;
  type?: NotificationTypeEnum;
  is_read?: boolean;
}

// Tipos para estatísticas
export interface TicketStats {
  total_tickets: number;
  open_tickets: number;
  closed_tickets: number;
  pending_tickets: number;
  by_priority: Record<TicketPriorityEnum, number>;
  by_status: Record<ConversationStatusEnum, number>;
}

export interface ConversationStats {
  total: number;
  open: number;
  closed: number;
  pending: number;
  by_channel: Record<ChannelTypeEnum, number>;
  by_agent: Record<number, number>;
}

export interface ArticleStats {
  total: number;
  by_category: Record<number, number>;
  by_author: Record<number, number>;
  total_views: number;
  average_rating: number;
}

export interface FeedbackStats {
  total: number;
  average_rating: number;
  by_rating: Record<number, number>;
  satisfaction_percentage: number;
  by_agent: Record<number, number>;
}

// Tipos para KPIs
export interface KpiData {
  remote_attendances: number;
  average_resolution_time: number; // em minutos
  customer_satisfaction: number; // porcentagem
  period: 'day' | 'week' | 'month';
  date: string;
}

// Tipos para relatórios
export interface ReportData {
  period: string;
  tickets: TicketStats;
  conversations: ConversationStats;
  articles: ArticleStats;
  feedbacks: FeedbackStats;
  kpis: KpiData[];
}

// Tipos para configurações
export interface AppConfig {
  operating_hours: OperatingHours[];
  sla_rules: SlaRule[];
  channels: Channel[];
  article_categories: ArticleCategory[];
}

// Tipos para notificações em tempo real
export interface RealtimeNotification {
  type: 'conversation_created' | 'conversation_updated' | 'feedback_received' | 'article_created';
  data: any;
  timestamp: string;
}

// Tipos para mensagens (se implementado no futuro)
export interface Message {
  id: number;
  conversation_id: number;
  sender_type: MessageSenderTypeEnum;
  sender_id: number;
  content: string;
  created_at: string;
}

// Tipos para integrações (se implementado no futuro)
export interface Integration {
  id: number;
  name: string;
  type: 'messaging' | 'crm' | 'analytics' | 'productivity';
  channel_id?: number;
  is_active: boolean;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Tipos para busca
export interface SearchResult {
  type: 'conversation' | 'article' | 'user' | 'customer';
  id: number;
  title: string;
  description: string;
  url: string;
  score: number;
}

// Tipos para paginação
export interface PaginationOptions {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Tipos para dashboard
export interface DashboardStats {
  active_conversations: number;
  open_tickets: number;
  total_users: number;
  satisfaction: number;
  articles_count: number;
  feedbacks_count: number;
}

// Tipos para configurações do usuário
export interface UserSettings {
  theme_mode: ThemeModeEnum;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    tickets: boolean;
    conversations: boolean;
  };
  language: 'pt' | 'en' | 'es';
  timezone: string;
}

// Tipos para auditoria (se implementado no futuro)
export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  table_name: string;
  record_id: number;
  old_values: Record<string, any>;
  new_values: Record<string, any>;
  created_at: string;
}

// Tipos para webhooks (se implementado no futuro)
export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature: string;
}

// Tipos para analytics
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: string;
  user_id?: number;
}

// Tipos para exportação
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  date_range: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

// Tipos para SLA
export interface SlaMetrics {
  response_time: number; // em minutos
  resolution_time: number; // em minutos
  compliance_rate: number; // porcentagem
  violations: number;
}

// Tipos para relatórios de performance
export interface PerformanceReport {
  agent_id: number;
  agent_name: string;
  conversations_handled: number;
  average_resolution_time: number;
  customer_satisfaction: number;
  sla_compliance: number;
  period: string;
}

// Tipos para configurações de notificação
export interface NotificationSettings {
  user_id: number;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  ticket_notifications: boolean;
  conversation_notifications: boolean;
  marketing_notifications: boolean;
}

// Tipos para templates (se implementado no futuro)
export interface MessageTemplate {
  id: number;
  name: string;
  content: string;
  category: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Tipos para tags (se implementado no futuro)
export interface Tag {
  id: number;
  name: string;
  color: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Tipos para anexos (se implementado no futuro)
export interface Attachment {
  id: number;
  conversation_id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  uploaded_by: number;
  created_at: string;
}