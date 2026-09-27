import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
        Welcome to <span className="text-amber-600">BookShelf</span>
      </h1>
      <p className="text-stone-600 max-w-md mb-8">
        Discover new books, track what you're reading, and share honest reviews with a community of readers.
      </p>
      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md px-6 py-3"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium rounded-md px-6 py-3"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}