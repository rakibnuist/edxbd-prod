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
  { kind: 'page', title: 'Proof library', href: '/proof-library', context: 'Redacted evidence, company records, CBCA Founding Member #08, FACD-CAB FACECAB FCM-452' },
  { kind: 'page', title: 'Fees and transparency', href: '/fees-and-transparency', context: 'Who receives each payment' },
  { kind: 'page', title: 'For parents and sponsors', href: '/for-parents', context: 'Costs, safety and responsibilities' },
  { kind: 'page', title: 'Education Consultant in Dhaka (CBCA & FACD-CAB Member)', href: '/education-consultant-dhaka', context: 'Dhanmondi head office, CBCA Founding Member #08, FACD-CAB FACECAB Member ID FCM-452' },
  { kind: 'page', title: 'B2B Partner Desk', href: '/b2b', context: 'Agency & sub-agent file processing, written SOP, CBCA Founding Member #08, FACD-CAB FACECAB FCM-452' },
  { kind: 'page', title: 'Contact the Dhanmondi office', href: '/contact', context: 'Address, hours, phone and WhatsApp' },
  {
    kind: 'page',
    title: 'Study in China after O-Level, SSC or Dakhil',
    href: '/study-in-china-after-o-level-ssc',
    context: '3+2 Diploma to Bachelor in 5 years after SSC, Dakhil or O-Level with Chinese scholarship tiers and guardian rules',
  },
  {
    kind: 'page',
    title: 'SSC ও দাখিলের পর চীনে ৩+২ ডিপ্লোমা (বাংলা)',
    href: '/bn/study-in-china-after-ssc-dakhil',
    context: 'ssc dakhil o level পর চীনে ৩+২ ডিপ্লোমা ও ব্যাচেলর ৫ বছরে স্কলারশিপ বাংলা গাইড',
  },
  {
    kind: 'page',
    title: 'Study in Malaysia after O-Level',
    href: '/study-in-malaysia-after-o-level',
    context: 'Skip 2 years of A-Level coaching with 1-year Foundation or 2-year Diploma in Malaysia at BDT 0 service fee',
  },
  {
    kind: 'page',
    title: 'China Bachelor vs UK, USA, Australia & Dhaka',
    href: '/compare-bachelor-china-abroad-bangladesh',
    context: 'A-Level HSC Alim post-school bachelor tuition scholarships vs NSU EWU AIUB and Western countries',
  },
  {
    kind: 'page',
    title: 'Bangladesh vs China Bachelor study',
    href: '/bangladesh-vs-china-bachelor-study',
    context: 'Head-to-head comparison of NSU EWU AIUB Dhaka private university fees vs ranked Chinese universities',
  },
  {
    kind: 'page',
    title: 'Study in Bangladesh vs Abroad',
    href: '/bangladesh-vs-study-abroad-countries',
    context: 'Compare 7 bachelor routes across Bangladesh, China, Malaysia, UK, Europe, USA, Australia and New Zealand',
  },
  {
    kind: 'page',
    title: 'Bangladesh Study Abroad Market 2027 Report',
    href: '/bangladesh-study-abroad-market',
    context: '12 active destinations, separated tuition and living costs, Student File rules, O-Level A-Level SSC HSC Alim pathways',
  },
  {
    kind: 'page',
    title: 'বিদেশে উচ্চশিক্ষা ২০২৭: বাংলাদেশ মার্কেট গাইড',
    href: '/bn/bangladesh-study-abroad-market',
    context: 'bangladesh study abroad market 2027 ১২টি দেশের খরচ স্টুডেন্ট ফাইল বাংলা গাইড',
  },
  {
    kind: 'guide',
    title: 'Study Gap Acceptable Countries for Bangladeshi Students (2027)',
    href: '/study-gap-acceptable-countries-bangladesh',
    context: '12-country study gap & age limit matrix for Bachelor, Master & PhD, TIN/tax certificate & work experience proof',
  },
  {
    kind: 'guide',
    title: 'Student Visa Bank Solvency & Bangladesh Bank Student File Guide',
    href: '/student-visa-bank-solvency-bangladesh',
    context: 'Compare required bank balance, 28-day to 6-month maturity rules, sponsor documents & FE Circular 37 across 12 countries',
  },
  {
    kind: 'guide',
    title: 'Study Abroad Without IELTS from Bangladesh (MOI Matrix)',
    href: '/study-abroad-without-ielts-from-bangladesh',
    context: 'Compare university Medium of Instruction (MOI) acceptance vs embassy visa language requirements across 12 countries',
  },
  {
    kind: 'guide',
    title: 'BMDC Recognized Medical Colleges Abroad & 45 China MOE List',
    href: '/bmdc-recognized-medical-colleges-abroad',
    context: 'BMDC Eligibility Certificate rules (SSC+HSC GPA 7.00, Biology 3.50), WDOMS/WFME, 45 Chinese MOE universities vs Georgia, Croatia & BD private MBBS',
  },
  {
    kind: 'guide',
    title: 'Document Attestation, MOFA e-Apostille & Notarization Guide',
    href: '/document-attestation-apostille-bangladesh',
    context: 'Education Board, Ministry of Education, UGC, MOFA myGov e-Apostille QR verification & Embassy legalization in Dhaka',
  },
  {
    kind: 'guide',
    title: 'Malaysia Scholarships for Bangladeshi Students',
    href: '/malaysia-scholarships-bangladesh',
    context: 'MTCP, MIS, Sunway, Taylor’s, APU & Monash Malaysia 10%–75% merit tuition waivers with BDT 0 EduExpress service fee',
  },
  {
    kind: 'guide',
    title: 'UK Scholarships for Bangladeshi Students',
    href: '/uk-scholarships-bangladesh',
    context: 'Chevening, Commonwealth, GREAT £10,000 awards & £2,000–£8,000 automatic CAS merit bursaries',
  },
  {
    kind: 'guide',
    title: 'Hungary Scholarships (Stipendium Hungaricum & SHED)',
    href: '/hungary-scholarships-bangladesh',
    context: 'Stipendium Hungaricum dual-portal DreamApply + SHED MoE Bangladesh nomination, 100% tuition waiver & HUF stipends',
  },
  {
    kind: 'guide',
    title: 'South Korea Scholarships (GKS, BK21 & University Waivers)',
    href: '/south-korea-scholarships-bangladesh',
    context: 'Global Korea Scholarship (GKS) Embassy vs University track, BK21 STEM professor lab stipends & 30%–100% TOPIK/IELTS tuition waivers',
  },
  {
    kind: 'guide',
    title: 'Finland Scholarships & UAS Early-Bird Waivers',
    href: '/finland-scholarships-bangladesh',
    context: 'Finland Scholarship (100% tuition + €5,000 relocation grant), 20%–50% UAS waivers & Migri €9,600 living fund requirement',
  },
  {
    kind: 'guide',
    title: 'UK Student Visa from Bangladesh (CAS & 28-Day Rule)',
    href: '/uk-student-visa-bangladesh',
    context: 'UKVI Student Route points, £13,347/£10,224 28-day bank maintenance, IOM TB certificate, IHS & VFS Dhaka',
  },
  {
    kind: 'guide',
    title: 'Hungary Student Visa from Bangladesh (Type D & Enter Hungary)',
    href: '/hungary-student-visa-bangladesh',
    context: 'Schengen Type D study visa, VFS Global Dhaka, EUR 5,000–7,000 bank solvency & NDGAP residence permit',
  },
  {
    kind: 'guide',
    title: 'South Korea Student Visa from Bangladesh (D-2 & D-4)',
    href: '/south-korea-student-visa-bangladesh',
    context: 'IEQAS CoA vs Standard track, USD 20,000 / 10,000 bank solvency, apostille & Korean Embassy Dhaka filing',
  },
  {
    kind: 'guide',
    title: 'Finland Student Residence Permit from Bangladesh (Migri €9,600)',
    href: '/finland-student-visa-bangladesh',
    context: 'Studyinfo.fi, Enter Finland portal, EUR 9,600/year sole student account rule & VFS New Delhi biometrics',
  },
  {
    kind: 'page',
    title: 'Abdullah Al Rakib — Founder & CEO Profile',
    href: '/author/abdullah-al-rakib',
    context: 'Founder & CEO of EduExpress International, PhD Researcher at NUIST Nanjing China, editorial governance & credentials',
  },
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
