import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityProgramDetail } from '@/types/university-profile';
import { normalizeProgramLevel, programFeePreviews, PROGRAM_LEVEL_LABELS } from '@/lib/university-profile-view';

export const UNIVERSITY_SITE_URL = 'https://eduexpressint.com';

type UniversityIdentity = Pick<CleanUniversityRecord, 'name' | 'slug' | 'city' | 'country' | 'aliases' | 'logo'>;

export type UniversityFaqItem = { question: string; answer: string };

export type UniversityFaqFacts = {
  /** Calendar months parsed from recorded program intakes. */
  intakeMonths?: string[];
  /** Documented funding options, used only for a count and one example. */
  scholarshipOptions?: { title: string; coverage?: string[] }[];
  /** Publisher ranking records, phrased without edition years. */
  rankings?: { publisher: string; rank: string; scope: 'world' | 'national' | 'subject' }[];
};

/** Q&A-shaped facts for assistants and search engines. Every answer states
 *  only what the page itself renders from CMS-governed fields; scholarship
 *  wording follows the education-fit-first rule and nothing is guaranteed. */
export function universityProfileFaq(university: UniversityIdentity, programs: UniversityProgramDetail[] = [], facts: UniversityFaqFacts = {}): UniversityFaqItem[] {
  const identity = universitySearchIdentity(university);
  const feePreviews = programFeePreviews(programs);
  const languages = [...new Set(programs.flatMap(program => program.languages))];
  const items: UniversityFaqItem[] = [
    {
      question: `Where is ${university.name}?`,
      answer: `${university.name} is located in ${university.city}, ${university.country}.`,
    },
    {
      question: `What are the tuition fees at ${identity.shortName}?`,
      answer: feePreviews.length
        ? `${feePreviews.map(fee => `${PROGRAM_LEVEL_LABELS[fee.level]}: ${fee.amount} ${fee.period}`).join('; ')}. These are tuition amounts before scholarship. Accommodation and other required costs are separate.`
        : 'Tuition depends on the selected degree and course. Use the program list and fee section to plan the full cost with EduExpress.',
    },
    {
      question: `Can I study in English at ${identity.shortName}?`,
      answer: languages.some(language => /english/i.test(language))
        ? 'The catalogue includes English-taught options. Each program lists its teaching language, and the admission section explains the English evidence required for the degree.'
        : 'Check the teaching language for your chosen course in the program list. Our counselors can help match your language preparation to a suitable route.',
    },
  ];
  if (facts.intakeMonths?.length) {
    items.push({
      question: `Which intake months are listed for ${identity.shortName}?`,
      answer: `Current records list ${facts.intakeMonths.join(' and ')} intakes. Each program shows its own intake details, and a counselor confirms the cycle that fits your file.`,
    });
  }
  if (facts.scholarshipOptions?.length) {
    const first = facts.scholarshipOptions[0];
    const example = first.coverage?.[0] || first.title;
    items.push({
      question: `What scholarship options are documented at ${identity.shortName}?`,
      answer: `${facts.scholarshipOptions.length} documented scholarship option${facts.scholarshipOptions.length === 1 ? ' is' : 's are'} listed on this profile, including ${example}. Scholarship fit is assessed after education fit, and an award is never guaranteed.`,
    });
  }
  if (facts.rankings?.length) {
    const publishers = [...new Set(facts.rankings.map(ranking => ranking.publisher))];
    const best = facts.rankings.find(ranking => ranking.scope === 'world') || facts.rankings.find(ranking => ranking.scope === 'national') || facts.rankings[0];
    items.push({
      question: `Is ${identity.shortName} ranked by international publishers?`,
      answer: `Yes. This profile lists published ranking records from ${publishers.join(' and ')}, with a best listed position of ${best.rank}. Rankings measure research and teaching reputation — compare your subject, degree recognition and entry requirements alongside them.`,
    });
  }
  items.push({
    question: 'How do I apply from Bangladesh?',
    answer: 'Choose a program, review its admission documents and ask EduExpress International for a personal eligibility and cost plan. A counselor reviews your academic background and guides your application preparation. The university makes the admission decision.',
  });
  return items;
}

