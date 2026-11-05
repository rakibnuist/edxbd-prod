import assert from 'node:assert/strict';
import test from 'node:test';
import { applyScholarshipFeeWaivers, BEFORE_CHINA_FIELDS, buildCostPrefills, buildProgramCostPrefills, calculateClearCost, convertCostTotalsToBdt, convertToBdt, COST_FIELDS, emptyCostValues, IN_CHINA_FIELDS, parseServicePackagePrice, parseSourceFee, readCostNumber, scholarshipScenarioReduction, servicePackageSelection } from '../src/lib/clear-cost.ts';

const scenario = (values = {}) => ({ values: { ...emptyCostValues(), ...values }, scholarshipType: 'fixed', scholarship: '0', tuitionPeriod: 'year', housingPeriod: 'year', housingMonths: '', depositRequired: false, depositCreditedToTuition: false, otherCostsApply: false });
const completeValues = Object.fromEntries(COST_FIELDS.map(field => [field, '0']));

test('the planner has only the two requested payment stages', () => {
  assert.deepEqual(BEFORE_CHINA_FIELDS, ['application', 'deposit', 'service']);
  assert.deepEqual(IN_CHINA_FIELDS, ['tuition', 'housing', 'insurance', 'medical', 'residence', 'other']);
});

test('source parser accepts explicit single matching fees and respects their exact periods', () => {
  assert.equal(parseSourceFee('CNY 15,000 / year (published schedule; confirm selected cycle)', 'CNY', 'year'), 15000);
  assert.equal(parseSourceFee('RMB 600 per year', 'CNY', 'annual'), 600);
  assert.equal(parseSourceFee('USD 400 annually', 'USD', 'annual'), 400);
  assert.equal(parseSourceFee('CNY 500 one-time; non-refundable', 'CNY', 'oneoff'), 500);
  assert.equal(parseSourceFee('CNY 7500 per semester', 'CNY', 'semester'), 7500);
  assert.equal(parseSourceFee('CNY 15000 / programme', 'CNY', 'programme'), 15000);
});

test('source parser rejects ranges, dates, scholarships and ambiguous currency or period', () => {
  for (const text of ['CNY 10,000–15,000 / year', 'CNY 15,000 / year (2026 guide)', '2026 admission fee: CNY 500', 'CNY 5,000 / year after scholarship', 'Full tuition free', 'CNY 15,000 / year, 50% scholarship', 'CNY 15,000 / year or USD 2,100', 'From CNY 15,000 / year', 'CNY -15000 / year', 'CNY 12,34 / year']) assert.equal(parseSourceFee(text, 'CNY', 'annual'), null, text);
  assert.equal(parseSourceFee('USD 15,000 / year', 'CNY', 'annual'), null);
  assert.equal(parseSourceFee('15,000 / year', 'CNY', 'annual'), null);
  assert.equal(parseSourceFee('CNY 600 per semester', 'CNY', 'annual'), null);
  assert.equal(parseSourceFee('CNY 1,000 per month', 'CNY', 'annual'), null);
  assert.equal(parseSourceFee('CNY 1,000 per month', 'CNY', 'monthly'), 1000);
  assert.equal(parseSourceFee('CNY 500 / year', 'CNY', 'oneoff'), null);
  assert.equal(parseSourceFee('CNY 600 per semester', 'CNY', 'programme'), null);
  assert.equal(parseSourceFee('CNY 500 per year / programme', 'CNY', 'programme'), null);
});

