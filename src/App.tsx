import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { InstagramGrid } from './components/InstagramGrid';
import { ContactInfo } from './components/ContactInfo';

const App = () => {
  const [page, setPage] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <Navigation page={page} setPage={setPage} />
      <main className="pt-20 px-4 max-w-5xl mx-auto">
        {page === 'home' ? <InstagramGrid /> : <ContactInfo />}
      </main>
    </div>
  );
};

export default App;