/** Mirrors universityProfileFaq so the structured data always matches the page. */
export function universityFaqStructuredData(university: Pick<UniversityIdentity, 'slug'>, faq: UniversityFaqItem[], canonical: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      '@id': `${canonical}#faq-${encodeURIComponent(item.question.slice(0, 60))}`,
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Prefer a recorded acronym. Never manufacture an alias from a URL or initials. */
export function universitySearchIdentity(university: Pick<UniversityIdentity, 'name' | 'aliases'>) {
  const acronym = university.aliases.find(alias => /^[A-Z][A-Z\d&.-]{1,11}$/.test(alias.trim()))?.trim();
  const displayName = acronym && !new RegExp(`\\b${acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(university.name)
    ? `${university.name} (${acronym})`
    : university.name;
  return { acronym, shortName: acronym || university.name, displayName };
}

export function universityProfileSeo(university: UniversityIdentity, programs: UniversityProgramDetail[] = []) {
  const identity = universitySearchIdentity(university);
  // Name searches need the actual institution identity, including for long names.
  // Do not replace a university's full name with its acronym or stuff the title.
  const medical = programs.find(program => /\bMBBS\b|clinical medicine|ophthalmological and optometric medicine/i.test(program.name));
  const medicalLabel = medical && /\bMBBS\b/i.test(medical.name) ? 'MBBS' : medical ? 'Medicine' : '';
  const title = `${identity.displayName}: ${medicalLabel ? `${medicalLabel}, ` : ''}Fees & Scholarships`;
  const tuition = programs.find(program => /bachelor/i.test(program.level))?.fees.find(fee => fee.key === 'tuition' && fee.amount !== undefined && !fee.optional);
  const tuitionText = tuition ? ` Bachelor's tuition: ${tuition.currency} ${tuition.amount!.toLocaleString('en-US')}/${({ year: 'year', semester: 'semester', programme: 'program', month: 'month', day: 'day', oneoff: 'one-time' })[tuition.period]}.` : '';
  const programmeText = medical ? ` ${medical.name}: ${medical.duration}, ${medical.languages.join(' / ')}.` : '';
  const description = `Explore ${identity.displayName} in ${university.city}, ${university.country}.${programmeText}${tuitionText} Programs, scholarships and admission guidance for students from Bangladesh.`;
  return { ...identity, title, description, canonical: `${UNIVERSITY_SITE_URL}/universities/${university.slug}` };
}

/** Shared semantic graph. Course facts come from the same catalogue the page renders. */
export function universityProfileStructuredData(university: UniversityIdentity & Pick<CleanUniversityRecord, 'officialUrl' | 'sourceUrls'>, programs: UniversityProgramDetail[]) {
  const seo = universityProfileSeo(university, programs);
  const universityId = `${seo.canonical}#university`;
  // Corroboration links: the university's own site plus recorded official
  // sources (provincial departments, publishers). Internal URLs are excluded.
  const sameAsList = [university.officialUrl, ...university.sourceUrls]
    .filter((url): url is string => Boolean(url && /^https:\/\//i.test(url)))
    .filter(url => !url.includes(UNIVERSITY_SITE_URL))
    .filter((url, index, list) => list.indexOf(url) === index);
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
        hasPart: [
          ['overview', 'University overview'], ['programs', 'Programs and tuition'],
          ['scholarships', 'Scholarship options'], ['fees', 'Fees and ClearCost'],
          ['admission', 'Admission requirements'], ['documents', 'Application documents'], ['rankings', 'Published university rankings'],
        ].map(([id, name]) => ({ '@type': 'WebPageElement', '@id': `${seo.canonical}#${id}`, name, url: `${seo.canonical}#${id}` })),
      },
      {
        '@type': 'CollegeOrUniversity',
        '@id': universityId,
        name: university.name,
        alternateName: university.aliases,
        url: seo.canonical,
        ...(sameAsList.length ? { sameAs: sameAsList } : {}),
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