test('prefills use the selected course and never guess a room option or combined fees', () => {
  const sourceUrl = 'https://university.edu.cn/admissions';
  const fees = [
    { item: 'Undergraduate tuition', cost: 'CNY 15000 / year', sourceUrl },
    { item: 'Master’s tuition', cost: 'CNY 20000 / year', sourceUrl },
    { item: 'Single-room accommodation', cost: 'CNY 4000 / year', sourceUrl },
    { item: 'Twin-room accommodation', cost: 'CNY 2000–3000 / year', sourceUrl },
    { item: 'Insurance', cost: 'CNY 600 / year', sourceUrl },
    { item: 'Application', cost: 'CNY 500; non-refundable', sourceUrl },
    { item: 'Visa and residence permit', cost: 'CNY 800', sourceUrl },
  ];
  const selected = buildCostPrefills({ name: 'Master of Science', tuition: 'CNY 20000 / year', sourceUrl }, 'CNY', fees, []);
  assert.equal(selected.tuition.value, '20000');
  assert.equal(selected.tuition.period, 'year');
  assert.equal(selected.insurance.value, '600');
  assert.equal(selected.application.value, '500');
  assert.equal(selected.housing, undefined);
  assert.equal(selected.residence, undefined);
  assert.equal(buildCostPrefills({ name: 'Unpriced doctorate' }, 'CNY', fees, []).tuition, undefined);
  assert.equal(buildCostPrefills({ name: 'No source', tuition: 'CNY 15000 / year' }, 'CNY', [], []).tuition, undefined);
  assert.equal(buildCostPrefills({ name: 'Master of Science', tuition: 'CNY 20000 / year', sourceUrl }, 'USD', fees, []).tuition, undefined);
});

test('semester and programme prefills preserve their billing basis', () => {
  const sourceUrl = 'https://university.edu.cn/admissions';
  const semester = buildCostPrefills({ name: 'Language', tuition: 'CNY 7500 per semester', sourceUrl }, 'CNY', [], []);
  assert.equal(semester.tuition.value, '7500');
  assert.equal(semester.tuition.period, 'semester');
  const programme = buildCostPrefills({ name: 'Foundation', tuition: 'CNY 15000 / programme', sourceUrl }, 'CNY', [], []);
  assert.equal(programme.tuition.value, '15000');
  assert.equal(programme.tuition.period, 'programme');
});

test('published cost plan prefills require programme, source, currency and internal validation', () => {
  const plan = { programName: 'Engineering', currency: 'CNY', isPublished: true, sourceUrl: 'https://university.edu.cn/fees', lastVerifiedAt: 'internal', tuitionBeforeScholarship: 'CNY 15000 / year' };
  assert.equal(buildCostPrefills({ name: 'Engineering' }, 'CNY', [], [plan]).tuition.value, '15000');
  assert.equal(buildCostPrefills({ name: 'Business' }, 'CNY', [], [plan]).tuition, undefined);
  assert.equal(buildCostPrefills({ name: 'Engineering' }, 'USD', [], [plan]).tuition, undefined);
  assert.equal(buildCostPrefills({ name: 'Engineering' }, 'CNY', [], [{ ...plan, scholarshipTitle: 'Merit award' }]).tuition, undefined);
  assert.equal(buildCostPrefills({ name: 'Engineering' }, 'CNY', [], [{ ...plan, lastVerifiedAt: undefined }]).tuition, undefined);
});

test('brochure numeric fees preserve programme prices and exclude optional application alternatives', () => {
  const detail = { fees: [
    { key: 'tuition', item: 'Five-month tuition', amount: 8000, currency: 'CNY', period: 'programme' },
    { key: 'application', item: 'Self-funded application', amount: 500, currency: 'CNY', period: 'oneoff' },
    { key: 'application', item: 'Scholarship application', amount: 800, currency: 'CNY', period: 'oneoff', optional: true },
    { key: 'insurance', item: 'Insurance pending confirmation', currency: 'CNY', period: 'programme' },
  ] };
  const values = buildProgramCostPrefills(detail, 'CNY');
  assert.equal(values.tuition.value, '8000');
  assert.equal(values.tuition.period, 'programme');
  assert.equal(values.application.value, '500');
  assert.equal(values.insurance, undefined);
  assert.deepEqual(buildProgramCostPrefills(detail, 'USD'), {});
});

test('brochure prefills never select a room or guess the number of daily fees', () => {
  const room = { key: 'housing', item: 'Room', currency: 'CNY', period: 'year' };
  assert.equal(buildProgramCostPrefills({ fees: [{ ...room, item: 'Twin room', amount: 6000 }, { ...room, item: 'Single room', amount: 12000 }] }, 'CNY').housing, undefined);
  assert.equal(buildProgramCostPrefills({ fees: [{ ...room, amount: 50, period: 'day' }] }, 'CNY').housing, undefined);
  assert.equal(buildProgramCostPrefills({ fees: [{ ...room, amount: -100 }] }, 'CNY').housing, undefined);
});

