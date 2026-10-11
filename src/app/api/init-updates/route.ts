import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Legacy sample updates are disabled. Create sourced and approved updates in Admin.' },
    { status: 410 },
  );
}
