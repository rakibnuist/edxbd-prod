# University indexing readiness

Internal audit of the local CMS and code used by university profiles. This document is not public website copy.

## Current result

All 74 active university records are `under_verification`. None has a university-level verification timestamp or a future verification expiry. Twelve have an official website and linked official research sources; 62 have neither. Therefore zero university profile records currently pass `universityIsIndexable`, and none belongs in the university sitemap. See [the NUIST release handover](NUIST_SEO_READINESS.md) for newly retrieved institutional recognition evidence and the exact remaining steps.

The redesigned pages improve information structure and search metadata. They cannot rank in Google while `noindex` remains in effect. The correct next step is to complete evidence and review for selected profiles, not to remove the indexing gate.

## What the code requires

`src/lib/university-governance.ts` grants profile indexing only when all five conditions hold:

1. `verificationStatus` is `verified`.
2. `officialUrl` is an HTTP(S) URL.
3. `sourceUrls` contains an HTTP(S) source.
4. `lastVerifiedAt` exists.
5. `verificationExpiresAt` is in the future.

The CMS validation for setting `verified` is stricter: it also requires recognition evidence, at least one active programme, source and duration for every active programme, a source for each fee and active scholarship, and supporting evidence for any claimed institutional relationship beyond a public application route. Published cost plans additionally require a source, internal verification timestamp, exact programme and written total.

These checks should remain intact. Passing the limited indexing predicate does not substitute for full CMS validation or the education/compliance review described in the content-governance skill.

## Source-enriched records

Programme gaps count all retained programme rows, including paused historical records. Those counts are not an instruction to reactivate them.

| Slug | Programme rows | Missing programme source / duration | Fee rows missing source | Active scholarships missing source |
| --- | ---: | ---: | ---: | ---: |
| jiangsu-university-of-science-and-technology | 13 | 11 / 11 | 7 | 1 |
| jiangsu-university-of-technology | 4 | 1 / 1 | 6 | 1 |
| zhejiang-normal-university | 12 | 12 / 12 | 6 | 2 |
| nuist | 4 | 0 / 0 | 0 | 0 |
| nuaa | 9 | 3 / 3 | 6 | 1 |
| lyu | 6 | 6 / 6 | 6 | 3 |
| shandong-university | 0 | 0 / 0 | 0 | 0 |
| zhejiang-university | 2 | 0 / 0 | 0 | 0 |
| university-of-shanghai-for-science-and-technology | 1 | 0 / 0 | 0 | 0 |
| tsinghua-university | 0 | 0 / 0 | 0 | 0 |

All ten additionally lack recognition-source, verification timestamp and expiry fields. Several have historical or planned programmes rather than confirmed current applications. Empty programme/fee counts do not establish readiness.

## NUIST corrections completed locally

The scoped source record in `data/research/nuist-official-record-corrections.json` and reversible `scripts/correct-nuist-official-record.mjs` correct the conflicting local NUIST record. It aligns the university and fee relations, replaces unsupported eligibility and renewal claims, supplies programme duration and official source links, and removes the invented cycle-specific deadline. The four listed programmes and scholarship remain `planned`, with current admission availability unconfirmed. Unpublished legacy cost drafts remain private and were not published.

Official sources inspected:

- [Undergraduate catalogue and CSCA requirements](https://gjy.nuist.edu.cn/english/BachelorPrograms_3745/listm.htm)
- [Fees and payment](https://gjy.nuist.edu.cn/english/FeeswPayment/listm.htm)
- [Entry requirements](https://gjy.nuist.edu.cn/english/EntryRequirements/listm.htm)
- [Excellent Freshmen Scholarship and English programme list](https://gjy.nuist.edu.cn/english/NUISTExcellentFreshmenScholarship/listm.htm)
- [University institutional introduction](https://en.nuist.edu.cn/4057/main.psp)

The undergraduate page links a 2027 catalogue PDF, but that attachment could not be retrieved. The scholarship's deadline is shown without a cycle year and cannot validate the previous local 2027 deadline. The official pages differ on some Chinese-language and housing details; scope them to the selected route rather than assuming universal equivalence.

Recognition-source candidates located via a directory's outbound references were the [Ministry of Education national institution list](https://www.moe.gov.cn/jyb_xxgk/s5743/s5744/202606/t20260618_1441074.html) and [second-round Double First-Class notice](https://www.moe.gov.cn/srcsite/A22/s7065/202202/t20220211_598710.html). The primary pages returned a timeout and redirect loop respectively. Their university-specific contents were not independently verified, so neither was added to the CMS as completed recognition evidence.

## Remaining NUIST evidence and review

1. Retrieve and review the exact current catalogue and admission notice, confirming the selected programme, language, campus, duration, tuition and actual intake deadline.
2. Verify the institution against a primary recognition registry and record that URL. Programme-specific licensing recognition must be checked separately where relevant.
3. Reconcile route-specific scholarship, language and room details with the relevant current notice. Record fee recipients/refund terms where confirmed.
4. Complete the education and compliance review; do not invent a reviewer or imply that public-source research completes it.
5. Store truthful verification and expiry values internally, change only evidenced programme statuses, run full CMS verification validation, and then publish the verification decision.
6. Confirm the resulting page returns `index, follow`, the correct canonical and sitemap inclusion; request indexing after deployment if Search Console access is available.

Public source/review timestamps remain suppressed under the project's AGENTS.md. This does not justify inventing or omitting the internal evidence needed for verification.

## Reversibility

The correction script defaults to a dry run. `--apply` writes a field snapshot under `data/research/backups/` before the transaction. `--restore <backup-path>` restores the touched content fields from that snapshot. It never changes verification status, reviewer approval, recognition status or publishes draft cost plans.
