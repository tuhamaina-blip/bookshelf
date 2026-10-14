import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-stone-900 text-stone-300 mt-16">
      <div className="max-w-5xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold text-amber-500 mb-2">BookShelf</h3>
          <p className="text-sm text-stone-400 max-w-xs">
            Discover new books, track your reading, and share honest reviews with a community of readers.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            {user ? (
              <>
                <li><Link to="/catalog" className="hover:text-amber-400">Catalog</Link></li>
                <li><Link to="/shelf" className="hover:text-amber-400">My Shelf</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-amber-400">Log In</Link></li>
                <li><Link to="/register" className="hover:text-amber-400">Register</Link></li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">Follow Us</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">Twitter</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} BookShelf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}