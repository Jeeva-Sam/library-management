import React from 'react';

const BookCard = ({ book, onRent, isAdmin }) => {
  return (
    <div style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
      <p><strong>{book.title}</strong> by {book.author}</p>
      <p>Status: {book.status}</p>
      {isAdmin && book.status === 'rented' && <p>Rented By: {book.rented_by} on {book.rented_on}</p>}
      {onRent && <button onClick={() => onRent(book.id)}>Rent</button>}
    </div>
  );
};

export default BookCard;
