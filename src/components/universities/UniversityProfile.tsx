import { getUniversityResearch } from '@/lib/university-research';
import { getUniversityRankings } from '@/lib/university-rankings';
import { getUniversityProfileDetails } from '@/lib/university-profile-details';
import { getPublicTrustRecords } from '@/lib/trust-records';
import { profilePrograms } from '@/lib/university-profile-view';
import { universitySearchIdentity } from '@/lib/university-profile-seo';
import { evergreenText, prepareUniversityProfile, prepareUniversityPrograms } from '@/lib/university-profile-public';
import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityProgramDetail } from '@/types/university-profile';
import UniversityProfileClient from './UniversityProfileClient';

// Many majors share the same official checklist and fee table. Sharing these
// values lets React send one copy while preserving the full catalogue in HTML.
function shareProgramFields(programs: UniversityProgramDetail[]) {
  const values = new Map<string, unknown>();
  const share = <T,>(value: T): T => {
    const key = JSON.stringify(value);
    if (values.has(key)) return values.get(key) as T;
    values.set(key, value);
    return value;
  };
  return programs.map(program => ({
    ...program,
    languages: share(program.languages), qualifications: share(program.qualifications),
    languageRequirements: share(program.languageRequirements), documents: share(program.documents),
    fees: share(program.fees), notes: share(program.notes),
    ...(program.scholarships ? { scholarships: share(program.scholarships) } : {}),
  }));
}

export default async function UniversityProfile({ university }: { university: CleanUniversityRecord }) {
  const [researchRows, rankings, details, trust] = await Promise.all([
    getUniversityResearch(), getUniversityRankings(university.slug), getUniversityProfileDetails(university.slug), getPublicTrustRecords(),
  ]);
  const research = researchRows.find(row => row.slug === university.slug);
  const publicDetails = details ? prepareUniversityProfile(details) : undefined;
  const packages = trust.servicePackages.filter(item => item.destination.toLowerCase() === university.country.toLowerCase());
  return <UniversityProfileClient
    university={{
      name: university.name, slug: university.slug, city: university.city, country: university.country, logo: university.logo,
      location: university.location,
      scholarships: details?.programs.length ? [] : university.scholarships.map(item => ({
        title: evergreenText(item.title), type: item.type, details: item.details.map(evergreenText).filter(Boolean),
        amount: item.amount ? evergreenText(item.amount) : undefined, condition: item.condition ? evergreenText(item.condition) : undefined,
        eligiblePrograms: item.eligiblePrograms.map(evergreenText), coverage: item.coverage ? evergreenText(item.coverage) : undefined,
        renewal: item.renewal ? evergreenText(item.renewal) : undefined, status: item.status,
      })),
    }}
    overview={publicDetails?.overview || evergreenText(research?.overview || `${university.name} is located in ${university.city}, ${university.country}. Explore its listed study options and compare program requirements, fees and available support.`)}
    highlights={publicDetails?.highlights || []}
    campusImage={university.slug === 'nuist' ? { src: '/images/universities/nuist-campus.webp', alt: 'NUIST campus building and meteorological radar dome in Nanjing' } : undefined}
    shortName={universitySearchIdentity(university).shortName}
    displayName={universitySearchIdentity(university).displayName}
    scholarshipOptions={publicDetails?.scholarshipOptions || []}
    programs={shareProgramFields(publicDetails?.programs.length ? publicDetails.programs : prepareUniversityPrograms(profilePrograms(university, details, research?.fees)))}
    hasDetailedPrograms={Boolean(details?.programs.length)}
    rankings={rankings.map(({ publisher, rankingName, year, rank, scope, subject, note }) => ({ publisher, rankingName: evergreenText(rankingName), year, rank, scope, subject, note: note ? evergreenText(note) : undefined }))}
    servicePackages={packages.map(item => ({ title: item.title, priceLabel: item.priceLabel, summary: item.summary }))}
  />;
}
