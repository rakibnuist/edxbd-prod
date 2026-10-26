# eduexpressint.com — Full Site Audit
**Date:** 26 October 2026
**Scope:** Entire webapp — all public pages, admin console, API routes, data-driven routes, content and runtime behaviour.
**Audited:** local working copy (`/home/rakib/Desktop/WebApp/edxbd-prod`), dev server on :3000, production build on :3200, plus source review.

**Method:** crawled every static route, all 101 sitemap URLs, 82 unique internal links, all 56 university profiles, all 12 destination pages, all 15 update posts; HTTP-probed every API route and redirect; browser session captured console errors, failed requests and computed styles on key pages; source review of auth, forms, metadata, sitemap, robots and content files.

**Limitation:** the shell tool stopped returning output mid-session, so `tsc --noEmit`, `eslint` and `next build` could not be run in this session. Everything else below was verified against the running app. The dev server (:3000) also dropped twice under crawl load while the prod build (:3200) stayed up; retry if you reproduce.

---

## Scorecard

| Area | Verdict |
|---|---|
| Routing / navigation | ✅ Healthy — no broken internal links, redirects work, custom 404 is good |
| Public page availability | ✅ All pages return 200; all 101 sitemap URLs resolve |
| University directory | ✅ 56 records / 250 programs, all profiles 200 with correct canonicals; 21 intentionally noindex |
| Forms / lead capture | ✅ Contracts match; consent, honeypot, rate limits and duplicate suppression present |
| Admin auth & API security | ✅ Good — bcrypt, JWT secret enforced, httpOnly cookies, role checks, rate limits |
| Metadata / SEO | ⚠️ Mostly good; missing OG image, doubled title, generic OG on 7 pages, keywords meta, orphans |
| Blog rendering | 🔴 Broken — post bodies are full HTML documents with global CSS that overrides the site shell |
| Content freshness | ⚠️ Expired March 2026 “admissions open” posts still featured/indexable; some inconsistent claims |
| Accessibility | ✅ Largely fixed (12px floor, contrast floor, focus ring, reduced motion); minor H1 gaps |
| Security posture | ✅ Major July findings fixed; one public analytics leak remains |

---

## P0 — Fix first

### 1. Blog posts inject full HTML documents and global CSS into the page
**Where:** `src/app/updates/[slug]/UpdateClient.tsx:117` (`dangerouslySetInnerHTML`), content stored in the `Content` table.

**Evidence (all 15 published posts):**
- 7/15 contain `<!DOCTYPE html>`, `<html>` and `<body>` — nested inside the site’s own document.
- 15/15 contain their own `<h1>`, so every post renders **two H1s** (page title + content title).
- 15/15 contain a `<style>` block with `:root` custom-property overrides.
- 14/15 contain a `* { … }` reset; 6/15 contain `body { … }` overrides.

**Observed damage (computed styles in a real browser):**
- `/updates/complete-csc-universities-list-2026`: body font becomes Roboto, body background `#f4f7f9`, text `#34495e`, `--primary-color` becomes `#2980b9`, and the fixed site header becomes `position: static` (the header scrolls away / loses its fixed behaviour).
- `/updates/zzu-march-2026-admissions-open`: body font becomes **Times New Roman**, `body` gets an 8px margin, and the site `<header>` is no longer found in the rendered document.

**Impact:** every blog/guide page (15 URLs, all in the sitemap) renders with broken branding and site chrome. The `*` resets can break buttons/forms; the duplicate H1 hurts semantics; the full-document nesting is invalid HTML and fragile across browsers.

**Fix:**
1. Strip `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` wrappers and `<style>` blocks when importing/saving post content (or run a sanitizer on read).
2. Scope any retained article CSS under the article container, or render it in a shadow root/iframe.
3. Remove the content’s own `<h1>` (the page already renders the title H1).
4. Add a regression test: post HTML must not contain `<!DOCTYPE`, `<html`, `<body`, `<style`, or `<h1`.

---

## P1 — High

