# China hub and focused guide architecture

The existing China destination URL stays the main hub. Detailed admission, funding, cost, visa, language and student-life guidance has a dedicated page with its own search intent. The hub provides a short decision path and ordinary HTML links to the full guides.

| Preferred URL | Main search intent | Content responsibility |
| --- | --- | --- |
| `/study-in-china-from-bangladesh` | Study in China from Bangladesh | Concise overview, study-level planner, topic navigation, university discovery and application support |
| `/china-admission-requirements` | China university admission requirements | Study-level qualifications, academic documents, language evidence, CSCA, preparation and application steps |
| `/china-scholarships-bangladesh` | China scholarships for Bangladeshi students | CSC, provincial and university funding, coverage, eligibility, renewal and uncovered costs |
| `/study-in-china-cost-bangladesh` | Cost of studying in China from Bangladesh | Separate before-China and in-China costs, exact billing periods, uncovered charges and currency assumptions |
| `/china-student-visa-bangladesh` | China student visa from Bangladesh | X1/X2 study categories, supporting evidence, financial evidence and arrival/residence preparation |
| `/study-in-china-without-ielts` | Study in China without IELTS / MOI | University-specific accepted evidence, MOI limits, Chinese-taught study and CSCA distinctions |
| `/life-in-china-bangladeshi-students` | Student life in China | Accommodation, food, payment methods, language, local registration and work-permission boundaries |

The established `/china-visa-first-policy`, `/china-universities`, `/mbbs-in-china-bangladesh` and governed intake pages keep their distinct purposes. No second admissions URL with a `-bangladesh` suffix is created.

## Rendering and metadata ownership

`chinaGuidePages` stores the shared guide content and `chinaGuideMetadata` creates its absolute search title, description, self-canonical and social metadata. The static cost, visa, MOI, student-life and admissions route wrappers use that same data and template. Scholarships retain their existing dynamic `[slug]` route. The static-route catalog prevents those static URLs from also being pre-rendered by the dynamic route.

Every canonical uses `https://eduexpressint.com` and the existing clean path. Brand text appears once in the search title. The guide template returns the full body, links, FAQs and JSON-LD in initial HTML; its contents and FAQ disclosures do not require JavaScript to read. Each guide uses one WebPage and breadcrumb graph. FAQ markup takes the same question/answer array rendered on the page, so schema does not add invisible answers or duplicate FAQ graphs.

Internal research retains source records and maintenance dates. The public guide presentation omits source links, file paths, maintenance labels and historical admission-cycle messaging. This does not establish that a later admission cycle is open, create a scholarship guarantee, or change an institution's published conditions. No author, human reviewer or fresh review date is invented. New admissions sitemap entries omit `lastmod` because no review date has been recorded for that page.

## Discovery and sitemaps

The admissions URL is registered in `staticRouteGuides`, appears once in the main sitemap and appears once in `/sitemaps/guides.xml`. The guides sitemap chooses dates from the actual route owner, not an unused record with the same slug. `robots.txt` advertises the guide sitemap and does not disallow these public guide URLs or required CSS/JavaScript.

The directory and university verification gates are unchanged. A university profile that lacks required verification remains `noindex` and stays out of university sitemaps, even when a guide links to the directory. Adding a source-backed guide does not constitute human approval of every university record.

## Earlier in-page links

An anchor fragment is processed by the browser; it is not sent to the HTTP server. It cannot be handled by a server-side 301. Useful older hub anchors are retained as nearby topic destinations where possible, with a crawlable link to the full guide.

| Earlier hub anchor | Focused destination |
| --- | --- |
| `#china-study-guide` | Compact guide navigation on the China hub |
| `#china-eligibility`, `#china-preparation` | `/china-admission-requirements` |
| `#china-language` | `/study-in-china-without-ielts` and the admissions guide for CSCA |
| `#china-funding` | `/china-scholarships-bangladesh` |
| `#china-fee-examples`, `#china-total-cost` | `/study-in-china-cost-bangladesh`, with university-specific fees on profiles |
| `#china-visa-route` | `/china-student-visa-bangladesh` |
| `#china-student-life` | `/life-in-china-bangladeshi-students` |
| `#china-recognition` | Admissions guidance; medical recognition remains in the MBBS guide |
| `#china-research-faq` | Short hub FAQ and the focused guide FAQs |
| `#china-fit-form` | Compact application-support CTA, linking to `/apply?country=China` |

## Language equivalence

The current Bengali page is a shorter landing page with dated text and an English assessment form. It lacks reciprocal language alternates and does not fully translate the rebuilt English hub. The English hub therefore does not declare it as an equivalent `hreflang` page. Keep the Bengali URL's self-canonical; add reciprocal `en`/`bn` alternates only after a complete, reviewed translation exists. Its scholarship/MOI claims need a separate editorial correction before it is treated as an equivalent guide.

## Repeatable validation

Offline checks:

```sh
node --experimental-strip-types --test scripts/test-china-guides.mjs
```

Read-only rendered-page checks against a running local server:

```sh
node --experimental-strip-types scripts/check-china-guide-pages.mjs --base-url http://127.0.0.1:3000
```

The rendered check covers HTTP status, canonical host/path, unique titles/descriptions, a single H1, substantive SSR body, every supplied section/table fact, hub and peer links, application CTA, exact FAQ schema/visible-answer agreement, source-record privacy, sitemap registration and crawl permissions. It performs GET requests only and does not submit forms or URLs to a search engine.

Validation completed locally: all six offline guide checks passed. The rendered crawl passed for the China hub and all six focused guides, including four readable FAQ answers per page and matching FAQ markup. Both main and guide sitemaps listed every topic once, and robots discovery checks passed. Focused lint passed. Local preview noindex headers, where configured, are treated as staging protection rather than removed; the check still verifies that the page metadata does not accidentally block its production canonical.

These checks establish implementation readiness locally. They do not verify production deployment, Search Console/Bing ownership, actual indexing, field Core Web Vitals, or search rankings. Production host redirects, canonical responses, live sitemaps, crawl logs and search-engine reports need to be checked on the deployed site. Rankings cannot be guaranteed by titles, schema or keyword matching.

## Search-engine guidance checked

Google recommends consistent canonical URLs in HTML, internal links and sitemaps; a sitemap alone is a weaker canonical signal. This implementation checks that those signals agree. [Google Search Central canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

Google has retired the FAQ rich-result feature. Accurate FAQPage markup is retained as semantic data matching readable answers; it is not presented as eligibility for a Google FAQ rich result or a ranking improvement. [Google Search Central feature-removal notice](https://developers.google.com/search/updates#removing-faq-rich-result)

Bing documents sitemaps as a discovery mechanism and supports referencing them in robots.txt. The local checks confirm both sitemap availability and that reference, without submitting anything. [Bing sitemap documentation](https://www2.bing.com/webmasters/help/sitemaps-3b5cf6ed)
