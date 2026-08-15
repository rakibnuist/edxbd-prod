# EduExpress — Design, Accessibility & Strategy Review

**Date:** 16 August 2026
**Scope:** `src/` — homepage, layout, header/footer, design tokens, content data layer
**Lenses applied:** design-critique · design-system · accessibility-review · ux-copy · design-handoff · eduexpress-seo-strategy

---

## Verdict

The live homepage is in good shape and is genuinely strategy-compliant. The problems are not
in what renders — they are in **what surrounds it**: a large orphaned component layer, a
duplicated content source, and a design-token layer nobody uses.

Fix the P0 items and the codebase stops being able to contradict the strategy by accident.

---

## What is already right

Worth stating plainly, because it constrains the recommendations below.

| Area | Evidence |
|---|---|
| Approved title | `Education Consultancy in Bangladesh \| EduExpress International` — verbatim |
| Approved H1 | "Choose better education abroad with clear costs and written proof." |
| Approved CTAs | Primary "Get My Free Education Fit Assessment" + secondary "Explore Study in China", both in the hero |
| China offer wording | Rendered verbatim in the China hub section, third-party fees included |
| Claim discipline | No "guaranteed admission", no success rates, no borrowed China stats |
| Evidence gating | Testimonials, metrics and proof rails all render empty states when the CMS has no approved record |
| Accessibility floor | `globals.css` audit block (2026-07-20): reduced-motion, contrast lift, 11px text floor |
| Motion control | Marquee rails pause on hover **and** `:focus-within`; duplicate sets are `aria-hidden` |
| Contrast | 17 of 18 measured colour pairs pass WCAG AA (see appendix) |
| Header semantics | `aria-label` on nav, `aria-current="page"`, `aria-expanded` on menus, Escape closes |

---

## P0 — Fix first (correctness and content integrity)

### 1. Half the component layer is dead, and one dead file breaks the strategy

**38 of 74 components** in `src/components/` are imported by nothing.

The dangerous one is `components/home/HeroSection.tsx`. It is not rendered, but it contains
copy that directly violates the approved language rules:

| Line | Copy in the file | Rule it breaks |
|---|---|---|
| 224 | "Up to 100% Scholarship" | "We sell full scholarships" — prohibited |
| 170 | "$5M+ Scholarships" | Unattributed figure, no source or date |
| 186 | "24/7 Support" | Support scope claim with no stated limits |
| 260 | "2,000+ successful student cases" | Performance claim without a stored record |

It also carries a stale, near-identical H1 and a duplicated mobile/desktop card set that
would drift the moment anyone touched it.

**Action:** delete the orphan list below. Anything worth keeping, keep — but knowingly.

```
home/HeroSection          home/CTASection            home/DestinationsSection
home/AboutPreviewSection  home/ProcessTimelineSection home/TestimonialsSection
home/HomeTestimonials     home/FeaturesSection        home/DestinationDecisionDesk
Header                    TrustStrip*                 FAQSection
CTALeadForm               WhatsAppWidget              UniversityWhatsApp
AnimatedButton            AnimatedCard                AnimatedSection
PageTransition            ScrollToTop                 LoadingSpinner
ConditionalFooter         ConditionalMain             DeferredComponents
Preconnect                SEOHead                     MobileOptimizer
PerformanceOptimizer      PerformanceDashboard        ContentOptimizer
CampaignOptimizer         EngagementTracker           DestinationTracking
ConversionTrackingStatus  MetaConversionStatus        InfinityTicker
ui/Ticker                 china/ChinaUniversityDirectory
```

`*` **Do not delete `TrustStrip`** — see P1.1. It should be used, not removed.

---

### 2. Nine URLs have two sources of truth; one of them is silently ignored

`app/[slug]/page.tsx` renders pages from `data/evidencePages.ts` and `data/chinaGuidePages.ts`.
But nine of those slugs **also** exist as static routes, and in the Next.js App Router a static
segment always beats `[slug]`.

Editing the data file for any of these changes nothing on the live site:

