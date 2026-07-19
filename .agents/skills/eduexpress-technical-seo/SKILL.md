---
name: eduexpress-technical-seo
description: Technical SEO repair and developer acceptance skill for eduexpressint.com (EduExpress International). Use this skill whenever working on EduExpress site infrastructure — SSR/SSG, canonicals, title tags, redirects, sitemaps, robots.txt, Core Web Vitals, structured data/schema, the eduexpress.info old-domain consolidation, university deduplication, or any developer task, code review, launch QA, or acceptance testing for the EduExpress website. Also use when someone mentions doubled titles, duplicate universities, stale intake dates, or indexing problems on EduExpress properties.
---

# EduExpress Technical SEO Repair Plan

Implements Section 6 (technical repair) and Section 19 (developer acceptance) of the Evidence-First SEO Plan. Canonical host: **https://eduexpressint.com**.

## P0 tasks — complete BEFORE any new-country SEO

Work through every row; each has a hard definition of done.

| # | Task | Implementation | Definition of done |
|---|---|---|---|
| 1 | SSR/SSG | Return all main content, metadata, links, structured data in initial HTML for updates, university and destination pages | curl/view-source contains H1, body, links, title, description, canonical |
| 2 | Canonical repair | Each indexable page self-canonicals to the preferred eduexpressint.com URL | Crawl shows one valid canonical, 200 response, no homepage canonicals on inner pages |
| 3 | Title-template repair | Append "\| EduExpress International" once only | No doubled brand titles in full crawl or Search Console samples |
| 4 | Old-domain consolidation | Audit eduexpress.info, remove risky claims ("100% VISA", work-study), 301 each useful URL to matching main-site page; otherwise 410 | No duplicate indexable brand domain; redirects one hop |
| 5 | University deduplication | Unique IDs, merge duplicate institutions, redirect old slugs | No duplicate institution names/slugs; redirect map approved |
| 6 | Intake/deadline status | Automatic Open/Closing/Closed/Next Intake/Under Verification logic | Expired deadlines can never show "Apply Now" |
| 7 | Claim source system | Move statistics and guarantees into centrally governed CMS fields | No hard-coded conflicting claims |
| 8 | Privacy and consent | Form consent, privacy links, retention rules, sensitive-document handling | Every form stores consent timestamp + policy version |
| 9 | NAP/entity correction | One exact business name, address, phone, hours on site and profiles | Footer/contact/schema/GBP/LinkedIn match character-for-character |
| 10 | Analytics baseline | GA4, GSC, Bing Webmaster, GBP, CRM conversion tracking | Test events and source attribution recorded |

## P1 tasks — structure and performance

- [ ] Separate XML sitemaps: pages, countries, universities, guides, success stories; exclude noindex/redirects/duplicates/expired thin pages
- [ ] robots.txt with sitemap location; never block essential CSS/JS; llms.txt optional experiment only (not a ranking guarantee)
- [ ] One host (www or non-www), HTTPS, one trailing-slash policy, no redirect chains
- [ ] Clean breadcrumbs + crawlable HTML links; no indexable combinations of every directory filter
- [ ] Self-hosted compressed images: WebP/AVIF, responsive srcset, descriptive filenames, real alt text
- [ ] Mobile Core Web Vitals: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75
- [ ] True 404/410 responses, helpful 404 page, automated broken-link monitoring
- [ ] Update timestamps, author/reviewer profiles, source records on education/visa pages
- [ ] hreflang ONLY after complete English/Bengali equivalents exist; never point partial translations at each other
- [ ] Internal search results noindex,follow; control pagination and parameter URLs

## Schema implementation rules

| Page | Schema |
|---|---|
| Homepage / contact | Organization + LocalBusiness in one @graph; PostalAddress, phone, URL, logo, sameAs, opening hours, geo where verified |
| Country/service pages | WebPage, BreadcrumbList; FAQPage only with complete visible current answers |
| Guides/updates | Article with author, reviewer (if visible in content), datePublished, dateModified, in-page citations |
| University profiles | WebPage + CollegeOrUniversity as subject; EduExpress clearly the publisher, not the university |
| Success stories | Article; consent metadata private; never expose passport/visa numbers |
| Directory | CollectionPage + ItemList for visible set; no fake product/review markup |
| **Never add** | Self-serving aggregateRating/review markup for EduExpress — Google does not show stars for self-reviews |

## Launch acceptance — launch MUST FAIL if any of these is true

- [ ] Critical pages missing full content in initial HTML
- [ ] Inner pages canonicalize to homepage or wrong host
- [ ] Doubled titles or duplicate site names remain
- [ ] eduexpress.info or staging domains indexable with competing content
- [ ] Expired deadlines show open/apply status
- [ ] Any unscoped guarantee or unsupported partner/success claim remains
- [ ] Forms lack consent, privacy link, or secure processing
- [ ] Duplicate universities without documented merge/redirect plan
- [ ] Analytics events untested or CRM attribution missing
- [ ] NAP differs across footer, contact, schema, GBP

## Handover package (developer must deliver all)

Architecture/deployment docs; CMS field dictionary + verification workflow; URL inventory, redirect map, canonical rules; schema templates + Rich Results test evidence; analytics event dictionary + GA4/GTM notes; robots/sitemap/indexation policy; image and performance standards; security/backup/privacy/document-retention docs; editor manual (countries, universities, programs, fees, intakes, success stories); automated tests for titles, canonicals, status codes, broken links, required content fields; 30-day post-launch bug-fix and monitoring period.

## How to verify (practical checks)

- `curl -s <url> | grep -E '<h1|canonical|og:title'` — confirms SSR
- Crawl with Screaming Frog or similar: export titles (check doubles), canonicals, status codes
- Rich Results Test on each schema template before rollout
- Test one expired intake in staging: page must flip to Closed automatically
