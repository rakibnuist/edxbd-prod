import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Legacy conversion endpoint is disabled.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  );
}