### 2. `/og-image.jpg` does not exist — every social/AI share image is broken
`src/app/layout.tsx:99` sets `https://eduexpressint.com/og-image.jpg` as the default OG/Twitter image; the Organization schema (`layout.tsx:163`) and blog `BlogPosting.image` also point to it. `GET /og-image.jpg` returns **404**, and no `og-image*` file exists in `public/`.
**Impact:** blank previews on Facebook/WhatsApp/LinkedIn/X, weaker AI-search citations, broken `Organization.image`.
**Fix:** add a 1200×630 `public/og-image.jpg` (branded, with text), then spot-check the OG debuggers.

### 3. `GET /api/analytics/performance` is public and leaks lead intelligence
`src/app/api/analytics/performance/route.ts:4` has no auth check. Unauthenticated response included:
```json
{"summary":{"totalLeads":87,"totalConversions":0,...},"topCountries":[...],"topSources":[...],"statusBreakdown":{...},"dailyTrends":{...}}
```
**Impact:** anyone can read lead volume, source mix, destination demand and conversion status. No PII, but commercially sensitive and inconsistent with the otherwise strict admin API.
**Fix:** add the same `verifyTokenFromRequest` + admin-role gate used by `/api/admin/*` (or delete the orphan endpoint — no code in `src/` references it).

### 4. `/llms.txt` returns 500 in development (conflicting file + route)
Both `public/llms.txt` and `src/app/llms.txt/route.ts` exist. Next throws `A conflicting public file and page file was found for /llms.txt`. In production the public file wins (200 `text/plain`), so the app route is dead code.
**Fix:** delete `src/app/llms.txt/route.ts` (the public file is the better, canonical version), or merge the route’s destination list into the public file and delete the public file. Do not keep both.

### 5. Thirty-four pages have no crawlable inbound link
From a crawl of the 12 main hub/nav pages:
- **25 university profiles** have no inbound link in the server-rendered HTML (only 12 of 56 cards render; “View 12 more” is a `<button>` that rewrites `?limit=24` client-side — `src/app/universities/UniversitiesClient.tsx:144`). Crawlers cannot follow it.
- **6 update posts** and `/updates/category/news` are unreachable from the hub: pagination is also a client-side button (`src/app/updates/UpdatesClient.tsx:171–174`), and the hub only renders 9 of 15 posts.
- `/education-consultant-dhaka` — the local-SEO landing page — is not in the header, footer or any hub (only the sitemap).
- `/country-status` — only discoverable via sitemap/`llms.txt`.

**Impact:** weak internal link equity to 25 university profiles plus 9 other URLs; slower indexing; the local landing page gets no site-wide link.
**Fix:** render “load more” as real `<a href="/universities?limit=24">` links (or server-side pagination); add `/education-consultant-dhaka` to the footer or “How We Help” menu; add news/pagination links.

### 6. `/education-consultant-dhaka` title is doubled
Rendered: `Education Consultant in Dhanmondi, Dhaka | EduExpress International | EduExpress International`.
Cause: the page title already contains the brand (`src/app/education-consultant-dhaka/page.tsx:7`) and the layout template appends it again (`src/app/layout.tsx:31`). Other pages use `absolute` or omit the brand.
**Fix:** use `title: { absolute: ... }` or drop the brand from the page title.

---

## P2 — Medium

### 7. Expired March 2026 “admissions open” content
Nine university-announcement posts are still featured/indexable:
- Titles advertise “March 2026 Admissions”, “2026 Intake”, “Admissions Open”.
- `publishedAt` for the nine is **2024-01-15** (backdated), while the hub displays dates such as “Mar 10, 2026”.
- Today is 26 Oct 2026; those intakes are over. The hub shows no “expired” marker; only post pages older than 365 days get the stale-intake box.
**Impact:** misleading urgency, contradicts the evidence-first brand, and stale pages compete with the 2027 pages.
**Fix:** archive/expire the March 2026 posts (noindex or 410/redirect to the 2027 equivalents), correct the publication dates, and show an explicit “This intake has closed” banner on any kept archive. Also fix the mixed date formats on the hub (`Dec 30, 2025` vs `January 6, 2026`).

