import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${username}/`)
      .then((res) => setProfile(res.data))
      .catch(() => setError('Could not load this profile.'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <p className="text-stone-600 p-6">Loading...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-stone-800 mb-1">{profile.username}</h2>
      <p className="text-sm text-stone-500 mb-8">
        {profile.shelf.length} book{profile.shelf.length !== 1 ? 's' : ''} on shelf · {profile.reviews.length} review{profile.reviews.length !== 1 ? 's' : ''}
      </p>

      <h3 className="text-lg font-semibold text-stone-800 mb-3">Shelf</h3>
      {profile.shelf.length === 0 ? (
        <p className="text-stone-500 italic mb-8">No books on their shelf yet.</p>
      ) : (
        <ul className="space-y-2 mb-8">
          {profile.shelf.map((item) => (
            <li key={item.id} className="bg-white border border-stone-200 rounded-lg px-4 py-2 shadow-sm flex items-center justify-between">
              <Link to={`/books/${item.book}`} className="text-stone-800 hover:text-amber-600 font-medium">
                {item.book_detail?.title}
              </Link>
              <span className="text-xs text-stone-500">{item.status.replace(/_/g, ' ')}</span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-lg font-semibold text-stone-800 mb-3">Reviews</h3>
      {profile.reviews.length === 0 ? (
        <p className="text-stone-500 italic">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {profile.reviews.map((r) => (
            <li key={r.id} className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <Link to={`/books/${r.book}`} className="font-medium text-stone-800 hover:text-amber-600">
                  {r.book_title}
                </Link>
                <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
              </div>
              {r.text && <p className="text-sm text-stone-600">{r.text}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}