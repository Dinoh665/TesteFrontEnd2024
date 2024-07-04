// Importa a função para ler o conteúdo de um arquivo HTML
const fs = require('fs');
const path = require('path');

// Função para ler conteúdo de um arquivo HTML
function readHtmlFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  return html;
}

// Teste para verificar se os botões VÍDEOS e FAVORITOS estão presentes no HTML
test('Verifica se os botões VÍDEOS e FAVORITOS estão presentes', () => {
  const indexHtmlPath = path.join(__dirname, '../public/index.html');
  const htmlContent = readHtmlFile(indexHtmlPath);

  // Verifica se os botões estão presentes no conteúdo HTML
  expect(htmlContent).toContain('<a href="/videos" id="showAllVideos">VÍDEOS</a>');
  expect(htmlContent).toContain('<a href="/favorites" id="showFavorites">FAVORITOS</a>');
});
