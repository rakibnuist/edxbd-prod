import type { ChinaGuidePage } from './chinaGuidePages';
import facts from '../../data/research/china-scholarship-guide.json';
import nuistResearch from '../../data/research/nuist-programme-details.json';

const standard = facts.standardCsc;
const money = (value: number) => `${standard.currency} ${value.toLocaleString('en-US')}`;
const nuist = nuistResearch.universities.find(university => university.slug === 'nuist')!;
const freshmen = nuist.scholarshipOptions.filter(award => award.id.startsWith('nuist-freshmen-'));

export const chinaScholarshipGuide: ChinaGuidePage = {
  slug: 'china-scholarships-bangladesh', code: 'CN FUNDING',
  title: 'China Scholarships for Bangladeshi Students',
  metaTitle: 'China Scholarships for Bangladesh | EduExpress International',
  description: 'Compare CSC stipends, age requirements, documents, Type A and Type B routes, university awards and renewal rules for Bangladeshi students.',
  eyebrow: 'Choose your scholarship route',
  directAnswer: 'Bangladeshi students can explore Chinese Government Scholarships (CGS, often called CSC scholarships), provincial schemes and university awards. A standard full CSC award supports tuition, accommodation, a living stipend and medical insurance; partial awards cover selected items. Start with your degree and major, then match the scholarship’s academic, age, language and nomination requirements. Use the comparisons below to understand benefits, documents and application routes. The final award confirms your support, and continued funding can depend on an annual review.',
  facts: standard.categories.slice(0, 3).map(category => ({ value: `${money(category.monthlyStipend)}/month`, label: `${category.label} living stipend`, note: 'Standard full CSC award; other schemes differ' })),
  sections: [
    {
      heading: 'Scholarship options at a glance',
      summary: 'Compare the sponsor, supported study and application channel before comparing the headline value. Each scheme has its own eligible universities and majors.',
      table: { columns: ['Scholarship family', 'Study focus', 'Application starting point'], rows: [
        ['Chinese Government Scholarship / CSC', 'Degree study and eligible scholar routes', 'Dispatching authority, participating university or designated programme'],
        ['Provincial or municipal scholarship', 'Selected institutions within the sponsoring region', 'Participating university and local scheme instructions'],
        ['University scholarship', 'Institution-specific degrees or study options', 'University international admissions office'],
        ['International Chinese Language Teachers Scholarship', 'Chinese language education and specified related study', 'Eligible recommending institution and host university'],
        ['MOFCOM scholarship', 'Selected postgraduate professional-development programmes', 'Programme nomination instructions and participating institution'],
      ] },
    },
    {
      heading: 'What a full CSC award covers',
      summary: 'The standard full award has four parts. A partial scholarship can fund only some of them. Support applies to the approved study period and registration conditions.',
      cards: [
        { title: 'Tuition waiver', body: 'The scholarship covers approved tuition through the host university; it is not a tuition-sized cash payment to the student.' },
        { title: 'Accommodation', body: 'A university dormitory or an approved housing subsidy. Off-campus support depends on university permission and the scheme; do not budget for both a free room and a housing payment.' },
        { title: 'Living stipend', body: 'Paid through the host university after the required registration. Ask when payments begin and keep arrival funds available.' },
        { title: 'Medical insurance', body: `The published policy value is ${money(standard.insurance.annualPolicyValue)} per person per year, or ${money(standard.insurance.shortProgrammePolicyValue)} for programmes shorter than ${standard.insurance.shortProgrammeMonthsExclusive} months. This is insurance coverage, not an extra cash stipend.` },
      ],
      table: { columns: ['Student category', 'Standard monthly stipend'], rows: standard.categories.map(category => [category.label, `${money(category.monthlyStipend)} / month`]) },
    },
    {
      heading: 'CSC eligibility by study level',
      summary: 'The standard criteria below apply to CSC applications. Applicants must be non-Chinese citizens in good physical and mental health, with the academic ability required by the host. A university or specialist scheme can add conditions.',
      table: { columns: ['Apply as', 'Academic starting point', 'Standard age condition'], rows: standard.categories.map(category => [category.label, category.qualification, `Under ${category.ageLimitExclusive}`]) },
      items: ['For a Bangladeshi undergraduate application, prepare HSC/A Level or equivalent evidence alongside the required school records.', 'A minimum GPA is not uniform across all universities. Check the major’s subject prerequisites and accepted grading scale.', 'Meeting an age or qualification threshold makes an application eligible for consideration; it does not secure an award.'],
    },
    {
      heading: 'Type A and Type B explained',
      summary: 'These labels identify application routes. Type A is not a synonym for full funding, and Type B does not mean partial funding.',
      table: { columns: ['Route', 'Who receives the application', 'What you need to confirm'], rows: [
        ['Type A · bilateral', 'The designated dispatching or nominating authority for your country', 'Bangladesh-specific instructions, nomination arrangements, programme category and agency number'],
        ['Type B · university', 'A participating Chinese university under the stated CSC programme', 'Eligible major, university portal, CSC submission and any pre-admission or supervisor requirement'],
      ] },
      cards: [
        { title: 'Agency number', body: 'Use the number supplied by the receiving authority or university. In the CSC system, check that the displayed institution matches your intended recipient. Do not copy a code from an unrelated route.' },
        { title: 'Admission versus scholarship', body: 'A university application, pre-admission letter or supervisor invitation is not the final scholarship award. Complete each required submission and keep the official result.' },
      ],
    },
    {
      heading: 'Specialist and regional programmes',
      summary: 'Some CSC programmes use a separate nomination channel or restrict the applicant group. A familiar scholarship name does not establish eligibility for a Bangladeshi applicant.',
      disclosures: [
        { title: 'UNESCO / China Great Wall', body: 'A nominated fellowship route for eligible invited countries. UNESCO programme guidance includes visiting scholar and specified postgraduate options. Contact the National Commission for UNESCO about national selection; submitting the CSC form alone does not replace nomination.' },
        { title: 'WMO and meteorology routes', body: 'Specialist schemes support meteorology, hydrology and related study. The relevant WMO nomination and host requirements apply. For example, the separate NUIST–WMO fellowship lists master’s and doctoral meteorology routes; do not assume every WMO scheme supports the same levels or benefits.' },
        ...facts.regionalSchemes.map(scheme => ({ title: scheme.name, body: `${scheme.scope}. Application channel: ${scheme.receiver}. This is a regional eligibility route, not a general scholarship option based solely on a Bangladeshi passport.` })),
      ],
    },
    {
      heading: 'Language evidence and CSCA',
      summary: 'Teaching-language readiness and undergraduate academic assessment are separate checks. The scholarship baseline may be lower than the university’s actual entry requirement.',
      table: { columns: ['Study route', 'What to prepare'], rows: [
        ['Chinese-taught general or senior scholar', standard.language.chineseGeneralSeniorBaseline],
        ['Chinese-taught master’s or PhD', standard.language.chineseMasterPhdBaseline],
        ['English or another teaching language', standard.language.otherTeachingLanguages],
        ['CSC bachelor’s application', 'A valid CSCA score report and the subjects required for your intended major'],
      ] },
      items: ['An English-medium programme can still require CSCA. Any Professional Chinese exemption does not automatically exempt you from the other subjects.', 'Use the programme’s accepted test scores and validity rules. MOI acceptance for admission does not automatically satisfy scholarship selection.'],
    },
    {
      heading: 'Prepare the application documents',
      summary: 'Your admission documents support both self-funded and scholarship study. Add the funding route’s forms, nomination and supporting evidence. The exact receiving institution sets the checklist.',
      cards: [
        { title: 'Identity and academic records', body: 'Passport, highest qualification and complete transcripts. Prospective graduates should check accepted graduation evidence; supply the required Chinese or English translations and authentication.' },
        { title: 'Language and entrance results', body: 'Valid language evidence for the teaching route, plus CSCA for bachelor’s applications where required. Match the subjects and result format to the major.' },
        { title: 'Study or research plan', body: 'Explain your academic background, intended study, research interests and proposed outcomes. Use the required language and programme-specific length; published guides do not all use the same minimum.' },
        { title: 'Recommendations and admission materials', body: 'Academic recommendations and pre-admission or supervisor documents when required. Postgraduate routes commonly request two professor or associate-professor recommendations.' },
        { title: 'Health, background and guardian evidence', body: 'Required physical examination and non-criminal record. Check document validity, complete medical signatures and stamps, and guardian documents for applicants under 18.' },
        { title: 'Scholarship-specific evidence', body: 'CSC application form, nomination, portfolio, research achievements or other evidence specified by the scheme. An arts portfolio or professional recommendation is not required for every major.' },
      ],
    },
    {
      heading: 'Apply through the correct channel',
      summary: 'Use your own accessible account and follow the receiving authority’s instructions. EduExpress International can help prepare the file; CSC, universities and nominating bodies make the official decisions.',
      steps: [
        { title: 'Shortlist a degree and host', body: 'Check the scholarship’s eligible university, exact major, teaching language and supported study period.' },
        { title: 'Confirm your application route', body: 'Obtain the correct programme category and agency number. Arrange nomination or pre-admission where the scheme requires it.' },
        { title: 'Complete the required applications', body: 'Register through Campus China’s Scholarship Application for Students entry point. Enter consistent personal, academic and programme details, and complete a university application too when instructed.' },
        { title: 'Upload and submit the file', body: 'Use clear, authentic records and check every required field. Save the submitted application form and identifying reference.' },
        { title: 'Track responses and corrections', body: 'Monitor the system and your email. If withdrawal is permitted to make a correction, submit again after editing so the application can be processed.' },
        { title: 'Review the final award', body: 'Check the named university, major, support period, benefits and registration conditions before using the award in your budget.' },
      ],
    },
    {
      heading: 'Other funding and university examples',
      summary: 'Government, local and institutional awards have different sponsors and conditions. Check whether concurrent awards are prohibited before combining benefits.',
      disclosures: [
        { title: 'Shanghai Government Scholarship', body: 'Category A supports tuition, accommodation, living expenses and medical insurance. Category B supports tuition and medical insurance. These categories are separate from CSC Type A and Type B. Awards depend on the participating university and annual evaluation.' },
        { title: 'International Chinese Language Teachers Scholarship', body: 'Designed for Chinese language education and related specified study. Check the host and recommending institution, career or study focus, and the relevant HSK/HSKK evidence. It is not a funding promise for every general Chinese-language course.' },
        { title: 'MOFCOM professional-development programmes', body: 'Selected postgraduate schemes target professional capacity building. Programme-specific study, work background, nomination and receiving-institution rules determine eligibility. Use the actual programme instructions rather than ordinary CSC assumptions.' },
      ],
      table: { columns: ['Published NUIST Freshmen award', 'Coverage example'], rows: freshmen.map(award => [award.title, award.coverage.join(' ')]) },
      items: ['NUIST examples show six award classes from the university’s published scheme, subject to eligibility, selection and the final award.', 'A university PhD allowance can differ from the CSC PhD stipend. Do not substitute one scheme’s value for another.'],
    },
    {
      heading: 'Renewal and your remaining budget',
      summary: 'Funding can depend on an annual review of academic progress, attendance, conduct and the institution’s conditions. Failure can lead to suspension or cancellation. Check the approved period before assuming support for an extension or a change of major.',
      cards: [
        { title: 'Keep an unfunded-cost plan', body: 'Account for travel, document preparation, application charges, deposits, uncovered room costs and personal spending. Airfare is included only where your specific award expressly covers it.' },
        { title: 'Use ClearCost by university', body: 'Apply only the stated tuition reduction and explicit fee waivers. Keep CNY and BDT separate until a rate is supplied, and do not subtract a future stipend from the cash needed before arrival.' },
      ],
    },
  ],
  changeRisks: ['Eligible countries, majors and supported study periods', 'Host language and CSCA requirements', 'Nomination, pre-admission and application instructions', 'Covered costs, disbursement and annual review'],
  notSuitable: ['Applicants matching the scholarship to their education and career plans', 'Students prepared for competitive assessment and authentic documentation', 'Families able to plan the costs outside a confirmed award'],
  faqs: [
    { question: 'How much is the CSC monthly stipend?', answer: 'The standard full CSC award provides CNY 2,500 for undergraduates, CNY 3,000 for master’s students and general scholars, and CNY 3,500 for doctoral students and senior scholars per month. Other scholarships and partial awards can differ.' },
    { question: 'Is CSC Type A fully funded and Type B partially funded?', answer: 'No. Type A and Type B describe application channels. The particular scholarship sets the benefits; read its written coverage rather than treating the route label as a funding percentage.' },
    { question: 'Can Bangladeshi students apply for every programme listed by CSC?', answer: 'No. Some schemes require country-specific nomination, specialist backgrounds or regional citizenship. EU, AUN and PIF programmes have their own regional restrictions; an ordinary Bangladeshi passport alone does not satisfy them.' },
    { question: 'Is an admission or pre-admission letter a scholarship award?', answer: 'No. It can support the application, but the receiving university or scholarship authority must separately confirm selection and funding.' },
    { question: 'Can I apply without IELTS?', answer: 'Only when the chosen programme and funding route accept your alternative evidence. Check the university’s English-language requirements and any stricter scholarship rules; MOI is not a universal exemption.' },
    { question: 'Does a full scholarship include airfare and every expense?', answer: 'Not automatically. Confirm travel support and other benefits in the specific award. Tuition, housing, insurance and a stipend do not by themselves prove that every deposit, journey or personal expense is covered.' },
    { question: 'Does the scholarship renew automatically?', answer: 'Continued support can require an annual review. Check academic progress, attendance, conduct, programme-change rules and the approved funding period. Missing the required standard can suspend or end the award.' },
    { question: 'Are scholarship documents separate from admission documents?', answer: 'Prepare the university admission file for every study route. Then add any scholarship forms, nomination, pre-admission or other supporting evidence requested for that award.' },
  ],
  sources: [{ label: 'Campus China scholarship catalogue', href: facts.internal.requestedCatalogue }, ...facts.internal.sources.map(source => ({ label: source.publisher, href: source.url }))],
  related: [
    { label: 'Study in China', href: '/study-in-china-from-bangladesh' },
    { label: 'Admission documents and CSCA', href: '/china-admission-requirements' },
    { label: 'NUIST scholarship coverage', href: '/universities/nuist#scholarships' },
    { label: 'Compare Chinese universities', href: '/china-universities' },
    { label: 'Study costs and ClearCost', href: '/study-in-china-cost-bangladesh' },
  ],
  ctaTitle: 'Find a suitable scholarship route',
  ctaText: 'Share your qualifications, intended major and budget. EduExpress International can help you compare eligibility, prepare the application file and understand the costs that remain.',
};
