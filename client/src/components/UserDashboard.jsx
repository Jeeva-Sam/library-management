import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null); // State to store logged-in user details

  // Fetch books from the server
  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      // Filter books to show only those that are available for renting
      setBooks(res.data.filter((book) => book.status === 'available'));
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Handle renting a book
  const handleRent = async (bookId) => {
    if (!user) {
      alert('Please log in to rent a book');
      return;
    }

    try {
      // Send the book ID and user ID to the server to rent the book
      await axios.post(`http://localhost:5000/api/books/rent/${bookId}`, {
        userId: user.id, // Pass the logged-in user ID
      });
      // Refresh the book list after renting
      fetchBooks();
    } catch (err) {
      console.error('Error renting book:', err.response?.data || err);
      alert('Failed to rent the book.');
    }
  };

  // Fetch user data (simulating login data here, replace with actual logic)
  const fetchUser = async () => {
    // Example to simulate fetching user from a login session or token
    // Replace with your actual user-fetching logic
    const loggedInUser = {
      id: 1,  // Replace with actual user ID from session
      username: 'testUser', // Replace with actual username
      role: 'user', // Replace with actual role (user/admin)
    };
    setUser(loggedInUser);
  };

  // Fetch books and user data on component mount
  useEffect(() => {
    fetchBooks();
    fetchUser(); // Fetch the logged-in user (replace with actual logic)
  }, []);

  return (
    <div className="user-container">
      <h2>Available Books</h2>
      <div className="book-grid">
        {books.length ? (
          books.map((book) => (
            <div className="book-card" key={book.id}>
              <h4>{book.title}</h4>
              <p>by {book.author}</p>
              <button onClick={() => handleRent(book.id)}>Rent</button>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
