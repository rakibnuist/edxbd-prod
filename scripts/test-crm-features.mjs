import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const {
  buildWhatsAppUrl,
  formatWaTemplateMessage,
  normalizeWhatsappDigits,
  parseNumericGpa,
} = await import('../src/lib/wa-templates.ts');

const {
  generateToken,
  isAdminRole,
  isStaffRole,
  verifyStaffToken,
  verifyToken,
} = await import('../src/lib/auth.ts');

const {
  FLAGSHIP_MILESTONES,
  portalProgressPct,
  resolvePortalMilestoneStep,
} = await import('../src/lib/student-portal.ts');

const {
  filterLeads,
  validateLeadUpdate,
} = await import('../src/lib/lead-workflow.ts');

const {
  parseScholarshipNoticePayload,
} = await import('../src/lib/scholarship-notice.ts');

const {
  computeEmployeeKpiReport,
  dhakaTodayIso,
  shiftIsoDays,
} = await import('../src/lib/kpi-workflow.ts');

const {
  appendCheckInLocationNote,
  buildGoogleMapsUrl,
  calculateDistanceMeters,
  classifyCheckInLocation,
  DEFAULT_OFFICE_LATITUDE,
  DEFAULT_OFFICE_LONGITUDE,
  DEFAULT_OFFICE_RADIUS_METERS,
  parseCheckInLocationFromNotes,
  resolveAttendanceLocationStatus,
  resolveOfficeGeofenceConfig,
  validateCoordinateInput,
  validateRadiusMetersInput,
} = await import('../src/lib/office-location.ts');

test('WhatsApp templates format BD phones cleanly and generate all 4 Bengali templates', () => {
  assert.equal(normalizeWhatsappDigits('01712345678'), '8801712345678');
  assert.equal(normalizeWhatsappDigits('+88001639659911'), '8801639659911');
  assert.equal(parseNumericGpa(null, 'GPA 4.75 / 5.00'), 4.75);

  const sampleLead = {
    name: 'Md Amir Hamza',
    country: 'China',
    destinationInterest: 'china',
    assessAcademicLevel: 'HSC / Alim',
    assessAcademicResults: '4.58',
    gpa: null,
    degree: null,
  };

  const greeting = formatWaTemplateMessage('initial', sampleLead);
  assert.match(greeting, /Md Amir Hamza/);
  assert.match(greeting, /GPA: 4\.58/);

  const invite = formatWaTemplateMessage('portal_invite', sampleLead, 'https://eduexpressint.com/track/abc12345');
  assert.match(invite, /https:\/\/eduexpressint\.com\/track\/abc12345/);

  const url = buildWhatsAppUrl('01712345678', greeting);
  assert.ok(url?.startsWith('https://wa.me/8801712345678?text='));
});

test('Student portal defines 6 flagship China milestones and resolves progress steps accurately', () => {
  assert.equal(FLAGSHIP_MILESTONES.length, 6);
  assert.equal(resolvePortalMilestoneStep('documents', 'new'), 1);
  assert.equal(resolvePortalMilestoneStep('review', 'application_submitted'), 2);
  assert.equal(resolvePortalMilestoneStep('admitted', 'application_started'), 3);
  assert.equal(resolvePortalMilestoneStep('documents', 'application_started', [{ status: 'admitted' }]), 3);
  assert.equal(resolvePortalMilestoneStep('jw202', 'application_started'), 4);
  assert.equal(resolvePortalMilestoneStep('visa', 'visa_approved'), 5);
  assert.equal(resolvePortalMilestoneStep('air_ticket', 'admission_received'), 5);
  assert.equal(resolvePortalMilestoneStep('fly', 'enrolled'), 6);
  assert.equal(portalProgressPct(3), 50);
  assert.equal(portalProgressPct(6), 100);
});

