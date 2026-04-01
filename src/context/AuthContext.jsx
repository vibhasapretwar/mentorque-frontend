import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // important
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('mq_user'));
      const token = localStorage.getItem('mq_token');

      if (storedUser && token) {
        setUser(storedUser);
      }
    } catch {
      localStorage.removeItem('mq_user');
      localStorage.removeItem('mq_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await loginApi(email, password);

      localStorage.setItem('mq_token', data.token);
      localStorage.setItem('mq_user', JSON.stringify(data.user));

      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mq_token');
    localStorage.removeItem('mq_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);