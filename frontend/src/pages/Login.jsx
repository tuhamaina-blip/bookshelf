import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-8 shadow-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Login</h2>

        {error && (
          <p className="bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-2 text-sm">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md px-4 py-2 transition-colors"
        >
          Login
        </button>

        <p className="text-sm text-stone-500 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}