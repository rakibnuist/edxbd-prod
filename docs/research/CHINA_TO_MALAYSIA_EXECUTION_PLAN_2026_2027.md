# Sequential Execution Plan: China Data & SEO Parity → Malaysia Expansion (2026–2027)

**Prepared:** 14 November 2026  
**Governing Standards:** `.agents/skills/eduexpress-seo-strategy/SKILL.md`, `.agents/skills/eduexpress-china-seo/SKILL.md`, `.agents/skills/eduexpress-destination-pages/SKILL.md`  
**Research Basis:** `docs/research/CHINA_MARKET_COMPETITOR_RESEARCH_2026.md`, `data/research/china-database-inventory-2026-11-14.json`

---

## 1. Strategic Sequencing Principle

EduExpress will **not** dilute engineering or content bandwidth by launching Malaysia before China's data architecture, fee transparency, and SEO/Bengali parity are airtight. Malaysia is sequenced immediately after China reaches 100% database and parent-trust parity, serving as the first Wave 1 Southeast Asian expansion built on the exact same verified-data architecture.

```
[Phase 1: China Data Architecture] ──► [Phase 2: China SEO, Student File & /bn Parity]
                                                     │
                                                     ▼
[Phase 4: Malaysia SEO & Wave 1 Gate] ◄── [Phase 3: Malaysia Data & EMGS/BDT Architecture]
                                                     │
                                                     ▼
                              [Ongoing: Quarterly Plan Review & Freshness System]
```

---

## 2. Sequential Execution Plan

### Phase 1: China Data Architecture & Verification Parity (Weeks 1–4 | Nov–Dec 2026)
**Objective:** Eliminate every data gap in the 110-university China catalog so every public page, ClearCost Sheet, and AI-visibility block reads from complete, verified Prisma records.

| Workstream | Concrete Action | Target / Measurable Output | Owner |
|---|---|---|---|
| **1.1 Fee Backfill** | Populate itemized `Fee` rows (Application, Tuition, Hostel, Insurance, Residence Permit, Medical) for the **42 universities** currently missing `Fee` records | 110 / 110 China universities with itemized `Fee` rows | Data / Ops |
| **1.2 Scholarship Backfill** | Audit and enter verified `Scholarship` records (or explicit "Self-funded only") for the **39 universities** missing `Scholarship` records | 110 / 110 universities with verified funding status | Data / Counselors |
| **1.3 CostPlan & BDT Parity** | Populate `CostPlan` records (currently `0` in prod snapshot) pairing CNY amounts with BDT equivalents (`1 CNY ≈ 18.66 BDT` + FX buffer note) and separating EduExpress fee (`BDT 0` pre-visa / `BDT 200,000` post-visa) from third-party fees | Top 30 applied-to universities (NJTech, TYUT, HUT, NUIST, CPU, MBBS tier) have live `CostPlan` records | Developer + Data |
| **1.4 Consent & Trust Hygiene** | Record `consentVerified`, `consentEvidenceId`, and `consentDate` for the **7 testimonials** in admin; populate `TrustMetric` from audited CRM totals | 100% published testimonials carry valid consent IDs | Admin / Ops |
| **1.5 Technical Cleanup** | Fix `/updates/category/announcement` HTTP 500 route error; ensure `lastVerifiedAt` and `verificationExpiresAt` are set on all 110 China profiles | 0 HTTP 500s on `/updates/category/*`; 100% freshness timestamps | Developer |

---

### Phase 2: China SEO Parity, Parent Trust & Bengali Depth (Weeks 5–10 | Dec 2026–Jan 2027)
**Objective:** Hold China authority through the **March 2027** (deadline: 31 Jan 2027) and **September 2027** intakes while directly solving guardian financial and compliance pain points.

