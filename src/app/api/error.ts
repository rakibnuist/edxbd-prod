import { NextResponse } from 'next/server';

const notFoundResponse = () =>
  NextResponse.json(
    {
      error: 'API endpoint not found',
      message: 'The requested API endpoint does not exist',
    },
    { status: 404, headers: { 'Cache-Control': 'no-store' } }
  );

export async function GET() {
  return notFoundResponse();
}

export async function POST() {
  return notFoundResponse();
}
