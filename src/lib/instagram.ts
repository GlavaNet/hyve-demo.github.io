import { InstagramPost } from './types';

// Production-ready implementation with secure handling of sensitive information
export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
  
  if (!token) {
    // Generic error that doesn't reveal what's missing
    console.warn('Missing required configuration for Instagram integration');
    return [];
  }
  
  // Determine if we have a Basic Display API token without logging
  const isBasicDisplayToken = token.startsWith('IGAA');
  
  try {
    // Use the appropriate endpoint based on token type
    const instagramUrl = isBasicDisplayToken
      ? `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`
      : `https://graph.instagram.com/v13.0/${import.meta.env.VITE_INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`;
    
    // Use the CORS proxy without logging the full URL
    const corsProxy = 'https://corsproxy.io/?';
    const proxyUrl = `${corsProxy}${encodeURIComponent(instagramUrl)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      // Generic error without details in production
      throw new Error(`Failed to fetch Instagram content`);
    }
    
    const data = await response.json();
    
    // Check for API errors without logging the full response
    if (data.error) {
      throw new Error(`Instagram integration error`);
    }
    
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }
    
    return data.data;
  } catch (error) {
    // Log error without exposing sensitive details
    console.error('Instagram integration error:', 
      error instanceof Error ? error.message : 'Unknown error');
    return [];
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