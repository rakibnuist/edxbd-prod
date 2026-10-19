import type { ChinaGuidePage } from './chinaGuidePages';
import research from './chinaStudyResearch.json';
import { chinaScholarshipGuide } from './chinaScholarshipGuide';

// These records present the detailed research by topic. Original sources,
// check dates and admission cycles remain unchanged in the research library.
const sourcesFor = (...ids: string[]) => research.sources.filter(source => ids.includes(source.id)).map(source => ({ label: source.publisher, href: source.url }));
const visaCenter = { label: 'Chinese Visa Application Service Center in Dhaka', href: 'https://www.visaforchina.cn/DAC4_EN/' };
const csca = { label: 'Official CSCA portal', href: 'https://csca.cn/' };
const chinaTerms = 'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';
const commonRelated = [
  { label: 'Study in China', href: '/study-in-china-from-bangladesh' },
  { label: 'Compare Chinese universities', href: '/china-universities' },
];

export const chinaFocusedGuides: ChinaGuidePage[] = [
  {
    slug: 'china-admission-requirements', code: 'CN ADMISSION',
    title: 'China Admission Requirements',
    metaTitle: 'China Admission Requirements | EduExpress International',
    description: 'Prepare for China university admission from Bangladesh: qualifications, documents, CSCA, teaching language and an application plan for your study level.',
    eyebrow: 'Build your application',
    directAnswer: 'China university admission starts with the requirements of your chosen degree and major. Bangladeshi applicants should prepare SSC and HSC or equivalent records for undergraduate assessment, or university qualifications for postgraduate study. Academic subjects, teaching language, CSCA, age conditions and supporting documents vary by institution. Organise the common application file, then compare the exact requirements on each university profile. Admission, scholarship selection and the student visa are separate decisions.',
    facts: [
      { value: 'HSC+', label: 'Undergraduate assessment', note: 'SSC, HSC or equivalent records' },
      { value: 'Degree', label: 'Postgraduate assessment', note: 'Academic background and research fit' },
      { value: 'CSCA', label: 'Undergraduate entrance check', note: 'Subjects depend on your major' },
    ],
    sections: [
      { heading: 'Choose the right study level', summary: 'Your previous qualification is the starting point. The university decides equivalence, prerequisites and whether additional preparation is needed.', table: { columns: ['Study route', 'Academic starting point', 'What to confirm'], rows: [
        ['Bachelor’s degree', 'High-school graduation: HSC, A levels or an accepted equivalent', 'Required subjects, grades, age rules and CSCA subjects'],
        ['Master’s degree', 'A recognised bachelor’s degree or accepted equivalent', 'Subject background, degree authentication, language proof and recommendations'],
        ['PhD', 'A relevant master’s degree for the standard route', 'Research proposal, supervisor and any expressly offered direct-entry route'],
        ['Language or foundation', 'The specific preparation course’s requirements', 'Language entry point, duration and written progression conditions'],
      ] } },
      { heading: 'Prepare your admission documents', summary: 'Documents support every university application, including self-funded study. A scholarship may add its own forms or evidence; it does not replace the admission checklist.', cards: [
        { title: 'Identity and education', body: 'Valid passport, photograph, graduation or degree certificates and full transcripts. Prospective graduates should check whether expected-graduation evidence is accepted.' },
        { title: 'Language and entrance evidence', body: 'Accepted English or Chinese evidence, plus CSCA or another entrance result where required. Match the subjects and test language to the programme.' },
        { title: 'Study and research preparation', body: 'Study plan or research proposal. Postgraduate routes may require academic recommendations, a CV, publications or supervisor acceptance.' },
        { title: 'Supporting records', body: 'Health examination, non-criminal record, financial evidence and guardian documents where requested. Check validity, translations, authentication and original-copy rules.' },
      ] },
      { heading: 'Understand CSCA and language proof', summary: 'CSCA assesses undergraduate academic readiness. IELTS, TOEFL, an accepted MOI letter or HSK addresses teaching-language readiness. Satisfying one check does not automatically satisfy the other.', table: { columns: ['Check', 'Purpose', 'Your next action'], rows: [
        ['CSCA Mathematics', 'Fundamental academic readiness for relevant undergraduate routes', 'Confirm the university’s subject list and accepted test language'],
        ['CSCA Physics or Chemistry', 'Preparation for the chosen subject', 'Use the major-specific requirements'],
        ['Professional Chinese', 'Chinese-medium undergraduate readiness where required', 'Check the appropriate track and any stated exemption'],
        ['English or Chinese proof', 'Readiness in the teaching language', 'Check accepted evidence, scores and any interview'],
      ] } },
      { heading: 'Build your application file', summary: 'Prepare in a practical order so the same authentic records can support your admission and funding applications.', steps: [
        { title: 'Define your subject and career goal', body: research.preparation[0].task },
        { title: 'Match your academic background', body: 'Compare your qualifications, subject results, grading scale and research interests with the programme. Do not convert a Bangladeshi GPA into an assumed percentage.' },
        { title: 'Prepare and check your records', body: 'Request transcripts and references, arrange required translation or authentication, and keep names and passport details consistent.' },
        { title: 'Submit the correct applications', body: 'Follow the university and funding route’s separate instructions. Keep submitted files, payment receipts and access to your own application accounts.' },
        { title: 'Review the offer before committing', body: research.preparation[3].task },
      ] },
      { heading: 'Check recognition and progression', summary: research.risks[1].body, cards: [
        { title: 'Medicine and regulated careers', body: 'Discuss the exact foreign medical degree, internship and return-to-practice route with BMDC before payment. Other regulated professions have their own authority and licensing requirements.' },
        { title: 'Language and foundation progression', body: 'Ask which grades, language level, assessment and separate degree application are needed, and whether preparation is self-funded. Completing it does not by itself secure a degree place or scholarship.' },
      ] },
    ],
    changeRisks: ['Programme prerequisites and accepted qualifications', 'CSCA subjects and language evidence', 'Document formats, authentication and validity', 'Supervisor, progression and recognition requirements'],
    notSuitable: ['Applicants comparing their actual qualifications with a specific major', 'Students ready to supply authentic records', 'Families checking recognition and the full budget'],
    faqs: [
      { question: 'Is there one minimum GPA for every Chinese university?', answer: research.faqs[0].answer },
      { question: 'Are documents only needed for scholarships?', answer: 'No. Admission documents support self-funded and scholarship applications. Each university sets its checklist; a funding route may require additional evidence.' },
      { question: 'Can I apply before final results are issued?', answer: 'Some universities accept expected-graduation or current-student evidence. Confirm the accepted proof and the final documents needed to meet offer conditions.' },
      { question: 'Does English-taught admission remove the CSCA requirement?', answer: research.faqs[2].answer },
    ],
    sources: [...sourcesFor('zju-2026', 'thu-2027', 'usst-2026', 'csca-guidance', 'bmdc-eligibility'), csca],
    related: [...commonRelated, { label: 'English proof and MOI', href: '/study-in-china-without-ielts' }, { label: 'Scholarship requirements', href: '/china-scholarships-bangladesh' }],
    ctaTitle: 'Find your admission route', ctaText: 'Share your qualifications and preferred subject. EduExpress International can help you compare suitable programmes and prepare the right application file.',
  },
  {
    slug: 'study-in-china-cost-bangladesh', code: 'CN COSTS',
    title: 'Cost of Studying in China',
    metaTitle: 'Study in China Costs & Fees | EduExpress International',
    description: 'Plan China study costs from Bangladesh with university fee examples, two payment stages, scholarship deductions and CNY-to-BDT budgeting guidance.',
    eyebrow: 'Know your full budget',
    directAnswer: 'The cost of studying in China depends on your university, major, teaching language, accommodation and confirmed scholarship. Start with programme-specific tuition in CNY, then add expenses before travel and after arrival. Keep an EduExpress Package priced in BDT in its own currency. Compare published fee examples, then open the university’s ClearCost calculator for an editable estimate. A tuition waiver reduces only the costs stated in the award; your complete budget also includes everyday living and travel.',
    facts: [
      { value: '2 stages', label: 'When you pay', note: 'Before China and in China' },
      { value: 'CNY', label: 'University costs', note: 'Keep original prices and billing periods' },
      { value: 'BDT', label: 'Your family budget', note: 'Convert using your bank’s quoted rate' },
    ],
    sections: [
      { heading: 'Before China', summary: 'Separate university payments from the EduExpress service fee. Include a deposit only when required and confirm whether it is credited toward tuition.', table: { columns: ['Cost item', 'What to record', 'Payment check'], rows: [
        ['Application fee', 'University application processing charge', 'Amount, official recipient and refund status'],
        ['Deposit, if required', 'Seat or tuition prepayment', 'Tuition credit and refund conditions'],
        ['EduExpress Package', 'Published package or agreed written quote', 'Original currency and the service agreement'],
      ] } },
      { heading: 'In China', summary: 'Calculate tuition after the confirmed reduction and add uncovered costs. Keep one-time, semester, annual and monthly charges separate.', table: { columns: ['Cost item', 'Include in the budget', 'Check the basis'], rows: [
        ['Tuition', 'Full fee less the confirmed tuition award and credited deposit', 'Per programme, semester or academic year'],
        ['Accommodation', 'Confirmed room fee, deposits and utilities', 'Room allocation and billing period'],
        ['Insurance', 'Required policy and uncovered protection', 'Coverage, exclusions and insured period'],
        ['Medical examination', 'Required local examination or verification', 'Acceptance of previous results'],
        ['Residence permit', 'Applicable local immigration charge', 'Permit type and authorised study period'],
        ['Other costs', 'Books, utilities and other applicable charges', 'Itemise so each cost is counted once'],
      ] } },
      { heading: 'Published university fee examples', summary: 'These show different fee structures, not a national average or personal quote. Confirm the charge for your chosen programme before payment.', table: { columns: ['University and option', 'Published charge', 'Important distinction'], rows: [
        [research.examples[0].name + ' · Chinese-taught humanities, economics or management bachelor’s', research.examples[0].facts[0].value, 'Subject and language-specific annual tuition'],
        [research.examples[0].name + ' · English-taught science and technology bachelor’s', research.examples[0].facts[1].value, 'Housing and everyday living are additional'],
        [research.examples[2].name + ' · Beijing double dormitory room', research.examples[2].facts[2].value, 'Per bed per day; successful reservation required'],
      ] } },
      { heading: 'Add travel and everyday living', summary: 'Budget for food, transport, phone/data, books, clothing, flights, baggage and onward campus travel. Include document preparation, required tests and visa charges before departure. Use actual quotes and a city-specific plan instead of one China-wide living-cost estimate.', cards: [
        { title: 'A housing backup', body: 'Check alternatives if campus housing is unavailable, including holiday occupancy, utility charges, bedding and any rental deposit.' },
        { title: 'Cash before a stipend arrives', body: 'Ask when scholarship payments begin. Keep arrival funds and a family contingency for expenses due before an allowance is disbursed.' },
      ] },
      { heading: 'Apply scholarship deductions correctly', summary: research.faqs[3].answer, steps: [
        { title: 'Start with gross tuition', body: 'Use the full programme fee and exact period. A semester fee is not automatically an annual fee.' },
        { title: 'Apply the written award', body: 'Enter the confirmed percentage or fixed tuition reduction. A living allowance is not a tuition discount.' },
        { title: 'Avoid double counting', body: 'Credit an eligible tuition deposit once. Add accommodation and insurance only if still payable after the award.' },
      ] },
      { heading: 'Keep CNY and BDT clear', summary: 'CNY and RMB name the same currency. Keep university costs in CNY and your package in its published currency. For a BDT plan, use a bank or remittance quote, add transfer charges and allow for currency movement. ClearCost converts only when you enter a rate.' },
      { heading: 'EduExpress payment terms', summary: chinaTerms },
    ],
    changeRisks: ['Tuition, billing period and deposit treatment', 'Room allocation and utility charges', 'Scholarship coverage and disbursement', 'Exchange rates and personal spending'],
    notSuitable: ['Students comparing the full study cost', 'Families planning uncovered expenses', 'Applicants who want recipients and refund terms in writing'],
    faqs: [
      { question: 'How much does study in China cost from Bangladesh?', answer: 'There is no single reliable total. Use the exact programme tuition, room and confirmed award, then add travel, living and administrative costs. University ClearCost calculators keep the items and currencies separate.' },
      { question: 'Does a full tuition scholarship cover everything?', answer: research.faqs[3].answer },
      { question: 'Can I calculate the budget in BDT?', answer: 'Enter your bank or remittance provider’s CNY-to-BDT rate in ClearCost. A package already priced in BDT remains in BDT and is added once.' },
      { question: 'Will a deposit be added to tuition twice?', answer: 'Select the tuition-credit option only when the university confirms it. Otherwise keep the deposit separate and check its refund conditions.' },
    ],
    sources: [...sourcesFor('sdu-fees', 'thu-2027', 'zju-2026'), visaCenter],
    related: [...commonRelated, { label: 'Scholarship coverage', href: '/china-scholarships-bangladesh' }, { label: 'China payment policy', href: '/china-visa-first-policy' }],
    ctaTitle: 'Build your China study budget', ctaText: 'Choose a university and programme, then get help reviewing tuition, scholarship support and the payments you need to plan.',
  },
  chinaScholarshipGuide,
  {
    slug: 'china-student-visa-bangladesh', code: 'CN VISA',
    title: 'China Student Visa from Bangladesh',
    metaTitle: 'China Student Visa: X1 & X2 | EduExpress International',
    description: 'Prepare a China student visa application from Bangladesh: X1 and X2 categories, university documents, financial evidence, Dhaka process and arrival planning.',
    eyebrow: 'Prepare for study and arrival',
    directAnswer: 'The China student visa route depends on study length: X1 is for more than 180 days, while X2 is for no more than 180 days. Start with your university-issued study documents, then follow the Dhaka visa application process and its document prompts. Visa assessment is separate from university admission and scholarship selection. Plan the application, payments and arrival with room to respond to further requests.',
    facts: [
      { value: 'X1', label: 'Long-term study', note: 'More than 180 days' },
      { value: 'X2', label: 'Short-term study', note: 'No more than 180 days' },
      { value: 'Dhaka', label: 'Application preparation', note: 'Follow official visa-centre instructions' },
    ],
    sections: [
      { heading: 'Choose X1 or X2', summary: 'Use the university-confirmed study period. A language course may be short or long; its name alone does not determine the category.', table: { columns: ['Category', 'Study period', 'Prepare'], rows: [
        ['X1', 'More than 180 days', 'Admission letter, JW201/JW202 study confirmation and requested supporting evidence'],
        ['X2', 'No more than 180 days', 'University study documents and the category-specific checklist'],
      ] } },
      { heading: 'Organise the visa file', summary: 'Match passport and university details throughout the application. The admission file alone is not a complete visa checklist.', cards: [
        { title: 'Passport and application', body: 'Check validity, blank pages, photograph and online form against visa-centre instructions. Protect access to your application account.' },
        { title: 'University evidence', body: 'Resolve missing or inconsistent names, study periods and campus details with the university before submission.' },
        { title: 'Funding evidence', body: 'Provide scholarship proof where applicable. Published Embassy X1 guidance asks self-funded applicants for bank evidence of at least USD 2,500 per study year. This is a document threshold, not the full study budget.' },
        { title: 'Additional records', body: 'Supply further academic, health or other evidence when requested. Do not assume every admission document is a universal visa requirement.' },
      ] },
      { heading: 'Follow the Dhaka process', summary: 'The official centre provides online application and tracking. Follow instructions for your own case.', steps: [
        { title: 'Prepare and submit online', body: 'Select the study category, complete the form and upload requested evidence through the official service.' },
        { title: 'Respond to review requests', body: 'Check your account for corrections, extra evidence or an interview instruction.' },
        { title: 'Submit your passport', body: 'After online review permits submission, follow instructions for originals, passport handling, any biometrics and payment.' },
        { title: 'Track and collect', body: 'Follow official collection instructions, retain fee receipts and check the issued visa before departure.' },
      ] },
      { heading: 'Plan arrival and residence', summary: 'Where the visa requires a residence permit after entry, the National Immigration Administration requires an application within 30 days. X1 students need school study-period evidence and admission or enrolment documentation. Coordinate registration, accommodation and any health formalities with the international office.', items: ['Know the correct campus and arrival contact', 'Carry essential original records securely', 'Follow the conditions printed on your issued visa and permit'] },
      { heading: 'Budget for the process', summary: 'Check charges for your case, document preparation, travel and arrival. Keep official receipts. Avoid non-refundable travel commitments based only on an admission offer or estimated processing period.' },
      { heading: 'EduExpress support and terms', summary: chinaTerms },
    ],
    changeRisks: ['Evidence requested for the visa category', 'Review, interview and passport instructions', 'Authority charges and processing arrangements', 'Arrival and local residence formalities'],
    notSuitable: ['Students with consistent university and identity records', 'Applicants ready to respond to official requests', 'Families separating admission, scholarship and visa decisions'],
    faqs: [
      { question: 'Is exactly 180 days an X1 or X2 route?', answer: 'The published boundary places study of no more than 180 days under X2. Confirm the study period and category with the university and authority.' },
      { question: 'Does an admission offer guarantee a visa?', answer: 'No. The visa authority assesses the application separately and may ask for further evidence.' },
      { question: 'Is bank evidence my complete study budget?', answer: 'No. Plan tuition, accommodation, living, travel and applicable charges beyond the document threshold.' },
      { question: 'Is X1 the same as a residence permit?', answer: 'No. Complete required residence formalities after entry with the responsible local authority and university guidance.' },
    ],
    sources: [...sourcesFor('bd-visa', 'nia-residence'), visaCenter, { label: 'Dhaka visa centre: fee receipts', href: 'https://www.visaforchina.cn/DAC3_EN/tongzhigonggao/473055413810630656.html' }],
    related: [...commonRelated, { label: 'Admission documents', href: '/china-admission-requirements' }, { label: 'China payment policy', href: '/china-visa-first-policy' }, { label: 'Prepare for student life', href: '/life-in-china-bangladeshi-students' }],
    ctaTitle: 'Prepare your study visa file', ctaText: 'Get help organising your university and visa records, checking consistency and planning the steps before departure.',
  },
  {
    slug: 'study-in-china-without-ielts', code: 'CN LANGUAGE',
    title: 'Study in China Without IELTS',
    metaTitle: 'Study in China Without IELTS | EduExpress International',
    description: 'Understand IELTS alternatives for China study from Bangladesh: MOI evidence, accepted English tests, university examples, HSK and separate CSCA requirements.',
    eyebrow: 'Choose your teaching language',
    directAnswer: 'Studying in China without IELTS may be possible when the exact programme accepts another form of language evidence. An official English medium-of-instruction letter, another accepted test or a university assessment may be an option. Acceptance differs by university, degree and scholarship. Check written requirements before relying on an exemption. Chinese-taught study has its own language rules; an English-taught offer does not automatically remove a separate undergraduate CSCA requirement.',
    facts: [
      { value: 'MOI', label: 'Possible English evidence', note: 'Only where the programme accepts it' },
      { value: 'HSK', label: 'Chinese-medium readiness', note: 'Required level differs by programme' },
      { value: 'CSCA', label: 'Separate academic check', note: 'Language exemption is not full exemption' },
    ],
    sections: [
      { heading: 'Check accepted English evidence', summary: 'An alternative at one university does not create a China-wide waiver. Admission and scholarship rules may differ.', table: { columns: ['Evidence', 'What it shows', 'Confirm'], rows: [
        ['IELTS or TOEFL', 'Externally assessed English result', 'Accepted version, score and validity'],
        ['Other accepted test', 'An alternative named by the programme', 'Test, minimum score and verification'],
        ['MOI letter', 'Previous qualification taught in English', 'Issuing institution, stamp and accepted wording'],
        ['Interview or assessment', 'University-assessed readiness', 'Whether offered and what additional proof is needed'],
      ] } },
      { heading: 'What an MOI letter establishes', summary: 'The institution that taught or awarded the previous qualification should confirm the teaching language. Ask the receiving university what it accepts.', cards: [
        { title: 'Academic context', body: 'Identify the applicant, qualification and period of study, and state the genuine medium of instruction.' },
        { title: 'Official issue', body: 'Use the authorised office, letterhead and required stamp or signature. Keep a contact for verification.' },
      ] },
      { heading: 'Published university examples', summary: 'Use these as institution-specific examples, then check the selected programme and funding route.', cards: [
        { title: 'University of Shanghai for Science and Technology', body: 'Its published FAQ lists IELTS 6.0, TOEFL 80 or an officially stamped English MOI statement from the previous degree-granting institution.' },
        { title: 'Nanjing University of Information Science and Technology', body: 'The supplied brochure lists TOEFL iBT 80+, IELTS 6.0+, Duolingo 100+ or official previous English-medium study evidence for the relevant English route. Scholarship test rules may be stricter.' },
      ] },
      { heading: 'Chinese-medium study and HSK', summary: 'Check the precise HSK level and score, any speaking-test requirement and result validity. Entry and graduation language standards may differ. A language or preparatory course also has its own progression conditions.' },
      { heading: 'Keep CSCA separate', summary: 'For undergraduate routes requiring CSCA, an English-medium applicant may be exempt from Professional Chinese while still needing Mathematics and any programme-specific Physics or Chemistry. Confirm subjects and paper language with the university.' },
      { heading: 'Choose a realistic language route', summary: 'Select the language in which you can understand lectures, complete assessments and participate in academic work.', steps: [
        { title: 'Choose the major', body: 'Use the university programme catalogue’s medium-of-instruction filter.' },
        { title: 'Match your evidence', body: 'Check your test or genuine MOI against both admission and scholarship requirements.' },
        { title: 'Resolve missing requirements', body: 'Ask about an accepted alternative, assessment or preparation route before paying for an application.' },
      ] },
    ],
    changeRisks: ['Accepted tests and scores', 'MOI format and issuing institution', 'Scholarship language rules', 'Academic entrance and graduation requirements'],
    notSuitable: ['Students with genuine teaching-language readiness', 'Applicants checking a specific major’s evidence rules', 'Students open to testing or preparation when needed'],
    faqs: [
      { question: 'Does every Chinese university accept MOI?', answer: 'No. It depends on the programme and funding route. Check the university’s stated policy for your qualification.' },
      { question: 'Can a consultancy issue my MOI certificate?', answer: 'MOI evidence should come from the appropriate education institution. A consultancy cannot replace official academic evidence.' },
      { question: 'Does an IELTS waiver mean a CSCA waiver?', answer: research.faqs[2].answer },
      { question: 'Do English-taught students need Mandarin?', answer: 'Practical Mandarin helps daily life. Check any separate Chinese-language requirement for the degree, placements or graduation.' },
    ],
    sources: [...sourcesFor('usst-2026', 'bnu-2026', 'csca-guidance'), csca, { label: 'NUIST international programmes', href: 'https://gjy.nuist.edu.cn/english/Prospectus/listm.htm' }],
    related: [...commonRelated, { label: 'Admission and CSCA', href: '/china-admission-requirements' }, { label: 'NUIST programmes', href: '/universities/nuist#programs' }],
    ctaTitle: 'Check your language pathway', ctaText: 'Tell EduExpress International your subject, preferred language and existing evidence to compare suitable programmes.',
  },
  {
    slug: 'life-in-china-bangladeshi-students', code: 'CN STUDENT LIFE',
    title: 'Life in China for Bangladeshi Students',
    metaTitle: 'Student Life in China | EduExpress International',
    description: 'Prepare for student life in China from Bangladesh: campus housing, halal food questions, payments, Mandarin, healthcare, support and internship permissions.',
    eyebrow: 'Make campus life work for you',
    directAnswer: 'Student life in China begins with practical choices about campus, accommodation, food, payments and support. Confirm arrangements at your university before travelling, especially halal dining, room allocation, arrival help and healthcare. English-taught study can still involve everyday Mandarin outside class. Build a realistic living budget and understand work or internship permissions. Experience varies by city and campus, so specific questions are more useful than a general promise about life across China.',
    facts: [
      { value: 'Campus', label: 'Your daily base', note: 'Confirm room, food and arrival arrangements' },
      { value: 'Mandarin', label: 'Everyday communication', note: 'Useful beyond an English-taught classroom' },
      { value: 'Support', label: 'Know where to ask', note: 'International office, advisers and wellbeing services' },
    ],
    sections: [
      { heading: 'Plan arrival and housing', summary: research.life[0].body, steps: [
        { title: 'Confirm your accommodation', body: 'Get the room or rental terms, correct campus address, move-in instructions and an arrival contact.' },
        { title: 'Build an arrival file', body: 'Keep passport, admission, accommodation and health records accessible. Save your address in Chinese and English.' },
        { title: 'Complete local procedures', body: 'Follow university and local authority instructions for registration, health and residence formalities.' },
      ] },
      { heading: 'Food, faith and daily routines', summary: 'Facilities differ by campus. Ask directly about your needs instead of assuming every university offers the same service.', cards: [
        { title: 'Halal and dietary needs', body: 'Check suitable dining facilities, food preparation, opening arrangements and nearby alternatives. Ask about cooking rules and the distance from housing.' },
        { title: 'Prayer and community', body: 'Ask about available campus and nearby arrangements. Contact the international office or recognised student groups for orientation.' },
        { title: 'Practical Mandarin', body: 'Learn phrases for transport, dining and appointments. Keep addresses and essential health information in a form local staff can understand.' },
      ] },
      { heading: 'Banking and payments', summary: research.life[2].body, table: { columns: ['Prepare', 'Ask or check'], rows: [
        ['Overseas card', 'Foreign-use settings, supported payments and bank charges'],
        ['Mobile payment', 'Supported card linking, verification and limits'],
        ['Local account', 'Required documents and university guidance'],
        ['Backup funds', 'A second payment option and accessible emergency money'],
      ] } },
      { heading: 'Healthcare and support', summary: 'Read your insurance coverage and exclusions, identify healthcare arrangements and save support contacts. Ask about academic advising, disability support and wellbeing services.', cards: [
        { title: 'Know where to ask', body: 'Save international office, accommodation and appropriate emergency contacts. Report problems through the university’s stated channels.' },
        { title: 'Protect documents and accounts', body: 'Keep secure record copies and protect payment credentials. Share identity documents only with a legitimate recipient for a clear purpose.' },
      ] },
      { heading: 'Work and internships need permission', summary: 'Off-campus part-time work or internships require university approval and the appropriate remarks on a student residence permit. A study permit alone does not authorise them. Confirm the permitted location and duration with the university and local exit-entry authority before starting. Do not fund your plan with an assumed job.' },
      { heading: 'Build a personal living budget', summary: 'Plan food, transport, phone/data, books, personal care and clothing for the climate. Include utilities, holiday housing and a reserve for unexpected travel or health costs. Compare actual campus options and your habits instead of assuming one figure fits every city.' },
    ],
    changeRisks: ['Room allocation and campus rules', 'Dining, dietary and faith arrangements', 'Payment-provider verification and fees', 'Insurance and internship permissions'],
    notSuitable: ['Students preparing practical campus questions', 'Families planning a sustainable living budget', 'Applicants ready to follow local procedures and seek support'],
    faqs: [
      { question: 'Does every university have a halal canteen?', answer: 'Do not assume it. Ask your campus which options meet your dietary needs and what alternatives are available.' },
      { question: 'Can I use a foreign bank card?', answer: 'Supported cards and mobile-payment linking may be available. Verification and charges depend on the provider; check your bank and arrange a backup method.' },
      { question: 'Can a part-time job pay for my study?', answer: 'Do not rely on unauthorised work. Off-campus jobs or internships need university approval and the required residence-permit remarks.' },
      { question: 'Who helps international students settle in?', answer: 'Start with the international office and accommodation team. Ask about orientation, academic advice, wellbeing services and recognised student communities.' },
    ],
    sources: sourcesFor('shanghai-student-life', 'shanghai-payments', 'nia-residence'),
    related: [...commonRelated, { label: 'Study and living budget', href: '/study-in-china-cost-bangladesh' }, { label: 'Visa and arrival', href: '/china-student-visa-bangladesh' }],
    ctaTitle: 'Plan your campus transition', ctaText: 'Compare universities around your subject, budget and daily needs. EduExpress International can help you prepare practical questions before choosing.',
  },
];
