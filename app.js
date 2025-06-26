const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

const messages = [
  'Hello from the Express API!',
  'Greetings, Earthling!',
  'The server says hi!',
  'Welcome to the random message generator!',
  'May your API calls be fruitful.',
  'Express Yourself!',
  'Here is a message, just for you!',
  'Have a wonderful day!',
  'Randomness is our specialty.',
  'Access granted. Message received.',
  `I'm Batman\u00AE!`,
  `Isn't that Special!`,
  `I pity the foo`,
  `Lemon law. It's gonna be a thing!`
];

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello from your simple Express.js app!')
})

app.get('/message', (req, res) => {
  // Get a random index from the messages array
  const randomIndex = Math.floor(Math.random() * messages.length);

  // Get the message at the random index
  const randomMessage = messages[randomIndex];

  // Send the random message as a JSON response
  res.json({ message: randomMessage });
});

app.listen(port, () => {
    console.log(`Express API is running on http://localhost:${port}`)
})