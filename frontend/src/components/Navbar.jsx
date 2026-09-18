import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-amber-600">
        BookShelf
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/shelf" className="text-sm text-stone-600 hover:text-amber-600 font-medium">
              My Shelf
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-stone-600 hover:text-amber-600 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-stone-600 hover:text-amber-600 font-medium">
              Login
            </Link>
            <Link to="/register" className="text-sm text-stone-600 hover:text-amber-600 font-medium">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}