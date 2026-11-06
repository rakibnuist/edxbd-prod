import { universityProfileLogo } from '@/lib/university-profile-assets';
import { getUniversityResearch } from '@/lib/university-research';
import { getUniversityRankings } from '@/lib/university-rankings';
import { getUniversityProfileDetails } from '@/lib/university-profile-details';
import { getPublicTrustRecords } from '@/lib/trust-records';
import { intakeMonths } from '@/lib/university-directory';
import { prepareUniversityScholarship } from '@/lib/university-profile-public';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { profilePrograms, programMergeKey, recordPrograms } from '@/lib/university-profile-view';
import { universitySearchIdentity, universityProfileFaq, universityFaqStructuredData } from '@/lib/university-profile-seo';
import { evergreenText, prepareUniversityProfile, prepareUniversityPrograms } from '@/lib/university-profile-public';
import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityProgramDetail } from '@/types/university-profile';
import UniversityProfileClient from './UniversityProfileClient';
import { getPublishedUpdates } from '@/lib/content-records';
import type { UpdateCardData } from '@/components/updates/UpdateCard';
import { requestTime } from '@/lib/update-deadlines';

/** Posts that link to this profile or name the university in the title. */
async function universityNews(university: CleanUniversityRecord): Promise<UpdateCardData[]> {
  try {
    const names = [university.name, ...university.aliases.filter(alias => alias.length >= 4)].map(name => name.toLowerCase());
    const link = `/universities/${university.slug}"`;
    const updates = await getPublishedUpdates(undefined, false);
    return updates
      .filter(update => !update.archived && (update.content.includes(link) || names.some(name => update.title.toLowerCase().includes(name))))
      .slice(0, 6)
      .map(({ slug, title, excerpt, featuredImage, category, categories, deadlineAt, publishedAt, createdAt }) => ({ slug, title, excerpt, featuredImage, category, categories, deadlineAt, publishedAt, createdAt }));
  } catch {
    return [];
  }
}

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
  const [researchRows, rankings, details, trust, news] = await Promise.all([
    getUniversityResearch(), getUniversityRankings(university.slug), getUniversityProfileDetails(university.slug), getPublicTrustRecords(), universityNews(university),
  ]);
  const research = researchRows.find(row => row.slug === university.slug);
  const publicDetails = details ? prepareUniversityProfile(details) : undefined;
  const packages = trust.servicePackages.filter(item => item.destination.toLowerCase() === university.country.toLowerCase());
  const legacyAwards: UniversityScholarshipOption[] = university.scholarships.map<UniversityScholarshipOption>((award, index) => ({
    id: `${university.slug}-recorded-${index}`, title: award.title, type: award.type || 'University funding route',
    levels: [], coverage: [award.coverage, award.amount].filter((value): value is string => Boolean(value)),
    conditions: [...award.details, ...(award.condition ? [award.condition] : [])],
    renewal: award.renewal ? [award.renewal] : [], documents: [], applicationSteps: [],
    status: award.status === 'closed' ? 'closed' : 'confirm',
    notes: ['Confirm the award conditions and eligible programs before including a reduction in your budget.'],
  })).map(prepareUniversityScholarship);
  const extraRecordPrograms = () => {
    const known = new Set(publicDetails!.programs.map(program => programMergeKey(program.level, program.name)));
    return prepareUniversityPrograms(recordPrograms(university, research?.fees))
      .filter(program => !known.has(programMergeKey(program.level, program.name)))
      .map(program => ({ ...program, id: program.id.replace(`${university.slug}-`, `${university.slug}-r`) }));
  };
  const publicPrograms = shareProgramFields(publicDetails?.programs.length
    ? [...publicDetails.programs, ...extraRecordPrograms()]
    : prepareUniversityPrograms(profilePrograms(university, details, research?.fees)));
  const logo = universityProfileLogo(university);
  const scholarshipOptions = publicDetails?.scholarshipOptions?.length ? publicDetails.scholarshipOptions : legacyAwards;
  const profileIntakeMonths = intakeMonths(details?.programs.length ? details.programs.flatMap(program => program.intake ? [program.intake] : []) : university.programs.length ? university.programs.flatMap(program => program.intakes) : university.intake);
  // One FAQ source of truth: the same items render visibly and in FAQPage
  // structured data, so assistants and the page can never disagree.
  const faq = universityProfileFaq(university, publicPrograms, {
    intakeMonths: profileIntakeMonths,
    scholarshipOptions: scholarshipOptions.map(option => ({ title: option.title, coverage: option.coverage })),
    rankings: rankings.map(({ publisher, rank, scope }) => ({ publisher, rank, scope })),
  });
  const faqSchema = universityFaqStructuredData(university, faq, `https://eduexpressint.com/universities/${university.slug}`);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
    <UniversityProfileClient
    faq={faq}
    news={news}
    now={requestTime()}
    university={{
      name: university.name, slug: university.slug, city: university.city, country: university.country, logo,
      location: university.location,
      scholarships: details?.programs.length ? [] : university.scholarships.map(item => ({
        title: evergreenText(item.title), type: item.type, details: item.details.map(evergreenText).filter(Boolean),
        amount: item.amount ? evergreenText(item.amount) : undefined, condition: item.condition ? evergreenText(item.condition) : undefined,
        eligiblePrograms: item.eligiblePrograms.map(evergreenText), coverage: item.coverage ? evergreenText(item.coverage) : undefined,
        renewal: item.renewal ? evergreenText(item.renewal) : undefined, status: item.status,
      })),
    }}
    overview={publicDetails?.overview || evergreenText(research?.overview || `${university.name} is located in ${university.city}, ${university.country}. Explore its listed study options and compare program requirements, fees and available support.`)}
    highlights={publicDetails?.highlights?.length ? publicDetails.highlights : (research?.facts || []).filter(([title]) => !/window|deadline|cycle|intake|rank|statistic/i.test(title)).map(([title, description]) => ({ title: evergreenText(title), description: evergreenText(description) })).filter(item => item.title && item.description)}
    intakeMonths={profileIntakeMonths}
    campusImage={university.slug === 'nuist' ? { src: '/images/universities/nuist-campus.webp', alt: 'NUIST campus building and meteorological radar dome in Nanjing' } : undefined}
    generalDetails={{
      majors: university.details.majors.map(evergreenText).filter(Boolean),
      degrees: university.degree.map(evergreenText).filter(Boolean),
      languages: university.taught.map(evergreenText).filter(Boolean),
      tuition: evergreenText(university.details.tuition),
      documents: university.documents.map(evergreenText).filter(Boolean),
      fees: university.fees.map(fee => ({ item: evergreenText(fee.item), cost: evergreenText(fee.cost), notes: fee.notes ? evergreenText(fee.notes) : undefined })),
    }}
    shortName={universitySearchIdentity(university).shortName}
    displayName={universitySearchIdentity(university).displayName}
    scholarshipOptions={scholarshipOptions}
    programs={publicPrograms}
    hasDetailedPrograms={Boolean(details?.programs.length)}
    rankings={rankings.map(({ publisher, rankingName, year, rank, scope, subject, note }) => ({ publisher, rankingName: evergreenText(rankingName), year, rank, scope, subject, note: note ? evergreenText(note) : undefined }))}
    servicePackages={packages.map(item => ({ title: item.title, priceLabel: item.priceLabel, summary: item.summary }))}
  />;</>
}
