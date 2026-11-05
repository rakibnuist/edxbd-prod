import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { currentVisibleContentWhere } from '@/lib/content-governance';

export const revalidate = 300;

type SearchHit = {
  kind: 'university' | 'program' | 'guide' | 'page';
  title: string;
  href: string;
  context: string;
  meta?: string;
};

// A small, static index of the decision surfaces that are not database rows.
// Kept beside the query so the palette answers "where do I go next" as well as
// "which university is this".
const PAGE_INDEX: SearchHit[] = [
  { kind: 'page', title: 'University finder', href: '/universities', context: 'Filter 56 universities by destination, degree and intake' },
  { kind: 'page', title: 'Education Fit Assessment', href: '/education-fit-assessment', context: 'Turn your profile into a shortlist' },
  { kind: 'page', title: 'Cost of studying in China', href: '/study-in-china-cost-bangladesh', context: 'Tuition, hostel, insurance, visa and travel' },
  { kind: 'page', title: 'China scholarships', href: '/china-scholarships-bangladesh', context: 'Coverage, eligibility and renewal' },
  { kind: 'page', title: 'Student visa guide', href: '/china-student-visa-bangladesh', context: 'X1 and X2 document readiness' },
  { kind: 'page', title: 'Intakes and deadlines', href: '/china-intakes-deadlines', context: 'When each cycle opens and closes' },
  { kind: 'page', title: 'MBBS in China', href: '/mbbs-in-china-bangladesh', context: 'Medical programme routes and costs' },
  { kind: 'page', title: 'Destinations', href: '/destinations', context: 'Compare all active destination services' },
  { kind: 'page', title: 'Proof library', href: '/proof-library', context: 'Redacted evidence and company records' },
  { kind: 'page', title: 'Fees and transparency', href: '/fees-and-transparency', context: 'Who receives each payment' },
  { kind: 'page', title: 'For parents and sponsors', href: '/for-parents', context: 'Costs, safety and responsibilities' },
  { kind: 'page', title: 'Contact the Dhanmondi office', href: '/contact', context: 'Address, hours, phone and WhatsApp' },
];

const normalize = (value: string) => value.trim().toLowerCase();

export async function GET(request: NextRequest) {
  const query = normalize(new URL(request.url).searchParams.get('q') || '').slice(0, 80);

  if (query.length < 2) {
    return NextResponse.json({ hits: PAGE_INDEX.slice(0, 6), query });
  }

  try {
    const [universities, programs, content] = await Promise.all([
      prisma.university.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { city: { contains: query } },
            { country: { contains: query } },
            { aliases: { contains: query } },
          ],
        },
        select: { slug: true, name: true, city: true, country: true, degree: true },
        take: 8,
      }),
      prisma.program.findMany({
        where: { name: { contains: query }, status: 'active' },
        select: { name: true, level: true, university: { select: { slug: true, name: true, country: true } } },
        take: 5,
      }),
      prisma.content.findMany({
        where: {
          AND: [
            { type: { in: ['update', 'article'] } },
            currentVisibleContentWhere(),
            { OR: [{ title: { contains: query } }, { excerpt: { contains: query } }] },
          ],
        },
        select: { slug: true, title: true, excerpt: true, category: true },
        take: 5,
      }),
    ]);

    const hits: SearchHit[] = [
      ...universities.map(university => ({
        kind: 'university' as const,
        title: university.name,
        href: `/universities/${university.slug}`,
        context: [university.city, university.country].filter(Boolean).join(', '),
        meta: university.degree.split(',').slice(0, 2).join(' · '),
      })),
      ...programs.map(program => ({
        kind: 'program' as const,
        title: program.name,
        href: `/universities/${program.university.slug}#programs`,
        context: `${program.level} · ${program.university.name}`,
        meta: program.university.country,
      })),
      ...content.map(post => ({
        kind: 'guide' as const,
        title: post.title,
        href: `/updates/${post.slug}`,
        context: post.excerpt || 'Guide',
        meta: post.category || 'Advice',
      })),
      ...PAGE_INDEX.filter(page => normalize(`${page.title} ${page.context}`).includes(query)),
    ];

    return NextResponse.json({ hits: hits.slice(0, 14), query });
  } catch {
    const fallback = PAGE_INDEX.filter(page => normalize(`${page.title} ${page.context}`).includes(query));
    return NextResponse.json({ hits: fallback, query });
  }
}
