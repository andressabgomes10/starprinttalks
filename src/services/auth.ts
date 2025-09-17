/**
 * Auth Service para Star Print Talks
 * Sistema de autenticação simplificado
 */

export interface AuthUser {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'admin' | 'agent' | 'client'
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, fullName?: string) {
    try {
      // Para simplificar, vamos criar um usuário diretamente
      const user = {
        id: this.generateId(),
        email,
        full_name: fullName || null,
        avatar_url: null,
        role: 'client' as const,
      }

      // Armazenar localmente
      localStorage.setItem('cajaTalks_demoUser', JSON.stringify(user))
      localStorage.setItem('cajaTalks_authToken', this.generateToken())

      return {
        user,
        session: { access_token: 'demo-token' },
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      // Para simplificar, vamos usar dados mock
      const user = {
        id: this.generateId(),
        email,
        full_name: 'Usuário Demo',
        avatar_url: null,
        role: 'admin' as const,
      }

      // Armazenar localmente
      localStorage.setItem('cajaTalks_demoUser', JSON.stringify(user))
      localStorage.setItem('cajaTalks_authToken', this.generateToken())

      return {
        user,
        session: { access_token: 'demo-token' },
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Sign out
  static async signOut() {
    try {
      // Clear stored data
      localStorage.removeItem('cajaTalks_demoUser')
      localStorage.removeItem('cajaTalks_authToken')
      
      return { error: null }
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const storedUser = localStorage.getItem('cajaTalks_demoUser')
      if (storedUser) {
        return JSON.parse(storedUser)
      }
      return null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<AuthUser>) {
    const storedUser = localStorage.getItem('cajaTalks_demoUser')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      const updatedUser = { ...userData, ...updates }
      localStorage.setItem('cajaTalks_demoUser', JSON.stringify(updatedUser))
      return updatedUser
    }
    throw new Error('No user data found')
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const checkAuth = async () => {
      const user = await this.getCurrentUser()
      callback(user)
    }
    
    checkAuth()
    
    return {
      unsubscribe: () => {
        // Cleanup logic
      }
    }
  }

  // Reset password (placeholder)
  static async resetPassword(email: string) {
    console.warn('Reset password not yet implemented')
    throw new Error('Reset password feature not yet implemented')
  }

  // Update password (placeholder)
  static async updatePassword(newPassword: string) {
    console.warn('Update password not yet implemented')
    throw new Error('Update password feature not yet implemented')
  }

  // Helper methods
  private static generateId(): string {
    return 'user-' + Math.random().toString(36).substr(2, 9)
  }

  private static generateToken(): string {
    return 'token-' + Math.random().toString(36).substr(2, 9)
  }
}