import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../services/api';
import jwtDecode from 'jwt-decode';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface JwtPayload {
  userId: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token and load user data on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (token) {
          // Verify token hasn't expired
          try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp < currentTime) {
              // Token expired
              localStorage.removeItem('token');
              sessionStorage.removeItem('token');
              setUser(null);
            } else {
              // Valid token, fetch user profile
              const userData = await getUserProfile();
              setUser(userData);
            }
          } catch (err) {
            // Invalid token
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(email, password);
      setUser(response.user);
      if (rememberMe) {
        localStorage.setItem('token', response.token);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', response.token);
        localStorage.removeItem('token');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerUser(username, email, password);
      setUser(response.user);
      sessionStorage.setItem('token', response.token);
      localStorage.removeItem('token');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};