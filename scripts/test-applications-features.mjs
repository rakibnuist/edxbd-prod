import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const {
  APPLICATION_TRACKER_STAGES,
  ALLOWED_TRACKER_STAGE_KEYS,
  TRACKER_UNI_STATUSES,
  deriveLeadStatusFromStage,
  getDocsTemplateForDestination,
  getIntakeSortValue,
  getStageBucket,
  getStageDef,
  normalizeTrackerStage,
  validateApplicationPatchPayload,
  validateSafeDriveOrLink,
} = await import('../src/lib/application-tracker.ts');

const { resolvePortalMilestoneStep } = await import('../src/lib/student-portal.ts');

test('Application Tracker defines all 17 stages, 11 university statuses, and accurate stage buckets', () => {
  assert.equal(APPLICATION_TRACKER_STAGES.length, 17);
  assert.equal(TRACKER_UNI_STATUSES.length, 11);
  assert.ok(ALLOWED_TRACKER_STAGE_KEYS.has('pre_admission'));
  assert.ok(ALLOWED_TRACKER_STAGE_KEYS.has('air_ticket'));
  assert.ok(ALLOWED_TRACKER_STAGE_KEYS.has('application_withdraw'));

  assert.equal(normalizeTrackerStage('enrolled'), 'fly');
  assert.equal(normalizeTrackerStage('visa'), 'visa_approved');
  assert.equal(normalizeTrackerStage('review'), 'submitted');
  assert.equal(normalizeTrackerStage(''), 'documents');
  assert.equal(normalizeTrackerStage('unknown_stage_xyz'), 'documents');

  assert.equal(getStageBucket('documents'), 'docs');
  assert.equal(getStageBucket('ready'), 'docs');
  assert.equal(getStageBucket('submitted'), 'submitted');
  assert.equal(getStageBucket('deposit'), 'submitted');
  assert.equal(getStageBucket('admitted'), 'admitted');
  assert.equal(getStageBucket('jw202'), 'admitted');
  assert.equal(getStageBucket('visa_applied'), 'visa');
  assert.equal(getStageBucket('visa_approved'), 'visa');
  assert.equal(getStageBucket('air_ticket'), 'flight');
  assert.equal(getStageBucket('fly'), 'flight');
  assert.equal(getStageBucket('application_withdraw'), 'withdrawn');
  assert.equal(getStageDef('air_ticket').shortLabel, 'Air Ticket');
});

test('getIntakeSortValue orders academic intakes chronologically', () => {
  assert.ok(getIntakeSortValue('September 2027') > getIntakeSortValue('March 2027'));
  assert.ok(getIntakeSortValue('March 2027') > getIntakeSortValue('September 2026'));
  assert.ok(getIntakeSortValue('September 2026') > getIntakeSortValue('March 2026'));
  assert.ok(getIntakeSortValue('Fall 2026') > getIntakeSortValue('Spring 2026'));
  assert.equal(getIntakeSortValue(''), 0);
  assert.equal(getIntakeSortValue(null), 0);
});

test('deriveLeadStatusFromStage and resolvePortalMilestoneStep handle all granular stages', () => {
  assert.equal(deriveLeadStatusFromStage('fly'), 'enrolled');
  assert.equal(deriveLeadStatusFromStage('air_ticket'), 'visa_approved');
  assert.equal(deriveLeadStatusFromStage('visa_applied'), 'visa_applied');
  assert.equal(deriveLeadStatusFromStage('admitted'), 'admission_received');
  assert.equal(deriveLeadStatusFromStage('submitted'), 'application_submitted');
  assert.equal(deriveLeadStatusFromStage('application_withdraw'), 'closed');
  assert.equal(deriveLeadStatusFromStage('documents'), 'application_started');

  assert.equal(resolvePortalMilestoneStep('documents'), 1);
  assert.equal(resolvePortalMilestoneStep('submitted'), 1);
  assert.equal(resolvePortalMilestoneStep('interview'), 2);
  assert.equal(resolvePortalMilestoneStep('pre_admission'), 3);
  assert.equal(resolvePortalMilestoneStep('admitted'), 3);
  assert.equal(resolvePortalMilestoneStep('jw202'), 4);
  assert.equal(resolvePortalMilestoneStep('visa_approved'), 5);
  assert.equal(resolvePortalMilestoneStep('air_ticket'), 5);
  assert.equal(resolvePortalMilestoneStep('fly'), 6);
});

