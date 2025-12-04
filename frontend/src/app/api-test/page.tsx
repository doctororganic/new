'use client';

import { useState } from 'react';
import { testBackendIntegration, TestResult } from '@/lib/api-test';
import { CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';

export default function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runTests = async () => {
    setLoading(true);
    try {
      const testResults = await testBackendIntegration();
      setResults(testResults);
      setLastRun(new Date());
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Backend Integration Test</h1>
              <button
                onClick={runTests}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run Tests
                  </>
                )}
              </button>
            </div>
            {lastRun && (
              <p className="text-sm text-gray-500 mt-2">
                Last run: {lastRun.toLocaleTimeString()}
              </p>
            )}
          </div>

          {results.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex space-x-6">
                <div>
                  <span className="text-sm text-gray-500">Total Tests:</span>
                  <span className="ml-2 text-sm font-medium">{results.length}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Passed:</span>
                  <span className="ml-2 text-sm font-medium text-green-600">{passCount}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Failed:</span>
                  <span className="ml-2 text-sm font-medium text-red-600">{failCount}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Success Rate:</span>
                  <span className="ml-2 text-sm font-medium">
                    {((passCount / results.length) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 py-4">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Click "Run Tests" to verify backend integration</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      result.status === 'pass' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {result.status === 'pass' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{result.endpoint}</h3>
                        <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                        {result.error && (
                          <p className="text-xs text-red-600 mt-1 font-mono">{result.error}</p>
                        )}
                        {result.data && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer">View details</summary>
                            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Integration Checklist</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>CORS configured for localhost:3000</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>All API endpoints match backend routes</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Authentication token handling</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Error handling and 401 redirects</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Request/response interceptors configured</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
