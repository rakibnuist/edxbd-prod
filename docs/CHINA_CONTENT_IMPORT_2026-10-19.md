# China content expansion — 19 October 2026

The nine supplied reference URLs were reviewed individually. Access results and findings are recorded in `CHINA_REFERENCE_REVIEW_2026-10-19.md`. Competitor sites informed the structure and research topics. Published fee and admission facts were checked against official university or government sources; competitor prose was not copied.

## Local result

- Directory: 72 university records (68 existing plus Shandong University, Zhejiang University, USST and Tsinghua University).
- Ten profiles have additional official-source research: Linyi, NUIST, NUAA, JUST, JSUT, Zhejiang Normal, Shandong, Zhejiang, USST and Tsinghua.
- The China pillar adds detailed guidance and a scoped bibliography of 14 official sources.
- Directory filtering, URL state, comparison and individual profiles read the local database.
- Historical notices are retained as dated research, not silently changed into new-cycle offers.

## Storage and repeatable import

`data/research/china-universities-2026-10-19.json` contains university source research. `src/data/chinaStudyResearch.json` contains the pillar research. They are imported into the existing CMS `IntakeCampaign` entities `china-university-research` and `china-study-research`. Sources, checked dates and next-review dates remain in each payload.

Preview locally:

```sh
node scripts/import-china-research.mjs
```

Apply to the configured local SQLite database:

```sh
node scripts/import-china-research.mjs --apply
```

The script refuses non-SQLite destinations, takes a pre-import snapshot in the operating system temporary directory and reports its path. It adds missing university records and updates linked sources and dated fee summaries. For JUST, JSUT and NUAA, unsupported legacy program rows are retained as paused records and replaced or updated with sourced historical listings. It does not delete existing university records, leads or cost plans. Repeated runs do not duplicate visible program listings.

NUIST's undergraduate tuition was corrected to the official published schedule and unsupported legacy eligibility/deadlines removed from its program records. The source check does not establish new-cycle admission availability. No universal Bangladesh GPA threshold, language exemption, scholarship award or professional recognition was inferred.

## Limits and publication state

This is a local implementation and database import. It does not deploy to the public site. Linked sources do not mean every field in a legacy record has been verified. Full university verification remains under review; the implementation does not fabricate management, counselor or compliance approval. Sources and dated facts should be rechecked before a student applies or pays.

Linyi's official 2026 brochure page was reachable, but the retrieved page did not expose its fee/program tables. The profile links the official route and explicitly requests current confirmation. Shandong and Tsinghua profile pages provide research and official links; exact program catalogues are not yet imported for those institutions.

## Validation

- TypeScript and focused lint checks passed.
- Six directory tests cover matching the same program, legacy fallback, paused records, scholarship status, URL state and comparison limits.
- Local browser checks confirmed city filtering, two-university comparison, Back navigation, filter reset, Linyi's official research and the expanded China guide.
