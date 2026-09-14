import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authorId, setAuthorId] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [newGenreName, setNewGenreName] = useState('');

  const fetchBooks = () => {
    api.get('/books/')
      .then((res) => setBooks(res.data))
      .catch(() => setError('Could not load books.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
    api.get('/authors/').then((res) => setAuthors(res.data));
    api.get('/genres/').then((res) => setGenres(res.data));
  }, []);

   const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      let finalAuthorId = authorId;

      if (authorId === 'new') {
        const authorRes = await api.post('/authors/', { name: newAuthorName, bio: '' });
        finalAuthorId = authorRes.data.id;
      }

      let genreIds = [...selectedGenres];
      if (newGenreName.trim()) {
        const genreRes = await api.post('/genres/', { name: newGenreName });
        genreIds.push(genreRes.data.id);
      }

      await api.post('/books/', {
        title,
        author: finalAuthorId,
        genres: genreIds,
        status: 'want_to_read',
      });

      setTitle('');
      setAuthorId('');
      setNewAuthorName('');
      setSelectedGenres([]);
      setNewGenreName('');
      fetchBooks();

      const authorsRes = await api.get('/authors/');
      setAuthors(authorsRes.data);
      const genresRes = await api.get('/genres/');
      setGenres(genresRes.data);
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
        <select value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
          <option value="">-- Select an author --</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
          <option value="new">+ Add new author</option>
        </select>

        {authorId === 'new' && (
          <input
            type="text"
            placeholder="New author name"
            value={newAuthorName}
            onChange={(e) => setNewAuthorName(e.target.value)}
          />
        )}

                <div>
          <p>Genres:</p>
          {genres.map((g) => (
            <label key={g.id} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(g.id)}
                onChange={() => {
                  setSelectedGenres((prev) =>
                    prev.includes(g.id) ? prev.filter((id) => id !== g.id) : [...prev, g.id]
                  );
                }}
              />
              {g.name}
            </label>
          ))}
          <input
            type="text"
            placeholder="Add new genre"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
          />
        </div>

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}