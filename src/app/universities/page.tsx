import { Metadata } from 'next';
import UniversitiesClient from './UniversitiesClient';
import { getUniversityRecords } from '@/lib/university-records';

// PHASE 0 FIX: universities are now fetched on the SERVER and passed to the
// client component, so all university names, locations, majors, and tuition
// info are present in the HTML for Google and AI crawlers (previously the
// HTML said "Showing 0 universities").
// ISR: regenerated at most every hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Universities and Study Options',
  description:
    'Browse university and study-option records with program, fee, intake, recognition and relationship details subject to verification dates.',
  alternates: {
    // PHASE 0 FIX: per-page canonical (was inheriting the homepage canonical
    // from the root layout, which told Google to ignore this page)
    canonical: '/universities',
  },
  openGraph: {
    title: 'Universities and Study Options | EduExpress International',
    description:
      'Compare university records by education fit, recognition, costs and current verification status.',
    type: 'website',
    url: '/universities',
  },
};

async function getUniversities() {
  try {
    return await getUniversityRecords();
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
