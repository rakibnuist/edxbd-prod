# Study in China SEO, Entity Cleanup, Off-Page Backlinks & Deploy Playbook

Runbook for deploying and executing **EduExpress International**'s organic acquisition, Bangladesh–China authority, local Dhanmondi entity trust, and AI search citation strategy after all pre-deploy code gates pass.

Every operational claim and outreach asset below links directly to live verified endpoints in this repository. Never insert unverified statistics, exchange-rate guesses, or guaranteed admission/visa/scholarship claims into external outreach.

---

## 1. Pre-Deploy Build & Quality Gates

Run these checks before cutting a release build:

```bash
npm run lint -- --quiet
npx tsc --noEmit
npm run build
npm run seo:audit
node --test src/lib/*.test.mjs
node --experimental-strip-types scripts/test-china-guides.mjs
node --experimental-strip-types scripts/test-content-html.mjs
node --experimental-strip-types scripts/test-security-hardening.mjs
node --experimental-strip-types scripts/test-university-profile-public.mjs
npm run db:check
```

### Production Env Vars for Search & Analytics
Confirm these environment variables are set on the deployment host (see `.env.example` and `src/app/layout.tsx`):
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — emits Google Search Console HTML meta tag verification
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` — emits `msvalidate.01` verification for Bing Webmaster Tools (supports Bing & ChatGPT Search discovery)
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` / GTM ID — receives consent-gated conversion events (`assessment_start`, `assessment_submit`, `compare_started`, `compare_completed`, `cost_sheet_downloaded`, `university_view`, `success_story_view`, `whatsapp_click`, `phone_click`, `appointment_booked`)

---

## 2. Day-0 Post-Deploy Smoke Checks & Search Indexing

Once deployed on `https://eduexpressint.com`, verify live `200` responses (and single-hop `301` from `https://www.eduexpressint.com/*` to apex):
1. `https://eduexpressint.com/robots.txt`
2. `https://eduexpressint.com/sitemap.xml` and all 5 sub-sitemaps:
   - `/sitemaps/pages.xml`
   - `/sitemaps/countries.xml`
   - `/sitemaps/guides.xml` (18 English + Bengali China/Malaysia topic guides)
   - `/sitemaps/universities.xml`
   - `/sitemaps/success-stories.xml`
3. AI & data endpoints: `/llms.txt`, `/llms-full.txt`, `/pricing.md`, `/china-study-report.json`, and `/9303d37873c94ab5a25637e6d1ad9ece.txt` (IndexNow verification key).

### Search Console, Bing Webmaster & IndexNow Ping
- **Google Search Console (`https://eduexpressint.com`):** Submit `sitemap.xml` plus all 5 sub-sitemaps (`/sitemaps/*.xml`). Request indexing directly on priority English & Bengali URLs:
  - `/study-in-china-from-bangladesh` & `/bn/study-in-china`
  - `/china-study-report-bangladesh`
  - `/education-consultant-dhaka`
  - `/csc-scholarship-bangladesh` & `/bn/csc-scholarship-bangladesh`
  - `/china-student-visa-bangladesh` & `/bn/china-student-visa-bangladesh`
  - `/study-in-china-cost-bangladesh` & `/bn/study-in-china-cost-bangladesh`
  - `/mbbs-in-china-bangladesh` & `/bn/mbbs-in-china-bangladesh`
  - `/china-visa-first-policy`
- **Bing Webmaster Tools:** Verify domain with `msvalidate.01` or DNS TXT, import/submit all 6 sitemaps.
- **IndexNow API Trigger:** Signed in as an admin, call `POST https://eduexpressint.com/api/indexnow` with JSON body `{"action":"submit-all"}` to ping IndexNow across all flagship routes.

---

## 3. Canonical NAP, Google Business Profile & Entity Disambiguation

Use this character-for-character NAP across Google Business Profile, LinkedIn, Facebook, Bing Places, Apple Business Connect, and local directories (single source in `src/lib/office-record.ts`):

- **Business Name:** `EduExpress International` (do not stuff city/keywords into GBP name)
- **Address:** `Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209`
- **Phones:** `+880 1983-333566 / +880 1329-663505`
- **Hours:** `Saturday to Thursday, 11:00 AM to 6:00 PM` (Friday closed)
- **Website:** `https://eduexpressint.com`
- **Email:** `info@eduexpressint.com`

### Mandatory Entity Cleanup Actions
1. **Google Business Profile (GBP):**
   - Primary category: `Educational consultant`
   - Description grounded in evidence-first guidance, China admissions expertise, written ClearCost schedules, and Dhaka counseling (zero "guaranteed visa" claims).
   - Upload `20+` authentic Dhanmondi office/team/student-sendoff photos (never showing passports, visa stickers, or DOBs), publish `2` posts/week linking active intake or policy guides, and request genuine non-incentivized reviews after real counseling/offer milestones.
2. **LinkedIn Company Cleanup:**
   - Change industry from `Staffing and Recruiting` to Education / Higher Education Services.
   - Change headquarters from Wuxi, China to Dhanmondi, Dhaka, Bangladesh (`https://eduexpressint.com`) with historical note on 2019 China operations in the bio.
3. **UK Brand Separation (`EduExpress Ltd.`):**
   - Keep explicit disambiguation visible on `/about`, `/education-consultant-dhaka`, `/llms.txt`, and Organization schema noting EduExpress International (Dhaka, Bangladesh) is unaffiliated with UK-registered `EduExpress Ltd.`.
