import { InstagramPost } from './types';

// Balanced implementation with security and functionality
export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
  const userId = import.meta.env.VITE_INSTAGRAM_USER_ID;
  
  if (!token) {
    console.warn('Instagram token is missing in environment variables');
    return [];
  }
  
  // Check if we have a Basic Display API token (IGAA)
  const isBasicDisplayToken = token.startsWith('IGAA');
  
  try {
    // For Basic Display API tokens, we use the /me endpoint
    // For Graph API tokens, we use the /{user-id} endpoint
    const instagramUrl = isBasicDisplayToken
      ? `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`
      : `https://graph.instagram.com/v13.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`;
    
    // Use the corsproxy.io service
    const corsProxy = 'https://corsproxy.io/?';
    const proxyUrl = `${corsProxy}${encodeURIComponent(instagramUrl)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      // Get enough error information to diagnose without oversharing
      console.error(`Instagram API error: ${response.status}`);
      
      // Try to get the error message without logging the entire response
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.message) {
          throw new Error(`Instagram API error: ${errorData.error.message}`);
        }
      } catch (parseError) {
        // If parsing fails, use the status code
        throw new Error(`Instagram API error: ${response.status}`);
      }
      
      throw new Error(`Instagram API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      throw new Error(`Instagram API error: ${data.error.message}`);
    }
    
    if (!data.data || !Array.isArray(data.data)) {
      console.warn('Instagram API returned unexpected format');
      return [];
    }
    
    return data.data;
  } catch (error) {
    // Log minimal error info and rethrow for component handling
    console.error('Instagram fetch error:', error instanceof Error ? error.message : 'Unknown error');
    throw error; // Important: rethrow so the component can handle it
  }
};

// Fallback implementation with inline SVG placeholders
export const fetchMockInstagramPosts = async (): Promise<InstagramPost[]> => {
  // Generate SVG data URLs as placeholders
  const generateSVGPlaceholder = (index: number) => {
    const hue = (index * 55) % 360;
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='hsl(${hue}, 70%25, 80%25)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='hsl(${hue}, 90%25, 30%25)' text-anchor='middle' dominant-baseline='middle'%3ESample ${index + 1}%3C/text%3E%3C/svg%3E`;
  };

  // Generate mock posts with inline SVG images
  return Array.from({ length: 6 }, (_, i) => ({
    id: `mock-${i}`,
    media_type: 'IMAGE',
    media_url: generateSVGPlaceholder(i),
    permalink: '#sample-content',
    caption: `Sample content ${i + 1}`
  }));
};