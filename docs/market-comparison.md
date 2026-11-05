# Bangladesh Education-Consultancy Market vs EduExpress International

**Basis:** Production database snapshot + full CRM snapshot from the EduExpress VPS (srv1774770), transferred via rsync and md5-verified end-to-end (`c29d2c40…` prod, `80ac337c…` CRM). SQLite integrity check passed on both. Read-only analysis; the snapshot files stay gitignored. No client-identifiable rows are quoted — totals and aggregates only.

**Snapshot date:** October 2026

---

## 1. What EduExpress actually owns (production data)

| Asset | Count | Why it matters against the market |
|---|---|---|
| Universities | **110** | Deep single-destination catalogue (China) |
| Programs | **594** | Program-level fee/eligibility records, not brochures |
| Fee records | **398** | Per-program published fees — the ClearCost foundation |
| Scholarships | **162** | Named funding routes with exact values |
| Partnerships | **12** | Direct institutional relationships |
| Published content | **18** | Destination guides + intake updates + visa guides |
| Testimonials | **7** | Real students, real universities (consent fields present, see §4) |
| Leads (main site DB) | **123** | Site-side funnel records |
| Leads (CRM) | **354** | Full pipeline with source tagging |
| Contacts (CRM) | **706** | Multi-channel (inbox, WhatsApp, Messenger, ads) |

**Market comparison.** Competitor sites in Dhaka typically publish: a handful of destination logos, "free counselling", unverified "guaranteed admission" language (our competitor digests found this claim class on multiple sites), and program fees kept off the page until inquiry. EduExpress's 594 program rows with 398 fee records and 162 scholarship value records is a **catalogue-first** position that almost nobody in the local segment competes on. The directory is built to win "university + city + fee + intake + ranking" long-tail head queries: every card carries fee, all intake months, scholarship value, and publisher-verified ranking (56/56 universities now hold 318 verified THE/QS/ShanghaiRanking records).

## 2. The real funnel (CRM + site DB)

**Site DB (123 leads).** Steady 1–5/month through 2025-11 → 2026-08, then **87 in October 2026** — consistent with the university-directory relaunch driving discovery.

**CRM (354 leads, 706 contacts):**

| Stage | Count | Conversion |
|---|---|---|
| New Lead | 293 | — |
| File Opened | 27 | 7.6% of all leads |
| Applications in system | 169 | 47.7% of all leads |
| Applications submitted | 36 | 10.2% of all leads; 21.3% of applications |
| **Admitted** | **16** | 9% of leads; **44% of applications submitted or beyond** |
| Not interested / no response | 18 | — |

Applied-to universities concentrate on scholarship-engineering campuses (NJTech ×15, TYUT ×12, HUT ×11, XZIT ×9, NJIT ×8, AHNU ×8…) — the same universities featured on the directory cards. The marketing story and the CRM story match: students arrive for **scholarship-driven engineering/tech admissions**.

**Document operations:** 1,712 document records per 169 applications — the intake checklists track HSC/SSC certificates + marksheets, passport, SOP, CV, bank statement, police clearance, medical check-up, MOI certificate. Currently 1,705 pending / 5 received / 1 verified / 1 rejected — the checklist system was deployed and is at the start of its lifecycle.

**Honest caveats:**
- 294 of 354 CRM leads have no `destination` recorded, and virtually no consultant assignment — routing/triage is underused, so the funnel numbers describe the market demand, not consultant productivity.
- 338 CRM leads cluster in July 2026 (bulk import/contact upload); the month-steady site leads (§ above) are the organic signal.
- Only 2 applications carry `submitted_on`; most submission tracking is date-less. CRM data hygiene needs a pass before these numbers are ever used in public claim sentences — these aggregates are for internal strategy, not for the website.

## 3. Where this beats the market (and where it doesn't)

**Wins we can open confidently:**
1. **Catalogue depth with sources** — program fees, exact scholarship values ("Top scholarship: CNY 20,000 / year"), ownership badges, publisher-only rankings. Competitor claim-digests repeatedly surface "admission guaranteed", visa-success percentages with no source, and mixed-currency fee comparisons — none of which can appear on eduexpressint.com by governance rule.
2. **All intake months on every card.** The local market sells "March intake!" hype; we show the full calendar so students choose.
3. **Consent-first testimonials** — the schema tracks consentVerified / consentEvidenceId / expiry, matching our transparency reports. Most competitors pile up unattributed WhatsApp screenshots.

**Gaps to close before publishing any number:**
- **Testimonial consent evidence is empty on all 7 records** even though they are published. The fields exist and are red-letter governance debt: collect the consent asset IDs via the admin panel, or gate publication on `consentVerified` exactly as the repo's own `restore-testimonials.js` rule requires.
- CRM lead-source tags are inconsistent ("Inbox" 279 vs named channels) — fixed attribution would let us quote real source mix.
- `TrustMetric` table is empty in prod; the trust counters the site wants must be filled from this CRM analysis, not invented.

## 4. Recommended next actions

1. **Admin-panel consent pass** on the 7 testimonials (evidence ID + recorded date + image approval), keeping the published badge honest.
2. **Backfill CRM `destination` and `assigned_consultant`** for the 294 un-routed leads so future monthly reports can show productivity, not just demand.
3. **Publish the aggregate funnel to the transparency page** as counts with the year, no PII ("16 admits across 36 submitted applications in our records") — this is the EUR/Education-Fit funnel story competitors cannot copy because they have no governed CRM.
4. **Use the applied-university concentration (NJTech/TYUT/HUT…)** to set directory card priorities and hero slots for the engineering-scholarship segment.
5. Keep the market-comparison report refreshed after each quarterly snapshot; totals drift as CSV/RSync imports grow.
