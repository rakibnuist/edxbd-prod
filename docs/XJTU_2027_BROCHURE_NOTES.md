# Internal XJTU 2027 brochure extraction notes

This is an internal editorial record. Do not expose document locations, source-check dates or review timestamps on public university pages or downloads.

## Source review

Read all pages of the two owner-supplied bilingual brochures. Text was extracted in layout order. The English language-programme page and both foundation trifold pages were rendered and visually inspected, including the fee, eligibility, document and application-window tables.

- `2027年西安交通大学（西安）国际学生汉语进修项目简章-中英(1).pdf`: page 1 Chinese; page 2 English. All programme information appears on both pages.
- `2027西安交通大学预科（中文授课）招生简章-中英文.pdf`: page 1 Chinese; page 2 English. Both pages contain the complete trifold admission guide.

Absolute source paths, page references, extraction checks and the supplied documents' identity are retained in `data/research/xjtu-2027-programmes.json` and the private CMS campaign. No brochure was copied into `public/`.

## Language programme

Four actual options are represented separately: February 2027-July 2027 (semester), February 2027-February 2028 (academic year), September 2027-February 2028 (semester), September 2027-July 2028 (academic year). Exact starts are fixed by the admission letter.

- Application deadlines: 15 January 2027 for spring; 15 August 2027 for autumn. Applications can close early when classes fill.
- Tuition: CNY 8,000 per semester, CNY 15,000 per academic year.
- Application fee: CNY 500 self-funded **or** CNY 800 scholarship application. These are alternatives, never cumulative.
- Registration: CNY 400, separate from tuition and application.
- Entry: above 18, below 45, good health, valid ordinary foreign passport. No minimum entry HSK is printed; placement testing groups students by language proficiency.
- The brochure does not give the language-programme document checklist beyond the passport qualification. The profile says to confirm the full checklist rather than importing the foundation checklist into the language programme.
- 18-22 contact hours per week; core Chinese skills, HSK preparation, electives and cultural activities. Completion provides a transcript/certificate, not a degree or guaranteed bachelor entry.
- On-campus accommodation is required in principle and insurance follows university rules. No amount, room allocation or insurance period is supplied.
- The International Chinese Language Teachers Scholarship can be applied for. No award, coverage amount or guaranteed eligibility was inferred.

## Foundation and conditional progression routes

Six actual combinations are represented: Basic/Advanced/Intensive in the International Foundation Programme and the separate “1+4” Foundation-Bachelor pathway. Humanities/business/social science and science/engineering are study-direction choices within each combination; their published tuition is identical.

| Route | Length | Start | Application window | Tuition for complete foundation course | Entry Chinese |
| --- | --- | --- | --- | --- | --- |
| Basic | 36 weeks | September 2027 | 1 November 2026-15 July 2027 | CNY 25,800 | No prior Chinese requirement |
| Advanced | 18 weeks | February 2027 | 1 October 2026-15 January 2027 | CNY 13,800 | HSK 2-3 or equivalent |
| Intensive | 11 weeks | April 2027 | 1 October 2026-12 March 2027 | CNY 8,800 | HSK 4+ or equivalent |

- IFP: high-school average 60%; 1+4: high-school average 70%. High-school/equivalent diploma, ordinary foreign passport and health requirements apply.
- Age translation differs: Chinese says not exceeding 24; English says under 24. The public qualification requires university confirmation at age 24 and retains the guardian-authorisation rule below 18.
- Standard application fee CNY 500 after initial review; non-refundable regardless of admission. The CNY 800 alternative is specifically for the named Five Central Asian Countries scholarship, not an open scholarship promise to Bangladeshi students.
- Tuition is foundation tuition only. The four-year undergraduate tuition is not included.
- IFP students apply separately for bachelor admission during the foundation course and pass its assessment; completion alone is not an offer.
- 1+4 involves comprehensive review/interview before foundation, then qualifying foundation results, the stated Level 4 Chinese standard and a qualifying valid CSCA result for the intended degree. It is conditional, not unconditional guaranteed entry.
- All degree-specific CSCA subjects still require confirmation for the intended bachelor programme. No test requirement was assigned to the standalone language course.

## Foundation documents

The public programme detail includes the ordinary passport, high-school/equivalent graduation certificate, full high-school and university entrance-examination transcripts, relevant HSK/HSKK evidence, one signed headmaster/teacher reference with contact details, a study plan of at least 600 Chinese characters/English words, Foreigner Physical Examination Record, a non-criminal record with validity stated, guardian authorisation when below 18 and supporting material where available. Chinese/English uploads are required; the application is online with no paper submission.

The Chinese physical-examination entry adds original/notarised copies, six-month validity, photograph and stamp, physician opinion and hospital signature/seal. Its more complete instruction was preserved rather than silently discarded because the English panel is shorter.

## Unknown cost and refund fields

No deposit amount, deposit refund rule, foundation registration fee, foundation insurance amount, medical charge or residence-permit amount is quoted. The profile and calculator must keep these unknown until a written programme-specific quote is available; unknown does not mean zero.

The language brochure links a separate refund policy at `https://sie.xjtu.edu.cn/info/1021/5554.htm`; the page could not be fetched during extraction. No detailed tuition/refund rule was invented. The foundation brochure explicitly makes the application fee non-refundable but supplies no tuition refund schedule.

The linked accommodation page at `https://sie.xjtu.edu.cn/lhzb/zsjs.htm` was inspected. It has several campus/room/booking and renewal rates. No one room/campus can be assigned to these students from the brochures, so those amounts were not automatically inserted as programme fees.

## Identity, governance and import

- Canonical new identity: Xi'an Jiaotong University, slug `xian-jiaotong-university`. This is not Xi'an Shiyou University.
- Brochures state national ShanghaiRanking 2026 position 10; this is not a world ranking. No naked world-rank value was created.
- Program records are Language and Foundation. No unsupported bachelor, master or PhD programme catalogue was generated.
- `scripts/import-xjtu-brochures.mjs` supports `--input <path>` and `--apply`, is local-SQLite-only, validates every fee/period/stage, backs up existing affected records and merges profiles by whole identity/slug.
- Imports retain `under_verification`; no human education, compliance or SEO approval is fabricated.
- Public loader whitelists profile fields and excludes internal files, metadata, sources and maintenance dates. Actual application windows and 2027 intake dates remain public because students need them.
