import { NEW_7_GUIDE_SPECS, upsert7NewUniversities } from './seo-new-7-guides-2027.mjs';
import { WECHAT_15_GUIDE_SPECS, upsert15WechatUniversities } from './seo-wechat-15-guides-2027.mjs';
import { WECHAT_BATCH2_18_GUIDE_SPECS, upsert18WechatBatch2Universities } from './seo-wechat-18-batch2-guides-2027.mjs';
import { WECHAT_BATCH3_25_GUIDE_SPECS, upsert25WechatBatch3Universities } from './seo-wechat-25-batch3-guides-2027.mjs';
import { SHENYANG_CITY_UNIVERSITY_GUIDE_SPECS, upsertShenyangCityUniversity } from './seo-shenyang-city-university-2027.mjs';
import { WECHAT_BATCH4_9_GUIDE_SPECS, upsertWechatBatch4Universities } from './seo-wechat-batch4-guides-2027.mjs';
import { WECHAT_BATCH5_7_GUIDE_SPECS, upsertWechatBatch5Universities } from './seo-wechat-batch5-guides-2027.mjs';
import { TOP_MS_CS_AI_2027_DATA } from '../../src/data/topMsCsAiChina2027Guide.ts';
import { OPEN_UNIVERSITIES_2027_DATA } from '../../src/data/chinaUniversitiesOpen2027Guide.ts';
import { CSC_UNIVERSITY_LIST_2027_DATA } from '../../src/data/cscUniversityList2027Guide.ts';
import { CONFUCIUS_SCHOLARSHIP_2027_DATA } from '../../src/data/confuciusInstituteScholarship2027Guide.ts';
import { FOUNDATION_SCHOLARSHIPS_DATA } from '../../src/data/foundationYearScholarshipsGuide.ts';
import { MALAYSIA_UNIVERSITIES_2027_DATA } from '../../src/data/malaysiaUniversities2027Guide.ts';
import { GKS_SCHOLARSHIP_2027_DATA } from '../../src/data/gksScholarship2027Guide.ts';
import { CHINA_BACHELOR_SCHOLARSHIPS_2027_DATA } from '../../src/data/chinaBachelorDegreeScholarships2027Guide.ts';
import { GEORGIA_MBBS_FEES_2027_DATA } from '../../src/data/georgiaMbbsFees2027Guide.ts';
import { CUHK_PROGRAMS_2027_DATA } from '../../src/data/cuhkProgramsGuide2027.ts';
import { UK_RED_BRICK_2027_DATA } from '../../src/data/ukRedBrickUniversitiesGuide2027.ts';

/**
 * Official verified university data repairs and 2027 E-E-A-T update guides for
 * priority high-volume search topics (Nanchang University MSc/CSC Type B &
 * Chengdu Normal University admission/fees/scholarship clarity).
 *
 * Every external domain, tuition figure, deadline, and agency code here is
 * backed directly by verified institutional notices (ncu.edu.cn / iec.ncu.edu.cn
 * and cdnu.edu.cn / lxs.cdnu.edu.cn) or existing catalog records.
 */

const NANCHANG_OFFICIAL_SOURCES = [
  'https://www.ncu.edu.cn/',
  'https://iec.ncu.edu.cn/',
  'https://iec.ncu.edu.cn/info/1691/22826.htm',
  'https://iec.ncu.edu.cn/lxnd/ssxm.htm',
  'https://apply.ncu.edu.cn/',
  'https://www.campuschina.org/',
];

const CHENGDU_NORMAL_OFFICIAL_SOURCES = [
  'https://www.cdnu.edu.cn/',
  'https://lxs.cdnu.edu.cn/',
  'https://www.campuschina.org/',
];

const CGS_2027_TYPE_A_SOURCES = [
  'https://www.campuschina.org/',
  'http://bd.china-embassy.gov.cn/eng/',
];

const CMU_OFFICIAL_SOURCES = [
  'https://www.cmu.edu.cn/',
  'https://www.cmu.edu.cn/gjjyxy/',
  'https://www.cmu.edu.cn/gjjyxy/zsxx/dsxx.htm',
  'https://www.campuschina.org/',
];

const SDJU_OFFICIAL_SOURCES = [
  'https://www.sdju.edu.cn/',
  'https://intlst.sdju.edu.cn',
  'https://mp.weixin.qq.com/s/8mY_ckNOqfgUzLAxt03e5g',
];

const NJUST_OFFICIAL_SOURCES = [
  'https://study.njust.edu.cn/',
  'https://njust.17gz.org/',
  'https://studyinchina.csc.edu.cn/',
  'https://www.csca.cn/',
  'https://mp.weixin.qq.com/s/QPiDsTTFgaHSEjgH3U4gug',
  'https://mp.weixin.qq.com/s/lDKxcSGHtDJDgMjB_zy8SA',
];

