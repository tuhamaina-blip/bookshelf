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
  const [statusFilter, setStatusFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [recGenre, setRecGenre] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthorId, setEditAuthorId] = useState('');
  const [editGenres, setEditGenres] = useState([]);
  const [editRating, setEditRating] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [editDateFinished, setEditDateFinished] = useState('');

  const fetchBooks = () => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (genreFilter) params.genre = genreFilter;
    if (searchQuery) params.search = searchQuery;

    api.get('/books/', { params })
      .then((res) => setBooks(res.data))
      .catch(() => setError('Could not load books.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchBooks();
  }, [statusFilter, genreFilter, searchQuery]);

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

  const startEdit = (book) => {
  setEditingBookId(book.id);
  setEditTitle(book.title);
  setEditAuthorId(book.author);
  setEditGenres(book.genres);
  setEditRating(book.rating || '');
  setEditCoverImage(book.cover_image || '');
  setEditDateFinished(book.date_finished || '');
};

const cancelEdit = () => {
  setEditingBookId(null);
};

const saveEdit = async (id) => {
  try {
    await api.patch(`/books/${id}/`, {
      title: editTitle,
      author: editAuthorId,
      genres: editGenres,
      rating: editRating || null,
      cover_image: editCoverImage,
      date_finished: editDateFinished || null,
    });
    setEditingBookId(null);
    fetchBooks();
  } catch (err) {
    setError('Could not update book.');
  }
};

  if (loading) return <p className="text-stone-600 p-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-stone-800 mb-6">My Books</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-700 bg-white"
        >
          <option value="">All statuses</option>
          <option value="want_to_read">Want to Read</option>
          <option value="reading">Currently Reading</option>
          <option value="read">Read</option>
        </select>

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
        <p className="text-stone-500 italic mb-8">No books yet — add your first one below.</p>
            ) : (
        <ul className="space-y-3 mb-10">
                        {books.map((book) =>
              editingBookId === book.id ? (
                <li key={book.id} className="bg-white border border-amber-300 rounded-lg px-4 py-4 shadow-sm space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800"
                    placeholder="Title"
                  />

                  <select
                    value={editAuthorId}
                    onChange={(e) => setEditAuthorId(e.target.value)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 bg-white"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>

                  <div className="flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <label key={g.id} className="flex items-center gap-1.5 text-sm text-stone-700 bg-stone-100 border border-stone-200 rounded-full px-3 py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editGenres.includes(g.id)}
                          onChange={() => {
                            setEditGenres((prev) =>
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
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Rating (1-5)"
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800"
                  />

                  <input
                    type="url"
                    placeholder="Cover image URL"
                    value={editCoverImage}
                    onChange={(e) => setEditCoverImage(e.target.value)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800"
                  />

                  <input
                    type="date"
                    value={editDateFinished}
                    onChange={(e) => setEditDateFinished(e.target.value)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(book.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md px-4 py-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium rounded-md px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              ) : (
                <li
                  key={book.id}
                  className="flex items-center justify-between bg-white border border-stone-200 rounded-lg px-4 py-3 shadow-sm"
                >
                  <span className="font-medium text-stone-800">{book.title}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={book.status}
                      onChange={(e) => handleStatusChange(book.id, e.target.value)}
                      className="text-sm border border-stone-300 rounded-md px-2 py-1 bg-stone-50 text-stone-700"
                    >
                      <option value="want_to_read">Want to Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="read">Read</option>
                    </select>
                    <button
                      onClick={() => startEdit(book)}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            )}
        </ul>
      )}

      {recommendations.length > 0 && (
        <div className="mt-8 mb-10">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">
            Recommended for you
          </h3>
          <p className="text-stone-600 mb-4">
            Based on your reading history, we recommend these books in the genre of{' '}
            <span className="font-medium">{recGenre}</span>.
          </p>
          <ul className="space-y-3">
            {recommendations.map((book) => (
              <li
                key={book.title}
                className="flex items-center gap-4 bg-white border border-stone-200 rounded-lg px-4 py-3 shadow-sm"
              >
                {book.thumbnail && (
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded-md"
                  />
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
        <h3 className="text-lg font-semibold text-stone-800">Add a Book</h3>

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
          Add Book
        </button>
      </form>
    </div>
  );
}