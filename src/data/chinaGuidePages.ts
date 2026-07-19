export type ChinaGuideSection = {
  heading: string;
  summary: string;
  items?: string[];
};

export type ChinaGuidePage = {
  slug: string;
  code: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  directAnswer: string;
  facts: { value: string; label: string; note: string }[];
  sections: ChinaGuideSection[];
  changeRisks: string[];
  notSuitable: string[];
  faqs: { question: string; answer: string }[];
  sources: { label: string; href: string }[];
  related: { label: string; href: string }[];
  ctaTitle: string;
  ctaText: string;
};

const embassy = { label: 'Chinese Embassy in Bangladesh', href: 'https://bd.china-embassy.gov.cn/eng/' };
const embassyVisa = { label: 'Chinese Embassy Bangladesh visa notice', href: 'https://bd.china-embassy.gov.cn/eng/sghd/202509/t20250912_11707745.htm' };
const visaCenter = { label: 'Chinese Visa Application Service Center in Dhaka', href: 'https://visaforchina.cn/DAC3_EN' };
const campusChina = { label: 'Campus China and Chinese Government Scholarship portal', href: 'https://www.campuschina.org/' };
const csca = { label: 'Official CSCA portal', href: 'https://csca.cn/' };
const bmdc = { label: 'Bangladesh Medical and Dental Council', href: 'https://www.bmdc.org.bd/' };
const bmdcForeign = { label: 'BMDC foreign graduate requirements and forms', href: 'https://www.bmdc.org.bd/forms-foreign' };

const commonRelated = [
  { label: 'Study in China from Bangladesh', href: '/study-in-china-from-bangladesh' },
  { label: 'Universities and study options', href: '/china-universities' },
  { label: 'China service fee policy', href: '/china-visa-first-policy' },
];

