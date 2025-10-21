export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">✅ Deployment Test</h1>
        <p className="text-xl text-gray-600 mb-4">Your application is working correctly!</p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Timestamp: {new Date().toISOString()}</p>
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>Vercel: {process.env.VERCEL ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}
