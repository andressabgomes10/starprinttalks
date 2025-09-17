import { useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'suspended';
  created: string;
  updated: string;
  lastContact?: string;
  totalTickets: number;
  openTickets: number;
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

  // Fetch clients from Supabase
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select(`
          *,
          tickets(count)
        `)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      const formattedClients: Client[] = data?.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        status: client.status,
        created: client.created_at,
        updated: client.updated_at,
        lastContact: client.last_contact,
        totalTickets: client.tickets?.length || 0,
        openTickets: client.tickets?.filter((t: any) => t.status !== 'closed').length || 0
      })) || [];

      setClients(formattedClients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
          case 'created':
            aValue = new Date(a.created).getTime();
            bValue = new Date(b.created).getTime();
            break;
          case 'tickets':
            aValue = a.totalTickets;
            bValue = b.totalTickets;
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
  const createClient = useCallback(async (clientData: Omit<Client, 'id' | 'created' | 'updated' | 'totalTickets' | 'openTickets'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: createError } = await supabase
        .from('clients')
        .insert([{
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.company,
          status: clientData.status || 'active'
        }])
        .select()
        .single();

      if (createError) throw createError;

      // Refresh clients list
      await fetchClients();
      
      return data;
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
      const { data, error: updateError } = await supabase
        .from('clients')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          company: updates.company,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...updates } : client
      ));
      
      return data;
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
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

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