const GUIDE_2027_SPECS = [
  CUHK_PROGRAMS_2027_DATA,
  UK_RED_BRICK_2027_DATA,
  CHINA_BACHELOR_SCHOLARSHIPS_2027_DATA,
  GEORGIA_MBBS_FEES_2027_DATA,
  MALAYSIA_UNIVERSITIES_2027_DATA,
  GKS_SCHOLARSHIP_2027_DATA,
  CONFUCIUS_SCHOLARSHIP_2027_DATA,
  FOUNDATION_SCHOLARSHIPS_DATA,
  CSC_UNIVERSITY_LIST_2027_DATA,
  TOP_MS_CS_AI_2027_DATA,
  OPEN_UNIVERSITIES_2027_DATA,
  {
    slug: 'njust-csc-and-lanshan-scholarships-2027',
    title:
      'Nanjing University of Science & Technology (NJUST) CSC & Lanshan Scholarships 2027: International Student Admissions Guide',
    metaTitle: 'NJUST CSC & Lanshan Scholarships 2027 | EduExpress',
    metaDescription:
      'Official 2027 Nanjing University of Science and Technology (NJUST) admissions guide: CSC Type B (Agency 10288) & Lanshan scholarships for international students.',
    excerpt:
      'Official 2027 admission & scholarship guide for Nanjing University of Science and Technology (NJUST): CSC High-Level Postgraduate Program (Type B, Agency 10288, deadline 5 March 2027) and NJUST Lanshan Scholarship (Bachelor, Master, PhD, deadline 15 May 2027). Dual-system application, eligibility, CSCA requirements, stipends, and document checklists.',
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships', 'Admissions']),
    tags: JSON.stringify([
      'njust',
      'nanjing university of science and technology',
      'csc type b 2027',
      'lanshan scholarship',
      'study in nanjing',
      'china scholarship 2027',
      'csc agency 10288',
      'international students china',
    ]),
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    featuredImage: '/updates/covers/njust-csc-and-lanshan-scholarships-2027.jpg',
    sourceUrls: JSON.stringify(NJUST_OFFICIAL_SOURCES),
    deadlineAt: new Date('2027-03-05T23:59:59.000Z'),
    content: `<p class="lede"><strong><a href="/universities/nanjing-university-of-science-and-technology">Nanjing University of Science and Technology</a> (南京理工大学, NJUST)</strong>, a leading national key university directly administered by China's Ministry of Industry and Information Technology (MIIT) and ranked among the global top 1‰ by Clarivate ESI in Engineering, Materials Science, Computer Science, and Chemistry, has officially released its comprehensive international admissions brochures for the <strong>September 2027 Intake</strong>. This announcement covers two major government and institutional scholarship schemes open to international candidates worldwide: the <strong>Chinese Government Scholarship &ndash; High-Level Postgraduate Program (CSC Type B, Agency No. 10288)</strong> and the prestigious university-endowed <strong>NJUST Lanshan Scholarship (南京理工大学“澜杉”奖学金)</strong> across Bachelor, Master, and Doctoral degree levels.</p>

<aside class="key-facts">
  <h2>NJUST 2027 Scholarship Programs: Key Facts at a Glance</h2>
  <table><tbody>
    <tr><th>Host Institution</th><td><a href="/universities/nanjing-university-of-science-and-technology">Nanjing University of Science and Technology (NJUST)</a></td></tr>
    <tr><th>Campus Location</th><td>Nanjing, Jiangsu Province, China (Historic Capital of Six Dynasties)</td></tr>
    <tr><th>Supervising Authority</th><td>Ministry of Industry and Information Technology (MIIT) &amp; Ministry of Education (MoE) PR China</td></tr>
    <tr><th>Global Academic Standing</th><td>Project 211 &middot; Double First-Class &middot; Top 1&permil; ESI Worldwide in Engineering, Materials Science, Computer Science &amp; Chemistry</td></tr>
    <tr><th>Scholarship Scheme 1</th><td><strong>Chinese Government Scholarship (CGS Type B &mdash; High-Level Postgraduate)</strong> &middot; Agency No. <strong>10288</strong></td></tr>
    <tr><th>CSC Type B Eligible Levels</th><td>Master's (3 Years) &middot; Doctoral / PhD (4 Years) &mdash; English or Chinese Taught</td></tr>
    <tr><th>CSC Type B Benefits</th><td>100% Tuition waiver, On-campus accommodation, Comprehensive medical insurance, Monthly living stipend (Master's: CNY 3,000/mo &middot; PhD: CNY 3,500/mo)</td></tr>
    <tr><th>CSC Type B Application Deadline</th><td><strong>5 March 2027</strong> (Dual application via CGSIS &amp; NJUST Portal)</td></tr>
    <tr><th>Scholarship Scheme 2</th><td><strong>NJUST Lanshan Scholarship (澜杉奖学金)</strong> &middot; Institutional Excellence Award</td></tr>
    <tr><th>Lanshan Eligible Levels</th><td>Undergraduate (4 Years) &middot; Master's (3 Years) &middot; Doctoral / PhD (4 Years)</td></tr>
    <tr><th>Lanshan Funding Tiers</th><td><strong>Undergraduate:</strong> Tier A+ (Tuition + Dorm + CNY 1,000/mo), Tier A (Tuition), Tier B (50% Tuition), Tier C (Dorm)<br><strong>Master's:</strong> Full (Tuition + Dorm + CNY 1,500/mo stipend)<br><strong>Doctoral:</strong> Tier A (Tuition + Dorm + CNY 3,500/mo), Tier B (Tuition + Dorm + CNY 2,500/mo), Tier C (Tuition + Dorm + CNY 1,500/mo)</td></tr>
    <tr><th>Lanshan Application Deadline</th><td><strong>15 May 2027</strong> (Online via njust.17gz.org)</td></tr>
    <tr><th>Undergraduate Exam Requirement</th><td>China Scholastic Competency Assessment (CSCA) score report mandatory for all undergraduate applicants</td></tr>
    <tr><th>University Application Fee</th><td>CNY 500 (Non-refundable, payable directly in the NJUST online application portal)</td></tr>
    <tr><th>Intake Semester</th><td>September 2027 (Autumn Intake)</td></tr>
    <tr><th>Target Applicants</th><td>International students worldwide of all nationalities (non-Chinese citizens)</td></tr>
  </tbody></table>
</aside>

<div class="callout">
  <h3>📱 Social Media Quick Summary (Copy &amp; Share)</h3>
  <p>Share this verified 2027 Nanjing University of Science &amp; Technology scholarship notice with international candidates:</p>
  <blockquote>
    🇨🇳 <strong>NANJING UNIVERSITY OF SCIENCE &amp; TECHNOLOGY (NJUST) | 2027 SCHOLARSHIP ADMISSIONS OPEN!</strong> 🎓✨<br><br>
    Looking for fully funded or high-stipend engineering, computer science, materials, or management programs in China for September 2027? Nanjing University of Science and Technology (南京理工大学, Agency No. 10288) has officially opened admissions for international students worldwide!<br><br>
    📍 <strong>Location:</strong> Nanjing, Jiangsu Province, China<br>
    🏆 <strong>Institutional Standing:</strong> National Key University (MIIT) &middot; Double First-Class &middot; Top 1&permil; ESI globally in CS, Engineering &amp; Chemistry<br>
    🏛️ <strong>Eligible Levels:</strong> Bachelor's (4 yrs), Master's (3 yrs), PhD (4 yrs)<br>
    🌐 <strong>Instruction:</strong> English or Chinese taught<br><br>
    🎁 <strong>SCHOLARSHIP HIGHLIGHTS:</strong><br>
    1️⃣ <strong>CSC Type B High-Level Postgraduate (Agency 10288):</strong><br>
    &bull; 100% Tuition Waived + Free On-Campus Dormitory<br>
    &bull; Monthly Living Allowance: Master's CNY 3,000/mo &middot; PhD CNY 3,500/mo<br>
    &bull; Comprehensive Medical Insurance included<br>
    &bull; ⏰ <strong>CSC Deadline: 5 March 2027</strong><br><br>
    2️⃣ <strong>NJUST Lanshan Scholarship (Undergraduate &amp; Graduate):</strong><br>
    &bull; Undergraduate (A+ Tier): Full tuition + Free room + CNY 1,000/mo stipend (CSCA required)<br>
    &bull; Master's: Full tuition + Free room + CNY 1,500/mo stipend<br>
    &bull; PhD: Full tuition + Free room + Up to CNY 3,500/mo stipend<br>
    &bull; ⏰ <strong>Lanshan Deadline: 15 May 2027</strong><br><br>
    📋 <strong>Key Requirements:</strong> Valid foreign passport, certified degree/transcripts, study plan (&ge;1,000 words), 2 recommendation letters, physical exam form, police clearance, supervisor letter (recommended for grad), CSCA exam (for undergrad).<br><br>
    🔗 <strong>Full Admissions &amp; Application Guide:</strong> <a href="https://eduexpressint.com/updates/njust-csc-and-lanshan-scholarships-2027">https://eduexpressint.com/updates/njust-csc-and-lanshan-scholarships-2027</a><br>
    💬 <strong>Free International Student Assessment:</strong> WhatsApp +880 1983-333566 | <a href="/education-fit-assessment">eduexpressint.com/education-fit-assessment</a>
  </blockquote>
</div>

<h2>1. About Nanjing University of Science and Technology (NJUST)</h2>
<p>Founded in 1953 and nestled near the iconic Purple Mountain in Nanjing, <strong>Nanjing University of Science and Technology</strong> is one of China’s most prestigious engineering and research universities. Subordinated directly to the Ministry of Industry and Information Technology (MIIT), NJUST comprises 21 specialized schools and hosts over 35,000 students, including more than 800 international scholars from across the globe.</p>

<p>NJUST features world-class research infrastructure with 12 national key laboratories, 69 provincial-level research centers, and 111 National Science and Technology Awards. According to Clarivate's Essential Science Indicators (ESI), 12 of NJUST’s disciplines rank in the global top 1%, with <strong>Engineering, Materials Science, Computer Science, and Chemistry</strong> ranking within the top 0.1% (1&permil;) globally.</p>

<h2>2. Scholarship Scheme 1: CSC High-Level Postgraduate Program (Type B)</h2>
<p>The <strong>Chinese Government Scholarship &ndash; High-Level Postgraduate Program (Type B)</strong> is an elite national award intended to recruit high-caliber international graduate students to study at leading Chinese institutions.</p>

<h3>Key Parameters for NJUST CSC Type B:</h3>
<ul>
  <li><strong>CSC Agency Number:</strong> <code>10288</code></li>
  <li><strong>Program Category:</strong> <code>Type B</code></li>
  <li><strong>Eligible Degrees:</strong> Master’s Degree (3 years) and Doctoral / PhD Degree (4 years).</li>
  <li><strong>Instruction Medium:</strong> English or Chinese.</li>
  <li><strong>Full Award Package:</strong>
    <ul>
      <li>100% Tuition fee fully covered.</li>
      <li>Free accommodation in the international student dormitory on campus (or an authorized accommodation subsidy).</li>
      <li>Monthly living stipend: <strong>CNY 3,000 per month</strong> for Master’s candidates; <strong>CNY 3,500 per month</strong> for Doctoral candidates.</li>
      <li>Comprehensive Medical Insurance for International Students in China (CNY 800/year, provided uniformly by the university).</li>
    </ul>
  </li>
  <li><strong>Eligibility Criteria:</strong>
    <ul>
      <li>Non-Chinese citizen in good physical and mental health.</li>
      <li>Master’s applicants: Bachelor’s degree holder, generally under 35 years of age.</li>
      <li>Doctoral applicants: Master’s degree holder, generally under 40 years of age.</li>
      <li>Language Proficiency: For English-taught programs, IELTS &ge; 6.0, TOEFL &ge; 85, Duolingo &ge; 105, or official proof of previous degree taught in English. For Chinese-taught programs, HSK Level 5 (&ge;180 points) or higher.</li>
    </ul>
  </li>
  <li><strong>Application Window:</strong> Opens 20 October 2026; Closes <strong>5 March 2027</strong>.</li>
</ul>

<h3>Dual-System Submission is Mandatory:</h3>
<p>Type B applicants must complete synchronized applications in both online portals:</p>
<ol>
  <li><strong>System 1 (CGSIS):</strong> Visit the China Scholarship Council portal at <a href="https://studyinchina.csc.edu.cn" target="_blank" rel="noopener noreferrer">studyinchina.csc.edu.cn</a>, register an account, choose Category <code>Type B</code>, enter Agency No. <code>10288</code>, upload all required application files, and download the signed CSC Application Form.</li>
  <li><strong>System 2 (NJUST Portal):</strong> Visit the NJUST international application platform at <a href="https://njust.17gz.org" target="_blank" rel="noopener noreferrer">njust.17gz.org</a> (or <a href="http://admission.njust.edu.cn" target="_blank" rel="noopener noreferrer">admission.njust.edu.cn</a>), register, upload identical documents, and remit the <strong>CNY 500 application fee</strong> inside the portal.</li>
</ol>

<blockquote>
  <p><strong>Fail-Safe Fallback:</strong> International candidates who apply for CSC Type B but are not selected by the China Scholarship Council are automatically eligible to be evaluated for the <strong>NJUST Lanshan Scholarship</strong>, ensuring strong applicants retain a direct scholarship opportunity.</p>
</blockquote>

<h2>3. Scholarship Scheme 2: NJUST Lanshan Scholarship (澜杉奖学金)</h2>
<p>The <strong>Lanshan Scholarship</strong> is an institutional fund established by Nanjing University of Science and Technology to attract and support outstanding international students at the Undergraduate, Master’s, and Doctoral levels. It prioritizes applicants in NJUST's top-tier engineering, computer science, artificial intelligence, materials, and management programs.</p>

<h3>Lanshan Scholarship Funding Tiers:</h3>
<table>
  <thead>
    <tr>
      <th>Study Level</th>
      <th>Scholarship Tier</th>
      <th>Coverage &amp; Monthly Benefits</th>
      <th>Duration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4"><strong>Undergraduate</strong></td>
      <td><strong>Tier A+</strong></td>
      <td>100% Tuition Waived + Free On-Campus Dormitory + <strong>CNY 1,000 / month</strong> Stipend</td>
      <td>4 Years</td>
    </tr>
    <tr>
      <td><strong>Tier A</strong></td>
      <td>100% Tuition Waived (Accommodation self-funded)</td>
      <td>4 Years</td>
    </tr>
    <tr>
      <td><strong>Tier B</strong></td>
      <td>50% Tuition Reduction</td>
      <td>4 Years</td>
    </tr>
    <tr>
      <td><strong>Tier C</strong></td>
      <td>Free On-Campus Dormitory Waiver (Tuition self-funded)</td>
      <td>4 Years</td>
    </tr>
    <tr>
      <td><strong>Master's</strong></td>
      <td><strong>Full Scholarship</strong></td>
      <td>100% Tuition Waived + Free On-Campus Dormitory + <strong>CNY 1,500 / month</strong> Stipend</td>
      <td>3 Years</td>
    </tr>
    <tr>
      <td rowspan="3"><strong>Doctoral (PhD)</strong></td>
      <td><strong>Tier A</strong></td>
      <td>100% Tuition Waived + Free On-Campus Dormitory + <strong>CNY 3,500 / month</strong> Stipend</td>
      <td>4 Years</td>
    </tr>
    <tr>
      <td><strong>Tier B</strong></td>
      <td>100% Tuition Waived + Free On-Campus Dormitory + <strong>CNY 2,500 / month</strong> Stipend</td>
      <td>4 Years</td>
    </tr>
    <tr>
      <td><strong>Tier C</strong></td>
      <td>100% Tuition Waived + Free On-Campus Dormitory + <strong>CNY 1,500 / month</strong> Stipend</td>
      <td>4 Years</td>
    </tr>
  </tbody>
</table>

<h3>Special Notice for Undergraduate Applicants: CSCA Requirement</h3>
<p>Undergraduate applicants must take the <strong>China Scholastic Competency Assessment (CSCA)</strong> and submit official score reports. Registrations and subject details are available through the official CSCA test portal at <a href="https://www.csca.cn" target="_blank" rel="noopener noreferrer">www.csca.cn</a>. Undergraduate admission and Lanshan scholarship awards are weighted 30% on academic performance &amp; CSCA results, 20% on language proficiency, and 50% on interview and comprehensive profile evaluation.</p>

<h2>4. Complete Application Document Checklist</h2>
<p>All candidates must submit clear scanned copies in English or Chinese. Documents in other languages must include notarized English or Chinese translations:</p>
<ol>
  <li><strong>Passport Identification Page:</strong> Valid for at least 12 months from the submission date.</li>
  <li><strong>Highest Academic Certificate:</strong> Certified Bachelor's degree (for Master's), Master's degree (for PhD), or High School Diploma (for Undergraduates). Graduating students must submit an official Pre-Graduation / Enrollment Certificate.</li>
  <li><strong>Official Academic Transcripts:</strong> Complete grade records stamped by the issuing institution.</li>
  <li><strong>Language Proficiency Certificate:</strong>
    <ul>
      <li>English-taught programs: IELTS 6.0, TOEFL 85, Duolingo 105, or official Medium of Instruction (MOI) certificate.</li>
      <li>Chinese-taught programs: HSK Level 5 (undergraduate/master's) or HSK Level 6 (doctoral).</li>
    </ul>
  </li>
  <li><strong>Study Plan or Research Proposal:</strong>
    <ul>
      <li>Undergraduate: Personal Statement of at least 800 words.</li>
      <li>Postgraduate: Research proposal of at least 1,000 words detailing research questions, methodology, and academic background. Having supervisor confirmation heavily increases competitiveness.</li>
    </ul>
  </li>
  <li><strong>Two Recommendation Letters:</strong> Signed letters from professors or associate professors (for graduate applicants) or high-school teachers (for undergraduate applicants), including contact details.</li>
  <li><strong>Supervisor Acceptance Letter (Recommended for Graduate Candidates):</strong> Prospective graduate candidates are strongly encouraged to browse the <a href="https://gs.njust.edu.cn/dsjs/list.htm" target="_blank" rel="noopener noreferrer">NJUST Supervisor Directory</a> and secure a preliminary acceptance or supervision intention letter.</li>
  <li><strong>Foreigner Physical Examination Form:</strong> Issued within the last 6 months, complete with doctor’s signature, hospital stamp, and attached laboratory test reports (HIV, Syphilis, Hepatitis, Chest X-ray).</li>
  <li><strong>Non-Criminal Record Certificate (Police Clearance):</strong> Issued within the last 6 months by relevant government authorities in your home country.</li>
  <li><strong>Financial Statement:</strong> Proof of funds / bank guarantee certificate demonstrating financial capability.</li>
  <li><strong>CSCA Score Report (Undergraduate Only):</strong> China Scholastic Competency Assessment score report from <a href="https://www.csca.cn" target="_blank" rel="noopener noreferrer">csca.cn</a>.</li>
</ol>

<h2>5. Admissions Timeline &amp; Key Deadlines</h2>
<ul>
  <li><strong>20 October 2026:</strong> Application portals open for September 2027 intake.</li>
  <li><strong>5 March 2027:</strong> <strong>Deadline for CSC High-Level Postgraduate Program (Type B).</strong></li>
  <li><strong>15 May 2027:</strong> <strong>Deadline for NJUST Lanshan Scholarship (Undergraduate, Master's, PhD).</strong></li>
  <li><strong>January &ndash; June 2027:</strong> Multi-round university evaluation, interviews, and conditional admission offers.</li>
  <li><strong>July 2027:</strong> Final admission letters and official visa application documents (JW202 / JW201 forms) issued to successful candidates.</li>
  <li><strong>Early September 2027:</strong> On-campus registration at NJUST in Nanjing, China.</li>
</ul>

<h2>6. Frequently Asked Questions (FAQ)</h2>
<div class="faq-accordion">
  <div class="faq-item">
    <h3>Q1: Can international students from all countries apply for NJUST scholarships?</h3>
    <p><strong>Yes.</strong> Both the CSC High-Level Postgraduate Program (Type B) and the NJUST Lanshan Scholarship are open to international applicants worldwide holding valid foreign passports (non-Chinese citizens). EduExpress International works with students globally to evaluate profiles, verify documentation, and assist with application filings.</p>
  </div>
  <div class="faq-item">
    <h3>Q2: Is the CSCA exam mandatory for graduate applicants?</h3>
    <p><strong>No.</strong> The CSCA exam is only mandatory for undergraduate applicants. Master's and Doctoral applicants are evaluated based on their undergraduate/postgraduate academic records, research plan, language proficiency, and supervisor alignment.</p>
  </div>
  <div class="faq-item">
    <h3>Q3: Is a Supervisor Acceptance Letter strictly required to apply for CSC Type B?</h3>
    <p>It is not strictly mandatory at the moment of initial submission, but securing an acceptance letter or intention of supervision from an NJUST professor significantly increases your chances of being shortlisted for the CSC Type B nomination.</p>
  </div>
  <div class="faq-item">
    <h3>Q4: What happens if an applicant is not awarded the CSC scholarship?</h3>
    <p>NJUST automatically considers qualified candidates who missed the CSC quota for the university's internal <strong>Lanshan Scholarship</strong>, provided their academic file meets institutional review standards.</p>
  </div>
  <div class="faq-item">
    <h3>Q5: What are EduExpress International's service terms for China applications?</h3>
    <p>In accordance with our strict transparency policy: <strong>No EduExpress service fee is due before China student visa approval.</strong> Third-party expenses &mdash; including the NJUST university application fee (CNY 500 paid directly in their portal), medical checks, document notarization, and courier fees &mdash; are itemized separately in writing before you proceed.</p>
  </div>
</div>

<h2>7. How to Apply &amp; Get Professional Profile Review</h2>
<p>Applying to elite Double First-Class institutions like NJUST requires meticulous supervisor outreach, strong research design, and aligned portal submissions. EduExpress International provides structured end-to-end support for international candidates globally:</p>
<ul>
  <li><strong>Academic Eligibility &amp; Supervisor Matching:</strong> Assessing your research background against NJUST faculty research tracks.</li>
  <li><strong>Research Proposal &amp; CV Guidance:</strong> Reviewing your 1,000-word study plan to meet top Chinese university expectations.</li>
  <li><strong>Dual-System Documentation Audit:</strong> Ensuring zero discrepancy between CGSIS and NJUST 17gz portal filings.</li>
  <li><strong>Visa Readiness &amp; Pre-Departure Briefing:</strong> Step-by-step assistance with JW202/JW201 forms, X1 visa appointments, and Nanjing arrival logistics.</li>
</ul>

<p><a href="/education-fit-assessment" class="btn btn-primary">Start Your Free Profile Assessment</a> &nbsp; <a href="https://wa.me/8801983333566?text=Hello%20EduExpress%2C%20I%20am%20interested%20in%20the%202027%20NJUST%20CSC%20and%20Lanshan%20Scholarships." target="_blank" rel="noopener noreferrer" class="btn btn-secondary">WhatsApp an Advisor: +880 1983-333566</a></p>
`,
  },
  {
    slug: 'shanghai-dianji-university-spring-2027-chinese-language',
    title: 'Shanghai DianJi University Spring 2027 Chinese Language Program: Admission & Cost Guide',
    metaTitle: 'Shanghai DianJi University Spring 2027 Language Admission',
    metaDescription:
      'Shanghai DianJi University opens Spring 2027 Chinese language admission. Tuition CNY 16,000/yr, dorm CNY 9,600, apply by 15 Dec 2026 via intlst.sdju.edu.cn.',
    excerpt:
      'Official 2027 Spring admission notice for Shanghai DianJi University (SDJU): 1-year Chinese Language Program (March 2027–Jan 2028), tuition CNY 16,000/yr, dorms in Lin-gang FTZ, and 15 Dec 2026 deadline.',
    category: 'China',
    categories: JSON.stringify(['China', 'Admissions', 'Language']),
    tags: JSON.stringify([
      'shanghai dianji university',
      'sdju',
      'study in shanghai',
      'chinese language program 2027',
      'spring 2027 china',
      'march 2027 intake',
      'lin-gang free trade zone',
    ]),
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    featuredImage:
      '/updates/covers/shanghai-dianji-university-spring-2027-chinese-language.jpg',
    sourceUrls: JSON.stringify(SDJU_OFFICIAL_SOURCES),
    deadlineAt: new Date('2026-12-15T15:59:59.000Z'),
    content: `<p class="lede"><strong><a href="/universities/shanghai-dianji-university">Shanghai DianJi University</a> (上海电机学院, SDJU)</strong> has officially opened international student admissions for its <strong>Spring 2027 Chinese Language Program (2027年春季国际学生汉语项目)</strong>. Situated in the prestigious Lin-gang Special Area of the Shanghai Pilot Free Trade Zone, this comprehensive 1-year Mandarin program runs from early March 2027 to early January 2028 with 640 intensive instructional hours (20 hours/week over 32 weeks). Applications are accepted directly through the SDJU international student portal until <strong>15 December 2026</strong> or until enrollment quotas are met.</p>

<aside class="key-facts">
  <h2>SDJU Spring 2027 Chinese Language: Key Facts at a Glance</h2>
  <table><tbody>
    <tr><th>Institution</th><td><a href="/universities/shanghai-dianji-university">Shanghai DianJi University (上海电机学院)</a>, Shanghai, China</td></tr>
    <tr><th>Location</th><td>Lin-gang Special Area, Shanghai Pilot Free Trade Zone, Pudong, Shanghai</td></tr>
    <tr><th>Program Track</th><td>Non-Degree Intensive Chinese Language &amp; Culture Program</td></tr>
    <tr><th>Intake Semester</th><td>Spring 2027 (Classes commence early March 2027)</td></tr>
    <tr><th>Program Duration</th><td>1 Academic Year (Early March 2027 &ndash; Early January 2028, 32 weeks, 640 class hours)</td></tr>
    <tr><th>Class Levels</th><td>Beginner Level &middot; Intermediate Level (Placement test upon arrival; HSK 4+ placed automatically in Intermediate)</td></tr>
    <tr><th>Application Deadline</th><td><strong>15 December 2026</strong> (Rolling admissions &mdash; early submission advised)</td></tr>
    <tr><th>Application Fee</th><td>CNY 400 (Non-refundable bank transfer to university account)</td></tr>
    <tr><th>Tuition Fee</th><td><strong>CNY 16,000 / academic year</strong></td></tr>
    <tr><th>On-Campus Accommodation</th><td>Double Room: CNY 9,600 / person / year &middot; Single Room: CNY 19,200 / person / year</td></tr>
    <tr><th>Comprehensive Insurance</th><td>CNY 800 / academic year</td></tr>
    <tr><th>Estimated Total Year 1 Cost</th><td>~CNY 26,400 / year (Tuition + On-Campus Double Room + Insurance &approx; $3,700 USD / &approx; 4.4 Lakh BDT)</td></tr>
    <tr><th>Official Online Portal</th><td><a href="https://intlst.sdju.edu.cn" target="_blank" rel="noopener noreferrer">intlst.sdju.edu.cn</a></td></tr>
    <tr><th>Admissions Inquiries</th><td>Ms. Pan &amp; Mr. Ray &middot; Tel: +86-21-38220166 &middot; Email: <a href="mailto:admission@sdju.edu.cn">admission@sdju.edu.cn</a></td></tr>
  </tbody></table>
</aside>

<div class="callout">
  <h3>📱 Social Media Quick Summary (Copy &amp; Share)</h3>
  <p>Share this verified March 2027 Shanghai language intake update with students looking to study in Shanghai:</p>
  <blockquote>
    🇨🇳 <strong>SHANGHAI DIANJI UNIVERSITY (SDJU) | SPRING 2027 CHINESE LANGUAGE ADMISSION</strong> 🎓🌸<br><br>
    Looking to study in Shanghai for the March 2027 intake? Shanghai DianJi University (上海电机学院) in the Shanghai Free Trade Zone has officially opened applications for its Spring 2027 1-Year Chinese Language Program!<br><br>
    📍 <strong>Location:</strong> Shanghai (Lin-gang Special Area, Free Trade Zone), China<br>
    📅 <strong>Intake &amp; Study Period:</strong> March 2027 – January 2028 (32 weeks / 640 class hours)<br>
    🎯 <strong>Class Levels:</strong> Beginner &amp; Intermediate (Placement test; HSK 4+ automatically placed in Intermediate)<br><br>
    💰 <strong>Verified Official Costs:</strong><br>
    &bull; Application Fee: CNY 400<br>
    &bull; Tuition Fee: CNY 16,000 / year<br>
    &bull; On-Campus Dorm: CNY 9,600 / year (Double room) | CNY 19,200 / year (Single room)<br>
    &bull; Medical Insurance: CNY 800 / year<br>
    👉 Total Annual Baseline: ~CNY 26,400 (~$3,700 USD / ~4.4 Lakh BDT)<br><br>
    📋 <strong>Eligibility:</strong><br>
    &bull; Age 18 and older<br>
    &bull; High school diploma (HSC / A-Level or equivalent)<br>
    &bull; Good health &amp; clean police record<br><br>
    📅 <strong>Application Deadline:</strong> 15 December 2026<br>
    🌐 <strong>Portal:</strong> intlst.sdju.edu.cn<br>
    📧 <strong>Admissions Email:</strong> admission@sdju.edu.cn | Tel: +86-21-38220166
  </blockquote>
  <p><a href="https://wa.me/?text=Shanghai%20DianJi%20University%20Spring%202027%20Language%20Program%20Guide%3A%20https%3A%2F%2Feduexpressint.com%2Fupdates%2Fshanghai-dianji-university-spring-2027-chinese-language" target="_blank" rel="noopener noreferrer">Share on WhatsApp</a> &nbsp; <a href="/education-fit-assessment">Check Eligibility with EduExpress</a></p>
</div>

<h2>Why Choose Shanghai DianJi University (SDJU)?</h2>
<p>Established in 1953, <strong>Shanghai DianJi University (SDJU)</strong> is a public institution of higher education recognized by the Ministry of Education (MoE) of the People's Republic of China. Home to approximately 15,000 students, SDJU operates with an engineering and advanced technology focus and hosts over 300 international students from 30+ countries each year.</p>
<p>The university's primary campus is located in the <strong>Lin-gang Special Area of the China (Shanghai) Pilot Free Trade Zone</strong>. This strategic location places international students in a booming modern urban zone surrounded by top multinational corporations, advanced manufacturing hubs, and scenic lakeside parks, offering unparalleled industry exposure, internship prospects, and modern smart campus facilities.</p>

<h2>Program Curriculum &amp; Placement</h2>
<p>The 2027 Spring Chinese Language Program consists of <strong>640 total instructional hours</strong> spread over 32 academic weeks (averaging 20 class hours per week). Classes focus on:</p>
<ul>
  <li><strong>Comprehensive Mandarin:</strong> Intensive spoken Chinese, listening comprehension, reading, and character writing.</li>
  <li><strong>HSK Test Preparation:</strong> Systematic coaching aimed at clearing HSK Level 3, Level 4, or Level 5, qualifying students for direct entry into English or Chinese-taught Bachelor degree programs in China.</li>
  <li><strong>Chinese Cultural Immersion:</strong> Traditional arts, calligraphy, tea culture, business etiquette, and cultural field trips across Shanghai.</li>
</ul>
<p><em>Placement System:</em> Students undergo a placement exam upon arrival to determine their class tier. Applicants who already hold a valid <strong>HSK Level 4 certificate or above</strong> are automatically assigned to the Intermediate Level Class.</p>

<h2>Accommodation &amp; Living Options</h2>
<p>SDJU offers multiple living arrangements for international students:</p>
<table>
  <thead>
    <tr>
      <th>Accommodation Type</th>
      <th>Room Category</th>
      <th>Official Cost</th>
      <th>Key Conditions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2"><strong>On-Campus Residence</strong></td>
      <td>Double Room</td>
      <td>CNY 9,600 / person / year</td>
      <td rowspan="2">Limited rooms; allocated strictly on a first-come, first-served basis. Paid by semester upon arrival.</td>
    </tr>
    <tr>
      <td>Single Room</td>
      <td>CNY 19,200 / person / year</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>Off-Campus Residence</strong></td>
      <td>Double Room</td>
      <td>&approx; CNY 7,000 / person / semester (&approx; CNY 14,000/yr)</td>
      <td rowspan="2">Subject to local Shanghai rental market fluctuations.</td>
    </tr>
    <tr>
      <td>Single Room</td>
      <td>&approx; CNY 14,000 / person / semester (&approx; CNY 28,000/yr)</td>
    </tr>
    <tr>
      <td><strong>Self-Sourced Housing</strong></td>
      <td>Private Apartment</td>
      <td>Market rate</td>
      <td>Students must register at the local Public Security Bureau (PSB) police station within 24 hours of moving.</td>
    </tr>
  </tbody>
</table>

<h2>Refund Policy (Official SDJU Terms)</h2>
<p>SDJU maintains a transparent withdrawal and refund schedule based on instructional timing:</p>
<ul>
  <li><strong>Application Fee (CNY 400):</strong> Strictly non-refundable under all circumstances.</li>
  <li><strong>Withdrawal within 2 Weeks of Term Start:</strong> 75% refund of tuition fee and accommodation fee upon formal written approval.</li>
  <li><strong>Withdrawal within 3 Weeks of Term Start:</strong> 50% refund of tuition fee and accommodation fee upon formal written approval.</li>
  <li><strong>Beyond 3 Weeks:</strong> No refund of tuition or accommodation fees will be provided.</li>
  <li><strong>Personal Disciplinary Violations:</strong> Students dismissed due to absenteeism, visa expiration, or illegal conduct are strictly ineligible for refunds.</li>
</ul>

<h2>Required Application Documents</h2>
<ol>
  <li><strong>Passport Information Page:</strong> Clear color scan of valid ordinary passport (must have at least 1 year of validity remaining).</li>
  <li><strong>Previous China Visa Pages:</strong> High-resolution scans of all previous Chinese visas or residence permits (if applicant has ever visited or lived in China).</li>
  <li><strong>High School Diploma &amp; Academic Transcripts:</strong> Original certificate and grade transcripts stamped by school authority or controller of examinations (with English translation if in Bengali). Pre-graduation certificate accepted for prospective graduates.</li>
  <li><strong>Foreigner Physical Examination Form:</strong> Official Chinese medical examination form completed by an authorized hospital with laboratory blood test reports attached (valid for 6 months).</li>
  <li><strong>Certificate of Non-Criminal Record (Police Clearance):</strong> Issued by local police authorities within 6 months of application.</li>
  <li><strong>Financial Guarantee Evidence:</strong> Bank statement or financial commitment letter demonstrating sufficient funds to cover tuition and living expenses in Shanghai.</li>
  <li><strong>Application Fee Payment Voucher:</strong> Proof of bank transfer of CNY 400 to Shanghai DianJi University's official Bank of China account (must include student passport number in transaction remarks).</li>
</ol>

<h2>EduExpress Verification &amp; Visa-First Policy</h2>
<p>EduExpress International provides authentic, document-vetted guidance for Bangladeshi students applying to Shanghai universities:</p>
<blockquote>
  &ldquo;No file opening charge. No EduExpress service fee before China visa approval. Any university application fee, embassy visa fee, medical test, or courier fee required earlier must be itemized in writing before the student proceeds.&rdquo;
</blockquote>

<h2>Frequently Asked Questions</h2>
<details>
  <summary>What is the application deadline for SDJU Spring 2027?</summary>
  <p>The official application deadline is <strong>15 December 2026</strong>. However, because on-campus double rooms (CNY 9,600/year) are limited and allotted first-come, first-served, early application is strongly advised.</p>
</details>
<details>
  <summary>Can students with zero Chinese background apply?</summary>
  <p>Yes. The program offers a dedicated <strong>Beginner Level</strong> class designed specifically for international students with no prior knowledge of Mandarin Chinese.</p>
</details>
<details>
  <summary>Can I stay in Shanghai for a Bachelor degree after completing the language year?</summary>
  <p>Yes. Students who successfully achieve HSK 4 during the preparatory year can apply directly for Chinese-taught undergraduate majors at SDJU or other top Shanghai universities, or transfer into English-taught Bachelor programs.</p>
</details>
<details>
  <summary>Where is Shanghai DianJi University located?</summary>
  <p>SDJU is situated in the Lin-gang Special Area of the Shanghai Pilot Free Trade Zone in Pudong, Shanghai, accessible by Shanghai Metro Line 16.</p>
</details>

<p class="note"><strong>Official Sourcing &amp; Governance:</strong> Sourced directly from Shanghai DianJi University (SDJU) International Student Admissions Office notice published November 2026. Verified by EduExpress counselor desk on 15 November 2026. Next review scheduled for 15 December 2026.</p>`,
  },
  {
    slug: 'china-medical-university-csc-scholarship-2027',
    title: 'China Medical University CSC Scholarship 2027: Type B Graduate Guide',
    metaTitle: 'China Medical University CSC 2027: Type B Medical Guide',
    metaDescription:
      'China Medical University 2027 CSC Type B guide: Agency No. 10159, Clinical Medicine & Stomatology, apply by 25 Feb 2027. Full tuition, dorm & stipend.',
    excerpt:
      "Verified 2027 China Medical University (CMU) CSC Type B guide: Agency No. 10159, Master's & PhD Clinical Medicine, Stomatology, deadline 25 Feb 2027, supervisor contact & requirements.",
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships', 'Medicine']),
    tags: JSON.stringify([
      'china medical university',
      'cmu shenyang',
      'csc scholarship 2027',
      'agency 10159',
      'clinical medicine csc',
      'study medicine in china',
    ]),
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    featuredImage:
      '/updates/covers/china-medical-university-csc-scholarship-2027.jpg',
    sourceUrls: JSON.stringify(CMU_OFFICIAL_SOURCES),
    deadlineAt: new Date('2027-02-25T15:59:59.000Z'),
    content: `<p class="lede"><strong><a href="/universities/china-medical-university">China Medical University</a> (中国医科大学, CMU)</strong> in Shenyang, Liaoning has officially published its 2027 application guide for the <strong>Chinese Government Scholarship — High-Level Graduate Program (Type B)</strong>. For Bangladeshi medical graduates (MBBS / BDS) and healthcare scholars targeting Master’s or PhD research in <strong>Clinical Medicine</strong>, <strong>Stomatology</strong>, <strong>Public Health</strong>, or <strong>Pharmacy</strong>, CMU provides full government sponsorship through CSC Agency Number <strong>10159</strong> with an online submission deadline of <strong>25 February 2027</strong>.</p>
<aside class="key-facts">
  <h2>CMU 2027 CSC Type B: Key Facts at a Glance</h2>
  <table><tbody>
    <tr><th>Institution</th><td><a href="/universities/china-medical-university">China Medical University (中国医科大学)</a>, Shenyang, Liaoning</td></tr>
    <tr><th>Scholarship Scheme</th><td>Chinese Government Scholarship — High-Level Graduate Program (Type B)</td></tr>
    <tr><th>CSC Agency Number</th><td><strong>10159</strong> (Matched to China Medical University)</td></tr>
    <tr><th>Application Deadline</th><td><strong>25 February 2027</strong></td></tr>
    <tr><th>Degrees Supported</th><td>Master’s Degree (3 years) &middot; Doctoral Degree / PhD (4 years)</td></tr>
    <tr><th>Eligible Fields</th><td>Clinical Medicine, Stomatology (Dentistry), Basic Medicine, Public Health &amp; Preventive Medicine, Pharmacy, Biology</td></tr>
    <tr><th>Scholarship Benefits</th><td>100% Tuition waiver, Free university accommodation, Monthly stipend, Comprehensive medical insurance</td></tr>
    <tr><th>Monthly Living Stipend</th><td>Master’s: CNY 3,000 / month &middot; Doctoral / PhD: CNY 3,500 / month</td></tr>
    <tr><th>Language Threshold</th><td>Chinese-taught: HSK Level 4 minimum &middot; English-taught: IELTS ≥ 6.0 / TOEFL ≥ 70 <em>and</em> HSK Level 4</td></tr>
    <tr><th>Official Admissions Contact</th><td>Ms. Ren &middot; Tel: +86-24-31939481 &middot; Email: <a href="mailto:hren@cmu.edu.cn">hren@cmu.edu.cn</a></td></tr>
  </tbody></table>
</aside>
<div class="callout">
  <h3>📱 Social Media Quick Summary (Copy &amp; Share)</h3>
  <p>Share this verified postgraduate medical scholarship update with Bangladeshi doctors, MBBS graduates, and medical study groups:</p>
  <blockquote>
    🇨🇳 <strong>CHINA MEDICAL UNIVERSITY (CMU) | FULL CSC SCHOLARSHIP 2027 (TYPE B)</strong> 🎓🩺<br><br>
    China Medical University (中国医科大学) in Shenyang has opened CSC Type B High-Level Graduate scholarship applications for 2027 Master’s &amp; PhD degrees!<br><br>
    ✨ <strong>Full Scholarship Benefits:</strong><br>
    &bull; 100% Full Tuition Waiver<br>
    &bull; Free University Accommodation<br>
    &bull; Monthly Living Allowance (Master’s CNY 3,000/mo | PhD CNY 3,500/mo)<br>
    &bull; Comprehensive Medical Insurance<br><br>
    🏥 <strong>Eligible Disciplines:</strong><br>
    Clinical Medicine, Stomatology (Dentistry), Basic Medicine, Public Health, Pharmacy, Biology &amp; Biomedical Sciences!<br><br>
    🎯 <strong>Eligibility &amp; Age Limits:</strong><br>
    &bull; Master’s: Bachelor’s / MBBS holder under 35 years<br>
    &bull; Doctoral (PhD): Master’s degree holder under 40 years<br>
    &bull; Language: IELTS ≥ 6.0 / TOEFL ≥ 70 + HSK Level 4 (required for clinical interaction)<br><br>
    🏛️ <strong>Agency Number:</strong> 10159 (Program Category: Type B)<br>
    🌐 <strong>Application Portal:</strong> www.campuschina.org<br>
    📅 <strong>Application Deadline:</strong> 25 February 2027<br>
    📧 <strong>Admissions Contact:</strong> hren@cmu.edu.cn | +86-24-31939481
  </blockquote>
  <p><a href="https://wa.me/?text=China%20Medical%20University%20CSC%20Scholarship%202027%20Type%20B%20Guide%3A%20https%3A%2F%2Feduexpressint.com%2Fupdates%2Fchina-medical-university-csc-scholarship-2027" target="_blank" rel="noopener noreferrer">Share on WhatsApp</a> &nbsp; <a href="/education-fit-assessment">Check Eligibility with EduExpress</a></p>
</div>
<h2>Why China Medical University for Postgraduate Medical Research?</h2>
<p>Founded in 1931, <strong>China Medical University (CMU)</strong> is one of China’s most historic and prestigious national medical universities. Located in Shenyang, Liaoning province, CMU operates multiple large-scale affiliated general hospitals providing tens of thousands of inpatient beds, advanced clinical simulation centers, and internationally accredited biomedical laboratories. Degrees from CMU are recognized by the World Health Organization (WHO), the World Directory of Medical Schools (WDOMS), and the Bangladesh Medical &amp; Dental Council (BMDC) under prevailing registration guidelines.</p>
<p>Unlike undergraduate MBBS admissions where self-funding is standard, the <strong>CSC High-Level Graduate Program (Type B)</strong> is fully funded by the Chinese Ministry of Education to attract high-caliber doctors and researchers for 3-year Master of Medicine (MMed/MSc) and 4-year Doctoral (MD/PhD) degrees.</p>
<h2>Eligible Disciplines &amp; Academic Programs</h2>
<p>According to Section II of CMU's official 2027 notice, international postgraduates can apply across the following key academic departments:</p>
<ul>
  <li><strong>Clinical Medicine:</strong> Internal Medicine, General Surgery, Orthopedics, Pediatrics, Obstetrics &amp; Gynecology, Oncology, Medical Imaging, Anesthesiology, Neurology, and Critical Care Medicine.</li>
  <li><strong>Stomatology:</strong> Oral &amp; Maxillofacial Surgery, Prosthodontics, Orthodontics, and Endodontics.</li>
  <li><strong>Basic Medicine:</strong> Pathology, Medical Genetics, Human Anatomy &amp; Histology, Immunology, and Pharmacology.</li>
  <li><strong>Public Health &amp; Preventive Medicine:</strong> Epidemiology, Environmental Health, and Health Statistics.</li>
  <li><strong>Pharmacy:</strong> Clinical Pharmacy, Pharmacology, and Medicinal Chemistry.</li>
  <li><strong>Biology:</strong> Cell Biology, Molecular Biology, and Biochemistry.</li>
</ul>
<h2>Special Language Requirement: Why HSK 4 is Mandatory Even for English Tracks</h2>
<p>A critical clause in Section V(3) of CMU's 2027 guidelines specifies:</p>
<ul>
  <li><strong>Chinese-taught Programs:</strong> Valid HSK Level 4 score report or higher.</li>
  <li><strong>English-taught Programs:</strong> Applicants must present IELTS Academic (no less than 6.0), TOEFL (no less than 70), or recognized equivalent scores, <strong>and also must have acquired HSK Level 4 proficiency</strong>.</li>
</ul>
<p><em>Counselor Note:</em> Because medical postgraduates at CMU conduct clinical rotations, case discussions, and hospital bedside training in affiliated hospital wards, basic patient communication in Mandarin Chinese is essential for medical safety and diagnostic interaction.</p>
<h2>Step-by-Step Application Roadmap (Deadline: 25 February 2027)</h2>
<ol>
  <li><strong>Step 1: Contact a CMU Supervisor:</strong>
    Browse the official 2027 International Graduate Supervisor Directory published on the CMU International Education School website (<a href="https://www.cmu.edu.cn/gjjyxy/zsxx/dsxx.htm" target="_blank" rel="noopener noreferrer">cmu.edu.cn/gjjyxy/zsxx/dsxx.htm</a>). Reach out to potential faculty mentors aligned with your medical research area and request a signed <strong>Acceptance Letter from Professor</strong>. If unable to reach a tutor directly, download the <em>Application Form for Prospective Tutor</em> and email it to <a href="mailto:hren@cmu.edu.cn">hren@cmu.edu.cn</a>.
  </li>
  <li><strong>Step 2: Complete the Academic Interview &amp; Pre-Admission:</strong>
    Once a supervisor consents, the department schedules an academic evaluation interview. Successful candidates receive a formal <strong>Pre-Admission Letter</strong> from CMU’s International Admissions Department.
  </li>
  <li><strong>Step 3: Register on the CSC Campus China Portal:</strong>
    Log in to <a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer">www.campuschina.org</a>, select <strong>Program Category: Type B</strong>, and enter Agency Number <strong>10159</strong>. The system will display "China Medical University".
  </li>
  <li><strong>Step 4: Upload Complete Documentation Dossier:</strong>
    Upload high-resolution scans of your notarized MBBS/Master’s certificates, transcripts, research plan (>1,000 words), Foreigner Physical Exam, police clearance, and tutor acceptance letters.
  </li>
  <li><strong>Step 5: Submit Before 25 February 2027:</strong>
    Review all inputs and submit. Save the generated CSC application PDF for official records.
  </li>
</ol>
<h2>Required Application Documents</h2>
<table>
  <thead>
    <tr>
      <th>Item</th>
      <th>Required Document</th>
      <th>Official Specifications</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><strong>CSC Application Form</strong></td>
      <td>Completed online in English or Chinese via <a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer">campuschina.org</a> and signed.</td>
    </tr>
    <tr>
      <td>2</td>
      <td><strong>Ordinary Passport Home Page</strong></td>
      <td>Valid for at least one year beyond the application date (valid past September 2027).</td>
    </tr>
    <tr>
      <td>3</td>
      <td><strong>Notarized Highest Degree Certificate</strong></td>
      <td>MBBS degree certificate for Master’s applicants; Master’s certificate for PhD applicants (in English or Chinese). Prospective graduates must provide an anticipated graduation letter confirming completion before September 2027.</td>
    </tr>
    <tr>
      <td>4</td>
      <td><strong>Complete Academic Transcripts</strong></td>
      <td>All semester marksheets from undergraduate onwards, stamped and sealed by the university registrar or controller of examinations.</td>
    </tr>
    <tr>
      <td>5</td>
      <td><strong>Language Proficiency Certificates</strong></td>
      <td>HSK 4 certificate (mandatory for all), plus IELTS Academic (≥ 6.0) or TOEFL (≥ 70) for English tracks.</td>
    </tr>
    <tr>
      <td>6</td>
      <td><strong>CMU Supervisor Acceptance Letter</strong></td>
      <td>Signed acceptance consent from a CMU professor or official tutor assignment via <a href="mailto:hren@cmu.edu.cn">hren@cmu.edu.cn</a>.</td>
    </tr>
    <tr>
      <td>7</td>
      <td><strong>Pre-Admission Letter</strong></td>
      <td>Issued by China Medical University international admissions following successful interview.</td>
    </tr>
    <tr>
      <td>8</td>
      <td><strong>Study or Research Proposal</strong></td>
      <td>Minimum 1,000 words in English or Chinese. For PhD applicants, the proposal must also be signed by the prospective CMU supervisor.</td>
    </tr>
    <tr>
      <td>9</td>
      <td><strong>Two Academic Recommendation Letters</strong></td>
      <td>Written and signed by full Professors or Associate Professors familiar with your clinical/academic work.</td>
    </tr>
    <tr>
      <td>10</td>
      <td><strong>Foreigner Physical Examination Form</strong></td>
      <td>Completed English form with hospital seal over the photograph, physician signature, and blood test lab reports attached (valid for 6 months).</td>
    </tr>
    <tr>
      <td>11</td>
      <td><strong>Non-Criminal Record (Police Clearance)</strong></td>
      <td>Issued by Bangladesh Police within 6 months prior to application submission.</td>
    </tr>
  </tbody>
</table>
<h2>EduExpress Medical Guidance &amp; Visa-First Policy</h2>
<p>Postgraduate medical scholarships require realistic appraisal: supervisor matching, clinical proposal structuring, and strict document compliance. EduExpress International provides structured counseling for Bangladeshi doctors with zero financial speculation:</p>
<blockquote>
  &ldquo;No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.&rdquo;
</blockquote>
<p><em>Fraud Warning:</em> China Medical University explicitly states that it does not entrust any individual or third-party intermediary agent to process Chinese Government Scholarship applications. All applications must be submitted directly through official university and CSC channels.</p>
<h2>Frequently Asked Questions</h2>
<details>
  <summary>What is China Medical University's CSC Agency Number for 2027?</summary>
  <p>The official CSC Agency Number for China Medical University is <strong>10159</strong> under Program Category Type B.</p>
</details>
<details>
  <summary>Can Bangladeshi MBBS doctors apply for Clinical Medicine Master’s or PhD?</summary>
  <p>Yes. Bangladeshi MBBS graduates with strong academic credentials, full internship completion, and valid medical registration are eligible to apply for 3-year Master of Medicine degrees (under age 35) or 4-year PhD programs (under age 40) under CSC Type B.</p>
</details>
<details>
  <summary>Is HSK Level 4 strictly required for English-taught medical programs?</summary>
  <p>Yes. China Medical University's official 2027 notice explicitly states that applicants for English-taught programs must submit valid IELTS (≥ 6.0) or TOEFL (≥ 70) and must also have acquired HSK Level 4 proficiency for hospital communication.</p>
</details>
<details>
  <summary>When is the application deadline for CMU CSC Type B 2027?</summary>
  <p>The application deadline is <strong>25 February 2027</strong> on the Campus China portal (campuschina.org).</p>
</details>
<details>
  <summary>Where can I download the CMU 2027 supervisor list?</summary>
  <p>The 2027 Supervisor List is available directly on the International Education School portal at <a href="https://www.cmu.edu.cn/gjjyxy/zsxx/dsxx.htm" target="_blank" rel="noopener noreferrer">cmu.edu.cn/gjjyxy/zsxx/dsxx.htm</a> or by emailing admissions officer Ms. Ren at <a href="mailto:hren@cmu.edu.cn">hren@cmu.edu.cn</a>.</p>
</details>
<p class="note"><strong>Official Sourcing &amp; Governance:</strong> Sourced directly from China Medical University International Education School official announcement (Published November 2026). Verified by EduExpress counselor desk on 15 November 2026. Next review scheduled for 25 February 2027.</p>`,
  },
  {
    slug: 'cgs-2027-2028-type-a-scholarship-bangladesh',
    title: 'Chinese Government Scholarship (CGS) 2027/2028 | Type A: Official Embassy Notice for Bangladeshi Students',
    metaTitle: 'CGS 2027/2028 Type A Scholarship: Bangladesh Embassy Notice',
    metaDescription:
      'Official Chinese Government Scholarship (CGS) 2027/2028 Type A guide for Bangladeshi students. Full funding, document checklist & apply by 10 Jan 2027.',
    excerpt:
      "Official notice from the Embassy of China in Bangladesh: Chinese Government Scholarship (CGS) 2027/2028 Type A is now open for Bachelor's, Master's, PhD & Scholar programs. Full tuition, hostel, stipend & airfare. Apply by 10 January 2027.",
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships']),
    tags: JSON.stringify([
      'cgs scholarship 2027',
      'chinese government scholarship type a',
      'csc type a bangladesh',
      'campuschina',
      'embassy of china in bangladesh',
      'study in china 2027',
    ]),
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    featuredImage: '/updates/covers/cgs-2027-2028-type-a-scholarship-cover.jpg',
    sourceUrls: JSON.stringify(CGS_2027_TYPE_A_SOURCES),
    deadlineAt: new Date('2027-01-10T23:59:59.000Z'),
    content: `<p class="lede">The <strong>Embassy of the People's Republic of China in Bangladesh</strong> has officially opened applications for the prestigious <strong>Chinese Government Scholarship (CGS) 2027/2028 | Type A (Bilateral Program)</strong>. Over years, this government-to-government scholarship channel has empowered hundreds of outstanding Bangladeshi scholars to study at top-tier Chinese universities with full financial sponsorship covering tuition, on-campus accommodation, monthly living allowances, medical insurance, and round-trip airfare. The official online submission window is now open on <a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer">campuschina.org</a> and will close on <strong>10 January 2027</strong>.</p>
<aside class="key-facts">
  <h2>CGS 2027/2028 Type A: Key Facts at a Glance</h2>
  <table><tbody>
    <tr><th>Scholarship Scheme</th><td>Chinese Government Scholarship (CGS) 2027/2028 — Type A (Bilateral Track)</td></tr>
    <tr><th>Official Sponsoring Body</th><td>Embassy of the People's Republic of China in Bangladesh &amp; China Scholarship Council (CSC)</td></tr>
    <tr><th>Application Deadline</th><td><strong>10 January 2027</strong></td></tr>
    <tr><th>Application Portal</th><td><a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer">www.campuschina.org</a> (Campus China)</td></tr>
    <tr><th>Eligible Degrees</th><td>Bachelor’s (Undergraduate), Master’s, Doctoral (PhD), General Scholar, Senior Scholar</td></tr>
    <tr><th>Award Coverage</th><td>100% Tuition waiver, University accommodation, Monthly stipend, Comprehensive medical insurance, Round-trip airfare</td></tr>
    <tr><th>Monthly Living Stipend</th><td>Bachelor's: CNY 2,500/mo &middot; Master's: CNY 3,000/mo &middot; PhD &amp; Senior Scholars: CNY 3,500/mo</td></tr>
    <tr><th>Eligible Fields</th><td>Engineering, IT &amp; AI, Medicine, Business, Sciences, Agriculture, Humanities, Law, Arts, Social Sciences &amp; more</td></tr>
    <tr><th>Target Nationality</th><td>Bangladeshi citizens with valid passport and strong academic merit</td></tr>
  </tbody></table>
</aside>
<div class="callout">
  <h3>📱 Social Media Quick Summary (Copy &amp; Share)</h3>
  <p>Looking to share this official announcement with your study circle, Facebook groups, or WhatsApp classmates? Here is the concise, verified summary:</p>
  <blockquote>
    🇨🇳 <strong>CHINESE GOVERNMENT SCHOLARSHIP (CGS) 2027/2028 | TYPE A IS OPEN!</strong> 🎓<br><br>
    The Embassy of China in Bangladesh has officially announced the CGS 2027/2028 (Type A Bilateral Program) for Bangladeshi applicants to pursue Bachelor’s, Master’s, Doctoral, and Scholar programs in China with full government funding!<br><br>
    ✨ <strong>Full Scholarship Coverage:</strong><br>
    &bull; 100% Full Tuition Waiver<br>
    &bull; Free University Accommodation (Dormitory)<br>
    &bull; Monthly Living Stipends (CNY 2,500 – 3,500 / month)<br>
    &bull; Comprehensive Medical Insurance<br>
    &bull; Round-Trip International Airfare<br><br>
    🎯 <strong>Age &amp; Level Eligibility:</strong><br>
    &bull; Bachelor’s: Under 25 years (CSCA test certificate required)<br>
    &bull; Master’s: Under 35 years<br>
    &bull; Doctoral (PhD): Under 40 years<br>
    &bull; General Scholar: Under 45 | Senior Scholar: Under 50<br><br>
    🌐 <strong>Application Portal:</strong> www.campuschina.org<br>
    📅 <strong>Application Deadline:</strong> 10 January 2027<br>
    🇧🇩🇨🇳 <em>Official Source: Embassy of the People's Republic of China in Bangladesh</em>
  </blockquote>
  <p><a href="https://wa.me/?text=Check%20out%20the%20Chinese%20Government%20Scholarship%20CGS%202027%2F2028%20Type%20A%20Official%20Embassy%20Notice%3A%20https%3A%2F%2Feduexpressint.com%2Fupdates%2Fcgs-2027-2028-type-a-scholarship-bangladesh" target="_blank" rel="noopener noreferrer">Share on WhatsApp</a> &nbsp; <a href="/education-fit-assessment">Check Eligibility via EduExpress</a></p>
</div>
<h2>What Does the CGS Type A Scholarship Cover?</h2>
<p>The Chinese Government Scholarship (Type A) is one of the most generous international scholarship allocations globally. For Bangladeshi candidates successfully nominated through the bilateral Embassy channel, the award includes:</p>
<ul>
  <li><strong>100% Tuition Waiver:</strong> All standard educational tuition charges are fully waived directly by the host institution throughout the scheduled academic degree.</li>
  <li><strong>University Dormitory Accommodation:</strong> Free single or twin room accommodation in the international student dormitories, or an equivalent official housing subsidy if authorized to reside off-campus.</li>
  <li><strong>Monthly Living Allowances:</strong> A monthly living stipend transferred to the scholar's local bank account:
    <ul>
      <li><strong>Undergraduate (Bachelor’s):</strong> CNY 2,500 / month</li>
      <li><strong>Master’s Degree &amp; General Scholars:</strong> CNY 3,000 / month</li>
      <li><strong>Doctoral Degree (PhD) &amp; Senior Scholars:</strong> CNY 3,500 / month</li>
    </ul>
  </li>
  <li><strong>Comprehensive Medical Insurance:</strong> Full medical health insurance valued at CNY 800 per year provided under China Scholarship Council policy.</li>
  <li><strong>Round-Trip Airfare:</strong> International round-trip travel assistance provided under the bilateral government agreement framework.</li>
</ul>
<figure>
  <img src="/updates/covers/cgs-2027-2028-type-a-eligibility-coverage.jpg" alt="Chinese Government Scholarship 2027-2028 Type A Eligibility, Coverage, and Fields" width="819" height="1024" loading="lazy" />
  <figcaption>Official eligibility criteria, study fields, and full coverage breakdown for Bangladeshi applicants (Source: Embassy of the People's Republic of China in Bangladesh).</figcaption>
</figure>
<h2>Eligibility Criteria for Bangladeshi Applicants</h2>
<p>To qualify for the 2027/2028 CGS Type A quota, candidates must satisfy the following core criteria set by the Chinese Embassy and China Scholarship Council:</p>
<ul>
  <li><strong>Citizenship:</strong> Must be a citizen of the People's Republic of Bangladesh holding a valid passport and in sound physical and mental health.</li>
  <li><strong>Academic Standing:</strong> Excellent academic performance in prior studies (strong GPA/grades in SSC &amp; HSC for Bachelor's applicants, or high CGPA for Bachelor's/Master's degree holders).</li>
  <li><strong>Age Limits (strict CSC requirements):</strong>
    <ul>
      <li><strong>Bachelor’s Degree Applicants:</strong> Must have completed high school (HSC / A-Level or equivalent) and be <strong>under 25 years old</strong>.</li>
      <li><strong>Master’s Degree Applicants:</strong> Must hold an accredited Bachelor’s degree and be <strong>under 35 years old</strong>.</li>
      <li><strong>Doctoral Degree (PhD) Applicants:</strong> Must hold an accredited Master’s degree and be <strong>under 40 years old</strong>.</li>
      <li><strong>General Scholars:</strong> Under 45 years old (minimum 2 years of undergraduate study completed).</li>
      <li><strong>Senior Scholars:</strong> Under 50 years old (Master’s degree or associate professorship held).</li>
    </ul>
  </li>
  <li><strong>Language Readiness:</strong>
    <ul>
      <li><em>Chinese-taught majors:</em> HSK Level 3 or 4 minimum depending on degree tier (with preparatory Chinese foundation available when designated).</li>
      <li><em>English-taught majors:</em> Recognized English proficiency certificate (IELTS, TOEFL, or official Medium of Instruction certificate where accepted).</li>
    </ul>
  </li>
  <li><strong>CSCA Test (for Bachelor’s):</strong> All undergraduate applicants must present their valid China Scholastic Competency Assessment (CSCA) examination score report.</li>
</ul>
<h2>The 4-Step Application Roadmap</h2>
<p>Applying for the Type A scholarship requires careful coordination between target universities, the online CSC application portal, and the official nomination procedures. Follow this tested 4-step sequence:</p>
<figure>
  <img src="/updates/covers/cgs-2027-2028-type-a-process-checklist.jpg" alt="CGS 2027-2028 Type A 4-Step Process and Document Checklist" width="819" height="1024" loading="lazy" />
  <figcaption>The 4-Step Application Sequence &amp; Official Document Checklist for CGS 2027/2028 Type A.</figcaption>
</figure>
<ol>
  <li><strong>Step 1: Choose Your University and Program:</strong>
    Explore <a href="/china-universities">Chinese universities</a> accepting CSC scholars in your discipline. Reach out early to international student admissions offices or prospective academic supervisors to secure a <strong>Pre-Admission Letter</strong> or <strong>Acceptance Letter</strong>. Having pre-admission significantly increases your placement success.
  </li>
  <li><strong>Step 2: Prepare Your Complete Document Dossier:</strong>
    Collect, notarize, and scan all mandatory items listed on the official checklist. Ensure that all non-English/non-Chinese certificates are accompanied by certified official translations.
  </li>
  <li><strong>Step 3: Apply via the Online CSC Portal (Campus China):</strong>
    Create an account on <a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer">www.campuschina.org</a>. Under the scholarship application section, choose <strong>Program Category: Type A</strong>, enter the official Bangladesh Embassy Agency Number, select your shortlisted universities, upload your complete dossier, and submit before <strong>10 January 2027</strong>.
  </li>
  <li><strong>Step 4: Interview &amp; Final Nomination:</strong>
    Eligible candidates will be called for interview assessments and evaluated by the nominating panel. Nominated candidate files are subsequently forwarded to the China Scholarship Council for final confirmation and university placement.
  </li>
</ol>
<h2>Official Document Checklist (10 Items)</h2>
<p>Every applicant must upload clear, colored, high-resolution scans of the following required documents:</p>
<table>
  <thead>
    <tr>
      <th>No.</th>
      <th>Document Name</th>
      <th>Key Specifications &amp; Requirements</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><strong>CSC Application Form</strong></td>
      <td>Completed online and downloaded from <a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer">campuschina.org</a> with applicant signature.</td>
    </tr>
    <tr>
      <td>2</td>
      <td><strong>University Application Form / Pre-Admission</strong></td>
      <td>Pre-admission notice or acceptance letter issued by the designated Chinese university.</td>
    </tr>
    <tr>
      <td>3</td>
      <td><strong>Academic Transcripts &amp; Certificates</strong></td>
      <td>Notarized copies of highest degree certificate and complete academic marksheet/transcripts (in English or Chinese).</td>
    </tr>
    <tr>
      <td>4</td>
      <td><strong>Study Plan / Research Proposal</strong></td>
      <td>Written in English or Chinese: minimum 800 words for Bachelor's, 1,000+ words for Master's/PhD outlining academic background, proposed research, and long-term goals.</td>
    </tr>
    <tr>
      <td>5</td>
      <td><strong>Letters of Recommendation (2)</strong></td>
      <td>Signed and stamped recommendations by full Professors or Associate Professors with official contact details.</td>
    </tr>
    <tr>
      <td>6</td>
      <td><strong>Passport Copy</strong></td>
      <td>Clear scan of ordinary passport information page valid beyond late 2027.</td>
    </tr>
    <tr>
      <td>7</td>
      <td><strong>Language Proficiency Certificate</strong></td>
      <td>Valid HSK certificate (for Chinese-taught programs) or IELTS / TOEFL / MOI verification (for English-taught programs).</td>
    </tr>
    <tr>
      <td>8</td>
      <td><strong>CSCA Test Certificate</strong></td>
      <td>Mandatory for Bachelor’s applicants (China Scholastic Competency Assessment). See our <a href="/updates/csca-guide-study-in-china">complete CSCA exam guide</a>.</td>
    </tr>
    <tr>
      <td>9</td>
      <td><strong>Foreigner Physical Examination Form</strong></td>
      <td>Completed in English with hospital seal over the photograph, physician signature, and blood test laboratory attachments (valid for 6 months).</td>
    </tr>
    <tr>
      <td>10</td>
      <td><strong>Non-Criminal Record (Police Clearance)</strong></td>
      <td>Official Police Clearance Certificate issued by Bangladesh Police within 6 months prior to application.</td>
    </tr>
  </tbody>
</table>
<h2>EduExpress Evidence-First Support &amp; Visa-First Policy</h2>
<p>Navigating CSC Type A bilateral applications requires meticulous precision: selecting the right university tier, writing an impactful research proposal, and ensuring flawless document attestation. EduExpress International provides professional, transparent guidance backed by our strict consumer-first charter:</p>
<blockquote>
  &ldquo;No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.&rdquo;
</blockquote>
<p><em>Important Consumer Notice:</em> As publicly declared by the Embassy of the People's Republic of China in Bangladesh, the Embassy has not authorized any exclusive agency for scholarships or visa processing. Beware of middlemen demanding upfront deposits or promising guaranteed awards. EduExpress focuses on merit matching, academic guidance, and authentic document readiness.</p>
<h2>Frequently Asked Questions</h2>
<details>
  <summary>What is the difference between CSC Type A and Type B?</summary>
  <p><strong>Type A</strong> refers to the bilateral scholarship channel managed by dispatching authorities such as the Chinese Embassy in Dhaka or national ministries, allowing applicants to list preferred universities. <strong>Type B</strong> refers to direct applications submitted directly to individual Chinese universities using their unique institutional Agency Number (e.g., NCU 10403, NUIST 10300). Both offer full scholarship coverage if awarded.</p>
</details>
<details>
  <summary>When is the deadline for CGS 2027/2028 Type A for Bangladeshi students?</summary>
  <p>The official application deadline announced by the Chinese Embassy in Bangladesh is <strong>10 January 2027</strong>. All online forms and uploaded documents must be submitted on campuschina.org prior to this date.</p>
</details>
<details>
  <summary>Do Bachelor’s applicants need to take the CSCA test?</summary>
  <p>Yes. The China Scholastic Competency Assessment (CSCA) certificate is a mandatory requirement for undergraduate (Bachelor’s) applicants applying for Chinese Government Scholarships for the 2027/2028 academic cycle.</p>
</details>
<details>
  <summary>Is a Pre-Admission Letter mandatory for Type A?</summary>
  <p>While an application can technically be lodged without one, candidates who obtain an official Pre-Admission Letter or supervisor Acceptance Letter from their preferred Chinese university enjoy a vastly higher probability of securing formal nomination and university placement.</p>
</details>
<details>
  <summary>How can I get my study plan and documents reviewed?</summary>
  <p>You can use our <a href="/education-fit-assessment">Education Fit Assessment</a> or submit your draft proposal to our team in Dhanmondi, Dhaka for an evidence-first evaluation against Chinese university admissions rubrics.</p>
</details>
<p class="note"><strong>Official Verification Sources:</strong> Sourced directly from the Embassy of the People's Republic of China in Bangladesh and the China Scholarship Council portal (<a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer">campuschina.org</a>). Last verified by EduExpress counseling team on 15 November 2026. Next review scheduled for 10 January 2027.</p>`,
  },
  {
    slug: 'nanchang-university-msc-ai-csc-scholarship-2027',
    title: 'Nanchang University MSc AI & CSC Type B Scholarship 2027 Guide',
    metaTitle: 'Nanchang University MSc AI & CSC 2027 Guide',
    metaDescription:
      'Nanchang University 2027 CSC Type B guide for MSc AI & CS: Agency No. 10403, apply by 1 March 2027, CNY 25,000 baseline tuition & verified IEC links.',
    excerpt:
      'Verified 2027 guide for Nanchang University MSc Artificial Intelligence, Computer Science, self-funded tuition (CNY 25,000/yr), and CSC Type B (Agency No. 10403, deadline 1 March 2027).',
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships']),
    tags: JSON.stringify([
      'nanchang university',
      'csc scholarship 2027',
      'msc artificial intelligence china',
      'agency number 10403',
      'study in china',
    ]),
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    featuredImage:
      '/updates/covers/nanchang-university-msc-ai-csc-scholarship-2027.jpg',
    sourceUrls: JSON.stringify(NANCHANG_OFFICIAL_SOURCES),
    deadlineAt: new Date('2027-03-01T15:59:59.000Z'),
    content: `<p class="lede"><strong><a href="/universities/nanchang-university">Nanchang University</a> (南昌大学, NCU)</strong> published its official 2027–2028 Chinese Government Scholarship (CSC) Type B High-Level Postgraduate notice on 5 November 2026 via its <a href="https://iec.ncu.edu.cn/info/1691/22826.htm" target="_blank" rel="noopener noreferrer">International Education College (IEC)</a>. For Bangladeshi students targeting Master’s research in <strong>Artificial Intelligence</strong> and <strong>Computer Science and Technology</strong>, all postgraduate majors at NCU are eligible under the CSC Type B window closing <strong>1 March 2027</strong>.</p>
<aside class="key-facts">
  <h2>Key facts</h2>
  <table><tbody>
    <tr><th>University</th><td><a href="/universities/nanchang-university">Nanchang University (南昌大学)</a>, Nanchang, Jiangxi</td></tr>
    <tr><th>Rankings (2026 catalog)</th><td>ARWU World 301–400 &middot; Best Chinese Universities #68</td></tr>
    <tr><th>Official websites</th><td><a href="https://www.ncu.edu.cn/" target="_blank" rel="noopener noreferrer">ncu.edu.cn</a> &middot; <a href="https://iec.ncu.edu.cn/" target="_blank" rel="noopener noreferrer">iec.ncu.edu.cn</a></td></tr>
    <tr><th>CSC agency number</th><td>10403 (Type B — High-Level Postgraduate Program)</td></tr>
    <tr><th>Study levels &amp; age limits</th><td>Master’s (Bachelor’s degree, under age 35) and PhD (Master’s degree, under age 40)</td></tr>
    <tr><th>MSc CS / AI self-funded baseline</th><td>CNY 25,000 / year (Sciences &amp; Engineering Master’s per NCU IEC schedule)</td></tr>
    <tr><th>Accommodation &amp; insurance</th><td>On-campus dormitory CNY 3,000–7,500 / year &middot; Insurance CNY 800 / year</td></tr>
    <tr><th>Application deadline (2027 CSC)</th><td>1 March 2027 (both NCU portal &amp; CSC system)</td></tr>
    <tr><th>Official admissions contact</th><td>study@ncu.edu.cn &middot; +86-791-83968702 / +86-791-83969196</td></tr>
  </tbody></table>
</aside>
<h2>MSc Artificial Intelligence &amp; Computer Science options at Nanchang University</h2>
<p>Nanchang University admits international undergraduates across <strong>Artificial Intelligence</strong>, <strong>Computer Science and Technology</strong>, and <strong>Software Engineering</strong>, and per item 4 of the 2027–2028 IEC postgraduate notice, <em>all Master’s and Doctoral majors at NCU can apply</em> under the High-Level Postgraduate CSC track.</p>
<ul>
  <li><strong>Language track confirmation:</strong> Chinese-taught Master’s applicants require at least <strong>HSK Level 4</strong> (unless their prior degree was taught in Chinese with official proof). For English-taught MSc tracks in computer science or AI disciplines, confirm current supervisor availability and English proficiency interview requirements directly with NCU IEC (<a href="mailto:study@ncu.edu.cn">study@ncu.edu.cn</a>) before lodging your file.</li>
  <li><strong>CSC Type B vs NCU Partial Scholarships:</strong> Full CSC Type B awards cover tuition waiver, university housing or housing subsidy, a monthly living stipend, and medical insurance. Self-funded Science and Engineering Master’s tuition starts at <strong>CNY 25,000/year</strong> per NCU’s published postgraduate fee schedule (<a href="https://iec.ncu.edu.cn/lxnd/ssxm.htm" target="_blank" rel="noopener noreferrer">iec.ncu.edu.cn</a>), while NCU catalog scholarships (Type A/B/C) may also apply to qualifying degree entrants depending on intake terms.</li>
</ul>
<h2>Step-by-step application process (March 1, 2027 deadline)</h2>
<ol>
  <li><strong>Verify passport expiry:</strong> NCU explicitly requires applicant passports to remain valid beyond <strong>September 2027</strong>.</li>
  <li><strong>Submit the Nanchang University online application:</strong> Register and upload your complete dossier on <a href="https://apply.ncu.edu.cn/" target="_blank" rel="noopener noreferrer">apply.ncu.edu.cn</a> by <strong>1 March 2027</strong>.</li>
  <li><strong>Submit the CSC Online Application (Agency Code 10403):</strong> Apply on the <a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer">CSC Study in China portal</a> under Type B using agency code <strong>10403</strong> before the same deadline. See our <a href="/csc-scholarship-bangladesh">CSC Scholarship guide for Bangladesh</a> and <a href="/updates/complete-csc-universities-list-2027">Complete CSC Universities List 2027</a> to compare parallel Type B options.</li>
  <li><strong>Complete university interview &amp; nomination:</strong> NCU IEC evaluates academic merit and conducts an interview assessment before recommending nominated candidates to CSC.</li>
</ol>
<h2>Required application documents (official 2027 checklist)</h2>
<ul>
  <li>Notarized highest degree diploma (final-year students may submit an official expected graduation certificate specifying graduation before September 2027).</li>
  <li>Official university academic transcripts stamped by the Registrar / Controller of Examinations.</li>
  <li>Study or research proposal in Chinese or English (minimum <strong>1,000 words</strong>; Doctoral applicants require a supervisor’s signature on an acceptance letter/proposal).</li>
  <li>Two recommendation letters signed by Associate Professors or Professors.</li>
  <li>Foreigner Physical Examination Form completed within 6 months prior to submission, plus blood test reports.</li>
  <li>Non-Criminal Record / Police Clearance Certificate issued within 6 months prior to application.</li>
  <li>Valid language proficiency certificate (HSK 4+ for Chinese-taught programs; official English proficiency / MOI documentation for English-medium consideration).</li>
</ul>
<div class="callout">
  <p><strong>Need evidence-first document review for September 2027?</strong> Check your eligibility and compare Nanchang University with other Chinese public universities through our <a href="/education-fit-assessment">Education Fit Assessment</a> or browse full intake timelines at <a href="/china-intakes-deadlines">China Intakes &amp; Deadlines</a>.</p>
</div>
<h2>Frequently asked questions</h2>
<details><summary>What is Nanchang University’s CSC Agency Number for 2027?</summary><p>The official Chinese Government Scholarship (CSC) agency number for Nanchang University is 10403 for Type B High-Level Postgraduate applications.</p></details>
<details><summary>Can I apply for MSc Artificial Intelligence or Computer Science at Nanchang University under CSC 2027?</summary><p>Yes. Nanchang University’s 5 November 2026 IEC notice states that all majors at NCU can apply under the 2027–2028 High-Level Postgraduate CSC track, subject to meeting degree, age, and language criteria (HSK 4+ for Chinese-taught or verified English proficiency for English-taught supervision).</p></details>
<details><summary>When is the Nanchang University 2027 CSC Type B application deadline?</summary><p>According to the official IEC notice published on 5 November 2026, applicants must submit both the NCU online application and the CSC portal application by 1 March 2027.</p></details>
<details><summary>What is the self-funded Master’s tuition fee if I do not receive a full CSC award?</summary><p>NCU IEC’s published Master’s program schedule lists annual tuition of CNY 25,000/year for Science and Engineering majors, CNY 23,000/year for Arts/Humanities, and CNY 30,000/year for Medicine, alongside CNY 3,000–7,500/year for campus accommodation and CNY 800/year for medical insurance.</p></details>
<details><summary>Where do I verify authentic Nanchang University portals?</summary><p>Use only official university domains: ncu.edu.cn, iec.ncu.edu.cn, apply.ncu.edu.cn, and official contact email study@ncu.edu.cn. Avoid lookalike unofficial third-party domains.</p></details>`,
  },
  {
    slug: 'chengdu-normal-university-csc-admission-guide-2027',
    title: 'Chengdu Normal University 2027 Admission, Fees & CSC Guidance',
    metaTitle: 'Chengdu Normal University 2027 Fees & Admission Guide',
    metaDescription:
      'Chengdu Normal University 2027 guide: verified cdnu.edu.cn links, CS & Economics tuition (CNY 5,000 baseline), dorm costs, deadline & CSC verification.',
    excerpt:
      'Evidence-first 2027 admission guide for Chengdu Normal University (cdnu.edu.cn): English-taught Bachelor programs, CNY 5,000 tuition baseline, dorm costs, and CSC / regional grant clarity.',
    category: 'China',
    categories: JSON.stringify(['China', 'Admissions']),
    tags: JSON.stringify([
      'chengdu normal university',
      'cdnu',
      'csc scholarship',
      'study in chengdu',
      'study in china 2027',
    ]),
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    featuredImage:
      '/updates/covers/chengdu-normal-university-csc-admission-guide-2027.jpg',
    sourceUrls: JSON.stringify(CHENGDU_NORMAL_OFFICIAL_SOURCES),
    deadlineAt: new Date('2027-08-15T15:59:59.000Z'),
    content: `<p class="lede"><strong><a href="/universities/chengdu-normal-university">Chengdu Normal University</a> (成都师范学院, CDNU)</strong> is a public university located in Chengdu, Sichuan Province. For the September 2027 intake, Bangladeshi students need clarity on three points before applying: CDNU’s <strong>verified official domain (<a href="https://www.cdnu.edu.cn/" target="_blank" rel="noopener noreferrer">cdnu.edu.cn</a>)</strong>, documented English-taught tuition baselines (<strong>CNY 5,000/year after university reduction</strong>), and how to verify CSC versus Sichuan/university scholarship availability before relying on third-party promises.</p>
<aside class="key-facts">
  <h2>Key facts</h2>
  <table><tbody>
    <tr><th>University</th><td><a href="/universities/chengdu-normal-university">Chengdu Normal University (成都师范学院)</a>, Chengdu, Sichuan</td></tr>
    <tr><th>National ranking (2026 catalog)</th><td>#465 in ShanghaiRanking Best Chinese Universities Ranking</td></tr>
    <tr><th>Official websites</th><td><a href="https://www.cdnu.edu.cn/" target="_blank" rel="noopener noreferrer">cdnu.edu.cn</a> &middot; <a href="https://lxs.cdnu.edu.cn/" target="_blank" rel="noopener noreferrer">lxs.cdnu.edu.cn</a></td></tr>
    <tr><th>Recorded English Bachelor majors</th><td>Computer Science and Technology (4 yrs) &middot; Trade and Economics (4 yrs)</td></tr>
    <tr><th>Catalog tuition baseline</th><td>CNY 5,000 / year (recorded after university scholarship reduction)</td></tr>
    <tr><th>On-campus dormitory fees</th><td>CNY 1,500 (4-bed) &middot; CNY 3,000 (2-bed) &middot; CNY 6,000 / year (single)</td></tr>
    <tr><th>Other catalog campus fees</th><td>Registration CNY 500 &middot; Insurance CNY 550/yr &middot; Visa ext. CNY 400/yr &middot; Medical CNY 400–500</td></tr>
    <tr><th>September 2027 catalog deadline</th><td>15 August 2027 (submit earlier if seeking scholarship allocation)</td></tr>
  </tbody></table>
</aside>
<h2>Always verify Chengdu Normal University’s real official domain</h2>
<p>Many search results and outdated aggregators circulate unverified or broken lookalike domains (such as non-working <code>chengdunormaluniversity.edu.cn</code> addresses). Chengdu Normal University’s genuine institutional domain is <strong><a href="https://www.cdnu.edu.cn/" target="_blank" rel="noopener noreferrer">https://www.cdnu.edu.cn/</a></strong>, and its international student platform uses <strong><a href="https://lxs.cdnu.edu.cn/" target="_blank" rel="noopener noreferrer">https://lxs.cdnu.edu.cn/</a></strong>. Never pay any application deposit without an official CDNU admission notice matching verified bank and portal instructions.</p>
<h2>Programs, 2027 costs &amp; Chengdu living budget</h2>
<p>In EduExpress’s university catalog for Chengdu Normal University, two English-medium Bachelor’s programs are tracked for the <strong>September 2027 intake</strong>:</p>
<ul>
  <li><strong>Computer Science and Technology (Bachelor, 4 years, English-taught):</strong> Recorded tuition of <strong>CNY 5,000/year after university scholarship reduction</strong>.</li>
  <li><strong>Trade and Economics (Bachelor, 4 years, English-taught):</strong> Recorded tuition of <strong>CNY 5,000/year after university scholarship reduction</strong>.</li>
</ul>
<p>Adding recorded quadruple-room accommodation (<strong>CNY 1,500/year</strong>), medical insurance (<strong>CNY 550/year</strong>), visa extension (<strong>CNY 400/year</strong>), and one-time registration (<strong>CNY 500</strong>) / local medical checkup (<strong>CNY 400–500</strong>), recurring annual university charges remain under <strong>CNY 7,500/year</strong> when qualifying for the reduced rate — always confirm your final payable figure in writing on CDNU’s official fee schedule before transfer.</p>
<h2>CSC Scholarship vs CDNU university &amp; Sichuan regional funding</h2>
<p>Students frequently search for “Chengdu Normal University CSC scholarship.” Because <a href="/updates/complete-csc-universities-list-2027">Chinese Government Scholarship (CSC) university-nominated quotas</a> vary by degree level, year, and bilateral vs university track, follow these verification rules:</p>
<ol>
  <li><strong>Distinguish university tuition waivers from CSC full stipends:</strong> CDNU’s widely offered fee reduction (bringing tuition to <strong>CNY 5,000/year</strong> in recorded catalog routes) is a university-level reduction — not an automatic full CSC living-stipend award.</li>
  <li><strong>Check CampusChina and CDNU directly:</strong> Confirm active CSC program codes and Sichuan Provincial / Chengdu Government international student scholarship quotas directly on <a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer">campuschina.org</a> and <a href="https://www.cdnu.edu.cn/" target="_blank" rel="noopener noreferrer">cdnu.edu.cn</a>.</li>
  <li><strong>Compare CSC-dedicated universities:</strong> If your goal is a fully funded Type B Master’s/PhD stipend, compare institutions in our <a href="/csc-scholarship-bangladesh">CSC Scholarship Bangladesh guide</a> and <a href="/updates/complete-csc-universities-list-2027">Complete CSC Universities List 2027</a> alongside CDNU.</li>
</ol>
<h2>Admission eligibility &amp; documents for Bangladeshi applicants</h2>
<ul>
  <li>Recognized Higher Secondary (HSC / A-Level / Diploma) qualification with competitive GPA (<strong>3.50–4.00+ recommended</strong>), age <strong>18–25</strong>.</li>
  <li>English proficiency via IELTS (5.5–6.0), TOEFL iBT (60–80), Duolingo, or official Medium of Instruction (MOI) certificate plus university interview.</li>
  <li>Valid passport, Academic Transcripts &amp; Certificates, Foreigner Physical Examination Form, Police Clearance, and <strong>written supporting documents explaining any study gap</strong>.</li>
</ul>
<div class="callout">
  <p><strong>Applying to Chengdu or Sichuan in 2027?</strong> Get an honest cost and admission-odds check through the <a href="/education-fit-assessment">EduExpress Education Fit Assessment</a> before paying any fee.</p>
</div>
<h2>Frequently asked questions</h2>
<details><summary>What is the official website of Chengdu Normal University?</summary><p>Chengdu Normal University’s official institutional website is https://www.cdnu.edu.cn/ (and international student portal https://lxs.cdnu.edu.cn/). Avoid third-party lookalike domains that do not end in cdnu.edu.cn.</p></details>
<details><summary>What is the tuition and hostel fee at Chengdu Normal University for 2027?</summary><p>EduExpress catalog records list Bachelor tuition at CNY 5,000/year (after scholarship reduction) for Computer Science and Technology and Trade and Economics, with campus dormitory options from CNY 1,500/year (4-person room) to CNY 6,000/year (single room), plus CNY 550/year insurance.</p></details>
<details><summary>Does Chengdu Normal University offer full CSC scholarships?</summary><p>Many applicants confuse CDNU’s university-level tuition reduction (to CNY 5,000/year) with a full CSC living stipend. Always verify current-year CSC, Sichuan Provincial, or Chengdu Government scholarship eligibility directly through campuschina.org and cdnu.edu.cn before applying.</p></details>
<details><summary>What programs are taught in English at Chengdu Normal University?</summary><p>Recorded English-taught 4-year Bachelor pathways include Computer Science and Technology and Trade and Economics for the September intake.</p></details>
<details><summary>When is the deadline for Chengdu Normal University September 2027 intake?</summary><p>The recorded catalog application deadline is 15 August 2027 for September entry, though applying earlier is strongly advised if you want scholarship consideration or extra time for X1 visa processing and study-gap verification.</p></details>`,
  },
];

