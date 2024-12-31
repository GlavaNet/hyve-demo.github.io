import { useEffect, useState } from 'react';
import { Instagram } from 'lucide-react';
import { fetchInstagramPosts } from '../lib/instagram';
import type { InstagramPost } from '../lib/types';

export const InstagramGrid = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const instagramPosts = await fetchInstagramPosts();
        if (instagramPosts && instagramPosts.length > 0) {
          setPosts(instagramPosts);
        }
      } catch (error) {
        console.error('Failed to fetch Instagram posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  const renderPlaceholder = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div 
          key={item} 
          className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2"
        >
          <Instagram className="text-gray-400" size={32} />
          <span className="text-sm text-gray-400">Content {item}</span>
        </div>
      ))}
    </div>
  );

  if (loading || posts.length === 0) {
    return renderPlaceholder();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <a 
          key={post.id} 
          href={post.permalink}
          className="aspect-square"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={post.media_url}
            alt={post.caption || 'Post'}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              const target = e.currentTarget;
              target.parentElement!.innerHTML = `
                <div class="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
                  <svg class="text-gray-400 w-8 h-8"><use href="#instagram"/></svg>
                  <span class="text-sm text-gray-400">Image unavailable</span>
                </div>
              `;
            }}
          />
        </a>
      ))}
    </div>
  );
};