### 8. Destination data has contradictory / unsourced claims
- **Malta page** says “the UK offers a **2-year** Graduate post-study work visa” (`src/lib/countries.ts:858`), while the **UK page** correctly says 2 years only for applications on/before 31 Dec 2026, **18 months from January 2027** (`countries.ts:338`). Malta contradicts UK.
- “China offers **more full-ride scholarships** and cheaper living” (`countries.ts:346`) is an unsourced comparative absolute — the kind of claim the governance standard bans. It is visible on the UK page. (`countries.ts:182` also contains a “China costs 70% less” line; it is not currently rendered on the pages tested, but should still be rewritten/removed at source.)
- Every country has the same `lastVerifiedDate: 'July 2026'` (12 occurrences) and the destination template hardcodes `dateModified: '2026-07-19'`; three months old and clearly templated.
- `/partnership` says “**ten** active destinations”; the site actually operates **12** (China + 11), and `llms.txt`/`find-education` say 12.

**Fix:** correct Malta’s UK sentence, replace the comparative claims with sourced, dated statements, refresh verification dates per country, and make the destination count one source of truth.

### 9. Social metadata gaps
- **7 pages** inherit the generic OG title `EduExpress International | Evidence First Education Consultancy` instead of their own: `/for-parents`, `/scholarships`, `/your-study-journey`, `/find-education`, `/proof-library`, `/fees-and-transparency`, `/universities`.
- **Meta keywords** are still emitted by the layout (`layout.tsx:34`, 30 terms) and 9 pages (about, contact, services, privacy, terms, destinations, updates, partnership). Google ignores it; competitors can read positioning. Prior audit asked for removal.
- Blog `og:description` can contain raw HTML: `/updates/china-k-visa` emits escaped `<section><style>…` because there is no excerpt and the code falls back to `content.substring(0,160)` (`updates/[slug]/page.tsx:92`).
- Short descriptions: `/success-stories` (92 chars), `/china-success-stories` (90) — acceptable but thin.

### 10. No bilingual signals for the Bengali page
`/bn/study-in-china` exists and is healthy, but:
- no `hreflang` alternates on either the Bengali or English China pillar;
- no link to `/bn/study-in-china` in the header, footer, or China menu (confirmed in `LightHeader.tsx:44–52` and `Footer.tsx`).

**Impact:** the Bengali audience has no visible entry point and search engines cannot associate the two language versions.

### 11. Homepage “Full Scholarship Support Package” naming
The package is called “Full Scholarship Support Package” (`page.tsx:336`). It is a *support* package, but the name reads like a scholarship guarantee — the exact ambiguity the rest of the site works hard to avoid. Consider “China Scholarship Application Package” or add a one-line clarifier next to the label.

### 12. Public health endpoint reveals environment detail
`/api/health` returns DB readiness and `envCheck` flags (`jwtSecret: true`, etc.). Low sensitivity, but it is an unauthenticated operational endpoint; consider trimming to `{status:"ok"}` or protecting it.

---

## P3 — Low / polish

- **Login page has no `<h1>`** (verified in browser); admin shell pages also have 0 H1 because the guard replaces content. Add an H1 to `/login`.
- `src/app/admin/users/page.tsx:49` hardcodes `currentUser?.email === 'admin@eduexpressint.com'` as a UI permission fallback (the API is still protected). Remove the email special-case.
- `/sitemaps/pages.xml` hardcodes `lastmod: 2026-08-24` for every URL and omits some pages that `sitemap.xml` includes (`/partnership`, China guides). Inconsistent but harmless.
- `src/app/updates/[slug]/page.tsx` uses `content.substring(0,160)` for descriptions — strip tags first.
- `sitemap-submission` page is correctly noindexed; `public/sitemap-submission.html` also exists as a static duplicate. Remove the duplicate.
- `metadata.keywords` on the partnership page is a single comma string while others are arrays; harmless.
- No `<hreflang>` and no canonical on admin/login (correct, since they are noindex).

---

## Page-by-page results

