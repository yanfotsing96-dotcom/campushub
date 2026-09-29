/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    document.body.className = theme + (focusMode ? ' focus-mode' : '');
    localStorage.setItem('theme', theme);
  }, [theme, focusMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleFocusMode = () => {
    setFocusMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, focusMode, toggleFocusMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}