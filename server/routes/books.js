const express = require('express');
const router = express.Router();
const db = require('../db');

// Add book (Admin)
router.post('/add', (req, res) => {
  const { title, author } = req.body;

  console.log('Add book:', title, author);
  db.query(
    'INSERT INTO books (title, author) VALUES (?, ?)',
    [title, author],
    err => {
      if (err) {
        console.error('Add book error:', err);
        return res.status(500).send({ message: 'Could not add book' });
      }
      res.send({ message: 'Book added successfully' });
    }
  );
});

// Get books (All)
router.get('/', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) {
      console.error('Get books error:', err);
      return res.status(500).send({ message: 'Could not fetch books' });
    }
    res.send(results);
  });
});

// Rent book (User)
router.post('/rent/:bookId', (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.body;
  const rentedOn = new Date(); // This will get the current PC time

  console.log('Renting Book:', bookId, 'for User:', userId);

  if (!userId) {
    return res.status(400).send({ message: 'userId is required' });
  }

  db.query(
    'UPDATE books SET status = "rented", rented_by = ?, rented_on = ? WHERE id = ? AND status = "available"',
    [userId, rentedOn, bookId],
    (err, result) => {
      if (err) {
        console.error('Rent book DB error:', err);
        return res.status(500).send({ message: 'Internal server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(400).send({ message: 'Book already rented or does not exist' });
      }
      res.send({ message: 'Book rented successfully', rentedOn });
    }
  );
});

// Update book availability (Admin) – Optional, in case you want to allow admins to mark books as available again
router.post('/return/:bookId', (req, res) => {
  const { bookId } = req.params;

  console.log('Returning Book:', bookId);

  db.query(
    'UPDATE books SET status = "available", rented_by = NULL, rented_on = NULL WHERE id = ? AND status = "rented"',
    [bookId],
    (err, result) => {
      if (err) {
        console.error('Return book DB error:', err);
        return res.status(500).send({ message: 'Internal server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(400).send({ message: 'Book already available or does not exist' });
      }
      res.send({ message: 'Book returned successfully' });
    }
  );
});

module.exports = router;
