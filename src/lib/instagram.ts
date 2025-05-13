import { InstagramPost } from './types';

// Debug-focused implementation for troubleshooting Instagram API issues
export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
  
  if (!token) {
    console.warn('Instagram token is missing in environment variables');
    return [];
  }
  
  // Log token characteristics for debugging (without exposing the full token)
  //console.log('Token info:', {
  //  length: token.length,
  //  prefix: token.substring(0, 4),
  //  suffix: token.substring(token.length - 4),
  //  containsSpaces: token.includes(' '),
  //  containsNewlines: token.includes('\n')
  //});
  
  // Try a very simple API endpoint first to verify basic connectivity
  const corsProxy = 'https://corsproxy.io/?';
  
  try {
    console.log('Testing basic Instagram API connectivity...');
    
    // Use the simplest endpoint possible
    const testUrl = `https://graph.instagram.com/me?access_token=${token}`;
    const proxyTestUrl = `${corsProxy}${encodeURIComponent(testUrl)}`;
    
    //console.log('Making request to basic /me endpoint...');
    const testResponse = await fetch(proxyTestUrl);
    //console.log('Response status:', testResponse.status);
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      //console.error('Error response:', errorText);
      
      try {
        // Try to parse the error response
        const errorData = JSON.parse(errorText);
        //console.error('Parsed error data:', errorData);
        throw new Error(`Instagram API basic connectivity test failed: ${errorData.error?.message || 'Unknown error'}`);
      } catch (parseError) {
        throw new Error(`Instagram API basic connectivity test failed with status ${testResponse.status}`);
      }
    }
    
    const userData = await testResponse.json();
    //console.log('Basic user data:', userData);
    
    if (userData.error) {
      throw new Error(`Instagram API error: ${userData.error.message}`);
    }
    
    // If we got here, basic connectivity works! Now try to fetch media
    console.log('Basic connectivity successful, fetching media...');
    
    const mediaUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}`;
    const proxyMediaUrl = `${corsProxy}${encodeURIComponent(mediaUrl)}`;
    
    //console.log('Making request to /me/media endpoint...');
    const mediaResponse = await fetch(proxyMediaUrl);
    //console.log('Media response status:', mediaResponse.status);
    
    if (!mediaResponse.ok) {
      const errorText = await mediaResponse.text();
      //console.error('Media error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        //console.error('Parsed media error data:', errorData);
        throw new Error(`Instagram media fetch failed: ${errorData.error?.message || 'Unknown error'}`);
      } catch (parseError) {
        throw new Error(`Instagram media fetch failed with status ${mediaResponse.status}`);
      }
    }
    
    const mediaData = await mediaResponse.json();
    //console.log('Media response data:', mediaData);
    
    if (mediaData.error) {
      throw new Error(`Instagram media API error: ${mediaData.error.message}`);
    }
    
    if (!mediaData.data || !Array.isArray(mediaData.data)) {
      //console.warn('Valid response but unexpected format:', mediaData);
      return [];
    }
    
    //console.log(`Successfully fetched ${mediaData.data.length} Instagram posts`);
    return mediaData.data;
  } catch (error) {
    //console.error('Error fetching Instagram posts:', error);
    // Re-throw to let the component handle the error
    throw error;
  }
};

// Fallback implementation with local images rather than placeholder URLs
export const fetchMockInstagramPosts = async (): Promise<InstagramPost[]> => {
  //console.log('Using local mock Instagram data...');
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data using relative paths that should exist in public folder
  const mockPosts: InstagramPost[] = [
    {
      id: 'mock1',
      media_type: 'IMAGE',
      media_url: './images/services/service1.jpg',
      permalink: '#sample-1',
      caption: 'Sample Instagram post 1'
    },
    {
      id: 'mock2',
      media_type: 'IMAGE',
      media_url: './images/services/service2.jpg',
      permalink: '#sample-2',
      caption: 'Sample Instagram post 2'
    },
    {
      id: 'mock3',
      media_type: 'IMAGE',
      media_url: './images/services/service3.jpg',
      permalink: '#sample-3',
      caption: 'Sample Instagram post 3'
    },
    {
      id: 'mock4',
      media_type: 'IMAGE',
      media_url: './images/services/service4.jpg',
      permalink: '#sample-4',
      caption: 'Sample Instagram post 4'
    }
  ];
  
  return mockPosts;
};