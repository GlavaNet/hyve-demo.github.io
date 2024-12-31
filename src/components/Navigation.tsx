import { Menu } from 'lucide-react';
import { useState } from 'react';
import { NavProps } from '../lib/types';

export const Navigation = ({ page, setPage }: NavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const businessName = import.meta.env.VITE_BUSINESS_NAME || 'Business Name';

  return (
    <header>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-xl font-semibold">{businessName}</span>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="block md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex gap-6">
            <button 
              onClick={() => setPage('home')}
              className={`px-4 py-2 rounded-md transition-colors ${
                page === 'home' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setPage('contact')}
              className={`px-4 py-2 rounded-md transition-colors ${
                page === 'contact' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-4 py-2 space-y-1">
              <button 
                onClick={() => {
                  setPage('home');
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md ${
                  page === 'home' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setPage('contact');
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md ${
                  page === 'contact' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer to prevent content from going under fixed navigation */}
      <div className="h-16"></div>
    </header>
  );
};