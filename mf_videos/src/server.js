const express = require('express');
const path = require('path');
const app = express();
const port = 3002;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rota wildcard para enviar o arquivo index.html para qualquer rota
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`mf_videos listening at http://localhost:${port}`);
});
