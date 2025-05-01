const express     = require('express');
const cors        = require('cors');
const bodyParser  = require('body-parser');
const authRoutes  = require('./routes/auth');
const bookRoutes  = require('./routes/books');
const db          = require('./db'); // 👈 make sure this is imported

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Handle 404s
app.use((req, res) => {
  res.status(404).send({ message: 'Not Found' });
});

// ✅ Preload books if table is empty
const preloadBooks = () => {
  db.query('SELECT COUNT(*) AS count FROM books', (err, results) => {
    if (err) {
      return console.error('Error checking books table:', err);
    }

    if (results[0].count === 0) {
      const books = [
        ['The Great Gatsby', 'F. Scott Fitzgerald'],
        ['To Kill a Mockingbird', 'Harper Lee'],
        ['1984', 'George Orwell'],
        ['Pride and Prejudice', 'Jane Austen'],
        ['The Catcher in the Rye', 'J.D. Salinger']
      ];

      db.query(
        'INSERT INTO books (title, author) VALUES ?',
        [books],
        (err, result) => {
          if (err) {
            return console.error('Error preloading books:', err);
          }
          console.log('📚 Default books preloaded.');
        }
      );
    } else {
      console.log('📚 Books already exist in the database.');
    }
  });
};

preloadBooks(); // 👈 THIS LINE should be just before app.listen()

// Start server
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
