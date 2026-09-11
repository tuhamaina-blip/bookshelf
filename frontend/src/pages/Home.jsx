import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/books/')
      .then((res) => setBooks(res.data))
      .catch(() => setError('Could not load books.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Books</h2>
      {books.length === 0 ? (
        <p>No books yet — add your first one below.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title} — {book.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}