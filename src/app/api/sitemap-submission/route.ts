import { NextResponse } from 'next/server'

export async function GET() {
  const sitemapUrl = 'https://eduexpressint.com/sitemap.xml'
  const robotsUrl = 'https://eduexpressint.com/robots.txt'
  
  const submissionLinks = {
    sitemap: {
      url: sitemapUrl,
      robots: robotsUrl,
      lastModified: new Date().toISOString(),
      totalPages: 50,
      countries: 9,
      services: 7
    },
    searchEngines: {
      google: {
        name: 'Google Search Console',
        url: 'https://search.google.com/search-console/sitemaps',
        instructions: [
          'Go to Google Search Console',
          'Select your property (eduexpressint.com)',
          'Navigate to "Sitemaps" in the left menu',
          'Add new sitemap: sitemap.xml',
          'Click "Submit"'
        ]
      },
      bing: {
        name: 'Bing Webmaster Tools',
        url: 'https://www.bing.com/webmasters/sitemaps',
        instructions: [
          'Go to Bing Webmaster Tools',
          'Sign in with your Microsoft account',
          'Add your website if not already added',
          'Go to "Sitemaps" section',
          'Submit sitemap URL: https://eduexpressint.com/sitemap.xml'
        ]
      },
      openai: {
        name: 'OpenAI GPT (ChatGPT)',
        url: 'https://platform.openai.com/docs/plugins/sitemap',
        instructions: [
          'Visit OpenAI Platform documentation',
          'Follow the sitemap submission guidelines',
          'Ensure your content is properly structured',
          'Use semantic HTML and clear content structure'
        ]
      },
      yandex: {
        name: 'Yandex Webmaster',
        url: 'https://yandex.com/support/webmaster/sitemap/',
        instructions: [
          'Go to Yandex Webmaster',
          'Add your website',
          'Submit sitemap URL'
        ]
      },
      baidu: {
        name: 'Baidu Submit',
        url: 'https://www.baidu.com/search/url_submit.html',
        instructions: [
          'Go to Baidu URL Submit',
          'Enter your sitemap URL',
          'Submit for indexing'
        ]
      },
      duckduckgo: {
        name: 'DuckDuckGo',
        url: 'https://www.duckduckgo.com/duckduckbot',
        instructions: [
          'DuckDuckGo crawls automatically',
          'Ensure your site is accessible',
          'Submit through their bot page'
        ]
      }
    },
    tips: [
      'Submit your sitemap regularly, especially after major content updates',
      'Monitor your search console for indexing status and errors',
      'Keep your sitemap updated with fresh content',
      'Use structured data markup for better search results',
      'Ensure all URLs in your sitemap return 200 status codes'
    ]
  }

  return NextResponse.json(submissionLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
