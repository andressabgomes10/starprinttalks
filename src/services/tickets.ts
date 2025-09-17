import { supabase } from '../lib/supabase';
import { getMockData, simulateApiDelay } from '../data/mockData';
import type { Ticket, TicketWithDetails, TicketFilters, CreateTicketData } from '../types/database';

// Export TicketService as a default object with all methods
export const TicketService = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketStats,
  getTicketsByStatus,
  getTicketsByPriority,
  getTicketsByAgent,
  searchTickets
};

export const getTickets = async (filters?: TicketFilters): Promise<TicketWithDetails[]> => {
  try {
    if (!supabase) {
      console.warn('Supabase não configurado, retornando dados mockados');
      await simulateApiDelay(500);
      return getMockData.tickets().map(ticket => ({
        ...ticket,
        assignedTo: ticket.assigned_to ? {
          id: ticket.assigned_to.id,
          name: ticket.assigned_to.name,
          email: ticket.assigned_to.email
        } : undefined,
        customer: {
          id: ticket.customer.id,
          name: ticket.customer.name,
          email: ticket.customer.email
        },
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at
      }));
    }

    let query = supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(*),
        assigned_to:users(*),
        conversation:conversations(*)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.assigned_to_user_id) {
      query = query.eq('assigned_to_user_id', filters.assigned_to_user_id);
    }
    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }
    if (filters?.created_after) {
      query = query.gte('created_at', filters.created_after);
    }
    if (filters?.created_before) {
      query = query.lte('created_at', filters.created_before);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar tickets:', error);
      throw error;
    }

    return (data as TicketWithDetails[]) || [];
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    throw error;
  }
};

export const createTicket = async (ticketData: CreateTicketData): Promise<TicketWithDetails> => {
  try {
    if (!supabase) {
      console.warn('Supabase não configurado, simulando criação de ticket');
      await simulateApiDelay(1000);
      const mockTickets = getMockData.tickets();
      const newTicket = {
        id: Math.max(...mockTickets.map(t => t.id)) + 1,
        ...ticketData,
        status: 'open' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer: getMockData.customers().find(c => c.id === ticketData.customer_id),
        assigned_to: ticketData.assigned_to_user_id ? getMockData.users().find(u => u.id === ticketData.assigned_to_user_id) : null,
        conversation: ticketData.conversation_id ? getMockData.conversations().find(c => c.id === ticketData.conversation_id) : null
      };
      
      return {
        ...newTicket,
        assignedTo: newTicket.assigned_to ? {
          id: newTicket.assigned_to.id,
          name: newTicket.assigned_to.name,
          email: newTicket.assigned_to.email
        } : undefined,
        customer: {
          id: newTicket.customer!.id,
          name: newTicket.customer!.name,
          email: newTicket.customer!.email
        },
        createdAt: newTicket.created_at,
        updatedAt: newTicket.updated_at
      };
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select(`
        *,
        customer:customers(*),
        assigned_to:users(*),
        conversation:conversations(*)
      `)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    throw error;
  }
};

export const updateTicket = async (id: number, updates: Partial<Ticket>): Promise<TicketWithDetails> => {
  try {
    if (!supabase) {
      console.warn('Supabase não configurado, simulando atualização de ticket');
      await simulateApiDelay(500);
      const mockTickets = getMockData.tickets();
      const ticket = mockTickets.find(t => t.id === id);
      if (!ticket) throw new Error('Ticket não encontrado');
      
      const updatedTicket = { ...ticket, ...updates, updated_at: new Date().toISOString() };
      return {
        ...updatedTicket,
        assignedTo: updatedTicket.assigned_to ? {
          id: updatedTicket.assigned_to.id,
          name: updatedTicket.assigned_to.name,
          email: updatedTicket.assigned_to.email
        } : undefined,
        customer: {
          id: updatedTicket.customer.id,
          name: updatedTicket.customer.name,
          email: updatedTicket.customer.email
        },
        createdAt: updatedTicket.created_at,
        updatedAt: updatedTicket.updated_at
      };
    }

    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        assigned_to:users(*),
        conversation:conversations(*)
      `)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    throw error;
  }
};

export const deleteTicket = async (id: number): Promise<void> => {
  try {
    if (!supabase) {
      console.warn('Supabase não configurado, simulando exclusão de ticket');
      await simulateApiDelay(500);
      return;
    }

    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    throw error;
  }
};

export const assignTicket = async (ticketId: number, userId: number): Promise<TicketWithDetails> => {
  try {
    if (!supabase) {
      console.warn('Supabase não configurado, simulando atribuição de ticket');
      await simulateApiDelay(500);
      const mockTickets = getMockData.tickets();
      const ticket = mockTickets.find(t => t.id === ticketId);
      if (!ticket) throw new Error('Ticket não encontrado');
      
      const user = getMockData.users().find(u => u.id === userId);
      if (!user) throw new Error('Usuário não encontrado');
      
      const updatedTicket = { 
        ...ticket, 
        assigned_to_user_id: userId,
        assigned_to: user,
        status: 'in_progress' as const,
        updated_at: new Date().toISOString()
      };
      
      return {
        ...updatedTicket,
        assignedTo: {
          id: updatedTicket.assigned_to.id,
          name: updatedTicket.assigned_to.name,
          email: updatedTicket.assigned_to.email
        },
        customer: {
          id: updatedTicket.customer.id,
          name: updatedTicket.customer.name,
          email: updatedTicket.customer.email
        },
        createdAt: updatedTicket.created_at,
        updatedAt: updatedTicket.updated_at
      };
    }

    const { data, error } = await supabase
      .from('tickets')
      .update({ 
        assigned_to_user_id: userId, 
        status: 'in_progress' 
      })
      .eq('id', ticketId)
      .select(`
        *,
        customer:customers(*),
        assigned_to:users(*),
        conversation:conversations(*)
      `)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atribuir ticket:', error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId: number, status: string): Promise<TicketWithDetails> => {
  try {
    if (!supabase) {
      console.warn('Supabase não configurado, simulando atualização de status');
      await simulateApiDelay(500);
      const mockTickets = getMockData.tickets();
      const ticket = mockTickets.find(t => t.id === ticketId);
      if (!ticket) throw new Error('Ticket não encontrado');
      
      const updatedTicket = { 
        ...ticket, 
        status: status as any,
        updated_at: new Date().toISOString()
      };
      
      return {
        ...updatedTicket,
        assignedTo: updatedTicket.assigned_to ? {
          id: updatedTicket.assigned_to.id,
          name: updatedTicket.assigned_to.name,
          email: updatedTicket.assigned_to.email
        } : undefined,
        customer: {
          id: updatedTicket.customer.id,
          name: updatedTicket.customer.name,
          email: updatedTicket.customer.email
        },
        createdAt: updatedTicket.created_at,
        updatedAt: updatedTicket.updated_at
      };
    }

    const { data, error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId)
      .select(`
        *,
        customer:customers(*),
        assigned_to:users(*),
        conversation:conversations(*)
      `)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar status do ticket:', error);
    throw error;
  }
};