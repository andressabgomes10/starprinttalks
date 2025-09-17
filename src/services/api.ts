/**
 * API Service para Star Print Talks
 * Conecta com Cloudflare Worker + D1 Database
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://starprinttalks-api.andressagomes-adm.workers.dev'

// Helper para fazer requisições
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// API para Usuários
export const usersApi = {
  getAll: () => request<any[]>('/api/users'),
  create: (user: any) => request<any>('/api/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
}

// API para Clientes
export const clientsApi = {
  getAll: () => request<any[]>('/api/clients'),
  create: (client: any) => request<any>('/api/clients', {
    method: 'POST',
    body: JSON.stringify(client),
  }),
  update: (id: string, client: any) => request<any>(`/api/clients?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(client),
  }),
  delete: (id: string) => request<void>(`/api/clients?id=${id}`, {
    method: 'DELETE',
  }),
}

// API para Tickets
export const ticketsApi = {
  getAll: () => request<any[]>('/api/tickets'),
  create: (ticket: any) => request<any>('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(ticket),
  }),
  update: (id: string, ticket: any) => request<any>(`/api/tickets?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(ticket),
  }),
  delete: (id: string) => request<void>(`/api/tickets?id=${id}`, {
    method: 'DELETE',
  }),
}

// API para Conversas
export const conversationsApi = {
  getByTicket: (ticketId: string) => request<any[]>(`/api/conversations?ticket_id=${ticketId}`),
  create: (conversation: any) => request<any>('/api/conversations', {
    method: 'POST',
    body: JSON.stringify(conversation),
  }),
}

// API para Notificações
export const notificationsApi = {
  getByUser: (userId: string) => request<any[]>(`/api/notifications?user_id=${userId}`),
  create: (notification: any) => request<any>('/api/notifications', {
    method: 'POST',
    body: JSON.stringify(notification),
  }),
  markAsRead: (id: string) => request<any>(`/api/notifications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ is_read: true }),
  }),
}

// API para Dashboard
export const dashboardApi = {
  getStats: () => request<{
    active_conversations: number;
    open_tickets: number;
    active_clients: number;
    satisfaction: number;
    ticket_stats: Array<{ status: string; count: number }>;
  }>('/api/dashboard/stats'),
}

// API para IA
export const aiApi = {
  assist: (message: string, context?: string) => request<{ response: string; timestamp: string }>('/api/ai/assist', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  }),
}

// Health check
export const healthApi = {
  check: () => request<{ status: string; timestamp: string; service: string }>('/health'),
}

// Exportar todas as APIs
export const api = {
  users: usersApi,
  clients: clientsApi,
  tickets: ticketsApi,
  conversations: conversationsApi,
  notifications: notificationsApi,
  dashboard: dashboardApi,
  ai: aiApi,
  health: healthApi,
}

export default api