import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ThemeToggleProps } from '../lib/types';

export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme as 'light' | 'dark');
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  // Handle theme change
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);

    // Dispatch event for other components that might need to react to theme changes
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  }, [theme]);

  // Handle keyboard interaction
  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  }, [toggleTheme]);

  return (
    <button
      onClick={toggleTheme}
      onKeyPress={handleKeyPress}
      className={`p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
        ${className}`.trim()}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
    >
      {theme === 'light' ? (
        <Moon 
          size={20} 
          className="transform transition-transform duration-200 hover:scale-110"
          aria-hidden="true"
        />
      ) : (
        <Sun 
          size={20} 
          className="transform transition-transform duration-200 hover:scale-110"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">
        {`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      </span>
    </button>
  );
};

export default ThemeToggle;