test('Lead filters support GPA minimum, China hot preset, and strict extended validation', () => {
  const leads = [
    {
      id: 'l1', name: 'High GPA China', email: 'h@test.com', phone: '01711111111',
      country: 'China', status: 'new', source: 'meta_china_march_2027',
      assessAcademicResults: '4.85', gpa: 4.85,
      createdAt: '2026-10-01T10:00:00Z', updatedAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'l2', name: 'Low GPA China', email: 'l@test.com', phone: '01722222222',
      country: 'China', status: 'contacted', source: 'website',
      assessAcademicResults: '3.10', gpa: 3.1,
      createdAt: '2026-11-01T10:00:00Z', updatedAt: '2026-11-01T10:00:00Z',
    },
  ];

  const base = { search: '', queue: 'all', status: 'all', country: 'all', source: 'all', sort: 'newest' };
  assert.deepEqual(filterLeads(leads, { ...base, gpaMin: 3.5 }).map((x) => x.id), ['l1']);
  assert.deepEqual(filterLeads(leads, { ...base, quickPreset: 'china_hot' }).map((x) => x.id), ['l1']);
  assert.deepEqual(filterLeads(leads, { ...base, sort: 'gpa_desc' }).map((x) => x.id), ['l1', 'l2']);

  assert.equal(validateLeadUpdate({ gpa: 4.5, applicationStage: 'jw202', nextFollowup: '2026-12-01' }).data?.applicationStage, 'jw202');
  assert.ok(validateLeadUpdate({ driveLink: 'javascript:alert(1)' }).error);
  assert.ok(validateLeadUpdate({ applicationStage: 'hacked_stage' }).error);
  assert.ok(validateLeadUpdate({ publicToken: 'override-token' }).error);
});

test('KPI & Workflow engine computes 4-pillar composite score and flags SLA bottlenecks cleanly', () => {
  const nowMs = Date.parse('2026-11-18T10:00:00.000Z'); // Wednesday in BD (16:00 Dhaka)
  const today = dhakaTodayIso(nowMs);
  assert.equal(today, '2026-11-18');
  assert.equal(shiftIsoDays(today, -1), '2026-11-17');

  const report = computeEmployeeKpiReport({
    month: '2026-11',
    nowMs,
    employees: [
      { id: 'emp1', empId: 'E-01', name: 'Rakib', role: 'Senior Counselor', email: 'admin@eduexpressint.com', phone: null, team: 'china', specialization: null, active: true, userId: 'u1' },
    ],
    attendances: [
      { id: 'att1', employeeId: 'emp1', empId: 'E-01', date: today, checkIn: '09:45', checkOut: null, hoursWorked: 0, status: 'Present' },
    ],
    dailyLogs: [
      { id: 'log1', employeeId: 'emp1', empId: 'E-01', date: today, accomplishments: 'Called leads', challenges: null, tomorrowPlan: null, metricsJson: null, submittedAt: new Date(nowMs) },
    ],
    targets: [
      { employeeId: 'emp1', consultant: 'Rakib', month: '2026-11', targetLeads: 20, targetEnrolled: 2, targetRevenue: 0, targetDailyActions: 10, targetFollowups: 5, maxSlaHours: 12 },
    ],
    tasks: [
      { id: 't1', title: 'Review files', details: null, assignedTo: 'Rakib', employeeId: 'emp1', assignedBy: 'Admin', dueDate: today, priority: 'high', status: 'done', category: 'counseling', leadId: null, completedAt: new Date(nowMs), createdAt: new Date(nowMs), updatedAt: new Date(nowMs) },
    ],
    leads: [
      { id: 'lead1', name: 'Untouched Student', phone: '+8801711000001', country: 'China', status: 'new', applicationStage: 'documents', assignedTo: 'Rakib', assignedEmployeeId: 'emp1', nextFollowup: null, gpa: 4.6, assessAcademicResults: '4.6', createdAt: new Date(nowMs - 36 * 3600 * 1000), updatedAt: new Date(nowMs - 36 * 3600 * 1000) },
    ],
    activities: [
      { id: 'act1', type: 'note', actorName: 'Rakib', actorUserId: 'u1', employeeId: 'emp1', leadId: null, leadName: null, fromValue: null, toValue: null, details: 'Logged call', createdAt: new Date(nowMs) },
    ],
  });

  assert.equal(report.employees.length, 1);
  const kpi = report.employees[0];
  assert.ok(kpi.score > 0 && kpi.score <= 100);
  assert.equal(kpi.sla.uncontactedOverdue, 1);
  assert.equal(kpi.workflowStage, 'needs_attention');
  assert.equal(report.slaBottlenecks[0]?.issueType, 'untouched_sla');
});

