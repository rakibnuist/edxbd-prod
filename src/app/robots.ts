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
      // Named groups restate the wildcard for every AI search, user-fetch and
      // training crawler so no vendor default can treat the site as opted out.
      ...[
        // Search discovery (cited answers)
        'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'meta-webindexer', 'DuckAssistBot', 'Applebot', 'Bingbot', 'Googlebot',
        // User-triggered retrieval (someone asked an assistant about us)
        'ChatGPT-User', 'Claude-User', 'Perplexity-User', 'meta-externalfetcher', 'MistralAI-User',
        // Model training and grounding (being known to the model itself)
        'GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'Amazonbot', 'cohere-ai', 'meta-externalagent', 'CCBot', 'Bytespider',
      ].map(userAgent => ({ userAgent, allow: '/', disallow: privatePaths })),
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