```
/china-intakes-deadlines          /china-student-visa-bangladesh
/education-consultant-dhaka       /fees-and-transparency
/life-in-china-bangladeshi-students  /mbbs-in-china-bangladesh
/study-in-china-cost-bangladesh   /study-in-china-from-bangladesh
/study-in-china-without-ielts
```

`generateStaticParams()` also emits build params for routes that will never render.

This is the exact staleness failure the governance standard exists to prevent: a counselor
updates the intake dates in the data file, review passes, and the public page is unchanged.

**Action:** for each of the nine, decide which file owns the URL, delete the other, and filter
the dead slugs out of `generateStaticParams()`.

---

### 3. Two complaints pages

`data/evidencePages.ts` defines both `complaints-and-resolution` (linked from the footer) and
`complaints-and-review` (linked from nowhere). Both are indexable. Keep one, 301 the other.

---

## P1 — Strategy gaps

### 1. The approved trust strip is built and rendered on zero pages

`components/TrustStrip.tsx` contains all four approved signals, verbatim, with a correct
`aria-label`. It is imported nowhere.

The strategy requires this strip on the homepage. This is the highest value-per-character
change available on the site:

```tsx
// src/app/page.tsx
import TrustStrip from '@/components/TrustStrip';
// …place directly below the hero <section>, above the video section
<TrustStrip />
```

### 2. Footer is missing the fee policy link

Footer currently links `/privacy`, `/terms`, `/student-data-privacy`, `/complaints-and-resolution`.
The strategy footer spec also requires the **fee policy** — add `/fees-and-transparency`.

### 3. Destinations are displayed as equally established

`app/page.tsx` renders every entry in `otherCountries` as an identical gradient tile. The
strategy is explicit: destinations must never be shown as equally established, and the public
status label (Flagship / Active / Pilot / Launching / Researching / Paused) must drive both the
CTA and indexation.

**Action:** add `status` to the country record and render it as a badge on each tile; suppress
or soften the CTA for non-Active destinations. This is launch-gate compliance, not decoration.

---

## P2 — Accessibility

Contrast and motion are already handled. Three gaps remain.

### 1. No skip link — WCAG 2.4.1 Bypass Blocks (Level A)

There is no "skip to content" anywhere in `layout.tsx` or `globals.css`. With ~7 nav items plus
dropdowns, keyboard and screen-reader users traverse the full header on every page.

```tsx
// layout.tsx, first child of <body>
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4
   focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-bold
   focus:text-[#08263c] focus:shadow-lg">Skip to content</a>
…
<main id="main">{children}</main>
```

### 2. `outline-none` with no replacement — WCAG 2.4.7 Focus Visible

Four occurrences remove the focus ring without providing one, including the homepage university
search input (`app/page.tsx`). Add `focus-visible:ring-2 focus-visible:ring-[#174f7a]` wherever
`outline-none` appears.

### 3. Star ratings at 2.15:1 — WCAG 1.4.11 Non-text Contrast

`#f0a028` on white measures 2.15:1, below the 3:1 floor for meaningful graphics. The
`aria-label="{n} out of 5 stars"` mitigates it for screen readers, but low-vision sighted users
are still affected. Darken to roughly `#b26f10` when stars sit on white.

---

## P3 — Design system

### 1. The token layer is entirely unused

`tailwind.config.js` defines `primary-blue`, `text-dark`, `secondary-orange`, `accent-green`
and more. **Zero components reference any of them.** Instead the codebase carries
**1,543 arbitrary hex utilities**:

| Value | Uses | Meaning |
|---|---|---|
| `[#174f7a]` | 598 | brand blue |
| `[#08263c]` | 418 | brand navy |
| `[#8ed0ee]` | 117 | light cyan |
| `[#64b5df]` | 114 | brand cyan |
| `[#e9f7fd]` | 68 | mist |

A theme change today means a 1,500-occurrence find-and-replace across 100+ files.

