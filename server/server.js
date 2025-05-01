// server/server.js
const express     = require('express');
const cors        = require('cors');
const bodyParser  = require('body-parser');
const authRoutes  = require('./routes/auth');
const bookRoutes  = require('./routes/books');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Not Found' });
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
