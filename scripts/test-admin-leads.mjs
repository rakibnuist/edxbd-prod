import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));
const {
  LEAD_STATUSES,
  leadCounts,
  filterLeads,
  validateLeadUpdate,
  leadContactLinks,
  parseMetaLeadsCsv,
  extractMetaFormFields,
  mapMetaGraphLeadToImportPayload,
} = await import('../src/lib/lead-workflow.ts');
const { validateAdminLeadCreate } = await import('../src/lib/payload-validation.ts');
const rows = [
  { id: 'a', name: 'Sample inquiry A', email: 'a@example.test', phone: '01712345678', country: 'China', program: 'Computer Science', status: 'new', source: 'website', createdAt: '2026-01-01', updatedAt: '2026-01-06' },
  { id: 'b', name: 'Sample inquiry B', email: 'b@example.test', phone: '+447123456789', country: 'UK', status: 'no_response', source: 'assessment', createdAt: '2026-01-02', updatedAt: '2026-01-05' },
  { id: 'c', name: 'Sample inquiry C', email: 'c@example.test', country: 'China', status: 'qualified', source: 'website', createdAt: '2026-01-03', updatedAt: '2026-01-04' },
  { id: 'd', name: 'Sample inquiry D', email: 'd@example.test', country: 'China', status: 'closed', source: 'website', createdAt: '2026-01-04', updatedAt: '2026-01-03' },
];
const defaults = { search: '', queue: 'all', status: 'all', country: 'all', source: 'all', sort: 'newest' };
test('No Response is a single shared, writable workflow state', () => {
  assert.equal(LEAD_STATUSES.filter(([key]) => key === 'no_response').length, 1);
  assert.deepEqual(validateLeadUpdate({ status: 'no_response' }), { data: { status: 'no_response' } });
});
test('queue counts partition all leads, including unanswered and closed enquiries', () => {
  assert.deepEqual(leadCounts(rows), { all: 4, new: 1, no_response: 1, in_progress: 1, closed: 1 });
  assert.deepEqual(leadCounts([]), { all: 0, new: 0, no_response: 0, in_progress: 0, closed: 0 });
});
test('search, queue, country and source filters combine without changing original data', () => {
  assert.deepEqual(filterLeads(rows, { ...defaults, queue: 'no_response' }).map(row => row.id), ['b']);
  assert.deepEqual(filterLeads(rows, { ...defaults, search: 'COMPUTER', country: 'China', source: 'website' }).map(row => row.id), ['a']);
  assert.deepEqual(filterLeads(rows, { ...defaults, status: 'no_response', country: 'China' }), []);
  assert.equal(rows[0].id, 'a');
});
test('sorting uses creation or activity time as selected', () => {
  assert.equal(filterLeads(rows, defaults)[0].id, 'd');
  assert.equal(filterLeads(rows, { ...defaults, sort: 'oldest' })[0].id, 'a');
  assert.equal(filterLeads(rows, { ...defaults, sort: 'updated' })[0].id, 'a');
});
test('updates reject unknown statuses and protected columns while allowing bounded notes', () => {
  for (const data of [{ status: 'invented' }, { id: 'other' }, { consentTimestamp: 'today' }, { notes: 5 }, { notes: 'x'.repeat(12001) }, {}]) assert.ok(validateLeadUpdate(data).error);
  assert.deepEqual(validateLeadUpdate({ notes: '  Follow up by phone  ' }), { data: { notes: 'Follow up by phone' } });
});
test('contact links normalize Bangladeshi numbers and preserve foreign country codes', () => {
  assert.equal(leadContactLinks(rows[0]).whatsapp, 'https://wa.me/8801712345678');
  assert.equal(leadContactLinks(rows[1]).whatsapp, 'https://wa.me/447123456789');
  assert.equal(leadContactLinks({ phone: '+88001639659911', email: '', name: '' }).whatsapp, 'https://wa.me/8801639659911');
  assert.equal(leadContactLinks({ phone: '', email: '', name: '' }).call, null);
});
test('parseMetaLeadsCsv parses Meta Leads Center CSV, normalizes +88001 phones, and orders chronologically', () => {
  const sampleCsv = [
    'Created,Name,Email,Source,Form,Channel,Stage,Owner,Labels,Phone,Secondary phone number,WhatsApp number',
    '11/14/2026 8:28pm,Jibon Chandra Roy,,Paid,WebLead&InstantForm_18_4_2026,Phone,Intake,Unassigned,,+8801846107433,,',
    '11/14/2026 7:33pm,Humayun Kabir,,Paid,WebLead&InstantForm_18_4_2026,Phone,Intake,Unassigned,,+88001639659911,,',
  ].join('\n');
  const parsed = parseMetaLeadsCsv(sampleCsv);
  assert.equal(parsed.length, 2);
  // Oldest first
  assert.equal(parsed[0].name, 'Humayun Kabir');
  assert.equal(parsed[0].phone, '+8801639659911');
  assert.equal(parsed[0].source, 'meta_china_march_2027');
  assert.equal(parsed[0].assignedTeam, 'china');
  assert.equal(parsed[1].name, 'Jibon Chandra Roy');
  assert.equal(parsed[1].phone, '+8801846107433');
});
test('10-digit BD numbers and admin import timestamps normalize cleanly', () => {
  assert.equal(leadContactLinks({ phone: '1712345678', email: '', name: '' }).whatsapp, 'https://wa.me/8801712345678');
  assert.equal(leadContactLinks({ phone: '1712345678', email: '', name: '' }).call, 'tel:+8801712345678');

  const historical = validateAdminLeadCreate({
    name: 'WebLead Student',
    email: 'no-email+8801712345678@leads.eduexpressint.com',
    phone: '+88001712345678',
    country: 'China',
    assignedTeam: 'china',
    consentTimestamp: '2026-11-12T10:00:00.000Z',
  });
  assert.equal(historical.error, undefined);
  assert.equal(historical.data?.phone, '+8801712345678');
  assert.equal(historical.data?.createdAt?.toISOString(), '2026-11-12T10:00:00.000Z');
});

