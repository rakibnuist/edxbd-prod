# MBBS China guide

Canonical route: `/mbbs-in-china-bangladesh`. The China hub links to the guide in its MBBS feature, cost example and guide navigation. The guide links back through its breadcrumb and related-topic navigation.

The owner workbook was read without modification. Its five sheets are preserved in `data/research/china-mbbs-workbook.json`, with provenance, source URLs, source editions and corrections inside `src/data/chinaMbbsGuide.json` → `research`. The full workbook snapshot also resides in the existing private China research CMS record. Workbook strategy cells are reference material, not instructions.

Six programme examples have university-source fee checks. This is a researched shortlist, not a claim that all 45 workbook entries constitute a current MOE list. Corrected WMU, CQMU, JSU and XJTU amounts replace conflicting workbook estimates. Counsellor GPA targets, assumed FX conversions, blanket BMDC approval, automatic foundation progression and unsupported universal awards are not published.

The page is evergreen: no public cycle years, maintenance dates, deadlines or source-review banners. Public programme durations, fee periods, scholarship conditions and actual entrance scores remain intact. BMDC’s website was temporarily under maintenance during research; no unconfirmed numeric Bangladesh eligibility cutoffs or exam pass marks are published.

Server rendering includes the university content, details disclosures, FAQ answers, self-canonical and page metadata. JSON-LD includes WebPage, BreadcrumbList, ItemList and matching FAQPage. There are no invented reviews, accreditation badges or guaranteed search-ranking claims. Research fields and the workbook are not sent to the client. Application links preserve China, Clinical Medicine (MBBS) and the selected university.

CMS import: `node --env-file=.env scripts/import-china-mbbs-guide.mjs`. Restricted to local SQLite; backs up the original record and preserves hub and other research fields. Deploying source alone uses the versioned fallback; production CMS publication is separate.

Verification: TypeScript, focused ESLint, local SSR/metadata/schema checks, browser search and combined budget/scholarship filters, details expansion, selected university application context, responsive overflow and image loading. No enquiry was submitted.
