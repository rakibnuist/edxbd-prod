export type March2027Opportunity = {
  name: string;
  location: string;
  level: string;
  pathway: string;
  indicativeCost: string;
  scholarship: string;
  subjects: string[];
  deadline: string;
  universitySlug?: string;
};

export type March2027RouteGroup = {
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  opportunities: March2027Opportunity[];
};

/**
 * Owner-supplied campaign planning data from the internal “2027 Projects”
 * sheet. These are not represented as official university quotations. Every
 * figure and deadline is reconfirmed before an application or payment.
 */
export const chinaMarch2027Routes: March2027RouteGroup[] = [
  {
    id: 'foundation-bachelor',
    title: 'March foundation, September bachelor progression',
    shortTitle: 'Foundation → Bachelor',
    summary: 'Begin with a preparatory semester in March, then progress to a bachelor route after meeting the stated requirements.',
    opportunities: [
      {
        name: 'Shenyang City University',
        location: 'Shenyang, Liaoning',
        level: 'Foundation + Bachelor (4.5 Years)',
        pathway: 'March 0.5-year intensive Chinese foundation, followed by 4-year bachelor degree',
        indicativeCost: 'Foundation: CNY 5,000 (0.5 yr); Bachelor after scholarship: CNY 12,000/year; Hostel: CNY 3,500–5,000/year (all private bathroom)',
        scholarship: 'Guaranteed CNY 10,000/year institutional scholarship reducing annual tuition from CNY 22,000 to CNY 12,000/year for all 4 years.',
        subjects: ['Business Administration', 'Computer Science and Technology', 'Artificial Intelligence', 'Civil Engineering'],
        deadline: 'Individual: 25 November 2026; Agency: 25 December 2026.',
        universitySlug: 'shenyang-city-university',
      },
      {
        name: 'Chongqing Jiaotong University',
        location: 'Chongqing',
        level: 'Foundation + Bachelor',
        pathway: 'March–July foundation; bachelor study from September 2027',
        indicativeCost: 'Foundation: CNY 5,000 tuition + CNY 1,250 hostel',
        scholarship: 'Bachelor tiers in the supplied sheet range from tuition-free to CNY 5,000 tuition per year; other fees remain payable.',
        subjects: ['Computer Science', 'Mechanical Engineering', 'International Trade', 'Tourism Management'],
        deadline: 'Project-sheet target: 25 December 2026; seats may close earlier.',
      },
      {
        name: 'Harbin Institute of Technology',
        location: 'Harbin',
        level: 'Foundation + Bachelor',
        pathway: 'Chinese-language foundation before the September bachelor intake',
        indicativeCost: 'Foundation: CNY 7,300; bachelor tuition depends on award tier',
        scholarship: 'The supplied sheet lists 100%, 50%, 30% and 20% tuition-support tiers. Accommodation and other charges are separate.',
        subjects: ['Computer Science', 'Artificial Intelligence', 'Robotics', 'Electrical Engineering', 'Business Management'],
        deadline: 'Project-sheet target: 25 December 2026; seats may close earlier.',
        universitySlug: 'hit-harbin',
      },
      {
        name: 'Nanjing University of Aeronautics and Astronautics',
        location: 'Nanjing, Jiangsu',
        level: 'Foundation + Bachelor (0.5 + 4 Years)',
        pathway: 'March 2027 6-month international foundation (CSCA preparation, Mathematics, Physics, Scientific English) progressing directly into 6 English-taught Bachelor degrees',
        indicativeCost: 'Foundation Tuition: CNY 8,400 (~$1,200 USD) + Hostel: CNY 2,000–3,500/semester',
        scholarship: 'Priority consideration for partial undergraduate scholarships during degree; continuing academic awards up to CNY 20,000 from Year 2.',
        subjects: ['Aeronautical Engineering', 'Artificial Intelligence', 'Mechanical Engineering', 'Electronics & Electrical Engineering', 'Civil Engineering', 'International Business'],
        deadline: '27 February 2027 (Classes commence 8 March 2027).',
        universitySlug: 'nuaa',
      },
      {
        name: 'Nantong University',
        location: 'Nantong, Jiangsu',
        level: 'Foundation + Bachelor',
        pathway: 'Foundation followed by an English-taught bachelor route',
        indicativeCost: 'Foundation: CNY 8,000 tuition + CNY 1,800 hostel',
        scholarship: 'Multiple tuition-support tiers are listed, but the supplied tier wording needs written reconfirmation before quotation.',
        subjects: ['Computer Science', 'Business Administration', 'Pharmacy', 'Civil Engineering', 'Nursing'],
        deadline: 'Project-sheet target: 25 December 2026; seats may close earlier.',
        universitySlug: 'ntu',
      },
      {
        name: 'Linyi University',
        location: 'Linyi, Shandong',
        level: 'Foundation + Bachelor',
        pathway: 'March foundation followed by September bachelor progression',
        indicativeCost: 'Foundation: CNY 4,000 tuition + CNY 2,000 hostel',
        scholarship: 'The supplied sheet lists bachelor tuition outcomes of CNY 0, CNY 4,000 or CNY 7,000 per year by award tier.',
        subjects: ['Computer Science', 'Civil Engineering', 'E-commerce', 'International Business', 'Visual Communication'],
        deadline: 'Project-sheet target: 25 December 2026; seats may close earlier.',
        universitySlug: 'lyu',
      },
      {
        name: "Xi'an Shiyou University",
        location: "Xi'an, Shaanxi",
        level: 'Foundation + Bachelor',
        pathway: 'March foundation followed by an engineering-focused bachelor route',
        indicativeCost: 'Foundation: CNY 3,000 tuition + CNY 1,500 hostel',
        scholarship: 'Tuition, accommodation and stipend combinations are listed by tier; the final award must match the written scholarship notice.',
        subjects: ['Petroleum Engineering', 'Computer Science', 'Artificial Intelligence', 'Civil Engineering', 'Geology'],
        deadline: 'Project-sheet target: 25 December 2026; seats may close earlier.',
        universitySlug: 'xsyu',
      },
      {
        name: 'Changchun Sci-Tech University',
        location: 'Changchun, Jilin',
        level: 'Preparation + Bachelor',
        pathway: 'March–September preparation; selected bachelor routes from September 2027',
        indicativeCost: 'Preparation semester: CNY 5,000',
        scholarship: 'The supplied sheet lists CNY 10,000 per year for tuition and hostel after scholarship for selected routes.',
        subjects: ['Artificial Intelligence', 'Computer Science', 'Mechanical Engineering', 'Architecture', 'Business Administration'],
        deadline: 'Availability and final institution naming require written confirmation.',
      },
      {
        name: 'Shandong University of Technology',
        location: 'Zibo, Shandong',
        level: 'Language + Bachelor (4.5 Years)',
        pathway: 'March 2027 Chinese language semester, then English-taught bachelor from September 2027 (CSCA score needed before June 2027)',
        indicativeCost: 'Language: CNY 5,000 / semester; Bachelor: CNY 12,000 / year; quad-room accommodation free',
        scholarship: 'Free four-person dormitory. No entrance exam or interview. Age 18–25; open to applicants from Asia and North Africa.',
        subjects: ['Mechanical Design & Automation', 'Computer Science', 'International Economics & Trade', 'Civil Engineering', 'Electrical Engineering', 'Energy & Power (Vehicle Engine)', 'Business English', 'Resource Exploration Engineering'],
        deadline: '30 December 2026.',
        universitySlug: 'shandong-university-of-technology',
      },
      {
        name: 'Civil Aviation University of China',
        location: 'Tianjin',
        level: 'Foundation + Bachelor (0.5 + 4 Years)',
        pathway: 'Half-year foundation from March 2027 with direct entry to an English-taught bachelor',
        indicativeCost: 'Foundation: CNY 7,500 / semester + CNY 3,000 / semester double room; application fee CNY 400',
        scholarship: 'First- or second-class university scholarship eligibility after successful foundation completion.',
        subjects: ['Aviation & Engineering bachelor tracks', 'Business & Management bachelor tracks'],
        deadline: '6 January 2027. Age 17–24; minimum 60%; IELTS 5.5 / TOEFL 70 / Duolingo 85; all nationalities.',
        universitySlug: 'civil-aviation-university-of-china',
      },
    ],
  },
  {
    id: 'direct-bachelor',
    title: 'Direct bachelor scholarship routes',
    shortTitle: 'Direct Bachelor',
    summary: 'Selected institutions in the supplied sheet list direct bachelor entry for eligible students without a separate foundation route.',
    opportunities: [
      {
        name: 'Shenyang City University',
        location: 'Shenyang, Liaoning',
        level: 'Bachelor (4-Year Direct)',
        pathway: 'Four-year direct bachelor degree starting in September (with spring early reservation)',
        indicativeCost: 'Sheet estimate after scholarship: CNY 12,000 tuition + CNY 3,500–5,000 hostel (private bathroom)',
        scholarship: 'Guaranteed CNY 10,000/year institutional scholarship reducing tuition from CNY 22,000 to CNY 12,000/year.',
        subjects: ['Business Administration', 'Computer Science and Technology', 'Artificial Intelligence', 'Civil Engineering'],
        deadline: 'Applications open for 2027 cycle; apply by 30 June 2027.',
        universitySlug: 'shenyang-city-university',
      },
      {
        name: 'Wuzhou University',
        location: 'Wuzhou, Guangxi',
        level: 'Bachelor (4-Year Direct Major)',
        pathway: 'Direct-major English-taught bachelor from March 2027, near Guangzhou & Shenzhen; 35 seats per major',
        indicativeCost: 'Tuition + twin-share room per year: Business English CNY 9,000; International Economics & Trade CNY 9,300; CS & AI CNY 9,900',
        scholarship: '4-year unconditional scholarship on admission (no CSCA). Age 18–23, minimum 60% marks, USD 3,000 bank statement, 2-minute English video.',
        subjects: ['International Economics and Trade', 'Business English', 'Computer Science and Technology', 'Artificial Intelligence'],
        deadline: '30 December 2026; seats may close earlier.',
        universitySlug: 'wuzhou-university',
      },
      {
        name: 'Panzhihua University',
        location: 'Panzhihua, Sichuan',
        level: 'Bachelor',
        pathway: 'Four-year direct bachelor route',
        indicativeCost: 'Sheet estimate after scholarship: CNY 6,000 tuition + CNY 3,000 hostel',
        scholarship: 'An additional performance-based award is listed; amount and renewal need written confirmation.',
        subjects: ['Computer Science', 'International Economics and Trade'],
        deadline: 'Project-sheet target: 20 February 2027; seats may close earlier.',
      },
    ],
  },
  {
    id: 'language',
    title: 'Chinese-language routes for March 2027',
    shortTitle: 'Chinese Language',
    summary: 'Semester language study can be a standalone goal or preparation for a later diploma or degree application.',
    opportunities: [
      {
        name: 'Shenyang City University',
        location: 'Shenyang, Liaoning',
        level: 'Chinese Language (0.5-Year or 1-Year)',
        pathway: '0.5-Year (1 semester) or 1-Year language immersion starting in March 2027',
        indicativeCost: '0.5-Year: CNY 5,000 (after CNY 3,000 scholarship); 1-Year: CNY 10,000 (after CNY 6,000 scholarship)',
        scholarship: 'CNY 3,000 scholarship for 0.5-year or CNY 6,000 scholarship for 1-year language students.',
        subjects: ['Chinese Language (0-Beginner)', 'Listening & Speaking', 'Reading & Writing', 'HSK Preparation'],
        deadline: 'Individual: 25 November 2026; Agency: 25 December 2026.',
        universitySlug: 'shenyang-city-university',
      },
      {
        name: 'Guizhou University',
        location: 'Guiyang, Guizhou',
        level: 'Chinese Language (Spring 2027 Semester)',
        pathway: 'One-semester non-degree intensive Chinese language immersion (March – July 2027)',
        indicativeCost: 'Tuition: CNY 6,000 / semester; Registration: CNY 500; Insurance: CNY 400 / semester; Dorm: CNY 1,500–3,000 / semester',
        scholarship: 'Self-funded foundation with progression to Guizhou Provincial, ASEAN & CSC Scholarships for degree programs.',
        subjects: ['Comprehensive Chinese', 'Spoken Communication', 'Reading & Writing', 'HSK 3–5 Preparation', 'Guizhou Culture'],
        deadline: '15 December 2026.',
        universitySlug: 'gzu',
      },
      {
        name: 'Shanghai Jiao Tong University',
        location: 'Shanghai',
        level: 'Chinese Language',
        pathway: 'One-semester or one-year language study',
        indicativeCost: 'Supplied tuition figure: CNY 10,500 per semester',
        scholarship: 'No scholarship promise is made for this language route.',
        subjects: ['Chinese Language'],
        deadline: 'Project sheet lists 15 December 2026; official status must be reconfirmed.',
      },
      {
        name: 'Huazhong University of Science and Technology',
        location: 'Wuhan, Hubei',
        level: 'Chinese Language and Culture',
        pathway: 'Semester or one-year study, including beginner entry',
        indicativeCost: 'Supplied tuition figure: CNY 7,500 per semester; dormitory listed separately',
        scholarship: 'No scholarship promise is made for this language route.',
        subjects: ['Chinese Language', 'Chinese Culture'],
        deadline: 'Application window requires confirmation before submission.',
      },
      {
        name: 'Guangzhou City Construction College',
        location: 'Qingyuan, Guangzhou',
        level: 'Chinese Language',
        pathway: '1-Semester (X2 Visa) or 1-Year (X1 Visa) Chinese Language Program',
        indicativeCost: 'Tuition + Hostel: CNY 7,000 / semester (X2 Visa) or CNY 13,200 / year (X1 Visa)',
        scholarship: 'Bundled tuition and on-campus hostel package for eligible applicants aged 18–45.',
        subjects: ['Chinese Language', 'Chinese Culture', 'HSK Preparation'],
        deadline: 'March 2027 intake; apply by 31 January 2027.',
        universitySlug: 'gzccc',
      },
      {
        name: 'Hechi University',
        location: 'Hechi, Guangxi',
        level: 'Chinese Language (0.5 or 1.5 Years)',
        pathway: '1.5-year intensive Chinese (March 2027 – June 2028) targeting HSK 5, or a 0.5-year semester; beginners accepted',
        indicativeCost: '1.5 years: CNY 9,000 tuition + CNY 3,000 quad room (total for the full period); 0.5 year: CNY 3,000 tuition + CNY 1,500 quad room',
        scholarship: 'CNY 1,000 / year merit scholarship after the first semester for scores above 80%.',
        subjects: ['Intensive Chinese (Beginner to HSK 5)', 'Listening & Speaking', 'Reading & Writing', 'HSK Preparation'],
        deadline: '30 December 2026. Age 18–25.',
        universitySlug: 'hcnu',
      },
      {
        name: 'Six-month pathway options',
        location: 'Wuhan, Jiangsu or Shandong',
        level: 'Chinese Language',
        pathway: 'Six months of language preparation with possible later diploma, bachelor or master progression',
        indicativeCost: 'A written university-specific quotation is required before payment',
        scholarship: 'Progression is subject to academic results, language achievement and receiving-institution approval.',
        subjects: ['Chinese Language', 'Later degree progression'],
        deadline: 'Institution and seat availability require confirmation.',
      },
    ],
  },
  {
    id: 'masters',
    title: 'Master’s scholarship route',
    shortTitle: 'Master’s',
    summary: 'A postgraduate option for applicants whose bachelor background and documents match an available supervisor or program route.',
    opportunities: [
      {
        name: 'Nanjing Institute of Technology',
        location: 'Nanjing, Jiangsu',
        level: "Master's",
        pathway: 'Three-year postgraduate study',
        indicativeCost: 'The supplied scholarship tiers list tuition, accommodation and insurance coverage',
        scholarship: 'Monthly stipend tiers of CNY 300, CNY 500 or CNY 1,000 are listed; the award letter controls final coverage.',
        subjects: ['Engineering', 'Computer Technology', 'Civil and Transportation', 'Accounting', 'Design'],
        deadline: 'Application window and supervisor availability require confirmation.',
        universitySlug: 'njit',
      },
    ],
  },
];

