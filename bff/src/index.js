const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000
const apiKey = 'AIzaSyDGLDo3EIU25mIFPJgg2nP5ysw39rhZwyY'

app.get('/search', async (req, res) => {
    const query = req.query.q

    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`)
        res.json(response.data)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.listen(port, () => {
    console.log(`BFF listening at http://localhost:${port}`)
})
