import { InstagramPost } from './types';

export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
  const userId = import.meta.env.VITE_INSTAGRAM_USER_ID;
  
  if (!token || !userId) {
    return [];
  }
  
  try {
    const response = await fetch(
      // `https://api.allorigins.win/get?url=${encodeURIComponent(
        // `https://cors-anywhere.herokuapp.com/https://graph.instagram.com/v12.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=6`
      // )}`
      'https://instagram-proxy.sabrastrain3.workers.dev/'
    );
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}