| Workstream | Concrete Action | Target URLs / Deliverables | Owner |
|---|---|---|---|
| **2.1 Bangladesh Bank Student File Guide** | Publish an authoritative, bank-ready **Student File & Remittance Guide** covering AD bank selection, FE Circular No. 37 education cards, TM Form, E-TIN/KYC, JW201/202, and CNY↔USD FX spread | Integrate into `/study-in-china-cost-bangladesh`, `/china-student-visa-bangladesh`, and `/for-parents` | Content / Counselors |
| **2.2 Bengali (`/bn/*`) Expansion** | Add `language` schema field (`en` / `bn`) + automated `hreflang` pairs; translate & human-review top 3 China money pages (Cost + Student File in BDT, X1/X2 Visa Process, Top-5 Universities Comparison) | `/bn/study-in-china` + 3 `/bn/*` supporting pages with `hreflang` | Translator + Developer |
| **2.3 Search Engine & Schema Parity** | Standardize clean FAQ, Breadcrumb and Course schema blocks across all 14 China URLs; keep `llms.txt`, `llms-full.txt`, and `pricing.md` synced to the 110-university catalog | 100% China cluster pages pass FAQ/Breadcrumb/Course schema validation | Developer + SEO |
| **2.4 B2B Partner Authority** | Upgrade `/partnership` with written Partner SOP, commission/payment-terms in writing, and downloadable Partner Process Pack (management-approved) | Live B2B partner page + CRM stage routing | Management + Dev |

---

### Phase 3: Malaysia Data Architecture & Compliance Setup (Weeks 11–16 | Feb–Mar 2027)
**Objective:** Build the same database-first, MYR+BDT transparency foundation for Malaysia before publishing any indexable Malaysia SEO cluster. *(1 MYR ≈ 26.5–27.5 BDT — verify live AD bank rate at launch).*

