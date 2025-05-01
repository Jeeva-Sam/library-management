// server/routes/auth.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// Register
router.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  console.log('Register:', username, role);
  db.query(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, password, role],
    err => {
      if (err) {
        console.error('Register error:', err);
        return res.status(500).send({ message: 'Registration failed' });
      }
      res.send({ message: 'User registered successfully' });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  console.log('Login attempt:', username, role);
  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?',
    [username, password, role],
    (err, results) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).send({ message: 'Login failed' });
      }
      if (results.length > 0) {
        res.send({ user: results[0] });
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    }
  );
});

module.exports = router;
