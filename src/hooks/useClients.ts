import { useState, useMemo, useCallback, useEffect } from 'react';
import { api } from '../services/api';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface ClientFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Fetch clients from Cloudflare Worker API
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.clients.getAll();
      console.log('Clients fetched:', data);
      setClients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load clients on mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filter and sort clients
  const filteredClients = useMemo(() => {
    return clients
      .filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           client.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                           (client.company && client.company.toLowerCase().includes(filters.search.toLowerCase()));
        const matchesStatus = filters.status === 'all' || client.status === filters.status;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'email':
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case 'company':
            aValue = a.company?.toLowerCase() || '';
            bValue = b.company?.toLowerCase() || '';
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'created_at':
            aValue = new Date(a.created_at).getTime();
            bValue = new Date(b.created_at).getTime();
            break;
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
        }
        
        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [clients, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ClientFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create new client
  const createClient = useCallback(async (clientData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const newClient = await api.clients.create({
        ...clientData,
        status: clientData.status || 'active'
      });
      console.log('Client created:', newClient);
      
      // Refresh clients list
      await fetchClients();
      
      return newClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar cliente');
      console.error('Error creating client:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClients]);

  // Update client
  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedClient = await api.clients.update(id, updates);
      console.log('Client updated:', updatedClient);
      
      // Update local state
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...updatedClient } : client
      ));
      
      return updatedClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cliente');
      console.error('Error updating client:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete client
  const deleteClient = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.clients.delete(id);
      console.log('Client deleted:', id);
      
      // Update local state
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar cliente');
      console.error('Error deleting client:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clients: filteredClients,
    allClients: clients,
    loading,
    error,
    filters,
    updateFilters,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  };
}
