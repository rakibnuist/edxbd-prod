---
name: eduexpress
description: Brand, content, and conversion skill for EduExpress International (eduexpressint.com) — a Dhaka-based, evidence-first study-abroad consultancy serving Bangladeshi students and families. Use for any EduExpress page, component, copy, motion, lead form, carousel, PDF, ad, or work inside the edxbd-prod repository.
---

# EduExpress International — working skill

Load this before touching EduExpress work. It records what the business is, how Bangladeshi families read it, what may be claimed, and the current near-white conversion system.

## 1. The business

EduExpress International is a study-abroad consultancy at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Phone/WhatsApp +880 1983-333566. Open Saturday–Thursday, 11:00–18:00. The promise is **"Better education. Clear costs. Written proof."** — supported by documents: a recognition check, an itemised cost schedule, an application record. China is the flagship route (CSC/university scholarships, MBBS, visa-first payment policy). For the China package, **no EduExpress service fee is due before China visa approval**; university, embassy, medical, translation, courier and deposit costs are itemised separately. BDT 200,000 is the package price, not the whole cost of study.

## 2. Audience and the job of the page

Two readers: the student (17–25, mobile-first, Bangla-comfortable, price-conscious) and the guardian who pays (fears scams, wants a named person and numbers in writing). Every home page exists to do one job: **capture a profile assessment request** — then prove the firm is safe to talk to.

- English-first main content. Bangla remains available through the header language link and `/bn/study-in-china`.
- Above the fold: one clear headline, three concrete trust points, and a short lead form.
- WhatsApp, phone and office details are always reachable. On mobile, the sticky lead bar provides Call / WhatsApp / Assessment.
- Never trade readability for decoration. 16px body, generous leading, one dominant action per section.

## 3. Claims and guardrails

- No visa guarantees, “100% success”, invented rankings, partner logos or unsourced numbers.
- Scholarship coverage states what is covered and what remains payable.
- Cost tables separate university, third-party/embassy, EduExpress fee; mark refundable vs non-refundable and who receives payment.
- Recognition names the authority/registry and verification date.
- Testimonials need consent, a real name and a date. Select a relevant published story; never invent one.
- Company metrics stay unpublished unless stored in the governed CMS (`src/lib/config.ts` holds `null` deliberately).
- No page copy may contradict the fee policy or structured data.

## 4. Voice

Plain, specific, calm. A senior counsellor explaining a file — not a marketer.

- “No service fee before China visa approval. University deposits are separate and appear on your written schedule.”
- “Six stages, each with a named owner and a document.”
- CTAs name the action: “Get my free assessment”, “See the full cost schedule”, “Book an office consultation”, “WhatsApp a counsellor”.
- Avoid “unlock your dream”, “seamless solutions”, vague urgency and adjective stacks.

## 5. Visual system — near-white clear desk

Near-white, high-contrast and quiet. The **home page is a conversion surface**, not an editorial scrapbook. White and off-white grounds, deep petrol-green text/links, one marigold action colour, thin rules and 8–12px cards. No paper texture, arch masks, passport stamps, boarding passes, grain or decorative gradients.

| Token | Value | Role |
|---|---|---|
| chalk / page | `#fbfbf8` | near-white page ground |
| white | `#ffffff` | hero, cards, header |
| ink | `#101f1b` | body text |
| ink-soft / mute | `#48564f` / `#6b7770` | secondary text |
| petrol 700 / 600 | `#0c3733` / `#0f4a42` | links, headings accents |
| marigold | `#e9a21b` | primary CTA, active dots, small signals |
| jade | `#1b7a57` | included/verified |
| clay | `#b4462f` | excluded/caution |
| rule | `#e4e4dc` | hairlines and card borders |

Type: **Archivo** for home headlines, UI, forms and figures (tight tracking, max 3–4 lines); **Fraunces** only as the testimonial pull-quote accent. Bengali stack remains self-hosted for `/bn`; do not use it for the English home. Base body 16px; supporting copy 13.5–15px; labels 11–12px; never below 11px for meaningful text. Hero headline max `clamp(2.4rem, 4.4vw, 3.9rem)`. Use sentence case except short uppercase labels.

Layout: max width 1320px, gutters `clamp(1.25rem,4vw,4rem)`, section rhythm `clamp(4rem,9vw,8rem)`. Left-aligned; generous whitespace; cards get one radius, one hairline and a small hover lift.

## 6. Current home architecture

1. `HomeHero` — a split panel: real Dhanmondi counselling photo with white Archivo headline, subcopy, three checks and CTAs on the left; embedded **HomeLeadForm** on white at the right. `#assessment` anchors the form and must stay stable across success/error states.
2. **Fact strip** — university records, destination services, evidence records, 0 service fee before China visa approval.
3. **What you get** — recognition check, cost schedule, application record cards with links.
4. **China package** — `BDT 200,000`, included vs paid separately, payment-terms CTA.
5. **Destination carousel** — `Carousel` scroll-snap rail; verified photography only (China, UK, Malaysia, South Korea, Georgia) and designed gradient tiles for the rest. Never show an unrelated stock photo.
6. **Journey** — six numbered stages, plain copy.
7. **Proof + student stories** — office photo and `TestimonialCarousel` (auto-advance only in view, 9s, pause/play, arrows, dots).
8. **Guides, FAQ, final CTA + office card.**
9. `MobileLeadBar` — fixed Call / WhatsApp / Assessment bar; appears after 420px scroll, hides while the form or footer is visible; no floating WhatsApp on `/` to avoid duplication.