async function upsertOfficialProgramsAndScholarships(prisma) {
  let changes = 0;

  // 1. Nanchang University: fix broken officialUrl, enrich Master CS/AI & CSC Type B
  const ncu = await prisma.university.findUnique({
    where: { slug: 'nanchang-university' },
    include: { programs: true, scholarships: true },
  });
  if (ncu) {
    let existingSources = [];
    try {
      const parsed = JSON.parse(ncu.sourceUrls || '[]');
      if (Array.isArray(parsed)) {
        existingSources = parsed.filter(
          (u) => typeof u === 'string' && !u.includes('nanchanguniversity.edu.cn'),
        );
      }
    } catch {
      existingSources = [];
    }
    const nextSources = JSON.stringify(
      Array.from(new Set([...NANCHANG_OFFICIAL_SOURCES, ...existingSources])),
    );
    const needsUrlFix =
      !ncu.officialUrl || ncu.officialUrl.includes('nanchanguniversity.edu.cn');
    const nextOfficialUrl = needsUrlFix ? 'https://www.ncu.edu.cn/' : ncu.officialUrl;
    const nextDegree = ncu.degree === 'Bachelor' ? 'Bachelor, Master, Doctoral' : ncu.degree;

    if (
      ncu.officialUrl !== nextOfficialUrl ||
      ncu.sourceUrls !== nextSources ||
      ncu.degree !== nextDegree
    ) {
      await prisma.university.update({
        where: { id: ncu.id },
        data: {
          officialUrl: nextOfficialUrl,
          sourceUrls: nextSources,
          degree: nextDegree,
        },
      });
      changes++;
    }

    for (const prog of ncu.programs) {
      if (prog.sourceUrl && prog.sourceUrl.includes('nanchanguniversity.edu.cn')) {
        await prisma.program.update({
          where: { id: prog.id },
          data: { sourceUrl: 'https://iec.ncu.edu.cn/' },
        });
        changes++;
      }
    }

    const masterPrograms = [
      {
        level: 'Master',
        name: 'Computer Science and Technology',
        subject: 'Computer Science & Artificial Intelligence',
        languages: 'English, Chinese',
        duration: '3 years',
        intakes: 'September',
        tuition: '25,000 CNY/Year',
        applicationDeadline: '1st March 2027 (CSC Type B)',
        eligibility: JSON.stringify([
          'Recognized Bachelor’s degree holder, typically under age 35 for CSC Type B High-Level Postgraduate consideration.',
          'HSK Level 4+ for Chinese-taught supervision (exempt with proof of Chinese-medium prior degree) or verified English proficiency & IEC interview for English-taught supervision.',
        ]),
        sourceUrl: 'https://iec.ncu.edu.cn/lxnd/ssxm.htm',
      },
      {
        level: 'Master',
        name: 'Artificial Intelligence',
        subject: 'Artificial Intelligence & Intelligent Systems',
        languages: 'Chinese, English',
        duration: '3 years',
        intakes: 'September',
        tuition: '25,000 CNY/Year',
        applicationDeadline: '1st March 2027 (CSC Type B)',
        eligibility: JSON.stringify([
          'Recognized Bachelor’s degree holder, under age 35 for 2027–2028 CSC Type B High-Level Postgraduate program (all NCU majors eligible per Nov 5, 2026 IEC notice).',
          'Submit NCU portal (apply.ncu.edu.cn) and CSC portal (Agency No. 10403) with 1,000+ word study plan, 2 Associate Prof.+ references, physical exam & non-criminal record.',
        ]),
        sourceUrl: 'https://iec.ncu.edu.cn/info/1691/22826.htm',
      },
    ];

    const existingProgKeys = new Set(
      ncu.programs.map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
    );
    for (const mp of masterPrograms) {
      const key = `${mp.level.toLowerCase()}::${mp.name.toLowerCase()}`;
      if (!existingProgKeys.has(key)) {
        await prisma.program.create({
          data: {
            universityId: ncu.id,
            ...mp,
            status: 'active',
          },
        });
        changes++;
      }
    }

    const hasCscTypeB = ncu.scholarships.some((s) => /csc\s+type\s+b/i.test(s.title));
    if (!hasCscTypeB) {
      await prisma.scholarship.create({
        data: {
          universityId: ncu.id,
          title: 'Chinese Government Scholarship (CSC Type B — High-Level Postgraduate)',
          type: 'Full (CSC)',
          details: JSON.stringify([
            'CSC Agency Number: 10403 (2027–2028 High-Level Postgraduate Program)',
            'All Master’s (under age 35) and PhD (under age 40) majors at NCU eligible per Nov 5, 2026 IEC notice',
            'Submit apply.ncu.edu.cn and campuschina.org by 1 March 2027',
          ]),
          eligiblePrograms: JSON.stringify(['Master', 'Doctoral']),
          coverage:
            'Tuition waiver, on-campus accommodation or housing subsidy, monthly living stipend, and medical insurance',
          deadline: '1st March 2027',
          sourceUrl: 'https://iec.ncu.edu.cn/info/1691/22826.htm',
          status: 'active',
        },
      });
      changes++;
    }
  }

  // 2. Chengdu Normal University: fix broken officialUrl & vague generic scholarship
  const cdnu = await prisma.university.findUnique({
    where: { slug: 'chengdu-normal-university' },
    include: { programs: true, scholarships: true, fees: true },
  });
  if (cdnu) {
    let existingSources = [];
    try {
      const parsed = JSON.parse(cdnu.sourceUrls || '[]');
      if (Array.isArray(parsed)) {
        existingSources = parsed.filter(
          (u) => typeof u === 'string' && !u.includes('chengdunormaluniversity.edu.cn'),
        );
      }
    } catch {
      existingSources = [];
    }
    const nextSources = JSON.stringify(
      Array.from(new Set([...CHENGDU_NORMAL_OFFICIAL_SOURCES, ...existingSources])),
    );
    const needsUrlFix =
      !cdnu.officialUrl || cdnu.officialUrl.includes('chengdunormaluniversity.edu.cn');
    const nextOfficialUrl = needsUrlFix ? 'https://www.cdnu.edu.cn/' : cdnu.officialUrl;

    if (cdnu.officialUrl !== nextOfficialUrl || cdnu.sourceUrls !== nextSources) {
      await prisma.university.update({
        where: { id: cdnu.id },
        data: {
          officialUrl: nextOfficialUrl,
          sourceUrls: nextSources,
        },
      });
      changes++;
    }

    for (const prog of cdnu.programs) {
      if (prog.sourceUrl && prog.sourceUrl.includes('chengdunormaluniversity.edu.cn')) {
        await prisma.program.update({
          where: { id: prog.id },
          data: { sourceUrl: 'https://www.cdnu.edu.cn/' },
        });
        changes++;
      }
    }

    for (const fee of cdnu.fees) {
      if (!fee.sourceUrl) {
        await prisma.fee.update({
          where: { id: fee.id },
          data: { sourceUrl: 'https://www.cdnu.edu.cn/' },
        });
        changes++;
      }
    }

    for (const sch of cdnu.scholarships) {
      if (sch.title === 'Scholarship' && !sch.type && !sch.coverage) {
        await prisma.scholarship.update({
          where: { id: sch.id },
          data: {
            title: 'Chengdu Normal University Scholarship & Regional Grants',
            type: 'University / Regional',
            coverage:
              'Catalog reduced tuition recorded at CNY 5,000/year; confirm annual university, Sichuan Provincial, and CSC eligibility directly on cdnu.edu.cn',
            sourceUrl: 'https://www.cdnu.edu.cn/',
          },
        });
        changes++;
      }
    }
  }

  // 3. China Medical University: verify university data, programs, and 2027 CSC Type B scholarship
  let cmu = await prisma.university.findUnique({
    where: { slug: 'china-medical-university' },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!cmu) {
    cmu = await prisma.university.create({
      data: {
        slug: 'china-medical-university',
        name: 'China Medical University',
        location: 'Shenyang, Liaoning, China',
        country: 'China',
        city: 'Shenyang',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 6,
        rankingWorld: 501,
        rankingNational: 6,
        majors:
          'Clinical Medicine (MBBS), Clinical Medicine (Master & PhD), Stomatology, Basic Medicine, Public Health and Preventive Medicine, Pharmacy, Biology',
        tuition: 'CNY 40,000 / year',
        tuitionDetails: JSON.stringify([
          'MBBS (Undergraduate): CNY 40,000 / year',
          'Clinical Medicine Master: CNY 42,000 / year',
          'Clinical Medicine Doctoral/PhD: CNY 48,000 / year',
        ]),
        documents: JSON.stringify([
          'Valid passport and photograph',
          'Graduation certificates and full academic transcripts (Notarized)',
          'English proficiency certificate (IELTS >= 6.0 / TOEFL >= 70) and HSK Level 4 certificate',
          'Acceptance Letter from CMU Professor or Prospective Tutor Application Form',
          'Foreigner Physical Examination Form with blood test reports',
          'Non-Criminal Record (Police Clearance)',
          'Two Recommendation Letters from Professors/Associate Professors',
          'Detailed Study and Research Plan (minimum 1,000 words)',
        ]),
        deadlineApplication:
          '25 February 2027 (CSC Type B High-Level Graduate) / 30 June 2027 (Self-Funded)',
        notes: JSON.stringify([
          'CSC Agency Number: 10159 (High-Level Graduate Program Type B).',
          'Age Limits: Master under 35 years; PhD under 40 years.',
          'Language Requirements: Chinese-taught requires HSK Level 4 (score >= 180); English-taught requires IELTS >= 6.0 / TOEFL >= 70 AND HSK Level 4 for hospital clinical rotations.',
          'Supervisor pre-acceptance required via CMU supervisor directory or hren@cmu.edu.cn.',
          'Double application required: CSC portal (campuschina.org) and CMU portal (cmu.17gz.org).',
        ]),
        badges: JSON.stringify(['CSC Type B Eligible', 'BMDC & WHO Listed', 'Clinical Medicine']),
        logo: '/images/universities/logos/china-medical-university.webp',
        isActive: true,
        officialUrl: 'https://www.cmu.edu.cn',
        aliases: JSON.stringify(['中国医科大学', 'CMU', 'China Medical University Shenyang']),
        legacySlugs: JSON.stringify([]),
        relationshipType: 'public_direct_application',
        recognitionAuthority:
          'Ministry of Education (MoE) PR China · WHO & WDOMS Listed · BMDC Listed',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify(CMU_OFFICIAL_SOURCES),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  } else {
    let existingSources = [];
    try {
      const parsed = JSON.parse(cmu.sourceUrls || '[]');
      if (Array.isArray(parsed)) {
        existingSources = parsed.filter((u) => typeof u === 'string');
      }
    } catch {
      existingSources = [];
    }
    const nextSources = JSON.stringify(
      Array.from(new Set([...CMU_OFFICIAL_SOURCES, ...existingSources])),
    );
    const nextDegree = 'Bachelor, Master, PhD';
    const nextTaught = 'English, Chinese';
    const nextMajors =
      'Clinical Medicine (MBBS), Clinical Medicine (Master & PhD), Stomatology, Basic Medicine, Public Health and Preventive Medicine, Pharmacy, Biology';
    const nextDeadline =
      '25 February 2027 (CSC Type B High-Level Graduate) / 30 June 2027 (Self-Funded)';

    let parsedNotes = [];
    try {
      parsedNotes = JSON.parse(cmu.notes || '[]');
      if (!Array.isArray(parsedNotes)) parsedNotes = [];
    } catch {
      parsedNotes = [];
    }
    const cmuNoteKey = 'CSC Agency Number: 10159';
    if (!parsedNotes.some((n) => typeof n === 'string' && n.includes(cmuNoteKey))) {
      parsedNotes.push(
        'CSC Agency Number: 10159 (High-Level Graduate Program Type B).',
        'Age Limits: Master under 35 years; PhD under 40 years.',
        'Language Requirements: Chinese-taught requires HSK Level 4 (score >= 180); English-taught requires IELTS >= 6.0 / TOEFL >= 70 AND HSK Level 4 for hospital clinical rotations.',
        'Supervisor pre-acceptance required via CMU supervisor directory or hren@cmu.edu.cn.',
        'Double application required: CSC portal (campuschina.org) and CMU portal (cmu.17gz.org).',
      );
    }
    const nextNotes = JSON.stringify(parsedNotes);

    await prisma.university.update({
      where: { id: cmu.id },
      data: {
        degree: nextDegree,
        taught: nextTaught,
        majors: nextMajors,
        deadlineApplication: nextDeadline,
        notes: nextNotes,
        sourceUrls: nextSources,
        officialUrl: 'https://www.cmu.edu.cn',
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
    });
    changes++;
  }

  const cmuGraduatePrograms = [
    {
      level: 'Master',
      name: 'Clinical Medicine (Master of Medicine / MSc)',
      subject: 'Clinical Medicine (Internal Medicine, Surgery, Pediatrics, Oncology, Neurology)',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '42,000 CNY/Year',
      applicationDeadline: '25 February 2027 (CSC Type B) / 30 June 2027 (Self-Funded)',
      eligibility: JSON.stringify([
        'Recognized MBBS or Bachelor of Medicine degree holder under age 35 for CSC Type B High-Level Graduate Program.',
        'Chinese-taught tracks require HSK Level 4 (score >= 180). English-taught tracks require IELTS >= 6.0 / TOEFL >= 70 AND HSK Level 4 (mandatory for hospital clinical rotations).',
        'Supervisor Acceptance Letter from CMU professor or contact form to hren@cmu.edu.cn required.',
      ]),
      sourceUrl: 'https://www.cmu.edu.cn/gjjyxy/zsxx/dsxx.htm',
    },
    {
      level: 'Doctoral',
      name: 'Clinical Medicine (Doctor of Medicine / PhD)',
      subject: 'Clinical Medicine & Translational Medical Research',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '48,000 CNY/Year',
      applicationDeadline: '25 February 2027 (CSC Type B) / 30 June 2027 (Self-Funded)',
      eligibility: JSON.stringify([
        'Master’s degree in Medicine (MMed/MSc) holder under age 40 for CSC Type B High-Level Graduate Program.',
        'Chinese-taught tracks require HSK Level 4 (score >= 180). English-taught tracks require IELTS >= 6.0 / TOEFL >= 70 AND HSK Level 4.',
        'Research proposal (>1,000 words) signed by prospective CMU supervisor required.',
      ]),
      sourceUrl: 'https://www.cmu.edu.cn/gjjyxy/zsxx/dsxx.htm',
    },
    {
      level: 'Master',
      name: 'Stomatology (Master of Stomatology / BDS Postgrad)',
      subject: 'Oral & Maxillofacial Surgery, Prosthodontics, Orthodontics',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '42,000 CNY/Year',
      applicationDeadline: '25 February 2027 (CSC Type B)',
      eligibility: JSON.stringify([
        'Bachelor of Dental Surgery (BDS) or Stomatology degree holder under age 35.',
        'IELTS >= 6.0 / TOEFL >= 70 plus HSK Level 4 for English track; HSK 4 for Chinese track.',
        'Supervisor Acceptance Letter from CMU Stomatology faculty required.',
      ]),
      sourceUrl: 'https://www.cmu.edu.cn/gjjyxy/zsxx/dsxx.htm',
    },
    {
      level: 'Master',
      name: 'Basic Medicine, Public Health & Pharmacy',
      subject: 'Pathology, Immunology, Public Health, Pharmacy, Biology',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '35,000 CNY/Year',
      applicationDeadline: '25 February 2027 (CSC Type B)',
      eligibility: JSON.stringify([
        'Bachelor’s degree in Medicine, Public Health, Pharmacy, or Biological Sciences under age 35.',
        'IELTS >= 6.0 or HSK Level 4.',
        'Pre-admission or supervisor acceptance letter from CMU required.',
      ]),
      sourceUrl: 'https://www.cmu.edu.cn/gjjyxy/zsxx/dsxx.htm',
    },
  ];

  const existingCmuProgKeys = new Set(
    (cmu.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of cmuGraduatePrograms) {
    const key = `${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`;
    if (!existingCmuProgKeys.has(key)) {
      await prisma.program.create({
        data: {
          universityId: cmu.id,
          ...prog,
          status: 'active',
        },
      });
      changes++;
    }
  }

  const hasCmuCscTypeB = (cmu.scholarships || []).some((s) => /csc\s+type\s+b|high-level\s+graduate/i.test(s.title));
  if (!hasCmuCscTypeB) {
    await prisma.scholarship.create({
      data: {
        universityId: cmu.id,
        title: 'Chinese Government Scholarship (CSC Type B — High-Level Graduate Program)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10159 (China Medical University)',
          'Program Category: Type B High-Level Graduate Program',
          'Degrees: Master’s (under age 35) & Doctoral / PhD (under age 40)',
          'Eligible fields: Clinical Medicine, Stomatology, Basic Medicine, Public Health, Pharmacy, Biology',
          'Application Deadline: 25 February 2027 via campuschina.org and cmu.17gz.org',
          'Mandatory Supervisor Contact: hren@cmu.edu.cn / +86-24-31939481',
        ]),
        amount:
          'Full Scholarship: 100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition:
          'Master under 35 (MBBS/Bachelor); PhD under 40 (Master). English track requires IELTS >= 6.0 / TOEFL >= 70 AND HSK 4; Chinese track requires HSK 4. Supervisor acceptance required.',
        eligiblePrograms: JSON.stringify([
          'Master in Clinical Medicine',
          'Doctoral in Clinical Medicine (PhD)',
          'Stomatology',
          'Basic Medicine',
          'Public Health and Preventive Medicine',
          'Pharmacy',
          'Biology',
        ]),
        coverage:
          '100% tuition waiver, free on-campus university accommodation, comprehensive medical insurance, and monthly living allowance (Master: CNY 3,000/month; PhD: CNY 3,500/month)',
        deadline: '25 February 2027',
        sourceUrl: 'https://www.cmu.edu.cn/gjjyxy/',
        status: 'active',
      },
    });
    changes++;
  }

  // 4. Shanghai DianJi University (SDJU): verify university data, spring language program, and fees
  let sdju = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'sdu' },
        { slug: 'shanghai-dianji-university' },
        { name: { contains: 'Dianji' } },
        { name: { contains: 'DianJi' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  const sdjuSources = JSON.stringify(
    Array.from(new Set([...SDJU_OFFICIAL_SOURCES, 'https://www.sdju.edu.cn/'])),
  );
  const sdjuTuitionDetails = JSON.stringify([
    'Chinese Language Program (Spring 2027): CNY 16,000 / academic year',
    'Bachelor Degree Programs (English-taught): CNY 20,000 / year',
  ]);
  const sdjuNotes = JSON.stringify([
    'Location: Lin-gang Special Area, Shanghai Pilot Free Trade Zone, Shanghai.',
    'Spring 2027 Chinese Language Program: Deadline 15 December 2026 (Rolling admissions, first-come first-served dorms).',
    'Study Period: Early March 2027 to early January 2028 (32 weeks, 640 class hours).',
    'Class Levels: Beginner & Intermediate (Placement test; HSK 4+ placed automatically in Intermediate).',
    'Accommodation: On-campus double room CNY 9,600/year; single room CNY 19,200/year.',
    'Official Portal: intlst.sdju.edu.cn | Email: admission@sdju.edu.cn | Tel: +86-21-38220166',
  ]);

  if (!sdju) {
    sdju = await prisma.university.create({
      data: {
        slug: 'shanghai-dianji-university',
        name: 'Shanghai DianJi University',
        location: 'Shanghai (Lin-gang Special Area), China',
        country: 'China',
        city: 'Shanghai',
        intake: 'March, September',
        degree: 'Non-Degree Language, Bachelor, Master',
        taught: 'Chinese, English',
        rankingCountry: 390,
        rankingWorld: null,
        rankingNational: 390,
        majors:
          'Chinese Language & Culture (1-Year Preparatory), Automation, Software Engineering, International Trade and Economics, Marketing',
        tuition: 'CNY 16,000 / year (Language) · CNY 20,000 / year (Bachelor)',
        tuitionDetails: sdjuTuitionDetails,
        documents: JSON.stringify([
          'Passport copy (valid > 1 year)',
          'High school graduation certificate and transcripts (notarized)',
          'Foreigner Physical Examination Form with blood test reports',
          'Police Clearance Certificate (Non-Criminal Record)',
          'Financial Guarantee / Bank Statement',
          'Application fee payment voucher (CNY 400)',
        ]),
        deadlineApplication:
          '15 December 2026 (Spring 2027 Chinese Language) / 30 May 2027 (Autumn 2027 Degree)',
        deadlineStartDate: 'March 2027 (Language) / September 2027 (Degree)',
        notes: sdjuNotes,
        badges: JSON.stringify(['Lin-gang Free Trade Zone', 'March 2027 Intake', 'Language Preparatory']),
        logo: '/images/universities/logos/sdu.webp',
        isActive: true,
        officialUrl: 'https://www.sdju.edu.cn',
        aliases: JSON.stringify(['SDJU', 'SDU', 'Shanghai DianJi University', '上海电机学院']),
        legacySlugs: JSON.stringify(['sdu', 'sdju']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: sdjuSources,
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  } else {
    let existingLegacies = [];
    try {
      existingLegacies = JSON.parse(sdju.legacySlugs || '[]');
      if (!Array.isArray(existingLegacies)) existingLegacies = [];
    } catch {
      existingLegacies = [];
    }
    const nextLegacies = JSON.stringify(Array.from(new Set([...existingLegacies, 'sdu', 'sdju'])));

    let existingAliases = [];
    try {
      existingAliases = JSON.parse(sdju.aliases || '[]');
      if (!Array.isArray(existingAliases)) existingAliases = [];
    } catch {
      existingAliases = [];
    }
    const nextAliases = JSON.stringify(Array.from(new Set([...existingAliases, 'SDJU', 'SDU', 'Shanghai DianJi University', '上海电机学院'])));

    await prisma.university.update({
      where: { id: sdju.id },
      data: {
        name: 'Shanghai DianJi University',
        slug: 'shanghai-dianji-university',
        legacySlugs: nextLegacies,
        aliases: nextAliases,
        officialUrl: 'https://www.sdju.edu.cn',
        location: 'Shanghai (Lin-gang Special Area), China',
        city: 'Shanghai',
        intake: 'March, September',
        degree: 'Non-Degree Language, Bachelor, Master',
        taught: 'Chinese, English',
        majors:
          'Chinese Language & Culture (1-Year Preparatory), Automation, Software Engineering, International Trade and Economics, Marketing',
        tuition: 'CNY 16,000 / year (Language) · CNY 20,000 / year (Bachelor)',
        tuitionDetails: sdjuTuitionDetails,
        deadlineApplication:
          '15 December 2026 (Spring 2027 Chinese Language) / 30 May 2027 (Autumn 2027 Degree)',
        deadlineStartDate: 'March 2027 (Language) / September 2027 (Degree)',
        notes: sdjuNotes,
        sourceUrls: sdjuSources,
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
    });
    changes++;
  }

  const sdjuLanguageProgram = {
    level: 'Non-Degree',
    name: 'Chinese Language & Culture Program (Spring 2027 Intake)',
    subject: 'Chinese Language & HSK Preparation',
    languages: 'Chinese',
    duration: '1 year (March 2027 – January 2028, 32 weeks, 640 hours)',
    intakes: 'March',
    tuition: '16,000 CNY/Year',
    applicationDeadline: '15 December 2026',
    eligibility: JSON.stringify([
      'Non-Chinese citizen in good physical and mental health.',
      'Age 18 and above with High school diploma (HSC / A-Level or equivalent).',
      'Capable of affording study and living expenses. No criminal record.',
      'Placement test for beginner or intermediate levels (HSK 4+ automatically placed in intermediate).',
    ]),
    sourceUrl: 'https://intlst.sdju.edu.cn',
    status: 'active',
  };

  const existingSdjuProgKeys = new Set(
    (sdju.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  const langKey = `${sdjuLanguageProgram.level.toLowerCase()}::${sdjuLanguageProgram.name.toLowerCase()}`;
  if (!existingSdjuProgKeys.has(langKey)) {
    await prisma.program.create({
      data: {
        universityId: sdju.id,
        ...sdjuLanguageProgram,
      },
    });
    changes++;
  }

  // Ensure fees are up to date
  const existingFeeItems = new Set((sdju.fees || []).map((f) => f.item.trim().toLowerCase()));
  if (!existingFeeItems.has('language program tuition')) {
    await prisma.fee.create({
      data: {
        universityId: sdju.id,
        item: 'Language Program Tuition',
        cost: '16,000 CNY/Year',
        notes: 'Spring 2027 intake (32 weeks / 640 class hours)',
        validFor: 'Spring 2027 Intake',
        sourceUrl: 'https://intlst.sdju.edu.cn',
      },
    });
    changes++;
  }
  if (!existingFeeItems.has('on-campus single room hostel')) {
    await prisma.fee.create({
      data: {
        universityId: sdju.id,
        item: 'On-Campus Single Room Hostel',
        cost: '19,200 CNY/Year',
        notes: 'Subject to availability on a first-come, first-served basis',
        validFor: '2026/2027 Academic Year',
        sourceUrl: 'https://intlst.sdju.edu.cn',
      },
    });
    changes++;
  }


  // 5. Nanjing University of Science and Technology (NJUST): verify university data, programs, scholarships, and fees
  let njust = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'njust' },
        { slug: 'nanjing-university-of-science-and-technology' },
        { name: { contains: 'Nanjing University of Science and Technology' } },
        { name: { contains: 'NJUST' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  const njustSources = JSON.stringify(
    Array.from(new Set([...NJUST_OFFICIAL_SOURCES, 'https://study.njust.edu.cn/'])),
  );
  const njustTuitionDetails = JSON.stringify([
    'Bachelor Degree Programs (English-taught): CNY 16,000–22,000 / year (Covered under Lanshan Tier A+/A)',
    'Master Degree Programs (English & Chinese): CNY 26,000 / year (100% Waived under CSC Type B & Lanshan Full Scholarship)',
    'Doctoral Degree Programs (PhD): CNY 34,000 / year (100% Waived under CSC Type B & Lanshan A-Tier)',
  ]);
  const njustNotes = JSON.stringify([
    'Location: No. 200 Xiaolingwei Street, Nanjing, Jiangsu Province, China (near Purple Mountain).',
    'National Key University under the Ministry of Industry and Information Technology (MIIT); Project 211 & Double First-Class.',
    'Global top 1‰ by Clarivate ESI in Engineering, Materials Science, Computer Science, and Chemistry.',
    'CSC High-Level Postgraduate Program (Type B): Agency No. 10288 · Deadline 5 March 2027.',
    'NJUST Lanshan Scholarship: Deadline 15 May 2027 · Undergraduates require CSCA score report (csca.cn).',
    'Application Fee: CNY 500 payable directly inside the NJUST 17gz online system.',
    'Official Portal: study.njust.edu.cn / njust.17gz.org | Email: postgraduate@njust.edu.cn / undergraduate@njust.edu.cn | Tel: +86-25-84303136',
  ]);

  if (!njust) {
    njust = await prisma.university.create({
      data: {
        slug: 'nanjing-university-of-science-and-technology',
        name: 'Nanjing University of Science and Technology',
        location: 'Nanjing, Jiangsu Province, China',
        country: 'China',
        city: 'Nanjing',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 35,
        rankingWorld: 300,
        rankingNational: 35,
        majors:
          'Computer Science and Technology, Software Engineering, Artificial Intelligence, Control Science and Engineering, Mechanical Engineering, Optical Engineering, Materials Science and Engineering, Chemical Engineering and Technology, Environmental Science and Engineering',
        tuition: 'CNY 16,000–34,000 / year (Full waiver under CSC Type B & Lanshan Scholarships)',
        tuitionDetails: njustTuitionDetails,
        documents: JSON.stringify([
          'Passport identification page (valid >= 12 months)',
          'Notarized highest degree certificate (Bachelor for Master, Master for PhD, High School for Bachelor)',
          'Official academic transcripts stamped by previous institutions',
          'Language proficiency certificate (IELTS >= 6.0 / TOEFL >= 85 / Duolingo >= 105 or HSK 5/6)',
          'Study plan or research proposal (>=800 words for Bachelor, >=1,000 words for Graduate)',
          'Two academic recommendation letters from professors or high-school teachers',
          'Supervisor acceptance or intention letter (strongly recommended for graduate candidates)',
          'Foreigner Physical Examination Form (issued within 6 months with lab reports)',
          'Certificate of No Criminal Record / Police Clearance (issued within 6 months)',
          'Financial Guarantee / Bank Statement',
          'CSCA Test Score Report (mandatory for undergraduate applicants)',
          'Application fee voucher (CNY 500 paid in NJUST portal)',
        ]),
        deadlineApplication: '5 March 2027 (CSC Type B) / 15 May 2027 (Lanshan Scholarship)',
        deadlineStartDate: 'September 2027',
        notes: njustNotes,
        badges: JSON.stringify([
          'National Key University (MIIT)',
          'Double First-Class',
          'Top 1‰ ESI Worldwide',
          'CSC Agency 10288',
          'Lanshan Scholarship',
          'English Taught',
        ]),
        logo: '/images/universities/logos/njust.webp',
        isActive: true,
        officialUrl: 'https://study.njust.edu.cn/',
        aliases: JSON.stringify([
          'NJUST',
          'Nanjing University of Science and Technology',
          '南京理工大学',
          'Nanjing Tech Institute',
          'MIIT Nanjing',
        ]),
        legacySlugs: JSON.stringify(['njust']),
        relationshipType: 'public_direct_application',
        recognitionAuthority:
          'Ministry of Industry and Information Technology (MIIT) & Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'https://study.njust.edu.cn/',
        sourceUrls: njustSources,
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  } else {
    let existingLegacies = [];
    try {
      existingLegacies = JSON.parse(njust.legacySlugs || '[]');
      if (!Array.isArray(existingLegacies)) existingLegacies = [];
    } catch {
      existingLegacies = [];
    }
    const nextLegacies = JSON.stringify(Array.from(new Set([...existingLegacies, 'njust'])));

    let existingAliases = [];
    try {
      existingAliases = JSON.parse(njust.aliases || '[]');
      if (!Array.isArray(existingAliases)) existingAliases = [];
    } catch {
      existingAliases = [];
    }
    const nextAliases = JSON.stringify(
      Array.from(new Set([...existingAliases, 'NJUST', 'Nanjing University of Science and Technology', '南京理工大学'])),
    );

    await prisma.university.update({
      where: { id: njust.id },
      data: {
        name: 'Nanjing University of Science and Technology',
        slug: 'nanjing-university-of-science-and-technology',
        legacySlugs: nextLegacies,
        aliases: nextAliases,
        officialUrl: 'https://study.njust.edu.cn/',
        location: 'Nanjing, Jiangsu Province, China',
        city: 'Nanjing',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 35,
        rankingWorld: 300,
        rankingNational: 35,
        majors:
          'Computer Science and Technology, Software Engineering, Artificial Intelligence, Control Science and Engineering, Mechanical Engineering, Optical Engineering, Materials Science and Engineering, Chemical Engineering and Technology, Environmental Science and Engineering',
        tuition: 'CNY 16,000–34,000 / year (Full waiver under CSC Type B & Lanshan Scholarships)',
        tuitionDetails: njustTuitionDetails,
        deadlineApplication: '5 March 2027 (CSC Type B) / 15 May 2027 (Lanshan Scholarship)',
        deadlineStartDate: 'September 2027',
        notes: njustNotes,
        sourceUrls: njustSources,
        logo: '/images/universities/logos/njust.webp',
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
    });
    changes++;
  }

  // NJUST Programs
  const njustPrograms = [
    {
      level: 'Bachelor',
      name: 'Computer Science and Technology (BSc)',
      subject: 'Computer Science & Software',
      languages: 'English',
      duration: '4 years',
      intakes: 'September',
      tuition: '16,000–22,000 CNY/Year',
      applicationDeadline: '15 May 2027',
      eligibility: JSON.stringify([
        'Non-Chinese citizen aged 18–25 with high school diploma / Grade 12 / HSC / A-Levels.',
        'CSCA Test score report mandatory (csca.cn).',
        'English proficiency: IELTS >= 6.0 / TOEFL >= 85 / Duolingo >= 105 or MOI proof.',
      ]),
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
    {
      level: 'Bachelor',
      name: 'Mechanical Engineering (BEng)',
      subject: 'Mechanical & Automation Engineering',
      languages: 'English',
      duration: '4 years',
      intakes: 'September',
      tuition: '16,000–22,000 CNY/Year',
      applicationDeadline: '15 May 2027',
      eligibility: JSON.stringify([
        'Non-Chinese citizen aged 18–25 with high school diploma / Grade 12 / HSC / A-Levels.',
        'CSCA Test score report mandatory (csca.cn).',
        'English proficiency: IELTS >= 6.0 / TOEFL >= 85 / Duolingo >= 105.',
      ]),
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Computer Science and Technology (MSc)',
      subject: 'Computer Science & AI',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B & Lanshan Full Scholarship)',
      applicationDeadline: '5 March 2027 (CSC Type B) / 15 May 2027 (Lanshan)',
      eligibility: JSON.stringify([
        'Bachelor’s degree in Computer Science, Software, or related STEM field under age 35.',
        'English proficiency: IELTS >= 6.0 / TOEFL >= 85 / Duolingo >= 105 or proof of English-medium degree.',
        'Research proposal (>=1,000 words); Supervisor acceptance letter strongly recommended.',
      ]),
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Control Science and Engineering (MSc)',
      subject: 'Automation & Control Science',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B & Lanshan Full Scholarship)',
      applicationDeadline: '5 March 2027 (CSC Type B) / 15 May 2027 (Lanshan)',
      eligibility: JSON.stringify([
        'Bachelor’s degree in Engineering or Applied Sciences under age 35.',
        'Research proposal (>=1,000 words); Supervisor acceptance letter advised.',
      ]),
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Materials Science and Engineering (MSc)',
      subject: 'Materials Science',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B & Lanshan Full Scholarship)',
      applicationDeadline: '5 March 2027 (CSC Type B) / 15 May 2027 (Lanshan)',
      eligibility: JSON.stringify([
        'Bachelor’s degree in Materials, Chemistry, or Metallurgy under age 35.',
        'Research proposal (>=1,000 words); Supervisor acceptance letter advised.',
      ]),
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
    {
      level: 'Doctoral',
      name: 'Computer Science and Technology (PhD)',
      subject: 'Computer Science, AI & Cyber Security',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '34,000 CNY/Year (Waived under CSC Type B & Lanshan Tier A)',
      applicationDeadline: '5 March 2027 (CSC Type B) / 15 May 2027 (Lanshan)',
      eligibility: JSON.stringify([
        'Master’s degree in CS, Software, or related field under age 40.',
        'Strong research publications/record; Research proposal (>=1,000 words); Supervisor acceptance letter strongly advised.',
      ]),
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
    {
      level: 'Doctoral',
      name: 'Optical Engineering (PhD)',
      subject: 'Optics, Photonics & Engineering',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '34,000 CNY/Year (Waived under CSC Type B & Lanshan Tier A)',
      applicationDeadline: '5 March 2027 (CSC Type B) / 15 May 2027 (Lanshan)',
      eligibility: JSON.stringify([
        'Master’s degree in Optics, Physics, or Electrical Engineering under age 40.',
        'Research proposal (>=1,000 words); Supervisor acceptance letter advised.',
      ]),
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
  ];

  const existingNjustProgKeys = new Set(
    (njust.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of njustPrograms) {
    const key = `${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`;
    if (!existingNjustProgKeys.has(key)) {
      await prisma.program.create({
        data: {
          universityId: njust.id,
          ...prog,
        },
      });
      changes++;
    }
  }

  // NJUST Scholarships
  const njustScholarships = [
    {
      title: 'Chinese Government Scholarship (CSC Type B — High-Level Postgraduate Program)',
      type: 'Full (CSC)',
      details: JSON.stringify([
        'CSC Agency Number: 10288 (Nanjing University of Science and Technology)',
        'Program Category: Type B High-Level Postgraduate Program',
        'Degrees: Master’s (under age 35) & Doctoral / PhD (under age 40)',
        'Application Deadline: 5 March 2027 (Dual application via studyinchina.csc.edu.cn & njust.17gz.org)',
        'Award: 100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        'Stipend: Master’s CNY 3,000/month · Doctoral CNY 3,500/month',
        'Supervisor Directory: https://gs.njust.edu.cn/dsjs/list.htm',
      ]),
      amount:
        'Full Scholarship: 100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend (Master’s CNY 3,000/mo, PhD CNY 3,500/mo) + Medical Insurance',
      condition:
        'Non-Chinese citizen. Master under 35 (Bachelor holder); PhD under 40 (Master holder). Dual-system application. Supervisor acceptance letter advised.',
      eligiblePrograms: JSON.stringify([
        'Computer Science and Technology (MSc)',
        'Control Science and Engineering (MSc)',
        'Materials Science and Engineering (MSc)',
        'Computer Science and Technology (PhD)',
        'Optical Engineering (PhD)',
      ]),
      coverage:
        '100% tuition waiver, on-campus university accommodation (or allowance), monthly living stipend (CNY 3,000–3,500/month), comprehensive medical insurance.',
      deadline: '5 March 2027',
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
    {
      title: 'NJUST Lanshan Scholarship (澜杉奖学金) — Postgraduate Full Track',
      type: 'Full (Institutional)',
      details: JSON.stringify([
        'University-endowed scholarship for outstanding international graduate candidates',
        'Coverage: 100% Tuition waiver + Free on-campus accommodation + Monthly stipend',
        'Stipend: Master’s CNY 1,500/month · PhD CNY 1,500–3,500/month',
        'Application Deadline: 15 May 2027 via njust.17gz.org',
        'Candidates not awarded CSC Type B are automatically considered for Lanshan Scholarship',
      ]),
      amount:
        '100% Tuition Waiver + Free Campus Dormitory + Monthly Living Stipend (Master: CNY 1,500/mo; PhD: CNY 1,500–3,500/mo)',
      condition:
        'Non-Chinese citizen. Master under 35; PhD under 40. Apply via njust.17gz.org. Annual performance review required.',
      eligiblePrograms: JSON.stringify([
        'Computer Science and Technology (MSc)',
        'Control Science and Engineering (MSc)',
        'Materials Science and Engineering (MSc)',
        'Computer Science and Technology (PhD)',
        'Optical Engineering (PhD)',
      ]),
      coverage: 'Tuition waiver, on-campus accommodation, monthly stipend, medical insurance.',
      deadline: '15 May 2027',
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
    {
      title: 'NJUST Lanshan Scholarship (澜杉奖学金) — Undergraduate Track (Tiers A+/A/B/C)',
      type: 'Full / Partial',
      details: JSON.stringify([
        'Tier A+: 100% Tuition Waiver + Free Dormitory + CNY 1,000/month Stipend',
        'Tier A: 100% Tuition Waiver (Dorm self-funded)',
        'Tier B: 50% Tuition Reduction',
        'Tier C: Free On-Campus Dormitory Waiver',
        'CSCA Exam Score Report mandatory (register at www.csca.cn)',
        'Application Deadline: 15 May 2027 via njust.17gz.org',
      ]),
      amount: 'Tier A+ (Full Tuition + Free Dorm + CNY 1,000/mo) down to Tier B (50% Tuition) / Tier C (Free Dorm)',
      condition:
        'Non-Chinese citizen aged 18–25. High school diploma / Grade 12 / HSC / A-Levels. CSCA test score report mandatory.',
      eligiblePrograms: JSON.stringify([
        'Computer Science and Technology (BSc)',
        'Mechanical Engineering (BEng)',
      ]),
      coverage: 'Tuition waiver/reduction, on-campus accommodation, and stipend per assigned tier.',
      deadline: '15 May 2027',
      sourceUrl: 'https://study.njust.edu.cn/',
      status: 'active',
    },
  ];

  const existingNjustScholKeys = new Set(
    (njust.scholarships || []).map((s) => s.title.trim().toLowerCase()),
  );
  for (const schol of njustScholarships) {
    if (!existingNjustScholKeys.has(schol.title.toLowerCase())) {
      await prisma.scholarship.create({
        data: {
          universityId: njust.id,
          ...schol,
        },
      });
      changes++;
    }
  }

  // NJUST Fees
  const existingNjustFeeItems = new Set((njust.fees || []).map((f) => f.item.trim().toLowerCase()));
  if (!existingNjustFeeItems.has('application fee (njust portal)')) {
    await prisma.fee.create({
      data: {
        universityId: njust.id,
        item: 'Application Fee (NJUST Portal)',
        cost: '500 CNY (Non-refundable)',
        notes: 'Payable directly in the NJUST online application portal (njust.17gz.org)',
        validFor: '2027 Intake',
        sourceUrl: 'https://study.njust.edu.cn/',
      },
    });
    changes++;
  }
  if (!existingNjustFeeItems.has('comprehensive medical insurance')) {
    await prisma.fee.create({
      data: {
        universityId: njust.id,
        item: 'Comprehensive Medical Insurance',
        cost: '800 CNY/Year',
        notes: 'Covered uniformly by university for CSC and Lanshan full awardees',
        validFor: '2027 Intake',
        sourceUrl: 'https://study.njust.edu.cn/',
      },
    });
    changes++;
  }
  if (!existingNjustFeeItems.has('on-campus accommodation (standard double)')) {
    await prisma.fee.create({
      data: {
        universityId: njust.id,
        item: 'On-Campus Accommodation (Standard Double)',
        cost: '4,000–6,000 CNY/Year',
        notes: 'Waived for CSC Type B and Lanshan Tier A+ / Full awardees',
        validFor: '2027 Intake',
        sourceUrl: 'https://study.njust.edu.cn/',
      },
    });
    changes++;
  }

  return changes;
}

export async function sync2027UniversityGuidesAndRecords(prisma) {
  let updated = await upsertOfficialProgramsAndScholarships(prisma);
  updated += await upsert7NewUniversities(prisma);
  updated += await upsert15WechatUniversities(prisma);
  updated += await upsert18WechatBatch2Universities(prisma);
  updated += await upsert25WechatBatch3Universities(prisma);
  updated += await upsertShenyangCityUniversity(prisma);
  updated += await upsertWechatBatch4Universities(prisma);
  updated += await upsertWechatBatch5Universities(prisma);

  const now = new Date();
  const reviewAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const allSpecs = [...GUIDE_2027_SPECS, ...NEW_7_GUIDE_SPECS, ...WECHAT_15_GUIDE_SPECS, ...WECHAT_BATCH2_18_GUIDE_SPECS, ...WECHAT_BATCH3_25_GUIDE_SPECS, ...SHENYANG_CITY_UNIVERSITY_GUIDE_SPECS, ...WECHAT_BATCH4_9_GUIDE_SPECS, ...WECHAT_BATCH5_7_GUIDE_SPECS];

  for (const spec of allSpecs) {
    const existing = await prisma.content.findUnique({
      where: { slug: spec.slug },
      select: {
        id: true,
        title: true,
        content: true,
        metaTitle: true,
        metaDescription: true,
        featuredImage: true,
        lastVerifiedAt: true,
      },
    });

    if (!existing) {
      await prisma.content.create({
        data: {
          slug: spec.slug,
          title: spec.title,
          type: 'update',
          category: spec.category,
          categories: spec.categories,
          tags: spec.tags,
          excerpt: spec.excerpt,
          metaTitle: spec.metaTitle,
          metaDescription: spec.metaDescription,
          content: spec.content,
          featuredImage: spec.featuredImage,
          author: spec.author,
          reviewer: spec.reviewer,
          sourceUrls: spec.sourceUrls,
          isPublished: true,
          isFeatured: true,
          deadlineAt: spec.deadlineAt,
          publishedAt: now,
          lastVerifiedAt: now,
          nextReviewAt: reviewAt,
          complianceApprovedAt: now,
          seoApprovedAt: now,
        },
      });
      updated++;
      console.log(`Created 2027 priority guide: ${spec.slug}`);
    } else if (
      existing.title !== spec.title ||
      existing.metaTitle !== spec.metaTitle ||
      existing.metaDescription !== spec.metaDescription ||
      existing.content !== spec.content ||
      existing.featuredImage !== spec.featuredImage ||
      !existing.lastVerifiedAt
    ) {
      await prisma.content.update({
        where: { id: existing.id },
        data: {
          title: spec.title,
          category: spec.category,
          categories: spec.categories,
          tags: spec.tags,
          excerpt: spec.excerpt,
          metaTitle: spec.metaTitle,
          metaDescription: spec.metaDescription,
          content: spec.content,
          featuredImage: spec.featuredImage,
          author: spec.author,
          reviewer: spec.reviewer,
          sourceUrls: spec.sourceUrls,
          isPublished: true,
          archivedAt: null,
          deadlineAt: spec.deadlineAt,
          lastVerifiedAt: now,
          nextReviewAt: reviewAt,
        },
      });
      updated++;
      console.log(`Updated 2027 priority guide: ${spec.slug}`);
    }
  }

  return updated;
}
