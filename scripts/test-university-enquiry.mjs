import test from 'node:test';
import assert from 'node:assert/strict';
import { validateUniversityEnquiry, universityEnquiryPayload } from '../src/lib/university-enquiry.ts';
const fields = { name: '  Test Student  ', phone: '+880 1700 000000', email: 'STUDENT@example.invalid ', consent: true };
test('enquiry validation accepts international contact data and requires explicit contact consent', () => {
  assert.deepEqual(validateUniversityEnquiry(fields), {});
  assert.equal(Object.keys(validateUniversityEnquiry({ name: '', phone: '123', email: 'invalid', consent: false })).length, 4);
  assert.ok(validateUniversityEnquiry({ ...fields, phone: '+880<script>' }).phone);
  assert.ok(validateUniversityEnquiry({ ...fields, consent: false }).consent);
});
test('the enquiry preserves the chosen university, program, funding and privacy context without advertising consent', () => {
  const payload = universityEnquiryPayload(fields, { university: 'AHUT', country: 'China', program: 'Chemistry', level: 'PhD', scholarship: 'Government scholarship' }, '2026-10-23T06:00:00.000Z');
  assert.equal(payload.name, 'Test Student');
  assert.equal(payload.email, 'student@example.invalid');
  assert.equal(payload.program, 'Chemistry');
  assert.equal(payload.destinationInterest, 'china');
  assert.match(payload.message, /AHUT/);
  assert.match(payload.message, /Government scholarship/);
  assert.match(payload.message, /Study level: PhD/);
  assert.equal(payload.consent, true);
  assert.equal(payload.trackingConsent, false);
  assert.equal(payload.consentTimestamp, '2026-10-23T06:00:00.000Z');
  assert.equal(payload.leadType, 'application');
});
test('an undecided program remains a genuine request for guidance', () => {
  const payload = universityEnquiryPayload(fields, { university: 'Example University', country: 'United Kingdom' }, '2026-10-23T06:00:00.000Z');
  assert.equal(payload.program, 'Help me choose a program');
  assert.equal(payload.destinationInterest, 'uk');
  assert.equal(payload.assessment.subject, '');
});
