import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { universityProfileBrowserTitle } from '@/lib/university-profile-seo';
import { getUniversityRoute } from '@/lib/university-records';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = await getUniversityRoute(slug);
  if (!route) return { title: 'University Fees and Costs' };
  return {
    title: { absolute: universityProfileBrowserTitle(route.record, []) },
    description: `Compare program tuition, scholarship options and an itemized first year cost view for ${route.record.name}.`,
    alternates: { canonical: `/universities/${route.record.slug}` },
  };
}

export default async function UniversityClearCostRedirect({ params }: Props) {
  const { slug } = await params;
  const route = await getUniversityRoute(slug);
  if (!route) notFound();
  permanentRedirect(`/universities/${route.record.slug}#fees`);
}