export const march2027RequiredDocuments = [
  'Passport copy with sufficient validity',
  'Academic certificates and transcripts',
  'Recent passport-size photograph',
  'Physical examination form when required',
  'Police clearance when required',
  'English or Chinese language evidence when the selected program requires it',
  'Study plan, recommendation letters or other postgraduate documents for master’s applicants',
];

export const march2027Faqs = [
  {
    question: 'Is March 2027 a full bachelor intake at every university?',
    answer: 'No. Several supplied routes begin with a foundation, preparation or language semester in March and progress to bachelor study in September. Direct bachelor entry is available only in selected listed routes and remains subject to university confirmation.',
  },
  {
    question: 'Are the fees on this page final?',
    answer: 'No. They are indicative figures transcribed from EduExpress’s owner-supplied project sheet. Your counsellor must confirm the university, award tier, accommodation, deposits and third-party charges in a written fee breakdown before you pay.',
  },
  {
    question: 'Does a scholarship always include tuition, accommodation and a stipend?',
    answer: 'No. Coverage differs by institution and award tier. A scholarship may cover one item, several items or a stated percentage. Only the written scholarship or admission notice confirms your actual coverage.',
  },
  {
    question: 'Is IELTS required for every route?',
    answer: 'There is no universal answer. Language evidence depends on the university and program. EduExpress checks the current requirement against your selected route before submission.',
  },
  {
    question: 'What does the BDT 200,000 EduExpress package include?',
    answer: 'For an eligible China full-scholarship service route, it includes application fees until successful admission, Admission Notice, scholarship assistance, JW202 support, visa application processing, embassy fee, medical checkup in Bangladesh, pre-departure guidance, one-way air ticket and airport pickup. University deposits and other excluded university or third-party charges are separate.',
  },
  {
    question: 'Can my parents join the assessment or counselling session?',
    answer: 'Yes. Students and parents are encouraged to review the university route, costs, payment terms, document security and refund conditions together before signing.',
  },
];
