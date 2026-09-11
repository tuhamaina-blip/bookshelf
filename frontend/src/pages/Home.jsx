import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');

  const fetchBooks = () => {
    api.get('/books/')
      .then((res) => setBooks(res.data))
      .catch(() => setError('Could not load books.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const authorRes = await api.post('/authors/', { name: authorName, bio: '' });
      await api.post('/books/', {
        title,
        author: authorRes.data.id,
        genres: [],
        status: 'want_to_read',
      });
      setTitle('');
      setAuthorName('');
      fetchBooks();
    } catch (err) {
      setError('Could not add book.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/books/${id}/`);
      fetchBooks();
    } catch (err) {
      setError('Could not delete book.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/books/${id}/`, { status: newStatus });
      fetchBooks();
    } catch (err) {
      setError('Could not update book.');
    }
  };


  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Books</h2>
      {error && <p>{error}</p>}
      {books.length === 0 ? (
        <p>No books yet — add your first one below.</p>
      ) : (
         <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title} —{' '}
              <select
                value={book.status}
                onChange={(e) => handleStatusChange(book.id, e.target.value)}
              >
                <option value="want_to_read">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="read">Read</option>
              </select>{' '}
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddBook}>
        <h3>Add a Book</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}