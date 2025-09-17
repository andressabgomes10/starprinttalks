import { AuthService } from '../auth';

// Mock do supabase
const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
};

jest.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up user successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' },
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await AuthService.signUp('test@example.com', 'password123', 'Test User');

      expect(result).toEqual({
        success: true,
        user: mockUser,
        error: null,
      });
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
          },
        },
      });
    });

    it('should handle sign up error', async () => {
      const mockError = { message: 'Email already registered' };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      const result = await AuthService.signUp('test@example.com', 'password123', 'Test User');

      expect(result).toEqual({
        success: false,
        user: null,
        error: mockError.message,
      });
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' },
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await AuthService.signIn('test@example.com', 'password123');

      expect(result).toEqual({
        success: true,
        user: mockUser,
        error: null,
      });
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle sign in error', async () => {
      const mockError = { message: 'Invalid credentials' };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      const result = await AuthService.signIn('test@example.com', 'wrongpassword');

      expect(result).toEqual({
        success: false,
        user: null,
        error: mockError.message,
      });
    });
  });

  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      const result = await AuthService.signOut();

      expect(result).toEqual({
        success: true,
        error: null,
      });
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out error', async () => {
      const mockError = { message: 'Sign out failed' };

      mockSupabase.auth.signOut.mockResolvedValue({ error: mockError });

      const result = await AuthService.signOut();

      expect(result).toEqual({
        success: false,
        error: mockError.message,
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await AuthService.getCurrentUser();

      expect(result).toEqual({
        success: true,
        user: mockUser,
        error: null,
      });
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    });

    it('should handle get current user error', async () => {
      const mockError = { message: 'User not found' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      const result = await AuthService.getCurrentUser();

      expect(result).toEqual({
        success: false,
        user: null,
        error: mockError.message,
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await AuthService.resetPassword('test@example.com');

      expect(result).toEqual({
        success: true,
        error: null,
      });
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle reset password error', async () => {
      const mockError = { message: 'Email not found' };

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: mockError });

      const result = await AuthService.resetPassword('test@example.com');

      expect(result).toEqual({
        success: false,
        error: mockError.message,
      });
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: { full_name: 'Updated Name' },
      };

      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await AuthService.updateProfile({ full_name: 'Updated Name' });

      expect(result).toEqual({
        success: true,
        user: mockUser,
        error: null,
      });
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        data: { full_name: 'Updated Name' },
      });
    });

    it('should handle update profile error', async () => {
      const mockError = { message: 'Update failed' };

      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      const result = await AuthService.updateProfile({ full_name: 'Updated Name' });

      expect(result).toEqual({
        success: false,
        user: null,
        error: mockError.message,
      });
    });
  });

  describe('onAuthStateChange', () => {
    it('should set up auth state change listener', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      });

      const unsubscribe = AuthService.onAuthStateChange(mockCallback);

      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalledWith(mockCallback);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});