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
    
    // First, try to verify the token is valid by checking token info
    const corsProxy = 'https://corsproxy.io/?';
    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`;
    const tokenDebugUrl = `${corsProxy}${encodeURIComponent(debugTokenUrl)}`;
    
    console.log('Checking token validity...');
    const tokenResponse = await fetch(tokenDebugUrl);
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      console.error('Token validation error:', tokenData.error);
      throw new Error(`Token validation failed: ${tokenData.error.message}`);
    }
    
    if (tokenData.data && !tokenData.data.is_valid) {
      console.error('Token is invalid:', tokenData.data);
      throw new Error('Instagram token is invalid or expired. Please generate a new token.');
    }
    
    // Token appears valid, now try to fetch media
    // Try using the Basic Display API approach instead of Graph API
    const basicDisplayUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`;
    const proxyBasicUrl = `${corsProxy}${encodeURIComponent(basicDisplayUrl)}`;
    
    console.log('Fetching from Instagram Basic Display API...');
    const basicResponse = await fetch(proxyBasicUrl);
    
    if (basicResponse.ok) {
      const basicData = await basicResponse.json();
      console.log('Basic Display API response:', basicData);
      
      if (basicData.data && Array.isArray(basicData.data)) {
        console.log(`Successfully fetched ${basicData.data.length} Instagram posts via Basic Display API`);
        return basicData.data;
      }
    }
    
    // If Basic Display API didn't work, try the original Graph API approach
    const graphApiUrl = `https://graph.instagram.com/v13.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`;
    const proxyGraphUrl = `${corsProxy}${encodeURIComponent(graphApiUrl)}`;
    
    console.log('Fetching from Instagram Graph API...');
    const graphResponse = await fetch(proxyGraphUrl);
    
    if (!graphResponse.ok) {
      throw new Error(`Instagram API responded with status: ${graphResponse.status}`);
    }
    
    const graphData = await graphResponse.json();
    
    // Check for auth errors
    if (graphData.error) {
      console.error('Instagram API error:', graphData.error);
      throw new Error(`Instagram API error: ${graphData.error.message}`);
    }
    
    console.log(`Successfully fetched ${graphData.data?.length || 0} Instagram posts via Graph API`);
    
    if (!graphData.data || !Array.isArray(graphData.data)) {
      console.error('Invalid Instagram API response format:', graphData);
      return [];
    }
    
    return graphData.data || [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error; // Re-throw the error so it can be handled by the component
  }
};