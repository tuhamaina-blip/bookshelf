import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Shelf() {
  const [shelfItems, setShelfItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchShelf = () => {
    api.get('/shelf/')
      .then((res) => setShelfItems(res.data))
      .catch(() => setError('Could not load your shelf.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchShelf();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/shelf/${id}/`, { status: newStatus });
      fetchShelf();
    } catch (err) {
      setError('Could not update status.');
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/shelf/${id}/`);
      fetchShelf();
    } catch (err) {
      setError('Could not remove from shelf.');
    }
  };

  if (loading) return <p className="text-stone-600 p-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-stone-800 mb-6">My Shelf</h2>

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-2 mb-4 text-sm">
          {error}
        </p>
      )}

      {shelfItems.length === 0 ? (
        <p className="text-stone-500 italic">
          Your shelf is empty — browse the{' '}
          <Link to="/" className="text-amber-600 hover:underline">catalog</Link> to add books.
        </p>
      ) : (
        <ul className="space-y-3">
          {shelfItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between bg-white border border-stone-200 rounded-lg px-4 py-3 shadow-sm"
            >
              <Link to={`/books/${item.book}`} className="font-medium text-stone-800 hover:text-amber-600">
                {item.book_detail?.title}
              </Link>
              <div className="flex items-center gap-2">
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  className="text-sm border border-stone-300 rounded-md px-2 py-1 bg-stone-50 text-stone-700"
                >
                  <option value="want_to_read">Want to Read</option>
                  <option value="reading">Currently Reading</option>
                  <option value="read">Read</option>
                </select>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}