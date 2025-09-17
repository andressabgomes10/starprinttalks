# Documentação dos Componentes

## 📚 Visão Geral

Este documento descreve todos os componentes do sistema Cajá Talks, suas funcionalidades, props e exemplos de uso.

## 🏗️ Estrutura de Componentes

### **Layout Components**

#### `PageLayout`
Layout base para todas as páginas do sistema.

**Props:**
```typescript
interface PageLayoutProps {
  title: string;                    // Título da página
  description?: string;             // Descrição opcional
  breadcrumbs?: Array<{             // Breadcrumbs de navegação
    label: string;
    href?: string;
  }>;
  primaryAction?: ActionConfig;     // Ação principal (botão destacado)
  secondaryActions?: ActionConfig[]; // Ações secundárias
  searchPlaceholder?: string;       // Placeholder da busca
  searchValue?: string;             // Valor da busca
  onSearchChange?: (value: string) => void; // Callback da busca
  filters?: FilterConfig[];         // Filtros disponíveis
  filterValues?: Record<string, string>; // Valores dos filtros
  onFilterChange?: (key: string, value: string) => void; // Callback dos filtros
  stats?: Array<{                   // Estatísticas no header
    label: string;
    value: string | number;
    variant?: 'default' | 'yellow' | 'green' | 'brown';
  }>;
  children?: React.ReactNode;       // Conteúdo da página
}
```

**Exemplo de Uso:**
```tsx
<PageLayout
  title="Gestão de Tickets"
  description="Gerencie e acompanhe todos os tickets de suporte"
  breadcrumbs={[
    { label: 'Dashboard' },
    { label: 'Tickets' }
  ]}
  primaryAction={{
    label: 'Novo Ticket',
    icon: Plus,
    onClick: () => setShowCreateModal(true)
  }}
  searchPlaceholder="Buscar tickets..."
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  filters={[
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'open', label: 'Abertos' },
        { value: 'closed', label: 'Fechados' }
      ]
    }
  ]}
>
  {/* Conteúdo da página */}
</PageLayout>
```

### **UI Components**

#### `CajaCard`
Card base com variações de estilo.

**Props:**
```typescript
interface CajaCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}
```

#### `CajaStatsCard`
Card especializado para exibir estatísticas.

**Props:**
```typescript
interface CajaStatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  animated?: boolean;
}
```

**Exemplo:**
```tsx
<CajaStatsCard
  title="Conversas Ativas"
  value="247"
  change="+12%"
  changeType="positive"
  icon={MessageSquare}
  color="bg-[var(--caja-yellow)]"
  trend="up"
  description="vs. mês anterior"
  animated
/>
```

#### `CajaButton`
Botão com variantes personalizadas.

**Props:**
```typescript
interface CajaButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'yellow' | 'green' | 'brown' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<any>;
  onClick?: () => void;
  className?: string;
}
```

### **Skeleton Components**

#### `TicketSkeletonCard`
Skeleton para cards de ticket.

```tsx
<TicketSkeletonCard />
```

#### `TicketSkeletonList`
Skeleton para lista de tickets.

```tsx
<TicketSkeletonList count={5} />
```

#### `StatsSkeletonCard`
Skeleton para cards de estatísticas.

```tsx
<StatsSkeletonCard />
```

### **Dashboard Components**

#### `KPIDashboard`
Dashboard de indicadores de performance.

**Props:**
```typescript
interface KPIDashboardProps {
  data: KPIData[];
  period?: 'day' | 'week' | 'month';
  className?: string;
}
```

**Exemplo:**
```tsx
<KPIDashboard 
  data={mockKPIData} 
  period="week" 
/>
```

## 🎨 Sistema de Design

### **Cores**

#### **Primárias**
- **Amarelo**: `#F59E0B` - Ações principais, destaque
- **Verde**: `#10B981` - Sucesso, confirmação
- **Marrom**: `#92400E` - Neutro, informações

#### **Neutras**
- **Cinza Escuro**: `#1F2937` - Texto principal
- **Cinza Médio**: `#6B7280` - Texto secundário
- **Cinza Claro**: `#F3F4F6` - Backgrounds
- **Branco**: `#FFFFFF` - Backgrounds principais

#### **Estados**
- **Sucesso**: `#10B981` - Verde
- **Erro**: `#EF4444` - Vermelho
- **Aviso**: `#F59E0B` - Amarelo
- **Info**: `#3B82F6` - Azul

### **Tipografia**

#### **Hierarquia**
- **H1**: `text-3xl font-bold` - Títulos principais
- **H2**: `text-2xl font-semibold` - Títulos de seção
- **H3**: `text-xl font-medium` - Subtítulos
- **Body**: `text-base` - Texto padrão
- **Small**: `text-sm` - Texto pequeno
- **Caption**: `text-xs` - Legendas

