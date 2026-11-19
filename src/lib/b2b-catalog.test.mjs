import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const {
  B2B_FAQS,
  B2B_PROTECTIONS,
  B2B_SERVICE_TRACKS,
  B2B_SOP_STAGES,
  formatPartnershipTypeLabel,
  normalizeB2BPhone,
  validateB2BInquiryInput,
} = await import('./b2b-catalog.ts');

const { buildB2BPartnerTelegramHtml } = await import('./telegram.ts');

test('B2B catalog defines 4 tracks, 5 SOP stages, protections, and FAQs without public USD tables or guarantees', () => {
  assert.equal(B2B_SERVICE_TRACKS.length, 4);
  assert.equal(B2B_SOP_STAGES.length, 5);
  assert.equal(B2B_PROTECTIONS.length, 4);
  assert.ok(B2B_FAQS.length >= 5);

  const combinedText = JSON.stringify({ B2B_SERVICE_TRACKS, B2B_SOP_STAGES, B2B_PROTECTIONS, B2B_FAQS });
  assert.doesNotMatch(combinedText, /\$300|\$400|\$450|\$500/);
  assert.doesNotMatch(combinedText, /100% visa|guaranteed visa|guaranteed admission/i);
});

test('normalizeB2BPhone normalizes local BD numbers, Bengali digits, and international phones', () => {
  assert.equal(normalizeB2BPhone('01712345678').phone, '+8801712345678');
  assert.equal(normalizeB2BPhone('+880 01983-333566').phone, '+8801983333566');
  assert.equal(normalizeB2BPhone('০১৭১২৩৪৫৬৭৮').phone, '+8801712345678');
  assert.equal(normalizeB2BPhone('+60 12-345 6789').phone, '+60123456789');
  assert.ok(normalizeB2BPhone('123').error);
});

test('validateB2BInquiryInput validates payloads, handles honeypot, sanitizes URLs, and computes priority', () => {
  const honeypot = validateB2BInquiryInput({ companyWebsite: 'https://spam.example' });
  assert.equal(honeypot.isHoneypot, true);
  assert.equal(honeypot.data, undefined);

  const missingConsent = validateB2BInquiryInput({
    organizationType: 'consultancy',
    serviceTrack: 'b2b_china_desk',
    companyName: 'Dhaka Scholars Ltd',
    contactPerson: 'Tariqul Islam',
    email: 'tariq@dhakascholars.com',
    phone: '01712345678',
    city: 'Dhaka',
    country: 'Bangladesh',
    targetCountries: ['China', 'Malaysia'],
    monthlyVolume: '11-25',
    motivation: 'We place undergraduate and MBBS students into Chinese universities every March and September.',
    consent: false,
  });
  assert.ok(missingConsent.error);

  const badUrl = validateB2BInquiryInput({
    organizationType: 'consultancy',
    serviceTrack: 'b2b_china_desk',
    companyName: 'Dhaka Scholars Ltd',
    contactPerson: 'Tariqul Islam',
    email: 'tariq@dhakascholars.com',
    phone: '01712345678',
    city: 'Dhaka',
    country: 'Bangladesh',
    website: 'javascript:alert(1)',
    targetCountries: ['China'],
    monthlyVolume: '4-10',
    motivation: 'We place undergraduate students in China and need written SOP terms.',
    consent: true,
  });
  assert.ok(badUrl.error);

  const validHigh = validateB2BInquiryInput({
    organizationType: 'consultancy',
    serviceTrack: 'b2b_china_desk',
    companyName: 'Sylhet Education Hub',
    contactPerson: 'Nadia Rahman',
    email: 'Nadia@SylhetHub.org ',
    phone: '01812345678',
    city: 'Sylhet',
    country: 'Bangladesh',
    website: 'https://sylhethub.org',
    businessRegistrationNumber: 'TRAD-2026-881',
    yearsInBusiness: 4,
    monthlyVolume: '11-25',
    targetCountries: ['China', 'Malaysia'],
    motivation: 'Looking for verified China scholarship processing and Malaysia EMGS co-placement with written non-poaching protection.',
    consent: true,
    consentTimestamp: '2026-11-20T01:40:00.000Z',
    trackingConsent: true,
  });

  assert.equal(validHigh.error, undefined);
  assert.ok(validHigh.data);
  assert.equal(validHigh.data.email, 'nadia@sylhethub.org');
  assert.equal(validHigh.data.phone, '+8801812345678');
  assert.equal(validHigh.data.partnershipType, 'b2b_china_desk');
  assert.equal(validHigh.data.monthlyTarget, 18);
  assert.equal(validHigh.data.priority, 'high');
  assert.equal(validHigh.data.expectedCommission, 'Custom MOU / Written Schedule');
  assert.equal(validHigh.data.website, 'https://sylhethub.org/');

  const validSubAgent = validateB2BInquiryInput({
    organizationType: 'sub_agent',
    serviceTrack: 'b2b_malaysia_desk',
    contactPerson: 'Kamrul Hasan',
    email: 'kamrul@example.com',
    phone: '01911223344',
    city: 'Cumilla',
    country: 'Bangladesh',
    yearsInBusiness: 1,
    monthlyVolume: '1-3',
    targetCountries: ['Malaysia'],
    motivation: 'Independent advisor referring students for Malaysian branch campuses and EMGS files.',
    consent: true,
  });
  assert.equal(validSubAgent.error, undefined);
  assert.ok(validSubAgent.data);
  assert.equal(validSubAgent.data.companyName, 'Kamrul Hasan (Sub-Agent / Independent Advisor)');
  assert.equal(validSubAgent.data.businessType, 'individual');
  assert.equal(validSubAgent.data.priority, 'low');
});

test('formatPartnershipTypeLabel and buildB2BPartnerTelegramHtml render safe partner summaries', () => {
  assert.equal(formatPartnershipTypeLabel('b2b_china_desk'), 'B2B · China Admissions Desk');
  assert.equal(formatPartnershipTypeLabel('individual_agent'), 'Individual Agent');
  assert.equal(formatPartnershipTypeLabel('custom_partner_track'), 'Custom Partner Track');

  const html = buildB2BPartnerTelegramHtml({
    id: 'p_123456',
    companyName: 'Apex <Edu> Ltd',
    contactPerson: 'Tariq & Co',
    phone: '+8801712345678',
    email: 'partner@apex.test',
    city: 'Dhaka',
    country: 'Bangladesh',
    serviceTrackLabel: 'B2B · China Admissions Desk',
    targetCountries: ['China', 'Malaysia'],
    monthlyTarget: 18,
    priority: 'high',
  });

  assert.match(html, /Apex &lt;Edu&gt; Ltd/);
  assert.match(html, /Tariq &amp; Co/);
  assert.match(html, /HIGH PRIORITY/);
  assert.match(html, /https:\/\/eduexpressint\.com\/admin\/partnerships/);
});
