# Star Print Talks

Sistema de atendimento ao cliente moderno e completo, construído com React, TypeScript e Cloudflare.

## 🚀 Tecnologias

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **AI**: Cloudflare AI (Llama 3 8B)
- **Deploy**: Cloudflare Pages + Workers

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/     # Componentes React
│   ├── hooks/         # Custom hooks
│   ├── services/      # API services
│   ├── types/         # TypeScript types
│   └── worker.js      # Cloudflare Worker (API)
├── docs/              # Documentação
├── build/             # Build de produção
└── wrangler.toml      # Configuração Cloudflare
```

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- Wrangler CLI

### Instalação
```bash
npm install
```

### Desenvolvimento Local
```bash
# Frontend
npm run dev

# Worker (API)
npm run worker:dev
```

### Build
```bash
npm run build
```

## 🚀 Deploy

### Deploy Completo
```bash
npm run deploy
```

### Deploy Separado
```bash
# Frontend (Pages)
npm run deploy

# Backend (Worker)
npm run deploy:worker
```

## 📊 Funcionalidades

- ✅ **Dashboard** - Visão geral do sistema
- ✅ **Gestão de Clientes** - CRUD completo
- ✅ **Sistema de Tickets** - Acompanhamento de suporte
- ✅ **Conversas** - Chat em tempo real
- ✅ **Notificações** - Sistema de alertas
- ✅ **IA Assistant** - Suporte automatizado
- ✅ **Relatórios** - Analytics e métricas
- ✅ **Tema Dark/Light** - Interface adaptável

## 🔗 URLs de Produção

- **Frontend**: https://60721443.starprinttalks.pages.dev
- **API**: https://starprinttalks-api.andressagomes-adm.workers.dev

## 📝 Licença

MIT License
