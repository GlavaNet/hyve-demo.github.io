import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

// This is a simplified version of the Instagram Debugger component
export const InstagramDebugger = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
      
      if (!token) {
        setResults({
          success: false,
          message: 'No Instagram token found in environment variables'
        });
        return;
      }
      
      // Use a CORS proxy to make the request from the browser
      const corsProxy = 'https://api.allorigins.win/get?url=';
      
      // Debug token endpoint
      const debugUrl = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`;
      const encodedDebugUrl = encodeURIComponent(debugUrl);
      const proxyDebugUrl = `${corsProxy}${encodedDebugUrl}`;
      
      console.log('Fetching token debug info...');
      const debugResponse = await fetch(proxyDebugUrl);
      const debugData = await debugResponse.json();
      
      let tokenInfo;
      try {
        tokenInfo = JSON.parse(debugData.contents);
        console.log('Token debug info:', tokenInfo);
      } catch (e) {
        setResults({
          success: false,
          message: 'Failed to parse token debug response',
          data: debugData
        });
        return;
      }
      
      // Try to fetch media
      const mediaUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${token}&limit=1`;
      const encodedMediaUrl = encodeURIComponent(mediaUrl);
      const proxyMediaUrl = `${corsProxy}${encodedMediaUrl}`;
      
      console.log('Fetching Instagram media...');
      const mediaResponse = await fetch(proxyMediaUrl);
      const mediaData = await mediaResponse.json();
      
      let instagramData;
      try {
        instagramData = JSON.parse(mediaData.contents);
        console.log('Instagram media response:', instagramData);
      } catch (e) {
        setResults({
          success: false,
          message: 'Failed to parse Instagram API response',
          data: { tokenInfo, mediaData }
        });
        return;
      }
      
      // Check for errors in the Instagram response
      if (instagramData.error) {
        setResults({
          success: false,
          message: `Instagram API error: ${instagramData.error.message}`,
          data: { tokenInfo, instagramData }
        });
        return;
      }
      
      // Success case
      setResults({
        success: true,
        message: `Instagram connection successful. Token is valid and media can be fetched.`,
        data: { tokenInfo, instagramData }
      });
      
    } catch (error) {
      setResults({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error instanceof Error ? error.toString() : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 my-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Instagram Connection Debugger</h2>
      
      <div className="flex items-center mb-4">
        <AlertCircle size={18} className="text-yellow-500 mr-2" />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Use this tool to test your Instagram token and diagnose connection issues.
        </p>
      </div>
      
      <button
        onClick={runTest}
        disabled={loading}
        className={`px-4 py-2 rounded-md ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? 'Testing...' : 'Test Instagram Connection'}
      </button>
      
      {results && (
        <div className="mt-4">
          <div className={`p-3 rounded-md ${
            results.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}>
            <p className="font-medium">{results.success ? '✅ Success' : '❌ Error'}</p>
            <p>{results.message}</p>
          </div>
          
          <div className="mt-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {expanded ? 'Hide' : 'Show'} Technical Details
            </button>
            
            {expanded && (
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto text-xs text-gray-800 dark:text-gray-300">
                {JSON.stringify(results.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Note: This debugger helps diagnose Instagram API connection issues.</p>
      </div>
    </div>
  );
};

export default InstagramDebugger;