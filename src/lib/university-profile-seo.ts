import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityProgramDetail } from '@/types/university-profile';

export const UNIVERSITY_SITE_URL = 'https://eduexpressint.com';

type UniversityIdentity = Pick<CleanUniversityRecord, 'name' | 'slug' | 'city' | 'country' | 'aliases' | 'logo'>;

/** Prefer a recorded acronym. Never manufacture an alias from a URL or initials. */
export function universitySearchIdentity(university: Pick<UniversityIdentity, 'name' | 'aliases'>) {
  const acronym = university.aliases.find(alias => /^[A-Z][A-Z\d&.-]{1,11}$/.test(alias.trim()))?.trim();
  const displayName = acronym && !new RegExp(`\\b${acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(university.name)
    ? `${university.name} (${acronym})`
    : university.name;
  return { acronym, shortName: acronym || university.name, displayName };
}

export function universityProfileSeo(university: UniversityIdentity) {
  const identity = universitySearchIdentity(university);
  // A long official name belongs in the H1 and description; its genuine acronym
  // makes a readable search title without repeating a long list of keywords.
  const titleName = identity.acronym && identity.displayName.length > 50 ? identity.acronym : identity.displayName;
  const title = `${titleName}: Fees, Scholarships & Programs`;
  const description = `Study at ${identity.displayName} in ${university.city}, ${university.country}. Explore majors, tuition fees, scholarships, admission requirements and university rankings.`;
  return { ...identity, title, description, canonical: `${UNIVERSITY_SITE_URL}/universities/${university.slug}` };
}

/** Shared semantic graph. Course facts come from the same catalogue the page renders. */
export function universityProfileStructuredData(university: UniversityIdentity, programs: UniversityProgramDetail[]) {
  const seo = universityProfileSeo(university);
  const universityId = `${seo.canonical}#university`;
  const seen = new Set<string>();
  const courses = programs.filter(program => {
    const key = `${program.level}|${program.name}|${program.languages.join('|')}|${program.duration}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(program => ({
    '@type': 'Course',
    '@id': `${seo.canonical}#course-${encodeURIComponent(program.id)}`,
    name: program.name,
    educationalLevel: program.level,
    ...(program.languages.length ? { inLanguage: program.languages } : {}),
    provider: { '@id': universityId },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${seo.canonical}#page`,
        url: seo.canonical,
        name: seo.title,
        description: seo.description,
        inLanguage: 'en-BD',
        publisher: { '@id': `${UNIVERSITY_SITE_URL}/#organization` },
        mainEntity: { '@id': universityId },
        breadcrumb: { '@id': `${seo.canonical}#breadcrumb` },
      },
      {
        '@type': 'CollegeOrUniversity',
        '@id': universityId,
        name: university.name,
        alternateName: university.aliases,
        address: { '@type': 'PostalAddress', addressLocality: university.city, addressCountry: university.country },
        ...(university.logo ? { logo: new URL(university.logo, UNIVERSITY_SITE_URL).href } : {}),
        ...(courses.length ? { hasCourse: courses.map(course => ({ '@id': course['@id'] })) } : {}),
      },
      ...courses,
      {
        '@type': 'BreadcrumbList',
        '@id': `${seo.canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${UNIVERSITY_SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Universities', item: `${UNIVERSITY_SITE_URL}/universities` },
          { '@type': 'ListItem', position: 3, name: university.name, item: seo.canonical },
        ],
      },
    ],
  };
}
