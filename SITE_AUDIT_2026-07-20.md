# eduexpressint.com — Complete Site Audit
**Date:** 20 July 2026 · Audited: live site (Hostinger VPS) + repo working copy (`prod-deploy` branch)

---

## P0 — Critical (fix this week)

### 1. Admin password is hardcoded in public client-side code — SECURITY EMERGENCY
- `src/contexts/AuthContext.tsx:138` and `src/app/admin/leads/page.tsx` (3 places) contain `password: 'admin123'` and auto-login logic. This ships in the public JS bundle — **anyone can extract it and log into /admin and read all student leads** (names, phones, emails = personal data breach).
- `src/lib/auth.ts:3` has a hardcoded JWT fallback secret committed to git. Anyone with repo access can forge admin tokens.
- `dev.db` / `prisma/dev.db` (the real SQLite DB) is committed to the repo.

**Fix:** change the admin password now, remove every hardcoded credential from client code, set a real `JWT_SECRET` env var and delete the fallback, remove `*.db` from git (`git rm --cached`, add to `.gitignore`), rotate the secret.

### 2. Live /universities page is a stale old build showing "0 universities"
The deployed page has the **old design** (old nav, "Partner Universities" H1, `Showing 0 universities`), old metadata with `canonical: https://www.eduexpressint.com` (homepage canonical on an inner page — indexing killer), and literal placeholder tags: `your-google-verification-code`, `your-bing-verification-code`, `your-yahoo-verification-code`.
The repo contains a completely different, correct version (`Global Universities Database`, SSR data, proper canonical). **Auto-deploy is not delivering the current code for this route** (stale `.next`/ISR cache on the VPS or failed build). An empty university directory is also a conversion dead end.

**Fix:** rebuild and redeploy clean on the VPS (clear `.next` cache), verify the DB on prod actually has university records, then confirm `view-source` shows the new H1 + self-canonical.

### 3. Broken links in the header/footer on every page
| Link | Where | Result |
|---|---|---|
| `/destinations/united-kingdom` | Footer + LightHeader (site-wide) | **404** — route slug is `uk` (`src/lib/countries.ts`) |
| `/success-stories/china` | Homepage `ChinaFlagshipRecord.tsx:173` | **404** — no nested route; data key `success-stories/china` is filtered out of `[slug]` |
| `/complaints-and-review` | Footer (site-wide) | **404** — slug not in `evidencePages.ts` |

**Fix:** change footer/header UK links to `/destinations/uk` (or add a redirect), create the success-stories/china page or point to `/success-stories`, add the complaints-and-review evidence page.

### 4. Uncommitted work sitting on your machine
14 modified files (DestinationsClient, ContactClient, UniversitiesClient, etc.) are not committed or deployed. Whatever you fixed locally, production never got it.

---

## P1 — High (fix this month)

### 5. www duplicate host
`https://www.eduexpressint.com` serves the full site with 200 instead of 301-redirecting to non-www, and `robots.txt` points the sitemap at `https://www.eduexpressint.com/sitemap.xml`. Canonicals mitigate but this splits crawl and contradicts your own acceptance rule ("one host, no duplicate indexable domains").
**Fix:** 301 www → non-www at nginx/Hostinger level; correct the sitemap URL in robots.txt.

### 6. Old salesy copy contradicts the evidence-first brand (compliance risk)
`/destinations` still shows the pre-rebrand cards and CTA — exactly the claim language your governance standard bans:
- "Fully Waived under CSC Scholarship", "Scholarship offsets up to 100%", "Easy Visa", "Best for MBBS (No Entrance Exam)", "Typically includes 50% waiver"
- CTA block: "Don't let paperwork hold you back… focus on your dreams"
- `/destinations/uk`: "**guaranteed** 2-year PSW" — never use "guaranteed"; also verify the UK Graduate Route length (a reduction to 18 months was announced in the 2025 white paper — this may now be factually wrong).
- Destination pages show "Last Verified: **October 2026**" — a date three months in the future. Kills the credibility the whole brand is built on.

**Fix:** rewrite `DestinationsClient.tsx` cards in the same evidence-first voice as the homepage; fix verification dates; re-check UK PSW claim against gov.uk.

### 7. Two header systems, inconsistent navigation
- `ConditionalHeader` always renders `LightHeader`; `Header.tsx` (358 lines) is dead code but still maintained — and its nav differs (links "Destinations" to `/country-status`).
- Live /universities (stale build) shows a third nav. Visitors get different menus on different pages.
**Fix:** delete `Header.tsx`, keep one nav, and make "Destinations" go to `/destinations` (users expect the comparison page, not a status page).

---

## UI & readability audit (visitor-friendliness) — the core problem

The new design is visually distinctive but **optimized for looking like an "evidence dossier," not for a 18–24-year-old Bangladeshi student reading on a cheap Android phone**. Specific issues:

