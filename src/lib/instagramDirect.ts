// We're not using InstagramPost in this file, so we can remove it
// src/lib/instagramDirect.ts

export const testInstagramToken = async (): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> => {
    const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
    
    if (!token) {
      return {
        success: false,
        message: 'No token provided in environment variables'
      };
    }
    
    try {
      // Use a CORS proxy to make the request from the browser
      const corsProxy = 'https://api.allorigins.win/get?url=';
      
      // First, let's debug the token
      const debugUrl = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`;
      const encodedDebugUrl = encodeURIComponent(debugUrl);
      const proxyDebugUrl = `${corsProxy}${encodedDebugUrl}`;
      
      const debugResponse = await fetch(proxyDebugUrl);
      const debugData = await debugResponse.json();
      let tokenInfo;
      
      try {
        tokenInfo = JSON.parse(debugData.contents);
      } catch (e) {
        return {
          success: false,
          message: 'Failed to parse token debug response',
          data: debugData
        };
      }
      
      // If token is invalid, return information about why
      if (tokenInfo.data && !tokenInfo.data.is_valid) {
        return {
          success: false,
          message: `Token is invalid: ${tokenInfo.data.error?.message || 'Unknown reason'}`,
          data: tokenInfo
        };
      }
      
      // Now try to access Instagram media
      const mediaUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${token}`;
      const encodedMediaUrl = encodeURIComponent(mediaUrl);
      const proxyMediaUrl = `${corsProxy}${encodedMediaUrl}`;
      
      const mediaResponse = await fetch(proxyMediaUrl);
      const mediaData = await mediaResponse.json();
      let instagramData;
      
      try {
        instagramData = JSON.parse(mediaData.contents);
      } catch (e) {
        return {
          success: false,
          message: 'Failed to parse Instagram API response',
          data: mediaData
        };
      }
      
      // Check for errors in the Instagram response
      if (instagramData.error) {
        return {
          success: false,
          message: `Instagram API error: ${instagramData.error.message}`,
          data: instagramData
        };
      }
      
      // Check if we got media data
      if (instagramData.data && Array.isArray(instagramData.data)) {
        return {
          success: true,
          message: `Successfully retrieved ${instagramData.data.length} Instagram posts`,
          data: instagramData
        };
      } else {
        return {
          success: false,
          message: 'No Instagram data returned',
          data: instagramData
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error testing Instagram token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: error
      };
    }
  };