import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [bookDetails, setBookDetails] = useState({ title: '', author: '' });

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/books/add', bookDetails);
      setBookDetails({ title: '', author: '' });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-card">
        <h2>Admin Dashboard</h2>

        <form className="add-book-form" onSubmit={handleAddBook}>
          <h3>Add New Book</h3>
          <input
            type="text"
            placeholder="Book Title"
            value={bookDetails.title}
            onChange={(e) => setBookDetails({ ...bookDetails, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={bookDetails.author}
            onChange={(e) => setBookDetails({ ...bookDetails, author: e.target.value })}
            required
          />
          <button type="submit">Add Book</button>
        </form>

        <div className="book-list">
          <h3>All Books</h3>
          {books.length === 0 ? (
            <p>Loading books...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Rented On</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.status === 'rented' ? 'Rented' : 'Available'}</td>
                    <td>
                      {b.status === 'rented' && b.rented_on
                        ? new Date(b.rented_on).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
