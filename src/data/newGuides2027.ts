export interface GuideData {
  id: string;
  title: string;
  slug: string;
  type: string;
  category: string;
  categories: string;
  tags: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  author: string;
  reviewer: string;
  sourceUrls: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  lastVerifiedAt: Date;
  nextReviewAt: Date;
  expiresAt: null;
  deadlineAt: Date;
  complianceApprovedAt: Date;
  seoApprovedAt: Date;
  archivedAt: null;
  content: string;
}

export const LNU_2027_SLUG = 'liaoning-university-csc-scholarship-2027';
export const CUST_2027_SLUG = 'changchun-university-of-science-and-technology-csc-scholarship-2027';
export const HSK_2027_SLUG = 'hsk-3-0-examination-calendar-2027';
export const SJZU_2027_SLUG = 'shenyang-jianzhu-university-csc-scholarship-2027';
export const YNNU_2027_SLUG = 'yunnan-normal-university-csc-scholarship-2027';
export const HENU_2027_SLUG = 'henan-university-csc-scholarship-2027';
export const NJUPT_2027_SLUG = 'njupt-csc-scholarship-2027';

export const LNU_2027_SOURCES = [
  'https://www.lnu.edu.cn/',
  'https://lnu.17gz.org/',
  'https://studyinchina.csc.edu.cn/',
  'https://www.campuschina.org/',
];

export const CUST_2027_SOURCES = [
  'https://www.cust.edu.cn/',
  'https://ieec.cust.edu.cn/',
  'https://cust.17gz.org/',
  'https://studyinchina.csc.edu.cn/',
  'https://www.campuschina.org/',
];

export const HSK_2027_SOURCES = [
  'https://www.chinesetest.cn/',
  'http://www.cibt.ac.cn/',
];

export const SJZU_2027_SOURCES = [
  'https://www.sjzu.edu.cn/',
  'https://gjjy.sjzu.edu.cn/',
  'https://studyinchina.csc.edu.cn/',
  'https://www.campuschina.org/',
];

export const YNNU_2027_SOURCES = [
  'https://www.ynnu.edu.cn/',
  'https://lx.ynnu.edu.cn/',
  'http://ynnu.at0086.cn/student',
  'https://studyinchina.csc.edu.cn/',
  'https://www.campuschina.org/',
];

export const HENU_2027_SOURCES = [
  'https://www.henu.edu.cn/',
  'https://isclc.henu.edu.cn/',
  'https://henu.17gz.org/',
  'https://studyinchina.csc.edu.cn/',
  'https://www.campuschina.org/',
];

export const NJUPT_2027_SOURCES = [
  'https://www.njupt.edu.cn/',
  'https://overseas.njupt.edu.cn/',
  'http://admission.njupt.edu.cn/',
  'https://studyinchina.csc.edu.cn/',
  'https://www.campuschina.org/',
];

