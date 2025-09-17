import { useState, useEffect } from 'react';
import { getMockData, simulateApiDelay } from '../data/mockData';
import { 
  conversationServiceInstance, 
  articleServiceInstance,
  feedbackServiceInstance,
  notificationServiceInstance,
  kpiService,
  statsService
} from '../services/database';
import type {
  User, Conversation, KnowledgeBaseArticle, Feedback, Notification,
  ConversationFilters, ArticleFilters, NotificationFilters,
  TicketStats, ConversationStats, ArticleStats, FeedbackStats,
  KpiData, DashboardStats, CreateConversationData, CreateKnowledgeBaseArticleData,
  CreateFeedbackData, CreateNotificationData
} from '../types/database';

// Hook para gerenciar conversas (tickets)
export const useConversations = (filters?: ConversationFilters) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await conversationServiceInstance.getConversationsWithDetails(filters);
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas');
      console.error('Erro ao carregar conversas:', err);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (data: CreateConversationData) => {
    try {
      const newConversation = await conversationServiceInstance.createConversation(data);
      setConversations(prev => [newConversation, ...prev]);
      return newConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conversa');
      throw err;
    }
  };

  const assignConversation = async (conversationId: number, agentId: number) => {
    try {
      const updatedConversation = await conversationServiceInstance.assignConversation(conversationId, agentId);
      setConversations(prev => prev.map(c => c.id === conversationId ? updatedConversation : c));
      return updatedConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atribuir conversa');
      throw err;
    }
  };

  const closeConversation = async (conversationId: number) => {
    try {
      const updatedConversation = await conversationServiceInstance.closeConversation(conversationId);
      setConversations(prev => prev.map(c => c.id === conversationId ? updatedConversation : c));
      return updatedConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fechar conversa');
      throw err;
    }
  };

  useEffect(() => {
    loadConversations();
  }, [filters]);

  return {
    conversations,
    loading,
    error,
    loadConversations,
    createConversation,
    assignConversation,
    closeConversation
  };
};

// Hook para gerenciar artigos
export const useArticles = (filters?: ArticleFilters) => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleServiceInstance.getArticlesWithDetails(filters);
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar artigos');
      console.error('Erro ao carregar artigos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async (data: CreateKnowledgeBaseArticleData) => {
    try {
      const newArticle = await articleServiceInstance.createArticle(data);
      setArticles(prev => [newArticle, ...prev]);
      return newArticle;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar artigo');
      throw err;
    }
  };

  const incrementViews = async (articleId: number) => {
    try {
      await articleServiceInstance.incrementViews(articleId);
      setArticles(prev => prev.map(a => 
        a.id === articleId 
          ? { ...a, views_count: a.views_count + 1 }
          : a
      ));
    } catch (err) {
      console.error('Erro ao incrementar visualizações:', err);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [filters]);

  return {
    articles,
    loading,
    error,
    loadArticles,
    createArticle,
    incrementViews
  };
};

// Hook para gerenciar feedbacks
export const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedbackServiceInstance.getFeedbacksWithDetails();
      setFeedbacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar feedbacks');
      console.error('Erro ao carregar feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFeedback = async (data: CreateFeedbackData) => {
    try {
      const newFeedback = await feedbackServiceInstance.createFeedback(data);
      setFeedbacks(prev => [newFeedback, ...prev]);
      return newFeedback;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar feedback');
      throw err;
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  return {
    feedbacks,
    loading,
    error,
    loadFeedbacks,
    createFeedback
  };
};

// Hook para gerenciar notificações
export const useNotifications = (userId: number, filters?: NotificationFilters) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationServiceInstance.getNotificationsForUser(userId, filters);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (data: CreateNotificationData) => {
    try {
      const newNotification = await notificationServiceInstance.createNotification(data);
      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar notificação');
      throw err;
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const updatedNotification = await notificationServiceInstance.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? updatedNotification : n));
      return updatedNotification;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar notificação como lida');
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationServiceInstance.markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar todas as notificações como lidas');
      throw err;
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [userId, filters]);

  return {
    notifications,
    loading,
    error,
    loadNotifications,
    createNotification,
    markAsRead,
    markAllAsRead
  };
};

// Hook para estatísticas
export const useStats = () => {
  const [ticketStats, setTicketStats] = useState<TicketStats | null>(null);
  const [conversationStats, setConversationStats] = useState<ConversationStats | null>(null);
  const [articleStats, setArticleStats] = useState<ArticleStats | null>(null);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tickets, conversations, articles, feedbacks] = await Promise.all([
        statsService.getTicketStats(),
        conversationServiceInstance.getConversationStats(),
        articleServiceInstance.getArticleStats(),
        feedbackServiceInstance.getFeedbackStats()
      ]);

      setTicketStats(tickets);
      setConversationStats(conversations);
      setArticleStats(articles);
      setFeedbackStats(feedbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    ticketStats,
    conversationStats,
    articleStats,
    feedbackStats,
    loading,
    error,
    loadStats
  };
};

// Hook para KPIs
export const useKpis = (period: 'day' | 'week' | 'month' = 'week') => {
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadKpis = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await kpiService.getKpiData(period);
      setKpis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar KPIs');
      console.error('Erro ao carregar KPIs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKpis();
  }, [period]);

  return {
    kpis,
    loading,
    error,
    loadKpis
  };
};

// Hook para dashboard
export const useDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statsService.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas do dashboard');
      console.error('Erro ao carregar estatísticas do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  return {
    dashboardStats,
    loading,
    error,
    loadDashboardStats
  };
};

// Hook para dados mockados (fallback)
export const useMockData = () => {
  return {
    users: getMockData.users(),
    conversations: getMockData.conversations(),
    articles: getMockData.articles(),
    feedbacks: getMockData.feedbacks(),
    notifications: getMockData.notifications(),
    channels: getMockData.channels(),
    articleCategories: getMockData.articleCategories(),
    slaRules: getMockData.slaRules(),
    operatingHours: getMockData.operatingHours(),
    customers: getMockData.customers(),
    stats: {
      tickets: getMockData.stats.tickets(),
      conversations: getMockData.stats.conversations(),
      articles: getMockData.stats.articles(),
      feedbacks: getMockData.stats.feedbacks(),
      dashboard: getMockData.stats.dashboard()
    },
    kpis: getMockData.kpis()
  };
};