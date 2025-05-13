import { useState } from 'react';
import { testInstagramToken } from '../lib/instagramDirect';

// This component can be temporarily added to your page for debugging
export const InstagramDebugger = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testInstagramToken();
      setResults(result);
    } catch (error) {
      setResults({
        success: false,
        message: 'Error running test',
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 my-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Instagram Connection Debugger</h2>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        This tool helps diagnose issues with your Instagram token. Click the button below to test your current token configuration.
      </p>
      
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
            results.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-medium">{results.success ? '✅ Success' : '❌ Error'}</p>
            <p>{results.message}</p>
          </div>
          
          <div className="mt-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-500 hover:text-blue-700"
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
        <p>Note: This component is for debugging only and should be removed in production.</p>
      </div>
    </div>
  );
};

export default InstagramDebugger;