test('extractMetaFormFields and parseMetaLeadsCsv handle WebLead&InstantForm_18_4_2026 Bengali+English labels', () => {
  const fields = extractMetaFormFields({
    'ad_name': 'AD4-NUAA',
    'form_name': 'WebLead&InstantForm_18_4_2026',
    'campaign_name': 'META_Leads_BD_China-Mar2027_2026Q1',
    'সর্বশেষ ডিগ্রি (last degree)': 'HSC / Alim',
    'আপনার নাম (name)': 'Md Amir Hamza',
    'হোয়াটসঅ্যাপ নাম্বার (phone)': '01568387429',
    'রেজাল্ট (gpa)': '4.58',
    'ইংলিশ স্কোর (ielts/duolingo/toefl) - optional': '5.5',
    'phone number': '+8801568387429',
  });
  assert.equal(fields.name, 'Md Amir Hamza');
  assert.equal(fields.phone, '+8801568387429');
  assert.equal(fields.whatsappPhone, '+8801568387429');
  assert.equal(fields.lastDegree, 'HSC / Alim');
  assert.equal(fields.gpa, '4.58');
  assert.equal(fields.englishScore, '5.5');

  const instantCsv = [
    'id,created_time,ad_name,form_name,campaign_name,"সর্বশেষ ডিগ্রি (Last Degree)","আপনার নাম (Name)","হোয়াটসঅ্যাপ নাম্বার (Phone)","রেজাল্ট (GPA)","ইংলিশ স্কোর (IELTS/Duolingo/Toefl) - optional","Phone number"',
    'l:986182003780725_1,2026-11-17T11:57:00+0000,AD4-NUAA,WebLead&InstantForm_18_4_2026,META_Leads_BD_China-Mar2027_2026Q1,"HSC / Alim","Md Amir Hamza","01568387429","4.58","5.5","+8801568387429"',
  ].join('\n');
  const parsedCsv = parseMetaLeadsCsv(instantCsv);
  assert.equal(parsedCsv.length, 1);
  assert.equal(parsedCsv[0].name, 'Md Amir Hamza');
  assert.equal(parsedCsv[0].phone, '+8801568387429');
  assert.equal(parsedCsv[0].assessAcademicLevel, 'HSC / Alim');
  assert.equal(parsedCsv[0].assessAcademicResults, '4.58');
  assert.equal(parsedCsv[0].assessLanguage, '5.5');
  assert.match(parsedCsv[0].message, /Last Degree: HSC \/ Alim/);
  assert.match(parsedCsv[0].message, /GPA: 4\.58/);
  assert.match(parsedCsv[0].message, /Ad: AD4-NUAA/);
});

test('mapMetaGraphLeadToImportPayload converts Graph API field_data from form 986182003780725', () => {
  const mapped = mapMetaGraphLeadToImportPayload({
    id: '153987654321001',
    created_time: '2026-11-17T05:57:00+0000',
    form_id: '986182003780725',
    ad_name: 'AD4-NUAA',
    campaign_name: 'META_Leads_BD_China-Mar2027_2026Q1',
    field_data: [
      { name: 'সর্বশেষ ডিগ্রি (Last Degree)', values: ['HSC / Alim'] },
      { name: 'আপনার নাম (Name)', values: ['Md Sayful Islam Noyon'] },
      { name: 'হোয়াটসঅ্যাপ নাম্বার (Phone)', values: ['01799887766'] },
      { name: 'রেজাল্ট (GPA)', values: ['4.90'] },
      { name: 'ইংলিশ স্কোর (IELTS/Duolingo/Toefl) - optional', values: ['6.0'] },
      { name: 'Phone number', values: ['+8801799887766'] },
    ],
  }, { formName: 'WebLead&InstantForm_18_4_2026' });

  assert.ok(mapped);
  assert.equal(mapped.name, 'Md Sayful Islam Noyon');
  assert.equal(mapped.phone, '+8801799887766');
  assert.equal(mapped.email, 'no-email+8801799887766@leads.eduexpressint.com');
  assert.equal(mapped.assessAcademicLevel, 'HSC / Alim');
  assert.equal(mapped.assessAcademicResults, '4.90');
  assert.equal(mapped.assessLanguage, '6.0');
  assert.equal(mapped.adTrackingConsent, true);
  assert.equal(mapped.consentTimestamp, '2026-11-17T05:57:00.000Z');
  assert.match(mapped.message, /Lead ID: 153987654321001/);
});
