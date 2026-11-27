import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const { categorizeLeadSource, formatFriendlySource, getSourceCategoryDef } = await import('../src/lib/lead-sources.ts');
const { filterLeads } = await import('../src/lib/lead-workflow.ts');
const { computeEmployeeKpiReport } = await import('../src/lib/kpi-workflow.ts');

test('Lead source categorization accurately maps all channels', () => {
  assert.equal(categorizeLeadSource('meta_china_march_2027'), 'paid');
  assert.equal(categorizeLeadSource('facebook_campaign_ad'), 'paid');
  assert.equal(categorizeLeadSource('contact_page'), 'organic');
  assert.equal(categorizeLeadSource('homepage_quick_assessment'), 'organic');
  assert.equal(categorizeLeadSource('university_page_scut'), 'organic');
  assert.equal(categorizeLeadSource('quick_contact_modal'), 'organic');
  assert.equal(categorizeLeadSource('whatsapp_direct'), 'whatsapp');
  assert.equal(categorizeLeadSource('wa_chat'), 'whatsapp');
  assert.equal(categorizeLeadSource('office_walkin'), 'in_house');
  assert.equal(categorizeLeadSource('In-House'), 'in_house');
  assert.equal(categorizeLeadSource('b2b_agent'), 'b2b');
  assert.equal(categorizeLeadSource('B2B'), 'b2b');
  assert.equal(categorizeLeadSource('', null, 'B2B'), 'b2b');

  const metaDef = getSourceCategoryDef('paid');
  assert.equal(metaDef.shortLabel, 'Paid Ads');
  assert.equal(formatFriendlySource('meta_china_march_2027'), 'Meta Ads (China March 2027)');
  assert.equal(formatFriendlySource('quick_contact_modal'), 'Quick Contact Modal');
});

test('filterLeads filters by source channels and new quick presets', () => {
  const dummyLeads = [
    {
      id: 'l-1',
      name: 'Rahim',
      email: 'rahim@test.com',
      phone: '01711111111',
      country: 'China',
      status: 'qualified',
      source: 'meta_china_march_2027',
      isApplication: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'l-2',
      name: 'Karim',
      email: 'karim@test.com',
      phone: '01811111111',
      country: 'China',
      status: 'new',
      source: 'contact_page',
      isApplication: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'l-3',
      name: 'Salma',
      email: 'salma@test.com',
      phone: '01911111111',
      country: 'Malaysia',
      status: 'application_started',
      source: 'office_walkin',
      isApplication: true,
      applicationStage: 'documents',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Category filter
  const paidOnly = filterLeads(dummyLeads, {
    search: '', queue: 'all', status: 'all', country: 'all', source: 'cat:paid', sort: 'newest',
  });
  assert.equal(paidOnly.length, 1);
  assert.equal(paidOnly[0].id, 'l-1');

  const organicOnly = filterLeads(dummyLeads, {
    search: '', queue: 'all', status: 'all', country: 'all', source: 'cat:organic', sort: 'newest',
  });
  assert.equal(organicOnly.length, 1);
  assert.equal(organicOnly[0].id, 'l-2');

  // Quick preset: positive_clients
  const positive = filterLeads(dummyLeads, {
    search: '', queue: 'all', status: 'all', country: 'all', source: 'all', sort: 'newest', quickPreset: 'positive_clients',
  });
  assert.equal(positive.length, 1);
  assert.equal(positive[0].id, 'l-1');

  // Quick preset: in_process_apps
  const inProcess = filterLeads(dummyLeads, {
    search: '', queue: 'all', status: 'all', country: 'all', source: 'all', sort: 'newest', quickPreset: 'in_process_apps',
  });
  assert.equal(inProcess.length, 1);
  assert.equal(inProcess[0].id, 'l-3');
});

test('computeEmployeeKpiReport calculates callsLogged, filesOpened, and sourceMetrics', () => {
  const report = computeEmployeeKpiReport({
    month: '2026-11',
    employees: [
      {
        id: 'emp-1',
        empId: 'EDX-01',
        name: 'Shamoyla Narmin',
        role: 'counselor',
        email: 'shamoyla@eduexpressint.com',
        phone: null,
        team: 'counseling',
        specialization: 'China',
        active: true,
        userId: 'user-1',
      },
    ],
    attendances: [],
    dailyLogs: [],
    targets: [],
    tasks: [],
    leads: [
      {
        id: 'lead-1',
        name: 'Student One',
        phone: '01711111111',
        country: 'China',
        status: 'qualified',
        source: 'meta_china_march_2027',
        isApplication: false,
        applicationStage: 'documents',
        assignedTo: 'Shamoyla Narmin',
        assignedEmployeeId: 'emp-1',
        nextFollowup: null,
        gpa: 4.8,
        assessAcademicResults: '4.80',
        createdAt: '2026-11-05T10:00:00Z',
        updatedAt: '2026-11-05T10:00:00Z',
      },
      {
        id: 'lead-2',
        name: 'Student Two',
        phone: '01811111111',
        country: 'China',
        status: 'application_started',
        source: 'meta_china_march_2027',
        isApplication: true,
        applicationStage: 'submitted',
        assignedTo: 'Shamoyla Narmin',
        assignedEmployeeId: 'emp-1',
        nextFollowup: null,
        gpa: 5.0,
        assessAcademicResults: '5.00',
        createdAt: '2026-11-10T10:00:00Z',
        updatedAt: '2026-11-10T10:00:00Z',
      },
    ],
    activities: [
      {
        id: 'act-1',
        type: 'call_logged',
        actorName: 'Shamoyla Narmin',
        actorUserId: 'user-1',
        employeeId: 'emp-1',
        leadId: 'lead-1',
        leadName: 'Student One',
        fromValue: 'Phone Call',
        toValue: 'Positive / Interested',
        details: 'Talked with student',
        createdAt: '2026-11-06T10:00:00Z',
      },
      {
        id: 'act-2',
        type: 'call_logged',
        actorName: 'Shamoyla Narmin',
        actorUserId: 'user-1',
        employeeId: 'emp-1',
        leadId: 'lead-2',
        leadName: 'Student Two',
        fromValue: 'WhatsApp Chat',
        toValue: 'Docs Requested',
        details: 'Sent doc checklist',
        createdAt: '2026-11-07T10:00:00Z',
      },
    ],
  });

  assert.equal(report.employees.length, 1);
  const counselor = report.employees[0];
  assert.equal(counselor.funnel.callsLogged, 2);
  assert.equal(counselor.funnel.filesOpened, 1);
  assert.equal(counselor.funnel.conversionRatePct, 50);

  assert(Array.isArray(report.sourceMetrics));
  assert.equal(report.sourceMetrics.length, 1);
  const metaSource = report.sourceMetrics[0];
  assert.equal(metaSource.source, 'meta_china_march_2027');
  assert.equal(metaSource.totalLeads, 2);
  assert.equal(metaSource.filesOpened, 1);
  assert.equal(metaSource.conversionRatePct, 50);
});
