# NUIST brochure content reconciliation

Internal research record. Do not serve this file or source/review metadata on the public university profile.

The owner supplied the official 2026 admission brochure as a local 20-page PDF. The PDF has outlined/image text, so the content was read from full-page Poppler renders. Physical PDF pages 7–11 contain the catalogue, 12 the restricted 3+2 route, 13 eligibility, 14–15 scholarships, 16 fees, 17 documents, 18 the 31 May 2026 application deadline, and 19 CSCA. An independent agent cross-checked all 68 programme-level rows on physical pages 10–11, including school labels and bilingual stars.

## Content model

- 74 standard bachelor majors, 47 master majors and 27 unique doctoral majors from the brochure.
- One separately named English International Economy and Trade 3+2 transfer option. The brochure allows the Chinese 3+2 route across its Chinese bachelor catalogue; this is retained as a note rather than 74 duplicate table rows.
- Six non-degree language-study tracks from the official 2026 International Chinese Language Teachers Scholarship notice.
- Total: 155 study options. A catalogue entry does not mean applications are currently open.
- Programmes marked with a star in the Chinese-medium table also have an English option. Its footnote makes all doctoral programmes available in English. Major + level duplicates between schools are merged, retaining both school names.
- Degree-level tuition in the brochure is CNY 15,000, 20,000 and 25,000 per year for Bachelor, Master and PhD, respectively. No different bilingual tuition is stated.
- Chinese-only programme durations are left for confirmation when the brochure does not explicitly provide them. English Bachelor is four years; English Master is two years. The 2026 doctoral heading says three years or above, while the official 2027 notice says four years or above; the profile preserves the historical cycle and makes that distinction visible.

## Scholarships

The shared structured scholarship type carries coverage, conditions, renewal, documents, application steps, cycle/status, optional stipend, tuition reduction and explicit housing/insurance waivers. Its restriction fields support levels, languages, exact major names and exact programme IDs. The public loader whitelists those fields and strips internal sources, paths and maintenance data.

The NUIST profile contains 21 options: six Excellent Freshmen award tiers; CSC High-Level Postgraduate, Bilateral and Silk Road; two degree-specific CSC-WMO options; three degree-specific CLEC options; three registered-student merit award names; two MOFCOM programmes; and two degree-specific NUIST-WMO fellowships.

CLEC restrictions use exact programme IDs to avoid granting the Master International Chinese Language Education scholarship to the separate Master Chinese Language and Literature major. WMO Master lists are restricted to Meteorology and Applied Meteorology. The 2026 Silk Road nationality list excludes Bangladesh and is stated explicitly. Registered-student awards do not have invented monetary values. Stipends are benefit descriptions, not an automatic subtraction from up-front fees.

The 2026 university-scholarship/self-funded degree deadline was 31 May 2026; these entries are historical and closed. The official CLEC notice lists March 2027 study but has an inconsistent March 2026 date in its deadline sentence, so no open deadline is asserted. An undated recurring scholarship call uses “confirm” rather than implying an open window.

## Source conflicts and import

The supplied 2026 brochure takes precedence for its twin-room rate of CNY 2,500–3,000/year and HSK4 210+ Bachelor entry rule. Undated HTML has conflicting room and HSK values. The exact conflict and all source URLs/page locators are stored in `data/research/nuist-programme-details.json` and the internal CMS campaign.

Import with `node scripts/import-xjtu-brochures.mjs --input data/research/nuist-programme-details.json --apply`. It backs up the previous records, merges only the NUIST profile, reconciles its programme listing and scholarship rows, and keeps the institution under verification. Existing unrelated university data are preserved. Repeated import reuses matching IDs rather than duplicating programme rows. The Jiangsu Provincial Department of Education’s institution registry is recorded as institutional recognition evidence, without inventing a human editorial approval.
