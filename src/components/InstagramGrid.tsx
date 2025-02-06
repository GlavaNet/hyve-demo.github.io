import { useEffect, useState, useCallback } from 'react';
import { Instagram } from 'lucide-react';
import { fetchInstagramPosts } from '../lib/instagram';
import type { InstagramPost, InstagramGridProps } from '../lib/types';

export const InstagramGrid = ({ className = '' }: InstagramGridProps) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const instagramPosts = await fetchInstagramPosts();
      if (instagramPosts && instagramPosts.length > 0) {
        setPosts(instagramPosts);
      }
    } catch (err) {
      setError('Failed to load Instagram posts');
      console.error('Error fetching Instagram posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
    const interval = setInterval(loadPosts, 86400000); // Check every 24 hours
    return () => clearInterval(interval);
  }, [loadPosts]);

  const renderPlaceholder = () => (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4"
      role="status"
      aria-busy="true"
      aria-label="Loading Instagram posts"
    >
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div 
          key={item} 
          className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center gap-2"
        >
          <Instagram className="text-gray-400 dark:text-gray-600" size={32} />
          <span className="text-sm text-gray-400 dark:text-gray-500">Loading...</span>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-4">
        {error}
      </div>
    );
  }

  if (loading || posts.length === 0) {
    return renderPlaceholder();
  }

  return (
    <div 
    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-16 sm:pt-4 ${className}`.trim()}
      role="feed"
      aria-label="Instagram posts"
    >
      {posts.map((post) => (
        <a 
          key={post.id}
          href={post.permalink}
          className="aspect-square group relative"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={post.media_url}
            alt={post.caption || 'Instagram post'}
            className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg">
            <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
          </div>
        </a>
      ))}
    </div>
  );
};

export default InstagramGrid;
