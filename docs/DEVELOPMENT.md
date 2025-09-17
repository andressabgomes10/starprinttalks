# Guia de Desenvolvimento

## 🚀 Configuração do Ambiente

### **Pré-requisitos**
- **Node.js 18+**: [Download](https://nodejs.org/)
- **npm 9+**: Incluído com Node.js
- **Git**: [Download](https://git-scm.com/)
- **VS Code**: [Download](https://code.visualstudio.com/) (recomendado)

### **Extensões Recomendadas (VS Code)**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### **Configuração Inicial**
```bash
# Clone o repositório
git clone <repository-url>
cd caja-talks-interface

# Instale as dependências
npm install

# Configure o ambiente (opcional para modo demo)
cp .env.example .env

# Execute em desenvolvimento
npm run dev
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/              # Componentes React
│   ├── layout/             # Layouts e estruturas
│   │   └── PageLayout.tsx  # Layout base para páginas
│   ├── ui/                 # Componentes de UI
│   │   ├── design-system.tsx    # Sistema de design
│   │   ├── skeleton-loader.tsx  # Estados de loading
│   │   ├── card.tsx             # Componente Card
│   │   ├── button.tsx           # Componente Button
│   │   └── ...                  # Outros componentes
│   ├── dashboard.tsx       # Dashboard principal
│   ├── tickets.tsx         # Gestão de tickets
│   ├── reports.tsx         # Relatórios e analytics
│   ├── knowledge-base.tsx  # Base de conhecimento
│   ├── integrations.tsx    # Integrações
│   ├── settings.tsx        # Configurações
│   └── ...
├── contexts/               # Contextos da aplicação
│   └── AppContext.tsx      # Contexto global
├── hooks/                  # Hooks customizados
│   ├── useAppState.ts      # Estado da aplicação
│   └── useAuth.ts          # Autenticação
├── services/               # Serviços e APIs
│   ├── auth.ts             # Serviço de autenticação
│   └── tickets.ts          # Serviço de tickets
├── constants/              # Constantes e configurações
│   └── navigation.ts       # Navegação
├── types/                  # Definições TypeScript
│   └── index.ts            # Tipos globais
└── styles/                 # Estilos globais
    └── globals.css         # CSS global
```

## 🎨 Padrões de Código

### **TypeScript**
```tsx
// Interfaces bem definidas
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'client';
}

// Props tipadas
interface CajaCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

// Componentes funcionais com TypeScript
const CajaCard: React.FC<CajaCardProps> = ({
  title,
  children,
  className = '',
  variant = 'default'
}) => {
  return (
    <div className={`caja-card caja-card--${variant} ${className}`}>
      <h3 className="caja-card__title">{title}</h3>
      <div className="caja-card__content">{children}</div>
    </div>
  );
};
```

### **Nomenclatura**
```tsx
// Componentes: PascalCase
const CajaCard = () => {};

// Props: camelCase
const { isLoading, onToggle } = props;

// Classes CSS: kebab-case
<div className="caja-card caja-card--outline">

// Variáveis: camelCase
const currentUser = getUser();
const isAuthenticated = checkAuth();

// Constantes: UPPER_SNAKE_CASE
const MAX_TICKETS_PER_PAGE = 50;
const API_BASE_URL = 'https://api.example.com';
```

### **Estrutura de Componentes**
```tsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // 4. Hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 6. Handlers
  const handleClick = () => {
    onAction();
  };
  
  // 7. Render
  return (
    <Card>
      <CardContent>
        <h2>{title}</h2>
        <Button onClick={handleClick}>
          Ação
        </Button>
      </CardContent>
    </Card>
  );
};

// 8. Export
export default Component;
```

## 🎨 Styling Guidelines

### **Tailwind CSS**
```tsx
// Use classes utilitárias
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// Responsividade
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Estados
<button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:opacity-50">

// Variantes condicionais
<div className={`card ${variant === 'outline' ? 'border' : 'shadow'}`}>
```

### **CSS Custom Properties**
```css
:root {
  --caja-yellow: #F59E0B;
  --caja-green: #10B981;
  --caja-brown: #92400E;
  --chart-1: #3B82F6;
  --chart-2: #10B981;
  --chart-3: #F59E0B;
  --chart-4: #EF4444;
}
```

### **Componentes Responsivos**
```tsx
// Mobile First
<div className="
  flex flex-col           // Mobile: coluna
  sm:flex-row            // Small: linha
  sm:items-center        // Small: centralizado
  lg:justify-between     // Large: espaçado
  gap-4                  // Gap consistente
">
```

## 🔧 Hooks Customizados

### **useAppState**
```tsx
// Hook para estado global
const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
};
```

### **useAuth**
```tsx
// Hook para autenticação
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const signIn = async (email: string, password: string) => {
    // Lógica de login
  };
  
  const signOut = async () => {
    // Lógica de logout
  };
  
  return { user, loading, signIn, signOut };
};
```

### **useTickets**
```tsx
// Hook para gestão de tickets
const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadTickets = async () => {
    // Lógica de carregamento
  };
  
  const createTicket = async (data: CreateTicketData) => {
    // Lógica de criação
  };
  
  return { tickets, loading, error, loadTickets, createTicket };
};
```

## 📱 Responsividade

### **Breakpoints**
```tsx
// Mobile First Approach
const ResponsiveComponent = () => {
  return (
    <div className="
      grid grid-cols-1        // Mobile: 1 coluna
      sm:grid-cols-2          // Small: 2 colunas
      md:grid-cols-3          // Medium: 3 colunas
      lg:grid-cols-4          // Large: 4 colunas
      gap-4                   // Gap consistente
    ">
      {/* Conteúdo */}
    </div>
  );
};
```

### **Componentes Adaptativos**
```tsx
// Texto responsivo
<h1 className="
  text-xl           // Mobile: texto pequeno
  sm:text-2xl       // Small: texto médio
  lg:text-3xl       // Large: texto grande
  font-bold
">

// Botões responsivos
<Button className="
  w-full            // Mobile: largura total
  sm:w-auto         // Small: largura automática
  px-4 py-2
">
```

### **Layout Responsivo**
```tsx
// Header responsivo
<div className="
  flex flex-col           // Mobile: coluna
  sm:flex-row            // Small: linha
  sm:items-center        // Small: centralizado
  sm:justify-between     // Small: espaçado
  gap-4                  // Gap consistente
">
  <div>
    <h1 className="text-2xl sm:text-3xl">{title}</h1>
    <p className="text-sm sm:text-base">{description}</p>
  </div>
  <div className="
    flex flex-col         // Mobile: coluna
    sm:flex-row          // Small: linha
    gap-3                // Gap menor
  ">
    <Button>Ação 1</Button>
    <Button>Ação 2</Button>
  </div>
</div>
```

## 🧪 Testing

### **Estrutura de Testes**
```
src/
├── __tests__/            # Testes unitários
│   ├── components/       # Testes de componentes
│   ├── hooks/           # Testes de hooks
│   └── services/        # Testes de serviços
├── __mocks__/           # Mocks para testes
└── test-utils.tsx       # Utilitários de teste
```

### **Testes de Componentes**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CajaCard } from '../CajaCard';

describe('CajaCard', () => {
  it('renders title correctly', () => {
    render(<CajaCard title="Test Title">Content</CajaCard>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<CajaCard title="Test" onClick={handleClick}>Content</CajaCard>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### **Testes de Hooks**
```tsx
import { renderHook, act } from '@testing-library/react';
import { useAppState } from '../useAppState';

describe('useAppState', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.currentPage).toBe('dashboard');
  });
});
```

## 🚀 Performance

### **Otimizações**
```tsx
// Memoização de componentes
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
});

// Lazy loading
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

### **Code Splitting**
```tsx
// Lazy loading de rotas
const Dashboard = React.lazy(() => import('./Dashboard'));
const Tickets = React.lazy(() => import('./Tickets'));
const Reports = React.lazy(() => import('./Reports'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/tickets" element={<Tickets />} />
    <Route path="/reports" element={<Reports />} />
  </Routes>
</Suspense>
```

## 🔍 Debugging

### **Ferramentas de Debug**
```tsx
// React Developer Tools
// Chrome DevTools
// VS Code Debugger

// Console logging
console.log('Debug info:', { user, tickets, loading });

// Error boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado.</h1>;
    }
    
    return this.props.children;
  }
}
```

### **Debugging Tips**
```tsx
// Use React DevTools
// Check console for errors
// Use breakpoints in VS Code
// Inspect network requests
// Check component props and state
```

## 📦 Build e Deploy

### **Build Local**
```bash
# Build para produção
npm run build

# Preview do build
npm run preview

# Verificar tipos
npm run type-check

# Linting
npm run lint
```

### **Deploy**
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Docker
docker build -t caja-talks .
docker run -p 3000:3000 caja-talks
```

## 🤝 Contribuição

### **Workflow**
1. **Fork** o repositório
2. **Clone** sua fork
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
5. **Push** para a branch: `git push origin feature/nova-funcionalidade`
6. **Abra** um Pull Request

### **Conventional Commits**
```bash
# Tipos de commit
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção

# Exemplos
git commit -m "feat: adiciona sistema de notificações"
git commit -m "fix: corrige bug no carregamento de tickets"
git commit -m "docs: atualiza documentação da API"
```

### **Code Review**
- **Código limpo**: Fácil de ler e entender
- **Testes**: Cobertura adequada
- **Documentação**: Atualizada quando necessário
- **Performance**: Sem regressões
- **Acessibilidade**: WCAG 2.1 AA

---

**Este guia é atualizado regularmente. Para dúvidas específicas, consulte a documentação dos componentes ou abra uma issue.**
