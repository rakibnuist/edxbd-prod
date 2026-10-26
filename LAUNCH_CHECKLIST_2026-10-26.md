# Google / Meta Launch Checklist — EduExpress International
**Date:** 26 October 2026
**Build:** passed (168 pages, typecheck clean)

This checklist covers the last-mile actions to go live with the audited + repaired site
and to maximise Google Discover, rank, and Meta conversion-signal quality.

---

## 1. DNS & hosting

- [ ] Set CNAME/A to the hoster's IP
- [ ] SSL certificate active (Let's Encrypt or hoster-provided)
- [ ] Force HTTPS via nginx/Hostinger (HSTS already in next.config)
- [ ] Confirm `https://eduexpressint.com` loads without a mixed-content warning
- [ ] Confirm `https://www.eduexpressint.com` redirects 308 → apex (built into Next)

## 2. Search console & indexing

- [ ] Add property to **Google Search Console** (apex domain, DNS TXT or HTML file)
- [ ] Add property to **Bing Webmaster Tools** (import from GSC or TXT)
- [ ] Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in production `.env`
- [ ] Set `NEXT_PUBLIC_BING_SITE_VERIFICATION` in production `.env`
- [ ] Submit `https://eduexpressint.com/sitemap.xml` in both consoles
- [ ] Check coverage report — expect ~91 URLs indexed (88 sitemap + 3 known)
- [ ] Run "Test Live URL" on `/`, `/study-in-china-from-bangladesh`, `/universities`
- [ ] Verify canonical / hreflang pass in console (use URL Inspection)
- [ ] Monitor for any canonical-mismatch warnings (especially www versus apex)

## 3. Google Business Profile & Local

- [ ] Claim/verify Google Business Profile: EduExpress International, Dhanmondi
- [ ] NAP exactly matches `lib/office-record.ts`:
  - Name: EduExpress International
  - Address: Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209
  - Phone: 01983-333566
  - Category: Education consultant / Study Abroad
- [ ] Link GBP website to `https://eduexpressint.com/education-consultant-dhaka`
- [ ] Add office photos, hours (Sa-Th 11:00–18:00)
- [ ] Add "Bangladesh's Evidence-First Education Consultancy" as business description

## 4. Meta Business Suite

- [ ] Verify the domain in **Meta Business Settings** (Brand Safety → Domains)
- [ ] Set `NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION` in production `.env`
- [ ] Confirm Meta Pixel fires **only after consent** (cookie banner) —
      verified in `MetaPixel.tsx` and `conversion-events.ts`
- [ ] Install Meta Pixel Helper browser extension; visit key pages and confirm:
  - PageView fires once per route
  - Lead event fires on successful form submit
  - eventID is unique per form submission (deduplication)
- [ ] Create Custom Conversions in Meta Events Manager:
  - `Lead` → URL contains `/apply` or `/education-fit-assessment` or `assessment_submit`
  - `China_lead` → destinationInterest=china + Lead
- [ ] Create Custom Audience: `All_Visitors_180d`, `Unique_Leads_L30d`
- [ ] Start a Retargeting Draft Campaign: `Lead Submission` lookalike 1% of Unique_Leads

## 5. Structured data validation

- [ ] Run `https://eduexpressint.com/` through [Rich Results Test](https://search.google.com/test/rich-results) — confirm:
  - Organization/LocalBusiness (address, phone, geo)
  - WebSite with SearchAction (site search box)
  - FAQPage (detects all 6 Q&A pairs)
- [ ] Test `/study-in-china-from-bangladesh` → FAQPage + ItemList + Breadcrumb
- [ ] Test `/updates/[slug]` → BlogPosting (author, publisher, date)
- [ ] Test `/universities/nantong-university` → FAQPage + breadcrumb

## 6. Open Graph (social share) preview

- [ ] Open **Facebook Sharing Debugger** / **Twitter Card Validator**
- [ ] Test `https://eduexpressint.com/` — expect 1200×630 branded card
- [ ] Test `/study-in-uk-from-bangladesh`, `/china-scholarships-bangladesh`
- [ ] Test `/bn/study-in-china` — Bengali text in title/description, correct hreflang
- [ ] Confirm all 45 public pages pass without og:image errors

## 7. Analytics & conversion tracking

- [ ] **Google Tag Manager** (or GA4 directly): add `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- [ ] Confirm `assessment_submit` and `Lead` events surface in GA4 → Reports → Events
- [ ] Confirm `PageView` tracking with UTM parameters preserved
- [ ] Test the full funnel from Google Search → `/study-in-china-from-bangladesh` →
      click "Get my China study plan" → fill form → submit → Lead event in GA4/Meta

## 8. Speed & Core Web Vitals

- [ ] Run **PageSpeed Insights** on `/`, `/universities`, `/destinations`, `/study-in-china-from-bangladesh`
- [ ] LCP target < 2.5 s (largest hero images now have explicit `sizes` + `priority`)
- [ ] CLS target < 0.1 (all images have aspect ratios; no late-layout shifts)
- [ ] Production CDN cache: confirm `Cache-Control` headers from `next.config.ts`
- [ ] Verify OG image `/og-image.jpg` loads as 1200×630 × ~136 KB (within the 300 KB limit)

## 9. Paid-ads readiness (Google + Meta)

- [ ] Google Ads destination URLs: use UTM `utm_source=google&utm_medium=cpc&utm_campaign=china-2027`
- [ ] Meta Ads destination URLs: use UTM `utm_source=facebook&utm_medium=cpc`
- [ ] Landing pages (ads → `/china-march-2027-intake`, `/study-in-china-from-bangladesh`)
  - redirects: none that strip UTM
  - consent banner present (required for EU/EEA Meta Pixel)
  - phone number / WhatsApp visible above the fold
- [ ] Meta event deduplication verified (eventID tracks from client JS to CAPI in `meta-conversion-api.ts`)

## 10. Pre-launch content freeze

- [ ] Verify no "draft," "coming soon," "project estimate," "placeholder" visible on any public page
- [ ] Verify every destination page has an explicit `reviewedBy` and date
- [ ] Verify `/proof-library` evidence list loads — no empty grids
- [ ] Run `curl -I https://eduexpressint.com/updates/feed.xml | grep Content-Type` → `application/rss+xml`
- [ ] No `X-Robots-Tag: noindex` on any public page (admin/login/sitemap-submission are excluded by robots.ts)

## 11. Environment variables (production)

```
DATABASE_URL=file:./data/edxbd.db
JWT_SECRET=<openssl rand -base64 48>        # at least 32 chars
ADMIN_EMAIL=admin@eduexpressint.com
ADMIN_PASSWORD=<bcrypt-safe password>
META_ACCESS_TOKEN=<Meta System User token>
NEXT_PUBLIC_META_PIXEL_ID=<pixel ID>
NEXT_PUBLIC_GA4_MEASUREMENT_ID=<GA4 stream ID>
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<GSC token>
NEXT_PUBLIC_BING_SITE_VERIFICATION=<Bing token>
NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION=<FB domain token>
NEXT_PUBLIC_SITE_URL=https://eduexpressint.com
```

## 12. Files to commit before deploy

- [ ] `git status` clean (no dangling `.next` artifacts, no uncommitted DB backups)
- [ ] `prisma/data/edxbd.db` committed (the migrated prod-ready DB with archived posts + cleaned content)
- [ ] `public/og-image.jpg` committed
- [ ] `src/app/opengraph-image.jpg` + `twitter-image.jpg` committed
- [ ] `.env.example` updated with the new `NEXT_PUBLIC_*` verification vars
- [ ] Run `npm run build` on staging; confirm 168 pages, zero type errors
- [ ] Confirm the build output path matches the hoster's expectations (standalone → `node .next/standalone/server.js`)

---
*This file goes next to SITE_AUDIT_2026-10-26.md and should be ticked off line-by-line before opening the site to paid traffic.*