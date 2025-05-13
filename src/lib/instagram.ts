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
    
    // Using your custom proxy endpoint
    const response = await fetch('https://instagram-proxy.sabrastrain3.workers.dev/');
    
    if (!response.ok) {
      throw new Error(`Instagram API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.data?.length || 0} Instagram posts`);
    
    // Add additional validation for the response structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('Invalid Instagram API response format:', data);
      return [];
    }
    
    // Log the first post for debugging (with sensitive info redacted)
    if (data.data.length > 0) {
      const samplePost = { ...data.data[0] };
      if (samplePost.media_url) {
        console.log('First post media URL exists');
      } else {
        console.warn('First post is missing media_url property');
      }
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}