| Workstream | Concrete Action | Target / Measurable Output | Owner |
|---|---|---|---|
| **3.1 Currency & Config Refactor** | Update `src/lib/countries.ts` Malaysia `costs` from `USD` (`$3,500–$7,000`) to **MYR + BDT** equivalents with transparent exchange assumptions | Malaysia country config uses MYR + BDT (no USD-only estimates) | Developer |
| **3.2 Seed Verified Malaysia Catalog** | Add **10–15 verified Malaysian universities** into Prisma `University`, `Program`, `Fee`, and `Scholarship` tables across 3 tiers: Public (UM, UTM), Private (APU, Taylor's, Sunway, UCSI), Branch Campuses (Monash Malaysia, Nottingham Malaysia, Heriot-Watt Malaysia) | ≥10 universities, ≥40 programs, MQA accreditation links & `lastVerifiedAt` stored | Data / Malaysia Owner |
| **3.3 EMGS, eVAL & Student File Mapping** | Document exact Malaysia third-party fees in MYR + BDT: EMGS processing (`RM 1,500–1,800`), immigration eVAL/Student Pass (`RM 200–250`), compulsory medical insurance (`RM 500–800/yr`), post-arrival 7-day medical check, SEV via Malaysian High Commission Dhaka, plus AD bank Student File remittance steps | Approved Malaysia ClearCost template + SOP in CRM | Ops / Country Owner |
| **3.4 Malaysia Service Terms** | Define & get management approval for Malaysia service fee schedule, refund matrix, and responsibility boundaries (never reuse China's BDT 200,000 or China stats) | Signed-off Malaysia Fee & Refund Policy | Management |

---

### Phase 4: Malaysia SEO Cluster Launch & Wave 1 Gate (Weeks 17–24 | Apr–May 2027)
**Objective:** Pass all 8 mandatory **Country Launch Gate** criteria before flipping Malaysia from `Launching` (`noindex` on incomplete pages) to `Active`.

| Target URL | Primary Search Intent | Required Proof & Content Modules |
|---|---|---|
| `/study-in-malaysia-from-bangladesh` | Pillar: Study in Malaysia | 14-module Country PageKit: fit/reconsider, MQA recognition, MYR+BDT cost ranges, EMGS/VAL, intakes (Feb/Jun/Sep), China vs Malaysia comparison |
| `/malaysia-study-cost-bangladesh` | Cost of Studying in Malaysia | Foundation (`RM 10k–25k`), Public (`RM 7k–20k`), Private (`RM 25k–45k`), Branch (`RM 40k–70k`), living (`RM 1,500–2,500/mo`) in MYR & BDT + Student File guide |
| `/malaysia-student-visa-bangladesh` | Malaysia Student Pass & EMGS | Offer → EMGS portal → eVAL → SEV in Dhaka → 7-day post-arrival medical → iKAD; refusal risks & realistic work rules |
| `/malaysia-universities-bangladeshi-students` | Verified Shortlist | Live DB-backed directory filtered to Malaysia (Public vs Private vs UK/AU Branch campuses) |
| `/malaysia-scholarships-bangladesh` | Scholarships & Merit Waivers | MIS Scholarship, university merit waivers, renewal GPA conditions |
| `/malaysia-intakes-deadlines` | Intake Calendar | Dynamic `getIntakeStatus` engine for Feb, Jun/Jul, and Sep/Oct cycles |

**Mandatory 8-Point Launch Gate (All 8 Required Before Removing `noindex` / Starting Outreach):**
1. Named Malaysia country owner + trained backup counselor assigned.
2. ≥5 verified Malaysian institutions (target: 10–15) stored in Prisma with MQA links.
3. Official EMGS, eVAL, SEV, living funds, and work-right rules verified with source URLs.
4. Malaysia service scope, fee schedule, and refund policy approved by management.
5. Malaysia CRM pipeline stages, EMGS document checklist, and escalation SOP tested.
6. Pillar + ≥3–5 supporting guides human-reviewed and live.
7. Zero borrowed China statistics or unverified Malaysia testimonials.
8. Quarterly review owner and `verificationExpiresAt` configured in CMS.

---

## 3. Quarterly Plan Review & Governance System

To prevent stale intake dates, exchange-rate drift, and unverified claims, EduExpress will run a formal **Quarterly Plan Review** locked to both China and Malaysia academic calendars.

### 3.1 Annual Review Calendar

| Quarter | Review Date | Primary Intake Focus | Mandatory Audit Actions |
|---|---|---|---|
| **Q1** | **15 January** | China **March** closing + **September** early-bird; Malaysia **Feb/Jun** | Verify March intake closures; update CNY/MYR → BDT exchange rates; audit `<90-day` expiring university records; review Q4 EFA→Admit conversion |
| **Q2** | **15 April** | China **September** peak + CSC/Provincial deadlines; Malaysia **Jun/Sep** | Audit Malaysia Wave 1 Launch Gate readiness; refresh CSC/provincial deadlines; review `/bn/*` traffic & guardian lead quality |
| **Q3** | **15 July** | China **September** visa/pre-departure + **March 2028** prep; Malaysia **Sep** | Archive expired `IntakeCampaign` posts (`expiresAt`); collect consented arrival stories from March/Sep cohorts; review AI-referral traffic |
| **Q4** | **15 October** | Annual Transparency Audit + **March 2028** launch | Publish Annual Transparency Update (audited CRM funnel counts, no PII); full 110+ university fee/scholarship verification sweep; set next year's Wave 2 gate |

### 3.2 Quarterly Review Scorecard & Escalation Triggers

Every quarterly review evaluates **5 hard metrics**; any red flag triggers an immediate 7-day remediation sprint:

1. **Data Freshness Gate:** % of active universities with `lastVerifiedAt < 90 days` (Target: **100%**; Escalation if `<90%`).
2. **BDT Exchange & Fee Accuracy:** Variance between CMS BDT estimates and live Bangladesh AD Bank TT/OD selling rates (Escalation if FX drift exceeds **±5%**).
3. **SEO & AI-Visibility Health:** Organic impressions/clicks on China 14-URL cluster + Malaysia cluster, `/updates` indexation, `0` 404/500 errors, and monthly spot-check of ChatGPT/Gemini/Perplexity citations.
4. **Funnel & Parent Trust Conversion:** EFA start → completion rate (Target: **≥40%**), ClearCost Sheet issuance rate, and Application → Admitted ratio.
5. **Compliance & Consent Audit:** 100% of published testimonials carry valid `consentEvidenceId`; 0 unattributed "guaranteed" claims across site copy and ads.

### 3.3 Review Ownership

- **Chair:** Managing Director / Strategy Lead (approves fee policies, destination status changes, and Wave launches).
- **Data & Country Owners (China / Malaysia):** Verify university fees, EMGS/CSC/embassy notices, and `verificationExpiresAt` dates.
- **Content & SEO Lead:** Audits page parity, `/bn/*` translations, FAQ/schema alignment, and AI-visibility blocks.
- **Developer:** Maintains CMS expiry alerts, currency helpers, `llms-full.txt` / sitemap accuracy, and GA4/Meta CAPI conversion tracking.
