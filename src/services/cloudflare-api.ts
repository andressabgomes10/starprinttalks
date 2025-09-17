/**
 * Serviço para integração com Cloudflare Workers API
 */

const CLOUDFLARE_API_BASE = 'https://starprinttalks-api.your-subdomain.workers.dev'

export interface CloudflareAPIResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

export class CloudflareAPIService {
  private baseURL: string

  constructor(baseURL: string = CLOUDFLARE_API_BASE) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<CloudflareAPIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Health check
  async healthCheck(): Promise<CloudflareAPIResponse<{ status: string; timestamp: string }>> {
    return this.request('/health')
  }

  // Users
  async getUsers(): Promise<CloudflareAPIResponse<any[]>> {
    return this.request('/api/users')
  }

  // Clients
  async getClients(): Promise<CloudflareAPIResponse<any[]>> {
    return this.request('/api/clients')
  }

  async createClient(clientData: any): Promise<CloudflareAPIResponse<any>> {
    return this.request('/api/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    })
  }

  async updateClient(id: string, clientData: any): Promise<CloudflareAPIResponse<any>> {
    return this.request(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    })
  }

  async deleteClient(id: string): Promise<CloudflareAPIResponse<void>> {
    return this.request(`/api/clients/${id}`, {
      method: 'DELETE',
    })
  }

  // Tickets
  async getTickets(): Promise<CloudflareAPIResponse<any[]>> {
    return this.request('/api/tickets')
  }

  async createTicket(ticketData: any): Promise<CloudflareAPIResponse<any>> {
    return this.request('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    })
  }

  async updateTicket(id: string, ticketData: any): Promise<CloudflareAPIResponse<any>> {
    return this.request(`/api/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    })
  }

  async deleteTicket(id: string): Promise<CloudflareAPIResponse<void>> {
    return this.request(`/api/tickets/${id}`, {
      method: 'DELETE',
    })
  }

  // Conversations
  async getConversations(ticketId: string): Promise<CloudflareAPIResponse<any[]>> {
    return this.request(`/api/conversations?ticket_id=${ticketId}`)
  }

  async createConversation(conversationData: any): Promise<CloudflareAPIResponse<any>> {
    return this.request('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    })
  }

  // Notifications
  async getNotifications(userId: string): Promise<CloudflareAPIResponse<any[]>> {
    return this.request(`/api/notifications?user_id=${userId}`)
  }

  async markNotificationAsRead(id: string): Promise<CloudflareAPIResponse<any>> {
    return this.request(`/api/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ read: true }),
    })
  }

  // AI Assistant
  async getAIAssistance(message: string, context?: string): Promise<CloudflareAPIResponse<{ response: string }>> {
    return this.request('/api/ai/assist', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    })
  }
}

// Instância singleton
export const cloudflareAPI = new CloudflareAPIService()

// Hook para usar a API
export const useCloudflareAPI = () => {
  return cloudflareAPI
}
