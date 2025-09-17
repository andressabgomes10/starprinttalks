import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Eye, EyeOff, Sun, Moon, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { CajaLogo } from '../ui/caja-logo';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/use-toast';

interface AuthFormProps {
  onLogin: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';

export function AuthForm({ onLogin }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const { login, isLoading } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Star Print Talks",
        });
        
        onLogin();
      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast({
        title: "Erro no login",
        description: error.message || "Não foi possível fazer login. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Verifique se as senhas são iguais.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // For now, just simulate signup and redirect to login
    toast({
      title: "🎉 Conta criada com sucesso!",
      description: "Agora você pode fazer login com suas credenciais.",
    });
    
    // Clear form and go to login with email prefilled
    setMode('login');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Digite seu email para recuperar a senha.",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPassword(email);
      
      toast({
        title: "Email enviado!",
        description: "Verifique seu email para redefinir a senha.",
      });
      
      setMode('login');
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      toast({
        title: "Erro na recuperação",
        description: error.message || "Não foi possível enviar o email. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Bem-vindo';
      case 'signup':
        return 'Criar conta';
      case 'forgot-password':
        return 'Recuperar senha';
      default:
        return 'Bem-vindo';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login':
        return 'Entre na sua conta do Cajá Talks';
      case 'signup':
        return 'Crie sua conta no Cajá Talks';
      case 'forgot-password':
        return 'Digite seu email para recuperar a senha';
      default:
        return 'Entre na sua conta do Cajá Talks';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    switch (mode) {
      case 'login':
        return handleLogin(e);
      case 'signup':
        return handleSignup(e);
      case 'forgot-password':
        return handleForgotPassword(e);
      default:
        return handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center px-6 py-12">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full bg-muted hover:bg-muted/80 transition-all duration-200 hover:scale-105"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="h-4 w-4 text-foreground" />
        ) : (
          <Moon className="h-4 w-4 text-foreground" />
        )}
      </button>

      <div className="w-full max-w-sm space-y-16">
        {/* Logo & Title */}
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <CajaLogo 
              size="xl" 
              variant="default"
              animated={true}
            />
          </div>
          
          <div className="space-y-3">
            {mode !== 'login' && (
              <button
                onClick={() => handleModeChange('login')}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </button>
            )}
            
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {getTitle()}
            </h1>
            <p className="text-base text-muted-foreground font-normal">
              {getDescription()}
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Full Name - Only for signup */}
              {mode === 'signup' && (
                <div className="space-y-3">
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 text-base rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 pl-10"
                    required
                  />
                </div>
              </div>
              
              {/* Password - Not for forgot password */}
              {mode !== 'forgot-password' && (
                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-base rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 pl-10 pr-12"
                      required
                      minLength={mode === 'signup' ? 6 : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-md hover:bg-muted/50"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password - Only for signup */}
              {mode === 'signup' && (
                <div className="space-y-3">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 text-base rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 pl-10 pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-md hover:bg-muted/50"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <div className="mt-2">
                      <p className={`text-xs ${
                        password === confirmPassword 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {password === confirmPassword 
                          ? '✓ Senhas coincidem' 
                          : '✗ Senhas não coincidem'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Instructions for signup */}
            {mode === 'signup' && (
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                <h4 className="text-sm font-medium text-foreground mb-2">ℹ️ Instruções para criar conta:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use um email válido (você receberá confirmação)</li>
                  <li>• Senha deve ter pelo menos 6 caracteres</li>
                  <li>• Confirme sua senha corretamente</li>
                  <li>• Após criar, faça login com suas credenciais</li>
                </ul>
              </div>
            )}

            {/* Remember me and Forgot password - Only for login */}
            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 focus:ring-2 bg-background"
                  />
                  <label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                    Lembrar de mim
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleModeChange('forgot-password')}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  <span>
                    {mode === 'login' && 'Entrando...'}
                    {mode === 'signup' && 'Criando conta...'}
                    {mode === 'forgot-password' && 'Enviando email...'}
                  </span>
                </div>
              ) : (
                <>
                  {mode === 'login' && 'Continuar'}
                  {mode === 'signup' && 'Criar conta'}
                  {mode === 'forgot-password' && 'Enviar email'}
                </>
              )}
            </Button>
          </form>

          {/* Divider - Only for login and signup */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground font-normal">ou</span>
              </div>
            </div>
          )}

          {/* Sign up link - More prominent */}
          <div className="text-center">
            {mode === 'login' && (
              <div className="space-y-4">
                <p className="text-sm font-normal text-muted-foreground">
                  Não tem uma conta?
                </p>
                <button 
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="w-full h-11 font-medium text-primary hover:text-primary/80 transition-colors duration-200 border border-primary/20 rounded-xl hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  Criar nova conta
                </button>
              </div>
            )}
            
            {mode === 'signup' && (
              <p className="text-sm font-normal text-muted-foreground">
                Já tem uma conta?{' '}
                <button 
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Fazer login
                </button>
              </p>
            )}

            {mode === 'forgot-password' && (
              <p className="text-sm font-normal text-muted-foreground">
                Lembrou da senha?{' '}
                <button 
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Fazer login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}