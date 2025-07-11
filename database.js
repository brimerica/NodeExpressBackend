const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to your database file
// It's good practice to keep it outside the main application folder or in a 'data' folder
const DB_PATH = path.join(__dirname, 'data', 'messages.db');

let db; //database connection

function initializeDatabase() {
    const dataDir = path.join(__dirname, 'data');
    if(!require('fs').existsSync(dataDir)) {
        require('fs').mkdirSync(dataDir);
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
        if(err){
           console.error('Error connecting to database:', err.message);
            // Exit or handle fatal error appropriately
            process.exit(1);
        } else {
            console.log('Connected to the SQLite database.');
            createTables(); // Call function to create tables after successful connection
        }
    });
}

function createTables() {
  // SQL to create the 'random_messages' table if it doesn't exist
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS random_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL UNIQUE
    );
  `;

  db.run(createTableSql, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table "random_messages" created or already exists.');
      seedData(); // Call function to insert initial data
    }
  });
}

function seedData() {
  const messagesToInsert = [
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
    `Lemon law. It's gonna be a thing!`,
    `I'm Aura Farming`,
    `It's gonna be Legen-waitforit-dary`
  ];

  // Prepare a statement for inserting messages
  // Use INSERT OR IGNORE to prevent adding duplicates if the message already exists
  const insertStmt = db.prepare("INSERT OR IGNORE INTO random_messages (message) VALUES (?)");

  messagesToInsert.forEach((msg) => {
    insertStmt.run(msg, (err) => {
      if (err) {
        // Log errors, but don't stop if one insert fails (e.g., duplicate)
        console.error(`Error inserting message "${msg}":`, err.message);
      }
    });
  });

  insertStmt.finalize((err) => {
    if (err) {
      console.error('Error finalizing statement:', err.message);
    } else {
      console.log('Initial messages seeded (or already existed).');
    }
  });
}

// Function to get the database instance
function getDb() {
  if (!db) {
    console.error('Database not initialized. Call initializeDatabase() first.');
    // You might want to throw an error or re-initialize here depending on your app's needs
    process.exit(1);
  }
  return db;
}

// Export the functions
module.exports = {
  initializeDatabase,
  getDb
};