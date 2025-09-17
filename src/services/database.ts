import { supabase } from '../lib/supabase';
import type {
  User, Conversation, KnowledgeBaseArticle, Feedback, Notification,
  CreateUserData, CreateConversationData, CreateKnowledgeBaseArticleData,
  CreateFeedbackData, CreateNotificationData,
  ConversationFilters, ArticleFilters, NotificationFilters,
  TicketStats, ConversationStats, ArticleStats, FeedbackStats,
  KpiData, ReportData, AppConfig, DashboardStats
} from '../types/database';

// Serviço base para operações CRUD
class DatabaseService<T> {
  constructor(private tableName: string) {}

  async getAll(): Promise<T[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from(this.tableName).select('*');
    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<T | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(data: Partial<T>): Promise<T> {
    if (!supabase) throw new Error('Supabase não configurado');
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    if (!supabase) throw new Error('Supabase não configurado');
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async delete(id: number): Promise<void> {
    if (!supabase) throw new Error('Supabase não configurado');
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}

// Serviços específicos
export const userService = new DatabaseService<User>('users');
export const conversationService = new DatabaseService<Conversation>('conversations');
export const articleService = new DatabaseService<KnowledgeBaseArticle>('knowledge_base_articles');
export const feedbackService = new DatabaseService<Feedback>('feedbacks');
export const notificationService = new DatabaseService<Notification>('notifications');

// Serviços especializados com lógica de negócio
export class ConversationService {
  async getConversationsWithDetails(filters?: ConversationFilters): Promise<Conversation[]> {
    if (!supabase) return [];
    
    let query = supabase
      .from('conversations')
      .select(`
        *,
        customer:users!customer_id(*),
        agent:users!agent_id(*),
        channel:channels(*),
        feedbacks:feedbacks(*)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }
    if (filters?.agent_id) {
      query = query.eq('agent_id', filters.agent_id);
    }
    if (filters?.channel_id) {
      query = query.eq('channel_id', filters.channel_id);
    }
    if (filters?.start_date) {
      query = query.gte('start_time', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('start_time', filters.end_date);
    }

    const { data, error } = await query.order('start_time', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getConversationStats(): Promise<ConversationStats> {
    if (!supabase) {
      return {
        total: 0,
        open: 0,
        closed: 0,
        pending: 0,
        by_channel: { 'Mensagens': 0, 'Email': 0, 'Chat': 0 },
        by_agent: {}
      };
    }

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        status,
        channel:channels(type),
        agent_id
      `);

    if (error) throw error;

    const stats: ConversationStats = {
      total: data?.length || 0,
      open: 0,
      closed: 0,
      pending: 0,
      by_channel: { 'Mensagens': 0, 'Email': 0, 'Chat': 0 },
      by_agent: {}
    };

    data?.forEach(conv => {
      stats[`${conv.status.toLowerCase()}` as keyof typeof stats]++;
      if (conv.channel) {
        stats.by_channel[conv.channel.type]++;
      }
      if (conv.agent_id) {
        stats.by_agent[conv.agent_id] = (stats.by_agent[conv.agent_id] || 0) + 1;
      }
    });

    return stats;
  }

  async createConversation(data: CreateConversationData): Promise<Conversation> {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const { data: result, error } = await supabase
      .from('conversations')
      .insert(data)
      .select(`
        *,
        customer:users!customer_id(*),
        agent:users!agent_id(*),
        channel:channels(*)
      `)
      .single();

    if (error) throw error;
    return result;
  }

  async assignConversation(conversationId: number, agentId: number): Promise<Conversation> {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const { data, error } = await supabase
      .from('conversations')
      .update({ 
        agent_id: agentId, 
        status: 'Aberta' 
      })
      .eq('id', conversationId)
      .select(`
        *,
        customer:users!customer_id(*),
        agent:users!agent_id(*),
        channel:channels(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async closeConversation(conversationId: number): Promise<Conversation> {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const { data, error } = await supabase
      .from('conversations')
      .update({ 
        status: 'Fechada',
        end_time: new Date().toISOString()
      })
      .eq('id', conversationId)
      .select(`
        *,
        customer:users!customer_id(*),
        agent:users!agent_id(*),
        channel:channels(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }
}

export class ArticleService {
  async getArticlesWithDetails(filters?: ArticleFilters): Promise<KnowledgeBaseArticle[]> {
    if (!supabase) return [];
    
    let query = supabase
      .from('knowledge_base_articles')
      .select(`
        *,
        category:article_categories(*),
        author:users!author_id(*),
        ratings:article_ratings(*)
      `);

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters?.author_id) {
      query = query.eq('author_id', filters.author_id);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getArticleStats(): Promise<ArticleStats> {
    if (!supabase) {
      return {
        total: 0,
        by_category: {},
        by_author: {},
        total_views: 0,
        average_rating: 0
      };
    }

    const { data, error } = await supabase
      .from('knowledge_base_articles')
      .select(`
        category_id,
        author_id,
        views_count,
        ratings:article_ratings(rating)
      `);

    if (error) throw error;

    const stats: ArticleStats = {
      total: data?.length || 0,
      by_category: {},
      by_author: {},
      total_views: 0,
      average_rating: 0
    };

    let totalRating = 0;
    let ratingCount = 0;

    data?.forEach(article => {
      stats.total_views += article.views_count;
      
      if (article.category_id) {
        stats.by_category[article.category_id] = (stats.by_category[article.category_id] || 0) + 1;
      }
      if (article.author_id) {
        stats.by_author[article.author_id] = (stats.by_author[article.author_id] || 0) + 1;
      }
      
      if (article.ratings) {
        article.ratings.forEach(rating => {
          totalRating += rating.rating;
          ratingCount++;
        });
      }
    });

    if (ratingCount > 0) {
      stats.average_rating = totalRating / ratingCount;
    }

    return stats;
  }

  async createArticle(data: CreateKnowledgeBaseArticleData): Promise<KnowledgeBaseArticle> {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const { data: result, error } = await supabase
      .from('knowledge_base_articles')
      .insert(data)
      .select(`
        *,
        category:article_categories(*),
        author:users!author_id(*)
      `)
      .single();

    if (error) throw error;
    return result;
  }

  async incrementViews(articleId: number): Promise<void> {
    if (!supabase) return;
    
    const { error } = await supabase.rpc('increment_article_views', {
      article_id: articleId
    });

    if (error) throw error;
  }
}

export class FeedbackService {
  async getFeedbacksWithDetails(): Promise<Feedback[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        ticket:conversations(*),
        customer:users!customer_id(*),
        agent:users!agent_id(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getFeedbackStats(): Promise<FeedbackStats> {
    if (!supabase) {
      return {
        total: 0,
        average_rating: 0,
        by_rating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        satisfaction_percentage: 0,
        by_agent: {}
      };
    }

    const { data, error } = await supabase
      .from('feedbacks')
      .select('rating, agent_id');

    if (error) throw error;

    const stats: FeedbackStats = {
      total: data?.length || 0,
      average_rating: 0,
      by_rating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      satisfaction_percentage: 0,
      by_agent: {}
    };

    let totalRating = 0;
    let satisfiedCount = 0;

    data?.forEach(feedback => {
      stats.by_rating[feedback.rating as keyof typeof stats.by_rating]++;
      totalRating += feedback.rating;
      if (feedback.rating >= 4) {
        satisfiedCount++;
      }
      if (feedback.agent_id) {
        stats.by_agent[feedback.agent_id] = (stats.by_agent[feedback.agent_id] || 0) + 1;
      }
    });

    if (stats.total > 0) {
      stats.average_rating = totalRating / stats.total;
      stats.satisfaction_percentage = (satisfiedCount / stats.total) * 100;
    }

    return stats;
  }

  async createFeedback(data: CreateFeedbackData): Promise<Feedback> {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const { data: result, error } = await supabase
      .from('feedbacks')
      .insert(data)
      .select(`
        *,
        ticket:conversations(*),
        customer:users!customer_id(*),
        agent:users!agent_id(*)
      `)
      .single();

    if (error) throw error;
    return result;
  }
}

export class NotificationService {
  async getNotificationsForUser(userId: number, filters?: NotificationFilters): Promise<Notification[]> {
    if (!supabase) return [];
    
    let query = supabase
      .from('notifications')
      .select(`
        *,
        user:users(*)
      `)
      .eq('user_id', userId);

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.is_read !== undefined) {
      query = query.eq('is_read', filters.is_read);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async createNotification(data: CreateNotificationData): Promise<Notification> {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const { data: result, error } = await supabase
      .from('notifications')
      .insert(data)
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return result;
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async markAllAsRead(userId: number): Promise<void> {
    if (!supabase) throw new Error('Supabase não configurado');
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);

    if (error) throw error;
  }
}

// Serviços para KPIs e relatórios
export class KpiService {
  async getKpiData(period: 'day' | 'week' | 'month'): Promise<KpiData[]> {
    if (!supabase) return [];

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Buscar dados de conversas (atendimentos remotos)
    const { data: conversations } = await supabase
      .from('conversations')
      .select('start_time, end_time, status')
      .gte('start_time', startDate.toISOString());

    // Buscar dados de feedbacks (satisfação)
    const { data: feedbacks } = await supabase
      .from('feedbacks')
      .select('rating, created_at')
      .gte('created_at', startDate.toISOString());

    // Calcular KPIs
    const remoteAttendances = conversations?.length || 0;
    
    let averageResolutionTime = 0;
    if (conversations && conversations.length > 0) {
      const resolvedConversations = conversations.filter(c => c.status === 'Fechada' && c.end_time);
      if (resolvedConversations.length > 0) {
        const totalTime = resolvedConversations.reduce((sum, conv) => {
          const start = new Date(conv.start_time).getTime();
          const end = new Date(conv.end_time!).getTime();
          return sum + (end - start);
        }, 0);
        averageResolutionTime = totalTime / resolvedConversations.length / (1000 * 60); // em minutos
      }
    }

    let customerSatisfaction = 0;
    if (feedbacks && feedbacks.length > 0) {
      const satisfiedCount = feedbacks.filter(f => f.rating >= 4).length;
      customerSatisfaction = (satisfiedCount / feedbacks.length) * 100;
    }

    return [{
      remote_attendances: remoteAttendances,
      average_resolution_time: averageResolutionTime,
      customer_satisfaction: customerSatisfaction,
      period,
      date: now.toISOString()
    }];
  }
}

export class StatsService {
  async getTicketStats(): Promise<TicketStats> {
    if (!supabase) {
      return {
        total_tickets: 0,
        open_tickets: 0,
        closed_tickets: 0,
        pending_tickets: 0,
        by_priority: { 'Baixa': 0, 'Media': 0, 'Alta': 0, 'Urgente': 0 },
        by_status: { 'Aberta': 0, 'Fechada': 0, 'Pendente': 0 }
      };
    }

    const { data, error } = await supabase.rpc('get_ticket_stats');
    if (error) throw error;

    return {
      total_tickets: data[0]?.total_tickets || 0,
      open_tickets: data[0]?.open_tickets || 0,
      closed_tickets: data[0]?.closed_tickets || 0,
      pending_tickets: data[0]?.pending_tickets || 0,
      by_priority: { 'Baixa': 0, 'Media': 0, 'Alta': 0, 'Urgente': 0 },
      by_status: { 'Aberta': 0, 'Fechada': 0, 'Pendente': 0 }
    };
  }

  async getCustomerSatisfaction(): Promise<{ total_feedbacks: number; average_rating: number; satisfaction_percentage: number }> {
    if (!supabase) {
      return {
        total_feedbacks: 0,
        average_rating: 0,
        satisfaction_percentage: 0
      };
    }

    const { data, error } = await supabase.rpc('get_customer_satisfaction');
    if (error) throw error;

    return {
      total_feedbacks: data[0]?.total_feedbacks || 0,
      average_rating: data[0]?.average_rating || 0,
      satisfaction_percentage: data[0]?.satisfaction_percentage || 0
    };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    if (!supabase) {
      return {
        active_conversations: 0,
        open_tickets: 0,
        total_users: 0,
        satisfaction: 0,
        articles_count: 0,
        feedbacks_count: 0
      };
    }

    const [ticketStats, satisfaction, users, articles, feedbacks] = await Promise.all([
      this.getTicketStats(),
      this.getCustomerSatisfaction(),
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('knowledge_base_articles').select('id', { count: 'exact' }),
      supabase.from('feedbacks').select('id', { count: 'exact' })
    ]);

    return {
      active_conversations: ticketStats.open_tickets,
      open_tickets: ticketStats.open_tickets,
      total_users: users.count || 0,
      satisfaction: satisfaction.satisfaction_percentage,
      articles_count: articles.count || 0,
      feedbacks_count: feedbacks.count || 0
    };
  }
}

// Instâncias dos serviços
export const conversationServiceInstance = new ConversationService();
export const articleServiceInstance = new ArticleService();
export const feedbackServiceInstance = new FeedbackService();
export const notificationServiceInstance = new NotificationService();
export const kpiService = new KpiService();
export const statsService = new StatsService();