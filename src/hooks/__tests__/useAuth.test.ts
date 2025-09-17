import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock do AuthService
const mockAuthService = {
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  onAuthStateChange: jest.fn(),
  resetPassword: jest.fn(),
  updateProfile: jest.fn(),
};

jest.mock('../../services/auth', () => ({
  AuthService: mockAuthService,
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles successful login', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      avatar_url: null,
      role: 'agent' as const,
    };

    mockAuthService.signIn.mockResolvedValue({
      success: true,
      user: mockUser,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(mockAuthService.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('handles login error', async () => {
    const mockError = 'Invalid credentials';

    mockAuthService.signIn.mockResolvedValue({
      success: false,
      user: null,
      error: mockError,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'wrongpassword');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
  });

  it('handles successful signup', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      avatar_url: null,
      role: 'agent' as const,
    };

    mockAuthService.signUp.mockResolvedValue({
      success: true,
      user: mockUser,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123', 'Test User');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(mockAuthService.signUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
  });

  it('handles signup error', async () => {
    const mockError = 'Email already registered';

    mockAuthService.signUp.mockResolvedValue({
      success: false,
      user: null,
      error: mockError,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123', 'Test User');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
  });

  it('handles successful logout', async () => {
    mockAuthService.signOut.mockResolvedValue({
      success: true,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    // Primeiro, simula um usuário logado
    act(() => {
      result.current.user = {
        id: 'test-user-id',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        role: 'agent' as const,
      };
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Agora faz logout
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockAuthService.signOut).toHaveBeenCalled();
  });

  it('handles logout error', async () => {
    const mockError = 'Logout failed';

    mockAuthService.signOut.mockResolvedValue({
      success: false,
      error: mockError,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.error).toBe(mockError);
  });

  it('clears error when new action is performed', async () => {
    // Primeiro, simula um erro
    mockAuthService.signIn.mockResolvedValueOnce({
      success: false,
      user: null,
      error: 'First error',
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'wrongpassword');
    });

    expect(result.current.error).toBe('First error');

    // Agora simula sucesso
    mockAuthService.signIn.mockResolvedValueOnce({
      success: true,
      user: { id: 'test-user-id' } as any,
      error: null,
    });

    await act(async () => {
      await result.current.signIn('test@example.com', 'correctpassword');
    });

    expect(result.current.error).toBeNull();
  });

  it('sets loading state correctly during async operations', async () => {
    // Simula uma operação lenta
    mockAuthService.signIn.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true, user: null, error: null }), 100))
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      const promise = result.current.signIn('test@example.com', 'password123');
      // Verifica se loading ainda está true durante a operação
      expect(result.current.loading).toBe(true);
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('handles auth state change', () => {
    const mockUnsubscribe = jest.fn();

    mockAuthService.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    const { result } = renderHook(() => useAuth());

    // Simula mudança de estado de autenticação
    act(() => {
      result.current.user = {
        id: 'test-user-id',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        role: 'agent' as const,
      };
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(mockAuthService.onAuthStateChange).toHaveBeenCalled();
  });

  it('handles reset password', async () => {
    mockAuthService.resetPassword.mockResolvedValue({
      success: true,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });

    expect(mockAuthService.resetPassword).toHaveBeenCalledWith('test@example.com');
  });

  it('handles update profile', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Updated Name',
      avatar_url: null,
      role: 'agent' as const,
    };

    mockAuthService.updateProfile.mockResolvedValue({
      success: true,
      user: mockUser,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.updateProfile({ full_name: 'Updated Name' });
    });

    expect(mockAuthService.updateProfile).toHaveBeenCalledWith({ full_name: 'Updated Name' });
  });
});