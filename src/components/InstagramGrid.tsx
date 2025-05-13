import { useEffect, useState, useCallback } from 'react';
import { Instagram } from 'lucide-react';
import { fetchInstagramPosts, fetchMockInstagramPosts } from '../lib/instagram';
import type { InstagramPost, InstagramGridProps } from '../lib/types';

export const InstagramGrid = ({ className = '' }: InstagramGridProps) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Function to create inline SVG placeholder content
  const generateSVGPlaceholder = (index: number) => {
    // Generate a unique but consistent hue for each placeholder
    const hue = (index * 55) % 360;
    
    // Create an inline SVG data URL
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='hsl(${hue}, 70%25, 80%25)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='hsl(${hue}, 90%25, 30%25)' text-anchor='middle' dominant-baseline='middle'%3ESample ${index + 1}%3C/text%3E%3C/svg%3E`;
  };

  const loadPosts = useCallback(async (useMock = false) => {
    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      
      if (useMock) {
        try {
          // Use mock data if specified
          const mockPosts = await fetchMockInstagramPosts();
          setPosts(mockPosts);
          setUseMockData(true);
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
          
          // Create fully inline fallback if mock images also fail
          const inlineMockPosts: InstagramPost[] = Array.from({ length: 6 }, (_, i) => ({
            id: `inline-mock-${i}`,
            media_type: 'IMAGE',
            media_url: generateSVGPlaceholder(i),
            permalink: '#' + i,
            caption: `Sample content ${i + 1}`
          }));
          
          setPosts(inlineMockPosts);
          setUseMockData(true);
        }
        return;
      }
      
      // Use real Instagram API
      const instagramPosts = await fetchInstagramPosts();
      
      if (instagramPosts && instagramPosts.length > 0) {
        setPosts(instagramPosts);
        setUseMockData(false);
      } else {
        setError('No Instagram posts found');
      }
    } catch (err) {
      console.error('Error fetching Instagram posts:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Could not load Instagram posts');
      setErrorDetails(errorMessage);
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
      <div className="text-center p-4 max-w-lg mx-auto">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2 text-red-600 dark:text-red-400">{error}</h3>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-500 hover:underline"
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
          
          {showDetails && errorDetails && (
            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 text-left text-xs text-gray-700 dark:text-gray-300 rounded">
              {errorDetails}
            </pre>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => loadPosts()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
          
          {!useMockData && (
            <button
              onClick={() => loadPosts(true)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Use Sample Content
            </button>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return renderPlaceholder();
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No Instagram posts found.
        </p>
        
        <button
          onClick={() => loadPosts()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {useMockData && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-md text-yellow-800 dark:text-yellow-200 text-sm">
          <p>Displaying sample content. Instagram connection is currently unavailable.</p>
          <button
            onClick={() => loadPosts()}
            className="text-blue-600 dark:text-blue-400 underline mt-1"
          >
            Try loading real content
          </button>
        </div>
      )}
      
      <div 
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 ${className}`.trim()}
        role="feed"
        aria-label="Instagram posts"
      >
        {posts.map((post, index) => (
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
                // Use our SVG generator as fallback
                e.currentTarget.src = generateSVGPlaceholder(index);
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg">
              <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default InstagramGrid;