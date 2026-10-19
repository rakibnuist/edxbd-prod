import type { ProgramRow } from './catalog-views';

/** Indexable program landing pages. Each must match enough records to be useful on its own. */
export type ProgramSegment = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  match: (row: ProgramRow) => boolean;
  faqs: { question: string; answer: string }[];
};

export const MIN_SEGMENT_PROGRAMS = 10;

export const programSegments: ProgramSegment[] = [
  {
    slug: 'english-taught-bachelor-china',
    title: 'English-Taught Bachelor Programs in China for Bangladeshi Students',
    h1: 'English-taught bachelor programs in China',
    description: 'Compare recorded English-taught bachelor programs at Chinese universities: yearly tuition, city, duration and deadline, with source links and a full cost breakdown.',
    intro: 'Bachelor programs taught in English, so you can start without learning Chinese first. Most still expect an HSC result, an English test or English-medium certificate, and a short interview.',
    match: row => row.level === 'Bachelor' && row.languages.includes('English'),
    faqs: [
      { question: 'Do English-taught bachelor programs in China need IELTS?', answer: 'Many accept IELTS or an equivalent test, and some accept an English-medium HSC certificate or an online interview instead. The rule differs by university and can change each intake, so check the specific program before you apply.' },
      { question: 'How long is a bachelor degree in China?', answer: 'Most bachelor programs take four years. Architecture, some engineering programs and medicine can take five or six. Chinese-taught programs may add a year of language study first.' },
    ],
  },
  {
    slug: 'chinese-taught-bachelor-china',
    title: 'Chinese-Taught Bachelor Programs in China: Tuition and Universities',
    h1: 'Chinese-taught bachelor programs in China',
    description: 'Recorded Chinese-medium bachelor programs at Chinese universities, usually with lower tuition than English-taught options. Compare tuition, city and deadline.',
    intro: 'Chinese-medium degrees are often cheaper and open more subjects, but you need HSK (usually level 4 or above) or a preparatory language year before the degree starts.',
    match: row => row.level === 'Bachelor' && row.languages.includes('Chinese') && !row.languages.includes('English'),
    faqs: [
      { question: 'What HSK level do I need for a Chinese-taught degree?', answer: 'Most universities ask for HSK 4, and some subjects ask for HSK 5. If you do not have it yet, many universities offer one year of Chinese language study before the degree.' },
      { question: 'Are Chinese-taught programs cheaper?', answer: 'In the records here they are often lower than English-taught programs at the same university. Compare the full cost, because a preparatory language year adds tuition and living costs.' },
    ],
  },
  {
    slug: 'masters-in-china',
    title: "Master's Programs in China for Bangladeshi Students: Tuition and Deadlines",
    h1: "Master's programs in China",
    description: "Search recorded master's programs at Chinese universities by tuition, teaching language and city. See deadlines, duration and the source for each figure.",
    intro: "Master's programs usually last two to three years. Many universities ask for a study plan and two recommendation letters, and some ask you to contact a supervisor before applying.",
    match: row => row.level === 'Master',
    faqs: [
      { question: "What documents do I need for a master's in China?", answer: 'Usually a bachelor degree certificate and transcript, a passport, a study plan, two recommendation letters, an English or HSK result, and a physical examination form. Some programs also ask for a supervisor acceptance letter.' },
      { question: "Can I get a scholarship for a master's in China?", answer: "Yes. Many universities record partial or full tuition scholarships for master's students, and some add a stipend. See the scholarship database for the recorded terms at each university." },
    ],
  },
  {
    slug: 'phd-in-china',
    title: 'PhD Programs in China for Bangladeshi Students: Tuition and Universities',
    h1: 'PhD programs in China',
    description: 'Recorded PhD programs at Chinese universities with yearly tuition, teaching language, duration and deadline. Check scholarship options and the source for each record.',
    intro: 'Doctoral programs usually last three to four years. A supervisor acceptance letter is often the deciding step, so start contacting supervisors early.',
    match: row => row.level === 'PhD',
    faqs: [
      { question: 'Do I need a supervisor before applying for a PhD in China?', answer: 'Many universities expect a supervisor acceptance letter or at least prior contact. It strengthens scholarship applications too, so plan time to research and email supervisors before the deadline.' },
      { question: 'How long does a PhD in China take?', answer: 'Usually three to four years, and it can be longer if research is not finished. Check the recorded duration on each program.' },
    ],
  },
  {
    slug: 'chinese-language-programs-china',
    title: 'Chinese Language Programs in China: One-Year and Semester Courses',
    h1: 'Chinese language programs in China',
    description: 'Recorded Chinese language and preparatory programs at Chinese universities, from four weeks to one year. Compare tuition, intakes and deadlines.',
    intro: 'Language programs prepare you for a Chinese-taught degree or HSK, and some lead into a degree at the same university. Durations range from a few weeks to a full year.',
    match: row => row.level === 'Chinese language' || row.level === 'Foundation',
    faqs: [
      { question: 'Can I join a Chinese language course without HSK?', answer: 'Yes. Language programs normally accept beginners. Some ask for a minimum age, a high school certificate and a physical examination form.' },
      { question: 'Does a language program lead to a degree?', answer: 'Some universities let you continue into a Chinese-taught degree after reaching the required HSK level. Confirm progression rules with the university before you join.' },
    ],
  },
];

export const findProgramSegment = (slug: string) => programSegments.find(segment => segment.slug === slug);
