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
    return slugs.map(slug => ({ slug }));
  } catch (error) {
    console.warn('University static paths skipped because the database is unavailable:', error);
    return [];
  }
}

const descriptionFor = (name: string, city: string, country: string, degrees: string[]) => {
  const text = `Study in ${name} from Bangladesh for 2027 intake. Explore programs, tuition, scholarships, and admission documents. Bangladesh's Evidence-First Education Consultancy. ${city}, ${country}. ${degrees.join(', ')}.`;
  return text.length > 158 ? `${text.slice(0, 155).trimEnd()}…` : text;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getUniversityRoute(slug);
  if (!result) return { title: { absolute: 'University Record Not Found | EduExpress International' }, robots: { index: false, follow: true } };

  const university = result.record;
  const canonical = `${baseUrl}/universities/${university.slug}`;
  const description = descriptionFor(university.name, university.city, university.country, university.degree);
  const title = `Study in ${university.name} from Bangladesh (2027) | Fees & Scholarships`;

  return {
    title: { absolute: `${title} | EduExpress International` },
    description,
    keywords: [
      `study in ${university.name}`,
      `study in ${university.country} from Bangladesh`,
      `${university.name} tuition fees`,
      `${university.name} scholarship for Bangladeshi students`,
      `${university.name} admission`,
      'Bangladesh Evidence-First Education Consultancy'
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

export default async function UniversityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getUniversityRoute(slug);
  if (!result) notFound();
  if (result.isLegacySlug) permanentRedirect(`/universities/${result.record.slug}`);

  const university = result.record;
  const canonical = `${baseUrl}/universities/${university.slug}`;
  const faq = [
    [`Can Bangladeshi students apply to ${university.name}?`, `Bangladeshi students can complete an eligibility assessment that aligns the selected program with academic results, language preparation, age criteria and the upcoming intake.`],
    [`What is the tuition fee at ${university.name}?`, 'Each tuition amount is listed beside its exact program in the Study options section. The ClearCost Sheet then adds scholarship adjusted tuition and every additional fee before the student proceeds. Better Education. Clear Costs. Written Proof.'],
    [`Does ${university.name} offer scholarships?`, university.scholarships.length ? 'The Scholarship planner presents each recorded award once and matches its coverage, eligible programs, selection criteria and renewal terms to the student’s profile.' : 'Scholarship matching is completed after education fit, using the selected program, academic profile and current university options.'],
    [`What is the application deadline for ${university.name}?`, 'The Admission file shows the university deadline once. Seat availability and final submission timing are confirmed for the selected program before application.'],
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: `Study in ${university.name} from Bangladesh | Fees & Scholarships`,
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
