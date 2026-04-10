import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pt_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API}/api/auth/me`)
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('pt_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const res = await axios.post(`${API}/api/auth/login`, { email, password });
    const { token, user: u } = res.data;
    localStorage.setItem('pt_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(u);
    return u;
  }

  async function register(name, email, password) {
    const res = await axios.post(`${API}/api/auth/register`, { name, email, password });
    const { token, user: u } = res.data;
    localStorage.setItem('pt_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(u);
    return u;
  }

  function logout() {
    localStorage.removeItem('pt_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
