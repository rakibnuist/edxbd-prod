import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Legacy database initialization is disabled. Use the authenticated Admin publishing workflow.' },
    { status: 410 },
  );
}
