import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <button
        onClick={toggleTheme}
        className="button-ligth"
        title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
        aria-label="Basculer le thème"
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </div>
  );
}

export default ThemeToggle;