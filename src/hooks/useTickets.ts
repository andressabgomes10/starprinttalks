import { useState, useMemo, useCallback, useEffect } from 'react';
import { api } from '../services/api';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client_name?: string;
  client_email?: string;
  client_company?: string;
  assigned_user_name?: string;
  assigned_user_email?: string;
  creator_name?: string;
  creator_email?: string;
  created_at: string;
  updated_at: string;
  category?: string;
  tags?: string[];
  messages?: number;
  client_id?: string;
  assigned_to?: string;
  created_by?: string;
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
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Fetch tickets from Cloudflare Worker API
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.tickets.getAll();
      console.log('Tickets fetched:', data);
      setTickets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tickets on mount
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           (ticket.client_name && ticket.client_name.toLowerCase().includes(filters.search.toLowerCase())) ||
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
          case 'client_name':
            aValue = (a.client_name || '').toLowerCase();
            bValue = (b.client_name || '').toLowerCase();
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
          case 'created_at':
          default:
            aValue = new Date(a.created_at).getTime();
            bValue = new Date(b.created_at).getTime();
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
  const createTicket = useCallback(async (ticketData: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    client_id: string;
    created_by?: string;
    category?: string;
    tags?: string[];
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const newTicket = await api.tickets.create(ticketData);
      console.log('Ticket created:', newTicket);
      
      // Refresh tickets list
      await fetchTickets();
      
      return newTicket;
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
      const updatedTicket = await api.tickets.update(id, updates);
      console.log('Ticket updated:', updatedTicket);
      
      // Update local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
      ));
      
      return updatedTicket;
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
      await api.tickets.delete(id);
      console.log('Ticket deleted:', id);
      
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
    allTickets: tickets,
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
