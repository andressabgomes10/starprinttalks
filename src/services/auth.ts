import { apiService } from './api'

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
      const response = await apiService.register(email, password)
      
      if (response.ok && response.data?.user) {
        return {
          user: {
            id: response.data.user,
            email,
            user_metadata: {
              full_name: fullName,
            },
          },
          session: null, // No session until login
        }
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const response = await apiService.login(email, password)
      
      if (response.ok && response.data?.access_token) {
        // Set token in API service
        apiService.setToken(response.data.access_token)
        
        return {
          user: {
            id: response.data.user,
            email,
            user_metadata: {},
          },
          session: {
            access_token: response.data.access_token,
            refresh_token: 'not-implemented',
          },
        }
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Sign out
  static async signOut() {
    try {
      // Clear token from API service
      apiService.setToken(null)
      
      // Clear any stored user data
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
      // Check if we have a stored token
      const token = localStorage.getItem('cajaTalks_authToken')
      if (!token) {
        return null
      }

      // Set token in API service if not already set
      apiService.setToken(token)

      // Try to get user info from backend
      const response = await apiService.getMe()
      
      if (response.ok) {
        // Get stored user data for now (since /me endpoint doesn't return full user data yet)
        const storedUser = localStorage.getItem('cajaTalks_demoUser')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          return {
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name,
            avatar_url: userData.avatar_url,
            role: userData.role || 'client',
          }
        }

        // Fallback user data if no stored user
        return {
          id: 'current-user',
          email: 'user@cajatalks.com',
          full_name: 'Current User',
          avatar_url: null,
          role: 'client',
        }
      }
      
      return null
    } catch (error) {
      console.error('Get current user error:', error)
      // Clear invalid token
      apiService.setToken(null)
      return null
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<AuthUser>) {
    // For now, just store locally since backend doesn't have user profile update yet
    const storedUser = localStorage.getItem('cajaTalks_demoUser')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      const updatedUser = { ...userData, ...updates }
      localStorage.setItem('cajaTalks_demoUser', JSON.stringify(updatedUser))
      return updatedUser
    }
    throw new Error('No user data found')
  }

  // Listen to auth state changes (simplified for FastAPI integration)
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    // For now, we'll trigger this manually when login/logout happens
    // In a full implementation, you'd want to set up a proper state management system
    const checkAuth = async () => {
      const user = await this.getCurrentUser()
      callback(user)
    }
    
    // Check auth state immediately
    checkAuth()
    
    // Return a mock subscription object
    return {
      unsubscribe: () => {
        // Cleanup logic would go here
      }
    }
  }

  // Reset password (placeholder - would need backend implementation)
  static async resetPassword(email: string) {
    // This would need to be implemented in the backend
    console.warn('Reset password not yet implemented in backend')
    throw new Error('Reset password feature not yet implemented')
  }

  // Update password (placeholder - would need backend implementation)
  static async updatePassword(newPassword: string) {
    // This would need to be implemented in the backend
    console.warn('Update password not yet implemented in backend')
    throw new Error('Update password feature not yet implemented')
  }
}
