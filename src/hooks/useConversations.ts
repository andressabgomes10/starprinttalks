import { useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Conversation {
  id: string;
  ticketId: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
  priority: 'high' | 'medium' | 'low';
  email: string;
  phone?: string;
  joinDate: string;
  tags: string[];
}

export interface Message {
  id: string;
  ticketId: string;
  sender: 'user' | 'client';
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface ConversationFilters {
  search: string;
  status: string;
  priority: string;
  unreadOnly: boolean;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ConversationFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    unreadOnly: false
  });

  // Fetch conversations from Supabase
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('tickets')
        .select(`
          id,
          title,
          status,
          priority,
          created_at,
          updated_at,
          clients(name, email, phone),
          conversations(count)
        `)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedConversations: Conversation[] = data?.map(ticket => ({
        id: ticket.id,
        ticketId: ticket.id,
        name: ticket.clients?.name || 'Cliente não encontrado',
        email: ticket.clients?.email || '',
        phone: ticket.clients?.phone,
        lastMessage: `Ticket: ${ticket.title}`,
        time: new Date(ticket.updated_at).toLocaleString('pt-BR'),
        unread: ticket.conversations?.length || 0,
        status: 'offline' as const, // This would need to be calculated based on last activity
        priority: ticket.priority,
        joinDate: new Date(ticket.created_at).toLocaleDateString('pt-BR'),
        tags: [] // This would need to be fetched from a tags table
      })) || [];

      setConversations(formattedConversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (ticketId: string) => {
    if (messages[ticketId]) return; // Already loaded

    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('conversations')
        .select(`
          id,
          message,
          sender_id,
          sender_type,
          created_at,
          users(full_name)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const formattedMessages: Message[] = data?.map(msg => ({
        id: msg.id,
        ticketId: ticketId,
        sender: msg.sender_type,
        content: msg.message,
        timestamp: msg.created_at,
        isRead: true, // This would need to be calculated based on user
        attachments: [] // This would need to be fetched from attachments table
      })) || [];

      setMessages(prev => ({
        ...prev,
        [ticketId]: formattedMessages
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations
      .filter(conversation => {
        const matchesSearch = conversation.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           conversation.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                           conversation.lastMessage.toLowerCase().includes(filters.search.toLowerCase());
        const matchesStatus = filters.status === 'all' || conversation.status === filters.status;
        const matchesPriority = filters.priority === 'all' || conversation.priority === filters.priority;
        const matchesUnread = !filters.unreadOnly || conversation.unread > 0;
        
        return matchesSearch && matchesStatus && matchesPriority && matchesUnread;
      });
  }, [conversations, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ConversationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Send message
  const sendMessage = useCallback(async (ticketId: string, content: string, senderType: 'user' | 'client') => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: sendError } = await supabase
        .from('conversations')
        .insert([{
          ticket_id: ticketId,
          message: content,
          sender_id: 'current-user-id', // This would need to be the actual user ID
          sender_type: senderType
        }])
        .select()
        .single();

      if (sendError) throw sendError;

      // Add message to local state
      const newMessage: Message = {
        id: data.id,
        ticketId: ticketId,
        sender: senderType,
        content: content,
        timestamp: data.created_at,
        isRead: true,
        attachments: []
      };

      setMessages(prev => ({
        ...prev,
        [ticketId]: [...(prev[ticketId] || []), newMessage]
      }));

      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.ticketId === ticketId 
          ? { 
              ...conv, 
              lastMessage: content, 
              time: new Date().toLocaleString('pt-BR'),
              unread: conv.unread + 1
            }
          : conv
      ));

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
      console.error('Error sending message:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark conversation as read
  const markAsRead = useCallback(async (ticketId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.ticketId === ticketId 
        ? { ...conv, unread: 0 }
        : conv
    ));
  }, []);

  return {
    conversations: filteredConversations,
    messages,
    loading,
    error,
    filters,
    updateFilters,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead
  };
}
