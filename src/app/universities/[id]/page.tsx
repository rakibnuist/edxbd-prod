import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import UniversityProfile from '@/components/universities/UniversityProfile';
import { getUniversityRoute, getUniversityRouteSlugs } from '@/lib/university-records';

const baseUrl = 'https://eduexpressint.com';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getUniversityRouteSlugs();
    return slugs.map(id => ({ id }));
  } catch (error) {
    console.warn('University static paths skipped because the database is unavailable:', error);
    return [];
  }
}

const descriptionFor = (name: string, city: string, country: string, degrees: string[]) => {
  const text = `Explore ${name} programs, 2027 tuition, scholarships, admission documents and education fit for students from Bangladesh. ${city}, ${country}. ${degrees.join(', ')}.`;
  return text.length > 158 ? `${text.slice(0, 155).trimEnd()}…` : text;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getUniversityRoute(id);
  if (!result) return { title: { absolute: 'University Record Not Found | EduExpress International' }, robots: { index: false, follow: true } };

  const university = result.record;
  const canonical = `${baseUrl}/universities/${university.slug}`;
  const description = descriptionFor(university.name, university.city, university.country, university.degree);
  const title = `${university.name}: Programs, Tuition & Scholarships 2027`;

  return {
    title: { absolute: `${title} | EduExpress International` },
    description,
    keywords: [
      university.name,
      `${university.name} tuition fees`,
      `${university.name} scholarship`,
      `${university.name} admission for Bangladeshi students`,
      `study in ${university.country} from Bangladesh`,
    ],
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'EduExpress International',
      images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: `${university.name} study option record` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${baseUrl}/og-image.jpg`] },
  };
}

export default async function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getUniversityRoute(id);
  if (!result) notFound();
  if (result.isLegacySlug) permanentRedirect(`/universities/${result.record.slug}`);

  const university = result.record;
  const canonical = `${baseUrl}/universities/${university.slug}`;
  const faq = [
    [`Can Bangladeshi students apply to ${university.name}?`, `Bangladeshi students can complete an eligibility assessment that aligns the selected program with academic results, language preparation, age criteria and the 2027 intake.`],
    [`What is the tuition fee at ${university.name}?`, 'Each tuition amount is listed beside its exact program in the Study options section. The ClearCost Sheet then adds scholarship adjusted tuition and every additional fee before the student proceeds.'],
    [`Does ${university.name} offer scholarships?`, university.scholarships.length ? 'The Scholarship planner presents each recorded award once and matches its coverage, eligible programs, selection criteria and renewal terms to the student’s profile.' : 'Scholarship matching is completed after education fit, using the selected program, academic profile and current university options.'],
    [`What is the 2027 deadline for ${university.name}?`, 'The Admission file shows the university deadline once. Seat availability and final submission timing are confirmed for the selected program before application.'],
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: `${university.name}: Programs, Tuition & Scholarships 2027`,
        description: descriptionFor(university.name, university.city, university.country, university.degree),
        inLanguage: 'en-BD',
        dateModified: university.updatedAt,
        publisher: { '@id': `${baseUrl}/#organization` },
        reviewedBy: { '@id': `${baseUrl}/#organization` },
        mainEntity: { '@id': `${canonical}#university` },
      },
      {
        '@type': 'CollegeOrUniversity',
        '@id': `${canonical}#university`,
        name: university.name,
        alternateName: university.aliases,
        address: { '@type': 'PostalAddress', addressLocality: university.city, addressCountry: university.country },
        ...(university.logo ? { logo: university.logo } : {}),
        ...(university.officialUrl ? { sameAs: university.officialUrl } : {}),
        hasCourse: university.programs.map(program => ({
          '@type': 'Course',
          name: program.name,
          educationalLevel: program.level,
          inLanguage: program.languages,
          provider: { '@id': `${canonical}#university` },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Universities', item: `${baseUrl}/universities` },
          ...(university.country.toLowerCase() === 'china' ? [{ '@type': 'ListItem', position: 3, name: 'China universities', item: `${baseUrl}/china-universities` }] : []),
          { '@type': 'ListItem', position: university.country.toLowerCase() === 'china' ? 4 : 3, name: university.name, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <UniversityProfile university={university} />
    </>
  );
}