### Core public pages
| Route | HTTP | Title/Canonical | Notes |
|---|---|---|---|
| `/` | 200 | ✅ unique / self | Strong rewrite: real photos, plain language, cost transparency |
| `/about` | 200 | ✅ | Keywords meta still present |
| `/contact` | 200 | ✅ | Form + NAP from office record; good |
| `/services` | 200 | ✅ | Title 97 chars, may truncate |
| `/apply` | 200 | ✅ | Prefill works (`?university=` echoed) |
| `/for-parents` | 200 | ✅ | Generic OG title |
| `/scholarships` | 200 | ✅ | Generic OG title |
| `/success-stories` | 200 | ✅ | Description only 92 chars |
| `/your-study-journey` | 200 | ✅ | Generic OG title |
| `/find-education` | 200 | ✅ | Generic OG title; says 12 destinations |
| `/education-fit-assessment` | 200 | ✅ | Multi-step form contract matches API |
| `/partnership` | 200 | ✅ | Says “ten” destinations (actual 12) |
| `/proof-library` | 200 | ✅ | Generic OG title |
| `/fees-and-transparency` | 200 | ✅ | Package data from DB (consistent) |
| `/education-consultant-dhaka` | 200 | ⚠️ doubled title | Orphaned from nav |
| `/destinations` | 200 | ✅ | Clean evidence-first copy; 12 destinations |
| `/universities` | 200 | ✅ | 56 universities / 250 programs; generic OG; only 12 crawlable cards |
| `/updates` | 200 | ✅ | 9 of 15 posts visible; client-only pagination |
| `/privacy`, `/terms` | 200 | ✅ | Keywords meta |
| `/better-education-standard`, `/china-visa-first-policy`, `/compare-study-destinations`, `/complaints-and-resolution`, `/how-we-verify-universities`, `/student-data-privacy`, `/country-status` | 200 | ✅ | Evidence pages resolve via `[slug]`; `/country-status` orphan |
| `/sitemap-submission` | 200 | ✅ noindex | Static duplicate in `public/` |

### China cluster (13 English + 1 Bengali)
All 200, self-canonical, one H1, correct internal links:
`/study-in-china-from-bangladesh`, `/china-universities`, `/china-scholarships-bangladesh`, `/csc-scholarship-bangladesh`, `/china-student-visa-bangladesh`, `/china-admission-requirements`, `/china-intakes-deadlines`, `/china-march-2027-intake`, `/china-success-stories`, `/study-in-china-cost-bangladesh`, `/study-in-china-without-ielts`, `/mbbs-in-china-bangladesh`, `/life-in-china-bangladeshi-students`, `/bn/study-in-china`.

- Intake status is computed dynamically (`lib/china-intakes.ts`), verified 26 Oct 2026, and correctly treats March 2027 as open / September 2027 as next.
- CSC page’s “100% tuition covered for the entire degree duration” is broadly true for CSC but ignores the annual review/renewal condition; consider adding “subject to annual review”.
- No unsourced percentages found in the China data files; the March 2027 campaign attributes tiers to “the supplied sheet”.

### Destination pages (12 via rewrite `/study-in-:country-from-bangladesh` → `/destinations/:country`)
All 200. `/destinations/united-kingdom` and `/destinations/netherlands` redirect correctly. Issues: Malta/UK contradiction, unsourced China comparisons, uniform July 2026 verification dates (above).

### University profiles (56)
- All 56 return 200, correct canonical and one H1.
- 35 are in the sitemap; 21 are `noindex` by governance (insufficient verified data) — consistent with the sitemap.
- No duplicate records found (names/aliases checked).
- `/universities/[slug]/clear-cost` renders the calculator (4 inputs, PDF path present).

### Updates (15 posts)
- All 200; RSS has 15 items; category archives work (`/updates/category/announcement`, `/university`, `/news`); invalid category → 404.
- **Every post has the P0 rendering/CSS/H1 problem above.**
- 9 posts are expired March 2026 admissions; dates on cards are mixed formats.
- Data hygiene: categories contain both `Announcement` and `announcements` (normalized to `announcement` for archives — not user-visible, but clean the source).

### Admin (12 pages)
`/admin`, `/admin/leads`, `/content`, `/testimonials`, `/universities` (+new/[id]), `/evidence`, `/teams`, `/trust`, `/partnerships`, `/countries`, `/users`, `/settings`.
- Unauthenticated `/admin/leads` redirects to `/login` (verified in browser).
- `X-Robots-Tag: noindex, nofollow, noarchive` applied to admin/login (verified).
- No client console errors on the login/admin shell.
- API data is protected independently of the UI.

