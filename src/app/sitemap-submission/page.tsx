import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap Submission - EduExpress International',
  description: 'Submit your sitemap to major search engines including Google, Bing, and OpenAI for better website indexing and visibility.',
  robots: 'noindex, nofollow', // Don't index this page itself
}

export default function SitemapSubmissionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">
            🚀 Sitemap Submission for Search Engines
          </h1>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">📋 Your Sitemap Information</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-700">Sitemap URL:</p>
                <code className="block bg-gray-100 p-3 rounded text-sm break-all">
                  https://www.eduexpressint.com/sitemap.xml
                </code>
              </div>
              <div>
                <p className="font-medium text-gray-700">Robots.txt URL:</p>
                <code className="block bg-gray-100 p-3 rounded text-sm break-all">
                  https://www.eduexpressint.com/robots.txt
                </code>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Google Search Console */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">🔍 Google Search Console</h2>
              <p className="text-gray-600 mb-4">Submit your sitemap to Google for better indexing:</p>
              <a
                href="https://search.google.com/search-console/sitemaps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mr-4 mb-4"
              >
                Submit to Google
              </a>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <strong className="text-green-800">Instructions:</strong>
                <ol className="list-decimal list-inside text-green-700 mt-2 space-y-1">
                  <li>Go to Google Search Console</li>
                  <li>Select your property (eduexpressint.com)</li>
                  <li>Navigate to &quot;Sitemaps&quot; in the left menu</li>
                  <li>Add new sitemap: <code className="bg-green-100 px-1 rounded">sitemap.xml</code></li>
                  <li>Click &quot;Submit&quot;</li>
                </ol>
              </div>
            </div>

            {/* Bing Webmaster Tools */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">🔍 Bing Webmaster Tools</h2>
              <p className="text-gray-600 mb-4">Submit your sitemap to Bing for better visibility:</p>
              <a
                href="https://www.bing.com/webmasters/sitemaps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mr-4 mb-4"
              >
                Submit to Bing
              </a>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <strong className="text-green-800">Instructions:</strong>
                <ol className="list-decimal list-inside text-green-700 mt-2 space-y-1">
                  <li>Go to Bing Webmaster Tools</li>
                  <li>Sign in with your Microsoft account</li>
                  <li>Add your website if not already added</li>
                  <li>Go to &quot;Sitemaps&quot; section</li>
                  <li>Submit sitemap URL: <code className="bg-green-100 px-1 rounded">https://www.eduexpressint.com/sitemap.xml</code></li>
                </ol>
              </div>
            </div>

            {/* OpenAI GPT */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">🤖 OpenAI GPT (ChatGPT)</h2>
              <p className="text-gray-600 mb-4">Submit your sitemap to OpenAI for AI search indexing:</p>
              <a
                href="https://platform.openai.com/docs/plugins/sitemap"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mr-4 mb-4"
              >
                OpenAI Documentation
              </a>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <strong className="text-green-800">Instructions:</strong>
                <ol className="list-decimal list-inside text-green-700 mt-2 space-y-1">
                  <li>Visit OpenAI Platform documentation</li>
                  <li>Follow the sitemap submission guidelines</li>
                  <li>Ensure your content is properly structured</li>
                  <li>Use semantic HTML and clear content structure</li>
                </ol>
              </div>
            </div>

            {/* Additional Search Engines */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">🔍 Additional Search Engines</h2>
              <p className="text-gray-600 mb-4">Submit to other major search engines:</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://yandex.com/support/webmaster/sitemap/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Yandex Webmaster
                </a>
                <a
                  href="https://www.baidu.com/search/url_submit.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Baidu Submit
                </a>
                <a
                  href="https://www.duckduckgo.com/duckduckbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  DuckDuckGo
                </a>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">💡 Pro Tips</h3>
            <ul className="list-disc list-inside text-yellow-700 space-y-2">
              <li>Submit your sitemap regularly, especially after major content updates</li>
              <li>Monitor your search console for indexing status and errors</li>
              <li>Keep your sitemap updated with fresh content</li>
              <li>Use structured data markup for better search results</li>
              <li>Ensure all URLs in your sitemap return 200 status codes</li>
            </ul>
          </div>

          {/* Sitemap Statistics */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">📊 Sitemap Statistics</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-2">
              <li>Total pages: 50+ pages</li>
              <li>Country destinations: 9 countries</li>
              <li>Service pages: 7 services</li>
              <li>Update pages: Dynamic content</li>
              <li>Last updated: Auto-generated daily</li>
            </ul>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