test('Public tracking API routes enforce token check, safe URL validation, and noindex', () => {
  const trackRoute = fs.readFileSync('src/app/api/public/track/[token]/route.ts', 'utf8');
  assert.match(trackRoute, /publicEnabled:\s*true/);
  assert.doesNotMatch(trackRoute, /metaFbc/);
  assert.doesNotMatch(trackRoute, /email:\s*true/);
  assert.doesNotMatch(trackRoute, /student:\s*\{[\s\S]*\bnotes\b/);

  const docRoute = fs.readFileSync('src/app/api/public/track/[token]/documents/[docId]/route.ts', 'utf8');
  assert.match(docRoute, /toSafeExternalUrl/);

  const robots = fs.readFileSync('src/app/robots.ts', 'utf8');
  assert.match(robots, /'\/track\/'/);
});

test('Counselor role permits staff tokens while strictly blocking admin-only JWT verification & routes', () => {
  const prevSecret = process.env.JWT_SECRET;
  try {
    process.env.JWT_SECRET = 'D'.repeat(48);
    assert.equal(isAdminRole('counselor'), false);
    assert.equal(isStaffRole('counselor'), true);
    assert.equal(isStaffRole('user'), false);

    const counselorToken = generateToken({
      userId: 'c1',
      email: 'afsana@eduexpressint.com',
      role: 'counselor',
      tokenVersion: 1,
    });

    // Strict admin verifyToken rejects counselor tokens!
    assert.equal(verifyToken(counselorToken), null);
    // Staff verification accepts counselor tokens cleanly
    assert.equal(verifyStaffToken(counselorToken)?.role, 'counselor');

    // Admin-only routes keep strictly verifyLiveAdminUser without verifyLiveStaffUser fallback
    for (const adminOnlyPath of [
      'src/app/api/admin/users/route.ts',
      'src/app/api/admin/users/[id]/route.ts',
      'src/app/api/admin/settings/route.ts',
      'src/app/api/admin/trust/route.ts',
      'src/app/api/upload/route.ts',
    ]) {
      const src = fs.readFileSync(adminOnlyPath, 'utf8');
      assert.doesNotMatch(src, /verifyLiveStaffUser/, `${adminOnlyPath} must remain strictly admin-only`);
    }

    const alertsSrc = fs.readFileSync('src/lib/alerts.ts', 'utf8');
    assert.match(alertsSrc, /encryptSecret/);
    assert.match(alertsSrc, /decryptSecret/);
    const notifyRoute = fs.readFileSync('src/app/api/admin/notifications/route.ts', 'utf8');
    assert.match(notifyRoute, /isAdminRole/);

    // Verify all lead intake paths no longer forward to legacy external CRM and use native portal/auto-assign
    assert.equal(fs.existsSync('src/lib/crm-sync.ts'), false);
    for (const intakeFile of [
      'src/app/api/leads/route.ts',
      'src/app/api/contact/route.ts',
      'src/app/api/ai/roadmap-pdf/route.ts',
      'src/app/api/webhooks/meta-leads/route.ts',
    ]) {
      const src = fs.readFileSync(intakeFile, 'utf8');
      assert.doesNotMatch(src, /syncLeadToCrm/, `${intakeFile} must not reference retired crm-sync`);
      assert.match(src, /resolveAutoAssignment/, `${intakeFile} must auto-assign leads natively`);
      assert.match(src, /recordNewLeadEffects/, `${intakeFile} must trigger activity log & Telegram alert`);
    }
  } finally {
    if (prevSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevSecret;
  }
});

test('Scholarship notice parser sanitizes HTML, validates source URL, and drafts unpublished updates', () => {
  const skipped = parseScholarshipNoticePayload({ error: 'Upstream timeout' });
  assert.equal(skipped.ok, false);
  if (!skipped.ok) assert.equal(skipped.skipped, true);

  const badUrl = parseScholarshipNoticePayload({
    university_name: 'Zhejiang University',
    source_url: 'javascript:alert(1)',
  });
  assert.equal(badUrl.ok, false);

  const parsed = parseScholarshipNoticePayload(
    {
      university_name: 'Zhejiang University',
      scholarship_types: ['CSC Type B', 'ZJU Graduate Scholarship'],
      target_degrees: ['Master', 'PhD'],
      application_deadline: '2027-03-31',
      stipend_coverage: 'Full tuition + 3,000 CNY/month stipend',
      language_requirements: 'IELTS 6.0 or HSK 5',
      summary: 'ZJU 2027 graduate scholarship <script>alert(1)</script> intake open.',
      source_url: 'https://iczu.zju.edu.cn/',
    },
    new Date('2026-11-20T00:00:00Z'),
  );
  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.equal(parsed.data.slug, 'china-notice-zhejiang-university-2027');
    assert.equal(parsed.data.deadlineAt?.toISOString().slice(0, 10), '2027-03-31');
    assert.doesNotMatch(parsed.data.htmlContent, /<script/i);
    assert.match(parsed.data.htmlContent, /https:\/\/iczu\.zju\.edu\.cn\//);
  }

  const webhookSrc = fs.readFileSync('src/app/api/webhooks/scholarship-notice/route.ts', 'utf8');
  assert.match(webhookSrc, /timingSafeEqual/);
  assert.match(webhookSrc, /isPublished:\s*false/);
  assert.doesNotMatch(webhookSrc, /revalidatePath|announcePublishedUpdate/);
});

test('Office GPS geofencing validates config defaults, classifies office vs remote check-ins, and builds Google Maps links', () => {
  const defaultGeofence = resolveOfficeGeofenceConfig({});
  assert.equal(defaultGeofence.latitude, DEFAULT_OFFICE_LATITUDE);
  assert.equal(defaultGeofence.longitude, DEFAULT_OFFICE_LONGITUDE);
  assert.equal(defaultGeofence.radiusMeters, DEFAULT_OFFICE_RADIUS_METERS);
  assert.equal(defaultGeofence.strictLocation, false);

  assert.equal(validateCoordinateInput('23.7401435', 'lat').normalized, '23.7401435');
  assert.match(validateCoordinateInput('120', 'lat').error || '', /latitude/i);
  assert.match(validateRadiusMetersInput('10').error || '', /between 50 and 10,000/i);

  const distZero = calculateDistanceMeters(
    DEFAULT_OFFICE_LATITUDE,
    DEFAULT_OFFICE_LONGITUDE,
    DEFAULT_OFFICE_LATITUDE,
    DEFAULT_OFFICE_LONGITUDE,
  );
  assert.equal(distZero, 0);

  const inside = classifyCheckInLocation(
    { latitude: 23.7406, longitude: 90.3716, accuracyMeters: 18 },
    defaultGeofence,
  );
  assert.equal(inside.locationType, 'office_location');
  assert.match(inside.locationLabel, /^Office Zone \(\d+m\)$/);
  assert.ok(inside.distanceMeters !== null && inside.distanceMeters < 250);
  assert.equal(inside.mapsUrl, buildGoogleMapsUrl(23.7406, 90.3716));

  const remote = classifyCheckInLocation(
    { latitude: 23.8103, longitude: 90.4125, accuracyMeters: 30 },
    defaultGeofence,
  );
  assert.equal(remote.locationType, 'remote_location');
  assert.match(remote.locationLabel, /^Remote \([\d.]+km away\)$/);

  const denied = classifyCheckInLocation({ locationError: 'denied' }, defaultGeofence);
  assert.equal(denied.locationType, 'location_denied');
  assert.equal(denied.locationLabel, 'GPS Permission Denied');

  const note = appendCheckInLocationNote('Morning shift [IP: 1.2.3.4] · Office Zone (50m)', inside);
  assert.ok(note && note.includes('[LOC:'));
  const parsedCoords = parseCheckInLocationFromNotes(note);
  assert.equal(parsedCoords.accuracyMeters, 18);
  assert.equal(parsedCoords.distanceMeters, inside.distanceMeters);

  const resolved = resolveAttendanceLocationStatus('office_location', note);
  assert.equal(resolved.locationType, 'office_location');
  assert.equal(resolved.locationLabel, inside.locationLabel);
  assert.equal(resolved.mapsUrl, inside.mapsUrl);
});

test('KPI report includes todayLocationType, todayLocationLabel, todayDistanceMeters, and todayMapsUrl from Attendance source & notes', () => {
  const fixedNowMs = Date.parse('2026-11-18T06:00:00Z');
  const today = dhakaTodayIso(fixedNowMs);
  const report = computeEmployeeKpiReport({
    month: today.slice(0, 7),
    nowMs: fixedNowMs,
    employees: [
      {
        id: 'emp_1',
        empId: 'EMP-001',
        name: 'Ayesha Rahman',
        role: 'Senior Counselor',
        email: 'ayesha@eduexpressint.com',
        phone: '01700000001',
        team: 'China Desk',
        specialization: 'China',
        active: true,
        userId: 'usr_1',
      },
      {
        id: 'emp_2',
        empId: 'EMP-002',
        name: 'Tanvir Hasan',
        role: 'Counselor',
        email: 'tanvir@eduexpressint.com',
        phone: '01700000002',
        team: 'Europe Desk',
        specialization: 'Europe',
        active: true,
        userId: 'usr_2',
      },
    ],
    attendances: [
      {
        id: 'att_1',
        employeeId: 'emp_1',
        empId: 'EMP-001',
        date: today,
        checkIn: '10:05',
        checkOut: null,
        hoursWorked: 0,
        status: 'present',
        source: 'office_location',
        notes: '[LOC: 23.74020,90.37140 ±20m | 12m] · Office Zone (12m)',
      },
      {
        id: 'att_2',
        employeeId: 'emp_2',
        empId: 'EMP-002',
        date: today,
        checkIn: '10:40',
        checkOut: null,
        hoursWorked: 0,
        status: 'late',
        source: 'remote_location',
        notes: '[LOC: 23.81030,90.41250 ±35m | 8840m] · Remote (8.84km away)',
      },
    ],
    dailyLogs: [],
    targets: [],
    tasks: [],
    leads: [],
    activities: [],
  });

  const ayesha = report.employees.find((e) => e.employee.empId === 'EMP-001');
  const tanvir = report.employees.find((e) => e.employee.empId === 'EMP-002');
  assert.ok(ayesha);
  assert.ok(tanvir);
  assert.equal(ayesha.attendance.todayLocationType, 'office_location');
  assert.equal(ayesha.attendance.todayLocationLabel, 'Office Zone (12m)');
  assert.equal(ayesha.attendance.todayDistanceMeters, 12);
  assert.equal(ayesha.attendance.todayMapsUrl, 'https://www.google.com/maps?q=23.74020,90.37140');
  assert.equal(tanvir.attendance.todayLocationType, 'remote_location');
  assert.equal(tanvir.attendance.todayLocationLabel, 'Remote (8.84km away)');
  assert.equal(tanvir.attendance.todayDistanceMeters, 8840);
  assert.equal(tanvir.attendance.todayMapsUrl, 'https://www.google.com/maps?q=23.81030,90.41250');
});
