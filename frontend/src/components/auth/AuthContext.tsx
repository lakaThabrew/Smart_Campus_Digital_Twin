"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('auth-user');
        const storedToken = localStorage.getItem('auth-token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('auth-user');
        localStorage.removeItem('auth-token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call - replace with real authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password combination
      // In a real app, this would validate against a backend
      if (email && password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        const userData = { email };
        const token = 'demo-token-' + Date.now();

        setUser(userData);
        localStorage.setItem('auth-user', JSON.stringify(userData));
        localStorage.setItem('auth-token', token);

        // Set cookie for server-side checks
        document.cookie = `token=${token}; path=/; max-age=86400`; // 24 hours

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call - replace with real registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any valid data
      // In a real app, this would create a user account
      if (userData.email && userData.password.length >= 8 && /[A-Z]/.test(userData.password) && /[a-z]/.test(userData.password) && /\d/.test(userData.password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(userData.password) && userData.name) {
        const newUser = {
          email: userData.email,
          name: userData.name
        };
        const token = 'demo-token-' + Date.now();

        setUser(newUser);
        localStorage.setItem('auth-user', JSON.stringify(newUser));
        localStorage.setItem('auth-token', token);

        // Set cookie for server-side checks
        document.cookie = `token=${token}; path=/; max-age=86400`; // 24 hours

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
    localStorage.removeItem('auth-token');

    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    router.push('/');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}