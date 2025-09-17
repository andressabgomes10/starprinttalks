import { useState, useEffect, useCallback } from 'react'
import { AuthService, AuthUser } from '../services/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        console.log('Initial auth check - user:', currentUser)
        
        if (mounted) {
          setUser(currentUser)
        }
      } catch (err) {
        console.warn('Auth initialization error:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Auth initialization failed')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, [])

  // Sign in
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await AuthService.signIn(email, password)
      
      if (data.user) {
        const userData: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || null,
          avatar_url: data.user.user_metadata?.avatar_url || null,
          role: data.user.user_metadata?.role || 'client',
        }
        console.log('Login successful, user:', userData)
        setUser(userData)
        localStorage.setItem('cajaTalks_demoUser', JSON.stringify(userData))
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Sign up
  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await AuthService.signUp(email, password, fullName)
      
      if (data.user) {
        const userData: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName || null,
          avatar_url: null,
          role: 'client',
        }
        console.log('SignUp successful, user:', userData)
        
        // Store user data but don't set as logged in (user needs to login)
        localStorage.setItem('cajaTalks_signUpUser', JSON.stringify(userData))
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('SignUp error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      await AuthService.signOut()
      
      setUser(null)
      localStorage.removeItem('cajaTalks_demoUser')
      
      return { error: null }
    } catch (err) {
      console.error('SignOut error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await AuthService.resetPassword(email)
      
      return { error: null }
    } catch (err) {
      console.error('Reset password error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao resetar senha'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update password
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await AuthService.updatePassword(newPassword)
      
      return { error: null }
    } catch (err) {
      console.error('Update password error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar senha'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<AuthUser>) => {
    if (!user) throw new Error('Usuário não autenticado')

    try {
      setLoading(true)
      setError(null)
      
      const updatedUser = await AuthService.updateProfile(user.id, updates)
      
      setUser(updatedUser)
      localStorage.setItem('cajaTalks_demoUser', JSON.stringify(updatedUser))
      
      return updatedUser
    } catch (err) {
      console.error('Update profile error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAgent: user?.role === 'agent' || user?.role === 'admin',
    isClient: user?.role === 'client',
  }
}