test('getDocsTemplateForDestination returns destination-specific checklists', () => {
  assert.equal(getDocsTemplateForDestination('China').length, 13);
  assert.equal(getDocsTemplateForDestination('china').length, 13);
  assert.equal(getDocsTemplateForDestination('Malta').length, 11);
  assert.equal(getDocsTemplateForDestination('Hungary').length, 11);
  assert.equal(getDocsTemplateForDestination('Malaysia').length, 8);
  assert.equal(getDocsTemplateForDestination('Finland').length, 8);
});

test('validateApplicationPatchPayload enforces safe dates, amounts, stages, and URLs', () => {
  const ok = validateApplicationPatchPayload({
    name: '  MD Saiful Haque  ',
    applicationStage: 'air_ticket',
    embassyStatus: 'Done',
    visaDeadline: '2026-08-15',
    deposit: 25000,
    gpa: 4.75,
    driveLink: 'https://drive.google.com/drive/folders/abc123',
    channelType: 'b2b',
    leadMarket: 'Bangladesh',
  });
  assert.equal(ok.error, undefined);
  assert.equal(ok.data?.name, 'MD Saiful Haque');
  assert.equal(ok.data?.applicationStage, 'air_ticket');
  assert.equal(ok.data?.channelType, 'B2B');
  assert.equal(ok.data?.deposit, 25000);
  assert.equal(ok.data?.gpa, 4.75);

  // Legacy folder label without protocol is permitted, dangerous schemes are blocked
  assert.equal(validateSafeDriveOrLink('MD SAIFUL HAQUE'), 'MD SAIFUL HAQUE');
  const badUrl = validateApplicationPatchPayload({ driveLink: 'javascript:alert(1)' });
  assert.ok(badUrl.error);

  const badStage = validateApplicationPatchPayload({ applicationStage: 'hacked_stage' });
  assert.ok(badStage.error);

  const badDate = validateApplicationPatchPayload({ visaDeadline: '15/08/2026' });
  assert.ok(badDate.error);

  const badDeposit = validateApplicationPatchPayload({ deposit: -500 });
  assert.ok(badDeposit.error);
});

test('Application Tracker API routes & UI enforce RBAC, China isolation, safe URLs, and admin navigation', () => {
  const listRoute = fs.readFileSync('src/app/api/admin/applications/route.ts', 'utf8');
  assert.match(listRoute, /verifyLiveAdminUser/);
  assert.match(listRoute, /verifyLiveStaffUser/);
  assert.match(listRoute, /buildCounselorLeadWhere/);
  assert.match(listRoute, /leadMarket:\s*\{\s*not:\s*'China'\s*\}/);
  assert.match(listRoute, /readLimitedJson/);
  assert.match(listRoute, /no-store, private/);

  const detailRoute = fs.readFileSync('src/app/api/admin/applications/[id]/route.ts', 'utf8');
  assert.match(detailRoute, /verifyLiveAdminUser/);
  assert.match(detailRoute, /verifyLiveStaffUser/);
  assert.match(detailRoute, /canAccessLeadScope/);
  assert.match(detailRoute, /lead\.leadMarket === 'China'/);
  assert.match(detailRoute, /readLimitedJson/);

  const bulkRoute = fs.readFileSync('src/app/api/admin/applications/bulk/route.ts', 'utf8');
  assert.match(bulkRoute, /verifyLiveAdminUser/);
  assert.doesNotMatch(bulkRoute, /verifyLiveStaffUser/);
  assert.match(bulkRoute, /readLimitedJson/);

  const portalRoute = fs.readFileSync('src/app/api/admin/leads/[id]/portal/route.ts', 'utf8');
  assert.match(portalRoute, /export async function DELETE/);
  assert.match(portalRoute, /lead\.leadMarket === 'China'/);

  const layoutSrc = fs.readFileSync('src/app/admin/AdminLayoutClient.tsx', 'utf8');
  assert.match(layoutSrc, /href:\s*'\/admin\/applications'/);
  assert.match(layoutSrc, /COUNSELOR_ALLOWED_PREFIXES[\s\S]*'\/admin\/applications'/);

  for (const uiPath of [
    'src/components/admin/ApplicationTrackerClient.tsx',
    'src/components/admin/ApplicationDetailDrawer.tsx',
  ]) {
    const src = fs.readFileSync(uiPath, 'utf8');
    assert.match(src, /toSafeExternalUrl/, `${uiPath} must sanitize external URLs`);
  }
});
