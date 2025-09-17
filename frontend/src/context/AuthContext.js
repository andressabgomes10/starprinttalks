import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseService } from '../services/supabaseService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há usuário logado
    checkUser();
    
    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabaseService.supabase?.auth?.onAuthStateChange?.(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user || null);
          setIsAuthenticated(!!session?.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    ) || { data: { subscription: null } };

    return () => subscription?.unsubscribe?.();
  }, []);

  const checkUser = async () => {
    try {
      // Primeiro verificar localStorage para demo
      const savedAuth = localStorage.getItem('cajatalks_auth');
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        setUser(authData.user);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // Depois verificar Supabase
      const currentUser = await supabaseService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Tentar login com Supabase primeiro
      const result = await supabaseService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Log da atividade
        await supabaseService.logActivity({
          type: 'user_login',
          description: 'Login realizado no sistema',
          metadata: { email }
        });
        
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async () => {
    try {
      setLoading(true);
      
      const demoUser = {
        id: 'demo001',
        name: 'Usuário Demo',
        email: 'demo@cajatalks.com',
        role: 'Admin',
        avatar: null,
        user_metadata: {
          name: 'Usuário Demo'
        }
      };
      
      // Salvar no localStorage para modo demo
      localStorage.setItem('cajatalks_auth', JSON.stringify({ user: demoUser }));
      supabaseService.setCurrentUser(demoUser);
      
      setUser(demoUser);
      setIsAuthenticated(true);
      
      return { success: true, user: demoUser };
    } catch (error) {
      console.error('Demo login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      
      const result = await supabaseService.register(email, password, userData);
      
      if (result.success) {
        // Não setar como logado automaticamente, usuário precisa confirmar email
        return { success: true, message: 'Verifique seu email para ativar a conta' };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Remover localStorage (modo demo)
      localStorage.removeItem('cajatalks_auth');
      
      // Logout do Supabase
      await supabaseService.logout();
      supabaseService.clearCurrentUser();
      
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    loginDemo,
    register,
    logout,
    checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};