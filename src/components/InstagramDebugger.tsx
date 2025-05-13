import { useState, useEffect } from 'react';

// Token inspection component that doesn't rely on CORS proxies
export const InstagramDebugger = () => {
  const [token, setToken] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  // Get the token from environment variables on component mount
  useEffect(() => {
    const envToken = import.meta.env.VITE_INSTAGRAM_TOKEN || '';
    if (envToken) {
      setToken(envToken);
      // Basic token analysis without API calls
      analyzeToken(envToken);
    }
  }, []);

  // Basic token analysis without making API calls
  const analyzeToken = (token: string) => {
    try {
      // Instagram tokens are typically in the format EAAxxxxx...
      if (!token.startsWith('EAA')) {
        setTokenInfo({
          valid: false,
          reason: "Token doesn't start with 'EAA', which is typical for Instagram Graph API tokens"
        });
        return;
      }

      // Check token length
      if (token.length < 100) {
        setTokenInfo({
          valid: false,
          reason: "Token seems too short for a valid Instagram token"
        });
        return;
      }

      // Token format seems valid
      setTokenInfo({
        valid: true,
        type: "Instagram Graph API Token",
        format: "Valid format",
        length: token.length,
        firstChars: token.substring(0, 10) + '...',
        lastChars: '...' + token.substring(token.length - 10),
      });
    } catch (error) {
      setTokenInfo({
        valid: false,
        reason: "Error analyzing token",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Redact the middle portion of the token for display
  const getRedactedToken = () => {
    if (!token) return '';
    if (token.length <= 20) return token;
    return token.substring(0, 10) + '...[REDACTED]...' + token.substring(token.length - 10);
  };

  // Get the Instagram app settings URL
  const getInstagramAppSettingsUrl = () => {
    return 'https://developers.facebook.com/apps/';
  };

  return (
    <div className="max-w-2xl mx-auto p-4 my-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Instagram Token Inspector</h2>
      
      {token ? (
        <div>
          <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-md mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Instagram token:</p>
            <p className="text-xs mt-1 font-mono overflow-hidden overflow-ellipsis">{getRedactedToken()}</p>
          </div>
          
          {tokenInfo && (
            <div className={`p-3 rounded-md mb-4 ${tokenInfo.valid ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'}`}>
              <p className="font-medium">{tokenInfo.valid ? 'Token format appears valid' : 'Token format may not be valid'}</p>
              {tokenInfo.valid ? (
                <p className="text-sm mt-1">The token follows the expected format for Instagram API tokens.</p>
              ) : (
                <p className="text-sm mt-1">Reason: {tokenInfo.reason}</p>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {expanded ? 'Hide' : 'Show'} Token Analysis
            </button>
            
            {expanded && tokenInfo && (
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded-md">
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li><span className="font-medium">Type:</span> {tokenInfo.type || 'Unknown'}</li>
                  <li><span className="font-medium">Length:</span> {tokenInfo.length || 'N/A'} characters</li>
                  <li><span className="font-medium">Prefix:</span> {tokenInfo.firstChars || 'N/A'}</li>
                  <li><span className="font-medium">Suffix:</span> {tokenInfo.lastChars || 'N/A'}</li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-md font-medium text-gray-800 dark:text-white">Next Steps:</h3>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-md text-blue-800 dark:text-blue-100">
              <p className="text-sm">Based on the previous error message, your token has been invalidated. You need to generate a new token.</p>
            </div>
            
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
              <li>Go to <a href={getInstagramAppSettingsUrl()} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Facebook Developer Portal</a></li>
              <li>Navigate to your app</li>
              <li>Generate a new token with the appropriate permissions</li>
              <li>Update your environment variable with the new token</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-md text-yellow-800 dark:text-yellow-100">
          <p>No Instagram token found in your environment variables.</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Note: This inspector only checks the format of your token, not its validity with Instagram.</p>
      </div>
    </div>
  );
};

export default InstagramDebugger;