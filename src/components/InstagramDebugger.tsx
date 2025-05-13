import { useState } from 'react';

// Ultra simple version with alternative CORS approaches
export const InstagramDebugger = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [corsProxy, setCorsProxy] = useState<string>('corsanywhere');

  const runTest = async () => {
    setLoading(true);
    try {
      const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
      
      if (!token) {
        setResults({
          success: false,
          message: 'No Instagram token found in environment variables'
        });
        setLoading(false);
        return;
      }
      
      // Different CORS proxy options
      let proxyUrl = '';
      const debugUrl = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`;
      
      if (corsProxy === 'corsanywhere') {
        // Option 1: CORS Anywhere
        proxyUrl = `https://cors-anywhere.herokuapp.com/${debugUrl}`;
      } else if (corsProxy === 'allorigins') {
        // Option 2: All Origins
        proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(debugUrl)}`;
      } else if (corsProxy === 'corsproxy') {
        // Option 3: CORS Proxy
        proxyUrl = `https://corsproxy.io/?${encodeURIComponent(debugUrl)}`;
      } else {
        // Option 4: jsonp.io
        proxyUrl = `https://jsonp.afeld.me/?url=${encodeURIComponent(debugUrl)}`;
      }
      
      console.log('Fetching token debug info using proxy:', corsProxy);
      console.log('Proxy URL:', proxyUrl);
      
      let debugResponse, debugData, tokenInfo;
      
      try {
        debugResponse = await fetch(proxyUrl);
        debugData = await debugResponse.json();
        
        // Handle different response formats based on the proxy
        if (corsProxy === 'allorigins') {
          tokenInfo = JSON.parse(debugData.contents);
        } else if (corsProxy === 'corsanywhere' || corsProxy === 'corsproxy') {
          tokenInfo = debugData;
        } else {
          tokenInfo = debugData;
        }
        
        console.log('Token debug info:', tokenInfo);
      } catch (e) {
        console.error('Error with proxy:', e);
        setResults({
          success: false,
          message: `CORS error with ${corsProxy} proxy. Try a different proxy option.`,
          error: e instanceof Error ? e.message : String(e)
        });
        setLoading(false);
        return;
      }
      
      // Check if we got a token error
      if (tokenInfo.error) {
        setResults({
          success: false,
          message: `Token error: ${tokenInfo.error.message}`,
          data: tokenInfo
        });
      } else if (tokenInfo.data && !tokenInfo.data.is_valid) {
        // Token is invalid
        setResults({
          success: false,
          message: `Token is invalid: ${tokenInfo.data.error?.message || 'Unknown reason'}`,
          data: tokenInfo
        });
      } else {
        // Token seems valid, let's try to fetch media
        setResults({
          success: true,
          message: `Instagram token appears to be valid.`,
          data: tokenInfo
        });
      }
    } catch (error) {
      console.error('Error testing token:', error);
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
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Use this tool to test your Instagram token and diagnose connection issues.
      </p>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">CORS Proxy:</p>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setCorsProxy('corsanywhere')}
            className={`px-2 py-1 text-xs rounded ${corsProxy === 'corsanywhere' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            CORS Anywhere
          </button>
          <button 
            onClick={() => setCorsProxy('allorigins')}
            className={`px-2 py-1 text-xs rounded ${corsProxy === 'allorigins' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            All Origins
          </button>
          <button 
            onClick={() => setCorsProxy('corsproxy')}
            className={`px-2 py-1 text-xs rounded ${corsProxy === 'corsproxy' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            CORS Proxy
          </button>
          <button 
            onClick={() => setCorsProxy('jsonp')}
            className={`px-2 py-1 text-xs rounded ${corsProxy === 'jsonp' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            JSONP
          </button>
        </div>
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
            <p className="font-medium">{results.success ? 'Success' : 'Error'}</p>
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
        <p>Note: If one CORS proxy doesn't work, try another one.</p>
      </div>
    </div>
  );
};

export default InstagramDebugger;