export const NEW_GUIDES_2027_DATA: Record<string, GuideData> = {
  [LNU_2027_SLUG]: {
    id: 'cmwhr_lnu_2027_scholarship_guide',
    title: 'Liaoning University CSC Scholarship 2027/2028: Type B Graduate Admissions Guide',
    slug: LNU_2027_SLUG,
    type: 'update',
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships', 'Admissions']),
    tags: JSON.stringify(['liaoning university', 'lnu', 'csc scholarship 2027', 'csc type b 2027', 'study in shenyang', 'china scholarship 2027', 'agency 10140']),
    excerpt: 'Official 2027/2028 Chinese Government Scholarship (CSC Type B, Agency 10140) guide for Liaoning University (LNU) in Shenyang. Covers fully funded Master\'s and PhD programs, 3,000–3,500 RMB monthly stipend, dual-portal submission, and 3 February 2027 university application deadline.',
    metaTitle: 'Liaoning University CSC Scholarship 2027 | EduExpress',
    metaDescription: 'Official 2027 Liaoning University (LNU) CSC Type B scholarship guide for international graduate students. Agency 10140, full tuition, hostel & stipend.',
    featuredImage: '/updates/covers/liaoning-university-csc-scholarship-2027.jpg',
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    sourceUrls: JSON.stringify(LNU_2027_SOURCES),
    isPublished: true,
    isFeatured: true,
    views: 0,
    createdAt: new Date('2026-11-16T03:00:00.000Z'),
    updatedAt: new Date('2026-11-16T03:00:00.000Z'),
    publishedAt: new Date('2026-11-16T03:00:00.000Z'),
    lastVerifiedAt: new Date('2026-11-16T03:00:00.000Z'),
    nextReviewAt: new Date('2027-02-03T23:59:59.000Z'),
    expiresAt: null,
    deadlineAt: new Date('2027-02-03T23:59:59.000Z'),
    complianceApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    seoApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    archivedAt: null,
    content: `<p class="lede"><strong><a href="/universities/liaoning-university">Liaoning University</a> (辽宁大学, LNU)</strong>, a key comprehensive provincial university situated in Shenyang and recognized under China's national Project 211 and Double First-Class initiative, has officially announced international applications for the <strong>2027/2028 Chinese Government Scholarship &ndash; High-Level Postgraduate Program (CSC Type B, Agency No. 10140)</strong>. This prestigious award provides complete financial coverage for international Master's and Doctoral students worldwide across prominent disciplines including Economics, Management, Law, Chemistry, and Applied Sciences.</p>

<aside class="key-facts">
  <h2>Liaoning University CSC 2027/2028: Key Facts at a Glance</h2>
  <table><tbody>
    <tr><th>Host Institution</th><td><a href="/universities/liaoning-university">Liaoning University (辽宁大学)</a>, Shenyang, Liaoning, China</td></tr>
    <tr><th>Scholarship Program</th><td>Chinese Government Scholarship &ndash; High-Level Postgraduate Program (Type B)</td></tr>
    <tr><th>CSC Agency Number</th><td><strong>10140</strong> (Category: Type B)</td></tr>
    <tr><th>Eligible Degrees</th><td>Master's (2–3 Years) &middot; Doctoral / PhD (3–4 Years)</td></tr>
    <tr><th>Instruction Language</th><td>Chinese (HSK 4 required) or English (IELTS / TOEFL or official proof)</td></tr>
    <tr><th>Full Award Coverage</th><td>100% Tuition waiver, On-campus accommodation (or subsidy), Comprehensive medical insurance (RMB 800/yr), Monthly living stipend (Master's: <strong>RMB 3,000/mo</strong> &middot; PhD: <strong>RMB 3,500/mo</strong>)</td></tr>
    <tr><th>University Application Deadline</th><td><strong>3 February 2027</strong> (via LNU online system: lnu.17gz.org)</td></tr>
    <tr><th>CSC System Deadline</th><td><strong>15 March 2027</strong> (for university-recommended candidates)</td></tr>
    <tr><th>Research Plan Requirement</th><td>Master's &amp; PhD: minimum 2,000 Chinese characters or 3,000 English words. Doctoral plans require Chinese supervisor signature.</td></tr>
    <tr><th>Target Applicants</th><td>International students worldwide of all nationalities (non-Chinese citizens)</td></tr>
  </tbody></table>
</aside>

<div class="callout">
  <h3>📱 Social Media Quick Summary (Copy &amp; Share)</h3>
  <p>Share this verified 2027 Liaoning University scholarship announcement with prospective international graduate candidates:</p>
  <blockquote>
    🇨🇳 <strong>LIAONING UNIVERSITY (LNU) | 2027/2028 CSC SCHOLARSHIP IS OPEN!</strong> 🎓✨<br><br>
    Ready to pursue a fully funded Master's or PhD in Shenyang, China? Liaoning University (辽宁大学, Agency No. 10140) is accepting international applications for the Chinese Government Scholarship High-Level Postgraduate Program!<br><br>
    📍 <strong>Location:</strong> Shenyang, Liaoning Province, China<br>
    🏆 <strong>Standing:</strong> National Project 211 &middot; Double First-Class University<br>
    🎓 <strong>Degrees:</strong> Master's (2-3 yrs) &middot; PhD (3-4 yrs)<br>
    🌐 <strong>Language:</strong> English or Chinese taught<br><br>
    🎁 <strong>SCHOLARSHIP BENEFITS:</strong><br>
    &bull; 100% Full Tuition Waiver<br>
    &bull; Free University Dormitory or Housing Allowance<br>
    &bull; Monthly Living Allowance: Master's RMB 3,000/mo &middot; PhD RMB 3,500/mo<br>
    &bull; Comprehensive Medical Insurance included<br>
    &bull; ⏰ <strong>University Deadline: 3 February 2027</strong><br><br>
    🔗 <strong>Full Admissions Guide &amp; Details:</strong> <a href="https://eduexpressint.com/updates/liaoning-university-csc-scholarship-2027">https://eduexpressint.com/updates/liaoning-university-csc-scholarship-2027</a><br>
    💬 <strong>Free International Assessment:</strong> WhatsApp +880 1983-333566 | <a href="/education-fit-assessment">eduexpressint.com/education-fit-assessment</a>
  </blockquote>
</div>

<h2>1. About Liaoning University (LNU)</h2>
<p>Established in 1948, <strong>Liaoning University</strong> is a key multidisciplinary university in northeastern China, encompassing humanities, social sciences, natural sciences, engineering, and management. Situated across modern campuses in Shenyang, LNU has forged academic ties with over 130 higher education institutions across 30 countries and has educated thousands of international graduates.</p>

<h2>2. Eligibility Criteria</h2>
<ul>
  <li><strong>Nationality &amp; Health:</strong> Applicants must be non-Chinese citizens in good physical and mental health.</li>
  <li><strong>Master's Applicants:</strong> Bachelor's degree holder, generally under 35 years of age.</li>
  <li><strong>Doctoral Applicants:</strong> Master's degree holder, generally under 40 years of age.</li>
  <li><strong>Language Proficiency:</strong>
    <ul>
      <li>Chinese-taught programs: HSK Level 4 or above.</li>
      <li>English-taught programs: Valid IELTS, TOEFL, or official certification confirming previous degree was taught entirely in English.</li>
    </ul>
  </li>
</ul>

<h2>3. Application Documents &amp; Strict Research Plan Rule</h2>
<ol>
  <li>CSC Application Form (from campuschina.org).</li>
  <li>Valid passport (valid beyond September 2027).</li>
  <li>Notarized highest degree certificate and transcripts.</li>
  <li><strong>Study/Research Plan:</strong> Master's and PhD applicants must prepare a comprehensive research proposal of at least <strong>2,000 Chinese characters or 3,000 English words</strong>. Doctoral research plans must be signed by an LNU supervisor.</li>
  <li>Two recommendation letters from professors or associate professors.</li>
  <li>Foreigner Physical Examination Form (within 6 months validity).</li>
  <li>Police Clearance Certificate / Non-Criminal Record (within 6 months).</li>
</ol>

<h2>4. Step-by-Step Application Procedure</h2>
<ol>
  <li><strong>Step 1:</strong> Apply directly through the LNU international portal at <a href="https://lnu.17gz.org/" target="_blank" rel="noopener noreferrer">lnu.17gz.org</a> before <strong>3 February 2027</strong>.</li>
  <li><strong>Step 2:</strong> Complete university review and attend online examinations or academic interviews if invited.</li>
  <li><strong>Step 3:</strong> Recommended candidates submit the CSC system application at <a href="https://studyinchina.csc.edu.cn/" target="_blank" rel="noopener noreferrer">studyinchina.csc.edu.cn</a> (Agency: <code>10140</code>, Category: <code>Type B</code>) before <strong>15 March 2027</strong>.</li>
</ol>

<h2>Frequently Asked Questions</h2>
<div class="faq-accordion">
  <div class="faq-item">
    <h3>Q: Can international applicants from any country apply for LNU CSC scholarships?</h3>
    <p>Yes. The CSC High-Level Postgraduate Program at Liaoning University is open to eligible international candidates worldwide holding foreign citizenship.</p>
  </div>
  <div class="faq-item">
    <h3>Q: Is there an application fee for Liaoning University?</h3>
    <p>Check the LNU portal instructions upon initial file submission; any institutional processing fees are paid directly to the university platform.</p>
  </div>
</div>`,
  },

  [CUST_2027_SLUG]: {
    id: 'cmwhr_cust_2027_scholarship_guide',
    title: 'Changchun University of Science and Technology CSC Scholarship 2027/2028: Graduate Guide',
    slug: CUST_2027_SLUG,
    type: 'update',
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships', 'Engineering']),
    tags: JSON.stringify(['cust', 'changchun university of science and technology', 'csc type b 2027', 'optics engineering china', 'study in jilin', 'agency 10186']),
    excerpt: 'Official 2027/2028 Chinese Government Scholarship (CSC Type B, Agency 10186) guide for Changchun University of Science and Technology (CUST). Fully funded Master\'s and PhD study in Optics, Mechanical & Computer Engineering with 3,000–3,500 RMB monthly stipend. Deadline 28 February 2027.',
    metaTitle: 'Changchun UST CSC Scholarship 2027 | EduExpress',
    metaDescription: 'Official 2027 Changchun University of Science and Technology (CUST) CSC Type B scholarship guide. Agency 10186, Optics, Engineering & full funding.',
    featuredImage: '/updates/covers/changchun-university-of-science-and-technology-csc-scholarship-2027.jpg',
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    sourceUrls: JSON.stringify(CUST_2027_SOURCES),
    isPublished: true,
    isFeatured: true,
    views: 0,
    createdAt: new Date('2026-11-16T03:00:00.000Z'),
    updatedAt: new Date('2026-11-16T03:00:00.000Z'),
    publishedAt: new Date('2026-11-16T03:00:00.000Z'),
    lastVerifiedAt: new Date('2026-11-16T03:00:00.000Z'),
    nextReviewAt: new Date('2027-02-28T23:59:59.000Z'),
    expiresAt: null,
    deadlineAt: new Date('2027-02-28T23:59:59.000Z'),
    complianceApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    seoApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    archivedAt: null,
    content: `<p class="lede"><strong><a href="/universities/changchun-university-of-science-and-technology">Changchun University of Science and Technology</a> (长春理工大学, CUST)</strong>, internationally celebrated as the cradle of China's optical talents and founded in 1958 by the Chinese Academy of Sciences, has officially opened admissions for the <strong>2027/2028 Chinese Government Scholarship &ndash; High-Level Postgraduate Program (Type B, Agency No. 10186)</strong>. International graduate candidates globally are invited to apply for full scholarships supporting Master's and Doctoral studies in Optical Engineering, Photonics, Mechanical Engineering, Computer Science, and Material Technologies.</p>

<aside class="key-facts">
  <h2>Changchun UST CSC 2027/2028: Key Facts at a Glance</h2>
  <table><tbody>
    <tr><th>Host University</th><td><a href="/universities/changchun-university-of-science-and-technology">Changchun University of Science and Technology (CUST)</a></td></tr>
    <tr><th>Location</th><td>Changchun, Jilin Province, China (Optical Valley of China)</td></tr>
    <tr><th>Scholarship Scheme</th><td>Chinese Government Scholarship &ndash; High-Level Graduate Program (Type B)</td></tr>
    <tr><th>CSC Agency Number</th><td><strong>10186</strong> (Category: Type B)</td></tr>
    <tr><th>Eligible Degrees</th><td>Master's (3 Years) &middot; Doctoral / PhD (4 Years)</td></tr>
    <tr><th>Language of Instruction</th><td>Chinese (HSK 4 &ge;210 or HSK 5 &ge;180) &middot; English (IELTS &ge;6.0 / TOEFL &ge;80)</td></tr>
    <tr><th>Award Coverage</th><td>Full tuition waiver, Free campus accommodation, Comprehensive medical insurance, Monthly living stipend (Master's: <strong>RMB 3,000/mo</strong> &middot; PhD: <strong>RMB 3,500/mo</strong>)</td></tr>
    <tr><th>Application Deadline</th><td><strong>28 February 2027</strong></td></tr>
    <tr><th>Special Requirements</th><td>Invitation letter from CUST supervisor required; Study plan (&gt;1,000 words) signed by supervisor; PhD applicants must have at least one published paper; Passport valid beyond July 2028.</td></tr>
    <tr><th>Target Candidates</th><td>International students worldwide of all nationalities (non-Chinese citizens)</td></tr>
  </tbody></table>
</aside>

<h2>1. Academic Excellence &amp; Optical Heritage</h2>
<p>Founded by academician Wang Daheng, Changchun University of Science and Technology is renowned for pioneering optics, optoelectronics, and precision machinery in China. With state key laboratories and robust research collaboration with high-tech research centers, CUST offers an extraordinary environment for graduate students focusing on laser engineering, telecommunications, robotics, and applied physics.</p>

<h2>2. Eligibility &amp; Language Standards</h2>
<ul>
  <li>Non-Chinese citizen in good physical and mental health. Applicants must not be registered students at Chinese universities when applying.</li>
  <li>Master's applicants: Bachelor's degree holder, under 35 years old.</li>
  <li>PhD applicants: Master's degree holder, under 40 years old, with at least one published academic paper or qualifying research work.</li>
  <li>Language benchmarks: HSK 4 (&ge;210 points) or HSK 5 (&ge;180 points) for Chinese tracks; IELTS &ge;6.0 or TOEFL &ge;80 for English tracks.</li>
</ul>

<h2>3. Application Procedure</h2>
<ol>
  <li>Explore the CUST faculty list and secure a <strong>Supervisor Invitation Letter</strong>.</li>
  <li>Prepare a research plan of more than 1,000 words signed by your prospective supervisor.</li>
  <li>Register at <a href="https://studyinchina.csc.edu.cn/" target="_blank" rel="noopener noreferrer">studyinchina.csc.edu.cn</a>, select <code>Type B</code>, enter Agency No. <code>10186</code>, and submit all required certified documents before <strong>28 February 2027</strong>.</li>
  <li>Follow CUST international school instructions on <a href="https://ieec.cust.edu.cn/" target="_blank" rel="noopener noreferrer">ieec.cust.edu.cn</a> for internal review and pre-admission documentation.</li>
</ol>`,
  },

  [HSK_2027_SLUG]: {
    id: 'cmwhr_hsk_2027_exam_calendar_guide',
    title: '2027 HSK 3.0 Examination Calendar: Official Test Dates, Deadlines & Score Releases',
    slug: HSK_2027_SLUG,
    type: 'update',
    category: 'Exam Guide',
    categories: JSON.stringify(['China', 'Language', 'Admissions']),
    tags: JSON.stringify(['hsk 2027', 'hsk 3.0 calendar', 'hsk test dates 2027', 'hskk speaking test', 'chinese proficiency test', 'chinesetest cn']),
    excerpt: 'Official 2027 Chinese Proficiency Test (HSK 3.0 & HSKK) calendar from Chinese Testing International (CTI). Complete test dates, registration deadlines, paper-based and computer-based schedules, and score release timelines across all 11 examination sessions in 2027.',
    metaTitle: '2027 HSK 3.0 Exam Calendar & Deadlines | EduExpress',
    metaDescription: 'Official 2027 HSK 3.0 & HSKK examination calendar: all 11 test sessions, registration deadlines, paper vs computer dates, and score release schedules.',
    featuredImage: '/updates/covers/hsk-3-0-examination-calendar-2027.jpg',
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    sourceUrls: JSON.stringify(HSK_2027_SOURCES),
    isPublished: true,
    isFeatured: true,
    views: 0,
    createdAt: new Date('2026-11-16T03:00:00.000Z'),
    updatedAt: new Date('2026-11-16T03:00:00.000Z'),
    publishedAt: new Date('2026-11-16T03:00:00.000Z'),
    lastVerifiedAt: new Date('2026-11-16T03:00:00.000Z'),
    nextReviewAt: new Date('2027-12-11T23:59:59.000Z'),
    expiresAt: null,
    deadlineAt: new Date('2027-12-11T23:59:59.000Z'),
    complianceApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    seoApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    archivedAt: null,
    content: `<p class="lede"><strong>Chinese Testing International (CTI)</strong> and the official testing portal <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">chinesetest.cn</a> have announced the official <strong>2027 HSK 3.0 &amp; HSKK Examination Calendar</strong>. For international students planning to study in China, apply for CSC / provincial scholarships, or satisfy graduation and residency prerequisites, having valid HSK and HSK Speaking (HSKK) scores is critical. Below is the full master schedule covering all 11 test sessions in 2027 with exact registration deadlines and score release dates for both paper-based and computer-based test formats.</p>

<aside class="key-facts">
  <h2>2027 HSK &amp; HSKK Overview: Quick Facts</h2>
  <table><tbody>
    <tr><th>Testing Authority</th><td>Chinese Testing International (CTI) &middot; Center for Language Education and Cooperation (CLEC)</td></tr>
    <tr><th>Official Exam Portal</th><td><a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">www.chinesetest.cn</a></td></tr>
    <tr><th>Total Test Sessions in 2027</th><td>11 Nationwide &amp; Global Sessions (January to December 2027; no February session due to Spring Festival)</td></tr>
    <tr><th>Test Formats</th><td>Paper-Based Test (PBT) &middot; Internet-Based / Computer Test (iBT)</td></tr>
    <tr><th>Exam Levels Covered</th><td>HSK Levels 1 to 6 &middot; HSKK Primary, Intermediate &amp; Advanced (Combined oral exam)</td></tr>
    <tr><th>Score Validity</th><td>2 Years from examination date for academic admissions and CSC scholarship applications</td></tr>
  </tbody></table>
</aside>

<h2>Complete 2027 HSK Examination Master Schedule</h2>
<table>
  <thead>
    <tr>
      <th>Session #</th>
      <th>Exam Date</th>
      <th>Format</th>
      <th>Registration Deadline</th>
      <th>HSK Score Release</th>
      <th>HSKK Speaking Score Release</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2"><strong>1. January</strong></td>
      <td rowspan="2"><strong>9 Jan 2027 (Sat)</strong></td>
      <td>Paper-Based</td>
      <td>13 Dec 2026</td>
      <td>19 Feb 2027</td>
      <td>19 Feb 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>30 Dec 2026</td>
      <td>25 Jan 2027</td>
      <td>29 Jan 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>2. March</strong></td>
      <td rowspan="2"><strong>14 Mar 2027 (Sun)</strong></td>
      <td>Paper-Based</td>
      <td>15 Feb 2027</td>
      <td>16 Apr 2027</td>
      <td>16 Apr 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>4 Mar 2027</td>
      <td>29 Mar 2027</td>
      <td>7 Apr 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>3. April</strong></td>
      <td rowspan="2"><strong>10 Apr 2027 (Sat)</strong></td>
      <td>Paper-Based</td>
      <td>14 Mar 2027</td>
      <td>17 May 2027</td>
      <td>17 May 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>31 Mar 2027</td>
      <td>26 Apr 2027</td>
      <td>26 Apr 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>4. May</strong></td>
      <td rowspan="2"><strong>16 May 2027 (Sun)</strong></td>
      <td>Paper-Based</td>
      <td>19 Apr 2027</td>
      <td>16 Jun 2027</td>
      <td>16 Jun 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>6 May 2027</td>
      <td>31 May 2027</td>
      <td>31 May 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>5. June</strong></td>
      <td rowspan="2"><strong>26 Jun 2027 (Sat)</strong></td>
      <td>Paper-Based</td>
      <td>30 May 2027</td>
      <td>26 Jul 2027</td>
      <td>26 Jul 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>16 Jun 2027</td>
      <td>12 Jul 2027</td>
      <td>16 Jul 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>6. July</strong></td>
      <td rowspan="2"><strong>18 Jul 2027 (Sun)</strong></td>
      <td>Paper-Based</td>
      <td>21 Jun 2027</td>
      <td>18 Aug 2027</td>
      <td>18 Aug 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>8 Jul 2027</td>
      <td>2 Aug 2027</td>
      <td>9 Aug 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>7. August</strong></td>
      <td rowspan="2"><strong>21 Aug 2027 (Sat)</strong></td>
      <td>Paper-Based</td>
      <td>25 Jul 2027</td>
      <td>21 Sep 2027</td>
      <td>21 Sep 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>11 Aug 2027</td>
      <td>6 Sep 2027</td>
      <td>10 Sep 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>8. September</strong></td>
      <td rowspan="2"><strong>12 Sep 2027 (Sun)</strong></td>
      <td>Paper-Based</td>
      <td>16 Aug 2027</td>
      <td>19 Oct 2027</td>
      <td>19 Oct 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>2 Sep 2027</td>
      <td>28 Sep 2027</td>
      <td>11 Oct 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>9. October</strong></td>
      <td rowspan="2"><strong>16 Oct 2027 (Sat)</strong></td>
      <td>Paper-Based</td>
      <td>19 Sep 2027</td>
      <td>16 Nov 2027</td>
      <td>16 Nov 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>6 Oct 2027</td>
      <td>1 Nov 2027</td>
      <td>5 Nov 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>10. November</strong></td>
      <td rowspan="2"><strong>7 Nov 2027 (Sun)</strong></td>
      <td>Paper-Based</td>
      <td>11 Oct 2027</td>
      <td>7 Dec 2027</td>
      <td>7 Dec 2027</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>28 Oct 2027</td>
      <td>22 Nov 2027</td>
      <td>29 Nov 2027</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>11. December</strong></td>
      <td rowspan="2"><strong>11 Dec 2027 (Sat)</strong></td>
      <td>Paper-Based</td>
      <td>14 Nov 2027</td>
      <td>14 Jan 2028</td>
      <td>14 Jan 2028</td>
    </tr>
    <tr>
      <td>Computer-Based</td>
      <td>1 Dec 2027</td>
      <td>27 Dec 2027</td>
      <td>4 Jan 2028</td>
    </tr>
  </tbody>
</table>

<h2>Key Advice for Scholarship Applicants</h2>
<ul>
  <li><strong>Computer-Based is Faster:</strong> Computer-based test results are typically released within <strong>2 weeks</strong> (compared to 1 month for paper tests), which is crucial for meeting tight January–March CSC application deadlines.</li>
  <li><strong>Mandatory Oral Exam (HSKK):</strong> Under current standards, HSK Levels 3, 4, 5, and 6 are administered in combination with the corresponding HSKK Oral Exam (Primary, Intermediate, or Advanced). Candidates must register for both together.</li>
</ul>`,
  },

  [SJZU_2027_SLUG]: {
    id: 'cmwhr_sjzu_2027_scholarship_guide',
    title: 'Shenyang Jianzhu University CSC Scholarship 2027/2028: Architecture & Engineering Guide',
    slug: SJZU_2027_SLUG,
    type: 'update',
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships', 'Engineering']),
    tags: JSON.stringify(['shenyang jianzhu university', 'sjzu', 'architecture scholarship china', 'civil engineering china', 'csc type b 2027', 'agency 10153']),
    excerpt: 'Official 2027/2028 Chinese Government Scholarship (CSC Type B, Agency 10153) guide for Shenyang Jianzhu University (SJZU). Fully funded Master\'s and PhD programs in Architecture, Civil Engineering, and Management with 3,000–3,500 RMB monthly stipend. Deadline 1 March 2027.',
    metaTitle: 'Shenyang Jianzhu University CSC Scholarship 2027 | EduExpress',
    metaDescription: 'Official 2027 Shenyang Jianzhu University (SJZU) CSC Type B scholarship guide: Architecture, Civil Engineering, Master\'s & PhD. Apply by 1 March 2027.',
    featuredImage: '/updates/covers/shenyang-jianzhu-university-csc-scholarship-2027.jpg',
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    sourceUrls: JSON.stringify(SJZU_2027_SOURCES),
    isPublished: true,
    isFeatured: true,
    views: 0,
    createdAt: new Date('2026-11-16T03:00:00.000Z'),
    updatedAt: new Date('2026-11-16T03:00:00.000Z'),
    publishedAt: new Date('2026-11-16T03:00:00.000Z'),
    lastVerifiedAt: new Date('2026-11-16T03:00:00.000Z'),
    nextReviewAt: new Date('2027-03-01T23:59:59.000Z'),
    expiresAt: null,
    deadlineAt: new Date('2027-03-01T23:59:59.000Z'),
    complianceApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    seoApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    archivedAt: null,
    content: `<p class="lede"><strong><a href="/universities/shenyang-jianzhu-university">Shenyang Jianzhu University</a> (沈阳建筑大学, SJZU)</strong>, one of China’s premier universities specializing in architecture, civil engineering, and urban planning, has officially opened admissions for the <strong>2027/2028 Chinese Government Scholarship &ndash; High-Level Postgraduate Program (Type B, Agency No. 10153)</strong>. This full scholarship covers full tuition, accommodation, living allowances, and health insurance for international candidates seeking Master's (3 years) and PhD (4 years) degrees for the September 2027 intake.</p>

<aside class="key-facts">
  <h2>Shenyang Jianzhu University CSC 2027/2028: Key Facts</h2>
  <table><tbody>
    <tr><th>Host Institution</th><td><a href="/universities/shenyang-jianzhu-university">Shenyang Jianzhu University (SJZU)</a></td></tr>
    <tr><th>Location</th><td>Shenyang, Liaoning Province, China</td></tr>
    <tr><th>Scholarship Scheme</th><td>Chinese Government Scholarship &ndash; High-Level Postgraduate Program (Type B)</td></tr>
    <tr><th>CSC Agency Number</th><td><strong>10153</strong> (Category: Type B)</td></tr>
    <tr><th>Eligible Degrees</th><td>Master's (3 Years) &middot; Doctoral / PhD (4 Years)</td></tr>
    <tr><th>Language Options</th><td>Chinese (HSK 4 &ge;180 for Master's; HSK 5 &ge;180 for PhD) or English (IELTS &ge;6.0 / TOEFL &ge;80 or English-medium degree certificate)</td></tr>
    <tr><th>Award Coverage</th><td>100% Tuition waiver, Free on-campus dormitory, Monthly stipend (Master's: <strong>RMB 3,000/mo</strong> &middot; PhD: <strong>RMB 3,500/mo</strong>), Comprehensive medical insurance</td></tr>
    <tr><th>Application Deadline</th><td><strong>1 March 2027</strong></td></tr>
    <tr><th>Application Workflow</th><td>Complete CSC application at campuschina.org + email full document package in a ZIP archive to <code>bing24690861@163.com</code> + online academic interview.</td></tr>
    <tr><th>Target Candidates</th><td>International students worldwide of all nationalities (non-Chinese citizens)</td></tr>
  </tbody></table>
</aside>

<h2>Available Master's &amp; Doctoral Programs at SJZU</h2>
<ul>
  <li><strong>Master's Programs (3 Years):</strong> Architecture, Civil Engineering, Mechanical Engineering, Environmental Engineering, Control Science and Engineering, Electrical Engineering, Management Science and Engineering, Design Science.</li>
  <li><strong>Doctoral Programs (4 Years):</strong> Architecture, Civil Engineering, Mechanical Engineering.</li>
</ul>

<h2>Required Application Documents</h2>
<ol>
  <li>CSC Application Form (Type B, Agency 10153).</li>
  <li>Valid passport photo page (valid beyond September 2027).</li>
  <li>Notarized highest degree certificate and transcripts.</li>
  <li>Valid language proficiency certificate (HSK or IELTS/TOEFL).</li>
  <li>Study/Research plan (over 1,000 Chinese characters or English words; PhD plans must be signed by an SJZU supervisor).</li>
  <li>Two recommendation letters from professors or associate professors.</li>
  <li>Portfolio of works (required for Architecture, Design, and Art applicants).</li>
  <li>Foreigner Physical Examination Form (valid for 6 months).</li>
  <li>Non-Criminal Record Certificate (Police Clearance).</li>
</ol>`,
  },

  [YNNU_2027_SLUG]: {
    id: 'cmwhr_ynnu_2027_scholarship_guide',
    title: 'Yunnan Normal University CSC Scholarship 2027/2028: Postgraduate Admissions Guide',
    slug: YNNU_2027_SLUG,
    type: 'update',
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships', 'Admissions']),
    tags: JSON.stringify(['yunnan normal university', 'ynnu', 'csc scholarship 2027', 'study in kunming', 'study in yunnan', 'agency 10681']),
    excerpt: 'Official 2027/2028 Chinese Government Scholarship (CSC Type B, Agency 10681) guide for Yunnan Normal University (YNNU) in Kunming. Fully funded Master\'s (2–3 yrs) and PhD (4 yrs) programs in Education, Chinese Language, Geography, and Sciences with monthly living allowances. Deadline 28 February 2027.',
    metaTitle: 'Yunnan Normal University CSC Scholarship 2027 | EduExpress',
    metaDescription: 'Official 2027 Yunnan Normal University (YNNU) CSC Type B scholarship guide for international graduate students. Agency 10681, Kunming, full funding.',
    featuredImage: '/updates/covers/yunnan-normal-university-csc-scholarship-2027.jpg',
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    sourceUrls: JSON.stringify(YNNU_2027_SOURCES),
    isPublished: true,
    isFeatured: true,
    views: 0,
    createdAt: new Date('2026-11-16T03:00:00.000Z'),
    updatedAt: new Date('2026-11-16T03:00:00.000Z'),
    publishedAt: new Date('2026-11-16T03:00:00.000Z'),
    lastVerifiedAt: new Date('2026-11-16T03:00:00.000Z'),
    nextReviewAt: new Date('2027-02-28T23:59:59.000Z'),
    expiresAt: null,
    deadlineAt: new Date('2027-02-28T23:59:59.000Z'),
    complianceApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    seoApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    archivedAt: null,
    content: `<p class="lede"><strong><a href="/universities/yunnan-normal-university">Yunnan Normal University</a> (云南师范大学, YNNU)</strong>, a key provincial university located in Kunming &mdash; China's vibrant "City of Eternal Spring" &mdash; has released its official admissions prospectus for the <strong>2027/2028 Chinese Government Scholarship High-Level Postgraduate Program (Type B, Agency No. 10681)</strong>. Covering tuition, housing, medical insurance, and full monthly living allowances, this scholarship provides exceptional research opportunities across Education, Chinese International Education (MTCSOL), Geography, Chemistry, and Southwest Asian Regional Studies.</p>

<aside class="key-facts">
  <h2>Yunnan Normal University CSC 2027/2028: Key Facts</h2>
  <table><tbody>
    <tr><th>Host Institution</th><td><a href="/universities/yunnan-normal-university">Yunnan Normal University (YNNU)</a></td></tr>
    <tr><th>Location</th><td>Kunming, Yunnan Province, China</td></tr>
    <tr><th>Scholarship Program</th><td>Chinese Government Scholarship &ndash; High-Level Postgraduate Program (Type B)</td></tr>
    <tr><th>CSC Agency Number</th><td><strong>10681</strong> (Category: Type B)</td></tr>
    <tr><th>Eligible Degrees</th><td>Master's (2–3 Years) &middot; Doctoral / PhD (4 Years)</td></tr>
    <tr><th>Instruction Language</th><td>Chinese (HSK Level 5 &ge;180 required; exempt if previous degree was taught in Chinese)</td></tr>
    <tr><th>Award Coverage</th><td>100% Tuition waiver, Free on-campus accommodation, Monthly living stipend (Master's: <strong>RMB 3,000/mo</strong> &middot; PhD: <strong>RMB 3,500/mo</strong>), Comprehensive medical insurance</td></tr>
    <tr><th>Application Deadline</th><td><strong>28 February 2027</strong></td></tr>
    <tr><th>Research Proposal Rule</th><td>Master's: &ge;2,000 Chinese characters or English words; Doctoral: &ge;4,000 characters/words (must be signed by YNNU doctoral supervisor).</td></tr>
    <tr><th>Target Candidates</th><td>International students worldwide of all nationalities (non-Chinese citizens)</td></tr>
  </tbody></table>
</aside>

<h2>Application Steps for YNNU</h2>
<ol>
  <li><strong>Submit CSC Portal Application:</strong> Register at <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">campuschina.org</a>, choose Category <code>Type B</code>, Agency <code>10681</code>, and upload required documents.</li>
  <li><strong>Submit YNNU Platform Application:</strong> Register on the YNNU International Student Platform at <a href="http://ynnu.at0086.cn/student" target="_blank" rel="noopener noreferrer">ynnu.at0086.cn/student</a> and upload the identical document set, including the generated CSC application form.</li>
  <li><strong>Attend Academic Interview:</strong> Pass the document review to receive an invitation for the online interview.</li>
  <li><strong>Upload Pre-Admission Notice:</strong> Candidates who pass receive a Pre-Admission Notice from YNNU to upload directly into the CSC portal for final scholarship confirmation.</li>
</ol>`,
  },

  [HENU_2027_SLUG]: {
    id: 'cmwhr_henu_2027_scholarship_guide',
    title: 'Henan University CSC Scholarship 2027/2028: High-Level Postgraduate Guide',
    slug: HENU_2027_SLUG,
    type: 'update',
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships', 'Admissions']),
    tags: JSON.stringify(['henan university', 'henu', 'csc scholarship 2027', 'double first class china', 'study in henan', 'agency 10475']),
    excerpt: 'Official 2027/2028 Chinese Government Scholarship (CSC Type B, Agency 10475) guide for Henan University (HENU). Double First-Class university offering fully funded Master\'s and PhD programs across Science, Engineering, Humanities, and Medicine with 3,000–3,500 RMB stipend. Deadline 17 January 2027.',
    metaTitle: 'Henan University CSC Scholarship 2027 | EduExpress',
    metaDescription: 'Official 2027 Henan University (HENU) CSC Type B scholarship guide for international Master\'s & PhD applicants. Agency 10475, Double First-Class.',
    featuredImage: '/updates/covers/henan-university-csc-scholarship-2027.jpg',
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    sourceUrls: JSON.stringify(HENU_2027_SOURCES),
    isPublished: true,
    isFeatured: true,
    views: 0,
    createdAt: new Date('2026-11-16T03:00:00.000Z'),
    updatedAt: new Date('2026-11-16T03:00:00.000Z'),
    publishedAt: new Date('2026-11-16T03:00:00.000Z'),
    lastVerifiedAt: new Date('2026-11-16T03:00:00.000Z'),
    nextReviewAt: new Date('2027-01-17T23:59:59.000Z'),
    expiresAt: null,
    deadlineAt: new Date('2027-01-17T23:59:59.000Z'),
    complianceApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    seoApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    archivedAt: null,
    content: `<p class="lede"><strong><a href="/universities/henan-university">Henan University</a> (河南大学, HENU)</strong>, a prestigious national Double First-Class university founded in 1912 with dual campuses in historic Kaifeng and provincial capital Zhengzhou, has officially announced the international admissions guide for the <strong>2027/2028 Chinese Government Scholarship High-Level Postgraduate Program (Type B, Agency No. 10475)</strong>. This fully funded government scholarship covers complete tuition, campus accommodation, comprehensive medical insurance, and monthly living allowances for international Master's (3 years) and Doctoral (4 years) scholars.</p>

<aside class="key-facts">
  <h2>Henan University CSC 2027/2028: Key Facts at a Glance</h2>
  <table><tbody>
    <tr><th>Host Institution</th><td><a href="/universities/henan-university">Henan University (河南大学)</a></td></tr>
    <tr><th>Campuses</th><td>Kaifeng &amp; Zhengzhou, Henan Province, China</td></tr>
    <tr><th>Academic Standing</th><td>National Double First-Class University &middot; Century-Old Comprehensive Institution</td></tr>
    <tr><th>Scholarship Scheme</th><td>Chinese Government Scholarship &ndash; High-Level Postgraduate Program (Type B)</td></tr>
    <tr><th>CSC Agency Number</th><td><strong>10475</strong> (Category: Type B)</td></tr>
    <tr><th>Eligible Degrees</th><td>Master's (3 Years) &middot; Doctoral / PhD (4 Years)</td></tr>
    <tr><th>Instruction Language</th><td>Chinese (HSK 5 &ge;180) &middot; Selected English-taught tracks (IELTS &ge;6.5 / TOEFL &ge;86)</td></tr>
    <tr><th>Award Coverage</th><td>100% Tuition waiver, Free on-campus accommodation, Monthly living stipend (Master's: <strong>RMB 3,000/mo</strong> &middot; PhD: <strong>RMB 3,500/mo</strong>), Comprehensive medical insurance</td></tr>
    <tr><th>Application Deadline</th><td><strong>17 January 2027</strong> (Early deadline!)</td></tr>
    <tr><th>Dual-System Required</th><td>CSC System (<a href="https://studyinchina.csc.edu.cn" target="_blank" rel="noopener noreferrer">studyinchina.csc.edu.cn</a>) + HENU System (<a href="https://henu.17gz.org" target="_blank" rel="noopener noreferrer">henu.17gz.org</a>)</td></tr>
    <tr><th>Target Candidates</th><td>International students worldwide of all nationalities (non-Chinese citizens)</td></tr>
  </tbody></table>
</aside>

<h2>Eligibility &amp; Early Deadline Notice</h2>
<p><strong>Note on 17 January 2027 Deadline:</strong> Henan University operates one of the earliest submission deadlines among Chinese universities. Both online systems must be completed and submitted on or before 17 January 2027 to be eligible for the preliminary review panel.</p>

<ul>
  <li>Non-Chinese citizen in good physical and mental health. In principle, applicants should be residing outside China at the time of application, or outstanding graduating students.</li>
  <li>Master's applicants: Bachelor's degree holder, under 35 years old.</li>
  <li>PhD applicants: Master's degree holder, under 40 years old.</li>
  <li>Language benchmarks: HSK 5 (&ge;180) for Chinese medium; IELTS &ge;6.5 or TOEFL &ge;86 for English medium.</li>
</ul>`,
  },

  [NJUPT_2027_SLUG]: {
    id: 'cmwhr_njupt_2027_scholarship_guide',
    title: 'Nanjing University of Posts & Telecommunications (NJUPT) CSC Scholarship 2027: AI & IT Guide',
    slug: NJUPT_2027_SLUG,
    type: 'update',
    category: 'China',
    categories: JSON.stringify(['China', 'Scholarships', 'Engineering']),
    tags: JSON.stringify(['njupt', 'nanjing university of posts and telecommunications', 'csc scholarship 2027', 'ai scholarship china', 'study in nanjing', 'agency 10293']),
    excerpt: 'Official 2027 Chinese Government Scholarship (CSC Type B, Agency 10293) guide for Nanjing University of Posts and Telecommunications (NJUPT). Fully funded 2-year English-taught Master\'s and 4-year PhD programs in Artificial Intelligence, Computer Technology, Electronic Information, and MBA with monthly living allowances. Deadline 28 February 2027.',
    metaTitle: 'NJUPT CSC Scholarship 2027 | EduExpress',
    metaDescription: 'Official 2027 NJUPT CSC Type B scholarship guide: 2-Year Master\'s & PhD in AI, Computer Tech, Electronic Info & MBA. Agency 10293, apply by 28 Feb 2027.',
    featuredImage: '/updates/covers/njupt-csc-scholarship-2027.jpg',
    author: 'Md Tauhidul Islam Nur',
    reviewer: 'Abdullah Al Rakib',
    sourceUrls: JSON.stringify(NJUPT_2027_SOURCES),
    isPublished: true,
    isFeatured: true,
    views: 0,
    createdAt: new Date('2026-11-16T03:00:00.000Z'),
    updatedAt: new Date('2026-11-16T03:00:00.000Z'),
    publishedAt: new Date('2026-11-16T03:00:00.000Z'),
    lastVerifiedAt: new Date('2026-11-16T03:00:00.000Z'),
    nextReviewAt: new Date('2027-02-28T23:59:59.000Z'),
    expiresAt: null,
    deadlineAt: new Date('2027-02-28T23:59:59.000Z'),
    complianceApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    seoApprovedAt: new Date('2026-11-16T03:00:00.000Z'),
    archivedAt: null,
    content: `<p class="lede"><strong><a href="/universities/njupt">Nanjing University of Posts and Telecommunications</a> (南京邮电大学, NJUPT)</strong>, a national Double First-Class university and leading information technology powerhouse in Nanjing, has officially opened applications for the <strong>2027 Chinese Government Scholarship &ndash; High-Level Postgraduate Program (Type B, Agency No. 10293)</strong>. Offering high-impact <strong>2-year English-taught Master's degrees</strong> and 4-year Doctoral programs in Artificial Intelligence, Computer Technology, Electronic Information, and Business Administration, NJUPT provides full financial sponsorship covering tuition, housing, health insurance, and monthly living stipends.</p>

<aside class="key-facts">
  <h2>NJUPT CSC 2027: Key Facts at a Glance</h2>
  <table><tbody>
    <tr><th>Host Institution</th><td><a href="/universities/njupt">Nanjing University of Posts and Telecommunications (NJUPT)</a></td></tr>
    <tr><th>Location</th><td>Nanjing, Jiangsu Province, China</td></tr>
    <tr><th>Academic Standing</th><td>National Double First-Class University &middot; Top Telecommunications &amp; AI Center</td></tr>
    <tr><th>Scholarship Scheme</th><td>Chinese Government Scholarship &ndash; High-Level Postgraduate Program (Type B)</td></tr>
    <tr><th>CSC Agency Number</th><td><strong>10293</strong> (Category: Type B)</td></tr>
    <tr><th>Eligible Degrees &amp; Duration</th><td>Master's (Fast-track <strong>2 Years</strong>) &middot; Doctoral / PhD (4 Years)</td></tr>
    <tr><th>Flagship English Master's</th><td>Artificial Intelligence (AI), Computer Technology, Electronic Information, Business Administration (MBA)</td></tr>
    <tr><th>Award Coverage</th><td>100% Tuition waiver, Free on-campus accommodation, Monthly living stipend (Master's: <strong>RMB 3,000/mo</strong> &middot; PhD: <strong>RMB 3,500/mo</strong>), Comprehensive medical insurance</td></tr>
    <tr><th>Application Fee</th><td>RMB 800 (Non-refundable, payable inside NJUPT online application system)</td></tr>
    <tr><th>Application Deadline</th><td><strong>28 February 2027</strong></td></tr>
    <tr><th>Special PhD Prerequisite</th><td>NJUPT Supervisor Provisional Acceptance Letter is <strong>mandatory for all PhD applicants</strong>. Study plan must exceed 3,000 words.</td></tr>
    <tr><th>Target Candidates</th><td>International students worldwide of all nationalities (non-Chinese citizens)</td></tr>
  </tbody></table>
</aside>

<h2>Key Programs Taught in English</h2>
<ul>
  <li><strong>Master's (2-Year Fast-Track, English-Taught):</strong>
    <ul>
      <li>0854 Electronic Information</li>
      <li>0854 Computer Technology</li>
      <li>0854 Artificial Intelligence (AI)</li>
      <li>1251 Business Administration (MBA)</li>
    </ul>
  </li>
  <li><strong>Doctoral Programs (4-Year, English/Chinese-Taught):</strong>
    <ul>
      <li>0810 Information and Communication Engineering (English &amp; Chinese)</li>
      <li>0854 Electronic Information &middot; 0809 Electronic Science and Technology</li>
      <li>0839 Cyberspace Security &middot; 0811 Control Science and Engineering &middot; 0803 Optical Engineering</li>
    </ul>
  </li>
</ul>

<h2>Application Steps for NJUPT</h2>
<ol>
  <li><strong>Dual-System Online Submission:</strong>
    <ul>
      <li>Submit online via CSC system (<a href="https://studyinchina.csc.edu.cn" target="_blank" rel="noopener noreferrer">studyinchina.csc.edu.cn</a>), Agency: <code>10293</code>, Category: <code>Type B</code>.</li>
      <li>Submit online via NJUPT system (<a href="http://admission.njupt.edu.cn" target="_blank" rel="noopener noreferrer">admission.njupt.edu.cn</a>) under "Chinese Government Scholarship".</li>
    </ul>
  </li>
  <li><strong>Pay University Application Fee:</strong> Pay <strong>RMB 800</strong> directly in the NJUPT portal before 28 February 2027.</li>
  <li><strong>Academic Interview:</strong> Shortlisted applicants participate in an online academic interview in March 2027. Successful candidates receive a Pre-Admission Letter from NJUPT.</li>
</ol>`,
  },
};
