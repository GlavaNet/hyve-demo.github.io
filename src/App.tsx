import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { InstagramGrid } from './components/InstagramGrid';
import { ContactInfo } from './components/ContactInfo';
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
      <main className="flex-grow pt-24 px-4 max-w-5xl mx-auto w-full">
        {page === 'home' ? <InstagramGrid /> : <ContactInfo />}
      </main>
      <Footer />
    </div>
  );
};

export default App;