import { supabase, authService, dbService } from './supabaseClient';

// Service principal que gerencia dados reais do Supabase
class SupabaseService {
  constructor() {
    this.currentUser = null;
    this.setupAuthListener();
  }

  setupAuthListener() {
    authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.currentUser = session.user;
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
      }
    });
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  clearCurrentUser() {
    this.currentUser = null;
  }

  // Auth methods
  async login(email, password) {
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) throw error;
      
      this.currentUser = data.user;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async register(email, password, userData = {}) {
    try {
      const { data, error } = await authService.signUp(email, password, userData);
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      
      this.currentUser = null;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const { user, error } = await authService.getCurrentUser();
      if (error) throw error;
      
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Data methods
  async getTickets() {
    try {
      const { data, error } = await dbService.getTickets();
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Fallback para dados mock se Supabase falhar
      return this.getMockTickets();
    }
  }

  async createTicket(ticketData) {
    try {
      const ticket = {
        ...ticketData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: this.currentUser?.id
      };
      
      const { data, error } = await dbService.createTicket(ticket);
      if (error) throw error;
      
      // Log da atividade
      await this.logActivity({
        type: 'ticket_created',
        description: `Ticket #${data.id} foi criado`,
        user_id: this.currentUser?.id,
        user_name: this.currentUser?.user_metadata?.name || this.currentUser?.email,
        metadata: { ticket_id: data.id, title: data.title }
      });
      
      return data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  async updateTicketStatus(ticketId, newStatus) {
    try {
      const { data, error } = await dbService.updateTicket(ticketId, {
        status: newStatus,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      
      // Log da atividade
      await this.logActivity({
        type: 'ticket_updated',
        description: `Status do ticket #${ticketId} alterado para "${newStatus}"`,
        user_id: this.currentUser?.id,
        user_name: this.currentUser?.user_metadata?.name || this.currentUser?.email,
        metadata: { ticket_id: ticketId, new_status: newStatus }
      });
      
      return data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }

  async getClients() {
    try {
      const { data, error } = await dbService.getClients();
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      return this.getMockClients();
    }
  }

  async getConversations() {
    try {
      const { data, error } = await dbService.getConversations();
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return this.getMockConversations();
    }
  }

  async getArticles() {
    try {
      const { data, error } = await dbService.getArticles();
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      return this.getMockArticles();
    }
  }

  async getTeam() {
    try {
      const { data, error } = await dbService.getTeamMembers();
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching team:', error);
      return this.getMockTeam();
    }
  }

  async getActivityLog() {
    try {
      const { data, error } = await dbService.getActivityLog();
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching activity log:', error);
      return [];
    }
  }

  async logActivity(activity) {
    try {
      const activityData = {
        ...activity,
        created_at: new Date().toISOString(),
        user_id: activity.user_id || this.currentUser?.id,
        user_name: activity.user_name || this.currentUser?.user_metadata?.name || this.currentUser?.email
      };
      
      await dbService.logActivity(activityData);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Dashboard statistics
  getDashboardStats() {
    // Esta função pode ser melhorada para buscar stats reais do Supabase
    return {
      totalTickets: 0,
      openTickets: 0,
      resolvedTickets: 0,
      totalClients: 0,
      activeClients: 0,
      totalConversations: 0,
      activeConversations: 0,
      avgResponseTime: '2.5h',
      customerSatisfaction: 4.7,
      thisMonthTickets: 0
    };
  }

  // Métodos mock como fallback
  getMockTickets() {
    return [
      {
        id: 'TK001',
        title: 'Problema com login do cliente',
        description: 'Cliente não consegue fazer login na plataforma',
        status: 'open',
        priority: 'high',
        client: 'Maria Silva',
        agent: 'João Santos',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Técnico',
        tags: ['login', 'acesso']
      }
    ];
  }

  getMockClients() {
    return [
      {
        id: 'CL001',
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        phone: '(11) 99999-1111',
        company: 'Empresa ABC',
        status: 'active',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        total_tickets: 5,
        open_tickets: 1,
        last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  getMockConversations() {
    return [
      {
        id: 'CONV001',
        client_name: 'Maria Silva',
        client_email: 'maria.silva@email.com',
        subject: 'Problema técnico urgente',
        status: 'active',
        priority: 'high',
        agent: 'João Santos',
        last_message: 'Vou verificar isso imediatamente',
        last_message_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        unread_count: 2,
        channel: 'email'
      }
    ];
  }

  getMockArticles() {
    return [
      {
        id: 'ART001',
        title: 'Como fazer login na plataforma',
        content: 'Guia passo a passo para fazer login...',
        category: 'Tutoriais',
        status: 'published',
        author: 'João Santos',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        views: 245,
        tags: ['login', 'tutorial', 'básico']
      }
    ];
  }

  getMockTeam() {
    return [
      {
        id: 'USER001',
        name: 'João Santos',
        email: 'joao.santos@cajatalks.com',
        role: 'Agente Senior',
        department: 'Suporte',
        status: 'online',
        avatar: null,
        stats: {
          tickets_resolved: 156,
          avg_response_time: '2.3h',
          customer_satisfaction: 4.8,
          active_tickets: 12
        }
      }
    ];
  }
}

export const supabaseService = new SupabaseService();