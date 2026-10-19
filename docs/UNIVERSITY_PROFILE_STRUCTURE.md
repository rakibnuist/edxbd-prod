# University profile structure

The shared profile template presents university identity and compact facts, with Location, World Ranking, Scholarships and Majors as the main highlights. The information tabs are Overview, Programs & majors, Scholarships, Fees & ClearCost, Entry requirements, Documents required and Rankings. Degree categories are Bachelor, Master, PhD, Language, Foundation and Diploma. An empty category describes missing program information rather than claiming that the university does not offer that level. Program/major, medium and search filters intersect within the selected degree category.

The selected program drives tuition, billing period, eligibility, language requirements, documents, scholarship information and calculator prefills. All information panels are rendered in the initial response; tab controls reveal one at a time. The evergreen public projection removes deadlines, intake/cycle labels, calendar years and dated provenance. Ranking publisher, position and scope remain visible without edition years. Original source chronology and statuses remain internal and are never changed to imply that applications are open.

Admission documents are a separate universal section for both self-funded and scholarship applicants, grouped by the actual supplied requirements. Scholarship-specific route documents remain with their award. Header, sidebar, document and calculator CTAs use “Apply with EduExpress International” and link to `/apply` with university, program and country context. This reuses the existing consented lead form without submitting any test leads.

The refreshed Overview uses positive, sourced academic strengths and real campus photography when available. NUIST's campus asset is extracted from the owner-supplied brochure; no campus image or university-specific strength is fabricated for other profiles.

## Program data

`UniversityProgramDetail` in `src/types/university-profile.ts` is the public contract. `university-profile-details` in the local CMS stores structured examples for Xi'an Jiaotong University, Hubei University of Education, Wenzhou University and NUIST: 186 study options across four profiles, including 155 NUIST options. Other institutions use their existing program and fee records through `src/lib/university-profile-view.ts`.

Source files and extraction notes remain under `data/research/` and internal campaign fields. The public loader explicitly whitelists student-facing fields. Brochure-derived scholarships replace legacy scholarship display for the corresponding detailed profiles. Wenzhou's conflicting legacy scholarship record has also been reconciled to its closed 2026 admission cycle.

Import examples:

```sh
node scripts/import-xjtu-brochures.mjs --input data/research/xjtu-2027-programmes.json --apply
node scripts/import-xjtu-brochures.mjs --input data/research/hubei-wenzhou-programmes.json --apply
node scripts/import-xjtu-brochures.mjs --input data/research/nuist-programme-details.json --apply
node scripts/import-university-rankings.mjs --apply
```

Imports are local SQLite only, save recovery snapshots, and merge university identities without replacing unrelated profiles. NUIST's complete catalogue reconciliation replaces its small legacy listing with the brochure catalogue while preserving closed-cycle context and the verification hold. Wenzhou's optional scholarship reconciliation is explicitly scoped to Wenzhou.

## ClearCost

- Before China: application fee, optional deposit, EduExpress Package.
- In China: tuition balance after entered reduction and any credited deposit, accommodation, insurance, medical examination, residence permit, optional other costs.
- Unknown charges stay blank. Optional fee alternatives and room choices are not silently summed or selected. Ranges and usage rates are not numeric prefills.
- Semester and full-program fees are used once. Daily or monthly housing requires an explicit duration.
- Deposit credit is capped at the tuition balance; an excess does not imply a refund. The combined estimate sums both payment stages.
- Selecting a package fills its published price and original currency automatically. Mixed currencies remain separate until the student enters an exchange rate; the BDT package is included once. Quote-only packages never inherit a previous price.
- Scholarship scenarios apply explicit tuition reductions and stated accommodation/insurance waivers. Stipends are shown as benefits and are not subtracted from up-front cash. A full tuition waiver can make net tuition zero while the unknown gross tuition remains blank.
- The calculator dropdown contains every listed scholarship plus a self-funded option. Selecting an award chooses a compatible program when one is present. Awards without a published numeric value clear any earlier deduction instead of inventing a discount. Coverage, conditions and renewal rules stay accessible within the calculator.
- Fee conditions remain accessible beside the amount. An editable exchange rate enables optional BDT conversion. Printing produces the student's entered cost breakdown.

Verification commands:

```sh
npx tsc --noEmit
node --experimental-strip-types scripts/test-clear-cost.mjs
node --experimental-strip-types --test src/lib/university-directory.test.mjs
npm run build
```

Browser checks covered program-level switching, program-specific documents/qualifications, exact foundation and language billing periods, the two-stage calculator and credited deposits. Sample calculation: application 500 + deposit 3,000 + package 2,000 = 5,500 before China; tuition balance 12,000 + accommodation 4,000 + insurance 600 + medical 526 + residence 400 = 17,526 in China; combined 23,026 CNY.


The complete NUIST brochure structure has 75 Bachelor options (74 regular majors and one restricted English 3+2 transfer route), 47 Master, 27 PhD and six Language options, plus 21 scholarship options and award tiers. Catalogue tables for every degree level and all scholarship cards are present in the initial HTML. Conditions, documents, renewal and application steps remain available in expandable sections. Program names in the catalogue open the selected program's admission details directly.

Source reconciliation is documented in `docs/research/nuist-brochure-content.md`; search metadata and actual indexation release gates are in `docs/NUIST_SEO_READINESS.md`. The runtime indexation predicate remains intact. Actual source-check records are internal; an education/compliance approval has not been fabricated.

Additional verification:

```sh
node --experimental-strip-types --test scripts/test-university-profile-seo.mjs scripts/test-university-scholarships.mjs
node scripts/check-nuist-profile-html.mjs
node --experimental-strip-types scripts/audit-university-seo-readiness.mjs nuist
```

The HTML check verified all 155 programs and 21 scholarship cards, plus 155 Course schema records. Sharing repeated checklists/fee arrays reduced the development HTML response from 1,576,516 to 887,593 bytes while preserving every programme and award. Browser calculations checked a 50% Bachelor reduction (CNY 7,500 tuition payable), automatic BDT 200,000 package inclusion, and full CSC tuition/accommodation/insurance coverage. The test exchange rate of 17.5 BDT/CNY was entered manually and is not a market-rate claim.
