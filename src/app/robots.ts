import { MetadataRoute } from 'next';

// PHASE 0 FIX:
// - sitemap URL moved to apex domain (www redirects)
// - AI/LLM crawlers explicitly allowed so ChatGPT, Claude, Perplexity,
//   Gemini etc. can read and cite the site
export default function robots(): MetadataRoute.Robots {
  const privatePaths = ['/admin/', '/dashboard/', '/login', '/api/', '/sitemap-submission'];
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      ...['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Amazonbot', 'cohere-ai', 'meta-externalagent', 'Bytespider']
        .map(userAgent => ({ userAgent, allow: '/', disallow: privatePaths })),
    ],
    sitemap: [
      'https://eduexpressint.com/sitemap.xml',
      'https://eduexpressint.com/sitemaps/pages.xml',
      'https://eduexpressint.com/sitemaps/countries.xml',
      'https://eduexpressint.com/sitemaps/guides.xml',
      'https://eduexpressint.com/sitemaps/universities.xml',
      'https://eduexpressint.com/sitemaps/success-stories.xml',
    ],
  };
}
