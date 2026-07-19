---
name: eduexpress-content-governance
description: Editorial governance and content quality skill for EduExpress International. Use this skill whenever writing, reviewing, editing, or approving ANY content for eduexpressint.com — guides, blog posts, updates, university profiles, or translations — and whenever managing the editorial workflow, content calendar, university directory data quality, or content refresh cycles. Also use when checking a draft against the people-first (E-E-A-T) standard, cleaning duplicate university records, or setting up CMS data models for universities, programs, scholarships, fees, and intakes.
---

# EduExpress Content Production and Editorial Governance

Study-abroad decisions affect finances, safety, and life outcomes — Google's people-first/E-E-A-T threshold applies. The site must behave like a serious education publisher, not a lead-generation brochure.

## Every guide must include (checklist — reject drafts missing any item)

- [ ] Direct answer in the first 80-120 words
- [ ] Bangladesh-specific eligibility, costs, documents, timing
- [ ] Official sources and date checked
- [ ] Named author + qualified reviewer with visible bios and relevant first-hand experience
- [ ] "What may change" and "Who this route is not suitable for" sections
- [ ] Total-cost table, risk section, comparison links where relevant
- [ ] Internal links: country pillar, university profiles, service terms, related guides
- [ ] Visible last-updated date and next review date
- [ ] CTA matched to stage (compare / assess / join next intake / apply) — NOT "Apply Now" everywhere
- [ ] No copied boilerplate across countries

## Editorial workflow (every piece passes all 7 stages)

| Stage | Owner | Required output |
|---|---|---|
| 1. Research brief | Country owner / researcher | Official sources, search intent, student questions, data table, risk flags |
| 2. Draft | Writer / counselor | Original draft using template, plain language |
| 3. Education review | Senior counselor / subject reviewer | Fit, recognition, cost, student-welfare review |
| 4. Compliance review | Management | Claims, guarantees, partnerships, privacy, payment terms approved |
| 5. SEO review | SEO lead | Title, H1, intent, internal links, schema, media, cannibalization check |
| 6. Publish | Editor / developer | Correct status, timestamps, source links, CTA, indexation |
| 7. Refresh | Country owner | Quarterly, or immediately when policy/deadline changes |

## Content cadence (minimum output)

| Period | Minimum output |
|---|---|
| Month 1 | Repair/rewrite homepage, services, China pillar, transparency pages, top 5 China university profiles |
| Months 2-3 | 2 China guides/week; 2 China success stories/month; Wave 1 pillars + 1 supporting guide each |
| Months 4-6 | Complete China cluster; 3-5 supporting pages per Wave 1 country; Bengali top China pages |
| Months 7-9 | Wave 2 launch; refresh China intakes; original comparison/data asset |
| Months 10-12 | Wave 3 only if gates pass; subject clusters, tools; update all high-traffic pages |

## University directory data model (CMS entities)

| Entity | Core fields |
|---|---|
| University | Unique ID; official name; aliases; country/city; official URL; type; recognition/accreditation; partner type + evidence; last verified |
| Program | University ID; exact official program name; degree; subject; language; duration; intake; eligibility; tuition; curriculum/source |
| Scholarship | Coverage; eligible program; conditions; renewal; deadline; official source; status |
| Fee | Amount; currency; fee type; recipient; refundable status; valid period; source |
| Intake | Open date; deadline; arrival date; status; source; last verified |
| Ranking | Publisher; ranking name; year; value; source — never a naked "World #" |
| Recognition | Authority/registry; program-specific notes; country of practice; verification date |
| Relationship | Direct partner / authorized representative / network access / public direct application / unverified; evidence + expiry |

## Directory cleanup tasks

- [ ] Merge duplicates (abbreviated vs full-name versions); 301 old URLs
- [ ] Normalize currencies, degree labels, program spelling, city/province, tuition periods
- [ ] Separate "original tuition", "after scholarship", "estimated net cost"
- [ ] Directory H1 = "Universities and Study Options" (NOT "Partner Universities" unless every institution is a documented partner)
- [ ] Source + expiry fields; label data "Under verification" after expiry
- [ ] Prevent low-value filter URLs from indexing; create curated landing pages for genuine demand
- [ ] Compare function uses the Better Education Standard, not only tuition/scholarship

## Hard rules

- Statistics and claims come from CMS-governed fields only — no hard-coded numbers in copy.
- Time-sensitive facts require source URL + verification date stored in CMS.
- Bengali content: full professional translation of priority pages only; hreflang only when equivalents are complete.
- No new content volume while existing pages are stale — accuracy first.
