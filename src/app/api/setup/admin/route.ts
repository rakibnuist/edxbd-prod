import { NextResponse } from 'next/server';

const disabledResponse = () => NextResponse.json(
  { error: 'Public administrator setup is disabled.' },
  {
    status: 410,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
);

export async function GET() {
  return disabledResponse();
}

export async function POST() {
  return disabledResponse();
}
