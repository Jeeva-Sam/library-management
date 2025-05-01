require('dotenv').config();
const mysql = require('mysql2');

// Use environment variables or fallback to local development settings
const connection = mysql.createConnection({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASS     || 'your_mysql_password', // ← replace if not using .env
  database: process.env.DB_NAME     || 'librarydb'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  }
  console.log('✅ MySQL Connected');

  // Ensure the books table exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      status ENUM('available', 'rented') DEFAULT 'available',
      rented_on DATETIME DEFAULT NULL,
      rented_by INT DEFAULT NULL
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('❌ Error creating books table:', err);
    } else {
      console.log('📚 Books table ensured');

      // Insert default books if table is empty
      const insertDefaults = `
        INSERT INTO books (title, author, status)
        SELECT * FROM (
          SELECT '1984' AS title, 'George Orwell' AS author, 'available' AS status
        ) AS tmp
        WHERE NOT EXISTS (SELECT * FROM books)
        LIMIT 1;
      `;

      connection.query(insertDefaults, (err) => {
        if (err) {
          console.error('❌ Error inserting default book(s):', err);
        } else {
          console.log('✅ Default book(s) ensured in database');
        }
      });
    }
  });
});

module.exports = connection;
