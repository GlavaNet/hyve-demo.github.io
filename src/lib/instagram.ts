import { InstagramPost } from './types';

// Alternative approach using Basic Display API
export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
  
  if (!token) {
    console.warn('Instagram token is missing in environment variables');
    return [];
  }
  
  try {
    console.log('Attempting to fetch Instagram posts...');
    
    // This approach uses the /me endpoint instead of a specific user ID
    // This works for tokens from the Instagram Basic Display API
    const instagramUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`;
    
    // Use the corsproxy.io service that worked in testing
    const corsProxy = 'https://corsproxy.io/?';
    const proxyUrl = `${corsProxy}${encodeURIComponent(instagramUrl)}`;
    
    console.log('Fetching from Instagram API through CORS proxy...');
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      console.error(`Instagram API responded with status: ${response.status}`);
      
      // If we got a 400 error, try to parse the response body to get more details
      try {
        const errorData = await response.json();
        if (errorData.error) {
          console.error('Instagram API error details:', errorData.error);
          throw new Error(`Instagram API error: ${errorData.error.message}`);
        }
      } catch (parseError) {
        // If we can't parse the error response, just throw the original error
        throw new Error(`Instagram API responded with status: ${response.status}`);
      }
      
      throw new Error(`Instagram API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for auth errors specifically to provide better feedback
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
    throw error; // Re-throw to let the component handle it
  }
};

// Fallback implementation with mock data if needed
export const fetchMockInstagramPosts = async (): Promise<InstagramPost[]> => {
  // This function provides mock data for testing when the Instagram API is not available
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