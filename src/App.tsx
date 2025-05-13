import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { InstagramGrid } from './components/InstagramGrid';
// import { InstagramDebugger } from './components/InstagramDebugger';
import { ContactInfo } from './components/ContactInfo';
import { Services } from './components/Services';
import { Footer } from './components/Footer';

const App = () => {
  const [page, setPage] = useState('home');

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
            <InstagramDebugger />
            <InstagramGrid />
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