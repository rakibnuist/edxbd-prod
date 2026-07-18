import { MetadataRoute } from 'next';

// PHASE 0 FIX:
// - sitemap URL moved to apex domain (www redirects)
// - AI/LLM crawlers explicitly allowed so ChatGPT, Claude, Perplexity,
//   Gemini etc. can read and cite the site
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/',
      },
      { userAgent: 'GPTBot', allow: '/', disallow: '/admin/' },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: '/admin/' },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: '/admin/' },
      { userAgent: 'ClaudeBot', allow: '/', disallow: '/admin/' },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: '/admin/' },
      { userAgent: 'Claude-User', allow: '/', disallow: '/admin/' },
      { userAgent: 'PerplexityBot', allow: '/', disallow: '/admin/' },
      { userAgent: 'Perplexity-User', allow: '/', disallow: '/admin/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/', disallow: '/admin/' },
      { userAgent: 'cohere-ai', allow: '/', disallow: '/admin/' },
      { userAgent: 'meta-externalagent', allow: '/', disallow: '/admin/' },
      { userAgent: 'Bytespider', allow: '/', disallow: '/admin/' },
    ],
    sitemap: 'https://eduexpressint.com/sitemap.xml',
  };
}
