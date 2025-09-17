// Re-exporta todos os tipos do database
export * from './database';

// Tipos globais da aplicação
export type PageType = 'dashboard' | 'tickets' | 'reports' | 'knowledge-base' | 'integrations' | 'settings';

// Tipos de compatibilidade para componentes existentes
export interface TicketWithDetails {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: User;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Tipos para componentes de UI
export interface ActionConfig {
  label: string;
  icon?: React.ComponentType<any>;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Tipos para estatísticas do dashboard
export interface DashboardStats {
  activeConversations: number;
  openTickets: number;
  activeCustomers: number;
  satisfaction: number;
}

// Tipos para relatórios
export interface ReportFilters {
  timeRange: '1d' | '7d' | '30d' | '90d';
  metric: 'all' | 'tickets' | 'conversations' | 'satisfaction';
}

// Tipos para configurações
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    tickets: boolean;
    mentions: boolean;
    marketing: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: 'pt' | 'en' | 'es';
    timezone: string;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
    timeFormat: '12h' | '24h';
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    passwordExpiration: number;
    loginNotifications: boolean;
    apiAccess: boolean;
  };
}

// Tipos para notificações em tempo real
export interface RealtimeNotification {
  type: 'ticket_created' | 'ticket_updated' | 'conversation_new' | 'message_received';
  data: any;
  timestamp: string;
}

// Tipos para webhooks
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
  userId?: number;
}

// Tipos para exportação
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

// Tipos para busca
export interface SearchResult {
  type: 'ticket' | 'conversation' | 'article' | 'customer';
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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
