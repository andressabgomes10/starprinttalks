# Testes - Cajá Talks

Este diretório contém todos os testes para o projeto Cajá Talks.

## 📁 Estrutura de Testes

```
src/__tests__/
├── integration/           # Testes de integração
│   └── app-flow.test.tsx  # Fluxos principais da aplicação
├── components/            # Testes de componentes
│   ├── dashboard.test.tsx
│   └── login.test.tsx
├── hooks/                 # Testes de hooks
│   ├── useAuth.test.ts
│   └── useAppState.test.ts
├── services/              # Testes de serviços
│   └── auth.test.ts
├── utils/                 # Testes de utilitários
│   └── storage.test.ts
└── README.md              # Este arquivo
```

## 🧪 Tipos de Testes

### **Testes de Componentes**
- Testam a renderização e comportamento de componentes React
- Verificam interações do usuário
- Validam props e estados

### **Testes de Hooks**
- Testam hooks customizados
- Verificam mudanças de estado
- Validam efeitos colaterais

### **Testes de Serviços**
- Testam funções de API e serviços
- Verificam tratamento de erros
- Validam transformações de dados

### **Testes de Utilitários**
- Testam funções auxiliares
- Verificam lógica de negócio
- Validam edge cases

### **Testes de Integração**
- Testam fluxos completos da aplicação
- Verificam interações entre componentes
- Validam navegação e estado global

## 🚀 Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes para CI/CD
npm run test:ci
```

## 📊 Cobertura de Código

O projeto está configurado para manter uma cobertura mínima de:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🛠️ Configuração

### **Jest**
- Configurado para TypeScript
- Ambiente jsdom para testes de componentes
- Mocks automáticos para módulos

### **React Testing Library**
- Foco em testes que simulam comportamento do usuário
- Queries acessíveis e semânticas
- Utilitários para interações

### **Mocks**
- Supabase mockado para testes
- Componentes filhos mockados quando necessário
- LocalStorage e APIs simuladas

## 📝 Convenções

### **Nomenclatura**
- Arquivos de teste: `*.test.tsx` ou `*.test.ts`
- Describes: Descrevem o componente/função sendo testado
- Its: Descrevem comportamentos específicos

### **Estrutura de Teste**
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### **Mocks**
- Use mocks para dependências externas
- Mantenha mocks simples e focados
- Documente mocks complexos

## 🔧 Utilitários de Teste

### **test-utils.tsx**
- Wrapper customizado para React Testing Library
- Mocks de contexto e providers
- Helpers para criar dados de teste

### **setupTests.ts**
- Configuração global do Jest
- Mocks de APIs do navegador
- Configuração de ambiente de teste

## 📈 Relatórios

### **Cobertura**
- Relatório HTML em `coverage/index.html`
- Relatório LCOV para integração contínua
- Relatório JSON para análise programática

### **Logs**
- Verbose mode ativado por padrão
- Logs claros de falhas e sucessos
- Stack traces detalhados

## 🐛 Debugging

### **Testes Falhando**
1. Verifique se os mocks estão corretos
2. Confirme se os dados de teste são válidos
3. Verifique se as queries estão corretas

### **Cobertura Baixa**
1. Identifique arquivos com baixa cobertura
2. Adicione testes para branches não cobertos
3. Teste edge cases e cenários de erro

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contribuindo

1. Mantenha a cobertura de código acima de 70%
2. Escreva testes descritivos e claros
3. Atualize este README quando necessário
4. Siga as convenções estabelecidas
