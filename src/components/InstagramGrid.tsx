import { useEffect, useState, useCallback, useMemo } from 'react';
import { Instagram } from 'lucide-react';
import { fetchInstagramPosts } from '../lib/instagram';
import type { InstagramPost, InstagramGridProps } from '../lib/types';

export const InstagramGrid = ({ className = '' }: InstagramGridProps) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize placeholder count
  const placeholderCount = useMemo(() => 6, []);

  // Fetch Instagram posts
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
  }, [loadPosts]);

  // Memoize placeholder grid
  const renderPlaceholder = useCallback(() => (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="status"
      aria-busy="true"
      aria-label="Loading Instagram posts"
    >
      {Array.from({ length: placeholderCount }).map((_, index) => (
        <div 
          key={`placeholder-${index}`}
          className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors animate-pulse"
          aria-hidden="true"
        >
          <Instagram className="text-gray-400 dark:text-gray-600" size={32} />
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Loading...
          </span>
        </div>
      ))}
    </div>
  ), [placeholderCount]);

  // Handle image load error
  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    target.parentElement!.innerHTML = `
      <div class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center gap-2">
        <svg class="text-gray-400 dark:text-gray-600 w-8 h-8"><use href="#instagram"/></svg>
        <span class="text-sm text-gray-400 dark:text-gray-500">Image unavailable</span>
      </div>
    `;
  }, []);

  if (error) {
    return (
      <div 
        className="text-center text-red-600 dark:text-red-400 p-4"
        role="alert"
      >
        {error}
      </div>
    );
  }

  if (loading || posts.length === 0) {
    return renderPlaceholder();
  }

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`.trim()}
      role="feed"
      aria-label="Instagram posts"
    >
      {posts.map((post) => (
        <a 
          key={post.id}
          href={post.permalink}
          className="aspect-square group relative block overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={post.caption || 'Instagram post'}
        >
          <img
            src={post.media_url}
            alt={post.caption || 'Instagram post'}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-90"
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
            <Instagram 
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              size={32}
              aria-hidden="true"
            />
          </div>

          {/* Caption Overlay */}
          {post.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm line-clamp-2">
                {post.caption}
              </p>
            </div>
          )}
        </a>
      ))}
    </div>
  );
};

export default InstagramGrid;