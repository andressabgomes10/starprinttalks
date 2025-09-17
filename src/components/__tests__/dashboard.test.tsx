import { render, screen, fireEvent } from '../../test-utils';
import { Dashboard } from '../dashboard';

// Mock dos componentes filhos
jest.mock('../real-time-stats', () => ({
  RealTimeStats: ({ className }: { className?: string }) => (
    <div data-testid="real-time-stats" className={className}>
      Real Time Stats Component
    </div>
  ),
}));

jest.mock('../layout/PageLayout', () => ({
  PageLayout: ({ 
    children, 
    title, 
    description, 
    primaryAction, 
    secondaryActions, 
    showRefresh, 
    onRefresh 
  }: any) => (
    <div data-testid="page-layout">
      <h1 data-testid="page-title">{title}</h1>
      <p data-testid="page-description">{description}</p>
      {primaryAction && (
        <button 
          data-testid="primary-action" 
          onClick={primaryAction.onClick}
        >
          {primaryAction.label}
        </button>
      )}
      {secondaryActions && secondaryActions.map((action: any, index: number) => (
        <button 
          key={index}
          data-testid={`secondary-action-${index}`} 
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
      {showRefresh && (
        <button data-testid="refresh-button" onClick={onRefresh}>
          Refresh
        </button>
      )}
      {children}
    </div>
  ),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Mock console.log para evitar logs desnecessários nos testes
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders dashboard with correct title and description', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('page-title')).toHaveTextContent('Dashboard');
    expect(screen.getByTestId('page-description')).toHaveTextContent('Visão geral das suas operações');
  });

  it('renders all stats cards with correct data', () => {
    render(<Dashboard />);
    
    // Verifica se os cards de estatísticas estão presentes
    expect(screen.getByText('Conversas Ativas')).toBeInTheDocument();
    expect(screen.getByText('247')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
    
    expect(screen.getByText('Tickets Abertos')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('-8%')).toBeInTheDocument();
    
    expect(screen.getByText('Clientes Ativos')).toBeInTheDocument();
    expect(screen.getByText('1,235')).toBeInTheDocument();
    expect(screen.getByText('+18%')).toBeInTheDocument();
    
    expect(screen.getByText('Satisfação')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
    expect(screen.getByText('+2%')).toBeInTheDocument();
  });

  it('renders recent activity section', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Atividade Recente')).toBeInTheDocument();
    expect(screen.getByText('Nova mensagem de Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Preciso de ajuda com o pedido #12345')).toBeInTheDocument();
    expect(screen.getByText('2 min atrás')).toBeInTheDocument();
  });

  it('renders team performance section', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Performance da Equipe')).toBeInTheDocument();
    expect(screen.getByText('Métricas dos últimos 7 dias')).toBeInTheDocument();
    expect(screen.getByText('Ana Silva')).toBeInTheDocument();
    expect(screen.getByText('Carlos Santos')).toBeInTheDocument();
    expect(screen.getByText('Mariana Costa')).toBeInTheDocument();
    expect(screen.getByText('Rafael Lima')).toBeInTheDocument();
  });

  it('renders quick actions section', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Ações Rápidas')).toBeInTheDocument();
    expect(screen.getByText('Acesse rapidamente as funcionalidades mais usadas')).toBeInTheDocument();
    expect(screen.getByText('Nova Conversa')).toBeInTheDocument();
    expect(screen.getByText('Criar Ticket')).toBeInTheDocument();
    expect(screen.getByText('Adicionar Cliente')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('renders real-time stats component', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('real-time-stats')).toBeInTheDocument();
  });

  it('handles primary action click', () => {
    render(<Dashboard />);
    
    const primaryActionButton = screen.getByTestId('primary-action');
    expect(primaryActionButton).toHaveTextContent('Relatório');
    
    fireEvent.click(primaryActionButton);
    expect(console.log).toHaveBeenCalledWith('Generate report');
  });

  it('handles secondary action click', () => {
    render(<Dashboard />);
    
    const secondaryActionButton = screen.getByTestId('secondary-action-0');
    expect(secondaryActionButton).toHaveTextContent('Últimos 30 dias');
    
    fireEvent.click(secondaryActionButton);
    expect(console.log).toHaveBeenCalledWith('Calendar filter');
  });

  it('handles refresh button click', () => {
    render(<Dashboard />);
    
    const refreshButton = screen.getByTestId('refresh-button');
    fireEvent.click(refreshButton);
    expect(console.log).toHaveBeenCalledWith('Refreshing dashboard');
  });

  it('handles quick action button clicks', () => {
    render(<Dashboard />);
    
    const newConversationButton = screen.getByText('Nova Conversa');
    const createTicketButton = screen.getByText('Criar Ticket');
    const addClientButton = screen.getByText('Adicionar Cliente');
    const reportsButton = screen.getByText('Relatórios');
    
    fireEvent.click(newConversationButton);
    expect(console.log).toHaveBeenCalledWith('New conversation');
    
    fireEvent.click(createTicketButton);
    expect(console.log).toHaveBeenCalledWith('Create ticket');
    
    fireEvent.click(addClientButton);
    expect(console.log).toHaveBeenCalledWith('Add client');
    
    fireEvent.click(reportsButton);
    expect(console.log).toHaveBeenCalledWith('Reports');
  });

  it('displays correct priority badges for recent activity', () => {
    render(<Dashboard />);
    
    // Verifica se as badges de prioridade estão sendo exibidas
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByText('Média')).toBeInTheDocument();
    expect(screen.getByText('Baixa')).toBeInTheDocument();
  });

  it('displays team member metrics correctly', () => {
    render(<Dashboard />);
    
    // Verifica se as métricas da equipe estão sendo exibidas
    expect(screen.getByText('45 msgs')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('38 msgs')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('applies correct CSS classes for animations', () => {
    render(<Dashboard />);
    
    // Verifica se as classes de animação estão sendo aplicadas
    const statsCards = screen.getAllByText(/Conversas Ativas|Tickets Abertos|Clientes Ativos|Satisfação/);
    statsCards.forEach(card => {
      expect(card.closest('[class*="animate-in"]')).toBeInTheDocument();
    });
  });
});
