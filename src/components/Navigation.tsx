import { useState, useCallback, useMemo, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
 page: string;
 setPage: (page: string) => void;
}

export const Navigation = ({ page, setPage }: NavigationProps) => {
 const [menuOpen, setMenuOpen] = useState(false);
 const [logoError, setLogoError] = useState(false);
 const [isDark, setIsDark] = useState(false);
 const businessName = useMemo(() => 
   import.meta.env.VITE_BUSINESS_NAME?.trim() || 'Business Name',
   []
 );

 // Listen for theme changes
 useEffect(() => {
   const checkTheme = () => {
     setIsDark(document.documentElement.classList.contains('dark'));
   };

   // Initial check
   checkTheme();

   // Listen for theme changes
   window.addEventListener('themeChange', checkTheme);
   
   return () => window.removeEventListener('themeChange', checkTheme);
 }, []);

 const navItems = useMemo(() => [
   { id: 'home', label: 'Home', ariaLabel: 'Go to home page' },
   { id: 'services', label: 'Services', ariaLabel: 'View our services' },
   { id: 'contact', label: 'Contact', ariaLabel: 'Go to contact page' }
 ], []);

 const handleNavClick = useCallback((navId: string) => {
   if (navItems.some(item => item.id === navId)) {
     setPage(navId);
     setMenuOpen(false);
   }
 }, [setPage, navItems]);

 return (
   <header>
     <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-50">
       <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
         <div className="flex items-center gap-3">
           <img 
             src={`/hyve-demo.github.io/public/images/logo-${isDark ? 'dark' : 'light'}.png`}
             alt={`${businessName} logo`}
             className="h-20 w-auto object-contain transition-opacity duration-300"
             loading="eager"
             width="80"
             height="80"
             onError={(e) => {
               console.error('Logo failed to load:', e.currentTarget.src);
               e.currentTarget.style.display = 'none';
               setLogoError(true);
             }}
           />
           {logoError && (
             <span className="text-xl font-semibold dark:text-white transition-colors">
               {businessName}
             </span>
           )}
         </div>
         
         <div className="flex items-center gap-4">
           <ThemeToggle />
           
           <button 
             onClick={() => setMenuOpen(!menuOpen)}
             className="block md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
             aria-label="Menu"
           >
             <Menu size={24} />
           </button>
           
           <div className="hidden md:flex gap-6">
             {navItems.map((item) => (
               <button 
                 key={item.id}
                 onClick={() => handleNavClick(item.id)}
                 className={`px-4 py-2 rounded-md transition-colors ${
                   page === item.id 
                     ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                     : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                 }`}
               >
                 {item.label}
               </button>
             ))}
           </div>
         </div>
       </div>
       
       {menuOpen && (
         <div className="md:hidden border-t border-gray-100 dark:border-gray-800">
           <div className="px-4 py-2 space-y-1">
             {navItems.map((item) => (
               <button 
                 key={item.id}
                 onClick={() => handleNavClick(item.id)}
                 className={`block w-full text-left px-4 py-2 rounded-md ${
                   page === item.id 
                     ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                     : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                 }`}
               >
                 {item.label}
               </button>
             ))}
           </div>
         </div>
       )}
     </nav>
     <div className="h-24" aria-hidden="true" />
   </header>
 );
};

export default Navigation;
