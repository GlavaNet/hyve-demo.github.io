import { useEffect, useState, useCallback } from 'react';
import { Instagram, RefreshCw } from 'lucide-react';
import type { InstagramPost, InstagramGridProps } from '../lib/types';

// This implementation fetches Instagram posts directly without using your custom proxy
export const DirectInstagramGrid = ({ className = '' }: InstagramGridProps) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstagramPostsDirect = async (): Promise<InstagramPost[]> => {
    const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
    
    if (!token) {
      console.warn('Instagram token is missing in environment variables');
      throw new Error('Instagram token is missing in environment variables');
    }
    
    try {
      console.log('Fetching Instagram posts directly...');
      
      // Use a CORS proxy to access the Instagram API from the browser
      const corsProxy = 'https://api.allorigins.win/get?url=';
      
      // Instagram API endpoint for media
      const instagramUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`;
      const encodedUrl = encodeURIComponent(instagramUrl);
      const proxyUrl = `${corsProxy}${encodedUrl}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`CORS proxy responded with status: ${response.status}`);
      }
      
      const proxyData = await response.json();
      
      // The CORS proxy returns the data in a 'contents' property as a string
      if (!proxyData.contents) {
        throw new Error('Invalid response from CORS proxy');
      }
      
      // Parse the JSON string
      const data = JSON.parse(proxyData.contents);
      
      // Check for errors
      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message}`);
      }
      
      console.log(`Successfully fetched ${data.data?.length || 0} Instagram posts`);
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Instagram posts directly:', error);
      throw error;
    }
  };

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const instagramPosts = await fetchInstagramPostsDirect();
      
      if (instagramPosts && instagramPosts.length > 0) {
        setPosts(instagramPosts);
      } else {
        setError('No Instagram posts found');
      }
    } catch (err) {
      console.error('Error fetching Instagram posts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
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
      <div className="text-center p-8">
        <div className="max-w-md mx-auto">
          <div className="text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
          
          <button
            onClick={() => loadPosts()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors inline-flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || posts.length === 0) {
    return renderPlaceholder();
  }

  return (
    <div>
      <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-md text-green-800 dark:text-green-200">
        <p className="text-sm">Using direct Instagram API implementation with CORS proxy</p>
      </div>
      
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
    </div>
  );
};

export default DirectInstagramGrid;