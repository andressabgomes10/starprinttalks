import { useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'supervisor' | 'client';
  department: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
  joinDate: string;
  lastActive: string;
  stats: {
    tickets: number;
    conversations: number;
    rating: number;
  };
}

export interface UserFilters {
  search: string;
  role: string;
  department: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    department: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Fetch users from Supabase
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          role,
          created_at,
          updated_at,
          org_id
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedUsers: User[] = data?.map(user => ({
        id: user.id,
        name: user.full_name || 'Nome não informado',
        email: user.email,
        role: user.role as User['role'],
        department: 'Não informado', // This would need to be fetched from a departments table
        status: 'offline' as const, // This would need to be calculated based on last activity
        joinDate: new Date(user.created_at).toLocaleDateString('pt-BR'),
        lastActive: new Date(user.updated_at).toLocaleDateString('pt-BR'),
        stats: {
          tickets: 0, // This would need to be calculated from tickets table
          conversations: 0, // This would need to be calculated from conversations table
          rating: 0 // This would need to be calculated from feedback
        }
      })) || [];

      setUsers(formattedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                           user.department.toLowerCase().includes(filters.search.toLowerCase());
        const matchesRole = filters.role === 'all' || user.role === filters.role;
        const matchesDepartment = filters.department === 'all' || user.department === filters.department;
        const matchesStatus = filters.status === 'all' || user.status === filters.status;
        
        return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
      })
      .sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'email':
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case 'role':
            aValue = a.role;
            bValue = b.role;
            break;
          case 'department':
            aValue = a.department.toLowerCase();
            bValue = b.department.toLowerCase();
            break;
          case 'joinDate':
            aValue = new Date(a.joinDate).getTime();
            bValue = new Date(b.joinDate).getTime();
            break;
          case 'lastActive':
            aValue = new Date(a.lastActive).getTime();
            bValue = new Date(b.lastActive).getTime();
            break;
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
        }
        
        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [users, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create new user
  const createUser = useCallback(async (userData: Omit<User, 'id' | 'joinDate' | 'lastActive' | 'stats'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // First, create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'tempPassword123!', // This should be generated or sent via email
        email_confirm: true,
        user_metadata: {
          full_name: userData.name,
          role: userData.role,
          department: userData.department
        }
      });

      if (authError) throw authError;

      // Then, create the user record in our users table
      const { data, error: createError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: userData.email,
          full_name: userData.name,
          role: userData.role,
          org_id: '00000000-0000-0000-0000-000000000000' // Default org
        }])
        .select()
        .single();

      if (createError) throw createError;

      // Refresh users list
      await fetchUsers();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
      console.error('Error creating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Update user
  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: updateError } = await supabase
        .from('users')
        .update({
          full_name: updates.name,
          email: updates.email,
          role: updates.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...updates } : user
      ));
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
      console.error('Error updating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // First, delete from our users table
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Then, delete from Supabase Auth (admin function)
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(id);
      
      if (authDeleteError) {
        console.warn('Error deleting user from auth:', authDeleteError);
        // Don't throw here as the user is already deleted from our table
      }

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar usuário');
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user statistics
  const getUserStats = useCallback(() => {
    const total = users.length;
    const online = users.filter(u => u.status === 'online').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const agents = users.filter(u => u.role === 'agent').length;
    const supervisors = users.filter(u => u.role === 'supervisor').length;

    return {
      total,
      online,
      admins,
      agents,
      supervisors
    };
  }, [users]);

  return {
    users: filteredUsers,
    loading,
    error,
    filters,
    updateFilters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserStats
  };
}
