const { JSDOM } = require('jsdom');
const fetchMock = require('jest-fetch-mock').default;
const { searchVideos } = require('../public/index');

// Configuração básica do jsdom
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

// Mock da função fetch para simular a resposta da API do YouTube
fetchMock.enableMocks();
fetchMock.mockResponse(JSON.stringify([{ id: { videoId: 'videoId1' }, snippet: { title: 'Video Title 1' } }]));

describe('searchVideos', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('Deve buscar vídeos corretamente', async () => {
    await searchVideos('dogs');

    // Verifica se a função fetch foi chamada com os parâmetros corretos
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/search?q=dogs');
  });
});