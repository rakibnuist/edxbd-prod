# Focused China guides

## Brief and scope

The Study in China hub should be a compact introduction and topic finder. A focused guide should answer one question in depth without turning the hub into a long encyclopedia. This shared guide template covers admission, scholarships, costs, student visas, teaching-language evidence, student life and the EduExpress service policy.

This change owns `src/components/china/ChinaGuidePage.tsx` only. It preserves the application route, CMS package records, canonical URL shape, visible content data and crawlable topic links. The data and route owners manage factual content and metadata.

## Before audit

The previous template used a dark oversized hero, decorative watermark and gradient, tracked monospace labels, large repeated accordion sections, a second pair of large callouts, an oversized FAQ heading and a public source/provenance footer. Most substantive content required opening an accordion. Its WebPage schema contained a hard-coded modification date and a review claim unrelated to an actual review record.

The three changes with the greatest benefit are a smaller light header, fully readable editorial sections and a navigable topic/contents structure. The visitor can act from the first screen without hunting for an enquiry form.

## Design decisions

The shared EduExpress direction uses a pale `#f5f7f7` ground, blue `#174f7a`, ink `#102b40`, the existing font and a 1200px frame. The guide keeps a modest 40px desktop / 30px phone title, readable 14–16px body copy and 44px controls. The two-column frame is 1136px inside its desktop padding: 220px contents + 40px gap + 876px article.

Taste Skill's existing restrained, flat-surface direction informs hierarchy, real data, consistent edges and clear actions. The user's compact, practical guide requirement takes precedence over a decorative landing page's large imagery, motion quota or cinematic sections. No invented images, figures or proof have been added. Source links and editorial provenance remain internal.

Idea: each guide turns one China-study decision into an explanation, a comparison or practical sequence, and a real next step with EduExpress International.

## Information structure

- A plain direct answer follows the page title, with a real application action and a university-directory link.
- A compact shared fact strip gives context without independent decorative feature cards.
- The crawlable topic bar connects the six focused guides. Related links also connect the hub, service policy and relevant next decisions.
- Desktop has a quiet contents rail and application prompt. On a phone, native “On this page” disclosure keeps navigation compact while preserving accessible anchor links.
- Main narrative sections are expanded. Real comparisons use semantic tables with column and row headings. Peer concepts use cards only when the data contains actual peer categories. Ordered processes use an actual ordered list. Authentic document/check lists remain lists.
- FAQs alone use collapsed answer disclosures; each question and answer is the same value used in FAQPage schema.
- The service-policy guide reads published China package records from the CMS. Its compact package sections retain prices/currencies, summary, scope, inclusions, exclusions, security options, payment terms, return terms and responsibility notes.
- Application actions lead to `/apply?country=China`.

## Content contract and structured data

Each `ChinaGuideSection` retains `heading`, `summary` and optional `items`. It may also contain a table (`columns`, `rows`), peer cards (`title`, `body`) or ordered steps (`title`, `body`). The template does not generate facts or rewrite the supplied guidance.

One JSON-LD graph contains one WebPage, one BreadcrumbList and FAQPage only when visible FAQ entries exist. The template has no invented `dateModified` or `reviewedBy`. HTML-sensitive less-than signs are escaped in embedded JSON. No source file paths or private source records enter that graph.

## Verification

The final pass should verify desktop and phone layout, no page-wide horizontal overflow, contents links, all topic links, correct active topic, application destination, real package terms and exact FAQ/schema agreement. Use CUA for browser inspection; do not launch a separate browser-control driver. Do not claim the Taste inspection script passed unless it was actually run.

Focused ESLint and the full TypeScript check passed. Server rendering checks passed for all seven guide records: one H1, one WebPage and BreadcrumbList, exact FAQ question/answer agreement, valid contents targets, application/peer links, no public source links and no invented review/modification metadata. Optional table, card and ordered-step layouts were exercised. Package data remains loaded from the CMS; these isolated render checks used an empty package loader and do not claim to validate CMS package content. This agent's CUA browser inventory was unavailable, so final visual inspection belongs to the parent integration pass.
