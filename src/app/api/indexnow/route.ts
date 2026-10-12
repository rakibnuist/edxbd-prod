import { NextRequest, NextResponse } from 'next/server'
import { submitToIndexNow, submitAllImportantPages, submitNewContent } from '@/lib/indexnow'
import { isAdminRequest } from '@/lib/auth'
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body'

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Admin access is required.' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  try {
    const body = await readLimitedJson(request, 64 * 1024)
    const { urls, action = 'submit' } = body

    let result

    switch (action) {
      case 'submit-all':
        result = await submitAllImportantPages()
        break
      case 'submit-new':
        if (!urls || !Array.isArray(urls)) {
          return NextResponse.json(
            { error: 'URLs array is required for submit-new action' },
            { status: 400 }
          )
        }
        result = await submitNewContent(urls)
        break
      case 'submit':
      default:
        if (!urls || !Array.isArray(urls)) {
          return NextResponse.json(
            { error: 'URLs array is required' },
            { status: 400 }
          )
        }
        result = await submitToIndexNow(urls)
        break
    }

    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error)
    if (bodyError) return bodyError
    console.error('IndexNow API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed.' },
    { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store' } },
  )
}
