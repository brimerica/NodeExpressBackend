const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello from your simple Express.js app!')
})

app.get('/api/message', (req, res) => {
    res.json({message: 'Hello from the express API!'})
})

app.listen(port, () => {
    console.log(`Express API is running on http://localhost:${port}`)
})