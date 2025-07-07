// src/contexts/UserPreferencesContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface UserPreferences {
  currency: string;
  timezone: string;
  itemsPerPage: number;
  dashboardLayout: 'compact' | 'detailed';
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  currency: 'USD',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  itemsPerPage: 10,
  dashboardLayout: 'detailed',
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    return savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences;
  });

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      return newPrefs;
    });
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};