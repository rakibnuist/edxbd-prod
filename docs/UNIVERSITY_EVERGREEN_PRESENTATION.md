# Evergreen university presentation

The owner requested university profiles without deadlines, intake years, closed-cycle labels or other dated editorial prose. This supersedes the earlier public-profile date-preservation preference for this presentation. Source chronology remains essential internally and must not be deleted or rewritten as an open admission offer.

`src/lib/university-profile-public.ts` creates the public view of programme and scholarship records. It whitelists fields, omits intake/deadline/cycle labels, removes historical date wording and preserves tuition, fee currencies, durations, age ranges, test scores, document-validity periods, award coverage and restrictions. Closed scholarship statuses remain unchanged in the projected record; components must not render these internal states or treat the projection as proof of an open application window.

The adapter does not change CMS records. Sourced tuition and scholarship figures remain published planning information rather than a promise that costs or eligibility are fixed permanently. Programme availability and a final written award remain application-specific.

## NUIST overview and highlights

The revised overview uses Nanjing University of Information Science and Technology and NUIST naturally, followed by study levels, representative major areas, language choice, fees and scholarship comparison. Five structured highlights cover atmospheric science, subject breadth, WMO academic links, teaching languages and the Nanjing campus setting. No new institutional ranking, employment claim, statistical claim or scholarship guarantee was introduced.

Evidence is recorded in `data/research/nuist-programme-details.json` under `internal.evergreenOverviewEvidence`:

- NUIST College of International Education, Brief Introduction: https://gjy.nuist.edu.cn/english/3743/list.htm
- NUIST-WMO Fellowships Education Programme: https://gjy.nuist.edu.cn/english/NUISTwWMOFellowshipsEducationProgram/list.htm
- NUIST Glance at Nanjing: https://gjy.nuist.edu.cn/english/3744/list.htm
- Owner-supplied NUIST admission brochure catalogue, pages 7–11.

All 155 programme records and 21 scholarship source options retain their original cycle and source detail. The overview/highlight import updates the local CMS collection with these internal facts preserved.

## Verification

`scripts/test-university-profile-public.mjs` checks the projection against all three structured brochure payloads and exercises dated cycles, date-of-birth cut-offs, passport provenance, generic deadline clauses, currency amounts, durations, test scores, document validity, private source fields and source immutability.