test('numeric fee helpers retain approximate qualifiers without moving before-China costs to China', () => {
  const fees = [
    { key: 'medical', item: 'Medical examination', amount: 400, currency: 'CNY', period: 'oneoff', stage: 'in_china', notes: 'Approximate; the hospital confirms the final charge.' },
    { key: 'insurance', item: 'Insurance', amount: 800, currency: 'CNY', period: 'year', stage: 'in_china', notes: 'Approximate annual premium.' },
    { key: 'other', item: 'Pre-departure charge', amount: 300, currency: 'CNY', period: 'oneoff', stage: 'before_china' },
  ];
  const values = buildProgramCostPrefills({ fees }, 'CNY');
  assert.equal(values.medical.value, '400');
  assert.ok(values.medical.recorded.includes('Approximate; the hospital confirms the final charge.'));
  assert.ok(values.insurance.recorded.includes('Approximate annual premium.'));
  assert.equal(values.other, undefined);
  const local = buildProgramCostPrefills({ fees: [{ ...fees[2], item: 'Local utilities', stage: 'in_china' }] }, 'CNY');
  assert.equal(local.other.value, '300');
});

test('deposit and other costs are optional; required blank fees remain unknown', () => {
  const unknown = calculateClearCost(scenario());
  assert.equal(unknown.total, 0);
  assert.equal(unknown.isComplete, false);
  assert.equal(unknown.missing.length, COST_FIELDS.length - 2);
  assert.equal(unknown.entries.deposit, 0);
  assert.equal(unknown.entries.other, 0);
  const zero = calculateClearCost(scenario(completeValues));
  assert.equal(zero.total, 0);
  assert.equal(zero.isComplete, true);
  assert.equal(calculateClearCost({ ...scenario(completeValues), depositRequired: true, values: { ...completeValues, deposit: '' } }).isComplete, false);
  assert.equal(calculateClearCost({ ...scenario(completeValues), otherCostsApply: true, values: { ...completeValues, other: '' } }).isComplete, false);
});

test('cash totals split before and in China without scaling tuition periods', () => {
  const base = scenario({ ...completeValues, tuition: '15000', housing: '4000', insurance: '600', application: '500', service: '2500', medical: '400', residence: '800' });
  for (const tuitionPeriod of ['programme', 'semester', 'year']) {
    const result = calculateClearCost({ ...base, tuitionPeriod });
    assert.equal(result.beforeTotal, 3000);
    assert.equal(result.inChinaTotal, 20800);
    assert.equal(result.total, 23800);
    assert.equal(result.isComplete, true);
  }
});

test('monthly housing multiplies only its explicit month count', () => {
  const result = calculateClearCost({ ...scenario({ ...completeValues, housing: '800' }), housingPeriod: 'monthly', housingMonths: '5' });
  assert.equal(result.entries.housing, 4000);
  assert.equal(result.total, 4000);
  for (const housingPeriod of ['programme', 'semester', 'year']) assert.equal(calculateClearCost({ ...scenario({ ...completeValues, housing: '4000' }), housingPeriod, housingMonths: '5' }).entries.housing, 4000);
});

test('daily accommodation needs an explicit day count and does not assume a month length', () => {
  const base = { ...scenario({ ...completeValues, housing: '50' }), housingPeriod: 'daily' };
  assert.equal(calculateClearCost(base).entries.housing, undefined);
  assert.equal(calculateClearCost(base).isComplete, false);
  assert.equal(calculateClearCost({ ...base, housingDays: '151' }).entries.housing, 7550);
  assert.equal(calculateClearCost({ ...base, housingDays: '1.5' }).isComplete, false);
});

