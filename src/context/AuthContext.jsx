import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('edugear_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('edugear_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    async function verifySession() {
      const savedToken = localStorage.getItem('edugear_token');
      if (savedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('edugear_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid:', error.message);
          logout();
        }
      }
      setLoading(false);
    }

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('edugear_token', res.token);
      localStorage.setItem('edugear_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (name, email, password, role = 'student') => {
    const res = await authService.register(name, email, password, role);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('edugear_token', res.token);
      localStorage.setItem('edugear_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('edugear_token');
    localStorage.removeItem('edugear_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    role: user?.role || null,
    isCaretaker: user?.role === 'caretaker',
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