#### **Pesos**
- **Bold**: `font-bold` - Títulos e destaques
- **Semibold**: `font-semibold` - Subtítulos
- **Medium**: `font-medium` - Texto importante
- **Normal**: `font-normal` - Texto padrão

### **Espaçamento**

#### **Padding**
- **xs**: `p-1` - 4px
- **sm**: `p-2` - 8px
- **md**: `p-4` - 16px
- **lg**: `p-6` - 24px
- **xl**: `p-8` - 32px

#### **Margin**
- **xs**: `m-1` - 4px
- **sm**: `m-2` - 8px
- **md**: `m-4` - 16px
- **lg**: `m-6` - 24px
- **xl**: `m-8` - 32px

#### **Gap**
- **xs**: `gap-1` - 4px
- **sm**: `gap-2` - 8px
- **md**: `gap-4` - 16px
- **lg**: `gap-6` - 24px
- **xl**: `gap-8` - 32px

### **Breakpoints**

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

## 📱 Responsividade

### **Grid System**

#### **Desktop (lg+)**
```tsx
<div className="grid grid-cols-4 gap-6">
  {/* 4 colunas */}
</div>
```

#### **Tablet (md)**
```tsx
<div className="grid grid-cols-2 gap-4">
  {/* 2 colunas */}
</div>
```

#### **Mobile (sm)**
```tsx
<div className="grid grid-cols-1 gap-4">
  {/* 1 coluna */}
</div>
```

### **Flexbox**

#### **Header Responsivo**
```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  {/* Conteúdo */}
</div>
```

#### **Botões Responsivos**
```tsx
<div className="flex flex-col sm:flex-row gap-3">
  <Button className="w-full sm:w-auto">Ação 1</Button>
  <Button className="w-full sm:w-auto">Ação 2</Button>
</div>
```

## 🔧 Hooks Customizados

### `useAppState`
Hook para gerenciar estado global da aplicação.

```tsx
const { currentPage, setCurrentPage, isAuthenticated, user } = useAppState();
```

### `useAuth`
Hook para gerenciar autenticação.

```tsx
const { user, signIn, signOut, loading } = useAuth();
```

## 📊 Exemplos de Uso

### **Dashboard Completo**
```tsx
function Dashboard() {
  return (
    <PageLayout
      title="Dashboard"
      description="Visão geral do sistema"
      stats={[
        { label: 'Tickets', value: '32' },
        { label: 'Clientes', value: '1,235' }
      ]}
    >
      <div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <CajaStatsCard
          title="Conversas Ativas"
          value="247"
          change="+12%"
          changeType="positive"
          icon={MessageSquare}
          color="bg-[var(--caja-yellow)]"
        />
        {/* Mais cards... */}
      </div>
    </PageLayout>
  );
}
```

### **Lista com Filtros**
```tsx
function TicketsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <PageLayout
      title="Tickets"
      searchPlaceholder="Buscar tickets..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      filters={[
        {
          key: 'status',
          label: 'Status',
          options: [
            { value: 'all', label: 'Todos' },
            { value: 'open', label: 'Abertos' }
          ]
        }
      ]}
      filterValues={{ status: statusFilter }}
      onFilterChange={(key, value) => {
        if (key === 'status') setStatusFilter(value);
      }}
    >
      {/* Lista de tickets */}
    </PageLayout>
  );
}
```

## 🎯 Boas Práticas

### **Nomenclatura**
- **Componentes**: PascalCase (`CajaCard`)
- **Props**: camelCase (`isLoading`)
- **Classes CSS**: kebab-case (`bg-yellow-500`)

### **Estrutura de Arquivos**
```
components/
├── ui/                 # Componentes base
├── layout/            # Layouts
├── dashboard/         # Componentes específicos
└── forms/            # Formulários
```

### **Props Interface**
```tsx
interface ComponentProps {
  // Props obrigatórias primeiro
  title: string;
  value: number;
  
  // Props opcionais depois
  className?: string;
  onClick?: () => void;
  
  // Props com valores padrão por último
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}
```

### **Responsividade**
- **Mobile First**: Sempre comece com mobile
- **Breakpoints**: Use breakpoints consistentes
- **Teste**: Teste em diferentes tamanhos de tela
- **Performance**: Otimize para mobile

### **Acessibilidade**
- **Semântica**: Use elementos HTML apropriados
- **ARIA**: Adicione labels e descriptions
- **Contraste**: Mantenha contraste adequado
- **Navegação**: Suporte a navegação por teclado

---

**Esta documentação é atualizada regularmente. Para dúvidas, consulte os exemplos no código ou abra uma issue.**
