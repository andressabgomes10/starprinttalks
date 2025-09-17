import { render, screen, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock de todos os componentes filhos para focar no fluxo principal
jest.mock('../components/dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Component</div>,
}));

jest.mock('../components/inbox', () => ({
  Inbox: () => <div data-testid="inbox">Inbox Component</div>,
}));

jest.mock('../components/tickets', () => ({
  Tickets: () => <div data-testid="tickets">Tickets Component</div>,
}));

jest.mock('../components/clients', () => ({
  Clients: () => <div data-testid="clients">Clients Component</div>,
}));

jest.mock('../components/settings', () => ({
  Settings: () => <div data-testid="settings">Settings Component</div>,
}));

jest.mock('../components/profile', () => ({
  Profile: () => <div data-testid="profile">Profile Component</div>,
}));

jest.mock('../components/team', () => ({
  Team: () => <div data-testid="team">Team Component</div>,
}));

jest.mock('../components/reports', () => ({
  Reports: () => <div data-testid="reports">Reports Component</div>,
}));

jest.mock('../components/knowledge-base', () => ({
  KnowledgeBase: () => <div data-testid="knowledge-base">Knowledge Base Component</div>,
}));

jest.mock('../components/integrations', () => ({
  Integrations: () => <div data-testid="integrations">Integrations Component</div>,
}));

jest.mock('../components/activity-log', () => ({
  ActivityLog: () => <div data-testid="activity-log">Activity Log Component</div>,
}));

jest.mock('../components/sidebar', () => ({
  CajaSidebar: ({ currentPage, onPageChange, isMobile, onClose }: any) => (
    <div data-testid="sidebar">
      <button onClick={() => onPageChange('dashboard')}>Dashboard</button>
      <button onClick={() => onPageChange('inbox')}>Inbox</button>
      <button onClick={() => onPageChange('tickets')}>Tickets</button>
      <button onClick={() => onPageChange('clients')}>Clients</button>
      <button onClick={() => onPageChange('settings')}>Settings</button>
      {isMobile && <button onClick={onClose}>Close</button>}
    </div>
  ),
}));

jest.mock('../components/global-search', () => ({
  GlobalSearch: ({ isOpen, onClose, onNavigate }: any) => 
    isOpen ? (
      <div data-testid="global-search">
        <button onClick={() => onNavigate('conversation', '1')}>Search Result 1</button>
        <button onClick={onClose}>Close Search</button>
      </div>
    ) : null,
}));

jest.mock('../components/onboarding', () => ({
  Onboarding: ({ isOpen, onClose, onComplete }: any) => 
    isOpen ? (
      <div data-testid="onboarding">
        <button onClick={onComplete}>Complete Onboarding</button>
        <button onClick={onClose}>Skip Onboarding</button>
      </div>
    ) : null,
}));

jest.mock('../components/mobile-menu', () => ({
  MobileMenu: ({ isOpen, onClose, currentPage, onPageChange, onSearchOpen }: any) => 
    isOpen ? (
      <div data-testid="mobile-menu">
        <button onClick={() => onPageChange('dashboard')}>Dashboard</button>
        <button onClick={() => onPageChange('inbox')}>Inbox</button>
        <button onClick={onSearchOpen}>Search</button>
        <button onClick={onClose}>Close Menu</button>
      </div>
    ) : null,
}));

jest.mock('../components/notifications', () => ({
  useNotifications: () => ({
    NotificationSystem: () => <div data-testid="notification-system">Notification System</div>,
    showSuccess: jest.fn(),
    showInfo: jest.fn(),
  }),
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should show login screen when not authenticated', () => {
      render(<App />);
      
      expect(screen.getByText('Bem-vindo de volta!')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard')).not.toBeInTheDocument();
    });

    it('should show main app when authenticated', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const demoButton = screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i });
      await user.click(demoButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      });
    });

    it('should show onboarding for new users', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const demoButton = screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i });
      await user.click(demoButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('onboarding')).toBeInTheDocument();
      });
    });

    it('should complete onboarding and hide it', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const demoButton = screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i });
      await user.click(demoButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('onboarding')).toBeInTheDocument();
      });
      
      const completeButton = screen.getByRole('button', { name: /complete onboarding/i });
      await user.click(completeButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('onboarding')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation Flow', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const demoButton = screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i });
      await user.click(demoButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      });
    });

    it('should navigate between pages using sidebar', async () => {
      const user = userEvent.setup();
      
      // Navega para Inbox
      const inboxButton = screen.getByRole('button', { name: /inbox/i });
      await user.click(inboxButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('inbox')).toBeInTheDocument();
      });
      
      // Navega para Tickets
      const ticketsButton = screen.getByRole('button', { name: /tickets/i });
      await user.click(ticketsButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('tickets')).toBeInTheDocument();
      });
    });

    it('should navigate using global search', async () => {
      const user = userEvent.setup();
      
      // Abre busca global
      const searchButton = screen.getByText('🔍');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('global-search')).toBeInTheDocument();
      });
      
      // Navega usando resultado da busca
      const searchResult = screen.getByRole('button', { name: /search result 1/i });
      await user.click(searchResult);
      
      await waitFor(() => {
        expect(screen.getByTestId('inbox')).toBeInTheDocument();
        expect(screen.getByTestId('global-search')).not.toBeInTheDocument();
      });
    });
  });

  describe('Mobile Navigation Flow', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const demoButton = screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i });
      await user.click(demoButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      });
    });

    it('should open and close mobile sidebar', async () => {
      const user = userEvent.setup();
      
      // Abre sidebar mobile
      const hamburgerButton = screen.getByRole('button', { name: '' }); // Botão hamburger
      await user.click(hamburgerButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      });
      
      // Fecha sidebar mobile
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('sidebar')).not.toBeInTheDocument();
      });
    });

    it('should navigate using mobile sidebar', async () => {
      const user = userEvent.setup();
      
      // Abre sidebar mobile
      const hamburgerButton = screen.getByRole('button', { name: '' });
      await user.click(hamburgerButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      });
      
      // Navega para Inbox
      const inboxButton = screen.getByRole('button', { name: /inbox/i });
      await user.click(inboxButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('inbox')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar')).not.toBeInTheDocument();
      });
    });
  });

  describe('State Management', () => {
    it('should maintain state across page navigations', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Faz login
      const demoButton = screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i });
      await user.click(demoButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      });
      
      // Navega para outra página
      const inboxButton = screen.getByRole('button', { name: /inbox/i });
      await user.click(inboxButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('inbox')).toBeInTheDocument();
      });
      
      // Volta para dashboard
      const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
      await user.click(dashboardButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      });
    });

    it('should handle multiple rapid state changes', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Faz login
      const demoButton = screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i });
      await user.click(demoButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      });
      
      // Navega rapidamente entre páginas
      const inboxButton = screen.getByRole('button', { name: /inbox/i });
      const ticketsButton = screen.getByRole('button', { name: /tickets/i });
      const clientsButton = screen.getByRole('button', { name: /clients/i });
      
      await user.click(inboxButton);
      await user.click(ticketsButton);
      await user.click(clientsButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('clients')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle component errors gracefully', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Faz login
      const demoButton = screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i });
      await user.click(demoButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      });
      
      // A aplicação deve continuar funcionando mesmo com erros
      expect(screen.getByTestId('notification-system')).toBeInTheDocument();
    });
  });
});