test('credited deposit reduces the in-China tuition balance without double counting', () => {
  const base = { ...scenario({ ...completeValues, tuition: '15000', deposit: '3000' }), depositRequired: true };
  const separate = calculateClearCost(base);
  assert.equal(separate.beforeTotal, 3000);
  assert.equal(separate.inChinaTotal, 15000);
  assert.equal(separate.total, 18000);
  const credited = calculateClearCost({ ...base, depositCreditedToTuition: true });
  assert.equal(credited.depositCredit, 3000);
  assert.equal(credited.entries.tuition, 12000);
  assert.equal(credited.beforeTotal, 3000);
  assert.equal(credited.inChinaTotal, 12000);
  assert.equal(credited.total, 15000);
  const afterReduction = calculateClearCost({ ...base, depositCreditedToTuition: true, scholarshipType: 'percent', scholarship: '50' });
  assert.equal(afterReduction.netTuition, 7500);
  assert.equal(afterReduction.entries.tuition, 4500);
  assert.equal(afterReduction.total, 7500);
});

test('excess credited deposit cannot make remaining tuition negative or imply a refund', () => {
  const result = calculateClearCost({ ...scenario({ ...completeValues, tuition: '15000', deposit: '17000' }), depositRequired: true, depositCreditedToTuition: true });
  assert.equal(result.entries.tuition, 0);
  assert.equal(result.depositCredit, 15000);
  assert.equal(result.total, 17000);
  assert.equal(result.depositExceedsTuition, true);
});

test('unknown credited deposit leaves tuition balance uncalculated', () => {
  const result = calculateClearCost({ ...scenario({ ...completeValues, tuition: '15000', deposit: '' }), depositRequired: true, depositCreditedToTuition: true });
  assert.equal(result.entries.tuition, undefined);
  assert.equal(result.isComplete, false);
});

test('fixed and percentage reductions apply only to tuition and cap at full tuition', () => {
  const base = scenario({ ...completeValues, tuition: '15000', housing: '4000', insurance: '600' });
  const percent = calculateClearCost({ ...base, scholarshipType: 'percent', scholarship: '50' });
  assert.equal(percent.entries.tuition, 7500);
  assert.equal(percent.total, 12100);
  const fixed = calculateClearCost({ ...base, scholarship: '20000' });
  assert.equal(fixed.entries.tuition, 0);
  assert.equal(fixed.total, 4600);
  assert.equal(fixed.scholarshipCapped, true);
});

test('invalid amounts and explicit monthly durations make the estimate incomplete', () => {
  for (const raw of ['-10', 'NaN', 'Infinity', '1e9', '1000000000001']) assert.equal(readCostNumber(raw).status, 'invalid', raw);
  const invalid = calculateClearCost({ ...scenario({ ...completeValues, tuition: '-100', housing: '800' }), housingPeriod: 'monthly', housingMonths: '121' });
  assert.equal(invalid.isComplete, false);
  assert.equal(invalid.entries.tuition, undefined);
  assert.equal(invalid.entries.housing, undefined);
  assert.equal(invalid.invalid.length, 2);
  const unconfirmedAward = calculateClearCost({ ...scenario({ ...completeValues, tuition: '15000' }), scholarship: '' });
  assert.equal(unconfirmedAward.entries.tuition, undefined);
  assert.equal(unconfirmedAward.isComplete, false);
});

test('BDT conversion requires a valid manually entered positive rate', () => {
  assert.equal(convertToBdt(32100, ''), null);
  assert.equal(convertToBdt(32100, '-10'), null);
  assert.equal(convertToBdt(32100, '0'), null);
  assert.equal(convertToBdt(32100, '17.5'), 561750);
  assert.equal(convertToBdt(0, '17.5'), 0);
  assert.equal(convertToBdt(Infinity, '17.5'), null);
});

test('published package prices accept South Asian grouping without guessing quotes or ranges', () => {
  for (const price of ['2,00,000 BDT', 'BDT 200,000', '200000 BDT']) assert.deepEqual(parseServicePackagePrice(price), { amount: 200000, currency: 'BDT' });
  assert.deepEqual(parseServicePackagePrice('CNY 2,500'), { amount: 2500, currency: 'CNY' });
  for (const price of ['Written route based quote', 'From 2,00,000 BDT', 'BDT 100000–200000', 'BDT 12,34', 'BDT 200000 or CNY 12000', 'BDT -200000', '200000']) assert.equal(parseServicePackagePrice(price), null, price);
});

