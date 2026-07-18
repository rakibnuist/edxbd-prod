import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import University from '@/models/University';
import UniversitiesClient from './UniversitiesClient';
import type { IUniversity } from '@/types/university';

// PHASE 0 FIX: universities are now fetched on the SERVER and passed to the
// client component, so all university names, locations, majors, and tuition
// info are present in the HTML for Google and AI crawlers (previously the
// HTML said "Showing 0 universities").
// ISR: regenerated at most every hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Partner Universities & Scholarships',
  description:
    'Browse 150+ partner universities in China, South Korea, UK, Hungary, Finland, Cyprus, Croatia, Malaysia and Georgia. Compare tuition, majors, intakes, and scholarship opportunities for Bangladeshi students.',
  alternates: {
    // PHASE 0 FIX: per-page canonical (was inheriting the homepage canonical
    // from the root layout, which told Google to ignore this page)
    canonical: '/universities',
  },
  openGraph: {
    title: 'Partner Universities & Scholarships | EduExpress International',
    description:
      'Browse 150+ partner universities across 9 countries. Compare tuition, majors, intakes, and scholarships.',
    type: 'website',
    url: '/universities',
  },
};

async function getUniversities(): Promise<IUniversity[]> {
  try {
    await connectDB();
    const universities = await University.find({ isActive: true })
      .sort({ name: 1 })
      .lean();
    // Serialize Mongoose documents (ObjectId, Date) for the client component
    return JSON.parse(JSON.stringify(universities));
  } catch (error) {
    console.error('Error fetching universities server-side:', error);
    // Fall back to empty — the client component will fetch from the API instead
    return [];
  }
}

export default async function PartnershipUniversitiesPage() {
  const universities = await getUniversities();
  return <UniversitiesClient initialUniversities={universities} />;
}
