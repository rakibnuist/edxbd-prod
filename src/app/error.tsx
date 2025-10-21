'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Application error:', error);
    
    // Log error details for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. This might be a temporary issue.
        </p>
        
        {/* Error details for debugging */}
        <details className="mb-6 text-left bg-gray-100 p-4 rounded-lg">
          <summary className="cursor-pointer font-semibold text-gray-700">
            Error Details (for debugging)
          </summary>
          <div className="mt-2 text-sm text-gray-600">
            <p><strong>Message:</strong> {error.message}</p>
            <p><strong>Type:</strong> {error.name}</p>
            {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
          </div>
        </details>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Home
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
