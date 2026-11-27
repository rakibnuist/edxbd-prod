/**
 * IndexNow API integration for real-time URL submission to search engines
 * Supports Bing, Yandex, and other IndexNow-compatible search engines
 */

import { logAndFormatServerError } from './api-error'

const INDEXNOW_API_KEY = '9303d37873c94ab5a25637e6d1ad9ece'
const BASE_URL = 'https://eduexpressint.com'

// IndexNow endpoints for different search engines
const INDEXNOW_ENDPOINTS = {
  bing: 'https://api.indexnow.org/indexnow',
  // Temporarily disable problematic endpoints that might cause DNS issues
  // yandex: 'https://yandex.com/indexnow',
  // seznam: 'https://search.seznam.cz/indexnow',
  indexnow: 'https://api.indexnow.org/indexnow'
}

interface IndexNowResponse {
  success: boolean
  message: string
  submittedUrls?: string[]
  errors?: string[]
}

/**
 * Submit URLs to IndexNow-compatible search engines
 * @param urls - Array of URLs to submit
 * @param keyLocation - Optional custom key location
 * @returns Promise with submission results
 */
export async function submitToIndexNow(
  urls: string[],
  keyLocation?: string
): Promise<IndexNowResponse> {
  // Skip IndexNow calls in development, build time, or if no URLs provided
  if (process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' ||
    !urls || urls.length === 0) {
    return {
      success: true,
      message: 'IndexNow submission skipped during build',
      submittedUrls: urls || [],
      errors: []
    }
  }

  try {
    // Ensure URLs are absolute
    const absoluteUrls = urls.map(url =>
      url.startsWith('http') ? url : `${BASE_URL}${url}`
    )

    // Prepare the request body
    const requestBody = {
      host: 'eduexpressint.com',
      key: INDEXNOW_API_KEY,
      keyLocation: keyLocation || `${BASE_URL}/${INDEXNOW_API_KEY}.txt`,
      urlList: absoluteUrls
    }

    const results: IndexNowResponse = {
      success: true,
      message: 'URLs submitted successfully',
      submittedUrls: absoluteUrls,
      errors: []
    }

    // Submit to multiple IndexNow endpoints with timeout and better error handling
    const submissions = await Promise.allSettled(
      Object.entries(INDEXNOW_ENDPOINTS).map(async ([engine, endpoint]) => {
        try {
          // Add timeout to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
          })

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`${engine}: ${response.status} ${response.statusText}`)
          }

          return { engine, success: true }
        } catch (error) {
          // Handle different types of errors
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              return {
                engine,
                success: false,
                error: `${engine}: Request timeout`
              }
            }
            if (error.message.includes('DNS') || error.message.includes('ENOTFOUND')) {
              return {
                engine,
                success: false,
                error: `${engine}: DNS resolution failed`
              }
            }
            return {
              engine,
              success: false,
              error: `${engine}: Submission request failed`
            }
          }
          return {
            engine,
            success: false,
            error: `${engine}: Submission request failed`
          }
        }
      })
    )

    // Process results
    const errors: string[] = []
    submissions.forEach((result, _index) => {
      if (result.status === 'rejected') {
        errors.push('Submission failed')
      } else if (!result.value.success) {
        errors.push(`${result.value.engine}: ${result.value.error}`)
      }
    })

    if (errors.length > 0) {
      results.errors = errors
      results.message = `Submitted with ${errors.length} errors`
    }

    return results

  } catch (error) {
    const { errorId } = logAndFormatServerError('IndexNow submit', error, 'IndexNow submission failed')
    return {
      success: false,
      message: `IndexNow submission failed (${errorId})`,
      errors: [`IndexNow submission failed (${errorId})`]
    }
  }
}

/**
 * Submit a single URL to IndexNow
 * @param url - URL to submit
 * @returns Promise with submission result
 */
export async function submitSingleUrl(url: string): Promise<IndexNowResponse> {
  return submitToIndexNow([url])
}

/**
 * Submit multiple URLs in batches (recommended for large numbers)
 * @param urls - Array of URLs to submit
 * @param batchSize - Number of URLs per batch (default: 10,000)
 * @returns Promise with all submission results
 */
export async function submitUrlsInBatches(
  urls: string[],
  batchSize: number = 10000
): Promise<IndexNowResponse[]> {
  const results: IndexNowResponse[] = []

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)
    const result = await submitToIndexNow(batch)
    results.push(result)

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return results
}

/**
 * Submit all important pages of the website
 * @returns Promise with submission result
 */
