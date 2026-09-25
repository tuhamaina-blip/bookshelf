import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem('access') ? true : false);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);

  const login = async (uname, password) => {
    const res = await api.post('/login/', { username: uname, password });
    localStorage.setItem('access', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
    localStorage.setItem('username', uname);
    setUser(true);
    setUsername(uname);
  };

  const register = async (uname, email, password) => {
    await api.post('/register/', { username: uname, email, password });
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    setUser(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ user, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);