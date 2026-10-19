# China focused guide content

## Scope

The compact study hub links to focused guides instead of repeating all research on one page. Existing URLs are reused:

| Topic | Route | Research migrated |
| --- | --- | --- |
| Admission | `/china-admission-requirements` | Eligibility, universal documents, academic fit, CSCA, preparation sequence, recognition and progression |
| Costs | `/study-in-china-cost-bangladesh` | Published university examples, full-budget checklist, before/in-China costs, scholarships, currency and payment responsibilities |
| Scholarships | `/china-scholarships-bangladesh` | CSC routes, provincial and university awards, actual NUIST coverage examples, conditions, renewal and application preparation |
| Visa | `/china-student-visa-bangladesh` | X1/X2 distinction, study and funding evidence, online process, arrival and residence |
| English proof | `/study-in-china-without-ielts` | MOI alternatives, specific university examples, HSK and separate CSCA checks |
| Student life | `/life-in-china-bangladeshi-students` | Housing, food/faith questions, payments, language, support, living budget and work/internship permission |

`src/data/chinaStudyResearch.json` remains unchanged. Its source chronology, historical examples and source locators are internal research evidence. Published study and fee examples are framed as examples for comparison, never an open admission announcement or a personalised quote. All original currencies and fee periods are preserved. No assumed CNY-to-BDT conversion, broad China-wide living-cost range, fabricated reviewer or approval was added.

`src/data/chinaFocusedGuides.ts` contains the focused records. The existing service-policy record remains in `chinaGuidePages.ts`. Each guide has one content source; no duplicate legacy scholarship record remains. The shared type supports narrative, comparison tables, content cards and preparation steps.

Five static route files use `chinaGuideMetadata` and the shared SSR guide component; scholarship remains served by the existing dynamic route. The metadata helper sets unique absolute titles with the full brand once, description, canonical, Open Graph and Twitter values. The shared component owns visible FAQ and breadcrumb structured data.

## Official legal-source recheck

Checked through the official pages on 19 October 2026, retained internally only:

- Chinese Embassy in Bangladesh, Important Notices for Chinese Visa Application: https://bd.china-embassy.gov.cn/eng/sghd/202509/t20250912_11707745.htm
  - X1 more than 180 days; X2 no more than 180 days.
  - X1 higher-education study confirmation JW201/JW202 and admission letter.
  - Scholarship proof or self-funded bank evidence of at least USD 2,500 per study year. This threshold is explicitly separated from a realistic complete budget.
- Current Dhaka visa centre: https://www.visaforchina.cn/DAC4_EN/
  - Official application, category guidance, passport submission and progress tracking. No fixed turnaround, appointment or fingerprint exemption is asserted in the public guide.
- Dhaka official receipt notice: https://www.visaforchina.cn/DAC3_EN/tongzhigonggao/473055413810630656.html
  - Applicants should request and retain official payment receipts.
- National Immigration Administration, residence permit guidance: https://en.nia.gov.cn/n147423/n147478/n147715/c158270/content.html
  - Where required by the visa, apply for residence permission within 30 days after entry.
  - Off-campus work/internships require university approval and the relevant residence-permit remarks. Student status alone does not authorise them.
- Shanghai Municipal Government, CSCA FAQ: https://english.shanghai.gov.cn/en-FAQs-StudyinShanghai/20251218/134bb78943f640519e2185ff83051f5d.html
  - Teaching-language evidence and academic assessment are separate checks; the university determines the relevant subject and test-language requirements.

No public maintenance timestamp, dated admission-cycle warning or claim of an open offer was added. Source dates and legal evidence remain available internally for maintenance; the guide is a planning explanation, while the university and authority instructions determine an applicant’s exact requirements.
