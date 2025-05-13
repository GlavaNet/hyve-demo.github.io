import { InstagramPost } from './types';

// Specialized implementation for Instagram Basic Display API tokens (IGAA tokens)
export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
  
  if (!token) {
    console.warn('Instagram token is missing in environment variables');
    return [];
  }
  
  // Check if we have a Basic Display API token (IGAA)
  const isBasicDisplayToken = token.startsWith('IGAA');
  console.log(`Using ${isBasicDisplayToken ? 'Instagram Basic Display API' : 'Facebook Graph API'} token`);
  
  try {
    console.log('Attempting to fetch Instagram posts...');
    
    // For Basic Display API tokens, we use the /me endpoint
    // Note: userId is NOT needed for Basic Display API
    const instagramUrl = isBasicDisplayToken
      ? `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`
      : `https://graph.instagram.com/v13.0/${import.meta.env.VITE_INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`;
    
    // Use the corsproxy.io service
    const corsProxy = 'https://corsproxy.io/?';
    const proxyUrl = `${corsProxy}${encodeURIComponent(instagramUrl)}`;
    
    console.log('Fetching from Instagram API through CORS proxy...');
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      console.error(`Instagram API responded with status: ${response.status}`);
      
      // Try to get more detailed error information
      try {
        const errorData = await response.json();
        if (errorData.error) {
          console.error('Instagram API error details:', errorData.error);
          throw new Error(`Instagram API error: ${errorData.error.message}`);
        }
      } catch (parseError) {
        // If we can't parse the error, just use the status code
      }
      
      throw new Error(`Instagram API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      console.error('Instagram API error:', data.error);
      throw new Error(`Instagram API error: ${data.error.message}`);
    }
    
    console.log(`Successfully fetched ${data.data?.length || 0} Instagram posts`);
    
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid Instagram API response format:', data);
      return [];
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
};

// Fallback implementation with mock data
export const fetchMockInstagramPosts = async (): Promise<InstagramPost[]> => {
  console.log('Using mock Instagram data');
  
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