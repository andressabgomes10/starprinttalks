/**
 * API Service para Star Print Talks
 * Conecta com Cloudflare Worker + D1 Database (com fallback para mock data)
 */

import { MockAPI } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://starprinttalks-api.andressagomes-adm.workers.dev'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true; // Forçar mock data por enquanto

// Helper para fazer requisições
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
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
  } catch (error) {
    console.warn('API request failed, using mock data:', error);
    throw error;
  }
}

// Simulate API delay for mock data
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// API para Usuários
export const usersApi = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MockAPI.getUsers();
    }
    return request<any[]>('/api/users');
  },
  create: async (user: any) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MockAPI.createUser(user);
    }
    return request<any>('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },
}

// API para Clientes
export const clientsApi = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MockAPI.getClients();
    }
    return request<any[]>('/api/clients');
  },
  create: async (client: any) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MockAPI.createClient(client);
    }
    return request<any>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  },
  update: async (id: string, client: any) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const updated = MockAPI.updateClient(id, client);
      if (!updated) throw new Error('Client not found');
      return updated;
    }
    return request<any>(`/api/clients?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  },
  delete: async (id: string) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const deleted = MockAPI.deleteClient(id);
      if (!deleted) throw new Error('Client not found');
      return;
    }
    return request<void>(`/api/clients?id=${id}`, {
      method: 'DELETE',
    });
  },
}

// API para Tickets
export const ticketsApi = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MockAPI.getTickets();
    }
    return request<any[]>('/api/tickets');
  },
  create: async (ticket: any) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MockAPI.createTicket(ticket);
    }
    return request<any>('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  },
  update: async (id: string, ticket: any) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const updated = MockAPI.updateTicket(id, ticket);
      if (!updated) throw new Error('Ticket not found');
      return updated;
    }
    return request<any>(`/api/tickets?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticket),
    });
  },
  delete: async (id: string) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const deleted = MockAPI.deleteTicket(id);
      if (!deleted) throw new Error('Ticket not found');
      return;
    }
    return request<void>(`/api/tickets?id=${id}`, {
      method: 'DELETE',
    });
  },
}

// API para Conversas
export const conversationsApi = {
  getByTicket: async (ticketId: string) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MockAPI.getConversations(ticketId);
    }
    return request<any[]>(`/api/conversations?ticket_id=${ticketId}`);
  },
  create: async (conversation: any) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MockAPI.createConversation(conversation);
    }
    return request<any>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(conversation),
    });
  },
}

// API para Notificações
export const notificationsApi = {
  getByUser: async (userId: string) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return []; // Mock empty notifications for now
    }
    return request<any[]>(`/api/notifications?user_id=${userId}`);
  },
  create: async (notification: any) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return notification; // Mock return
    }
    return request<any>('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  },
  markAsRead: async (id: string) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { id, is_read: true }; // Mock return
    }
    return request<any>(`/api/notifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read: true }),
    });
  },
}

// API para Dashboard
export const dashboardApi = {
  getStats: async () => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MockAPI.getDashboardStats();
    }
    return request<{
      active_conversations: number;
      open_tickets: number;
      active_clients: number;
      satisfaction: number;
      ticket_stats: Array<{ status: string; count: number }>;
    }>('/api/dashboard/stats');
  },
}

// API para IA
export const aiApi = {
  assist: async (message: string, context?: string) => {
    if (USE_MOCK_DATA) {
      await simulateDelay(1000);
      // Mock AI responses
      const responses = [
        "Olá! Como posso ajudá-lo hoje? Estou aqui para auxiliar com suas dúvidas sobre tickets, clientes e sistema.",
        "Entendo sua solicitação. Vou verificar as informações e retornar com uma resposta em breve.",
        "Baseado no contexto fornecido, sugiro que verifiquemos primeiro os logs do sistema e depois analisemos as configurações.",
        "Esta é uma questão interessante! Posso ajudá-lo a encontrar a melhor solução para seu problema."
      ];
      return {
        response: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString()
      };
    }
    return request<{ response: string; timestamp: string }>('/api/ai/assist', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  },
}

// Health check
export const healthApi = {
  check: async () => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Star Print Talks API (Mock)'
      };
    }
    return request<{ status: string; timestamp: string; service: string }>('/health');
  },
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