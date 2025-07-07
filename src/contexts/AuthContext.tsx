import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import CryptoJS from 'crypto-js';

// Types
interface User {
  id: string;
  email: string;
  name: string;
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

// Improved password hashing with PBKDF2
const hashPassword = (password: string): string => {
  try {
    // Generate a random salt
    const salt = CryptoJS.lib.WordArray.random(128/8);
    
    // Hash the password with PBKDF2
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000 // Increased iterations for better security
    });
    
    // Return salt + hash (both as hex strings)
    return salt.toString() + ':' + hash.toString();
  } catch (error) {
    console.error('Password hashing error:', error);
    return '';
  }
};

const verifyPassword = (password: string, storedHash: string): boolean => {
  try {
    // Split the stored hash into salt and hash parts
    const [saltHex, hashHex] = storedHash.split(':');
    
    if (!saltHex || !hashHex) {
      console.error('Invalid stored hash format');
      return false;
    }
    
    // Parse the salt from hex
    const salt = CryptoJS.enc.Hex.parse(saltHex);
    
    // Hash the input password with the same salt and parameters
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    
    // Compare the hashes
    return hash.toString() === hashHex;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateSecureId = (): string => {
  return CryptoJS.lib.WordArray.random(16).toString();
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial auth check (runs once on mount)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = sessionStorage.getItem('user');
        const rememberMe = localStorage.getItem('rememberMe');
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } else if (rememberMe === 'true') {
          const rememberedUser = localStorage.getItem('user');
          if (rememberedUser) {
            const parsedUser = JSON.parse(rememberedUser);
            setUser(parsedUser);
            sessionStorage.setItem('user', rememberedUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear corrupted data
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-logout timer (runs when user changes)
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(sessionStorage.getItem('registeredUsers') || '[]');
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) {
        console.error('User not found');
        return false;
      }

      // Verify password using improved verification
      const isPasswordValid = verifyPassword(password, foundUser.password);
      
      if (!isPasswordValid) {
        console.error('Invalid password');
        return false;
      }

      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role === 'admin' ? 'admin' : 'user',
        createdAt: foundUser.createdAt
      };

      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('user');
      }

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
      if (!isValidEmail(email)) {
        console.error('Invalid email format');
        return false;
      }
      
      if (password.length < 8) {
        console.error('Password too short');
        return false;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(sessionStorage.getItem('registeredUsers') || '[]');
      
      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        console.error('User already exists');
        return false;
      }
      
      // Hash password using improved hashing
      const hashedPassword = hashPassword(password);
      
      if (!hashedPassword) {
        console.error('Password hashing failed');
        return false;
      }

      const newUser = {
        id: generateSecureId(),
        email,
        name,
        password: hashedPassword,
        role: 'user' as const,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      sessionStorage.setItem('registeredUsers', JSON.stringify(users));

      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: 'user',
        createdAt: newUser.createdAt
      };

      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      
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
    sessionStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('user');
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