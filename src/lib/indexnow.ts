/**
 * IndexNow API integration for real-time URL submission to search engines
 * Supports Bing, Yandex, and other IndexNow-compatible search engines
 */

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
              error: `${engine}: ${error.message}`
            }
          }
          return {
            engine,
            success: false,
            error: `${engine}: Unknown error`
          }
        }
      })
    )

    // Process results
    const errors: string[] = []
    submissions.forEach((result, _index) => {
      if (result.status === 'rejected') {
        errors.push(`Submission failed: ${result.reason}`)
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
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      errors: [error instanceof Error ? error.message : 'Unknown error']
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
    '/your-study-journey',
    '/scholarships',
    '/services',
    '/updates',
    '/about',
    '/partnership',
    '/contact',
    '/study-in-china-from-bangladesh',
    '/china-universities',
    '/china-scholarships-bangladesh',
    '/china-student-visa-bangladesh',
    '/study-in-china-cost-bangladesh',
    '/study-in-uk-from-bangladesh',
    '/study-in-hungary-from-bangladesh',
    '/study-in-south-korea-from-bangladesh',
    '/study-in-finland-from-bangladesh',
    '/study-in-malaysia-from-bangladesh',
    '/study-in-malta-from-bangladesh',
    '/study-in-cyprus-from-bangladesh',
    '/study-in-georgia-from-bangladesh',
    '/study-in-greece-from-bangladesh',
    '/study-in-croatia-from-bangladesh',
    '/study-in-thailand-from-bangladesh',
    '/proof-library',
    '/education-fit-assessment'
  ]

  return submitToIndexNow(importantPages)
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