---

## Functional test results

| Test | Result |
|---|---|
| Crawl of all static routes (57 page files) | ✅ No 5xx; only `/llms.txt` (dev) fails |
| 101 sitemap URLs | ✅ All 200, zero redirects |
| 82 unique internal links from 39 pages | ✅ Zero broken |
| Redirects (`/home`, `/dashboard*`, `/success-stories/china`, `/complaints-and-review`, `/destinations/united-kingdom`, `/destinations/netherlands`) | ✅ Fire correctly (verified `redirected: true`) |
| Unknown route | ✅ Custom 404 with recovery links, `noindex` |
| Form APIs (`/api/leads`, `/api/contact`, `/api/partnership`) | ✅ 400 on missing required fields; consent enforced; honeypot; rate limits |
| Legacy dangerous endpoints (`/api/init-db`, `/api/setup/admin`, `/api/init-updates`, `/api/conversion`) | ✅ 410 “disabled” |
| Admin APIs without cookie | ✅ 403 (`leads`, `dashboard`, `users`, `upload`, `indexnow`, `meta-status`) |
| `/api/auth/me` unauthenticated | ✅ 401 |
| `/api/auth/logout` | ✅ Clears `admin_session` (HttpOnly, SameSite=strict) |
| University filter/search (`?country=`, `?search=`) | ✅ Filtered SSR; no-match state works |
| Browser console + network on 8 key pages | ✅ No errors, no failed requests, no horizontal overflow at 1000px |
| `tsc` / `eslint` / `next build` | ⚠️ Not run — shell unavailable this session |

---

## Security review

**Fixed since the July 2026 audit (verified):**
- No hardcoded `admin123`; login uses bcrypt only (`api/auth/login/route.ts:51–60`).
- JWT fallback removed in production; app throws if `JWT_SECRET` is missing/short (`lib/auth.ts:6–13`).
- `admin_session` is HttpOnly, `SameSite=strict`, `Secure` in production, 8h expiry.
- Login rate-limited to 5 attempts / 15 min per client.
- `verifyToken` normalizes `super_admin` → `admin` at the authorization boundary; privileged-role creation/update/deletion requires `super_admin`.
- Admin routes check auth on **every** exported method (GET/POST/PUT/DELETE) — sampled all 18 route files.
- Public forms rate-limited (10/hour), with honeypot (`companyWebsite`) and 5-minute duplicate suppression.
- `.env` / `*.db` ignored; no DB file tracked; `.env.example` documents required secrets.
- Structured data and `X-Robots-Tag` applied correctly.

**Remaining:**
- Public `/api/analytics/performance` (P1).
- `/api/health` exposes env/DB readiness (P3).
- Hardcoded admin email UI fallback (`admin/users/page.tsx:49`, P3).
- No `middleware.ts`; admin **pages** are client-guarded, but all data/actions are server-protected, so this is acceptable.

---

## Content governance

**Good:**
- No “guaranteed visa/scholarship”, “easy visa”, “100% scholarship” sales copy found on public pages; the few uses are explicitly negative (“No scholarship guarantee”, “Support is not a guarantee”).
- CSC, MBBS, cost and visa pages are specific, sourced and plain-language.
- Intake calendar is one source of truth and date-verified.
- NAP is consistent (`lib/office-record.ts`): +8801983333566 / +8801329663505, info@eduexpressint.com, Dhanmondi address; header/footer/contact draw from it.
- University pages carry verification status and source records.

**Needs work:**
- Expired March 2026 posts (above).
- Malta/UK PSW contradiction, the unsourced “more full-ride scholarships” comparison, and the unused “70% less” line in the data source.
- Uniform July 2026 verification dates.
- “ten active destinations” vs 12.
- No Bengali entry point / hreflang.
- “Full Scholarship Support Package” naming.
- `content.substring` descriptions can leak HTML into meta tags.

---

## Technical SEO