test('selecting, changing or clearing a package replaces its exact amount and currency', () => {
  assert.deepEqual(servicePackageSelection('2,00,000 BDT', 'CNY'), { value: '200000', currency: 'BDT' });
  assert.deepEqual(servicePackageSelection('CNY 2500', 'CNY'), { value: '2500', currency: 'CNY' });
  assert.deepEqual(servicePackageSelection('Written route based quote', 'CNY'), { value: '', currency: 'CNY' });
  assert.deepEqual(servicePackageSelection(undefined, 'CNY'), { value: '', currency: 'CNY' });
});

test('a BDT package appears separately from CNY university fees without an assumed rate', () => {
  const mixed = calculateClearCost({ ...scenario({ ...completeValues, tuition: '15000', application: '500', service: '200000' }), currency: 'CNY', serviceCurrency: 'BDT' });
  assert.equal(mixed.entries.service, 200000);
  assert.deepEqual(mixed.beforeCurrencyTotals, { CNY: 500, BDT: 200000 });
  assert.deepEqual(mixed.currencyTotals, { CNY: 15500, BDT: 200000 });
  assert.equal(mixed.beforeTotal, 500);
  assert.equal(mixed.total, 15500);
  assert.equal(mixed.isComplete, true);
  assert.equal(convertCostTotalsToBdt(mixed.currencyTotals, 'CNY', ''), null);
  assert.equal(convertCostTotalsToBdt(mixed.currencyTotals, 'CNY', '17.5'), 471250);
});

test('same-currency package and credited deposit enter cash totals exactly once', () => {
  const same = calculateClearCost({ ...scenario({ ...completeValues, tuition: '15000', application: '500', service: '2500', deposit: '3000' }), currency: 'CNY', serviceCurrency: 'CNY', depositRequired: true, depositCreditedToTuition: true });
  assert.equal(same.beforeTotal, 6000);
  assert.equal(same.inChinaTotal, 12000);
  assert.deepEqual(same.currencyTotals, { CNY: 18000 });
  assert.equal(convertCostTotalsToBdt(same.currencyTotals, 'CNY', '17.5'), 315000);
  const bdt = calculateClearCost({ ...scenario({ ...completeValues, tuition: '15000', application: '500', service: '200000' }), currency: 'BDT', serviceCurrency: 'BDT' });
  assert.deepEqual(bdt.currencyTotals, { BDT: 215500 });
  assert.equal(convertCostTotalsToBdt(bdt.currencyTotals, 'BDT', ''), 215500);
});

test('a quote-only or invalid package stays incomplete and foreign currencies are never silently combined', () => {
  const quote = calculateClearCost({ ...scenario({ ...completeValues, tuition: '15000', service: '' }), currency: 'CNY', serviceCurrency: 'BDT' });
  assert.equal(quote.isComplete, false);
  assert.ok(quote.missing.includes('EduExpress Package'));
  assert.equal(quote.entries.service, undefined);
  assert.equal(convertCostTotalsToBdt({ CNY: 100, USD: 50 }, 'CNY', '17.5'), null);
});

test('scholarship scenarios preserve a fixed award currency and exact tuition period', () => {
  const award = { id: 'award', title: 'Annual award', type: 'fixed', value: 10000, currency: 'CNY', period: 'year' };
  assert.deepEqual(scholarshipScenarioReduction(award, 'CNY', 'year'), { type: 'fixed', value: '10000' });
  assert.equal(scholarshipScenarioReduction(award, 'BDT', 'year'), null);
  assert.equal(scholarshipScenarioReduction(award, 'CNY', 'semester'), null);
  assert.equal(scholarshipScenarioReduction({ ...award, currency: undefined }, 'CNY', 'year'), null);
  assert.equal(scholarshipScenarioReduction({ ...award, period: undefined }, 'CNY', 'year'), null);
  assert.deepEqual(scholarshipScenarioReduction({ ...award, type: 'percent', value: 50 }, 'BDT', 'year'), { type: 'percent', value: '50' });
  assert.equal(scholarshipScenarioReduction({ ...award, value: -10 }, 'CNY', 'year'), null);
});

