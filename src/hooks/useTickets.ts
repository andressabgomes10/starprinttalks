import { useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client: string;
  assignee?: string;
  created: string;
  updated: string;
  category?: string;
  tags: string[];
  messages: number;
}

export interface TicketFilters {
  search: string;
  status: string;
  priority: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'created',
    sortOrder: 'desc'
  });

  // Fetch tickets from Supabase
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('tickets')
        .select(`
          *,
          clients(name),
          users(full_name)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedTickets: Ticket[] = data?.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        client: ticket.clients?.name || 'Cliente não encontrado',
        assignee: ticket.users?.full_name,
        created: ticket.created_at,
        updated: ticket.updated_at,
        category: ticket.category,
        tags: ticket.tags || [],
        messages: ticket.messages || 0
      })) || [];

      setTickets(formattedTickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           ticket.client.toLowerCase().includes(filters.search.toLowerCase()) ||
                           ticket.id.toLowerCase().includes(filters.search.toLowerCase());
        const matchesStatus = filters.status === 'all' || ticket.status === filters.status;
        const matchesPriority = filters.priority === 'all' || ticket.priority === filters.priority;
        
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'client':
            aValue = a.client.toLowerCase();
            bValue = b.client.toLowerCase();
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'priority':
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority];
            bValue = priorityOrder[b.priority];
            break;
          case 'created':
          default:
            aValue = new Date(a.created).getTime();
            bValue = new Date(b.created).getTime();
            break;
        }
        
        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [tickets, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TicketFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create new ticket
  const createTicket = useCallback(async (ticketData: Omit<Ticket, 'id' | 'created' | 'updated' | 'messages'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: createError } = await supabase
        .from('tickets')
        .insert([{
          title: ticketData.title,
          description: ticketData.description,
          status: ticketData.status,
          priority: ticketData.priority,
          client_id: ticketData.client, // Assuming client is ID
          assigned_to: ticketData.assignee,
          category: ticketData.category,
          tags: ticketData.tags
        }])
        .select()
        .single();

      if (createError) throw createError;

      // Refresh tickets list
      await fetchTickets();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar ticket');
      console.error('Error creating ticket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTickets]);

  // Update ticket
  const updateTicket = useCallback(async (id: string, updates: Partial<Ticket>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: updateError } = await supabase
        .from('tickets')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          assigned_to: updates.assignee,
          category: updates.category,
          tags: updates.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, ...updates } : ticket
      ));
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar ticket');
      console.error('Error updating ticket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete ticket
  const deleteTicket = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: deleteError } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state
      setTickets(prev => prev.filter(ticket => ticket.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar ticket');
      console.error('Error deleting ticket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tickets: filteredTickets,
    loading,
    error,
    filters,
    updateFilters,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket
  };
}