| Item | Status |
|---|---|
| Canonicals | ✅ Self-referencing on every public page; query variants of `/universities` correctly noindex |
| Sitemaps | ✅ 98 URLs in `sitemap.xml` + 5 sub-sitemaps (101 union); all resolve; `robots.txt` points at apex |
| Robots | ✅ Apex domain, private paths disallowed, AI crawlers explicitly allowed |
| Redirects | ✅ 308/307 working (www→apex, legacy dashboard, merged slugs, UK alias) |
| 404 | ✅ Custom, useful, noindex |
| Structured data | ✅ Organization/LocalBusiness, WebSite, Service, FAQ, BlogPosting, Breadcrumb, CollectionPage; invalid nesting caused by blog content is the exception |
| OG/Twitter image | ❌ `/og-image.jpg` 404 (P1) |
| OG titles | ⚠️ Generic on 7 pages |
| Meta keywords | ⚠️ Still on 9 pages + layout |
| hreflang | ❌ Missing for Bengali page |
| Orphans | ❌ 34 URLs from the 12-page crawl (25 university profiles, 6 posts, 2 hubs) |

---

## Accessibility & performance

**Fixed/verified:**
- Global 12px minimum for `text-[9px]/[10px]/[11px]` and a contrast floor for `text-white/40–60` in `globals.css` (added 26 Oct 2026).
- Visible `:focus-visible` outline (with a cyan variant on navy surfaces).
- `prefers-reduced-motion` handling in two places.
- Skip-to-content link, `main` landmark, labelled forms, `aria-describedby` errors, `role="status"` success states.
- All `next/image` usages have `alt`; hero images use `sizes`; responsive images are in place.
- No horizontal overflow at 1000px; no console errors.

**Remaining:**
- Blog posts override body typography/contrast/margins (P0) — this can undo the 12px/contrast work on those pages.
- `/login` and admin shell lack an H1.
- Many decorative labels still use 10–11px classes; the CSS floor makes them 12px, so the markup is now misleading but not user-facing.
- The homepage still ships a large DOM (~292 KB HTML, ~675 KB on `/universities` including RSC payload); worth monitoring LCP on budget Android.

---

## What changed since the 20 July 2026 audit

| July finding | Current state |
|---|---|
| Hardcoded admin password / JWT fallback / committed DB | ✅ Fixed |
| Stale “0 universities” build | ✅ 56 universities, 250 programs, live |
| Broken UK / success-stories/china / complaints links | ✅ Redirects in place; 0 broken internal links |
| www duplicate host | ✅ 308 www→apex in `next.config.ts` |
| Salesy destination copy / fake verification dates | ✅ Rewritten; dates now July 2026 (still uniform) |
| Two header systems / dead `Header.tsx` | ✅ Deleted; one `LightHeader` |
| Micro-typography / low contrast | ✅ Global 12px + contrast floor |
| No reduced-motion | ✅ Added |
| Meta keywords / placeholders | ⚠️ Keywords still present; no placeholder verification codes found |
| Bengali entry point | ❌ Still missing from nav/footer and hreflang |
| Homepage density/no imagery | ✅ Rebuilt with real photos and clearer sections |

---

## Recommended fix order

1. **Strip document wrappers/styles/H1 from all 15 update posts** and sanitize on save (P0).
2. **Add `public/og-image.jpg`** (1200×630) and spot-check OG previews (P1).
3. **Protect or remove `/api/analytics/performance`** (P1).
4. **Delete the duplicate `llms.txt`** (route or public file) (P1).
5. **Fix the doubled `/education-consultant-dhaka` title** (P1).
6. **Make university/post pagination crawlable** with real links; add `/education-consultant-dhaka` to nav/footer (P1).
7. **Archive/expire the nine March 2026 posts** and correct their dates (P2).
8. **Correct Malta’s UK visa sentence** and remove unsourced China comparisons; refresh country verification dates (P2).
9. **Add page-specific OG titles** to the 7 pages; remove meta keywords; strip HTML from post descriptions (P2).
10. **Add hreflang + a Bengali link** (P2).
11. Polish: login H1, remove hardcoded admin email fallback, trim `/api/health`, clean category case, remove `public/sitemap-submission.html` (P3).
12. Run `npx tsc --noEmit`, `npm run lint`, `npm run build` once the shell is available, then fix anything surfaced.

---

*End of audit.*
