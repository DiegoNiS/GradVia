import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { getMe } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gradvia_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error("Token no válido o expirado", error);
          localStorage.removeItem('gradvia_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('gradvia_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('gradvia_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
