'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CountryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Country page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Country Page Error
        </h1>
        <p className="text-gray-600 mb-6">
          There was an error loading this country page. This might be due to an invalid country slug.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/destinations')}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            View All Destinations
          </button>
        </div>
      </div>
    </div>
  );
}
