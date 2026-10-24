# Medical university directory import

The owner’s 45 institution rows are now University/Program records in the local SQLite database. The first import created 36 institutions and merged 9 by full name or exact Chinese alias. Existing university IDs, slugs, non-medical courses and prior profile content are retained. Chinese and English names support directory search without manufacturing acronym-based identity matches.

`node scripts/import-mbbs-universities.mjs` previews a merge; `--apply` writes a snapshot to `data/research/backups/` and performs the import in a transaction. Re-running the import reuses medical programme and scholarship IDs. It does not replace the whole directory. The earliest `mbbs-universities-*.json` backup contains the pre-import state and the list of created slugs.

- Raw source: `data/research/china-mbbs-workbook.json` retains all five sheets and the original cell values. Counsellor strategies are reference data, not executable instructions.
- Corrections: `data/research/mbbs-directory/source-corrections.json` retains official source URLs, corrected tuition, language, duration and other supported medical programme facts.
- Manifest: `data/research/mbbs-directory/import-manifest.json` maps every workbook row to a canonical university slug and its fee basis.
- Logos: all 45 institutions have local emblem/wordmark assets; `logo-assets.json` retains image provenance. Assets were visually inspected for university identity, including the mainland China institutions with overlapping names.
- Profile CMS: `university-profile-details` stores the merged public programme catalogue and private workbook provenance. Public loaders whitelist fields; original cells, source chronology and editorial records remain internal.

Thirty-five medical tuition records have university-published fee evidence. Ten workbook tuition figures are explicitly planning estimates, have no numeric fee `amount`, and cannot automatically populate ClearCost. Their original values remain intact internally. Peking Health Science Center’s Chinese-taught Clinical Medicine route, Sun Yat-sen’s five-year Chinese route and Nankai’s published Ophthalmological and Optometric Medicine route replace conflicting universal-English-MBBS assumptions. The import does not claim that the workbook is a current MOE-authorised list or that every institution is BMDC approved.

Only supported award records are added. Cash grants and post-registration awards are not converted into automatic upfront tuition waivers. Published freshman tuition-waiver scenarios are scoped to their medical programme and retain first-year and selection conditions. Housing alternatives, monthly rates and per-room prices remain distinct; an unallocated admission deposit is displayed without an inferred tuition credit.

Search titles, descriptions, canonical profiles and Course/CollegeOrUniversity/Breadcrumb schema use the actual medical route. The directory links to medicine search and the MBBS guide. Medical profiles link to the MBBS/BMDC guide, and the six featured guide cards link back to the database profiles. Filter URLs remain noindex,follow.

Indexing follows the existing researched-guide rule. Thirty imported guides currently pass it. Ten estimated-fee profiles and five mixed catalogues with older unsourced programme entries remain excluded from sitemaps until their provenance is complete; their database entries, directory cards and profiles are accessible locally. No verification or editorial date banners are added publicly. No search-rank or licensing approval is inferred from importing data.

Checks: all 45 database identities and server-rendered profile routes; preservation of previous unrelated courses; programme fees and estimates; award calculation isolation; titles/canonicals/schema; private-data isolation; hub/medical-guide links; sitemap parity; browser search/language filters, programme and Apply links. Local changes only; no enquiry was submitted or production database changed.
