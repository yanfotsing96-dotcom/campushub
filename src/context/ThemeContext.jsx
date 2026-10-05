/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    document.body.className = theme + (focusMode ? ' focus-mode' : '');
    localStorage.setItem('theme', theme);
  }, [theme, focusMode]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => !prev);
  }, []);

  const themeValue = useMemo(() => {
    return { theme, toggleTheme, focusMode, toggleFocusMode };
  }, [theme, toggleTheme, focusMode, toggleFocusMode]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}