import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});

  const fetchBook = () => {
    api.get(`/books/${id}/`).then((res) => setBook(res.data));
  };

  const fetchReviews = () => {
    api.get('/reviews/', { params: { book: id } }).then((res) => setReviews(res.data));
  };

  const fetchComments = async (reviewId) => {
    const res = await api.get('/comments/', { params: { review: reviewId } });
    setComments((prev) => ({ ...prev, [reviewId]: res.data }));
  };

  useEffect(() => {
    Promise.all([
      api.get(`/books/${id}/`),
      api.get('/reviews/', { params: { book: id } }),
    ])
      .then(([bookRes, reviewsRes]) => {
        setBook(bookRes.data);
        setReviews(reviewsRes.data);
      })
      .catch(() => setError('Could not load this book.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    reviews.forEach((r) => fetchComments(r.id));
  }, [reviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews/', { book: id, rating: Number(rating), text: reviewText });
      setRating('');
      setReviewText('');
      fetchBook();
      fetchReviews();
    } catch (err) {
      setError('Could not submit review — you may have already reviewed this book.');
    }
  };

  const handleAddComment = async (reviewId) => {
    const text = commentText[reviewId];
    if (!text || !text.trim()) return;
    try {
      await api.post('/comments/', { review: reviewId, text });
      setCommentText((prev) => ({ ...prev, [reviewId]: '' }));
      fetchComments(reviewId);
    } catch (err) {
      setError('Could not post comment.');
    }
  };

  if (loading) return <p className="text-stone-600 p-6">Loading...</p>;
  if (!book) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/" className="text-sm text-amber-600 hover:underline mb-6 inline-block">
        &larr; Back to Catalog
      </Link>

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-2 mb-4 text-sm">
          {error}
        </p>
      )}

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden mb-8">
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
            <p className="text-sm text-stone-600">
              {book.average_rating
                ? `★ ${book.average_rating} average (${book.review_count} reviews)`
                : 'No reviews yet'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Leave a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-3">
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 bg-white"
          >
            <option value="">-- Rating --</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
            ))}
          </select>

          <textarea
            placeholder="Share your thoughts..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md px-4 py-2"
          >
            Submit Review
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-stone-500 italic">No reviews yet — be the first!</p>
        ) : (
         <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
               <Link to={`/users/${r.username}`} className="font-medium text-stone-800 hover:text-amber-600">
                  {r.username}
                </Link>
                <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
              </div>
              {r.text && <p className="text-sm text-stone-600 mb-3">{r.text}</p>}

              {comments[r.id] && comments[r.id].length > 0 && (
                <ul className="space-y-2 mb-3 pl-4 border-l-2 border-stone-100">
                  {comments[r.id].map((c) => (
                    <li key={c.id} className="text-sm">
                      <span className="font-medium text-stone-700">{c.username}:</span>{' '}
                      <span className="text-stone-600">{c.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Reply to this review..."
                  value={commentText[r.id] || ''}
                  onChange={(e) => setCommentText((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  className="flex-1 border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  onClick={() => handleAddComment(r.id)}
                  className="text-sm bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium rounded-md px-3 py-1.5"
                >
                  Reply
                </button>
              </div>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}