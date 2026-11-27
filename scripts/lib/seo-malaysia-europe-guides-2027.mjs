/**
 * 15 High-Intent B2C Malaysia & Europe/Asia 2027 University, Cost & Visa Guides for `/updates/[slug]`.
 *
 * Designed to replicate the exact structural density that earned 1.2K+ AI Citations
 * on China CSC guides:
 * - Direct-answer lede + `<aside class="key-facts">` summary table
 * - Verified institutional links to `/universities/<slug>` and country pillar pages
 * - Local currency + estimated BDT fee tables separating tuition from EMGS / IHS / VFS / residence permits
 * - Written EduExpress fee policy disclosure (Malaysia & UK BDT 0 service fee; Other European countries BDT 1,00,000 100% after visa approval)
 * - Structured FAQ section for Google & LLM grounding crawlers
 */

const PUBLISHED_DATE = new Date('2026-11-28T00:00:00.000Z');
const REVIEW_DATE = new Date('2027-06-30T23:59:59.000Z');
const DEADLINE_DATE = new Date('2027-07-31T23:59:59.000Z');

function buildGuideSpec({
  slug,
  title,
  metaTitle,
  metaDescription,
  excerpt,
  category,
  categories,
  tags,
  featuredImage,
  sourceUrls,
  content,
}) {
  return {
    id: slug,
    slug,
    title,
    type: 'update',
    category,
    categories: JSON.stringify(categories),
    tags: JSON.stringify(tags),
    excerpt,
    metaTitle,
    metaDescription,
    featuredImage: featuredImage || '/images/destinations/malaysia-hero.webp',
    author: 'Abdullah Al Rakib',
    reviewer: 'Academic Verification Board',
    sourceUrls: JSON.stringify(sourceUrls),
    isPublished: true,
    isFeatured: true,
    views: 0,
    createdAt: PUBLISHED_DATE,
    updatedAt: PUBLISHED_DATE,
    publishedAt: PUBLISHED_DATE,
    lastVerifiedAt: PUBLISHED_DATE,
    nextReviewAt: REVIEW_DATE,
    expiresAt: null,
    deadlineAt: DEADLINE_DATE,
    complianceApprovedAt: PUBLISHED_DATE,
    seoApprovedAt: PUBLISHED_DATE,
    archivedAt: null,
    content,
  };
}