### 8. Micro-typography everywhere
69+ uses of `text-[9px]`, `text-[10px]`, `text-[11px]` across 15+ components (Footer, ChinaFlagshipRecord, DestinationDecisionDesk, ChinaGuidePage, forms…), almost always **mono font + ALL CAPS + wide letter-spacing** (`font-mono uppercase tracking-[0.2em]`). 9–10px uppercase mono is genuinely hard to read, fails WCAG comfort thresholds, and is worse on low-DPI phones — the majority of your audience.
**Fix:** set a floor of 12px (`text-xs`) for labels, 16px for body. Use caps-mono labels sparingly (one eyebrow per section, not every element).

### 9. Low-contrast text on dark navy
Body copy at `text-white/50`, `text-white/75` on `#08263c` backgrounds appears throughout hero/header/footer sections. `white/50` on navy is roughly 4:1 or lower at small sizes — below WCAG AA for the tiny fonts it is paired with.
**Fix:** minimum `white/80` for any text under 18px on dark backgrounds.

### 10. Jargon-heavy copy that students won't parse
The homepage speaks internal brand language: "decision desk", "route file", "fit spectrum", "proof engine", "evidence library", "Inspect China", "Assessment pass". A student searching "study in China from Bangladesh" wants: *which university, how much, scholarship, IELTS, visa*. They must decode a metaphor first.
**Fix:** keep the evidence-first substance, translate the labels: "Inspect China" → "See China universities & costs"; "Route file" → "China guide"; "Decision desk" → "our Dhanmondi office". Aim for grade-7 reading level in headings/CTAs. Also: your audience reads Bengali — only one Bengali page exists (`/bn/study-in-china`); the homepage has zero Bengali entry point visible in the header.

### 11. Wall-of-text density, almost no imagery
The homepage is ~15 stacked text sections with exactly **one photo (china.jpg), reused twice, loaded at `w=3840&q=75`** (multi-hundred-KB LCP on mobile). No student faces, no campus photos, no video — trust for this audience is built with real faces and stories.
**Fix:** cut homepage to ~7 sections; add real photos (office, students, offer letters with consent); size hero images responsively (`sizes` attr so mobile gets ≤828px, not 3840).

### 12. Numbers-as-decoration hurt scanning
"01 / 10", "DOC 01", "BRING 02", "08 guides" prefix nearly every item. Screen-reader users hear the numbers; sighted users must skip them. The destination navigator ("Choose a route, then inspect the fit, 01/10") makes users click through 10 slides to see what a simple grid would show at once.
**Fix:** replace the homepage carousel with a static 10-card grid (flag, country, tuition range, one line); drop ordinal prefixes except in genuine step sequences.

### 13. Animation weight
`framer-motion` wraps nearly every section plus `PageTransition`, `AnimatedSection`, ticker components. On budget Android devices this causes jank and delays interactivity; there's no `prefers-reduced-motion` handling in `globals.css`.
**Fix:** animate only hero + one or two sections; add a `prefers-reduced-motion` media query; consider removing framer-motion from the footer/header entirely.

### 14. Layout/consistency nits
- Fixed-header top-padding is hand-tuned per page (`pt-28`, `pt-32`, `pt-[76px]`, `min-[1200px]:pt-[104px]`) — content will collide with the header on some breakpoints. Centralize as one CSS variable.
- `maximum-scale=5` is fine, but `format-detection: telephone=no` while phone numbers are the main CTA is contradictory on iOS.
- Footer social links render raw URLs as link text on some renderings — use icons/labels.
- Meta keywords tag: 30 stuffed keywords on every page. Google ignores it; competitors read it. Delete.

---

## Quick-win checklist (ordered)

1. ☐ Change admin password + remove `admin123` from all client code + real `JWT_SECRET` (today)
2. ☐ Remove `dev.db` from git; rotate secrets
3. ☐ Fix 3 broken site-wide links (UK, success-stories/china, complaints-and-review)
4. ☐ Force-redeploy VPS with cleared `.next` cache; verify /universities shows new build + data
5. ☐ Commit/deploy the 14 locally-modified files
6. ☐ 301 www → non-www; fix robots.txt sitemap URL
7. ☐ Rewrite /destinations cards + CTA in evidence-first language; fix "October 2026" verified dates; verify UK PSW claim
8. ☐ Typography pass: 12px label floor, 16px body, `white/80` minimum on navy
9. ☐ Replace homepage destination carousel with a grid; cut homepage to ~7 sections
10. ☐ Plain-language pass on headings/CTAs + add Bengali entry point in header
11. ☐ Responsive image sizes for china.jpg (and add more real photos)
12. ☐ Delete dead `Header.tsx`; unify nav; point "Destinations" at `/destinations`
13. ☐ Add `prefers-reduced-motion`; reduce framer-motion scope
14. ☐ Remove meta keywords; add real Google/Bing verification codes (or remove placeholders)

---

*Method: full crawl of key live pages (home, destinations, destination detail ×2, China hub, universities, education-fit-assessment, country-status, robots.txt, www host) + code review of layout, headers, footer, routing, data files, auth, and Next config. Aligned with the internal Technical SEO P0/P1 acceptance list and content governance standard.*