## 7. Lead capture implementation

`HomeLeadForm` is the conversion source of truth:

- Fields: name, phone/WhatsApp, email, current study level, preferred destination, explicit privacy consent. Hidden honeypot `companyWebsite`.
- POST `/api/leads` body: `name`, `email`, `phone`, `country`, `program`, `message`, `source: homepage_lead_form`, `leadType: assessment`, `destinationInterest`, `assessment { academicLevel, preferredCountries }`, `consent`, `consentTimestamp`, `consentPolicyVersion`, `landingPage`, `utm`, `trackingConsent`, `metaEventId`.
- Success: confirmation panel + one-working-day promise + WhatsApp/browse actions + “submit another profile”.
- Errors are specific and inline; the button shows a spinner while submitting.
- Header “Free assessment” uses `#assessment` on `/` and `/education-fit-assessment` elsewhere.
- Call `trackAssessmentSubmit` after success. Keep UTM, consent timestamp and version intact.
- Fire `trackWhatsAppClick` / `trackPhoneClick` on home CTA, form and lead-bar contact links so lead sources stay measurable.

## 8. Motion and carousels

- Hero: photo scale settle, masked headline rise, staggered copy, form entrance. Nothing auto-hides content.
- Thin marigold scroll-progress line under the fixed header (`ScrollProgress`).
- Destination carousel: native scroll snap, arrow buttons (desktop), progress bar, image zoom on hover, keyboard-focusable track.
- Testimonial carousel: `AnimatePresence` slide/fade, auto-advance 9s **only while in view**, pauses on hover, has a visible Pause/Play, arrows and dots. Reduced motion disables auto and smooth scroll.
- Do not wrap sections in opacity-based reveal components that leave content invisible before intersection. Content must render and be readable with JavaScript disabled.
- Hover/focus transitions 160–240ms, transform/opacity only.

## 9. Bangladesh UX specifics

- Prices in BDT; package price separate from total study cost.
- Phone display `+880 1XXX-XXXXXX` via `formatBangladeshPhone`; `tel:` digits only; WhatsApp deep links with a greeting.
- Academic language: HSC, SSC, A-level, O-level, GPA, MOI, transcripts, police clearance, medical.
- Families ask about safety, food/halal, hostels, remittance, part-time work — answer or link directly.
- Mobile 360px is the minimum; 44px tap targets; the fixed lead bar must not trap focus or cover the form/footer.
- Header: desktop nav at `xl`; below that a full-screen menu with the Bangla link; header remains near-white and opaque.

## 10. Codebase map (edxbd-prod)

- Next 16 App Router, React 19, TypeScript, Tailwind, framer-motion 12, lucide-react.
- Home: `src/app/page.tsx` + `src/components/home/{HomeHero,Carousel,TestimonialCarousel,MobileLeadBar}.tsx` + `src/components/lead/HomeLeadForm.tsx`.
- Header `LightHeader.tsx`; footer `Footer.tsx`; search `SearchPalette.tsx`.
- Global tokens/components in `src/app/globals.css`; Tailwind tokens in `tailwind.config.js`.
- Data: CMS-backed Prisma records via `src/lib/university-records.ts`, `content-records.ts`, `trust-records.ts` with fallbacks.
- Helpers: `countryCode`, `formatBangladeshPhone`, conversion events in `src/lib/conversion-events.ts`.
- Lead endpoint `src/app/api/leads/route.ts` requires name, email, phone, country, consent, consent version/timestamp; rate-limited and honeypot-aware.
- Retired home components (stamp/ticket/arch/route) remain in the tree but must not be reintroduced without a design decision.
- Read `node_modules/next/dist/docs/` before using unfamiliar Next 16 APIs.

## 11. QA gate

- [ ] Main content English; language switch works; claims match stored evidence.
- [ ] Hero form visible and usable at 360–1440; all fields labelled; consent links to privacy.
- [ ] `POST /api/leads` mocked submission reaches success; no real test lead written.
- [ ] Sticky bar appears past the hero, hides over the form and footer, never covers critical content.
- [ ] Carousel arrows/dots/swipe work; testimonial pauses; reduced-motion disables auto motion.
- [ ] No horizontal scroll at 360/390/1024/1280/1440; body text ≥13.5px; focus rings visible.
- [ ] All images are verified to match the destination; otherwise use the designed gradient tile.
- [ ] `npx tsc --noEmit`, `npm run lint` (0 errors), `npm run build` pass.
- [ ] Structured data matches visible copy and fee claims.
