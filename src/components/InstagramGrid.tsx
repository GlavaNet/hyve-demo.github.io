import { useEffect, useState, useCallback } from 'react';
import { Instagram } from 'lucide-react';
import { fetchInstagramPosts } from '../lib/instagram';
import type { InstagramPost, InstagramGridProps } from '../lib/types';

// Uncomment this to use fallback data for testing when the API is not working
// import { fetchInstagramPostsFallback } from '../lib/instagramFallback';

export const InstagramGrid = ({ className = '' }: InstagramGridProps) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Enable debug mode to see additional information
  const DEBUG_MODE = false;

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Log environment variable availability (without showing actual values)
      if (DEBUG_MODE) {
        const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
        const userId = import.meta.env.VITE_INSTAGRAM_USER_ID;
        setDebugInfo(`Environment variables: Token ${token ? 'exists' : 'missing'}, User ID ${userId ? 'exists' : 'missing'}`);
      }
      
      // Use the primary Instagram API fetch function
      const instagramPosts = await fetchInstagramPosts();
      
      // If no posts are returned, you could use a fallback
      if (!instagramPosts || instagramPosts.length === 0) {
        if (DEBUG_MODE) {
          setDebugInfo(prev => `${prev || ''}\nNo posts found from primary API. Consider using fallback.`);
          
          // Uncomment to use fallback data
          // const fallbackPosts = await fetchInstagramPostsFallback();
          // setPosts(fallbackPosts);
          // return;
        }
      }
      
      if (instagramPosts && instagramPosts.length > 0) {
        setPosts(instagramPosts);
        if (DEBUG_MODE) {
          setDebugInfo(prev => `${prev || ''}\nSuccessfully loaded ${instagramPosts.length} posts.`);
        }
      } else {
        setError('No Instagram posts found');
      }
    } catch (err) {
      console.error('Error fetching Instagram posts:', err);
      setError('Failed to load Instagram posts');
      
      if (DEBUG_MODE) {
        setDebugInfo(prev => `${prev || ''}\nError: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Call the loadPosts function when component mounts
    loadPosts();
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
      <div className="text-center p-4">
        <div className="text-red-600 dark:text-red-400 mb-4">
          {error}
        </div>
        
        {/* Show retry button */}
        <button
          onClick={() => loadPosts()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
        
        {/* Show debug info when enabled */}
        {DEBUG_MODE && debugInfo && (
          <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 text-left rounded-md overflow-auto text-sm text-gray-700 dark:text-gray-300">
            {debugInfo}
          </pre>
        )}
      </div>
    );
  }

  if (loading || posts.length === 0) {
    return renderPlaceholder();
  }

  return (
    <div>
      <div 
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 ${className}`.trim()}
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
              onError={(e) => {
                console.error("Image failed to load:", post.id, post.media_url);
                e.currentTarget.src = '/images/placeholder.jpg';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg">
              <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
            </div>
          </a>
        ))}
      </div>
      
      {/* Show debug info when enabled */}
      {DEBUG_MODE && debugInfo && (
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 text-left rounded-md overflow-auto text-sm text-gray-700 dark:text-gray-300">
          {debugInfo}
        </pre>
      )}
    </div>
  );
};

export default InstagramGrid;