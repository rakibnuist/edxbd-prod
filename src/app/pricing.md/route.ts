import { buildPricing } from '@/lib/machine-readable';

// Machine-readable pricing for AI agents comparing consultancies.
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildPricing(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
