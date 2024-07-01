const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
const apiKey = 'AIzaSyDGLDo3EIU25mIFPJgg2nP5ysw39rhZwyY';

app.use(cors());
app.use(express.json());

let favorites = [];

app.get('/search', async (req, res) => {
    const query = req.query.q;

    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`);
        res.json(response.data.items);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/favorites', (req, res) => {
    res.json(favorites);
});

app.post('/favorites', (req, res) => {
    favorites = req.body.favorites;
    res.json(favorites);
});

app.listen(port, () => {
    console.log(`BFF listening at http://localhost:${port}`);
});
