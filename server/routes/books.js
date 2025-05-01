const express = require('express');
const router = express.Router();
const db = require('../db');

// 🟢 Get all books (Admin & User)
router.get('/', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) {
      console.error('Get books error:', err);
      return res.status(500).send({ message: 'Could not fetch books' });
    }
    res.send(results);
  });
});

// ➕ Add a book (Admin)
router.post('/add', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).send({ message: 'Title and Author are required' });
  }

  const sql = 'INSERT INTO books (title, author, status) VALUES (?, ?, "available")';
  db.query(sql, [title, author], (err) => {
    if (err) {
      console.error('Add book error:', err);
      return res.status(500).send({ message: 'Could not add book' });
    }
    res.send({ message: 'Book added successfully' });
  });
});

// 🔄 Rent a book (User)
router.post('/rent/:id', (req, res) => {
  const bookId = req.params.id;
  const { userId } = req.body;
  const rentedOn = new Date();

  if (!userId) {
    return res.status(400).send({ message: 'userId is required' });
  }

  const sql = `
    UPDATE books
    SET status = 'rented', rented_by = ?, rented_on = ?
    WHERE id = ? AND status = 'available'
  `;
  db.query(sql, [userId, rentedOn, bookId], (err, result) => {
    if (err) {
      console.error('Rent book error:', err);
      return res.status(500).send({ message: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(400).send({ message: 'Book already rented or not found' });
    }
    res.send({ message: 'Book rented successfully', rentedOn });
  });
});

// 🔁 Return a book (Admin or User)
router.post('/return/:id', (req, res) => {
  const bookId = req.params.id;

  const sql = `
    UPDATE books
    SET status = 'available', rented_by = NULL, rented_on = NULL
    WHERE id = ? AND status = 'rented'
  `;
  db.query(sql, [bookId], (err, result) => {
    if (err) {
      console.error('Return book error:', err);
      return res.status(500).send({ message: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(400).send({ message: 'Book already available or not found' });
    }
    res.send({ message: 'Book returned successfully' });
  });
});

// 🧪 Preload demo books (for testing only)
router.post('/preload', (req, res) => {
  const books = [
    ['The Great Gatsby', 'F. Scott Fitzgerald'],
    ['To Kill a Mockingbird', 'Harper Lee'],
    ['1984', 'George Orwell'],
    ['Pride and Prejudice', 'Jane Austen'],
    ['The Catcher in the Rye', 'J.D. Salinger']
  ];

  const sql = 'INSERT INTO books (title, author) VALUES ?';
  db.query(sql, [books], (err) => {
    if (err) {
      console.error('Error inserting demo books:', err);
      return res.status(500).send({ message: 'Insert failed' });
    }
    res.send({ message: 'Preloaded books inserted successfully' });
  });
});

module.exports = router;
