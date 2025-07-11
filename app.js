const express = require('express')
const cors = require('cors')
const path = require('path')
const { initializeDatabase, getDb } = require('./database')

const app = express()
const port = process.env.PORT || 3000

// const messages = [
//   'Hello from the Express API!',
//   'Greetings, Earthling!',
//   'The server says hi!',
//   'Welcome to the random message generator!',
//   'May your API calls be fruitful.',
//   'Express Yourself!',
//   'Here is a message, just for you!',
//   'Have a wonderful day!',
//   'Randomness is our specialty.',
//   'Access granted. Message received.',
//   `I'm Batman\u00AE!`,
//   `Isn't that Special!`,
//   `I pity the foo`,
//   `Lemon law. It's gonna be a thing!`,
//   `I'm Aura Farming`,
//   `It's gonna be Legen-waitforit-dary`
// ];

app.use(cors())
app.use(express.json())

const svelteDistPath = path.join(__dirname, '../SvelteFrontendVite/dist')
app.use(express.static(svelteDistPath))

// Original random message logic, now fetching from SQLite
app.get('/api/message', (req, res) => {
  const db = getDb(); // Get the database instance

  // Fetch a random message from the database
  db.get("SELECT message FROM random_messages ORDER BY RANDOM() LIMIT 1", (err, row) => {
    if (err) {
      console.error('Error fetching random message:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (row) {
      res.json({ message: row.message });
    } else {
      // Fallback if no messages are found
      res.status(404).json({ message: 'No messages found in the database.' });
    }
  });
});

// New endpoint to add a message (example)
app.post('/api/message', (req, res) => {
  const { newMessage } = req.body;
  if (!newMessage) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  const db = getDb();
  db.run("INSERT INTO random_messages (message) VALUES (?)", [newMessage], function(err) {
    if (err) {
      console.error('Error inserting new message:', err.message);
      // Check if it's a unique constraint violation (message already exists)
      if (err.message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
        return res.status(409).json({ error: 'This message already exists.' });
      }
      return res.status(500).json({ error: 'Failed to add message.' });
    }
    // 'this.lastID' will contain the ID of the newly inserted row
    res.status(201).json({ message: 'Message added successfully!', id: this.lastID });
  });
});

initializeDatabase();

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