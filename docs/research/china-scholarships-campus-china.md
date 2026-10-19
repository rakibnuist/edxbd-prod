# Scholarship guide expansion

The requested Campus China scholarship index could not be read: web retrieval returned 502, the browser rendered an empty page, and its general overview URL returned 412. No authentication, challenge or security control was bypassed. An official Campus China application PDF was readable. The public guide therefore uses accessible CSC instructions, official republications credited to CSC, the Chinese Embassy in Bangladesh, UNESCO, and university scholarship publications. It does not claim a complete scrape of the inaccessible live catalogue.

Evidence and scoped numeric facts are stored in `data/research/china-scholarship-guide.json`. `src/data/chinaScholarshipGuide.ts` builds the public guide and reuses the preserved NUIST brochure records for all six Freshmen award classes. The original source cycles/statuses remain untouched. The public page is evergreen, with no maintenance dates, dated intake offers or public source links.

## Decisions

- Standard full CSC stipends are CNY 2,500/month Bachelor, CNY 3,000/month Master/general scholar and CNY 3,500/month PhD/senior scholar. Partial and other schemes are distinct.
- CNY 800/year and CNY 400 for programmes shorter than six months are policy insurance values, never additional cash stipends.
- Standard age boundaries are under 25/35/40/45/50 for Bachelor/Master/PhD/general/senior; university and scheme rules can add conditions.
- Type A/Type B are routes rather than funding percentages. No Bangladesh agency number was guessed.
- Great Wall nomination follows UNESCO; its own guide supersedes older general summaries that excluded degree routes. Regional EU/AUN/PIF citizenship restrictions are explicit. WMO programmes and NUIST-WMO fellowships are not treated as identical schemes.
- Generic guides disagree on minimum postgraduate study-plan length (800 vs 1000 words). The page directs applicants to their exact programme's requirement instead of inventing one universal number.
- Airfare is route-specific. The Embassy's historical Bangladesh award does not establish ongoing airfare coverage for every scholarship.
- Admission documents remain universal. Scholarship-specific forms/nomination are additional.
- Annual-review and uncovered-cost planning remain explicit. A university's CNY 2,500 PhD allowance is distinguished from the standard CNY 3,500 full CSC PhD stipend.

## Presentation and verification

The existing guide layout, canonical route, Apply CTA and related links remain. Specialist schemes use native expandable sections; their full text is in the initial HTML. Long contents navigation can scroll within the viewport. Eight FAQs use the same data in the page and JSON-LD.

The final production build completed successfully with all 198 static pages generated. Existing Browserslist and optional local HEIF-library warnings did not block compilation.

TypeScript, focused lint and eight guide-data tests passed. The local HTTP check passed the hub and all six guides, including every new disclosure, financial table, canonical and exact visible FAQ/schema match, plus both sitemaps and crawl permissions. One sitemap request timed out while the build was running; the complete rerun passed. Browser checks confirmed anchor navigation and the expanded EU Programme eligibility text. A local preview screenshot is saved at `/tmp/china-scholarships-expanded.png`. No application was submitted and no deployment or search-engine submission was performed.
