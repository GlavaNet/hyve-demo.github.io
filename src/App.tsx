import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { InstagramGrid } from './components/InstagramGrid';
import { InstagramDebugger } from './components/InstagramDebugger';
import { ContactInfo } from './components/ContactInfo';
import { Services } from './components/Services';
import { Footer } from './components/Footer';

// Import the direct Instagram implementation instead
// Note: You'll need to create the DirectInstagramGrid component (code provided below)
import { DirectInstagramGrid } from './components/DirectInstagramGrid';

const App = () => {
  const [page, setPage] = useState('home');
  // Flag to switch between implementations
  const [useDirectImplementation, setUseDirectImplementation] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
      <Navigation page={page} setPage={setPage} />
      <main className={`flex-grow px-4 max-w-5xl mx-auto w-full ${
        page === 'home' 
          ? 'pt-40 sm:pt-40'
          : 'pt-36 sm:pt-32'
      }`}>
        {page === 'home' && (
          <>
            {/* Instagram Debugger component for troubleshooting */}
            <InstagramDebugger />
            
            {/* Implementation switcher */}
            <div className="mb-6 flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Instagram implementation:
              </span>
              <button
                onClick={() => setUseDirectImplementation(false)}
                className={`px-3 py-1 text-sm rounded ${
                  !useDirectImplementation 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Proxy
              </button>
              <button
                onClick={() => setUseDirectImplementation(true)}
                className={`px-3 py-1 text-sm rounded ${
                  useDirectImplementation 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Direct
              </button>
            </div>
            
            {/* Conditional rendering based on selected implementation */}
            {useDirectImplementation ? (
              <DirectInstagramGrid />
            ) : (
              <InstagramGrid />
            )}
          </>
        )}
        {page === 'services' && <Services />}
        {page === 'contact' && <ContactInfo />}
      </main>
      <Footer />
    </div>
  );
};

export default App;