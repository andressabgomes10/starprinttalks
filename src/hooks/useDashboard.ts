import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

export interface DashboardStats {
  active_conversations: number;
  open_tickets: number;
  active_clients: number;
  satisfaction: number;
  ticket_stats: Array<{ status: string; count: number }>;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.dashboard.getStats();
      console.log('Dashboard stats fetched:', data);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    refreshStats: fetchStats
  };
}