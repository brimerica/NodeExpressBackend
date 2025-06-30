const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

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

const svelteDistPath = path.join(__dirname, '../SvelteFrontendVite/dist')
app.use(express.static(svelteDistPath))

// app.get('/', (req, res) => {
//     res.send('Hello from your simple Express.js app!')
// })

app.get('/api/message', (req, res) => {
  // Get a random index from the messages array
  const randomIndex = Math.floor(Math.random() * messages.length);

  // Get the message at the random index
  const randomMessage = messages[randomIndex];

  // Send the random message as a JSON response
  res.json({ message: randomMessage });
});

// --- Catch-all for Svelte SPA Routing (IMPORTANT) ---
// For any request not matching an API route or static file,
// send back the index.html from the Svelte app.
// This allows client-side routing in Svelte to work.
// app.get('*', (req, res) => {
//     // If the request path already matched a static file (like /index.html, /assets/...),
//     // express.static would have handled it. This `get('*')` only catches paths that
//     // *didn't* match an existing file.
//     res.sendFile(path.join(svelteDistPath, 'index.html'));
// });

app.listen(port, () => {
    console.log(`Express API is running on ${port}`)
    console.log(`Serving Svelte files from: ${svelteDistPath}`)
})