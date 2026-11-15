/**
 * Search snippets and photo descriptions for the country guides
 * (/study-in-<slug>-from-bangladesh). Titles are 45–60 characters and
 * descriptions 120–160, written only from each country's record in
 * src/lib/countries.ts — update both together when the country data changes.
 */
export type CountrySeo = {
  /** Name as it reads in a sentence ("the UK"). */
  displayName: string;
  title: string;
  description: string;
  /** What the hero photo shows. */
  photoAlt: string;
};

export const COUNTRY_SEO: Record<string, CountrySeo> = {
  uk: {
    displayName: 'the UK',
    title: 'Study in the UK from Bangladesh: Costs & Visa | EduExpress',
    description:
      'Study in the UK from Bangladesh: tuition around £12,000–£18,000 a year, January and September intakes, IELTS 6.0–6.5, and CAS and Graduate Route rules.',
    photoAlt: 'Aerial view of London and Tower Bridge over the River Thames',
  },
  'south-korea': {
    displayName: 'South Korea',
    title: 'Study in South Korea from Bangladesh: GKS | EduExpress',
    description:
      'Study in South Korea from Bangladesh: GKS scholarship, March and September intakes, English or Korean (TOPIK) tracks, D-2 visa steps and monthly living costs.',
    photoAlt: 'Neon shop signs along a busy street in South Korea at dusk',
  },
  hungary: {
    displayName: 'Hungary',
    title: 'Study in Hungary from Bangladesh: Scholarships | EduExpress',
    description:
      'Study in Hungary from Bangladesh: Stipendium Hungaricum, a September intake with a January 15th deadline, IELTS 5.5+ or Duolingo 95+, and D-type visa checks.',
    photoAlt: 'The Hungarian Parliament Building lit up on the Danube in Budapest at night',
  },
  finland: {
    displayName: 'Finland',
    title: 'Study in Finland from Bangladesh: Costs & Visa | EduExpress',
    description:
      'Study in Finland from Bangladesh: €6,000–€12,000 yearly tuition, the September joint application, IELTS 6.0+, Type A residence permit and proof-of-funds rules.',
    photoAlt: 'Helsinki Cathedral above the harbour front in Helsinki, Finland',
  },
  cyprus: {
    displayName: 'Cyprus',
    title: 'Study in Cyprus from Bangladesh: Costs & Visa | EduExpress',
    description:
      'Study in Cyprus from Bangladesh: €2,500–€4,500 yearly tuition, February and October intakes, and Republic vs Northern Cyprus visa rules checked first.',
    photoAlt: 'Seafront promenade and modern towers on the coast of Cyprus',
  },
  croatia: {
    displayName: 'Croatia',
    title: 'Study in Croatia from Bangladesh: Costs & Visa | EduExpress',
    description:
      'Study in Croatia from Bangladesh: €3,000–€5,500 yearly tuition, an October intake with a July 15th deadline, IELTS 6.0 preferred and residence permit rules.',
    photoAlt: 'The twin spires of Zagreb Cathedral above the rooftops of Zagreb, Croatia',
  },
  georgia: {
    displayName: 'Georgia',
    title: 'Study in Georgia from Bangladesh: MBBS & Costs | EduExpress',
    description:
      'Study MBBS, dentistry or business in Georgia from Bangladesh: $4,500–$6,500 yearly MBBS tuition, March and September intakes, recognition and licensing checks.',
    photoAlt: 'View over the rooftops of Tbilisi, Georgia, at sunset',
  },
  malaysia: {
    displayName: 'Malaysia',
    title: 'Study in Malaysia from Bangladesh: Costs & EMGS | EduExpress',
    description:
      'Study in Malaysia from Bangladesh: RM 12,000–45,000 yearly tuition, RM 1,200–2,000 monthly living, EMGS VAL & Bangladesh Bank Student File with BDT 0 EduExpress fee.',
    photoAlt: 'The Petronas Twin Towers and the Kuala Lumpur skyline at dusk',
  },
  malta: {
    displayName: 'Malta',
    title: 'Study in Malta from Bangladesh: Programs & Visa | EduExpress',
    description:
      'Study in Malta from Bangladesh: English-medium business, IT, hospitality and health sciences programs, with costs in an itemised fee breakdown and visa checks.',
    photoAlt: 'Aerial view of Valletta and the Triton Fountain, Malta',
  },
  greece: {
    displayName: 'Greece',
    title: 'Study in Greece from Bangladesh: Programs | EduExpress',
    description:
      'Study in Greece from Bangladesh: business, tourism and hospitality and technology programs, with institution checks, dated written costs and visa checks.',
    photoAlt: 'The Parthenon on the Acropolis in Athens, Greece',
  },
  thailand: {
    displayName: 'Thailand',
    title: 'Study in Thailand from Bangladesh: Programs | EduExpress',
    description:
      'Study in Thailand from Bangladesh: English-taught business, hospitality and technology programs, with university checks, dated written costs and visa checks.',
    photoAlt: 'Thai temple buildings and gardens under a blue sky',
  },
};

