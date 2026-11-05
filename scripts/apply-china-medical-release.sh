#!/bin/sh
set -eu
node scripts/import-xjtu-brochures.mjs --input data/research/ahut-official-programmes.json --apply
node scripts/import-university-rankings.mjs --apply
node scripts/import-china-study-hub.mjs
node scripts/import-china-mbbs-guide.mjs
node scripts/import-mbbs-universities.mjs --apply
node --experimental-strip-types scripts/seed-march-2027-campaign.mjs --create-only
node scripts/import-china-march-campaign-research.mjs
node scripts/consolidate-china-support-package.mjs
npm run db:check