4. **Legacy Domain (`eduexpress.info`):**
   - Audit every path under `eduexpress.info`; remove `"100% VISA"` and work-study claims; configure 1-hop `301` redirects to the corresponding `https://eduexpressint.com/...` pages (or `410` where no equivalent exists).

---

## 4. Off-Page Backlinks & Digital PR Outreach Templates

Always pull live counts (`universityCount`, `programCounts`, tuition quartiles) from `https://eduexpressint.com/china-study-report.json` at the time of outreach rather than quoting static numbers from memory.

### Template A — Chinese University International Admissions Offices (Backlink Priority 1)
*Use ONLY for verified partner/authorized universities or when requesting official record verification.*

> **Subject:** Official Bangladesh Information Verification & Representative Listing — [University Name]
>
> Dear International Admissions Team at [University Name],
>
> We maintain a structured public admissions profile for Bangladeshi applicants considering [University Name] (`https://eduexpressint.com/universities/[slug]`), referencing your official published tuition, scholarship, and intake notices (`https://eduexpressint.com/how-we-verify-universities`).
>
> Could your office kindly review the listed annual tuition in CNY, language requirements (IELTS/MOI/CSCA where applicable), and active intake window so our record remains accurate for Bangladeshi students?
>
> [Where a formal authorization agreement is active:] In addition, since EduExpress International (Dhanmondi, Dhaka) serves as an authorized recruitment representative for [University Name], could we request listing `https://eduexpressint.com` under your official Bangladesh / International Representatives directory?
>
> Best regards,  
> EduExpress International — Institutional Verification Desk  
> Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209  
> info@eduexpressint.com | +880 1983-333566 | https://eduexpressint.com/partnership#institutional-cooperation

### Template B — Education Journalists & Researchers (Backlink Priority 2 & 4)
> **Subject:** Open Bangladesh–China Study Cost Benchmark & Regulatory Resource (Live JSON + Report)
>
> Hi [Name],
>
> For upcoming coverage on Bangladeshi students applying to Chinese universities (engineering, computer science, MBBS/BMDC rules, or CSC scholarships), we have published an open, zero-signup study benchmark aggregating official programme fee schedules across our active China catalogue:
>
> - Interactive Report: https://eduexpressint.com/china-study-report-bangladesh
> - Machine-Readable JSON Dataset: https://eduexpressint.com/china-study-report.json
>
> Unlike marketing averages, tuition quartiles on the report include only records stating one explicit annual CNY fee alongside verified non-tuition arrival charges and primary regulatory links (CSC, Campuschina, MOE China, MoFA Bangladesh attestation, Chinese Embassy in Dhaka, and BMDC).
>
> One-click citation and contact details for verification comments are directly on the page. Happy to share commentary on CSC/CSCA changes or transparent fee verification whenever helpful.
>
> Best regards,  
> Abdullah Al Rakib / Editorial & Verification Desk  
> EduExpress International, Dhanmondi, Dhaka  
> info@eduexpressint.com | +880 1983-333566

### Template C — Bangladeshi Colleges, Student Clubs & Career Desks (Backlink Priority 3)
> **Subject:** Free Cost-Literacy & China/CSC Scholarship Seminar for HSC Students — [College / Club Name]
>
> Dear [Principal / Career Advisor / Club Coordinator],
>
> EduExpress International (Dhanmondi, Dhaka since 2018) offers non-promotional academic briefing sessions for HSC students and families interested in Chinese engineering, science, and medical degrees—covering realistic CNY budgets (`https://eduexpressint.com/china-study-report-bangladesh`), CSC Type A vs. Type B requirements (`https://eduexpressint.com/csc-scholarship-bangladesh`), X1/X2 visa & MoFA attestation steps, and BMDC verification for MBBS applicants (`https://eduexpressint.com/mbbs-in-china-bangladesh`).
>
> Our sessions contain zero guaranteed-visa claims and provide students with written comparison sheets (`https://eduexpressint.com/compare-costs`). If your career desk publishes a seminar schedule page, we would be grateful to be listed with `https://eduexpressint.com/education-consultant-dhaka` for student preparation resources.
>
> Warm regards,  
> EduExpress International — School & Seminar Desk  
> https://eduexpressint.com/partnership#institutional-cooperation

### Strictly Prohibited Tactics (Do Not Execute)
- No forum/blog-comment spam, bulk bookmark/Web-2.0 packages, paid dofollow disguised as editorial, or fake "top consultancy" lists.
- Never claim "authorized partner" status without an active written agreement on file (`university-governance` / CMS relationship record).
- Never buy, gate, or incentivize Google Business Profile reviews, and never publish student passport/visa/DOB details.

---

## 5. Monthly AI Search & SEO Monitoring Protocol

Log results monthly under identical Dhaka/Bangladesh vs. logged-out conditions across **Google Search Console**, **Bing Webmaster Tools**, **GA4**, **ChatGPT (Search)**, **Gemini**, and **Perplexity**:
1. *"best China study abroad consultancy in Dhanmondi Dhaka"*
2. *"study in China cost in CNY and BDT for Bangladeshi students"*
3. *"CSC scholarship Type A vs Type B from Bangladesh"*
4. *"China MBBS BMDC recognition and tuition fees for Bangladeshi students"*
5. *"Is EduExpress International Bangladesh connected to UK EduExpress Ltd?"*

Record: cited URLs, brand attribution accuracy, Dhanmondi NAP match, non-branded GSC clicks, top landing guides (`EN` + `BN`), `assessment_submit` + `compare_completed` conversion rates, and genuine GBP review growth.
