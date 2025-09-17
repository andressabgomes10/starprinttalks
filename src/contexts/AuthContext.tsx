import React, { createContext, useContext, useState, useEffect } from 'react';
import { MockAPI, MockUser } from '../data/mockData';

interface AuthContextType {
  user: MockUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const users = MockAPI.getUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      // Simple password validation (in real app, this would be handled by backend)
      const validCredentials = [
        { email: 'admin@starprinttalks.com', password: 'admin123' },
        { email: 'ana.silva@starprinttalks.com', password: 'password123' },
        { email: 'carlos.santos@starprinttalks.com', password: 'password123' },
        // Allow any email with password "password123" for demo purposes
      ];

      const isValidCredential = validCredentials.some(
        cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      ) || password === 'password123'; // Demo fallback

      if (foundUser && isValidCredential) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}