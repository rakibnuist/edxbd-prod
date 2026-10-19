import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { evergreenText, prepareUniversityProfile } from '../src/lib/university-profile-public.ts';

test('evergreen prose removes historical admission windows instead of declaring them open', () => {
  assert.equal(evergreenText('Public university in Nanjing. The 2026 degree-entry cycle is closed; availability for a later intake must be confirmed.'), 'Public university in Nanjing.');
  assert.equal(evergreenText('2026 admission brochure listing. The university-scholarship application deadline was 31 May 2026 and this cycle is closed.'), '');
  assert.equal(evergreenText('Application window: 1 October 2026 - 12 March 2027.'), '');
});

test('age and academic requirements survive removal of fixed date cut-offs', () => {
  assert.equal(evergreenText('Age 16–35 on 1 September 2026; serving teachers may be up to 45.'), 'Age 16–35; serving teachers may be up to 45.');
  assert.equal(evergreenText('For the 2026 cycle: age 18 or above, born before 1 September 2008. Applicants under 18 must supply guardian documents.'), 'age 18 or above. Applicants under 18 must supply guardian documents.');
  assert.equal(evergreenText('Bachelor’s degree, CGPA at least 2.8/4.0 and below age 45 (2026 notice: born after 1 September 1981).'), 'Bachelor’s degree, CGPA at least 2.8/4.0 and below age 45.');
});

test('fee values, programme duration, scores and document validity remain exact', () => {
  assert.equal(evergreenText('Published 2026 tuition: CNY 2000/year or 2000 CNY. TOEFL 80+, IELTS 6.0+; 4 years.'), 'Published tuition: CNY 2000/year or 2000 CNY. TOEFL 80+, IELTS 6.0+; 4 years.');
  assert.equal(evergreenText('3 years or above (2026 brochure)'), '3 years or above');
  assert.equal(evergreenText('Physical examination valid for six months; a study plan of 2000 words.'), 'Physical examination valid for six months; a study plan of 2000 words.');
});

test('fee-range bounds are monetary amounts even when they resemble calendar years', () => {
  for (const fee of ['2000 – 4000 CNY/Year', '1800–2000 CNY per year', 'CNY 1,500–2000/year', '2000 / year CNY', 'CNY 2000/semester']) {
    assert.equal(evergreenText(fee), fee);
  }
});

test('dated guide and catalogue provenance is removed as a complete phrase', () => {
  assert.equal(evergreenText('CNY 23,900 / year (2026 guide)'), 'CNY 23,900 / year');
  assert.equal(evergreenText('CNY 42,800 / year (2026 catalogue)'), 'CNY 42,800 / year');
  assert.equal(evergreenText('CNY 35,000 / year (2026 FAQ)'), 'CNY 35,000 / year');
});

test('passport date provenance is removed while the requested document remains', () => {
  assert.equal(evergreenText('CSC application form and passport photo page (2026 notice requires passport validity beyond April 2027).'), 'CSC application form and passport photo page.');
});

test('application steps retain their action without deadline labels', () => {
  assert.equal(evergreenText('Submit the programme-specific documents by its intake deadline.'), 'Submit the programme-specific documents.');
  assert.equal(evergreenText('The brochure calls this a registration fee; the payment deadline is not specified.'), 'The brochure calls this a registration fee.');
});

test('internal maintenance timestamps and founding years are absent from public prose', () => {
  assert.equal(evergreenText('Sources checked: 19 October 2026'), '');
  assert.equal(evergreenText("A public university founded in 1896 and a member of the C9 League."), 'A public university and a member of the C9 League.');
});

const sourceFiles = ['nuist-programme-details.json', 'xjtu-2027-programmes.json', 'hubei-wenzhou-programmes.json'];
for (const file of sourceFiles) {
  test(`public projection preserves catalogue facts and private source records: ${file}`, async () => {
    const payload = JSON.parse(await readFile(new URL(`../data/research/${file}`, import.meta.url), 'utf8'));
    const snapshot = JSON.stringify(payload);
    for (const original of payload.universities) {
      const result = prepareUniversityProfile({ ...original, privateSource: '/Users/private/brochure.pdf' });
      assert.equal(result.programs.length, original.programs.length);
      for (let i = 0; i < result.programs.length; i++) {
        const program = result.programs[i];
        assert.equal(program.intake, undefined);
        assert.equal(program.deadline, undefined);
        assert.equal(program.periodLabel, undefined);
        assert.deepEqual(program.fees.map(fee => [fee.amount, fee.currency, fee.period]), original.programs[i].fees.map(fee => [fee.amount, fee.currency, fee.period]));
      }
      for (let i = 0; i < (result.scholarshipOptions?.length || 0); i++) {
        const award = result.scholarshipOptions[i];
        assert.equal(award.cycle, undefined);
        assert.equal(award.deadline, undefined);
        assert.equal(award.status, original.scholarshipOptions[i].status);
        assert.deepEqual(award.tuitionReduction, original.scholarshipOptions[i].tuitionReduction);
      }
      const textFields = JSON.stringify(result, (key, value) => ['id', 'programIds', 'status'].includes(key) ? undefined : value);
      assert.doesNotMatch(textFields, /\b(?:2026|2027|2028|1960|1896)\b|deadline|closed admission|application window|Sources checked|\/Users\//i);
    }
    assert.equal(JSON.stringify(payload), snapshot, 'Source payload is unchanged');
  });
}
