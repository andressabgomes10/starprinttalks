import { apiService } from './api'

export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface ClientWithStats extends Client {
  tickets_count: number
  open_tickets_count: number
  resolved_tickets_count: number
}

export class ClientService {
  // Get all clients with pagination and filters
  static async getClients(
    page = 1,
    limit = 10,
    filters?: {
      status?: string
      search?: string
    }
  ) {
    try {
      const offset = (page - 1) * limit
      const params: any = { limit, offset }
      
      if (filters?.search) {
        params.q = filters.search
      }
      
      const response = await apiService.getClients(params)
      
      if (response.ok && response.data) {
        // For now, we'll add mock stats since backend doesn't return them yet
        const clientsWithStats: ClientWithStats[] = response.data.map((client: Client) => ({
          ...client,
          tickets_count: Math.floor(Math.random() * 20),
          open_tickets_count: Math.floor(Math.random() * 5),
          resolved_tickets_count: Math.floor(Math.random() * 15),
        }))

        return {
          data: clientsWithStats,
          total: response.data.length, // Backend should return total count
          page,
          limit,
          totalPages: Math.ceil(response.data.length / limit),
        }
      }
      
      throw new Error('Failed to fetch clients')
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }

  // Get client by ID
  static async getClientById(id: string): Promise<ClientWithStats> {
    try {
      // For now, get all clients and find the one we need
      // In a real implementation, the backend would have a GET /api/clients/{id} endpoint
      const response = await apiService.getClients()
      
      if (response.ok && response.data) {
        const client = response.data.find((c: Client) => c.id === id)
        if (!client) {
          throw new Error('Client not found')
        }

        return {
          ...client,
          tickets_count: Math.floor(Math.random() * 20),
          open_tickets_count: Math.floor(Math.random() * 5),
          resolved_tickets_count: Math.floor(Math.random() * 15),
        }
      }
      
      throw new Error('Failed to fetch client')
    } catch (error) {
      console.error('Error fetching client:', error)
      throw error
    }
  }

  // Create new client
  static async createClient(clientData: {
    name: string
    email?: string
    phone?: string
    company?: string
    status?: string
  }): Promise<Client> {
    try {
      const response = await apiService.createClient(clientData)
      
      if (response.ok && response.data) {
        return response.data
      }
      
      throw new Error('Failed to create client')
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }

  // Update client
  static async updateClient(id: string, updates: {
    name?: string
    email?: string
    phone?: string
    company?: string
    status?: string
  }): Promise<Client> {
    try {
      const response = await apiService.updateClient(id, updates)
      
      if (response.ok && response.data) {
        return response.data
      }
      
      throw new Error('Failed to update client')
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  // Delete client
  static async deleteClient(id: string): Promise<void> {
    try {
      const response = await apiService.deleteClient(id)
      
      if (!response.ok) {
        throw new Error('Failed to delete client')
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

  // Get client statistics
  static async getClientStats() {
    try {
      const response = await apiService.getClients()
      
      if (response.ok && response.data) {
        const clients = response.data
        const stats = {
          total: clients.length,
          active: clients.filter((c: Client) => c.status === 'active').length,
          inactive: clients.filter((c: Client) => c.status === 'inactive').length,
          suspended: clients.filter((c: Client) => c.status === 'suspended').length,
        }
        return stats
      }
      
      throw new Error('Failed to fetch client stats')
    } catch (error) {
      console.error('Error fetching client stats:', error)
      throw error
    }
  }

  // Subscribe to client changes (placeholder)
  static subscribeToClients(callback: (client: Client) => void) {
    // For now, return a mock subscription
    console.log('Client subscription not implemented yet for FastAPI backend')
    return {
      unsubscribe: () => {
        console.log('Unsubscribing from clients...')
      }
    }
  }
}
