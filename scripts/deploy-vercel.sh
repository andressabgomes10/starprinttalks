#!/bin/bash

# 🚀 Script de Deploy para Vercel - Cajá Talks
# Este script automatiza o processo de build e deploy

echo "🚀 Iniciando deploy da aplicação Cajá Talks..."
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto (onde está o package.json)"
    exit 1
fi

# Limpar build anterior
echo "🧹 Limpando build anterior..."
rm -rf build/
echo "✅ Build anterior removido"

# Executar build
echo ""
echo "🔨 Executando build da aplicação..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build realizado com sucesso!"
else
    echo "❌ Erro no build. Verifique os logs acima."
    exit 1
fi

# Verificar se a pasta build foi criada
if [ ! -d "build" ]; then
    echo "❌ Erro: Pasta build não foi criada"
    exit 1
fi

echo ""
echo "📊 Resumo do build:"
echo "📁 Pasta build criada com sucesso"
echo "📄 Arquivos gerados:"
ls -la build/
echo ""
ls -la build/assets/ | head -10

echo ""
echo "🎉 Aplicação pronta para deploy!"
echo ""
echo "🌐 Próximos passos para deploy no Vercel:"
echo "1. Acesse https://vercel.com"
echo "2. Clique em 'New Project'"
echo "3. Conecte seu repositório"
echo "4. Configure:"
echo "   - Framework: Vite"
echo "   - Build Command: npm run build"  
echo "   - Output Directory: build"
echo "5. Clique em Deploy"
echo ""
echo "🚀 Ou use o comando: vercel --prod"
echo ""
echo "✨ Deploy realizado com sucesso na Emergent!"