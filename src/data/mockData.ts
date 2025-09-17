/**
 * Sistema de dados mock para desenvolvimento local
 * Simula um backend real com dados persistentes na sessionStorage
 */

// Types
export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'agent' | 'client';
  avatar_url?: string;
  created_at: string;
}

export interface MockClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface MockTicket {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client_id: string;
  client_name?: string;
  client_email?: string;
  client_company?: string;
  assigned_to?: string;
  assigned_user_name?: string;
  assigned_user_email?: string;
  created_by?: string;
  creator_name?: string;
  creator_email?: string;
  created_at: string;
  updated_at: string;
  category?: string;
  tags?: string[];
  messages?: number;
}

export interface MockConversation {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name?: string;
  sender_email?: string;
  message: string;
  message_type: 'text' | 'image' | 'file';
  created_at: string;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'mockUsers',
  CLIENTS: 'mockClients',
  TICKETS: 'mockTickets',
  CONVERSATIONS: 'mockConversations',
  INITIALIZED: 'mockDataInitialized'
} as const;

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function saveToStorage<T>(key: string, data: T[]): void {
  sessionStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage<T>(key: string, defaultData: T[] = []): T[] {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
}

// Initial data
const initialUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'admin@starprinttalks.com',
    full_name: 'Administrator',
    role: 'admin',
    created_at: '2024-01-01T10:00:00Z'
  },
  {
    id: 'user-2',
    email: 'ana.silva@starprinttalks.com',
    full_name: 'Ana Silva',
    role: 'agent',
    created_at: '2024-01-05T09:00:00Z'
  },
  {
    id: 'user-3',
    email: 'carlos.santos@starprinttalks.com',
    full_name: 'Carlos Santos',
    role: 'agent',
    created_at: '2024-01-08T14:00:00Z'
  }
];

const initialClients: MockClient[] = [
  {
    id: 'client-1',
    name: 'Maria Santos',
    email: 'maria@techsolutions.com',
    phone: '(11) 99999-1111',
    company: 'Tech Solutions Ltda',
    status: 'active',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'client-2',
    name: 'João Silva',
    email: 'joao@startuptech.com',
    phone: '(21) 88888-2222',
    company: 'StartupTech',
    status: 'active',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-14T11:20:00Z'
  },
  {
    id: 'client-3',
    name: 'Ana Costa',
    email: 'ana@megacorp.com',
    phone: '(11) 77777-3333',
    company: 'MegaCorp Enterprises',
    status: 'active',
    created_at: '2024-01-08T16:45:00Z',
    updated_at: '2024-01-15T09:00:00Z'
  },
  {
    id: 'client-4',
    name: 'Carlos Oliveira',
    email: 'carlos@consultoria.com',
    phone: '(31) 66666-4444',
    company: 'Oliveira Consultoria',
    status: 'inactive',
    created_at: '2024-01-05T14:20:00Z',
    updated_at: '2024-01-10T16:10:00Z'
  },
  {
    id: 'client-5',
    name: 'Fernanda Lima',
    email: 'fernanda@innovate.com',
    phone: '(47) 55555-5555',
    company: 'Innovate Solutions',
    status: 'pending',
    created_at: '2024-01-14T11:30:00Z',
    updated_at: '2024-01-15T13:45:00Z'
  }
];

