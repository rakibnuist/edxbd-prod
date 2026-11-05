import { buildLlmsFull } from '@/lib/machine-readable';

// Full plain-text reference for AI assistants (complements /llms.txt).
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildLlmsFull(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
