import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Landing from './pages/Landing';
import BookDetail from './pages/BookDetail';
import Shelf from './pages/Shelf';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
          <Route path="/shelf" element={<ProtectedRoute><Shelf /></ProtectedRoute>} />
          <Route path="/users/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;