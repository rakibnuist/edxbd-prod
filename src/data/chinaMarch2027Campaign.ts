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
        level: 'Foundation + Bachelor',
        pathway: 'March–July foundation; bachelor study from September 2027',
        indicativeCost: 'Foundation: CNY 8,000 tuition + CNY 2,000 hostel',
        scholarship: 'The supplied sheet lists first-year tuition support; accommodation, insurance and other charges remain separate.',
        subjects: ['Aeronautical Engineering', 'Aircraft Maintenance', 'Artificial Intelligence', 'Electrical Engineering', 'International Business'],
        deadline: 'Project-sheet target: 25 December 2026; seats may close earlier.',
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
    ],
  },
  {
    id: 'direct-bachelor',
    title: 'Direct bachelor scholarship routes',
    shortTitle: 'Direct Bachelor',
    summary: 'Selected institutions in the supplied sheet list direct bachelor entry for eligible students without a separate foundation route.',
    opportunities: [
      {
        name: 'Wuzhou University',
        location: 'Wuzhou, Guangxi',
        level: 'Bachelor',
        pathway: 'Four-year bachelor route with annual award review',
        indicativeCost: 'First-year sheet estimate: CNY 2,000 tuition + CNY 3,800 hostel',
        scholarship: 'Later-year costs in the supplied sheet vary with academic performance and university review.',
        subjects: ['Computer Science', 'International Trade and Economics', 'Mechanical Engineering', 'Logistics', 'Business English'],
        deadline: 'Project-sheet target: 25 December 2026; seats may close earlier.',
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
    answer: 'No. They are indicative figures transcribed from EduExpress’s owner-supplied project sheet. Your counsellor must confirm the university, award tier, accommodation, deposits and third-party charges in a written ClearCost breakdown before you pay.',
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
