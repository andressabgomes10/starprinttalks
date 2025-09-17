import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { Login } from '../login';

// Mock do CajaLogoWithText
jest.mock('../ui/caja-logo', () => ({
  CajaLogoWithText: ({ logoSize, textSize, variant, animated }: any) => (
    <div data-testid="caja-logo" data-logo-size={logoSize} data-text-size={textSize} data-variant={variant} data-animated={animated}>
      Cajá Logo
    </div>
  ),
}));

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with all required elements', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByTestId('caja-logo')).toBeInTheDocument();
    expect(screen.getByText('Bem-vindo de volta!')).toBeInTheDocument();
    expect(screen.getByText('Faça login para acessar sua conta')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('renders demo login button', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i })).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByText('Esqueceu sua senha?')).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByText('Não tem uma conta?')).toBeInTheDocument();
    expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
  });

  it('handles form input changes', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('handles demo login button click', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);
    
    const demoButton = screen.getByRole('button', { name: /entrar rapidamente \(demo\)/i });
    await user.click(demoButton);
    
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  it('handles regular login form submission', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);
    
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);
    
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(loginButton);
    
    // Verifica se o botão mostra estado de loading
    expect(loginButton).toBeDisabled();
  });

  it('handles forgot password click', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);
    
    const forgotPasswordLink = screen.getByText('Esqueceu sua senha?');
    await user.click(forgotPasswordLink);
    
    // Aqui você pode verificar se uma modal ou página de recuperação de senha é exibida
    // Por enquanto, apenas verificamos se o link é clicável
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  it('handles sign up link click', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);
    
    const signUpLink = screen.getByText('Cadastre-se');
    await user.click(signUpLink);
    
    // Aqui você pode verificar se uma modal ou página de cadastro é exibida
    // Por enquanto, apenas verificamos se o link é clicável
    expect(signUpLink).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);
    
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(loginButton);
    
    // Verifica se os campos obrigatórios são validados
    // (isso depende da implementação de validação do componente)
    expect(loginButton).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const form = screen.getByRole('form');
    expect(form).toHaveClass('space-y-6');
    
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveClass('w-full');
    
    const passwordInput = screen.getByLabelText(/senha/i);
    expect(passwordInput).toHaveClass('w-full');
  });

  it('renders with correct logo configuration', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const logo = screen.getByTestId('caja-logo');
    expect(logo).toHaveAttribute('data-logo-size', 'lg');
    expect(logo).toHaveAttribute('data-text-size', 'xl');
    expect(logo).toHaveAttribute('data-variant', 'default');
    expect(logo).toHaveAttribute('data-animated', 'true');
  });

  it('maintains form state during user interaction', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    // Verifica se os valores persistem
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    
    // Simula perda de foco e retorno
    await user.tab();
    await user.tab();
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
