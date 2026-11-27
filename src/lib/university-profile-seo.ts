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
  const levels = [...new Set(programs.map(program => PROGRAM_LEVEL_LABELS[normalizeProgramLevel(program.level)]))];
  const hostelFee = programs.flatMap(p => p.fees).find(f => /accommodation|hostel|dorm/i.test(f.item) || f.key === 'housing');
  const isChina = university.country.toLowerCase() === 'china';
  const isMalaysia = university.country.toLowerCase() === 'malaysia';

  const sampleMajors = [...new Set(programs.map(p => p.name).filter(Boolean))].slice(0, 6);
  const sampleQualifications = [...new Set(programs.flatMap(p => p.qualifications || []).filter(Boolean))].slice(0, 4);

  const items: UniversityFaqItem[] = [
    {
      question: `Where is ${university.name} located and what degrees are offered?`,
      answer: `${university.name} is located in ${university.city}, ${university.country}.${levels.length ? ` The current catalog lists ${programs.length} program${programs.length === 1 ? '' : 's'} across ${levels.join(', ')} study levels${sampleMajors.length ? ` (including ${sampleMajors.join(', ')})` : ''}.` : ''}`,
    },
    {
      question: `What are the tuition fees and hostel costs at ${identity.shortName}?`,
      answer: feePreviews.length
        ? `${feePreviews.map(fee => `${PROGRAM_LEVEL_LABELS[fee.level]}: ${fee.amount} ${fee.period}`).join('; ')}.${hostelFee?.amount ? ` Campus accommodation is listed at ${hostelFee.amount} ${hostelFee.period}.` : ' Campus accommodation, medical, insurance, and registration costs are itemized per program.'} These are official gross amounts before any scholarship deduction.`
        : 'Tuition depends on the selected degree level and major. Select any program in the catalog above to view its itemized annual tuition and campus living costs.',
    },
    {
      question: `What are the 2027 admission entry requirements at ${identity.shortName} for international students?`,
      answer: sampleQualifications.length
        ? `Recorded academic entry criteria at ${identity.shortName} include: ${sampleQualifications.join('; ')}. Applicants must also submit academic transcripts, highest diploma, passport copy, physical examination record, police clearance, and program-specific language proof (English MOI, IELTS/TOEFL, or HSK depending on the major).`
        : `International applicants to ${identity.shortName} must meet the academic qualification, age, and language requirements listed for their chosen degree level (Bachelor's, Master's, or PhD) and submit verified transcripts, passport, medical form, and police clearance.`,
    },
    {
      question: `Can international students study in English at ${identity.shortName}?`,
      answer: languages.some(language => /english/i.test(language))
        ? `Yes. ${identity.shortName} offers English-taught programs alongside ${languages.filter(l => !/english/i.test(l)).join(' / ') || 'other'} routes. Each major in the table above specifies its exact medium of instruction and English proficiency requirement (such as IELTS, TOEFL, or Medium of Instruction certificate where accepted).`
        : `Check the medium of instruction column for each major in the catalog above. Our counselors can guide you on language readiness and preparatory requirements.`,
    },
  ];
  if (facts.intakeMonths?.length) {
    items.push({
      question: `Which intake months are available at ${identity.shortName}?`,
      answer: `Documented intakes at ${identity.shortName} include ${facts.intakeMonths.join(' and ')}. Early application (3–5 months before intake) is recommended for international applicants seeking scholarship consideration and timely visa processing.`,
    });
  }
  if (facts.scholarshipOptions?.length) {
    const first = facts.scholarshipOptions[0];
    const example = first.coverage?.[0] || first.title;
    items.push({
      question: `What scholarships are available at ${identity.shortName} for international students?`,
      answer: `${facts.scholarshipOptions.length} scholarship route${facts.scholarshipOptions.length === 1 ? ' is' : 's are'} documented for ${identity.shortName}, including ${example}. Final scholarship tier and renewal depend on academic merit, program quota, and the university's official admission notice.`,
    });
  }
  if (isChina) {
    items.push({
      question: `What is the EduExpress service policy for applying to ${identity.shortName}?`,
      answer: `EduExpress International provides comprehensive application evaluation and admission guidance for ${identity.shortName}. International students receive transparent advice, verified document checklists, and direct guidance with no hidden markups.`,
    });
  } else if (isMalaysia) {
    items.push({
      question: `What is the EduExpress service charge and visa process for ${identity.shortName} in Malaysia?`,
      answer: `EduExpress International provides free application and EMGS visa processing (BDT 0 service charge) for ${identity.shortName}. Students pay official EMGS and tuition fees directly according to the university's offer letter and invoice.`,
    });
  }
  if (facts.rankings?.length) {
    const publishers = [...new Set(facts.rankings.map(ranking => ranking.publisher))];
    const best = facts.rankings.find(ranking => ranking.scope === 'world') || facts.rankings.find(ranking => ranking.scope === 'national') || facts.rankings[0];
    items.push({
      question: `What is the ranking of ${identity.shortName}?`,
      answer: `${identity.shortName} holds published ranking records from ${publishers.join(' and ')}, including a listed position of #${String(best.rank).replace(/^#/, '')}. Always compare specific faculty strengths, accreditation, and tuition budget alongside overall rankings.`,
    });
  }
  items.push({
    question: `How do I apply to ${identity.shortName}?`,
    answer: `Select your preferred major on this page, review the entry requirements and document checklist, and submit the Free Eligibility Check form. An EduExpress admissions counselor will evaluate your academic transcripts, help prepare your application dossier, track your official admission notice, and guide your student visa submission.`,
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

const MAX_BROWSER_TITLE_LENGTH = 64;

function htmlTitleLength(str: string): number {
  return str
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#x27;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').length;
}

/**
 * Compact HTML <title> formatted to stay <= 64 characters for Bing/Google SERP limits
 * while preserving the full university name ahead of acronym/brand suffixes.
 */
export function universityProfileBrowserTitle(
  university: UniversityIdentity,
  programs: UniversityProgramDetail[] = [],
): string {
  const identity = universitySearchIdentity(university);
  const medical = programs.find(program =>
    /\bMBBS\b|clinical medicine|ophthalmological and optometric medicine/i.test(program.name),
  );
  const medicalLabel = medical && /\bMBBS\b/i.test(medical.name) ? 'MBBS' : medical ? 'Medicine' : '';
  const mid = medicalLabel ? `${medicalLabel}, ` : '';
  const name = university.name.trim();
  const candidates = [
    `${identity.displayName}: ${mid}Fees & Scholarships | EduExpress International`,
    `${identity.displayName}: ${mid}Fees & Scholarships | EduExpress`,
    `${name}: ${mid}Fees & Scholarships | EduExpress`,
    `${identity.displayName}: ${mid}Fees & Scholarships`,
    `${name}: ${mid}Fees & Scholarships`,
    `${identity.displayName}: ${mid}Fees & Aid`,
    `${name}: ${mid}Fees & Aid`,
    `${name}: ${mid}Fees`,
    `${name} | EduExpress`,
    name,
  ];
  for (const candidate of candidates) {
    if (htmlTitleLength(candidate) <= MAX_BROWSER_TITLE_LENGTH) return candidate;
  }
  return `${name.slice(0, MAX_BROWSER_TITLE_LENGTH - 3).trimEnd()}...`;
}

function courseDescription(program: UniversityProgramDetail, university: Pick<CleanUniversityRecord, 'name' | 'city' | 'country'>): string {
  const parts = [`${program.level} programme in ${program.name} at ${university.name}, ${university.city}, ${university.country}`];
  if (program.duration) parts.push(`duration ${program.duration}`);
  if (program.languages.length) parts.push(`taught in ${program.languages.join(' and ')}`);
  if (program.intake) parts.push(`intake ${program.intake}`);
  const tuition = program.fees?.find(fee => fee.key === 'tuition' && fee.amount !== undefined && !fee.optional);
  if (tuition && tuition.amount !== undefined) {
    parts.push(`tuition ${tuition.currency} ${tuition.amount.toLocaleString('en-US')}/${tuition.period}`);
  }
  return `${parts.join('; ')}.`;
}

/** Shared semantic graph. Course facts come from the same catalogue the page renders. */
export function universityProfileStructuredData(university: UniversityIdentity & Pick<CleanUniversityRecord, 'officialUrl' | 'sourceUrls'>, programs: UniversityProgramDetail[]) {
  const seo = universityProfileSeo(university, programs);
  const universityId = `${seo.canonical}#university`;
  // Corroboration links: the university's own site plus recorded official
  // sources (provincial departments, publishers). Internal URLs are excluded.
  const sameAsList = [university.officialUrl, ...(university.sourceUrls ?? [])]
    .filter((url): url is string => Boolean(url && /^https:\/\//i.test(url)))
    .filter(url => !url.includes(UNIVERSITY_SITE_URL))
    .filter((url, index, list) => list.indexOf(url) === index);
  const seen = new Set<string>();
  const courses = programs.filter(program => {
    const key = `${program.level}|${program.name}|${program.languages.join('|')}|${program.duration}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  // Structured data lists a representative set; the full catalogue stays in the visible table.
  }).slice(0, 40).map(program => ({
    '@type': 'Course',
    '@id': `${seo.canonical}#course-${encodeURIComponent(program.id)}`,
    name: program.name,
    // Google requires a description on Course items; it is composed only from
    // the catalogue facts already shown on the page.
    description: courseDescription(program, university),
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
        mainEntityOfPage: seo.canonical,
        name: seo.title,
        description: seo.description,
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${UNIVERSITY_SITE_URL}/#website` },
        publisher: { '@id': `${UNIVERSITY_SITE_URL}/#organization` },
        mainEntity: { '@id': universityId },
        breadcrumb: { '@id': `${seo.canonical}#breadcrumb` },
        hasPart: [
          ['overview', 'University overview'], ['programs', 'Programs and tuition fees'],
          ['scholarships', 'Scholarship options'],
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
