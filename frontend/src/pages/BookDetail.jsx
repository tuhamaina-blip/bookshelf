import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/books/${id}/`)
      .then((res) => setBook(res.data))
      .catch(() => setError('Could not load this book.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/books/${id}/`);
      navigate('/');
    } catch (err) {
      setError('Could not delete this book.');
    }
  };

  if (loading) return <p className="text-stone-600 p-6">Loading...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;
  if (!book) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/" className="text-sm text-amber-600 hover:underline mb-6 inline-block">
        &larr; Back to My Books
      </Link>

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="flex gap-6 p-6">
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-32 h-48 object-cover rounded-md flex-shrink-0"
            />
          ) : (
            <div className="w-32 h-48 bg-stone-100 rounded-md flex-shrink-0 flex items-center justify-center text-stone-400 text-xs">
              No cover
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">{book.title}</h2>

            <p className="text-sm text-stone-600 mb-1">
              Status: <span className="font-medium text-stone-800">{book.status.replace(/_/g, ' ')}</span>
            </p>

            {book.rating && (
              <p className="text-sm text-stone-600 mb-1">
                Rating: <span className="font-medium text-amber-600">{'★'.repeat(book.rating)}</span>
              </p>
            )}

            {book.date_finished && (
              <p className="text-sm text-stone-600 mb-1">
                Finished: <span className="font-medium text-stone-800">{book.date_finished}</span>
              </p>
            )}

            <p className="text-sm text-stone-600 mb-3">
              Added: <span className="font-medium text-stone-800">{new Date(book.date_added).toLocaleDateString()}</span>
            </p>

            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Delete this book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}