export const MALAYSIA_EUROPE_2027_GUIDE_SPECS = [
  // 1. UTM Malaysia
  buildGuideSpec({
    slug: 'utm-malaysia-admissions-tuition-fees-bangladesh-2027',
    title: 'Universiti Teknologi Malaysia (UTM) 2027 Admissions Guide for Bangladeshi Students: Tuition Fees in BDT, Engineering & CS Programs',
    metaTitle: 'UTM Malaysia 2027 Admissions & Fees in BDT | EduExpress',
    metaDescription: 'Complete 2027 Universiti Teknologi Malaysia (UTM) guide for Bangladeshi students: QS #181 engineering & CS tuition in MYR/BDT, EMGS eVAL visa, and BDT 0 agency fee.',
    excerpt: 'Official 2027 admissions and tuition fee breakdown for Universiti Teknologi Malaysia (UTM, QS World #181): Bachelor, Master & PhD programs in Johor Bahru and Kuala Lumpur, MYR/BDT tuition schedules, EMGS eVAL processing, and BDT 0 EduExpress service charge.',
    category: 'Malaysia',
    categories: ['Malaysia', 'Admissions', 'Costs', 'Engineering'],
    tags: ['UTM Malaysia', 'Universiti Teknologi Malaysia', 'study in malaysia from bangladesh', 'UTM tuition fees in BDT', 'EMGS visa bangladesh', 'public university malaysia'],
    featuredImage: '/images/destinations/malaysia-hero.webp',
    sourceUrls: ['https://www.utm.my/', 'https://admission.utm.my/', 'https://educationmalaysia.gov.my/', 'https://www2.mqa.gov.my/mqr/'],
    content: `<p class="lede"><strong><a href="/universities/universiti-teknologi-malaysia">Universiti Teknologi Malaysia (UTM)</a></strong> is Malaysia’s premier public engineering and technology research university (ranked <strong>QS World #181</strong>). For Bangladeshi HSC, A-Level, and BSc graduates seeking globally accredited Washington Accord engineering, Computer Science, AI, and Architecture degrees at public university tuition rates, UTM offers an exceptional pathway with <strong>BDT 0 EduExpress consultancy service fee</strong>.</p>
<aside class="key-facts">
  <h2>UTM Malaysia 2027 Quick Facts for Bangladeshi Applicants</h2>
  <table><tbody>
    <tr><th>Institution Type &amp; Rank</th><td>Public Research University &middot; QS World #181 &middot; MQA &amp; Washington Accord Accredited</td></tr>
    <tr><th>Campuses</th><td>Johor Bahru (Main Campus) &amp; Kuala Lumpur (Postgraduate / Professional Campus)</td></tr>
    <tr><th>Primary Intakes</th><td><strong>September/October</strong> (Autumn Primary) &amp; <strong>February/March</strong> (Spring)</td></tr>
    <tr><th>Annual Undergraduate Tuition</th><td><strong>MYR 15,000 &ndash; MYR 22,000 / year</strong> (approx. <strong>BDT 4.1 Lakh &ndash; 6.0 Lakh / year</strong>)</td></tr>
    <tr><th>Annual Postgraduate Tuition</th><td><strong>MYR 13,500 &ndash; MYR 24,000 / year</strong> (approx. <strong>BDT 3.7 Lakh &ndash; 6.6 Lakh / year</strong>)</td></tr>
    <tr><th>EduExpress Service Fee</th><td><strong>BDT 0 (Free Consultancy &amp; EMGS File Processing)</strong> &mdash; <a href="/study-in-malaysia-from-bangladesh">See Malaysia Pillar</a></td></tr>
  </tbody></table>
</aside>
<h2>1. Popular UTM Bachelor, Master &amp; PhD Programs and 2027 Tuition Fees</h2>
<div class="table-responsive">
  <table>
    <thead><tr><th>Program &amp; Level</th><th>Duration</th><th>Annual Tuition (MYR)</th><th>Estimated Annual BDT</th><th>Entry Requirement (Bangladesh)</th></tr></thead>
    <tbody>
      <tr><td><strong>Bachelor of Computer Science (AI / Software Engineering / Data Engineering)</strong></td><td>4 Years</td><td>MYR 17,500 / yr</td><td>~BDT 4.80 Lakh</td><td>HSC GPA 4.00+ (Math &amp; Physics) or A-Level 3Cs + IELTS 5.5</td></tr>
      <tr><td><strong>Bachelor of Civil / Mechanical / Electrical Engineering (Hons)</strong></td><td>4 Years</td><td>MYR 18,500 / yr</td><td>~BDT 5.05 Lakh</td><td>HSC GPA 4.00+ in Science + IELTS 5.5 or equivalent</td></tr>
      <tr><td><strong>Master of Computer Science / MSc Engineering</strong></td><td>1.5 &ndash; 2 Years</td><td>MYR 15,000 / yr</td><td>~BDT 4.10 Lakh</td><td>BSc CGPA 3.00/4.00 (or 2.75 with experience) + IELTS 6.0</td></tr>
      <tr><td><strong>Master of Business Administration (MBA - KL Campus)</strong></td><td>1.5 Years</td><td>MYR 32,000 total</td><td>~BDT 8.75 Lakh total</td><td>Bachelor CGPA 2.75+ + IELTS 6.0</td></tr>
      <tr><td><strong>PhD in Engineering, Computing &amp; Built Environment</strong></td><td>3 Years</td><td>MYR 13,500 / yr</td><td>~BDT 3.70 Lakh</td><td>Master’s degree + Research Proposal + IELTS 6.0</td></tr>
    </tbody>
  </table>
</div>
<h2>2. Non-Tuition Costs: EMGS Visa, Dormitory &amp; Student File Rules</h2>
<ul>
  <li><strong>EMGS eVAL &amp; Student Pass Processing:</strong> Approx. MYR 2,000 &ndash; 2,400 (first year, including medical screening, EMGS insurance, and i-Kad). See our <a href="/malaysia-student-visa-bangladesh">Malaysia EMGS Student Visa Guide</a>.</li>
  <li><strong>On-Campus Kolej Dormitory (Johor Bahru):</strong> MYR 450 &ndash; MYR 850 / month (~BDT 12,500 &ndash; 23,000 / month), making Johor Bahru 30% cheaper than central Kuala Lumpur.</li>
  <li><strong>Bank Solvency &amp; Student File:</strong> Use our <a href="/student-visa-bank-solvency-bangladesh">Interactive Bank Solvency Calculator</a> to prepare your BDT 10–15 Lakh sponsor bank statement for SEV &amp; Bangladesh Bank Student File remittance.</li>
</ul>
<h2>3. Frequently Asked Questions (FAQ)</h2>
<details><summary>Can I apply to UTM Malaysia without IELTS from Bangladesh?</summary><p>UTM requires IELTS 5.5 (Bachelor) or 6.0 (Postgraduate), TOEFL iBT, or PTE. However, applicants without a test score can receive a conditional offer and complete UTM’s Intensive English Program (IEP) before starting degree classes. Compare all MOI routes in our <a href="/study-abroad-without-ielts-from-bangladesh">Study Without IELTS Guide</a>.</p></details>
<details><summary>How much does EduExpress charge for UTM admission and EMGS visa processing?</summary><p><strong>BDT 0.</strong> EduExpress charges zero file-opening fee and zero consultancy service fee for Malaysia. You pay only the official UTM application fee and EMGS charges directly.</p></details>`
  }),

  // 2. APU Malaysia
  buildGuideSpec({
    slug: 'apu-malaysia-tuition-fees-scholarships-bangladesh-2027',
    title: 'Asia Pacific University (APU) Malaysia 2027 Guide for Bangladeshi Students: Tuition Fees, 30% Merit Scholarships & Dual UK Degrees',
    metaTitle: 'APU Malaysia 2027 Fees, 30% Scholarship & UK Degree | EduExpress',
    metaDescription: 'Apply to Asia Pacific University (APU) Malaysia from Bangladesh with BDT 0 agency fee: 2027 tuition in MYR/BDT, up to 30% merit waiver, and De Montfort UK dual degree.',
    excerpt: 'Complete 2027 guide to Asia Pacific University of Technology & Innovation (APU, Kuala Lumpur): Cyber Security, AI, Software Engineering & Business tuition fees in BDT, 10%–30% HSC/O-Level merit waivers, De Montfort University UK dual awards, and EMGS eVAL timeline.',
    category: 'Malaysia',
    categories: ['Malaysia', 'Scholarships', 'Admissions', 'Costs'],
    tags: ['APU Malaysia', 'Asia Pacific University Malaysia', 'APU tuition fees for bangladeshi students', 'study IT in malaysia', 'malaysia scholarship 2027'],
    featuredImage: '/images/destinations/malaysia-hero.webp',
    sourceUrls: ['https://www.apu.edu.my/', 'https://educationmalaysia.gov.my/', 'https://www2.mqa.gov.my/mqr/'],
    content: `<p class="lede"><strong><a href="/universities/asia-pacific-university">Asia Pacific University of Technology &amp; Innovation (APU)</a></strong> in Technology Park Malaysia (Kuala Lumpur) is Malaysia’s #1 premier digital technology university and the top private choice for Bangladeshi students pursuing Computer Science, Cyber Security, Artificial Intelligence, Data Science, and Business. Every APU bachelor student can opt for a <strong>Dual Degree Certificate accredited by De Montfort University (DMU), UK</strong> while paying Malaysian tuition rates—with <strong>10% to 30% automatic merit scholarships</strong> for Bangladeshi SSC/HSC and O/A-Level students.</p>
<aside class="key-facts">
  <h2>APU Malaysia 2027 Snapshot for Bangladeshi Students</h2>
  <table><tbody>
    <tr><th>Location &amp; Recognition</th><td>Technology Park Malaysia, Bukit Jalil, Kuala Lumpur &middot; MQA Tier-5 Setara &amp; QS 5-Stars Plus</td></tr>
    <tr><th>UK Dual Degree Partner</th><td><strong>De Montfort University (DMU), Leicester, UK</strong> (graduating students receive both APU &amp; UK degree certificates)</td></tr>
    <tr><th>2027 Merit Scholarship</th><td><strong>10% to 30% Tuition Fee Waiver</strong> based on HSC GPA (4.00–5.00) or A-Level / O-Level grades</td></tr>
    <tr><th>Annual Bachelor Tuition</th><td>MYR 32,000 &ndash; MYR 36,000 / year before waiver (<strong>~MYR 23,800 / BDT 6.5 Lakh after 30% scholarship</strong>)</td></tr>
    <tr><th>Intakes</th><td>March, May, July, September, November (Rolling EMGS intakes)</td></tr>
    <tr><th>EduExpress Service Fee</th><td><strong>BDT 0 (Free Application &amp; EMGS Visa Processing)</strong> &mdash; <a href="/bn/study-in-malaysia-from-bangladesh">বাংলা গাইড দেখুন</a></td></tr>
  </tbody></table>
</aside>
<h2>1. APU 2027 Program Tuition &amp; Automatic Bangladesh Merit Scholarship Tiers</h2>
<div class="table-responsive">
  <table>
    <thead><tr><th>Program Level</th><th>Standard Annual Tuition</th><th>With 20%–30% BD Merit Waiver</th><th>Est. Net Annual BDT</th><th>Eligibility</th></tr></thead>
    <tbody>
      <tr><td><strong>Foundation Programme (Computing / Business / Engineering)</strong> (1 Year)</td><td>MYR 26,800</td><td>MYR 18,760 &ndash; 21,440</td><td>~BDT 5.1 &ndash; 5.8 Lakh</td><td>SSC GPA 3.50+ or O-Level 5 Credits (<a href="/study-in-malaysia-after-o-level">Post-O-Level Guide</a>)</td></tr>
      <tr><td><strong>BSc (Hons) Computer Science / AI / Cyber Security / Software Eng.</strong> (3 Years)</td><td>MYR 34,000 / yr</td><td>MYR 23,800 &ndash; 27,200 / yr</td><td>~BDT 6.5 &ndash; 7.4 Lakh / yr</td><td>HSC GPA 3.50+ (GPA 5.00 = 30% waiver) or A-Level 2 Passes</td></tr>
      <tr><td><strong>BEng (Hons) Electrical / Mechatronic / Computer Engineering</strong> (4 Years)</td><td>MYR 34,500 / yr</td><td>MYR 24,150 &ndash; 27,600 / yr</td><td>~BDT 6.6 &ndash; 7.5 Lakh / yr</td><td>HSC Science GPA 3.50+ (Math &amp; Physics)</td></tr>
      <tr><td><strong>MSc in AI / Cyber Security / Data Science / MBA</strong> (1.5 Years)</td><td>MYR 38,800 total</td><td>MYR 31,040 &ndash; 34,920 total</td><td>~BDT 8.5 &ndash; 9.5 Lakh total</td><td>Bachelor CGPA 2.75+ (3.50+ for max waiver)</td></tr>
    </tbody>
  </table>
</div>
<h2>2. Why Bangladeshi Students Choose APU Through EduExpress Dhanmondi</h2>
<ul>
  <li><strong>Fast 4–6 Week EMGS eVAL Approval:</strong> APU maintains one of the highest EMGS green-light approval rates in Malaysia. Check full document steps in our <a href="/malaysia-student-visa-bangladesh">Malaysia Student Visa Guide</a>.</li>
  <li><strong>Zero File-Opening or Agency Fee:</strong> Visit our <a href="/education-consultant-dhaka">Dhanmondi Road 4/A office</a> with your HSC/O-Level transcripts for an instant APU scholarship calculation and written ClearCost Sheet at BDT 0 consultancy cost.</li>
</ul>`
  }),

  // 3. Taylor's & Sunway Malaysia
  buildGuideSpec({
    slug: 'taylors-sunway-university-malaysia-admissions-fees-bangladesh-2027',
    title: 'Taylor’s University & Sunway University Malaysia 2027 Comparison for Bangladeshi Students: Tuition Fees, Scholarships & Western Credit Transfer',
    metaTitle: 'Taylor’s vs Sunway University Malaysia 2027 Guide | EduExpress',
    metaDescription: 'Compare Taylor’s University and Sunway University Malaysia for 2027: QS rankings, Lancaster & Cordon Bleu dual degrees, BDT tuition fees, and merit scholarships.',
    excerpt: 'Side-by-side 2027 comparison of Taylor’s University (Southeast Asia’s #1 private university) and Sunway University for Bangladeshi applicants: tuition in MYR/BDT, Lancaster University UK dual degrees, US/Australia credit transfer, and merit scholarships.',
    category: 'Malaysia',
    categories: ['Malaysia', 'Rankings', 'Scholarships', 'Costs'],
    tags: ['Taylors University Malaysia', 'Sunway University Malaysia', 'best private university in malaysia', 'study in malaysia cost in bdt', 'credit transfer malaysia to uk australia'],
    featuredImage: '/images/destinations/malaysia-hero.webp',
    sourceUrls: ['https://university.taylors.edu.my/', 'https://sunwayuniversity.edu.my/', 'https://educationmalaysia.gov.my/'],
    content: `<p class="lede">For Bangladeshi families comparing private universities in Dhaka (such as NSU, BRAC, or IUB) against top-ranked international campuses, <strong><a href="/universities/taylors-university">Taylor’s University</a></strong> and <strong><a href="/universities/sunway-university">Sunway University</a></strong> in Subang Jaya / Bandar Sunway represent the gold standard of private higher education in Southeast Asia. Both institutions sit within a 5-minute walk of each other in Kuala Lumpur’s premier student township and offer direct dual degrees or 1+2 / 2+1 credit transfer pathways to the UK, Australia, Canada, and the USA.</p>
<aside class="key-facts">
  <h2>Taylor’s University vs. Sunway University (2027 Head-to-Head)</h2>
  <table><tbody>
    <tr><th>Feature</th><td><strong><a href="/universities/taylors-university">Taylor’s University</a></strong></td><td><strong><a href="/universities/sunway-university">Sunway University</a></strong></td></tr>
    <tr><th>Global Ranking</th><td>QS World #251 (#1 Private University in SE Asia)</td><td>QS World #539 (#1 in Graduate Employability Malaysia)</td></tr>
    <tr><th>Dual Degree Partner</th><td>Le Cordon Bleu (France), UWE Bristol, QUT Australia</td><td><strong>Lancaster University (UK Top 15)</strong> &amp; Le Cordon Bleu</td></tr>
    <tr><th>Annual Bachelor Tuition</th><td>MYR 38,000 &ndash; 48,000 / yr (~BDT 10.4 &ndash; 13.1 Lakh)</td><td>MYR 33,000 &ndash; 42,000 / yr (~BDT 9.0 &ndash; 11.5 Lakh)</td></tr>
    <tr><th>Merit Scholarship</th><td>MYR 10,000 &ndash; 35,000 total tuition reduction</td><td>Jeffrey Cheah Entrance Scholarship (15% &ndash; 50% waiver)</td></tr>
    <tr><th>EduExpress Processing Fee</th><td><strong>BDT 0 (Free Consultancy)</strong></td><td><strong>BDT 0 (Free Consultancy)</strong></td></tr>
  </tbody></table>
</aside>
<h2>1. Top Programs &amp; Western Transfer Pathways for Bangladeshi Students</h2>
<ul>
  <li><strong>Lancaster University UK Dual Degree at Sunway:</strong> Students in Business, Computer Science, Psychology, and Communications graduate with two original transcripts and degree scrolls—one from Sunway University and one directly from <strong>Lancaster University, UK</strong>—at less than one-third of UK onshore costs.</li>
  <li><strong>American Degree Transfer Program (ADTP) &amp; 1+2 Australia/UK Transfer:</strong> Complete 1 or 2 years in Bandar Sunway in MYR, then transfer seamlessly to Monash, Melbourne, Queensland, Bristol, or Manchester. Compare 4-year cost math in our <a href="/bangladesh-vs-study-abroad-countries">Bangladesh vs. Abroad Matrix</a>.</li>
  <li><strong>Post-O-Level 1-Year Foundation:</strong> Both Taylor’s (Foundation in Arts/Science/Computing/Business) and Sunway (FIA / FIST) accept Bangladeshi O-Level students with 5 credits, saving 1 full year compared to A-Levels (<a href="/study-in-malaysia-after-o-level">Malaysia After O-Level Guide</a>).</li>
</ul>`
  }),

  // 4. UCSI, SEGi & INTI Malaysia Affordable Private Universities
  buildGuideSpec({
    slug: 'affordable-private-universities-malaysia-ucsi-segi-inti-2027',
    title: 'Affordable Private Universities in Malaysia for Bangladeshi Students (2027): UCSI, SEGi, INTI, MMU & Nilai Tuition in BDT',
    metaTitle: 'Low Tuition Universities in Malaysia 2027 (UCSI, SEGi, INTI) | EduExpress',
    metaDescription: 'Compare affordable MQA-accredited private universities in Malaysia for Bangladeshi students: UCSI, SEGi, INTI, MMU & Nilai 2027 tuition in BDT, MOI rules & scholarships.',
    excerpt: 'Budget-friendly 2027 Malaysia university comparison for Bangladeshi students: UCSI University, SEGi University, INTI International University, Multimedia University (MMU) & Nilai University tuition fees (BDT 4.2L–6.8L/yr), up to 50% scholarships, and MOI options.',
    category: 'Malaysia',
    categories: ['Malaysia', 'Costs', 'Scholarships', 'Admissions'],
    tags: ['low tuition universities in malaysia', 'UCSI University tuition fee', 'SEGi University bangladesh', 'INTI International University', 'MMU Malaysia', 'study in malaysia low cost'],
    featuredImage: '/images/destinations/malaysia-hero.webp',
    sourceUrls: ['https://www.ucsiuniversity.edu.my/', 'https://www.segi.edu.my/', 'https://newinti.edu.my/', 'https://www.mmu.edu.my/', 'https://educationmalaysia.gov.my/'],
    content: `<p class="lede">Not every Bangladeshi family wants to spend BDT 10+ Lakh per year on tuition. Malaysia hosts a strong tier of <strong>MQA-accredited, QS-ranked private universities where net annual tuition after merit bursaries ranges from MYR 16,000 to MYR 25,000 (approximately BDT 4.4 Lakh to BDT 6.8 Lakh per year)</strong>—comparable to studying at a private university in Dhaka while earning an internationally accredited English-medium degree.</p>
<aside class="key-facts">
  <h2>Top 5 Value-for-Money Malaysian Universities (2027 Net Cost Comparison)</h2>
  <table><tbody>
    <tr><th>University</th><th>Highlight &amp; Rank</th><th>Annual Tuition (Net MYR)</th><th>Est. Annual BDT</th><th>Profile Page</th></tr>
    <tr><td><strong>UCSI University</strong></td><td>QS World #265 &middot; Co-Op Internship Placement</td><td>MYR 22,000 &ndash; 28,000</td><td>~BDT 6.0 &ndash; 7.6 Lakh</td><td><a href="/universities/ucsi-university">View UCSI</a></td></tr>
    <tr><td><strong>Multimedia University (MMU)</strong></td><td>Telekom Malaysia Tech University (Cyberjaya/Melaka)</td><td>MYR 16,500 &ndash; 22,000</td><td>~BDT 4.5 &ndash; 6.0 Lakh</td><td><a href="/universities/multimedia-university">View MMU</a></td></tr>
    <tr><td><strong>INTI International University</strong></td><td>Nilai &amp; Subang &middot; Up to 45% HSC Merit Scholarship</td><td>MYR 18,000 &ndash; 25,000</td><td>~BDT 4.9 &ndash; 6.8 Lakh</td><td><a href="/universities/inti-international-university">View INTI</a></td></tr>
    <tr><td><strong>SEGi University &amp; Colleges</strong></td><td>Kota Damansara &middot; UK Dual Degrees &amp; Flexible Entry</td><td>MYR 17,000 &ndash; 23,500</td><td>~BDT 4.6 &ndash; 6.4 Lakh</td><td><a href="/universities/segi-university">View SEGi</a></td></tr>
    <tr><td><strong>Nilai University</strong></td><td>Green Campus in Negeri Sembilan &middot; Nursing, Aviation &amp; Business</td><td>MYR 15,500 &ndash; 21,000</td><td>~BDT 4.2 &ndash; 5.7 Lakh</td><td><a href="/universities/nilai-university">View Nilai</a></td></tr>
  </tbody></table>
</aside>
<h2>1. Study Gap, MOI &amp; BDT 0 Processing Advantage</h2>
<ul>
  <li><strong>Flexible Study Gap &amp; English Placement:</strong> Private universities like SEGi, INTI, and Nilai accept 2–4 year study gaps with proper academic/work explanation (<a href="/study-gap-acceptable-countries-bangladesh">Study Gap Matcher</a>) and allow students to sit an institutional English placement test if they do not yet hold IELTS (<a href="/study-abroad-without-ielts-from-bangladesh">MOI &amp; IELTS Waiver Guide</a>).</li>
  <li><strong>100% Free Consultancy from EduExpress:</strong> Compare all 5 universities in one sitting at our Dhanmondi office with <a href="/malaysia-study-cost-bangladesh">written ClearCost breakdowns</a> and BDT 0 service charge.</li>
</ul>`
  }),

  // 5. Malaysia EMGS Visa Step-by-Step 2027
  buildGuideSpec({
    slug: 'malaysia-emgs-eval-student-visa-timeline-bangladesh-2027',
    title: 'Malaysia EMGS eVAL Student Visa Processing Time from Bangladesh (2027): 0% to 100% Color Stages, Medical & SEV Checklist',
    metaTitle: 'Malaysia EMGS eVAL Visa Timeline Bangladesh 2027 | EduExpress',
    metaDescription: 'Track your Malaysia student visa from Bangladesh in 2027: EMGS 15%–100% eVAL stages, pre-departure medical, Single Entry Visa (SEV) Dhaka, and bank statement rules.',
    excerpt: 'Complete 2027 step-by-step guide to the Malaysia EMGS eVAL student visa process for Bangladeshi students: what 15%, 32%, 70%, and 100% EMGS percentage colors mean, fee breakdown in MYR/BDT, Dhaka SEV submission, and how to avoid delays.',
    category: 'Malaysia',
    categories: ['Malaysia', 'Visa & Policy', 'Admissions'],
    tags: ['EMGS visa processing time bangladesh', 'Malaysia eVAL percentage meaning', 'Malaysia student visa from bangladesh 2027', 'SEV visa malaysia dhaka', 'EMGS medical checkup bangladesh'],
    featuredImage: '/images/destinations/malaysia-hero.webp',
    sourceUrls: ['https://educationmalaysia.gov.my/', 'https://visa.educationmalaysia.gov.my/', 'https://www.imi.gov.my/'],
    content: `<p class="lede">Every Bangladeshi student heading to Malaysia must obtain an electronic <strong>Visa Approval Letter (eVAL)</strong> through <strong>Education Malaysia Global Services (EMGS)</strong> before flying to Kuala Lumpur. Understanding each percentage milestone in the EMGS STARS portal prevents panic and ensures you book your flight and Single Entry Visa (SEV) on time.</p>
<aside class="key-facts">
  <h2>2027 EMGS eVAL Percentage Tracker &amp; Timeline (Dhaka to Kuala Lumpur)</h2>
  <table><tbody>
    <tr><th>EMGS Stage</th><th>Portal Color</th><th>What Happens &amp; Typical Duration</th></tr>
    <tr><td><strong>0% &ndash; 15%</strong></td><td>Yellow / Green</td><td>University submits documents &amp; EMGS payment receipt verified (3&ndash;5 working days).</td></tr>
    <tr><td><strong>32% &ndash; 35%</strong></td><td>Green</td><td>EMGS completes academic &amp; passport verification; file forwarded to Immigration Department of Malaysia (5&ndash;10 working days).</td></tr>
    <tr><td><strong>70% &ndash; 80%</strong></td><td>Green</td><td>Malaysian Immigration approves eVAL; electronic Visa Approval Letter generated for download (7&ndash;15 working days).</td></tr>
    <tr><td><strong>80% &ndash; 90%</strong></td><td>Green</td><td>Student applies for <strong>Single Entry Visa (SEV) / e-Visa</strong> from Bangladesh &amp; submits MDAC 3 days before flight (3&ndash;7 working days).</td></tr>
    <tr><td><strong>90% &ndash; 100%</strong></td><td>Green</td><td>Post-arrival medical screening at EMGS panel clinic in Malaysia + physical Student Pass sticker &amp; i-Kad endorsement (2&ndash;3 weeks in Malaysia).</td></tr>
  </tbody></table>
</aside>
<h2>1. Documents Required for 2027 Malaysia EMGS Application from Bangladesh</h2>
<ul>
  <li><strong>Passport:</strong> Minimum 18 months validity with clear bio page scan.</li>
  <li><strong>Academic Transcripts &amp; Certificates:</strong> SSC + HSC (or O/A-Level / Bachelor) mark sheets and certificates.</li>
  <li><strong>White-Background Passport Photo:</strong> Strict 35mm x 45mm high-resolution digital photo meeting EMGS biometric checks (the #1 cause of 15% yellow-status delays).</li>
  <li><strong>Health Declaration Form:</strong> Signed EMGS health declaration (post-arrival blood/X-ray medical screening is mandatory within 7 days of landing in Malaysia).</li>
</ul>
<p>Need full cost details or free EMGS processing? Read our <a href="/malaysia-student-visa-bangladesh">Malaysia Student Visa Pillar</a> and <a href="/malaysia-study-cost-bangladesh">Malaysia Cost Guide in BDT</a>.</p>`
  }),

  // 6. Hungary Stipendium Hungaricum SHED Bangladesh Guide
  buildGuideSpec({
    slug: 'stipendium-hungaricum-scholarship-bangladesh-shed-application-2027',
    title: 'Stipendium Hungaricum Scholarship 2027–2028 Bangladesh Guide: SHED (shed.gov.bd) Nomination, Dual Application & Top Hungarian Universities',
    metaTitle: 'Stipendium Hungaricum 2027-2028 Bangladesh SHED Guide | EduExpress',
    metaDescription: 'How to apply for Stipendium Hungaricum 2027-2028 from Bangladesh: dual submission on DreamApply & SHED (shed.gov.bd), HUF stipend, and top Hungarian universities.',
    excerpt: 'Complete 2027–2028 Stipendium Hungaricum Government Scholarship guide for Bangladeshi students: mandatory dual application on apply.stipendiumhungaricum.hu and Bangladesh Ministry of Education (SHED shed.gov.bd), quota breakdown, and best Hungarian universities.',
    category: 'Scholarships',
    categories: ['Scholarships', 'Admissions', 'Europe'],
    tags: ['Stipendium Hungaricum Bangladesh 2027', 'shed.gov.bd scholarship', 'Hungary government scholarship bangladesh', 'study in hungary from bangladesh', 'University of Debrecen scholarship'],
    featuredImage: '/images/destinations/hungary-hero.webp',
    sourceUrls: ['https://stipendiumhungaricum.hu/', 'https://apply.stipendiumhungaricum.hu/', 'https://shed.gov.bd/'],
    content: `<p class="lede">The <strong>Stipendium Hungaricum Scholarship Programme (2027–2028)</strong> is one of the most prestigious fully funded European government scholarships available to Bangladeshi students. However, every year hundreds of strong Bangladeshi applicants are disqualified automatically because they only submit on the Hungarian portal and forget the mandatory <strong>Bangladesh Ministry of Education (SHED — <code>shed.gov.bd</code>) Sending Partner application</strong>.</p>
<aside class="key-facts">
  <h2>Stipendium Hungaricum 2027–2028 Bangladesh Key Facts</h2>
  <table><tbody>
    <tr><th>Dual Submission Rule</th><td><strong>Mandatory:</strong> 1) Tempus Public Foundation (<a href="https://apply.stipendiumhungaricum.hu/" target="_blank" rel="noopener">apply.stipendiumhungaricum.hu</a>) AND 2) Bangladesh Ministry of Education SHED portal (<a href="https://shed.gov.bd/" target="_blank" rel="noopener">shed.gov.bd</a>)</td></tr>
    <tr><th>Annual Application Deadline</th><td><strong>15 January</strong> (2:00 PM Central European Time / 7:00 PM Dhaka Time)</td></tr>
    <tr><th>Scholarship Coverage</th><td><strong>100% Tuition Waiver</strong> + Free Dormitory (or HUF 40,000/mo housing contribution) + Health Insurance + Monthly Stipend (HUF 43,700 Bachelor/Master; HUF 140,000–180,000 PhD)</td></tr>
    <tr><th>Top Partner Universities</th><td><a href="/universities/university-of-debrecen">University of Debrecen</a>, <a href="/universities/eotvos-lorand-university">ELTE Budapest</a>, <a href="/universities/budapest-university-of-technology-and-economics">BME Budapest</a>, <a href="/universities/university-of-pecs">University of Pécs</a>, <a href="/universities/university-of-szeged">University of Szeged</a></td></tr>
    <tr><th>Full Hungary Guides</th><td><a href="/hungary-scholarships-bangladesh">Hungary Scholarships Hub</a> &middot; <a href="/study-in-hungary-from-bangladesh">Study in Hungary</a> &middot; <a href="/hungary-student-visa-bangladesh">Hungary D-Visa Guide</a></td></tr>
  </tbody></table>
</aside>
<h2>1. How to Avoid Disqualification on the Bangladesh SHED Portal</h2>
<ol>
  <li><strong>Select 2 Study Programs Carefully:</strong> You may choose a 1st priority and 2nd priority Hungarian university/program. Mixing a high-prestige Budapest university (like <a href="/universities/eotvos-lorand-university">ELTE</a> or <a href="/universities/budapest-university-of-technology-and-economics">BME</a>) with a major regional research university (like <a href="/universities/university-of-debrecen">University of Debrecen</a> or <a href="/universities/university-of-pecs">University of Pécs</a>) maximizes nomination and admission odds.</li>
  <li><strong>Submit the Bangladesh SHED Online Form &amp; Hardcopy:</strong> Watch the Secondary and Higher Education Division (<code>shed.gov.bd</code>) notice board in December–January. Your DreamApply Applicant ID must be entered accurately on the SHED form.</li>
  <li><strong>Prepare e-Apostille &amp; Medical Early:</strong> Nominated candidates must complete university Skype/written entrance exams in March–May and <a href="/document-attestation-apostille-bangladesh">MOFA e-Apostille</a> before their Schengen Type-D Residence Permit appointment.</li>
</ol>`
  }),

  // 7. Hungary Top Universities Tuition & Self-Funded Guide
  buildGuideSpec({
    slug: 'top-universities-in-hungary-for-bangladeshi-students-debrecen-elte-bme-pecs-2027',
    title: 'Top Universities in Hungary for Bangladeshi Students (2027): Debrecen, ELTE, BME, Pécs & Szeged Tuition Fees in EUR & BDT',
    metaTitle: 'Top Universities in Hungary 2027 (Debrecen, ELTE, BME) | EduExpress',
    metaDescription: 'Compare Hungary’s top 6 universities for Bangladeshi students in 2027: University of Debrecen, ELTE, BME, Pécs, Szeged & Corvinus tuition in EUR/BDT and visa rules.',
    excerpt: '2027 comparison of Hungary’s top 6 English-taught universities for Bangladeshi students: University of Debrecen, ELTE Budapest, BME, University of Pécs, University of Szeged, and Corvinus University tuition fees (EUR/BDT), IELTS requirements, and pay-after-visa agency support.',
    category: 'Europe',
    categories: ['Europe', 'Admissions', 'Costs', 'Rankings'],
    tags: ['University of Debrecen bangladesh', 'ELTE Budapest tuition fees', 'BME Hungary engineering', 'University of Pecs', 'study in hungary cost in bdt'],
    featuredImage: '/images/destinations/hungary-hero.webp',
    sourceUrls: ['https://edu.unideb.hu/', 'https://www.elte.hu/en/', 'https://www.bme.hu/?language=en', 'https://international.pte.hu/'],
    content: `<p class="lede">Hungary has become one of the top European Schengen study destinations for Bangladeshi students thanks to its <strong>QS Top-600 public research universities, affordable English-taught Bachelor and Master tuition (starting from EUR 5,000–7,000 / year), and full Schengen mobility</strong>. Best of all, under EduExpress International’s European policy, you pay <strong>BDT 0 file-opening fee and BDT 1,00,000 service charge 100% after Hungary visa approval</strong>.</p>
<aside class="key-facts">
  <h2>2027 Comparison of Hungary’s Top 6 Public &amp; Flagship Universities</h2>
  <table><tbody>
    <tr><th>University &amp; City</th><th>QS World Rank</th><th>Top English Programs</th><th>Annual Tuition (EUR)</th><th>Est. Annual BDT</th></tr>
    <tr><td><strong><a href="/universities/eotvos-lorand-university">Eötvös Loránd University (ELTE)</a></strong> &middot; Budapest</td><td>QS #564</td><td>Computer Science, Data Science, Psychology, International Relations</td><td>EUR 5,000 &ndash; 6,400</td><td>~BDT 6.5 &ndash; 8.3 Lakh</td></tr>
    <tr><td><strong><a href="/universities/university-of-szeged">University of Szeged</a></strong> &middot; Szeged</td><td>QS #570</td><td>Computer Science, Business, Agriculture, General Medicine</td><td>EUR 4,400 &ndash; 7,000 (Non-Med)</td><td>~BDT 5.7 &ndash; 9.1 Lakh</td></tr>
    <tr><td><strong><a href="/universities/university-of-debrecen">University of Debrecen</a></strong> &middot; Debrecen</td><td>QS #574</td><td>Engineering, IT, Business, Agriculture, Medicine (Largest BD community)</td><td>EUR 6,000 &ndash; 7,500 (Non-Med)</td><td>~BDT 7.8 &ndash; 9.7 Lakh</td></tr>
    <tr><td><strong><a href="/universities/budapest-university-of-technology-and-economics">BME Budapest</a></strong> &middot; Budapest</td><td>QS #721</td><td>Civil, Mechanical, Electrical &amp; Computer Engineering, Architecture</td><td>EUR 6,400 &ndash; 8,000</td><td>~BDT 8.3 &ndash; 10.4 Lakh</td></tr>
    <tr><td><strong><a href="/universities/university-of-pecs">University of Pécs</a></strong> &middot; Pécs</td><td>QS #751</td><td>Business Administration, Computer Science, International Relations, Nursing</td><td>EUR 5,000 &ndash; 6,500</td><td>~BDT 6.5 &ndash; 8.4 Lakh</td></tr>
    <tr><td><strong><a href="/universities/corvinus-university-of-budapest">Corvinus University</a></strong> &middot; Budapest</td><td>AACSB &amp; AMBA</td><td>Applied Economics, Finance, International Business, Data Analytics</td><td>EUR 5,800 &ndash; 7,800</td><td>~BDT 7.5 &ndash; 10.1 Lakh</td></tr>
  </tbody></table>
</aside>
<h2>1. Visa Bank Solvency &amp; Pay-After-Visa Terms for Hungary</h2>
<p>To secure your Hungary Type-D Student Residence Permit, applicants must demonstrate 1st-year tuition payment plus <strong>EUR 8,000 &ndash; EUR 10,000 (~BDT 12 &ndash; 18 Lakh)</strong> in liquid sponsor bank solvency and pass a consulate interview. Check your exact numbers in our <a href="/hungary-study-cost-bangladesh">Hungary Cost Guide</a>, <a href="/hungary-student-visa-bangladesh">Hungary Student Visa Guide</a>, and <a href="/student-visa-bank-solvency-bangladesh">Bank Solvency Calculator</a>.</p>`
  }),

  // 8. UK Student Visa 28-Day Bank Statement & Affordable UK Universities
  buildGuideSpec({
    slug: 'uk-student-visa-28-day-bank-statement-cas-guide-bangladesh-2027',
    title: 'UK Student Visa 28-Day Bank Statement Rule & CAS Checklist for Bangladeshi Students (2027): GBP-to-BDT Solvency & Top Universities',
    metaTitle: 'UK Student Visa 28-Day Bank Statement Rule Bangladesh 2027 | EduExpress',
    metaDescription: 'Master the UKVI 28-day bank statement rule from Bangladesh in 2027: exact GBP 1,483/1,136 maintenance in BDT, approved Bangladeshi banks, CAS interview & IHS fees.',
    excerpt: 'Detailed 2027 UKVI financial compliance guide for Bangladeshi student visa applicants: calculating remaining CAS tuition + 9 months maintenance (GBP 13,347 London / GBP 10,224 outside London) in BDT, the strict 28-day & 31-day bank statement rules, and top UK universities.',
    category: 'Europe',
    categories: ['Europe', 'Visa & Policy', 'Costs'],
    tags: ['UK student visa 28 days bank statement bangladesh', 'UKVI maintenance funds 2027 in BDT', 'CAS letter UK bangladesh', 'study in UK from bangladesh cost', 'Coventry UWE Bristol Manchester Birmingham'],
    featuredImage: '/images/destinations/united-kingdom-hero.webp',
    sourceUrls: ['https://www.gov.uk/student-visa/money', 'https://www.gov.uk/guidance/financial-evidence-for-student-and-child-student-route-applicants'],
    content: `<p class="lede">The single largest reason for UK Student Visa refusals from Dhaka and Sylhet is a technical breach of the <strong>UKVI 28-Day Consecutive Bank Statement Rule</strong>. Even if your family has BDT 60 Lakh in the bank, if the closing balance drops below the required GBP threshold for a single day during the 28-day window—or if the bank certificate is dated more than 31 days before online visa payment—UKVI will refuse the visa automatically.</p>
<aside class="key-facts">
  <h2>2027 UKVI Maintenance &amp; Tuition Solvency Formula (Bangladesh)</h2>
  <table><tbody>
    <tr><th>Location Tier</th><th>Monthly Living Rate (Max 9 Months)</th><th>Total 9-Month Living Fund</th><th>Plus Remaining 1st-Year Tuition on CAS</th></tr>
    <tr><td><strong>Inside London</strong> (London Boroughs)</td><td>GBP 1,483 / month</td><td><strong>GBP 13,347</strong> (~BDT 20.7 Lakh)</td><td>+ Unpaid Year-1 Tuition shown on CAS (typically BDT 38L&ndash;52L total held)</td></tr>
    <tr><td><strong>Outside London</strong> (Manchester, Birmingham, Leeds, Bristol, Coventry, Glasgow, Cardiff)</td><td>GBP 1,136 / month</td><td><strong>GBP 10,224</strong> (~BDT 15.8 Lakh)</td><td>+ Unpaid Year-1 Tuition shown on CAS (typically BDT 30L&ndash;42L total held)</td></tr>
    <tr><th>Holding Rules</th><td colspan="3"><strong>28 consecutive days</strong> untouched minimum balance &middot; Statement dated within <strong>31 days</strong> of UKVI online submission &middot; Only parents, legal guardians, or student’s own account allowed (no uncles/siblings)</td></tr>
    <tr><th>EduExpress UK Service Fee</th><td colspan="3"><strong>BDT 0 File-Opening Fee &middot; BDT 0 EduExpress Service Charge (100% Free Consultancy for UK)</strong></td></tr>
  </tbody></table>
</aside>
<h2>1. Compare Top Russell Group &amp; Career-Focused UK Universities in Our Directory</h2>
<ul>
  <li><strong>Russell Group Global Top 100:</strong> <a href="/universities/university-of-manchester">University of Manchester</a>, <a href="/universities/university-of-birmingham">University of Birmingham</a>, <a href="/universities/university-of-glasgow">University of Glasgow</a>, <a href="/universities/university-of-leeds">University of Leeds</a>, <a href="/universities/university-of-sheffield">University of Sheffield</a>, and <a href="/universities/cardiff-university">Cardiff University</a>.</li>
  <li><strong>High-Scholarship Career Universities (GBP 3,000–5,000 Bursaries):</strong> <a href="/universities/coventry-university">Coventry University</a> and <a href="/universities/uwe-bristol">UWE Bristol</a>.</li>
</ul>
<p>Run your exact GBP-to-BDT numbers in our <a href="/student-visa-bank-solvency-bangladesh">Interactive Visa Solvency Calculator</a> and review full visa steps on <a href="/uk-student-visa-bangladesh">UK Student Visa Bangladesh</a> and <a href="/uk-scholarships-bangladesh">UK Scholarships Bangladesh</a>.</p>`
  }),

  // 9. Finland Studyinfo & EUR 9,600 Migri Guide
  buildGuideSpec({
    slug: 'finland-studyinfo-joint-application-migri-visa-bangladesh-2027',
    title: 'Finland Studyinfo Joint Application 2027 & Migri €9,600 Residence Permit Guide for Bangladeshi Students (With Spouse/Family Rules)',
    metaTitle: 'Finland Studyinfo 2027 & Migri €9,600 Visa Guide | EduExpress',
    metaDescription: 'Apply to Finnish universities in 2027 via Studyinfo.fi: Helsinki, Aalto, Tampere, LUT, Oulu & Metropolia tuition waivers, Migri €9,600 bank rule, and VFS New Delhi.',
    excerpt: 'Complete 2027 Finland admissions and Migri residence permit guide for Bangladeshi students: January Studyinfo.fi Joint Application deadlines, early-bird & 50%–100% tuition waivers at Aalto, Helsinki, Tampere, LUT, Oulu & Metropolia, and the €9,600/yr savings rule.',
    category: 'Europe',
    categories: ['Europe', 'Admissions', 'Visa & Policy', 'Scholarships'],
    tags: ['Study in Finland from Bangladesh 2027', 'Finland student visa 9600 euro', 'Studyinfo.fi joint application bangladesh', 'LUT Tampere Oulu Aalto University', 'Finland student visa with spouse bangladesh'],
    featuredImage: '/images/destinations/finland-hero.webp',
    sourceUrls: ['https://studyinfo.fi/wp2/en/', 'https://migri.fi/en/studying-in-finland', 'https://www.studyinfinland.fi/'],
    content: `<p class="lede">Finland offers Bangladeshi STEM, ICT, Business, and Engineering graduates a clear <strong>Schengen A-Permit (Continuous Residence Permit)</strong>, 30 hours/week part-time work rights, a 2-year post-study job-seeking permit, and high-value early-bird and merit scholarships across its research universities and Universities of Applied Sciences (UAS).</p>
<aside class="key-facts">
  <h2>Finland 2027 Admissions &amp; Migri Residence Permit Facts (Bangladesh)</h2>
  <table><tbody>
    <tr><th>National Application Portal</th><td><strong>Studyinfo.fi Joint Application</strong> (Early January window for Autumn 2027 intake) + Separate rolling admissions</td></tr>
    <tr><th>Top Verified Finnish Universities</th><td><a href="/universities/university-of-helsinki">University of Helsinki</a>, <a href="/universities/aalto-university">Aalto University</a>, <a href="/universities/tampere-university">Tampere University</a>, <a href="/universities/lut-university">LUT University</a>, <a href="/universities/university-of-oulu">University of Oulu</a>, <a href="/universities/metropolia-university-of-applied-sciences">Metropolia UAS</a></td></tr>
    <tr><th>Migri Living Means Requirement</th><td><strong>EUR 800 / month = EUR 9,600 / year</strong> (~BDT 12.5 Lakh) held in the <strong>student’s own bank account</strong> (in addition to paid 1st-year net tuition)</td></tr>
    <tr><th>Biometrics &amp; VFS Submission</th><td>Apply online via <strong>Enter Finland</strong>; biometrics submitted at VFS Global Finland (New Delhi) &mdash; <a href="/finland-student-visa-bangladesh">Full Finland Visa Guide</a></td></tr>
    <tr><th>EduExpress Fee Policy</th><td><strong>BDT 0 Before Visa &middot; BDT 1,00,000 Payable 100% After Finland Residence Permit Approval</strong></td></tr>
  </tbody></table>
</aside>
<h2>1. Finnish Tuition Fees &amp; 2027 Scholarship / Early-Bird Waivers</h2>
<ul>
  <li><strong>Universities of Applied Sciences (<a href="/universities/metropolia-university-of-applied-sciences">Metropolia UAS</a>):</strong> Annual tuition EUR 10,000–12,000 with <strong>Early-Bird discounts (EUR 1,500–3,000 off Year 1)</strong> and Finnish-language proficiency scholarships from Year 2.</li>
  <li><strong>Research Universities (<a href="/universities/tampere-university">Tampere</a>, <a href="/universities/lut-university">LUT</a>, <a href="/universities/university-of-oulu">Oulu</a>, <a href="/universities/aalto-university">Aalto</a>, <a href="/universities/university-of-helsinki">Helsinki</a>):</strong> Annual tuition EUR 10,000–18,000 with <strong>50% to 100% Finland Scholarship / Institutional Tuition Waivers</strong> for top Master’s applicants (<a href="/finland-scholarships-bangladesh">Finland Scholarships Guide</a>).</li>
</ul>`
  }),

  // 10. South Korea D-2 Visa, Apostille & Top Korean Universities
  buildGuideSpec({
    slug: 'south-korea-d2-student-visa-top-universities-bangladesh-2027',
    title: 'South Korea D-2 Student Visa & Top Universities Guide for Bangladeshi Students (2027): KAIST, SNU, Yonsei, Korea University & USD 10,000 Bank Rule',
    metaTitle: 'South Korea D-2 Visa & Top Universities 2027 | EduExpress',
    metaDescription: 'Study in South Korea from Bangladesh in 2027: KAIST, SNU, Yonsei, Korea Univ, SKKU & Hanyang scholarships, USD 10,000–20,000 bank rule, and MOFA e-Apostille.',
    excerpt: '2027 South Korea D-2 degree visa and university guide for Bangladeshi students: Professor-Lab & Merit Scholarships at KAIST, SNU, Yonsei, Korea University, SKKU & Hanyang, updated USD 10,000–20,000 Korean Embassy Dhaka bank solvency rules, and e-Apostille compliance.',
    category: 'Asia',
    categories: ['Asia', 'Scholarships', 'Visa & Policy', 'Admissions'],
    tags: ['Study in South Korea from Bangladesh 2027', 'South Korea D-2 student visa bangladesh', 'KAIST SNU Yonsei Korea University scholarship', 'Korean embassy dhaka student visa bank statement', 'GKS scholarship bangladesh'],
    featuredImage: '/images/destinations/south-korea-hero.webp',
    sourceUrls: ['https://www.studyinkorea.go.kr/', 'https://overseas.mofa.go.kr/bd-en/index.do'],
    content: `<p class="lede">Beyond the fully funded <a href="/south-korea-scholarships-bangladesh">Global Korea Scholarship (GKS)</a>, South Korea’s world-leading STEM and research universities offer <strong>30% to 100% institutional merit scholarships and Professor Research Assistant (RA/TA) stipends</strong> for Bangladeshi Bachelor, Master, and PhD applicants in Semiconductor Engineering, AI, Robotics, Biotechnology, and International Business.</p>
<aside class="key-facts">
  <h2>Top 6 Verified South Korean Universities in the EduExpress Directory</h2>
  <table><tbody>
    <tr><th>University</th><th>QS World Rank</th><th>Flagship Scholarships for Bangladeshi Students</th><th>Semester Tuition (Before Waiver)</th></tr>
    <tr><td><strong><a href="/universities/seoul-national-university">Seoul National University (SNU)</a></strong></td><td>QS #31</td><td>SNU President Fellowship, Global Scholarship &amp; GKS</td><td>KRW 3.2M &ndash; 5.2M / sem</td></tr>
    <tr><td><strong><a href="/universities/yonsei-university">Yonsei University</a></strong></td><td>QS #56</td><td>Underwood International College (UIC) 30%–100% Merit Grant</td><td>KRW 4.5M &ndash; 7.8M / sem</td></tr>
    <tr><td><strong><a href="/universities/korea-university">Korea University</a></strong></td><td>QS #67</td><td>Global Leader Scholarship Type A (100%) &amp; Type B (50%)</td><td>KRW 4.4M &ndash; 6.9M / sem</td></tr>
    <tr><td><strong><a href="/universities/kaist">KAIST</a></strong> (Daejeon)</td><td>QS #53</td><td><strong>KAIST International Scholarship (100% Tuition + KRW 350k–400k/mo Stipend)</strong></td><td>Covered by KAIST Grant</td></tr>
    <tr><td><strong><a href="/universities/sungkyunkwan-university">Sungkyunkwan University (SKKU)</a></strong></td><td>QS #123</td><td>Samsung Global Scholarship &amp; STEM Graduate 30%–100% Waiver</td><td>KRW 4.6M &ndash; 6.8M / sem</td></tr>
    <tr><td><strong><a href="/universities/hanyang-university">Hanyang University</a></strong></td><td>QS #162</td><td>Hanyang International Excellence Award (HIEA 30%–100%)</td><td>KRW 4.5M &ndash; 6.6M / sem</td></tr>
  </tbody></table>
</aside>
<h2>1. Korean Embassy Dhaka D-2 Visa Requirements (2027 Checklist)</h2>
<ul>
  <li><strong>Bank Solvency Rule:</strong> Minimum <strong>USD 10,000 &ndash; USD 20,000 (~BDT 13 Lakh &ndash; 25 Lakh)</strong> depending on metropolitan vs. regional university classification, held continuously with parent NBR tax returns. Check our <a href="/south-korea-student-visa-bangladesh">South Korea Student Visa Guide</a>.</li>
  <li><strong>Mandatory e-Apostille:</strong> Since Bangladesh joined the Hague Apostille Convention, academic transcripts must carry a verified <a href="/document-attestation-apostille-bangladesh">MOFA Bangladesh e-Apostille</a>.</li>
</ul>`
  }),

  // 11. Georgia MBBS & BMDC Compliance Guide
  buildGuideSpec({
    slug: 'study-in-georgia-mbbs-md-tsmu-bmdc-eligibility-bangladesh-2027',
    title: 'MBBS (MD) & Bachelor Study in Georgia from Bangladesh (2027): TSMU, TSU, Ilia State Tuition Fees, BMDC Rules & D3 Visa Guide',
    metaTitle: 'MBBS & Study in Georgia from Bangladesh 2027 (TSMU, BMDC) | EduExpress',
    metaDescription: 'Compare Tbilisi State Medical University (TSMU), TSU, Ilia State & University of Georgia for 2027: English MD/MBBS tuition in USD/BDT, BMDC rules & Georgia D3 visa.',
    excerpt: '2027 guide to studying Medicine (6-year English MD/MBBS), Computer Science, and Business in Georgia from Bangladesh: Tbilisi State Medical University (TSMU), TSU, Ilia State & University of Georgia tuition fees in USD/BDT, BMDC Foreign Medical College rules, and EQE recognition.',
    category: 'Europe',
    categories: ['Europe', 'Medical', 'Costs', 'Visa & Policy'],
    tags: ['MBBS in Georgia from Bangladesh', 'Tbilisi State Medical University tuition fee', 'study in georgia cost in bdt', 'BMDC recognized medical colleges in georgia', 'Georgia D3 student visa bangladesh'],
    featuredImage: '/images/destinations/georgia-hero.webp',
    sourceUrls: ['https://tsmu.edu/', 'https://www.tsu.ge/en', 'https://eqe.ge/en', 'https://www.bmdc.org.bd/'],
    content: `<p class="lede">Georgia (Tbilisi) has emerged as a major English-medium medical (6-year MD, equivalent to MBBS) and undergraduate destination for Bangladeshi students due to its European Higher Education Area (Bologna Process) alignment, WFME/WDOMS-listed medical faculties, and straightforward <strong>Ministry of Education (EQE) Order + D3 Student Visa pathway</strong>.</p>
<aside class="key-facts">
  <h2>Top 4 Verified Georgian Universities in Our Directory (2027 Fees)</h2>
  <table><tbody>
    <tr><th>University (Tbilisi)</th><th>Flagship English Programs</th><th>Annual Tuition (USD)</th><th>Est. Annual BDT</th></tr>
    <tr><td><strong><a href="/universities/tbilisi-state-medical-university">Tbilisi State Medical University (TSMU)</a></strong></td><td>6-Year European MD (MBBS Equivalent) &amp; US MD Program</td><td>USD 8,000 &ndash; 13,500 / yr</td><td>~BDT 9.8 &ndash; 16.5 Lakh</td></tr>
    <tr><td><strong><a href="/universities/tbilisi-state-university">Ivane Javakhishvili Tbilisi State University (TSU)</a></strong></td><td>6-Year MD (Medicine), Computer Science, Business</td><td>USD 4,000 &ndash; 7,000 / yr</td><td>~BDT 4.9 &ndash; 8.5 Lakh</td></tr>
    <tr><td><strong><a href="/universities/ilia-state-university">Ilia State University</a></strong></td><td>Medicine (MD), Computer Engineering, Business Administration</td><td>USD 4,500 &ndash; 6,500 / yr</td><td>~BDT 5.5 &ndash; 7.9 Lakh</td></tr>
    <tr><td><strong><a href="/universities/university-of-georgia-tbilisi">The University of Georgia (UG)</a></strong></td><td>Medicine (MD), Nursing, Pharmacy, IT, Engineering, BBA</td><td>USD 4,500 &ndash; 6,500 / yr</td><td>~BDT 5.5 &ndash; 7.9 Lakh</td></tr>
  </tbody></table>
</aside>
<h2>1. Critical BMDC Eligibility Check Before Applying for MBBS/MD in Georgia</h2>
<p>Before paying any deposit to a Georgian medical university, Bangladeshi students MUST obtain their <strong>BMDC Foreign Medical College Eligibility Certificate</strong> in Dhaka (requiring minimum combined SSC+HSC GPA 8.00, minimum GPA 3.50 in each, and Biology GP 3.50 in HSC). Verify your score immediately using our <a href="/bmdc-recognized-medical-colleges-abroad">Interactive BMDC Medical Eligibility Checker</a> and review visa steps on <a href="/georgia-student-visa-bangladesh">Georgia Student Visa Guide</a> and <a href="/georgia-study-cost-bangladesh">Georgia Study Cost Guide</a>.</p>`
  }),

  // 12. Cyprus EU Universities (UCY, UNIC, EUC, CUT)
  buildGuideSpec({
    slug: 'study-in-cyprus-eu-universities-nicosia-ucy-euc-bangladesh-2027',
    title: 'Study in Cyprus (Republic of Cyprus / EU) from Bangladesh 2027: University of Nicosia, EUC, UCY & CUT Tuition Fees & Blue Slip Visa Guide',
    metaTitle: 'Study in Cyprus (EU) 2027: UNIC, EUC & UCY Guide | EduExpress',
    metaDescription: 'Study in the Republic of Cyprus (EU) from Bangladesh in 2027: University of Nicosia, European University Cyprus, UCY & CUT tuition in EUR/BDT, scholarships & visa.',
    excerpt: 'Official 2027 guide to CYQAA-accredited European Union universities in the Republic of Cyprus (South Cyprus) for Bangladeshi students: University of Nicosia (UNIC), European University Cyprus (EUC), University of Cyprus (UCY), and CUT tuition fees, e-Apostille rules, and entry permit timeline.',
    category: 'Europe',
    categories: ['Europe', 'Admissions', 'Costs', 'Visa & Policy'],
    tags: ['Study in Cyprus from Bangladesh 2027', 'University of Nicosia bangladesh', 'European University Cyprus tuition fees', 'Republic of Cyprus student visa bangladesh', 'EU universities low tuition'],
    featuredImage: '/images/destinations/cyprus-hero.webp',
    sourceUrls: ['https://www.dipae.ac.cy/', 'https://www.unic.ac.cy/', 'https://euc.ac.cy/', 'https://www.ucy.ac.cy/?lang=en'],
    content: `<p class="lede">When Bangladeshi students search for Cyprus, it is critical to distinguish between <strong>internationally recognized European Union universities in the Republic of Cyprus (accredited by CYQAA)</strong> and unaccredited colleges outside EU jurisdiction. EduExpress processes applications <strong>strictly for official Republic of Cyprus (EU) state and CYQAA-accredited universities</strong> where degrees carry full European Credit Transfer (ECTS) recognition.</p>
<aside class="key-facts">
  <h2>4 Verified Republic of Cyprus (EU) Universities in Our Directory</h2>
  <table><tbody>
    <tr><th>University &amp; City</th><th>Status &amp; Recognition</th><th>Annual Tuition (Net EUR)</th><th>Est. Annual BDT</th></tr>
    <tr><td><strong><a href="/universities/university-of-nicosia">University of Nicosia (UNIC)</a></strong> &middot; Nicosia</td><td>QS World #501–600 &middot; Largest Research University in South Europe</td><td>EUR 6,500 &ndash; 9,400 (after international bursary)</td><td>~BDT 8.4 &ndash; 12.2 Lakh</td></tr>
    <tr><td><strong><a href="/universities/european-university-cyprus">European University Cyprus (EUC)</a></strong> &middot; Nicosia</td><td>QS 5-Stars &middot; Strong IT, Business, Engineering &amp; Medicine</td><td>EUR 6,500 &ndash; 8,900 (after bursary)</td><td>~BDT 8.4 &ndash; 11.5 Lakh</td></tr>
    <tr><td><strong><a href="/universities/university-of-cyprus">University of Cyprus (UCY)</a></strong> &middot; Nicosia</td><td>QS World #368 &middot; Flagship Public State Research University</td><td>EUR 5,125 &ndash; 6,920</td><td>~BDT 6.6 &ndash; 9.0 Lakh</td></tr>
    <tr><td><strong><a href="/universities/cyprus-university-of-technology">Cyprus University of Technology (CUT)</a></strong> &middot; Limassol</td><td>Public State Technical University &middot; Engineering &amp; Applied Sciences</td><td>EUR 5,125 &ndash; 6,830</td><td>~BDT 6.6 &ndash; 8.8 Lakh</td></tr>
  </tbody></table>
</aside>
<h2>1. Blue Slip Entry Permit, Bank Solvency &amp; Attestation Checklist</h2>
<p>In the Republic of Cyprus, your university submits your attested and <a href="/document-attestation-apostille-bangladesh">e-Apostilled</a> academic file directly to the Civil Registry and Migration Department (CRMD) in Nicosia to issue your Entry Permit ("Blue Slip"). Review full solvency (EUR 7,000+ bank balance) and medical rules in our <a href="/cyprus-student-visa-bangladesh">Cyprus Student Visa Guide</a> and <a href="/cyprus-study-cost-bangladesh">Cyprus Cost Guide</a>.</p>`
  }),

  // 13. Malta Schengen English-Medium Universities (UM, MCAST, ITS)
  buildGuideSpec({
    slug: 'study-in-malta-schengen-universities-um-mcast-its-bangladesh-2027',
    title: 'Study in Malta from Bangladesh (2027): University of Malta, MCAST & ITS Malta Tuition Fees in EUR/BDT and Identità Schengen Visa Guide',
    metaTitle: 'Study in Malta 2027 (University of Malta, MCAST) | EduExpress',
    metaDescription: 'Apply to official state universities in Malta from Bangladesh in 2027: University of Malta, MCAST & ITS Malta tuition in EUR/BDT, English instruction & Schengen visa.',
    excerpt: '2027 guide to Malta’s official MFHEA-accredited public institutions for Bangladeshi students: University of Malta (UM), MCAST, and Institute of Tourism Studies (ITS Malta) tuition fees in EUR/BDT, 20 hrs/week work rights after 90 days, and Identità / VFS visa rules.',
    category: 'Europe',
    categories: ['Europe', 'Admissions', 'Costs', 'Visa & Policy'],
    tags: ['Study in Malta from Bangladesh 2027', 'University of Malta bangladesh', 'MCAST Malta tuition fees', 'Malta Schengen student visa bangladesh', 'English speaking country in Schengen'],
    featuredImage: '/images/destinations/malta-hero.webp',
    sourceUrls: ['https://www.um.edu.mt/', 'https://mcast.edu.mt/', 'https://its.edu.mt/', 'https://identita.gov.mt/'],
    content: `<p class="lede">Malta is the <strong>only Schengen Member State where English is an official constitutional language</strong> alongside Maltese. For Bangladeshi students who want an English-speaking Mediterranean environment with a Schengen Residence Permit, choosing <strong>official MFHEA state universities and colleges</strong> (rather than short-course private academies) is the key to high visa approval rates.</p>
<aside class="key-facts">
  <h2>3 Official Maltese State Higher Education Institutions in Our Directory</h2>
  <table><tbody>
    <tr><th>Institution</th><th>Type &amp; EQF Level</th><th>Top Programs</th><th>Annual Tuition (EUR)</th><th>Est. Annual BDT</th></tr>
    <tr><td><strong><a href="/universities/university-of-malta">University of Malta (UM)</a></strong> &middot; Msida</td><td>Flagship State Public University (400+ yrs old)</td><td>Computing, AI, Engineering, Finance, Maritime Law, MSc</td><td>EUR 8,500 &ndash; 13,600</td><td>~BDT 11.0 &ndash; 17.6 Lakh</td></tr>
    <tr><td><strong><a href="/universities/mcast-malta">MCAST (Malta College of Arts, Science &amp; Tech)</a></strong> &middot; Paola</td><td>State Vocational &amp; Applied Sciences College</td><td>BSc Software Dev, Mechanical/Electrical Eng, Business, Applied Science</td><td>EUR 6,500 &ndash; 9,500</td><td>~BDT 8.4 &ndash; 12.3 Lakh</td></tr>
    <tr><td><strong><a href="/universities/institute-of-tourism-studies-malta">Institute of Tourism Studies (ITS Malta)</a></strong> &middot; Luqa</td><td>State Hospitality &amp; Culinary Arts Institute</td><td>Bachelor in International Hospitality Management, Culinary Arts, MBA</td><td>EUR 5,500 &ndash; 8,500</td><td>~BDT 7.1 &ndash; 11.0 Lakh</td></tr>
  </tbody></table>
</aside>
<h2>1. Identità Malta Schengen D-Visa &amp; Work Permit Rules</h2>
<p>International degree students in Malta can apply for a Jobsplus 20-hour/week part-time employment license after their first 90 days and receive a 9-month post-study job-seeking extension upon graduation. Check full bank solvency (EUR 8,000–10,000) and VFS details on <a href="/malta-student-visa-bangladesh">Malta Student Visa Guide</a> and <a href="/malta-study-cost-bangladesh">Malta Study Cost Guide</a>.</p>`
  }),

  // 14. Greece & Croatia Low-Tuition Schengen Public Universities
  buildGuideSpec({
    slug: 'low-tuition-schengen-universities-greece-croatia-bangladesh-2027',
    title: 'Low-Tuition Schengen Public Universities for Bangladeshi Students (2027): Greece (Athens, Aristotle, AUEB) & Croatia (Zagreb, Split, Rijeka)',
    metaTitle: 'Low-Tuition Schengen Universities 2027: Greece & Croatia | EduExpress',
    metaDescription: 'Compare low-tuition Schengen public universities in Greece and Croatia for Bangladeshi students in 2027: EUR 1,500–6,000 tuition, English degrees & visa checklists.',
    excerpt: '2027 guide to Europe’s lowest-tuition English-taught public Schengen universities for Bangladeshi students: Greece (NKUA Athens, Aristotle University, AUEB, NTUA — from EUR 1,500/yr) and Croatia (University of Zagreb, Split, Rijeka — from EUR 3,000/yr).',
    category: 'Europe',
    categories: ['Europe', 'Costs', 'Admissions', 'Visa & Policy'],
    tags: ['low tuition universities in europe for bangladeshi students', 'study in greece from bangladesh', 'study in croatia from bangladesh', 'University of Zagreb tuition fee', 'National and Kapodistrian University of Athens'],
    featuredImage: '/images/destinations/greece-hero.webp',
    sourceUrls: ['https://studyingreece.edu.gr/', 'https://www.studyincroatia.hr/', 'https://en.uoa.gr/', 'https://www.unizg.hr/homepage/'],
    content: `<p class="lede">Many Bangladeshi graduates assume studying at a historic European Union &amp; Schengen public research university costs EUR 15,000+ per year. In reality, <strong>Greece and Croatia—both full EU, Eurozone, and Schengen Area members—offer English-taught Master’s and select Bachelor’s programs at century-old state universities with annual tuition starting between EUR 1,500 and EUR 6,000 (BDT 2.0 Lakh to BDT 7.8 Lakh / year)</strong>.</p>
<aside class="key-facts">
  <h2>7 Verified Greek &amp; Croatian State Universities in Our Directory</h2>
  <table><tbody>
    <tr><th>Country &amp; University</th><th>Global Standing</th><th>English-Taught Tracks</th><th>Annual Tuition (EUR)</th></tr>
    <tr><td><strong>Greece: <a href="/universities/national-and-kapodistrian-university-of-athens">NKUA (University of Athens)</a></strong></td><td>QS #393 &middot; Founded 1837</td><td>BA Archaeology/History, MSc Data Science, International Medicine, Finance</td><td>EUR 1,500 &ndash; 6,000 (Non-Med)</td></tr>
    <tr><td><strong>Greece: <a href="/universities/aristotle-university-of-thessaloniki">Aristotle University (AUTh)</a></strong></td><td>QS #508 &middot; Largest Greek Uni</td><td>English MSc STEM/Humanities, 6-Year Medicine</td><td>EUR 2,000 &ndash; 5,000 (MSc)</td></tr>
    <tr><td><strong>Greece: <a href="/universities/athens-university-of-economics-and-business">AUEB Athens</a></strong></td><td>Triple-Accredited Business School</td><td>MSc International Shipping, Finance, Business Analytics, MBA International</td><td>EUR 4,500 &ndash; 7,500 total</td></tr>
    <tr><td><strong>Greece: <a href="/universities/national-technical-university-of-athens">NTUA (Athens Polytechnic)</a></strong></td><td>QS Top 350 Engineering</td><td>Postgraduate Engineering, Maritime &amp; Energy Systems</td><td>EUR 3,000 &ndash; 5,500</td></tr>
    <tr><td><strong>Croatia: <a href="/universities/university-of-zagreb">University of Zagreb</a></strong></td><td>QS #615 &middot; Founded 1669</td><td>BSc/MSc Business &amp; Economics, Computing (FER), Engineering, Medicine</td><td>EUR 3,000 &ndash; 6,000 (Non-Med)</td></tr>
    <tr><td><strong>Croatia: <a href="/universities/university-of-split">University of Split</a></strong></td><td>Times Top 1000 &middot; Adriatic Hub</td><td>MSc Electronics &amp; Computer Eng, Chemical Tech, Medicine</td><td>EUR 3,000 &ndash; 5,500 (Non-Med)</td></tr>
    <tr><td><strong>Croatia: <a href="/universities/university-of-rijeka">University of Rijeka</a></strong></td><td>YUFE European Alliance Member</td><td>BSc/MSc International Business, Biotechnology, Discrete Math, ICT</td><td>EUR 2,500 &ndash; 5,000</td></tr>
  </tbody></table>
</aside>
<h2>1. Visa &amp; AZVO / e-Apostille Requirements from Bangladesh</h2>
<p>Both Greece and Croatia are contracting parties to the Hague Apostille Convention, meaning Bangladeshi academic certificates are authenticated via <a href="/document-attestation-apostille-bangladesh">MOFA Bangladesh e-Apostille</a>. Croatia also requires online academic recognition through the Croatian Agency for Science and Higher Education (AZVO/ENIC-NARIC). Review full guides: <a href="/greece-student-visa-bangladesh">Greece Student Visa</a>, <a href="/greece-study-cost-bangladesh">Greece Study Cost</a>, <a href="/croatia-student-visa-bangladesh">Croatia Student Visa</a>, and <a href="/croatia-study-cost-bangladesh">Croatia Study Cost</a>.</p>`
  }),

  // 15. Thailand Top Universities & Scholarships (Chulalongkorn, Mahidol, Thammasat, AIT)
  buildGuideSpec({
    slug: 'study-in-thailand-scholarships-chulalongkorn-mahidol-ait-bangladesh-2027',
    title: 'Study in Thailand from Bangladesh (2027): Chulalongkorn, Mahidol, Thammasat & AIT Scholarships, Tuition in BDT & Non-ED Visa Guide',
    metaTitle: 'Study in Thailand 2027: Chulalongkorn, Mahidol & AIT | EduExpress',
    metaDescription: 'Compare Thailand’s top 4 international universities for Bangladeshi students in 2027: Chulalongkorn, Mahidol, Thammasat & AIT scholarships, BDT fees & Dhaka Non-ED visa.',
    excerpt: '2027 guide to Thailand’s QS-ranked international programs and scholarships for Bangladeshi students: Chulalongkorn University, Mahidol University, Thammasat University & Asian Institute of Technology (AIT) fellowships, tuition in THB/BDT, and Non-Immigrant ED visa filing in Dhaka.',
    category: 'Asia',
    categories: ['Asia', 'Scholarships', 'Admissions', 'Costs'],
    tags: ['Study in Thailand from Bangladesh 2027', 'Chulalongkorn University scholarship bangladesh', 'Asian Institute of Technology AIT fellowship', 'Mahidol University international college', 'Thailand Non-ED student visa dhaka'],
    featuredImage: '/images/destinations/thailand-hero.webp',
    sourceUrls: ['https://www.chula.ac.th/en/', 'https://mahidol.ac.th/', 'https://tu.ac.th/en', 'https://ait.ac.th/'],
    content: `<p class="lede">Located just a 2.5-hour flight from Dhaka, Thailand is home to globally ranked ASEAN research universities offering <strong>100% English-taught International Programs (BBA, BEng, MSc, PhD) and full postgraduate fellowships</strong>—with fast <strong>Non-Immigrant ED Student Visa processing directly at the Royal Thai Embassy in Dhaka</strong>.</p>
<aside class="key-facts">
  <h2>4 Verified Thai Flagship Universities in the EduExpress Directory</h2>
  <table><tbody>
    <tr><th>University</th><th>Global Rank</th><th>Flagship Scholarships for Bangladeshi Students</th><th>Annual Tuition (THB / Est. BDT)</th></tr>
    <tr><td><strong><a href="/universities/chulalongkorn-university">Chulalongkorn University</a></strong> &middot; Bangkok</td><td>QS World #229 (#1 in Thailand)</td><td><strong>ASEAN &amp; Non-ASEAN Graduate Scholarship</strong> (100% Tuition + Airfare + THB 16,000/mo Stipend)</td><td>THB 170,000 &ndash; 280,000 / yr (~BDT 6.0 &ndash; 9.8 Lakh)</td></tr>
    <tr><td><strong><a href="/universities/mahidol-university">Mahidol University (MUIC)</a></strong> &middot; Salaya</td><td>QS World #368</td><td>Mahidol Postgraduate Scholarship (50%–100% Tuition Waiver for Master/PhD)</td><td>THB 150,000 &ndash; 250,000 / yr (~BDT 5.3 &ndash; 8.8 Lakh)</td></tr>
    <tr><td><strong><a href="/universities/thammasat-university">Thammasat University (SIIT)</a></strong> &middot; Rangsit</td><td>QS World #596</td><td><strong>SIIT Graduate Scholarship</strong> (100% Tuition + THB 10,000/mo Living Allowance for Engineering/IT)</td><td>THB 140,000 &ndash; 220,000 / yr (~BDT 4.9 &ndash; 7.7 Lakh)</td></tr>
    <tr><td><strong><a href="/universities/asian-institute-of-technology">Asian Institute of Technology (AIT)</a></strong> &middot; Pathum Thani</td><td>Intergovernmental Postgraduate Institute</td><td><strong>AIT Fellowships &amp; Royal Thai Gov Scholarships</strong> (25%–100% Credit Waivers for Bangladeshi Engineers)</td><td>THB 240,000 &ndash; 340,000 / yr before fellowship</td></tr>
  </tbody></table>
</aside>
<h2>1. Non-Immigrant ED Visa Processing in Dhaka</h2>
<p>Unlike European destinations that require New Delhi VFS travel, Thailand’s Non-Immigrant ED Visa is processed through the Royal Thai Embassy Dhaka / VFS Thailand in Dhaka within 2–3 weeks once your university Ministry letter is issued. Review full steps in our <a href="/thailand-student-visa-bangladesh">Thailand Student Visa Guide</a> and <a href="/thailand-study-cost-bangladesh">Thailand Study Cost Guide</a>.</p>`
  }),
];