export const chinaGuidePages: Record<string, ChinaGuidePage> = Object.fromEntries(([
  {
    slug: 'china-scholarships-bangladesh',
    code: 'CN FUNDING',
    title: 'China Scholarships for Bangladeshi Students',
    metaTitle: 'China Scholarships for Bangladeshi Students | EduExpress',
    description: 'Compare CSC, provincial and university scholarships by eligibility, coverage, renewal terms, CSCA requirements and official source status.',
    eyebrow: 'Funding after education fit',
    directAnswer: 'Bangladeshi students can explore Chinese Government Scholarship, provincial and university awards after confirming that the program and university fit their goals. Coverage can range from a tuition reduction to tuition, accommodation, insurance or a stipend. Each item, renewal condition, eligible program and deadline is matched to the official notice, while the awarding body makes the selection decision.',
    facts: [
      { value: '3', label: 'Funding families', note: 'Government, provincial and university awards' },
      { value: 'Official', label: 'Selection decision', note: 'The awarding body confirms each award' },
      { value: '1st', label: 'Education fit', note: 'Funding is assessed after program suitability' },
    ],
    sections: [
      { heading: 'Chinese Government Scholarship', summary: 'Use the current Campus China notice and the relevant dispatching authority or university instructions. The application route, eligible level, required documents and CSCA position can differ.', items: ['Confirm whether the route is bilateral, university or another official category', 'Use only the official application portal stated in the notice', 'Check whether a pre admission document is required', 'Record the source URL and application period'] },
      { heading: 'Provincial and university awards', summary: 'Coverage is confirmed independently for each institution specific award.', items: ['Identify the university and exact eligible program', 'Separate full tuition from accommodation and living support', 'Check whether the award is automatic, competitive or reviewed after enrolment', 'Confirm whether the award continues beyond the first year'] },
      { heading: 'Eligibility and document screen', summary: 'A funding application normally depends on academic history, age or study level limits, language evidence, study plan and other route specific documents.', items: ['Academic certificates and transcripts', 'Language evidence required by the program', 'Study or research plan appropriate to the level', 'Recommendations and health documents where officially requested', 'CSCA result where the undergraduate route requires it'] },
      { heading: 'Renewal is part of the cost decision', summary: 'An award that can be reduced or removed changes the total program cost. Renewal standards should be written into the ClearCost Sheet.', items: ['Minimum academic performance', 'Attendance and conduct conditions', 'Annual review requirements', 'Coverage after a program or university change'] },
      { heading: 'Scholarship risk check', summary: 'A headline such as “100% scholarship” may refer only to tuition. The student still needs to budget for every uncovered cost and understand the refund status of early payments.' },
    ],
    changeRisks: ['Annual scholarship quotas and eligible programs', 'Application windows and required portals', 'CSCA requirements for undergraduate routes', 'Coverage, renewal rules and stipend values'],
    notSuitable: ['Students who compare program quality before funding', 'Applicants prepared for merit and seat based selection', 'Families with a plan for every cost outside the confirmed coverage'],
    faqs: [
      { question: 'Can a China scholarship cover 100% of tuition?', answer: 'Selected awards may cover full tuition, but the official notice must confirm what “100%” includes. Accommodation, insurance, living expenses, travel and other charges may remain.' },
      { question: 'Who decides a CSC scholarship result?', answer: 'EduExpress can help assess fit and prepare the application. The scholarship authority or university makes the official selection decision.' },
      { question: 'Is CSCA required for scholarship applicants?', answer: 'For current undergraduate Chinese Government Scholarship routes, CSCA can be required. The exact route and university notice must be checked before application.' },
      { question: 'How should I choose a university with a scholarship?', answer: 'Assess recognition, curriculum, academic fit, teaching language and total cost first, then compare the scholarship coverage and renewal conditions.' },
    ],
    sources: [campusChina, csca, embassy],
    related: [...commonRelated, { label: 'Cost of studying in China', href: '/study-in-china-cost-bangladesh' }],
    ctaTitle: 'Check scholarship fit after program fit',
    ctaText: 'Share your academic level and target subject so the team can screen suitable university routes and current funding conditions.',
  },
  {
    slug: 'china-student-visa-bangladesh',
    code: 'CN VISA',
    title: 'China X1 and X2 Student Visa from Bangladesh',
    metaTitle: 'China Student Visa from Bangladesh 2027 | EduExpress',
    description: 'Understand China X1 and X2 student visa routes, Bangladesh document requirements, financial proof and current official application checks.',
    eyebrow: 'Visa readiness after admission',
    directAnswer: 'The X1 visa is for study in China lasting more than 180 days, while X2 is for study lasting no more than 180 days. The current Bangladesh embassy notice lists the admission letter and, for higher education X1 applicants, the JW201 or JW202 confirmation form. Scholarship applicants provide award evidence and self funded applicants provide the financial proof stated in the current notice. Students should use the official online process and wait for the required review status before passport submission.',
    facts: [
      { value: 'X1', label: 'Long term study', note: 'More than 180 days' },
      { value: 'X2', label: 'Short term study', note: 'No more than 180 days' },
      { value: 'Official', label: 'Decision owner', note: 'Embassy and responsible authorities' },
    ],
    sections: [
      { heading: 'Choose the visa type from the study duration', summary: 'The admission documents and program duration determine the route. A marketing label cannot replace the official visa category.', items: ['X1 for study lasting more than 180 days', 'X2 for study lasting no more than 180 days', 'Check post arrival residence formalities for the X1 route with the university and authorities'] },
      { heading: 'Core admission evidence', summary: 'The current embassy notice identifies the school admission letter and route specific study confirmation documents.', items: ['Valid passport and completed online application', 'Original admission letter where required', 'JW201 or JW202 for higher education X1 applicants', 'Scholarship evidence for funded students', 'Financial evidence for self funded students under the current notice'] },
      { heading: 'Dhaka application workflow', summary: 'Complete the online application and upload the requested materials. Follow the status instructions before attending the visa center or embassy.', items: ['Respond promptly to requests for correction or supplementary material', 'Submit the passport when the official online status permits it', 'Carry the documents requested for interview or physical submission', 'Use the current service center address and opening hours'] },
      { heading: 'Financial proof and the complete budget', summary: 'Use the stated visa evidence together with a separate ClearCost Sheet covering the complete tuition and living cost plan.' },
      { heading: 'A stronger visa readiness file', summary: 'Consistent forms, clear funding, complete admission evidence, authentic documents and timely corrections create the strongest possible application. The responsible authority issues the visa decision.' },
    ],
    changeRisks: ['Online form and appointment procedures', 'Financial evidence wording', 'Interview or passport submission instructions', 'Visa center hours and public holiday closures'],
    notSuitable: ['Applicants holding the final official admission documents', 'Students ready to provide authentic and consistent evidence', 'Applicants who understand that the responsible authority issues the visa decision'],
    faqs: [
      { question: 'What is the difference between X1 and X2?', answer: 'X1 is for study lasting more than 180 days. X2 is for study lasting no more than 180 days.' },
      { question: 'Is a JW201 or JW202 needed for X1?', answer: 'The current Bangladesh embassy notice lists the JW201 or JW202 confirmation form for higher education X1 applicants together with the admission letter.' },
      { question: 'Who decides a China student visa?', answer: 'EduExpress provides document readiness and application support. The responsible Chinese authorities make the official visa decision.' },
      { question: 'When should I submit my passport?', answer: 'Follow the current official online status and visa center instructions for your own application.' },
    ],
    sources: [embassyVisa, visaCenter, embassy],
    related: [...commonRelated, { label: 'China intake and deadline guide', href: '/china-intakes-deadlines' }],
    ctaTitle: 'Start with admission fit, then prepare visa evidence',
    ctaText: 'Get your program and document route screened before treating a visa checklist as complete.',
  },
  {
    slug: 'study-in-china-cost-bangladesh',
    code: 'CN COST',
    title: 'Cost of Studying in China from Bangladesh',
    metaTitle: 'Cost of Studying in China from Bangladesh 2027 | EduExpress',
    description: 'Plan tuition, hostel, insurance, medical, visa, flight and living costs in CNY and BDT with dated assumptions and clear recipients.',
    eyebrow: 'Build the full cost before applying',
    directAnswer: 'There is no single cost for studying in China from Bangladesh. Tuition and accommodation depend on the university, program, city, scholarship and intake. A responsible budget separates original tuition, any confirmed scholarship reduction, hostel, insurance, medical, visa related charges, flight, food, transport and personal costs. Every CNY amount should show its source and valid period, and every BDT conversion should show the exchange rate and date used. EduExpress charges must remain separate from university and authority payments.',
    facts: [
      { value: 'CNY', label: 'Source currency', note: 'Keep official amounts in the charged currency' },
      { value: 'BDT', label: 'Planning view', note: 'Use a dated conversion assumption' },
      { value: '3', label: 'Recipient groups', note: 'University, authority or provider, EduExpress' },
    ],
    sections: [
      { heading: 'University charges', summary: 'Record the original amount and the exact recipient before applying any scholarship reduction.', items: ['Application or registration fee', 'Tuition by semester or academic year', 'University deposit and refund status', 'Hostel, bedding or campus service charges'] },
      { heading: 'Required study and arrival costs', summary: 'Some charges are payable outside the tuition invoice and may be due before travel.', items: ['Insurance required by the university or authorities', 'Medical examination and document health checks', 'Translation, notarisation and courier', 'Visa application related charges', 'Flight and initial local transport'] },
      { heading: 'Living cost plan', summary: 'City, housing arrangement and lifestyle change the monthly budget. Use a realistic buffer rather than the lowest promotional figure.', items: ['Food and halal food access', 'Local transport and mobile data', 'Utilities where not included', 'Books, supplies and personal expenses', 'Emergency and exchange rate buffer'] },
      { heading: 'Scholarship cost reality', summary: 'A tuition award may leave accommodation, insurance and living costs uncovered. Renewal conditions can change the total program cost after year one.' },
      { heading: 'Separate EduExpress and third party fees', summary: 'No file opening charge. No EduExpress service fee before China visa approval. Any earlier third party fee must be itemized in writing before the student proceeds.' },
    ],
    changeRisks: ['University fee schedules and hostel availability', 'Scholarship coverage and renewal', 'CNY to BDT exchange rate', 'Flights, insurance and local living prices'],
    notSuitable: ['Students budgeting for the complete study and living cost', 'Families prepared for costs outside confirmed scholarship coverage', 'Students who review the written recipient and refund information before payment'],
    faqs: [
      { question: 'How much does it cost to study in China from Bangladesh?', answer: 'The total depends on the university, level, city, scholarship and lifestyle. Build a dated cost sheet for the exact program instead of relying on one national average.' },
      { question: 'What can a full scholarship cover?', answer: 'Coverage differs by award and “full” may refer to tuition. Confirm accommodation, insurance, stipend, renewal and personal costs separately.' },
      { question: 'Should costs be shown in CNY or BDT?', answer: 'Keep official charges in CNY and add a BDT planning conversion with the exchange rate source and date.' },
      { question: 'What does EduExpress charge before visa approval?', answer: 'There is no file opening charge and no EduExpress service fee before China visa approval. Required third party costs remain separate and must be itemized.' },
    ],
    sources: [embassyVisa, campusChina],
    related: [...commonRelated, { label: 'China scholarship guide', href: '/china-scholarships-bangladesh' }],
    ctaTitle: 'Request a ClearCost Sheet for your shortlisted route',
    ctaText: 'Start with the exact program, city and funding position so the cost plan reflects your decision.',
  },
  {
    slug: 'study-in-china-without-ielts',
    code: 'CN ENGLISH',
    title: 'Study in China Without IELTS from Bangladesh',
    metaTitle: 'Study in China Without IELTS | Rules for Bangladesh',
    description: 'Understand university specific MOI, interview and alternative English proof routes through exact program requirements.',
    eyebrow: 'English proof is program specific',
    directAnswer: 'Some Chinese universities or programs may accept Bangladeshi applicants without an IELTS score when the current official admission notice allows another form of English proficiency. Possible alternatives can include an English medium instruction certificate, another recognized test or a university assessment. Each university and program sets its own rule, so the teaching language, exact evidence, score validity, scholarship condition and intake notice are confirmed for the selected program before application.',
    facts: [
      { value: 'Program', label: 'Specific requirement', note: 'Rules belong to the exact university and program' },
      { value: 'MOI', label: 'Possible evidence', note: 'Only where the official notice accepts it' },
      { value: 'Separate', label: 'CSCA check', note: 'English proof and CSCA are different requirements' },
    ],
    sections: [
      { heading: 'IELTS route', summary: 'A valid IELTS score can be the clearest evidence when it meets the exact program requirement. Check the required score, test type and validity period.' },
      { heading: 'Alternative English evidence', summary: 'Use an alternative only when the university or program notice accepts it in writing.', items: ['Medium of instruction certificate', 'Another recognized English language test', 'University interview or internal assessment', 'Prior qualification taught in English where officially accepted'] },
      { heading: 'Chinese taught programs', summary: 'Chinese taught programs may require HSK or another stated language condition, which is checked separately from IELTS.' },
      { heading: 'CSCA is a separate admission check', summary: 'An English taught undergraduate route may still have CSCA subject requirements, so English evidence and CSCA are confirmed independently.' },
      { heading: 'How EduExpress confirms a route', summary: 'The shortlist stores the official program notice, accepted evidence, date checked and next review date to create a clear written route.' },
    ],
    changeRisks: ['Accepted tests and score thresholds', 'MOI wording and document format', 'Interview requirements', 'Scholarship specific language conditions'],
    notSuitable: ['Applicants ready to follow the exact program language rule', 'Students willing to complete a university assessment when requested', 'Applicants prepared to meet CSCA and academic requirements separately'],
    faqs: [
      { question: 'Can I study in China without IELTS?', answer: 'Possibly, when the exact university and program officially accept another form of English proof.' },
      { question: 'How is an MOI certificate accepted?', answer: 'Acceptance is university and program specific, and the required wording or issuing institution can differ.' },
      { question: 'How does CSCA relate to an English taught program?', answer: 'English proof and CSCA are separate admission requirements and are checked independently for the selected route.' },
      { question: 'Can EduExpress confirm a route before I apply?', answer: 'EduExpress can check the current program notice and record the accepted evidence, but the university makes the admission decision.' },
    ],
    sources: [csca, campusChina],
    related: [...commonRelated, { label: 'China intake and deadline guide', href: '/china-intakes-deadlines' }],
    ctaTitle: 'Check your accepted English proof before applying',
    ctaText: 'Share your education history and available language evidence for a university specific screen.',
  },
  {
    slug: 'mbbs-in-china-bangladesh',
    code: 'CN MBBS',
    title: 'MBBS in China for Bangladeshi Students',
    metaTitle: 'MBBS in China for Bangladeshi Students | Recognition First',
    description: 'Assess MBBS in China through BMDC eligibility, university recognition, clinical training, language, total cost and licensing requirements.',
    eyebrow: 'Recognition and licensing before price',
    directAnswer: 'A Bangladeshi student considering MBBS in China should verify the Bangladesh Medical and Dental Council pathway before comparing tuition or scholarships. BMDC provides an eligibility certificate process for students planning medical study abroad and a Registration Qualifying Examination pathway for foreign medical graduates. The university, medical qualification, clinical training, teaching language, internship structure and documents required for later registration all receive individual review. EduExpress helps organize the evidence, while BMDC and relevant professional authorities determine recognition and registration.',
    facts: [
      { value: 'BMDC', label: 'Bangladesh authority', note: 'Check eligibility and later registration requirements' },
      { value: 'First', label: 'Recognition review', note: 'Complete before comparing price' },
      { value: 'Authority', label: 'Licensing decision', note: 'Professional authorities decide registration' },
    ],
    sections: [
      { heading: 'Check the Bangladesh pathway first', summary: 'Use current BMDC information before paying a university or applying abroad.', items: ['Eligibility certificate requirements before study abroad', 'University and qualification evidence required by BMDC', 'Registration Qualifying Examination requirements after a foreign degree', 'Internship and registration steps applicable at the time of return'] },
      { heading: 'Verify the exact medical university and program', summary: 'A university name alone is not enough. Store evidence for the medical qualification and clinical training route.', items: ['Official university and medical school name', 'Program duration and curriculum', 'Teaching and clinical language', 'Affiliated hospital and clinical exposure evidence', 'Current Ministry and regulator records relevant to the student'] },
      { heading: 'Language and clinical readiness', summary: 'Students plan for the local language needed to communicate with patients and complete clinical training alongside English taught classroom study.' },
      { heading: 'Full medical education cost', summary: 'Budget for tuition, hostel, insurance, medical equipment, clinical or internship related costs, travel, licensing documents and examination steps, not only the first year fee.' },
      { heading: 'Recognition and registration ownership', summary: 'EduExpress provides education guidance and application support. BMDC and other professional authorities determine eligibility and registration under their current rules.' },
    ],
    changeRisks: ['BMDC eligibility and registration requirements', 'University medical program status', 'Clinical training and internship rules', 'Language and examination requirements'],
    notSuitable: ['Students who check the BMDC pathway before choosing a medical program', 'Applicants prepared for the applicable licensing process after graduation', 'Students willing to prepare for clinical language and qualifying requirements'],
    faqs: [
      { question: 'How is an MBBS degree from China recognized in Bangladesh?', answer: 'Recognition follows the current BMDC eligibility, institution evidence and registration requirements, which should be checked before enrolment.' },
      { question: 'Do Bangladeshi graduates need a qualifying examination?', answer: 'BMDC publishes a Registration Qualifying Examination pathway for foreign medical graduates. Students should confirm the rules that will apply to their cohort.' },
      { question: 'What language supports clinical training?', answer: 'Clinical communication may require Chinese language ability even when classroom instruction is advertised in English.' },
      { question: 'Who decides BMDC registration?', answer: 'EduExpress can help verify and organize information, while BMDC makes the eligibility and registration decisions.' },
    ],
    sources: [bmdc, bmdcForeign, { label: 'BMDC Registration Qualifying Examination portal', href: 'https://payment.bmdc.org.bd/' }],
    related: [...commonRelated, { label: 'Full China study cost guide', href: '/study-in-china-cost-bangladesh' }],
    ctaTitle: 'Screen the licensing route before choosing an MBBS offer',
    ctaText: 'Bring your academic profile and intended country of practice for a recognition first assessment.',
  },
  {
    slug: 'china-intakes-deadlines',
    code: 'CN INTAKES',
    title: 'China Intakes and University Deadlines',
    metaTitle: 'China Intakes and Deadlines 2027 | EduExpress',
    description: 'Plan March and September China intakes using verified university deadlines, closed status logic and source dated application records.',
    eyebrow: 'Current source before application action',
    directAnswer: 'March and September are common study periods in China, while each university, program and scholarship controls its own application window. The EduExpress central directory currently contains 68 China university profiles. Every shortlisted route receives a current source, program, intake, deadline and next review check before application action begins.',
    facts: [
      { value: '68', label: 'Current directory profiles', note: 'Connected to the central program database' },
      { value: 'Current', label: 'Application status', note: 'Confirmed from the program source before action' },
      { value: '2', label: 'Common study periods', note: 'March and September, subject to university notice' },
    ],
    sections: [
      { heading: 'September intake planning', summary: 'September is common for degree routes, but application periods can close months earlier and scholarship windows may be different from self funded admission.' },
      { heading: 'March intake planning', summary: 'March options can be more limited by university, program and level. Confirm the exact admission notice rather than assuming a program repeats every semester.' },
      { heading: 'Complete deadline record', summary: 'A current intake entry connects every action to the exact program and official source.', items: ['University and exact program', 'Study level and teaching language', 'Application opening and closing dates', 'Arrival or registration date', 'Official source URL', 'Last verified and next review dates'] },
      { heading: 'Current status logic', summary: 'A future intake becomes actionable when the official notice and review date are current. A passed window moves into next cycle planning until the new notice is published.' },
      { heading: 'Scholarship and admission windows differ', summary: 'A university may accept self funded applications after a scholarship route has closed. Treat each route as a separate deadline.' },
    ],
    changeRisks: ['University seat availability', 'Scholarship quotas and earlier closing dates', 'Program or teaching language changes', 'Registration and arrival instructions'],
    notSuitable: ['Students who use the current official program notice', 'Applicants starting document preparation well before the target window', 'Students who match the deadline to the exact university and program'],
    faqs: [
      { question: 'What are the main China intakes?', answer: 'March and September are common, but program availability and deadlines are university specific.' },
      { question: 'How are current database deadlines activated?', answer: 'A deadline becomes actionable after its exact program, official source and current review date are confirmed.' },
      { question: 'How do scholarship and self funded deadlines compare?', answer: 'They are tracked separately because scholarship windows can close earlier and use a different portal or document route.' },
      { question: 'When should a Bangladeshi student start?', answer: 'Start document and fit screening well before the target intake, then act only on the current official university or scholarship notice.' },
    ],
    sources: [campusChina, csca, embassy],
    related: [...commonRelated, { label: 'China scholarship deadlines', href: '/china-scholarships-bangladesh' }],
    ctaTitle: 'Check the next suitable intake for your profile',
    ctaText: 'The team will match your profile to the current program, scholarship and intake records for the next suitable route.',
  },
  {
    slug: 'life-in-china-bangladeshi-students',
    code: 'CN LIFE',
    title: 'Life in China for Bangladeshi Students',
    metaTitle: 'Life in China for Bangladeshi Students | Practical Guide',
    description: 'Plan housing, halal food, language, banking, insurance, safety, culture and realistic student responsibilities in China.',
    eyebrow: 'Arrival readiness beyond admission',
    directAnswer: 'Life in China can work well for a Bangladeshi student who plans beyond admission. Housing rules, food access, language, banking, mobile services, insurance, campus conduct and local registration can differ by city and university. Halal food may be available on or near campus, but students should verify the actual area rather than assume. Work and internship activity must follow current university and immigration rules. A practical pre departure plan should identify first week tasks, emergency contacts, payment access and the limits of EduExpress support.',
    facts: [
      { value: '1st week', label: 'Arrival plan', note: 'Registration, housing, mobile access and banking' },
      { value: 'City', label: 'Daily cost driver', note: 'Housing and food access vary by location' },
      { value: 'Current', label: 'Work rules', note: 'Verify with university and authorities' },
    ],
    sections: [
      { heading: 'Housing and campus arrival', summary: 'Confirm whether accommodation is reserved, its payment period, room type, curfew or visitor rules and what is included.', items: ['Airport or station arrival plan', 'Campus registration point and required documents', 'Hostel deposit and refund status', 'Off campus permission where relevant'] },
      { heading: 'Halal food and daily living', summary: 'Ask current students or the university about campus canteens, nearby halal restaurants, grocery options and kitchen access. Availability differs by city and campus.' },
      { heading: 'Language and communication', summary: 'English taught study does not remove the value of practical Chinese. Basic language ability helps with transport, healthcare, shopping, housing and administrative tasks.' },
      { heading: 'Banking, mobile access and payments', summary: 'Prepare accepted identity and university documents, understand local payment systems, and keep an accessible emergency payment method during setup.' },
      { heading: 'Safety, health and student responsibility', summary: 'Follow campus and local rules, maintain required insurance, store emergency contacts and report document or residence issues promptly.' },
      { heading: 'Work and internship planning', summary: 'Build the essential budget independently, then check any work or internship activity against current university permission and immigration rules before it begins.' },
    ],
    changeRisks: ['Hostel availability and campus rules', 'Local registration processes', 'Banking and mobile verification requirements', 'Work or internship permissions'],
    notSuitable: ['Students with essential costs covered independently of part time work', 'Students ready to adapt to local language and campus rules', 'Students arriving with housing and emergency planning'],
    faqs: [
      { question: 'Is halal food available for Bangladeshi students in China?', answer: 'It may be available on or near many campuses, but access varies by city and location. Verify the actual university area before deciding.' },
      { question: 'Do I need Chinese for an English taught program?', answer: 'It may not be the classroom entry requirement, but practical Chinese can be important for daily life and clinical or community interaction.' },
      { question: 'How can international students plan work in China?', answer: 'Check the current university and immigration permission before any paid activity or internship, and keep essential study costs independently funded.' },
      { question: 'What should I prepare for the first week?', answer: 'Plan registration, housing, medical or insurance steps, mobile access, banking, emergency contacts and transport from the arrival point.' },
    ],
    sources: [embassy, embassyVisa, visaCenter],
    related: [...commonRelated, { label: 'China student visa guide', href: '/china-student-visa-bangladesh' }],
    ctaTitle: 'Add arrival readiness to your China decision',
    ctaText: 'A suitable route includes housing, daily cost and practical support, not only the admission letter.',
  },
  {
    slug: 'china-visa-first-policy',
    code: 'CN TERMS',
    title: 'China Visa First Service Policy',
    metaTitle: 'China Visa First Service Policy | EduExpress',
    description: 'Understand EduExpress China service fee timing, third party cost exceptions, written itemization, responsibilities and outcome limits.',
    eyebrow: 'Exact payment terms in writing',
    directAnswer: 'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds. This policy controls EduExpress service fee timing, while genuine university and authority charges remain separate. Universities, scholarship bodies and the responsible authorities issue the official decisions.',
    facts: [
      { value: '0', label: 'File opening charge', note: 'No fee for opening the China file' },
      { value: 'After visa', label: 'EduExpress service fee', note: 'Subject to the written service agreement' },
      { value: 'Written', label: 'Earlier third party costs', note: 'Itemized before the student proceeds' },
    ],
    sections: [
      { heading: 'EduExpress charges', summary: 'The EduExpress service fee is separate from university and authority charges. The written agreement should define the service scope, milestone and amount.' },
      { heading: 'Third party charges that may be due earlier', summary: 'An external recipient may require payment before the visa decision.', items: ['University application or registration fee', 'Tuition or seat deposit required by the university', 'Embassy or visa service charges', 'Medical examination or insurance', 'Translation, notarisation and courier'] },
      { heading: 'Every cost needs five facts', summary: 'Before payment, the cost sheet should state the item, amount or calculation, recipient, due date and refund status.' },
      { heading: 'Student responsibilities', summary: 'The student must provide authentic documents, disclose relevant history, review the written cost sheet and meet university and authority deadlines.' },
      { heading: 'EduExpress responsibilities and limits', summary: 'EduExpress provides the agreed guidance, application proof tracking and visa readiness support. Universities, scholarship bodies and government authorities make their own decisions.' },
      { heading: 'Example cost separation', summary: 'A university deposit paid to the institution is not an EduExpress service fee. A medical charge paid to a clinic is not an EduExpress service fee. The written cost sheet should make that distinction visible.' },
    ],
    changeRisks: ['University deposits and refund rules', 'Authority and medical charges', 'Scope agreed for a particular student', 'External deadlines and recipient instructions'],
    notSuitable: ['Students who understand that genuine third party payments may be due earlier', 'Applicants who understand where each official decision is made', 'Students ready to review the written recipient and refund status'],
    faqs: [
      { question: 'Is there a China file opening charge?', answer: 'No. EduExpress does not charge a file opening fee for the China service.' },
      { question: 'When is the EduExpress China service fee paid?', answer: 'No EduExpress service fee is due before China visa approval, subject to the written service agreement.' },
      { question: 'Can a university fee be required before visa approval?', answer: 'Yes. A university, embassy, medical provider or another third party may require a genuine earlier payment. It must be itemized in writing before the student proceeds.' },
      { question: 'What does a payment cover?', answer: 'Each payment covers the service or third party item stated in writing. The responsible authorities issue admission, scholarship and visa decisions.' },
    ],
    sources: [embassyVisa, visaCenter, embassy],
    related: [...commonRelated, { label: 'Fees and transparency', href: '/fees-and-transparency' }],
    ctaTitle: 'Request your China cost and responsibility summary',
    ctaText: 'Start with a fit assessment, then receive the relevant payment items and recipients in writing.',
  },
] satisfies ChinaGuidePage[]).map(item => [item.slug, item]));
