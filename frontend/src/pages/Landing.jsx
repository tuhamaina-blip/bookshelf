import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(28,25,23,0.75), rgba(28,25,23,0.75)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Welcome to <span className="text-amber-400">BookShelf</span>
      </h1>
      <p className="text-stone-200 max-w-md mb-8">
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
          className="bg-white/90 hover:bg-white border border-stone-300 text-stone-700 font-medium rounded-md px-6 py-3"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}