const initialTickets: MockTicket[] = [
  {
    id: 'ticket-1',
    title: 'Problema no login do sistema',
    description: 'Usuário relatando dificuldades para acessar sua conta após a atualização do sistema. Erro 500 intermitente.',
    status: 'open',
    priority: 'high',
    client_id: 'client-1',
    client_name: 'Maria Santos',
    client_email: 'maria@techsolutions.com',
    client_company: 'Tech Solutions Ltda',
    assigned_to: 'user-2',
    assigned_user_name: 'Ana Silva',
    assigned_user_email: 'ana.silva@starprinttalks.com',
    created_by: 'user-1',
    creator_name: 'Administrator',
    creator_email: 'admin@starprinttalks.com',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    category: 'Técnico',
    tags: ['login', 'bug', 'urgente'],
    messages: 12
  },
  {
    id: 'ticket-2',
    title: 'Solicitação de nova funcionalidade',
    description: 'Cliente solicitando implementação de relatórios personalizados no dashboard principal.',
    status: 'in_progress',
    priority: 'medium',
    client_id: 'client-2',
    client_name: 'João Silva',
    client_email: 'joao@startuptech.com',
    client_company: 'StartupTech',
    assigned_to: 'user-3',
    assigned_user_name: 'Carlos Santos',
    assigned_user_email: 'carlos.santos@starprinttalks.com',
    created_by: 'user-1',
    creator_name: 'Administrator',
    creator_email: 'admin@starprinttalks.com',
    created_at: '2024-01-14T09:15:00Z',
    updated_at: '2024-01-15T11:20:00Z',
    category: 'Feature Request',
    tags: ['enhancement', 'dashboard'],
    messages: 8
  },
  {
    id: 'ticket-3',
    title: 'Erro na geração de relatórios',
    description: 'Relatórios mensais não estão sendo gerados corretamente. Dados inconsistentes na base.',
    status: 'resolved',
    priority: 'high',
    client_id: 'client-3',
    client_name: 'Ana Costa',
    client_email: 'ana@megacorp.com',
    client_company: 'MegaCorp Enterprises',
    assigned_to: 'user-2',
    assigned_user_name: 'Ana Silva',
    assigned_user_email: 'ana.silva@starprinttalks.com',
    created_by: 'user-1',
    creator_name: 'Administrator',
    creator_email: 'admin@starprinttalks.com',
    created_at: '2024-01-13T16:45:00Z',
    updated_at: '2024-01-15T09:00:00Z',
    category: 'Bug',
    tags: ['relatórios', 'dados'],
    messages: 15
  },
  {
    id: 'ticket-4',
    title: 'Sistema lento na navegação',
    description: 'Performance degradada em todas as páginas do sistema. Necessário investigar causa raiz.',
    status: 'urgent',
    priority: 'urgent',
    client_id: 'client-5',
    client_name: 'Fernanda Lima',
    client_email: 'fernanda@innovate.com',
    client_company: 'Innovate Solutions',
    assigned_to: 'user-2',
    assigned_user_name: 'Ana Silva',
    assigned_user_email: 'ana.silva@starprinttalks.com',
    created_by: 'user-1',
    creator_name: 'Administrator',
    creator_email: 'admin@starprinttalks.com',
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-15T13:45:00Z',
    category: 'Performance',
    tags: ['performance', 'crítico'],
    messages: 20
  }
];

const initialConversations: MockConversation[] = [
  {
    id: 'conv-1',
    ticket_id: 'ticket-1',
    sender_id: 'client-1',
    sender_name: 'Maria Santos',
    sender_email: 'maria@techsolutions.com',
    message: 'Olá, estou com problemas para fazer login no sistema desde ontem.',
    message_type: 'text',
    created_at: '2024-01-15T10:05:00Z'
  },
  {
    id: 'conv-2',
    ticket_id: 'ticket-1',
    sender_id: 'user-2',
    sender_name: 'Ana Silva',
    sender_email: 'ana.silva@starprinttalks.com',
    message: 'Olá Maria! Vou verificar sua conta. Pode me informar qual navegador está usando?',
    message_type: 'text',
    created_at: '2024-01-15T10:15:00Z'
  }
];

// Mock API class
export class MockAPI {
  static initialize(): void {
    if (!sessionStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      saveToStorage(STORAGE_KEYS.USERS, initialUsers);
      saveToStorage(STORAGE_KEYS.CLIENTS, initialClients);
      saveToStorage(STORAGE_KEYS.TICKETS, initialTickets);
      saveToStorage(STORAGE_KEYS.CONVERSATIONS, initialConversations);
      sessionStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      console.log('🚀 Mock data initialized');
    }
  }

