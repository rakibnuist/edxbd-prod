import test from 'node:test';
import assert from 'node:assert/strict';
import { LEAD_STATUSES, leadCounts, filterLeads, validateLeadUpdate, leadContactLinks } from '../src/lib/lead-workflow.ts';
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
  assert.equal(leadContactLinks({ phone: '', email: '', name: '' }).call, null);
});