**Action:** define the real palette as tokens (`brand-blue`, `brand-navy`, `brand-cyan`,
`brand-mist`), delete the unused ones, and codemod the top five hex values. That single pass
covers roughly 1,300 of the 1,543 occurrences.

### 2. Two conflicting definitions of "primary"

`primary-blue` is navy `#174f7a`; the `primary.*` scale is **red** (`primary.500 = #ef4444`).
Any developer reading `text-primary-600` gets red where they expect brand blue. Delete the red
scale — nothing uses it.

### 3. `animation` key declared twice

`tailwind.config.js` lines 63 and 78 both define `animation`. JavaScript silently discards the
first. No breakage today (the second is a superset), but it is a live trap. Merge them.

### 4. `<h2>` used for non-section content in the dead hero

Already covered by the P0 deletion — noting it so the pattern is not reintroduced. Decorative
value-prop cards should use `<p>` or `<h3>`, never `<h2>` directly under the `<h1>`.

---

## Minor

- `layout.tsx` carries **52 meta keywords**. Search engines have ignored this tag since 2009;
  it only signals over-optimisation to a human reviewer. Delete it.
- `HeroSection.tsx` (being deleted) pulled hero imagery from Unsplash's CDN. Own imagery is
  both faster and more consistent with an evidence-first position — the live homepage already
  does this correctly with `/images/proof/*`.

---

## Suggested order

| # | Change | Effort | Impact |
|---|---|---|---|
| 1 | Render `<TrustStrip />` on the homepage | 2 min | High |
| 2 | Add skip link + `<main id="main">` | 10 min | High (Level A) |
| 3 | Add `/fees-and-transparency` to the footer | 2 min | Medium |
| 4 | Delete the 37 orphaned components | 30 min | High (removes banned copy) |
| 5 | Resolve the 9 shadowed slugs | 2 h | High (content integrity) |
| 6 | Merge the two complaints pages | 20 min | Medium |
| 7 | Fix `outline-none` focus states | 20 min | Medium |
| 8 | Destination status labels | 3 h | High (launch-gate compliance) |
| 9 | Tokenise the top 5 hex values | 3 h | Medium (maintainability) |
| 10 | Tidy `tailwind.config.js`, drop meta keywords | 20 min | Low |

Items 1–3 and 7 are under an hour together and cover both Level A accessibility failures plus
the two strategy gaps.

---

## Appendix — measured contrast

Computed against WCAG 2.1 relative-luminance, alpha values composited over their actual backgrounds.

| Combination | Ratio | Required | Result |
|---|---|---|---|
| Hero body `white/72` on `#071f31` | 9.15 | 4.5 | PASS |
| Hero "Popular" `white/55` on `#071f31` | 5.85 | 4.5 | PASS |
| Hero metric label `white/55` on `#071f31` | 5.85 | 4.5 | PASS |
| Dark section body `white/75` on `#08263c` | 9.25 | 4.5 | PASS |
| Team card sub `white/65` on card | 6.74 | 4.5 | PASS |
| Eyebrow `#9bd8f3` on `#08263c` | 9.99 | 4.5 | PASS |
| Brand blue `#174f7a` on white | 8.62 | 4.5 | PASS |
| Brand blue `#174f7a` on `#f8fafb` | 8.23 | 4.5 | PASS |
| `slate-600` on white | 7.58 | 4.5 | PASS |
| `slate-500` on white | 4.76 | 4.5 | PASS |
| Amber CTA `#08263c` on `#f0a028` | 7.22 | 4.5 | PASS |
| Cyan CTA `#08263c` on `#64b5df` | 6.81 | 4.5 | PASS |
| Card `#9a5b08` on `#fff2da` | 4.90 | 4.5 | PASS |
| Card `#1f7652` on `#e8f6ef` | 5.00 | 4.5 | PASS |
| Card `#5b46b5` on `#f0edfb` | 6.09 | 4.5 | PASS |
| Card `#174f7a` on `#e8f5fb` | 7.75 | 4.5 | PASS |
| **Star rating `#f0a028` on white** | **2.15** | **3.0** | **FAIL** |
