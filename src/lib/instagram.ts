import { InstagramPost } from './types';

export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
  const userId = import.meta.env.VITE_INSTAGRAM_USER_ID;
  
  if (!token || !userId) {
    console.warn('Instagram token or user ID is missing in environment variables');
    return [];
  }
  
  try {
    console.log('Attempting to fetch Instagram posts...');
    
    // Instagram Graph API endpoint for media
    const instagramUrl = `https://graph.instagram.com/v12.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`;
    
    // Use the corsproxy.io service that worked in testing
    const corsProxy = 'https://corsproxy.io/?';
    const proxyUrl = `${corsProxy}${encodeURIComponent(instagramUrl)}`;
    
    console.log('Fetching from Instagram API through CORS proxy...');
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Instagram API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for auth errors specifically to provide better feedback
    if (data.error && (data.error.type === 'OAuthException' || data.error.code === 190)) {
      console.error('Instagram token has expired or been invalidated:', data.error.message);
      throw new Error('Instagram token has expired or been invalidated. Please generate a new token.');
    }
    
    console.log(`Successfully fetched ${data.data?.length || 0} Instagram posts`);
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('Invalid Instagram API response format:', data);
      return [];
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
};