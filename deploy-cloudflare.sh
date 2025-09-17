#!/bin/bash

# Script de Deploy para Cloudflare
# Star Print Talks - Migração para Cloudflare Workers + Pages

echo "🚀 Iniciando deploy para Cloudflare..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se wrangler está instalado
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI não encontrado!${NC}"
    echo -e "${YELLOW}📦 Instalando Wrangler...${NC}"
    npm install -g wrangler
fi

# Verificar se está logado no Cloudflare
echo -e "${BLUE}🔐 Verificando autenticação Cloudflare...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️ Não está logado no Cloudflare. Fazendo login...${NC}"
    wrangler login
fi

# Instalar dependências
echo -e "${BLUE}📦 Instalando dependências...${NC}"
npm install

# Build da aplicação
echo -e "${BLUE}🔨 Fazendo build da aplicação...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build!${NC}"
    exit 1
fi

# Deploy do Worker (API)
echo -e "${BLUE}🚀 Deployando Worker (API)...${NC}"
wrangler deploy src/worker.js --name starprinttalks-api

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no deploy do Worker!${NC}"
    exit 1
fi

# Deploy do Pages (Frontend)
echo -e "${BLUE}🌐 Deployando Pages (Frontend)...${NC}"
wrangler pages deploy dist --project-name starprinttalks

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no deploy do Pages!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${BLUE}📊 URLs:${NC}"
echo -e "   Frontend: https://starprinttalks.pages.dev"
echo -e "   API: https://starprinttalks-api.your-subdomain.workers.dev"
echo -e "${YELLOW}💡 Configure o domínio personalizado no dashboard do Cloudflare${NC}"
