import type {
  User, Conversation, KnowledgeBaseArticle, Feedback, Notification,
  Channel, ArticleCategory, SlaRule, OperatingHours, Customer,
  TicketStats, ConversationStats, ArticleStats, FeedbackStats,
  KpiData, DashboardStats
} from '../types/database';

// Dados mockados baseados no novo ERD
export const mockChannels: Channel[] = [
  { id: 1, name: 'WhatsApp Business', type: 'Mensagens', credentials: { api_key: '***', webhook: '***' }, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Email', type: 'Email', credentials: { smtp: '***', imap: '***' }, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Chat Online', type: 'Chat', credentials: { widget_id: '***' }, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];

export const mockUsers: User[] = [
  { id: 1, name: 'João Silva', email: 'joao@cajatalks.com', password_hash: '***', role: 'Admin', theme_mode: 'Claro', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Maria Santos', email: 'maria@cajatalks.com', password_hash: '***', role: 'Supervisor', theme_mode: 'Claro', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Pedro Costa', email: 'pedro@cajatalks.com', password_hash: '***', role: 'Agente', theme_mode: 'Escuro', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Ana Oliveira', email: 'ana@cajatalks.com', password_hash: '***', role: 'Agente', theme_mode: 'Claro', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'Cliente ABC', email: 'cliente@empresaabc.com', password_hash: '***', role: 'Agente', theme_mode: 'Claro', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 6, name: 'Cliente XYZ', email: 'cliente@empresaxyz.com', password_hash: '***', role: 'Agente', theme_mode: 'Claro', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];

export const mockArticleCategories: ArticleCategory[] = [
  { id: 1, name: 'Técnico', description: 'Artigos técnicos e configurações', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Faturamento', description: 'Questões relacionadas a cobrança', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Conta', description: 'Gerenciamento de perfil e configurações', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Integrações', description: 'APIs e conectores', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'Geral', description: 'Informações gerais e FAQ', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];

export const mockKnowledgeBaseArticles: KnowledgeBaseArticle[] = [
  { id: 1, title: 'Como configurar autenticação de dois fatores', content: 'Guia passo a passo para ativar a autenticação de dois fatores...', category_id: 3, author_id: 1, views_count: 1247, created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-15T00:00:00Z', category: mockArticleCategories[2], author: mockUsers[0] },
  { id: 2, title: 'Integração com WhatsApp Business API', content: 'Configure a integração com WhatsApp Business API...', category_id: 4, author_id: 2, views_count: 892, created_at: '2024-01-08T00:00:00Z', updated_at: '2024-01-12T00:00:00Z', category: mockArticleCategories[3], author: mockUsers[1] },
  { id: 3, title: 'Solução de problemas de faturamento', content: 'Resolva os problemas mais comuns relacionados ao faturamento...', category_id: 2, author_id: 1, views_count: 1563, created_at: '2024-01-05T00:00:00Z', updated_at: '2024-01-10T00:00:00Z', category: mockArticleCategories[1], author: mockUsers[0] },
  { id: 4, title: 'Configuração de webhooks', content: 'Aprenda a configurar webhooks para receber notificações...', category_id: 4, author_id: 2, views_count: 567, created_at: '2024-01-12T00:00:00Z', updated_at: '2024-01-18T00:00:00Z', category: mockArticleCategories[3], author: mockUsers[1] },
  { id: 5, title: 'Guia de boas práticas de atendimento', content: 'Dicas e melhores práticas para um atendimento de qualidade...', category_id: 5, author_id: 1, views_count: 2341, created_at: '2024-01-03T00:00:00Z', updated_at: '2024-01-08T00:00:00Z', category: mockArticleCategories[4], author: mockUsers[0] }
];

export const mockConversations: Conversation[] = [
  { id: 1, customer_id: 5, agent_id: 3, channel_id: 1, status: 'Aberta', start_time: '2024-01-20T10:00:00Z', end_time: null, created_at: '2024-01-20T10:00:00Z', updated_at: '2024-01-20T10:00:00Z', customer: mockUsers[4], agent: mockUsers[2], channel: mockChannels[0] },
  { id: 2, customer_id: 6, agent_id: 4, channel_id: 2, status: 'Aberta', start_time: '2024-01-20T09:30:00Z', end_time: null, created_at: '2024-01-20T09:30:00Z', updated_at: '2024-01-20T09:30:00Z', customer: mockUsers[5], agent: mockUsers[3], channel: mockChannels[1] },
  { id: 3, customer_id: 5, agent_id: null, channel_id: 3, status: 'Pendente', start_time: '2024-01-20T11:15:00Z', end_time: null, created_at: '2024-01-20T11:15:00Z', updated_at: '2024-01-20T11:15:00Z', customer: mockUsers[4], channel: mockChannels[2] },
  { id: 4, customer_id: 6, agent_id: 3, channel_id: 1, status: 'Fechada', start_time: '2024-01-20T08:45:00Z', end_time: '2024-01-20T10:00:00Z', created_at: '2024-01-20T08:45:00Z', updated_at: '2024-01-20T10:00:00Z', customer: mockUsers[5], agent: mockUsers[2], channel: mockChannels[0] },
  { id: 5, customer_id: 5, agent_id: 4, channel_id: 2, status: 'Fechada', start_time: '2024-01-19T14:20:00Z', end_time: '2024-01-19T16:45:00Z', created_at: '2024-01-19T14:20:00Z', updated_at: '2024-01-19T16:45:00Z', customer: mockUsers[4], agent: mockUsers[3], channel: mockChannels[1] }
];

export const mockFeedbacks: Feedback[] = [
  { id: 1, ticket_id: 1, customer_id: 5, agent_id: 3, rating: 5, comments: 'Excelente atendimento, muito rápido e eficiente!', created_at: '2024-01-20T10:50:00Z', updated_at: '2024-01-20T10:50:00Z', ticket: mockConversations[0], customer: mockUsers[4], agent: mockUsers[2] },
  { id: 2, ticket_id: 2, customer_id: 6, agent_id: 4, rating: 4, comments: 'Bom atendimento, mas poderia ser mais rápido', created_at: '2024-01-20T10:20:00Z', updated_at: '2024-01-20T10:20:00Z', ticket: mockConversations[1], customer: mockUsers[5], agent: mockUsers[3] },
  { id: 3, ticket_id: 4, customer_id: 6, agent_id: 3, rating: 5, comments: 'Perfeito! Resolveu meu problema rapidamente', created_at: '2024-01-20T09:35:00Z', updated_at: '2024-01-20T09:35:00Z', ticket: mockConversations[3], customer: mockUsers[5], agent: mockUsers[2] },
  { id: 4, ticket_id: 5, customer_id: 5, agent_id: 4, rating: 3, comments: 'Atendimento ok, mas demorou para responder', created_at: '2024-01-19T17:00:00Z', updated_at: '2024-01-19T17:00:00Z', ticket: mockConversations[4], customer: mockUsers[4], agent: mockUsers[3] }
];

export const mockNotifications: Notification[] = [
  { id: 1, user_id: 1, type: 'ticket', message: 'Novo ticket criado: #1234', is_read: false, created_at: '2024-01-20T10:00:00Z', updated_at: '2024-01-20T10:00:00Z', user: mockUsers[0] },
  { id: 2, user_id: 2, type: 'conversation', message: 'Conversa atribuída para você', is_read: false, created_at: '2024-01-20T09:30:00Z', updated_at: '2024-01-20T09:30:00Z', user: mockUsers[1] },
  { id: 3, user_id: 3, type: 'feedback', message: 'Novo feedback recebido: 5 estrelas', is_read: true, created_at: '2024-01-20T10:50:00Z', updated_at: '2024-01-20T10:50:00Z', user: mockUsers[2] },
  { id: 4, user_id: 4, type: 'ticket', message: 'Ticket #1235 foi fechado', is_read: true, created_at: '2024-01-20T08:45:00Z', updated_at: '2024-01-20T08:45:00Z', user: mockUsers[3] }
];

export const mockSlaRules: SlaRule[] = [
  { id: 1, name: 'Baixa Prioridade', description: 'Tickets de baixa prioridade', priority: 'Baixa', response_time_limit_minutes: 1440, resolution_time_limit_minutes: 2880, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Média Prioridade', description: 'Tickets de média prioridade', priority: 'Media', response_time_limit_minutes: 480, resolution_time_limit_minutes: 1440, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Alta Prioridade', description: 'Tickets de alta prioridade', priority: 'Alta', response_time_limit_minutes: 120, resolution_time_limit_minutes: 480, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Urgente', description: 'Tickets urgentes', priority: 'Urgente', response_time_limit_minutes: 30, resolution_time_limit_minutes: 120, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];

export const mockOperatingHours: OperatingHours[] = [
  { id: 1, day_of_week: 'Segunda', start_time: '08:00', end_time: '18:00', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, day_of_week: 'Terca', start_time: '08:00', end_time: '18:00', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, day_of_week: 'Quarta', start_time: '08:00', end_time: '18:00', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, day_of_week: 'Quinta', start_time: '08:00', end_time: '18:00', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 5, day_of_week: 'Sexta', start_time: '08:00', end_time: '18:00', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 6, day_of_week: 'Sabado', start_time: '09:00', end_time: '13:00', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 7, day_of_week: 'Domingo', start_time: '09:00', end_time: '13:00', is_active: false, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];

export const mockCustomers: Customer[] = [
  { id: 1, name: 'Empresa ABC Ltda', customer_type: 'Corporativo', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'João da Silva', customer_type: 'Individual', created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z' },
  { id: 3, name: 'Maria Santos', customer_type: 'Individual', created_at: '2024-01-03T00:00:00Z', updated_at: '2024-01-03T00:00:00Z' },
  { id: 4, name: 'Tech Solutions Inc', customer_type: 'Corporativo', created_at: '2024-01-04T00:00:00Z', updated_at: '2024-01-04T00:00:00Z' }
];

// Estatísticas mockadas
export const mockTicketStats: TicketStats = {
  total_tickets: mockConversations.length,
  open_tickets: mockConversations.filter(c => c.status === 'Aberta').length,
  closed_tickets: mockConversations.filter(c => c.status === 'Fechada').length,
  pending_tickets: mockConversations.filter(c => c.status === 'Pendente').length,
  by_priority: { 'Baixa': 1, 'Media': 2, 'Alta': 1, 'Urgente': 1 },
  by_status: { 'Aberta': 2, 'Fechada': 2, 'Pendente': 1 }
};

export const mockConversationStats: ConversationStats = {
  total: mockConversations.length,
  open: mockConversations.filter(c => c.status === 'Aberta').length,
  closed: mockConversations.filter(c => c.status === 'Fechada').length,
  pending: mockConversations.filter(c => c.status === 'Pendente').length,
  by_channel: {
    'Mensagens': mockConversations.filter(c => c.channel?.type === 'Mensagens').length,
    'Email': mockConversations.filter(c => c.channel?.type === 'Email').length,
    'Chat': mockConversations.filter(c => c.channel?.type === 'Chat').length
  },
  by_agent: {
    3: mockConversations.filter(c => c.agent_id === 3).length,
    4: mockConversations.filter(c => c.agent_id === 4).length
  }
};

export const mockArticleStats: ArticleStats = {
  total: mockKnowledgeBaseArticles.length,
  by_category: {
    1: mockKnowledgeBaseArticles.filter(a => a.category_id === 1).length,
    2: mockKnowledgeBaseArticles.filter(a => a.category_id === 2).length,
    3: mockKnowledgeBaseArticles.filter(a => a.category_id === 3).length,
    4: mockKnowledgeBaseArticles.filter(a => a.category_id === 4).length,
    5: mockKnowledgeBaseArticles.filter(a => a.category_id === 5).length
  },
  by_author: {
    1: mockKnowledgeBaseArticles.filter(a => a.author_id === 1).length,
    2: mockKnowledgeBaseArticles.filter(a => a.author_id === 2).length
  },
  total_views: mockKnowledgeBaseArticles.reduce((sum, a) => sum + a.views_count, 0),
  average_rating: 4.2
};

export const mockFeedbackStats: FeedbackStats = {
  total: mockFeedbacks.length,
  average_rating: mockFeedbacks.reduce((sum, f) => sum + f.rating, 0) / mockFeedbacks.length,
  by_rating: {
    1: mockFeedbacks.filter(f => f.rating === 1).length,
    2: mockFeedbacks.filter(f => f.rating === 2).length,
    3: mockFeedbacks.filter(f => f.rating === 3).length,
    4: mockFeedbacks.filter(f => f.rating === 4).length,
    5: mockFeedbacks.filter(f => f.rating === 5).length
  },
  satisfaction_percentage: (mockFeedbacks.filter(f => f.rating >= 4).length / mockFeedbacks.length) * 100,
  by_agent: {
    3: mockFeedbacks.filter(f => f.agent_id === 3).length,
    4: mockFeedbacks.filter(f => f.agent_id === 4).length
  }
};

export const mockDashboardStats: DashboardStats = {
  active_conversations: mockConversationStats.open,
  open_tickets: mockTicketStats.open_tickets,
  total_users: mockUsers.length,
  satisfaction: mockFeedbackStats.satisfaction_percentage,
  articles_count: mockKnowledgeBaseArticles.length,
  feedbacks_count: mockFeedbacks.length
};

export const mockKpiData: KpiData[] = [
  {
    remote_attendances: 15,
    average_resolution_time: 120, // 2 horas em minutos
    customer_satisfaction: 87.5,
    period: 'day',
    date: '2024-01-20T00:00:00Z'
  },
  {
    remote_attendances: 98,
    average_resolution_time: 135,
    customer_satisfaction: 89.2,
    period: 'week',
    date: '2024-01-14T00:00:00Z'
  },
  {
    remote_attendances: 420,
    average_resolution_time: 142,
    customer_satisfaction: 91.8,
    period: 'month',
    date: '2024-01-01T00:00:00Z'
  }
];

// Funções utilitárias para dados mockados
export const getMockData = {
  users: () => mockUsers,
  conversations: () => mockConversations,
  articles: () => mockKnowledgeBaseArticles,
  feedbacks: () => mockFeedbacks,
  notifications: () => mockNotifications,
  channels: () => mockChannels,
  articleCategories: () => mockArticleCategories,
  slaRules: () => mockSlaRules,
  operatingHours: () => mockOperatingHours,
  customers: () => mockCustomers,
  stats: {
    tickets: () => mockTicketStats,
    conversations: () => mockConversationStats,
    articles: () => mockArticleStats,
    feedbacks: () => mockFeedbackStats,
    dashboard: () => mockDashboardStats
  },
  kpis: () => mockKpiData
};

// Função para simular delay de API
export const simulateApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Função para simular erro de API
export const simulateApiError = (message: string = 'Erro interno do servidor') => 
  Promise.reject(new Error(message));