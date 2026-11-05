import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import UniversityProfile from '@/components/universities/UniversityProfile';
import { getUniversityRoute, getUniversityRouteSlugs } from '@/lib/university-records';
import { universityIsIndexable } from '@/lib/university-governance';
import { getUniversityProfileDetails } from '@/lib/university-profile-details';
import { profilePrograms } from '@/lib/university-profile-view';
import { prepareUniversityPrograms } from '@/lib/university-profile-public';
import { getIndexableUniversityGuides } from '@/lib/university-guide-publication';
import { universityProfileLogo } from '@/lib/university-profile-assets';
import { UNIVERSITY_SITE_URL, universityProfileSeo, universityProfileStructuredData } from '@/lib/university-profile-seo';

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getUniversityRoute(slug);
  if (!result) return { title: { absolute: 'University Record Not Found | EduExpress International' }, robots: { index: false, follow: true } };

  const university = result.record;
  const [details, guides] = await Promise.all([getUniversityProfileDetails(university.slug), getIndexableUniversityGuides()]);
  const { canonical, description, title } = universityProfileSeo(university, prepareUniversityPrograms(profilePrograms(university, details)));
  const indexable = guides.has(university.slug) || universityIsIndexable(university);

  return {
    title: { absolute: `${title} | EduExpress International` },
    description,
    alternates: { canonical },
    robots: { index: indexable, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'EduExpress International',
      images: [{ url: `${UNIVERSITY_SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: `${university.name} study guide` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${UNIVERSITY_SITE_URL}/og-image.jpg`] },
  };
}

export default async function UniversityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getUniversityRoute(slug);
  if (!result) notFound();
  if (result.isLegacySlug) permanentRedirect(`/universities/${result.record.slug}`);

  const university = result.record;
  const details = await getUniversityProfileDetails(university.slug);
  const structuredData = universityProfileStructuredData({ ...university, logo: universityProfileLogo(university) }, prepareUniversityPrograms(profilePrograms(university, details)));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <UniversityProfile university={university} />
    </>
  );
}
