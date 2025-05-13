// This is an alternative implementation you can use for testing
// Save this as src/lib/instagramFallback.ts

import { InstagramPost } from './types';

export const fetchInstagramPostsFallback = async (): Promise<InstagramPost[]> => {
  // This function provides mock data for testing when the Instagram API is not available
  console.log('Using fallback Instagram data');
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data that follows the Instagram API structure
  const mockPosts: InstagramPost[] = [
    {
      id: 'mock1',
      media_type: 'IMAGE',
      media_url: '/images/placeholder.jpg',
      permalink: 'https://instagram.com/p/mock1',
      caption: 'Sample Instagram post 1'
    },
    {
      id: 'mock2',
      media_type: 'IMAGE',
      media_url: '/images/placeholder.jpg',
      permalink: 'https://instagram.com/p/mock2',
      caption: 'Sample Instagram post 2'
    },
    {
      id: 'mock3',
      media_type: 'IMAGE',
      media_url: '/images/placeholder.jpg',
      permalink: 'https://instagram.com/p/mock3',
      caption: 'Sample Instagram post 3'
    },
    {
      id: 'mock4',
      media_type: 'IMAGE',
      media_url: '/images/placeholder.jpg',
      permalink: 'https://instagram.com/p/mock4',
      caption: 'Sample Instagram post 4'
    },
    {
      id: 'mock5',
      media_type: 'IMAGE',
      media_url: '/images/placeholder.jpg',
      permalink: 'https://instagram.com/p/mock5',
      caption: 'Sample Instagram post 5'
    },
    {
      id: 'mock6',
      media_type: 'IMAGE',
      media_url: '/images/placeholder.jpg',
      permalink: 'https://instagram.com/p/mock6',
      caption: 'Sample Instagram post 6'
    }
  ];
  
  return mockPosts;
};

// To use this, modify your Instagram component to import and use this function
// when the regular API fails or for testing purposes