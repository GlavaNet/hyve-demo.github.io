import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { NavigationProps } from '../lib/types';

export const Navigation = ({ page, setPage, className = '' }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const businessName = useMemo(() => 
    import.meta.env.VITE_BUSINESS_NAME?.trim() || 'Business Name',
    []
  );

  // Memoize navigation items
  const navItems = useMemo(() => [
    { id: 'home', label: 'Home', ariaLabel: 'Go to home page' },
    { id: 'contact', label: 'Contact', ariaLabel: 'Go to contact page' }
  ], []);

  // Handle page change with validation
  const handleNavClick = useCallback((navId: string) => {
    if (navItems.some(item => item.id === navId)) {
      setPage(navId);
      setMenuOpen(false);
    }
  }, [setPage, navItems]);

  // Handle keyboard navigation
  const handleKeyPress = useCallback((event: React.KeyboardEvent, navId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavClick(navId);
    }
  }, [handleNavClick]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (menuOpen && !target.closest('[data-nav-menu]')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header 
      role="banner"
      className={`fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-50 ${className}`.trim()}
    >
      <nav 
        role="navigation"
        aria-label="Main navigation"
        className="max-w-5xl mx-auto px-4 py-4"
      >
        <div className="flex justify-between items-center">
          {/* Logo and Business Name */}
          <div className="flex items-center gap-3">
            {import.meta.env.VITE_LOGO_URL && (
              <img 
                src={import.meta.env.VITE_LOGO_URL}
                alt={`${businessName} logo`}
                className="h-8 w-auto object-contain"
                loading="eager"
                width="32"
                height="32"
              />
            )}
            <span 
              className="text-xl font-semibold dark:text-white transition-colors"
              itemProp="name"
            >
              {businessName}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="block md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex gap-6" role="menubar">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onKeyDown={(e) => handleKeyPress(e, item.id)}
                  className={`px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                    page === item.id 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                  role="menuitem"
                  aria-current={page === item.id ? 'page' : undefined}
                  aria-label={item.ariaLabel}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div 
          id="mobile-menu"
          className={`md:hidden border-t border-gray-100 dark:border-gray-800 transition-opacity duration-200 ${
            menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          role="menu"
          aria-label="Mobile navigation"
          data-nav-menu
        >
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onKeyDown={(e) => handleKeyPress(e, item.id)}
                className={`block w-full text-left px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                  page === item.id 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
                role="menuitem"
                aria-current={page === item.id ? 'page' : undefined}
                aria-label={item.ariaLabel}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="h-16" aria-hidden="true" />
    </header>
  );
};

export default Navigation;