export async function submitAllImportantPages(): Promise<IndexNowResponse> {
  const importantPages = [
    '/',
    '/find-education',
    '/destinations',
    '/universities',
    '/apply',
    '/programs',
    '/compare-costs',
    '/your-study-journey',
    '/scholarships',
    '/services',
    '/updates',
    '/updates/csca-guide-study-in-china',
    '/updates/china-k-visa',
    '/updates/complete-csc-universities-list-2027',
    '/updates/how-to-apply-csc-type-a-scholarship-complete-guide',
    '/about',
    '/press',
    '/for-parents',
    '/partnership',
    '/contact',
    '/education-consultant-dhaka',
    '/fees-and-transparency',
    '/how-we-verify-universities',
    '/better-education-standard',
    '/complaints-and-resolution',
    '/student-data-privacy',
    '/china-visa-first-policy',
    '/china-march-2027-intake',
    '/study-in-china-from-bangladesh',
    '/china-universities',
    '/china-scholarships-bangladesh',
    '/csc-scholarship-bangladesh',
    '/china-admission-requirements',
    '/china-student-visa-bangladesh',
    '/study-in-china-cost-bangladesh',
    '/study-in-china-without-ielts',
    '/mbbs-in-china-bangladesh',
    '/china-intakes-deadlines',
    '/life-in-china-bangladeshi-students',
    '/china-success-stories',
    '/success-stories',
    '/china-study-report-bangladesh',
    '/bangladesh-study-abroad-market',
    '/bn/bangladesh-study-abroad-market',
    '/compare-study-destinations',
    '/country-status',
    '/bn/study-in-china',
    '/bn/china-student-visa-bangladesh',
    '/bn/study-in-china-cost-bangladesh',
    '/bn/csc-scholarship-bangladesh',
    '/bn/mbbs-in-china-bangladesh',
    '/bn/csca-exam-bangladesh',
    '/bn/study-in-china-after-ssc-dakhil',
    '/study-in-malaysia-from-bangladesh',
    '/malaysia-study-cost-bangladesh',
    '/malaysia-student-visa-bangladesh',
    '/study-in-malaysia-after-o-level',
    '/study-in-china-after-o-level-ssc',
    '/compare-bachelor-china-abroad-bangladesh',
    '/bangladesh-vs-china-bachelor-study',
    '/bangladesh-vs-study-abroad-countries',
    '/study-in-uk-from-bangladesh',
    '/study-in-hungary-from-bangladesh',
    '/study-in-south-korea-from-bangladesh',
    '/study-in-finland-from-bangladesh',
    '/study-in-malta-from-bangladesh',
    '/study-in-cyprus-from-bangladesh',
    '/study-in-georgia-from-bangladesh',
    '/study-in-greece-from-bangladesh',
    '/study-in-croatia-from-bangladesh',
    '/study-in-thailand-from-bangladesh',
    '/uk-study-cost-bangladesh',
    '/finland-study-cost-bangladesh',
    '/hungary-study-cost-bangladesh',
    '/south-korea-study-cost-bangladesh',
    '/proof-library',
    '/education-fit-assessment'
  ]

  const dynamicPaths: string[] = [];
  try {
    const [
      { getIndexableUpdatesForSitemap },
      { getIndexableUniversitySitemapRecords },
      { chinaCities },
      { getUniversityRecords },
    ] = await Promise.all([
      import('@/lib/content-records'),
      import('@/lib/university-guide-publication'),
      import('@/lib/city-pages'),
      import('@/lib/university-records'),
    ]);

    const [updatesData, universities, chinaRecords] = await Promise.all([
      getIndexableUpdatesForSitemap(),
      getIndexableUniversitySitemapRecords(),
      getUniversityRecords('China'),
    ]);

    for (const u of universities) dynamicPaths.push(`/universities/${u.slug}`);
    for (const city of chinaCities(chinaRecords)) dynamicPaths.push(`/china-universities/${city.slug}`);
    for (const post of updatesData.updates) dynamicPaths.push(`/updates/${post.slug}`);
    for (const catSlug of updatesData.categorySlugs) dynamicPaths.push(`/updates/category/${catSlug}`);
  } catch {
    // Fall back gracefully to static importantPages if DB is unavailable (e.g. build/tests).
  }

  return submitToIndexNow(Array.from(new Set([...importantPages, ...dynamicPaths])))
}

/**
 * Submit new content (for use when new pages are published)
 * @param newUrls - Array of new URLs to submit
 * @returns Promise with submission result
 */
export async function submitNewContent(newUrls: string[]): Promise<IndexNowResponse> {
  console.log(`Submitting ${newUrls.length} new URLs to IndexNow...`)
  return submitToIndexNow(newUrls)
}

/**
 * Get IndexNow API key for manual submissions
 * @returns The API key
 */
export function getIndexNowApiKey(): string {
  return INDEXNOW_API_KEY
}

/**
 * Get the key location URL
 * @returns The key location URL
 */
export function getKeyLocation(): string {
  return `${BASE_URL}/${INDEXNOW_API_KEY}.txt`
}

/**
 * Tell IndexNow engines (Bing, Yandex and others) about a newly published or
 * edited update straight away. Fire-and-forget: a failure is logged and never
 * blocks the admin save.
 */
export function announcePublishedUpdate(slug: string) {
  const base = 'https://eduexpressint.com';
  void submitToIndexNow([`${base}/updates/${slug}`, `${base}/updates`, `${base}/`]).catch(error => {
    console.warn('IndexNow announcement failed:', error instanceof Error ? error.message : error);
  });
}
