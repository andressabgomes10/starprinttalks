import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppContext } from './contexts/AppContext';

// Mock do AppContext
const mockAppContextValue = {
  currentPage: 'dashboard',
  setCurrentPage: jest.fn(),
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  isMobileSidebarOpen: false,
  setIsMobileSidebarOpen: jest.fn(),
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: jest.fn(),
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: jest.fn(),
  isSearchOpen: false,
  setIsSearchOpen: jest.fn(),
  isOnboardingOpen: false,
  setIsOnboardingOpen: jest.fn(),
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  appContextValue?: Partial<typeof mockAppContextValue>;
}

const AllTheProviders = ({ 
  children, 
  appContextValue = mockAppContextValue 
}: { 
  children: React.ReactNode;
  appContextValue?: Partial<typeof mockAppContextValue>;
}) => {
  const contextValue = { ...mockAppContextValue, ...appContextValue };
  
  return (
    <AppContext.Provider value={contextValue as any}>
      {children}
    </AppContext.Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { appContextValue, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders appContextValue={appContextValue}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Helper para criar dados mock
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  role: 'agent' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockClient = (overrides = {}) => ({
  id: 'test-client-id',
  name: 'Test Client',
  email: 'client@example.com',
  phone: '+5511999999999',
  company: 'Test Company',
  status: 'active' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockTicket = (overrides = {}) => ({
  id: 'test-ticket-id',
  title: 'Test Ticket',
  description: 'Test description',
  status: 'open' as const,
  priority: 'medium' as const,
  client_id: 'test-client-id',
  assigned_to: 'test-user-id',
  created_by: 'test-user-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  resolved_at: null,
  ...overrides,
});

export const createMockConversation = (overrides = {}) => ({
  id: 'test-conversation-id',
  ticket_id: 'test-ticket-id',
  message: 'Test message',
  sender_id: 'test-user-id',
  sender_type: 'user' as const,
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Helper para simular eventos de teclado
export const simulateKeyboardEvent = (element: HTMLElement, key: string, modifiers: string[] = []) => {
  const event = new KeyboardEvent('keydown', {
    key,
    ctrlKey: modifiers.includes('ctrl'),
    metaKey: modifiers.includes('cmd'),
    shiftKey: modifiers.includes('shift'),
    altKey: modifiers.includes('alt'),
  });
  element.dispatchEvent(event);
};

// Helper para aguardar animações
export const waitForAnimation = () => new Promise(resolve => setTimeout(resolve, 100));
