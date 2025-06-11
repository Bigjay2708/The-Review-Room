import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { auth } from '../services/api';
import axios from 'axios'; // Import axios for error checking

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string, loginType: 'email' | 'username') => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await auth.getProfile();
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string, loginType: 'email' | 'username') => {
    try {
      setError(null);
      const response = await auth.login({ identifier, password, loginType });
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (err) {
      let errorMessage = 'Failed to login';
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.data && typeof err.response.data === 'object' && 'errors' in err.response.data && Array.isArray(err.response.data.errors)) {
          errorMessage = err.response.data.errors.map((e: any) => e.msg).join(', ');
        } else if (err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
          errorMessage = (err.response.data as { message: string }).message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data; // Fallback for plain string error messages
        }
      }
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      const response = await auth.register({ username, email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (err) {
      let errorMessage = 'Failed to register';
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.data && typeof err.response.data === 'object' && 'errors' in err.response.data && Array.isArray(err.response.data.errors)) {
          errorMessage = err.response.data.errors.map((e: any) => e.msg).join(', ');
        } else if (err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
          errorMessage = (err.response.data as { message: string }).message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data; // Fallback for plain string error messages
        }
      }
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 