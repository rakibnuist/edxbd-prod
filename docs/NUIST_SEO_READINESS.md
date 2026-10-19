# NUIST search and publication readiness

Internal developer/editor handover. Do not publish this record as university page copy.

## Search implementation

The single preferred address remains `https://eduexpressint.com/universities/nuist`. Existing legacy URLs redirect to the canonical profile; no duplicate keyword landing pages were added.

The page title is `NUIST: Fees, Scholarships & Programs | EduExpress International`. The description contains the full recorded university name, its acronym, Nanjing/China and the relevant content topics. The full official name is not replaced by an invented short name. Other universities use the same naming rule and their own recorded aliases.

`WebPage`, `CollegeOrUniversity`, `Course` and `BreadcrumbList` markup uses the same university and programme catalogue as the page. EduExpress is the page publisher and the university is the course provider. The graph contains no invented scholarship award, guaranteed discount, open intake, review score or scholarship-based tuition offer. Historical brochure dates are contextual information, not a claim that applications are open. Internal sources and maintenance timestamps are excluded.

The expanded profile catalogue drives course markup, replacing the old limit of four legacy CMS programme rows for NUIST. All course names represented by schema must remain available in the server-rendered programme tables. A control may hide a table from the current view; it must not defer fetching its catalogue until a user clicks. Prominent summaries of majors, scholarship routes, fees and published ranking scopes should remain outside the tab panels.

Metadata, semantic markup and headings clarify the subject of the page. They do not guarantee a Google ranking or a particular result title/snippet. The local preview is not the deployed public URL.

## Primary institutional evidence retrieved

The Jiangsu Provincial Department of Education's [2026 regular higher-education institution list](https://jyt.jiangsu.gov.cn/art/2026/3/5/art_77627_10220590.html) was retrieved and read on 19 October 2026. Under Nanjing → undergraduate institutions → provincial institutions, it lists **南京信息工程大学** and links to **www.nuist.edu.cn**. This supports the institution's identity and listing as a provincial undergraduate higher-education institution.

Suitable internal recognition fields:

- `recognitionAuthority`: `Jiangsu Provincial Department of Education`
- `recognitionSourceUrl`: `https://jyt.jiangsu.gov.cn/art/2026/3/5/art_77627_10220590.html`

This is institutional evidence. It does not establish Bangladesh-specific degree recognition or regulated professional licensing for every programme. The source-check date belongs in the internal evidence record; it is not a university-wide education/compliance approval date.

The Ministry of Education national list and first-round Double First-Class pages were located but direct retrieval timed out. A CHSI 2026 approved statute appeared in search results, but direct retrieval exposed only a form. Neither failed fetch was represented as completed verification.

## Exact remaining release gates

Run the current read-only audit from the project root:

```sh
node --experimental-strip-types scripts/audit-university-seo-readiness.mjs nuist
```

It reports the actual status, internal evidence fields, structured catalogue size, old CMS programme statuses and every full CMS verification blocker. It never changes data. The runtime indexation gate and the stricter CMS verification validator are unchanged.

At the start of this update the NUIST record was `under_verification`: five official source links were present, but institutional recognition evidence, university-level verification/expiry dates and active CMS programmes were absent. The four existing CMS programmes were `planned`. Brochure catalogue import alone does not resolve these approval fields.

The concrete publication path is:

1. Save the retrieved Jiangsu institutional evidence internally, retaining the source-check record. Do not expose editorial dates or source links in the public university profile.
2. Finish reconciliation of the supplied 2026 brochure and newer official programme/scholarship notices. Preserve cycle-specific fees, conditions, deadlines and closed cycles. Record the exact programme, language, duration and official source in CMS programme records; only mark a programme active when its continuing availability is actually evidenced. A closed application cycle must not become “Apply now”.
3. Have the responsible education reviewer confirm institution/programme fit, requirements, recognition limits and student costs, and have the responsible compliance reviewer confirm scholarship conditions and commercial fees. Record that real decision internally; no named reviewer or completed review may be invented by the importer.
4. On an approved decision, set the truthful university-level `lastVerifiedAt`, a deliberate future `verificationExpiresAt` and `verificationStatus: verified`. Run `universityVerificationErrors` against the full candidate before saving. It must return no errors, including official sources for every fee, active scholarship and active programme. Do not publish unsupported legacy cost plans.
5. Deploy the final content to the canonical public host, then verify a `200` page with self-canonical, `index, follow`, crawlable programme/scholarship content and inclusion in the university XML sitemap. The sitemap already excludes unverified or expired records.
6. Use Search Console URL Inspection/Rich Results Test after deployment and request indexing if authorised account access is available. Check the live public page rather than treating a local preview as indexed.

Until the decision in step 4, `noindex, follow` is intentional. It is impossible to truthfully say the profile can rank in Google while that rule remains. Recognition research is now one concrete step closer; the remaining review decision is explicit and reviewable.

## Validation

`node --experimental-strip-types --test scripts/test-university-profile-seo.mjs` covers genuine aliases, full-name descriptions, canonical URLs, all catalogue levels, duplicate course handling, publisher identity, breadcrumb parity and preservation of indexing/expiry gates. Page-level SSR checks should also compare each catalogue programme's name to an actual HTML table row, rather than only finding it in serialized browser data.

Authoritative implementation references: [Google title links](https://developers.google.com/search/docs/appearance/title-link), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [robots metadata](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag). Google documents that titles are generated automatically, visible content and accurate markup matter, and `noindex` prevents indexing.
