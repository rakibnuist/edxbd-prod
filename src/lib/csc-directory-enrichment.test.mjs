import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const {
  CSC_DIRECTORY_SLUG,
  buildCscDirectoryEnrichment,
  linkCscDirectoryUniversities,
} = await import('./csc-directory-enrichment.ts');

const sampleUniversities = [
  {
    name: 'Nanchang University',
    slug: 'nanchang-university',
    aliases: ['NCU'],
    city: 'Nanchang',
    details: { tuition: 'RMB 16,000-22,000/year' },
    scholarships: [{ title: 'CSC Type B & Jiangxi Government', status: 'active' }],
    verificationStatus: 'verified',
  },
  {
    name: 'University of Science and Technology Beijing',
    slug: 'university-of-science-and-technology-beijing',
    city: 'Beijing',
    details: { tuition: 'RMB 20,000-26,000/year' },
    scholarships: [{ title: 'CSC Type B Postgraduate', status: 'active' }],
    verificationStatus: 'verified',
  },
  {
    name: 'China University of Geosciences (Wuhan)',
    slug: 'china-university-of-geosciences-wuhan',
    city: 'Wuhan',
    verificationStatus: 'verified',
  },
  {
    name: 'China University of Geosciences (Beijing)',
    slug: 'china-university-of-geosciences-beijing',
    city: 'Beijing',
    verificationStatus: 'verified',
  },
  {
    name: 'Invalid Unsafe Slug Univ',
    slug: '../evil/slug',
    city: 'Nowhere',
  },
];

test('linkCscDirectoryUniversities links matched en-name items and preserves unmatched/ambiguous items safely', () => {
  const html = `
    <ol class="university-list-grid">
      <li><span class="en-name">Nanchang University</span></li>
      <li><span class="en-name">University of Science &amp; Technology Beijing</span></li>
      <li><span class="en-name">China University of Geosciences (Wuhan)</span></li>
      <li><span class="en-name">China University of Geosciences</span></li>
      <li><span class="en-name"><a href="/universities/tsinghua-university">Tsinghua University</a></span></li>
      <li><span class="en-name">Unmatched College</span></li>
      <li><span class="en-name">Invalid Unsafe Slug Univ</span></li>
    </ol>
  `;

  const result = linkCscDirectoryUniversities(html, sampleUniversities);

  assert.deepEqual(result.matchedSlugs, [
    'nanchang-university',
    'university-of-science-and-technology-beijing',
    'china-university-of-geosciences-wuhan',
  ]);
  assert.match(result.html, /<a href="\/universities\/nanchang-university"/);
  assert.match(result.html, /<a href="\/universities\/university-of-science-and-technology-beijing"/);
  assert.match(result.html, /<a href="\/universities\/china-university-of-geosciences-wuhan"/);
  // Ambiguous parentless campus must not be auto-linked to an arbitrary campus
  assert.match(result.html, /<span class="en-name">China University of Geosciences<\/span>/);
  // Already-linked span stays untouched without double nesting
  assert.equal((result.html.match(/tsinghua-university/g) || []).length, 1);
  // Unmatched & unsafe slugs remain unlinked
  assert.match(result.html, /<span class="en-name">Unmatched College<\/span>/);
  assert.doesNotMatch(result.html, /\.\.\/evil/);
});

test('buildCscDirectoryEnrichment builds grounded table rows, excludes archived guides, and exposes factual FAQs', () => {
  const updates = [
    {
      title: 'Complete CSC Universities List 2026',
      slug: CSC_DIRECTORY_SLUG,
      archived: false,
      publishedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      title: 'Nanchang University CSC Type B Scholarship 2027 Guide',
      slug: 'nanchang-university-csc-scholarship-2027',
      archived: false,
      publishedAt: '2026-10-15T00:00:00.000Z',
    },
    {
      title: 'Archived Old CSC Call 2024',
      slug: 'old-csc-call-2024',
      archived: true,
      publishedAt: '2024-01-01T00:00:00.000Z',
    },
  ];

  const enrichment = buildCscDirectoryEnrichment(sampleUniversities, updates, ['nanchang-university']);

  assert.equal(enrichment.matchedListCount, 1);
  assert.deepEqual(enrichment.cscGuides, [
    {
      title: 'Nanchang University CSC Type B Scholarship 2027 Guide',
      slug: 'nanchang-university-csc-scholarship-2027',
    },
  ]);

  const ncu = enrichment.featuredUniversities.find((u) => u.slug === 'nanchang-university');
  assert.ok(ncu);
  assert.equal(ncu.city, 'Nanchang');
  assert.equal(ncu.tuitionSummary, 'RMB 16,000-22,000/year');
  assert.equal(ncu.scholarshipSummary, 'CSC Type B & Jiangxi Government');
  assert.equal(ncu.guideSlug, 'nanchang-university-csc-scholarship-2027');

  assert.equal(enrichment.faqs.length, 3);
  for (const faq of enrichment.faqs) {
    assert.doesNotMatch(faq.answer, /100%\s*scholarship|guaranteed\s*visa/i);
  }
});
