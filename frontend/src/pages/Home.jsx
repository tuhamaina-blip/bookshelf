import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authorId, setAuthorId] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [newGenreName, setNewGenreName] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [recGenre, setRecGenre] = useState(null); 

  const fetchBooks = () => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (genreFilter) params.genre = genreFilter;

    api.get('/books/', { params })
      .then((res) => setBooks(res.data))
      .catch(() => setError('Could not load books.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, genreFilter]);

  useEffect(() => {
    api.get('/authors/').then((res) => setAuthors(res.data));
    api.get('/genres/').then((res) => setGenres(res.data));
    api.get('/recommendations/').then((res) => {
      setRecGenre(res.data.genre);
      setRecommendations(res.data.books);
    });
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

  const addToShelf = async (bookId) => {
    try {
      await api.post('/shelf/', { book: bookId, status: 'want_to_read' });
    } catch (err) {
      setError('Could not add to your shelf — it may already be there.');
    }
  };

  if (loading) return <p className="text-stone-600 p-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-stone-800 mb-6">Book Catalog</h2>

            <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-700 bg-white"
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-2 mb-4 text-sm">
          {error}
        </p>
      )}

      {books.length === 0 ? (
        <p className="text-stone-500 italic mb-8">No books in the catalog yet — add one below.</p>
      ) : (
        <ul className="space-y-3 mb-10">
          {books.map((book) => (
            <li
              key={book.id}
              className="flex items-center justify-between bg-white border border-stone-200 rounded-lg px-4 py-3 shadow-sm"
            >
              <div>
                <Link to={`/books/${book.id}`} className="font-medium text-stone-800 hover:text-amber-600">
                  {book.title}
                </Link>
                <p className="text-xs text-stone-500">
                  {book.average_rating ? `★ ${book.average_rating} (${book.review_count} reviews)` : 'No reviews yet'}
                </p>
              </div>
              <button
                onClick={() => addToShelf(book.id)}
                className="text-sm bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md px-3 py-1.5"
              >
                Add to Shelf
              </button>
            </li>
          ))}
        </ul>
      )}
      {recommendations.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">
            Recommended for you — {recGenre}
          </h3>
          <ul className="space-y-3">
            {recommendations.map((book) => (
              <li
                key={book.title}
                className="flex items-center gap-4 bg-white border border-stone-200 rounded-lg px-4 py-3 shadow-sm"
              >
                {book.thumbnail && (
                  <img src={book.thumbnail} alt={book.title} className="w-16 h-24 object-cover rounded-md" />
                )}
                <div>
                  <h4 className="font-semibold text-stone-800">{book.title}</h4>
                  <p className="text-sm text-stone-600">{book.authors}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleAddBook}
        className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-4"
      >
        <h3 className="text-lg font-semibold text-stone-800">Add a Book to the Catalog</h3>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 bg-white"
        >
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
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        )}

        <div>
          <p className="text-sm font-medium text-stone-600 mb-2">Genres</p>
          <div className="flex flex-wrap gap-3 mb-3">
            {genres.map((g) => (
              <label
                key={g.id}
                className="flex items-center gap-1.5 text-sm text-stone-700 bg-stone-100 border border-stone-200 rounded-full px-3 py-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(g.id)}
                  onChange={() => {
                    setSelectedGenres((prev) =>
                      prev.includes(g.id) ? prev.filter((id) => id !== g.id) : [...prev, g.id]
                    );
                  }}
                  className="accent-amber-500"
                />
                {g.name}
              </label>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add new genre"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md px-4 py-2 transition-colors"
        >
          Add to Catalog
        </button>
      </form>
    </div>
  );
}