test('explicit scholarship fee waivers leave deposits, packages and other charges payable', () => {
  const values = { ...completeValues, tuition: '20000', housing: '4000', insurance: '600', application: '500', service: '200000', deposit: '3000', other: '200' };
  const waived = applyScholarshipFeeWaivers(values, ['housing', 'insurance']);
  assert.equal(waived.housing, '0');
  assert.equal(waived.insurance, '0');
  for (const field of ['application', 'deposit', 'service', 'other', 'tuition']) assert.equal(waived[field], values[field]);
  assert.equal(values.housing, '4000');
  const result = calculateClearCost({ ...scenario(waived), currency: 'CNY', serviceCurrency: 'BDT', scholarshipType: 'percent', scholarship: '100', depositRequired: true, otherCostsApply: true });
  assert.deepEqual(result.currencyTotals, { CNY: 3700, BDT: 200000 });
  assert.equal(result.entries.other, 200);
});

test('a housing-only award retains insurance and editable waived charges use the entered amount', () => {
  const values = { ...completeValues, housing: '4000', insurance: '600' };
  const waived = applyScholarshipFeeWaivers(values, ['housing']);
  assert.equal(waived.housing, '0');
  assert.equal(waived.insurance, '600');
  assert.equal(calculateClearCost(scenario({ ...waived, housing: '1000' })).total, 1600);
  assert.deepEqual(applyScholarshipFeeWaivers(values, undefined), values);
});

test('a full tuition waiver resolves the net fee without inventing unpublished gross tuition', () => {
  const full = { ...scenario({ ...completeValues, tuition: '' }), scholarshipType: 'percent', scholarship: '100' };
  const waived = calculateClearCost(full);
  assert.equal(waived.netTuition, 0);
  assert.equal(waived.entries.tuition, 0);
  assert.equal(waived.scholarshipDeduction, null);
  assert.equal(waived.tuitionWaivedWithoutGross, true);
  assert.equal(waived.isComplete, true);
  assert.equal(full.values.tuition, '');
  for (const scholarship of ['50', '150']) {
    const partial = calculateClearCost({ ...full, scholarship });
    assert.equal(partial.netTuition, null);
    assert.ok(partial.missing.includes('Tuition fee'));
    assert.equal(partial.isComplete, false);
  }
  assert.equal(calculateClearCost({ ...full, scholarshipType: 'fixed' }).isComplete, false);
  assert.equal(calculateClearCost({ ...full, values: { ...full.values, tuition: '-1' } }).isComplete, false);
  const deposit = calculateClearCost({ ...full, depositRequired: true, depositCreditedToTuition: true, values: { ...full.values, deposit: '3000' } });
  assert.equal(deposit.total, 3000);
  assert.equal(deposit.depositCredit, 0);
  assert.equal(deposit.depositExceedsTuition, true);
  const unknownDeposit = calculateClearCost({ ...full, depositRequired: true, depositCreditedToTuition: true, values: { ...full.values, deposit: '' } });
  assert.equal(unknownDeposit.entries.tuition, 0);
  assert.equal(unknownDeposit.isComplete, false);
  assert.ok(unknownDeposit.missing.includes('Deposit'));
});

test('accommodation reservation deposits are credited once against the later housing balance', () => {
  const base = { ...scenario({ ...completeValues, application: '400', deposit: '2000', tuition: '26000', housing: '3000', insurance: '800', residence: '400', medical: '400' }), depositRequired: true, depositCreditedToHousing: true };
  const result = calculateClearCost(base);
  assert.equal(result.beforeTotal, 2400);
  assert.equal(result.entries.housing, 1000);
  assert.equal(result.housingDepositCredit, 2000);
  assert.equal(result.entries.tuition, 26000);
  assert.equal(result.total, 31000);
  const excess = calculateClearCost({ ...base, values: { ...base.values, deposit: '5000' } });
  assert.equal(excess.entries.housing, 0);
  assert.equal(excess.depositExceedsHousing, true);
  const missing = calculateClearCost({ ...base, values: { ...base.values, deposit: '' } });
  assert.equal(missing.entries.housing, undefined);
  assert.equal(missing.isComplete, false);
  const both = calculateClearCost({ ...base, depositCreditedToTuition: true });
  assert.equal(both.housingDepositCredit, 0);
  assert.equal(both.depositCredit, 2000);
});
