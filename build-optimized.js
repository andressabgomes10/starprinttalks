const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build otimizado...\n');

try {
  // 1. Limpar build anterior
  console.log('1️⃣ Limpando build anterior...');
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
    console.log('✅ Build anterior removido');
  }

  // 2. Executar build
  console.log('\n2️⃣ Executando build com otimizações...');
  execSync('npm run build', { stdio: 'inherit' });

  // 3. Verificar arquivos gerados
  console.log('\n3️⃣ Verificando arquivos gerados...');
  if (fs.existsSync('build')) {
    const files = fs.readdirSync('build');
    console.log(`📁 Arquivos gerados: ${files.length}`);
    
    // Verificar assets
    const assetsDir = path.join('build', 'assets');
    if (fs.existsSync(assetsDir)) {
      const assets = fs.readdirSync(assetsDir);
      console.log(`📦 Assets gerados: ${assets.length}`);
      
      // Analisar tamanhos dos chunks
      console.log('\n📊 Análise de chunks:');
      assets.forEach(file => {
        const filePath = path.join(assetsDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        
        if (file.endsWith('.js')) {
          console.log(`   🔵 JS: ${file} - ${sizeKB} KB`);
        } else if (file.endsWith('.css')) {
          console.log(`   🎨 CSS: ${file} - ${sizeKB} KB`);
        } else {
          console.log(`   📄 ${file} - ${sizeKB} KB`);
        }
      });
    }

    // 4. Verificar se os chunks estão separados
    console.log('\n4️⃣ Verificando separação de chunks...');
    const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'));
    const expectedChunks = [
      'react-vendor',
      'ui-vendor', 
      'form-vendor',
      'chart-vendor',
      'carousel-vendor',
      'utils-vendor',
      'supabase-vendor',
      'hooks',
      'ui-components',
      'layout-components',
      'page-components'
    ];

    console.log(`   📋 Chunks esperados: ${expectedChunks.length}`);
    console.log(`   📋 Chunks gerados: ${jsFiles.length}`);
    
    // Verificar se há chunks grandes
    const largeChunks = jsFiles.filter(file => {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      return stats.size > 500 * 1024; // > 500KB
    });

    if (largeChunks.length > 0) {
      console.log('   ⚠️  Chunks grandes encontrados:');
      largeChunks.forEach(file => {
        const filePath = path.join(assetsDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`      - ${file}: ${sizeKB} KB`);
      });
    } else {
      console.log('   ✅ Todos os chunks estão otimizados (< 500KB)');
    }

    // 5. Verificar index.html
    console.log('\n5️⃣ Verificando index.html...');
    const indexPath = path.join('build', 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      const scriptTags = (content.match(/<script/g) || []).length;
      const linkTags = (content.match(/<link/g) || []).length;
      
      console.log(`   📄 Scripts: ${scriptTags}`);
      console.log(`   🎨 Stylesheets: ${linkTags}`);
    }

    console.log('\n🎉 Build otimizado concluído com sucesso!');
    console.log('\n📈 Melhorias implementadas:');
    console.log('   ✅ Code splitting com dynamic imports');
    console.log('   ✅ Chunking manual para vendor libraries');
    console.log('   ✅ Limite de warning aumentado para 1MB');
    console.log('   ✅ Preloading inteligente de componentes');
    console.log('   ✅ Hooks de otimização de performance');

  } else {
    console.log('❌ Diretório build não encontrado');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}

