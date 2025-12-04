'use client';

import { useState, useEffect } from 'react';
import { healthAPI } from '@/lib/api';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    checkApiStatus();
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkApiStatus = async () => {
    try {
      const health = await healthAPI.check();
      setStatus('online');
      setDetails(health);
    } catch (error) {
      setStatus('offline');
      setDetails(null);
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      {status === 'checking' && (
        <>
          <Loader className="w-4 h-4 animate-spin text-gray-400" />
          <span className="text-gray-500">Checking API...</span>
        </>
      )}
      {status === 'online' && (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-600">API Connected</span>
        </>
      )}
      {status === 'offline' && (
        <>
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-600">API Offline</span>
        </>
      )}
    </div>
  );
}
