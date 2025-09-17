// Mock Data Service for Cajá Talks
class MockDataService {
  constructor() {
    this.currentUser = null;
    this.initializeData();
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  clearCurrentUser() {
    this.currentUser = null;
  }

  initializeData() {
    // Initialize mock data if not exists
    if (!localStorage.getItem('cajatalks_tickets')) {
      this.initializeTickets();
    }
    if (!localStorage.getItem('cajatalks_clients')) {
      this.initializeClients();
    }
    if (!localStorage.getItem('cajatalks_conversations')) {
      this.initializeConversations();
    }
    if (!localStorage.getItem('cajatalks_articles')) {
      this.initializeArticles();
    }
    if (!localStorage.getItem('cajatalks_team')) {
      this.initializeTeam();
    }
  }

  initializeTickets() {
    const tickets = [
      {
        id: 'TK001',
        title: 'Problema com login do cliente',
        description: 'Cliente não consegue fazer login na plataforma',
        status: 'open',
        priority: 'high',
        client: 'Maria Silva',
        agent: 'João Santos',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Técnico',
        tags: ['login', 'acesso']
      },
      {
        id: 'TK002',
        title: 'Solicitação de reembolso',
        description: 'Cliente solicita reembolso do produto XYZ',
        status: 'in_progress',
        priority: 'medium',
        client: 'Pedro Costa',
        agent: 'Ana Oliveira',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'Financeiro',
        tags: ['reembolso', 'pagamento']
      },
      {
        id: 'TK003',
        title: 'Dúvida sobre funcionalidade',
        description: 'Como usar a funcionalidade de relatórios?',
        status: 'resolved',
        priority: 'low',
        client: 'Carolina Lima',
        agent: 'João Santos',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Suporte',
        tags: ['dúvida', 'relatórios']
      }
    ];
    localStorage.setItem('cajatalks_tickets', JSON.stringify(tickets));
  }

  initializeClients() {
    const clients = [
      {
        id: 'CL001',
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        phone: '(11) 99999-1111',
        company: 'Empresa ABC',
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalTickets: 5,
        openTickets: 1,
        lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'CL002',
        name: 'Pedro Costa',
        email: 'pedro.costa@email.com',
        phone: '(11) 99999-2222',
        company: 'Empresa XYZ',
        status: 'active',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        totalTickets: 8,
        openTickets: 2,
        lastContact: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'CL003',
        name: 'Carolina Lima',
        email: 'carolina.lima@email.com',
        phone: '(11) 99999-3333',
        company: 'Startup 123',
        status: 'inactive',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        totalTickets: 12,
        openTickets: 0,
        lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('cajatalks_clients', JSON.stringify(clients));
  }

  initializeConversations() {
    const conversations = [
      {
        id: 'CONV001',
        clientName: 'Maria Silva',
        clientEmail: 'maria.silva@email.com',
        subject: 'Problema técnico urgente',
        status: 'active',
        priority: 'high',
        agent: 'João Santos',
        lastMessage: 'Vou verificar isso imediatamente',
        lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        unreadCount: 2,
        channel: 'email'
      },
      {
        id: 'CONV002',
        clientName: 'Pedro Costa',
        clientEmail: 'pedro.costa@email.com',
        subject: 'Dúvida sobre cobrança',
        status: 'pending',
        priority: 'medium',
        agent: 'Ana Oliveira',
        lastMessage: 'Preciso verificar com o financeiro',
        lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        unreadCount: 0,
        channel: 'chat'
      }
    ];
    localStorage.setItem('cajatalks_conversations', JSON.stringify(conversations));
  }

  initializeArticles() {
    const articles = [
      {
        id: 'ART001',
        title: 'Como fazer login na plataforma',
        content: 'Guia passo a passo para fazer login...',
        category: 'Tutoriais',
        status: 'published',
        author: 'João Santos',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        views: 245,
        tags: ['login', 'tutorial', 'básico']
      },
      {
        id: 'ART002',
        title: 'Política de reembolso',
        content: 'Informações sobre nossa política de reembolso...',
        category: 'Políticas',
        status: 'published',
        author: 'Ana Oliveira',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        views: 189,
        tags: ['reembolso', 'política', 'financeiro']
      }
    ];
    localStorage.setItem('cajatalks_articles', JSON.stringify(articles));
  }

  initializeTeam() {
    const team = [
      {
        id: 'USER001',
        name: 'João Santos',
        email: 'joao.santos@cajatalks.com',
        role: 'Agente Senior',
        department: 'Suporte',
        status: 'online',
        avatar: null,
        stats: {
          ticketsResolved: 156,
          avgResponseTime: '2.3h',
          customerSatisfaction: 4.8,
          activeTickets: 12
        }
      },
      {
        id: 'USER002',
        name: 'Ana Oliveira',
        email: 'ana.oliveira@cajatalks.com',
        role: 'Agente',
        department: 'Suporte',
        status: 'busy',
        avatar: null,
        stats: {
          ticketsResolved: 89,
          avgResponseTime: '3.1h',
          customerSatisfaction: 4.6,
          activeTickets: 8
        }
      }
    ];
    localStorage.setItem('cajatalks_team', JSON.stringify(team));
  }

  // Generic CRUD operations
  getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Specific data getters
  getTickets() {
    return this.getData('cajatalks_tickets');
  }

  getClients() {
    return this.getData('cajatalks_clients');
  }

  getConversations() {
    return this.getData('cajatalks_conversations');
  }

  getArticles() {
    return this.getData('cajatalks_articles');
  }

  getTeam() {
    return this.getData('cajatalks_team');
  }

  // Dashboard statistics
  getDashboardStats() {
    const tickets = this.getTickets();
    const clients = this.getClients();
    const conversations = this.getConversations();

    return {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === 'open').length,
      resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      totalConversations: conversations.length,
      activeConversations: conversations.filter(c => c.status === 'active').length,
      avgResponseTime: '2.5h',
      customerSatisfaction: 4.7,
      thisMonthTickets: tickets.filter(t => {
        const ticketDate = new Date(t.createdAt);
        const thisMonth = new Date();
        return ticketDate.getMonth() === thisMonth.getMonth() && 
               ticketDate.getFullYear() === thisMonth.getFullYear();
      }).length
    };
  }

  // Update ticket status
  updateTicketStatus(ticketId, newStatus) {
    const tickets = this.getTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex > -1) {
      tickets[ticketIndex].status = newStatus;
      tickets[ticketIndex].updatedAt = new Date().toISOString();
      this.saveData('cajatalks_tickets', tickets);
      return tickets[ticketIndex];
    }
    return null;
  }

  // Create new ticket
  createTicket(ticketData) {
    const tickets = this.getTickets();
    const newTicket = {
      id: `TK${String(tickets.length + 1).padStart(3, '0')}`,
      ...ticketData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tickets.push(newTicket);
    this.saveData('cajatalks_tickets', tickets);
    return newTicket;
  }
}

export const mockDataService = new MockDataService();