export const OFFICIAL_COUNTRY_SOURCES: Record<string, { label: string; href: string }[]> = {
  uk: [
    { label: 'UK Visas and Immigration (UKVI) — Student Visa Official Guidance', href: 'https://www.gov.uk/student-visa' },
    { label: 'GOV.UK — Register of Licensed Student Sponsors', href: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students' },
    { label: 'British Council — Study UK Official Portal', href: 'https://study-uk.britishcouncil.org/' },
  ],
  'south-korea': [
    { label: 'NIIED — Study in Korea & Global Korea Scholarship (GKS) Portal', href: 'https://www.studyinkorea.go.kr/' },
    { label: 'Embassy of the Republic of Korea in Bangladesh', href: 'https://overseas.mofa.go.kr/bd-en/index.do' },
  ],
  hungary: [
    { label: 'Tempus Public Foundation — Stipendium Hungaricum Official Portal', href: 'https://stipendiumhungaricum.hu/' },
    { label: 'Study in Hungary — Official Higher Education Portal', href: 'https://studyinhungary.hu/' },
  ],
  finland: [
    { label: 'Studyinfo.fi — Official Finnish National Application Portal', href: 'https://opintopolku.fi/konfo/en/' },
    { label: 'Finnish Immigration Service (Migri) — Student Residence Permit & Means of Support', href: 'https://migri.fi/en/studying-in-finland' },
  ],
  cyprus: [
    { label: 'Cyprus Agency of Quality Assurance and Accreditation in Higher Education (CYQAA)', href: 'https://www.dipae.ac.cy/index.php/en/' },
    { label: 'Ministry of Education, Sport and Youth — Republic of Cyprus', href: 'https://www.moec.gov.cy/en/' },
  ],
  croatia: [
    { label: 'Agency for Science and Higher Education (ASHE / AZVO) — Croatia', href: 'https://www.azvo.hr/en/' },
    { label: 'Study in Croatia — Official Higher Education Portal', href: 'https://www.studyincroatia.hr/' },
  ],
  georgia: [
    { label: 'National Center for Educational Quality Enhancement (NCEQE) — Georgia', href: 'https://eqe.ge/en' },
    { label: 'Bangladesh Medical & Dental Council (BMDC)', href: 'https://www.bmdc.org.bd/' },
  ],
  malta: [
    { label: 'Malta Further & Higher Education Authority (MFHEA)', href: 'https://mfhea.mt/' },
    { label: 'Identità Malta — Central Visa Unit & Student Residence', href: 'https://identita.gov.mt/' },
  ],
  greece: [
    { label: 'Study in Greece — Official Higher Education Portal', href: 'https://studyingreece.edu.gr/' },
    { label: 'Hellenic Authority for Higher Education (HAHE / ETHAAE)', href: 'https://www.ethaae.gr/en/' },
  ],
  thailand: [
    { label: 'Ministry of Higher Education, Science, Research and Innovation (MHESI) — Thailand', href: 'https://www.mhesi.go.th/' },
    { label: 'Royal Thai Embassy, Dhaka — Consular & Non-Immigrant ED Visa', href: 'https://dhaka.thaiembassy.org/' },
  ],
};
