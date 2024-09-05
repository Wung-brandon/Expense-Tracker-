// src/context/ThemeContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for theme context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useThemeBackground = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
