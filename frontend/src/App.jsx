import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
   <div className="bg-stone-50 min-h-screen text-stone-800">
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Home />} />
  </Routes>
</div>
  );
}

export default App;