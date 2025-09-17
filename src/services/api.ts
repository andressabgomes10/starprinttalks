// API service for FastAPI backend integration
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
    // Get token from localStorage
    this.token = localStorage.getItem('cajaTalks_authToken');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('cajaTalks_authToken', token);
    } else {
      localStorage.removeItem('cajaTalks_authToken');
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      console.log(`🔄 API Request: ${config.method || 'GET'} ${url}`)
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error(`❌ API Error: ${errorMessage}`)
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${config.method || 'GET'} ${url}`)
      return data;
    } catch (error) {
      console.error(`💥 API Request failed for ${endpoint}:`, error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async register(email: string, password: string) {
    return this.request<{ ok: boolean; data: { user: string } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ ok: boolean; data: { access_token: string; user: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request<{ ok: boolean }>('/api/auth/me');
  }

  // Clients endpoints
  async getClients(params?: { q?: string; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.append('q', params.q);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/api/clients${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ ok: boolean; data: any[] }>(endpoint);
  }

  async createClient(clientData: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    status?: string;
  }) {
    return this.request<{ ok: boolean; data: any }>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(id: string, clientData: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    status?: string;
  }) {
    return this.request<{ ok: boolean; data: any }>(`/api/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(id: string) {
    return this.request<{ ok: boolean; data: boolean }>(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // Tickets endpoints
  async getTickets(params?: {
    status?: string;
    priority?: string;
    client_id?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.client_id) searchParams.append('client_id', params.client_id);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/api/tickets${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ ok: boolean; data: any[] }>(endpoint);
  }

  async createTicket(ticketData: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    client_id: string;
    assigned_to?: string;
  }) {
    return this.request<{ ok: boolean; data: any }>('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async updateTicket(id: string, ticketData: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    client_id?: string;
    assigned_to?: string;
  }) {
    return this.request<{ ok: boolean; data: any }>(`/api/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(ticketData),
    });
  }

  async deleteTicket(id: string) {
    return this.request<{ ok: boolean; data: boolean }>(`/api/tickets/${id}`, {
      method: 'DELETE',
    });
  }

  // Teams endpoints
  async getTeams(params?: { limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/api/teams${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ ok: boolean; data: any[] }>(endpoint);
  }

  async createTeam(teamData: { name: string; department?: string }) {
    return this.request<{ ok: boolean; data: any }>('/api/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ ok: boolean }>('/api/health');
  }
}

export const apiService = new ApiService();