  // Users
  static getUsers(): MockUser[] {
    return loadFromStorage<MockUser>(STORAGE_KEYS.USERS);
  }

  static createUser(userData: Omit<MockUser, 'id' | 'created_at'>): MockUser {
    const users = this.getUsers();
    const newUser: MockUser = {
      ...userData,
      id: generateId(),
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  // Clients
  static getClients(): MockClient[] {
    return loadFromStorage<MockClient>(STORAGE_KEYS.CLIENTS);
  }

  static createClient(clientData: Omit<MockClient, 'id' | 'created_at' | 'updated_at'>): MockClient {
    const clients = this.getClients();
    const newClient: MockClient = {
      ...clientData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    clients.push(newClient);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    return newClient;
  }

  static updateClient(id: string, updates: Partial<MockClient>): MockClient | null {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    clients[index] = {
      ...clients[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    return clients[index];
  }

  static deleteClient(id: string): boolean {
    const clients = this.getClients();
    const filtered = clients.filter(c => c.id !== id);
    if (filtered.length === clients.length) return false;
    
    saveToStorage(STORAGE_KEYS.CLIENTS, filtered);
    return true;
  }

  // Tickets
  static getTickets(): MockTicket[] {
    return loadFromStorage<MockTicket>(STORAGE_KEYS.TICKETS);
  }

  static createTicket(ticketData: Omit<MockTicket, 'id' | 'created_at' | 'updated_at'>): MockTicket {
    const tickets = this.getTickets();
    const clients = this.getClients();
    const client = clients.find(c => c.id === ticketData.client_id);
    
    const newTicket: MockTicket = {
      ...ticketData,
      id: generateId(),
      client_name: client?.name,
      client_email: client?.email,
      client_company: client?.company,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: 0
    };
    tickets.push(newTicket);
    saveToStorage(STORAGE_KEYS.TICKETS, tickets);
    return newTicket;
  }

  static updateTicket(id: string, updates: Partial<MockTicket>): MockTicket | null {
    const tickets = this.getTickets();
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    tickets[index] = {
      ...tickets[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.TICKETS, tickets);
    return tickets[index];
  }

  static deleteTicket(id: string): boolean {
    const tickets = this.getTickets();
    const filtered = tickets.filter(t => t.id !== id);
    if (filtered.length === tickets.length) return false;
    
    saveToStorage(STORAGE_KEYS.TICKETS, filtered);
    return true;
  }

  // Conversations
  static getConversations(ticketId?: string): MockConversation[] {
    const conversations = loadFromStorage<MockConversation>(STORAGE_KEYS.CONVERSATIONS);
    return ticketId ? conversations.filter(c => c.ticket_id === ticketId) : conversations;
  }

  static createConversation(conversationData: Omit<MockConversation, 'id' | 'created_at'>): MockConversation {
    const conversations = this.getConversations();
    const newConversation: MockConversation = {
      ...conversationData,
      id: generateId(),
      created_at: new Date().toISOString()
    };
    conversations.push(newConversation);
    saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
    return newConversation;
  }

  // Dashboard Stats
  static getDashboardStats() {
    const clients = this.getClients();
    const tickets = this.getTickets();
    const conversations = this.getConversations();

    return {
      active_conversations: conversations.length,
      open_tickets: tickets.filter(t => t.status === 'open').length,
      active_clients: clients.filter(c => c.status === 'active').length,
      satisfaction: 94,
      ticket_stats: [
        { status: 'open', count: tickets.filter(t => t.status === 'open').length },
        { status: 'in_progress', count: tickets.filter(t => t.status === 'in_progress').length },
        { status: 'resolved', count: tickets.filter(t => t.status === 'resolved').length },
        { status: 'closed', count: tickets.filter(t => t.status === 'closed').length }
      ]
    };
  }
}

// Initialize mock data when module loads
MockAPI.initialize();