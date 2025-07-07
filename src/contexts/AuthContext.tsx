// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import CryptoJS from 'crypto-js';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Password hashing utilities
const hashPassword = (password: string): string => {
  try {
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    return salt.toString() + ':' + hash.toString();
  } catch (error) {
    console.error('Password hashing error:', error);
    return '';
  }
};

const verifyPassword = (password: string, storedHash: string): boolean => {
  try {
    const [saltHex, hashHex] = storedHash.split(':');
    if (!saltHex || !hashHex) return false;
    
    const salt = CryptoJS.enc.Hex.parse(saltHex);
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    return hash.toString() === hashHex;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateSecureId = (): string => CryptoJS.lib.WordArray.random(16).toString();

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMe, setRememberMe] = useLocalStorage<boolean>('rememberMe', false);
  const [storedUser, setStoredUser] = useLocalStorage<User | null>('user', null);
  const [registeredUsers, setRegisteredUsers] = useLocalStorage<User[]>('registeredUsers', []);

  // Initial auth check
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setStoredUser(null);
        setRememberMe(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [storedUser, setStoredUser, setRememberMe]);

  // Auto-logout timer
  useEffect(() => {
    if (!user) return;

    let timeout: number;
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        logout();
        console.log('Session expired due to inactivity');
      }, 30 * 60 * 1000); // 30 minutes
    };

    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [user]);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isValidEmail(email)) {
        console.error('Invalid email format');
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const foundUser = registeredUsers.find(u => u.email === email);
      if (!foundUser) return false;

      if (!verifyPassword(password, foundUser.password)) return false;

      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        password: foundUser.password,
        role: foundUser.role,
        createdAt: foundUser.createdAt
      };

      setUser(userData);
      setRememberMe(rememberMe);
      setStoredUser(rememberMe ? userData : null);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isValidEmail(email)) return false;
      if (password.length < 8) return false;
      if (registeredUsers.some(u => u.email === email)) return false;
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      const hashedPassword = hashPassword(password);
      if (!hashedPassword) return false;

      const newUser: User = {
        id: generateSecureId(),
        email,
        name,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      setRegisteredUsers([...registeredUsers, newUser]);
      
      // Auto-login after registration
      setUser(newUser);
      setStoredUser(newUser);
      setRememberMe(true);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setStoredUser(null);
    setRememberMe(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};