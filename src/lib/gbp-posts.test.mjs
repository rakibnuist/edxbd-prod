import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const {
  buildGbpWebhookPayload,
  buildGoogleLocalPostPayload,
  buildLinkedInCommentary,
  buildLinkedInCtaUrl,
  buildLinkedInRestPostPayload,
  computeGbpScheduleState,
  selectNextGbpPost,
  validateGbpPostInput,
} = await import('./gbp-posts.ts');

test('validateGbpPostInput rejects phone numbers and banned guarantee phrases while allowing tuition/year numbers', () => {
  const withPhone = validateGbpPostInput({
    slug: 'phone-test',
    topicType: 'STANDARD',
    summary: 'Apply for China March 2027 intake now. Call 01983-333566 for free file assessment.',
    ctaUrl: 'https://eduexpressint.com/china?utm_source=google&utm_medium=organic&utm_campaign=gbp',
  });
  assert.ok(withPhone.error);
  assert.match(withPhone.error, /phone numbers/i);

  const withGuarantee = validateGbpPostInput({
    slug: 'guarantee-test',
    topicType: 'STANDARD',
    summary: 'Apply for March 2027 bachelor programs in China with 100% visa guarantee from Dhaka.',
    ctaUrl: 'https://eduexpressint.com/china',
  });
  assert.ok(withGuarantee.error);
  assert.match(withGuarantee.error, /honesty standards/i);

  const validPost = validateGbpPostInput({
    slug: 'china-march-2027',
    topicType: 'STANDARD',
    title: 'China March 2027 Intake Update',
    summary:
      'Bangladesh students targeting March 2027 Chinese university intakes can verify tuition from CNY 15,000 per year and Student File steps before paying any fee.',
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://eduexpressint.com/china?utm_source=google&utm_medium=organic&utm_campaign=gbp_post',
    mediaUrl: '/images/office/dhanmondi-consultation-desk.webp',
    language: 'en',
  });
  assert.equal(validPost.error, undefined);
  assert.equal(validPost.value.topicType, 'STANDARD');
  assert.equal(validPost.value.slug, 'china-march-2027');
});

test('validateGbpPostInput requires OFFER title <= 58 chars and safe CTA URL', () => {
  const missingTitle = validateGbpPostInput({
    topicType: 'OFFER',
    summary: 'Book a free eligibility review at our Dhanmondi office for China or Malaysia.',
    ctaUrl: 'https://eduexpressint.com/apply',
  });
  assert.ok(missingTitle.error);

  const badUrl = validateGbpPostInput({
    topicType: 'STANDARD',
    summary: 'Review verified universities and BDT 0 service fee options before applying.',
    ctaUrl: 'javascript:alert(1)',
  });
  assert.ok(badUrl.error);
});

test('computeGbpScheduleState handles never-run, 7-day weekly, and 15-day bi-weekly cadence cleanly', () => {
  const now = new Date('2026-11-21T09:00:00Z');
  const firstRun = computeGbpScheduleState(7, null, now);
  assert.equal(firstRun.isDue, true);

  const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  const weeklyNotDue = computeGbpScheduleState(7, sixDaysAgo, now);
  assert.equal(weeklyNotDue.isDue, false);

  const sevenDaysMinus1hAgo = new Date(now.getTime() - (7 * 24 - 1) * 60 * 60 * 1000);
  const weeklyDueGrace = computeGbpScheduleState(7, sevenDaysMinus1hAgo, now);
  assert.equal(weeklyDueGrace.isDue, true);

  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const biweeklyNotDue = computeGbpScheduleState(15, tenDaysAgo, now);
  assert.equal(biweeklyNotDue.cadenceDays, 15);
  assert.equal(biweeklyNotDue.isDue, false);

  const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const biweeklyDue = computeGbpScheduleState(15, fifteenDaysAgo, now);
  assert.equal(biweeklyDue.isDue, true);
});

test('selectNextGbpPost rotates queued posts fairly, picks never-published first, and skips paused/expired', () => {
  const now = new Date('2026-11-21T12:00:00Z');
  const base = {
    topicType: 'STANDARD',
    title: 'Post',
    summary: 'Verified information for Bangladeshi applicants planning overseas study.',
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://eduexpressint.com/china',
    mediaUrl: null,
    offerCouponCode: null,
    offerRedeemUrl: null,
    offerTerms: null,
    startDate: null,
    endDate: null,
    language: 'en',
    category: 'china',
    status: 'queued',
    isRecurring: true,
    publishedCount: 0,
    createdAt: new Date('2026-11-01T00:00:00Z'),
  };

  const posts = [
    { ...base, id: 'p1', slug: 'old-published', sortOrder: 10, lastPublishedAt: new Date('2026-11-10T00:00:00Z'), publishedCount: 2 },
    { ...base, id: 'p2', slug: 'paused-one', sortOrder: 1, status: 'paused', lastPublishedAt: null },
    { ...base, id: 'p3', slug: 'expired-offer', sortOrder: 2, endDate: new Date('2026-11-20T00:00:00Z'), lastPublishedAt: null },
    { ...base, id: 'p4', slug: 'fresh-second', sortOrder: 30, lastPublishedAt: null },
    { ...base, id: 'p5', slug: 'fresh-first', sortOrder: 20, lastPublishedAt: null },
  ];

  const picked1 = selectNextGbpPost(posts, now);
  assert.equal(picked1?.id, 'p5');

  const afterAllPublished = [
    { ...base, id: 'a', slug: 'newer', sortOrder: 10, lastPublishedAt: new Date('2026-11-14T00:00:00Z') },
    { ...base, id: 'b', slug: 'oldest', sortOrder: 20, lastPublishedAt: new Date('2026-11-07T00:00:00Z') },
  ];
  const picked2 = selectNextGbpPost(afterAllPublished, now);
  assert.equal(picked2?.id, 'b');
});

test('buildGoogleLocalPostPayload and buildGbpWebhookPayload produce valid GBP v4 structures', () => {
  const now = new Date('2026-11-21T09:00:00Z');
  const candidate = {
    id: 'post_1',
    slug: 'free-assessment-offer',
    topicType: 'OFFER',
    title: 'Free Study Abroad Assessment',
    summary: 'Book a free eligibility review in Dhanmondi for China or Malaysia before applying.',
    callToAction: 'BOOK',
    ctaUrl: 'https://eduexpressint.com/apply?utm_source=google&utm_medium=organic&utm_campaign=gbp_offer',
    mediaUrl: '/images/office/dhanmondi-brandwall.webp',
    offerCouponCode: null,
    offerRedeemUrl: 'https://eduexpressint.com/apply',
    offerTerms: 'Valid for HSC, A-Level, and Bachelor applicants.',
    startDate: new Date('2026-11-21T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:00Z'),
    language: 'en',
    category: 'offer',
    sortOrder: 10,
    status: 'queued',
    isRecurring: true,
    publishedCount: 0,
    lastPublishedAt: null,
    createdAt: now,
  };

  const google = buildGoogleLocalPostPayload(candidate, now);
  assert.equal(google.topicType, 'OFFER');
  assert.equal(google.media[0].sourceUrl, 'https://eduexpressint.com/images/office/dhanmondi-brandwall.webp');
  assert.equal(google.event.title, 'Free Study Abroad Assessment');
  assert.equal(google.offer.redeemOnlineUrl, 'https://eduexpressint.com/apply');

  const webhook = buildGbpWebhookPayload(candidate, {
    cadenceDays: 15,
    accountId: '101234567890123456789',
    locationId: '16688138993497254676',
    linkedinOrganizationId: '30919158',
    now,
  });
  assert.equal(webhook.cadenceDays, 15);
  assert.equal(webhook.post.slug, 'free-assessment-offer');
  assert.equal(webhook.linkedin.organizationUrn, 'urn:li:organization:30919158');
  assert.equal(webhook.linkedinPostPayload.author, 'urn:li:organization:30919158');
});

test('LinkedIn payload builders rewrite UTM params, enforce organization URN, and reject guarantee claims', () => {
  const liUrl = buildLinkedInCtaUrl(
    'https://eduexpressint.com/study-in-china-from-bangladesh?utm_source=google&utm_medium=organic&utm_campaign=gbp_post',
    'china',
  );
  assert.ok(liUrl.includes('utm_source=linkedin'));
  assert.ok(liUrl.includes('utm_medium=organic_social'));
  assert.ok(liUrl.includes('utm_campaign=linkedin_post_china'));

  const commentary = buildLinkedInCommentary({
    title: 'China March 2027 Intake',
    summary: 'Explore 150 verified Chinese universities with separated CNY tuition and living budgets.',
    ctaUrl: 'https://eduexpressint.com/china-march-2027-intake',
    category: 'china',
    language: 'en',
    linkedinCopy: null,
  });
  assert.ok(commentary.includes('China March 2027 Intake'));
  assert.ok(commentary.includes('#StudyInChina'));
  assert.ok(commentary.includes('utm_source=linkedin'));

  const restPayload = buildLinkedInRestPostPayload(
    {
      title: 'China March 2027 Intake',
      summary: 'Explore 150 verified Chinese universities with separated CNY tuition and living budgets.',
      ctaUrl: 'https://eduexpressint.com/china-march-2027-intake',
      category: 'china',
      language: 'en',
      linkedinCopy: null,
    },
    { organizationId: '30919158' },
  );
  assert.equal(restPayload.author, 'urn:li:organization:30919158');
  assert.equal(restPayload.visibility, 'PUBLIC');
  assert.equal(restPayload.lifecycleState, 'PUBLISHED');
  assert.ok(restPayload.content.article.source.includes('utm_source=linkedin'));

  const badLinkedIn = validateGbpPostInput({
    slug: 'bad-li-copy',
    topicType: 'STANDARD',
    summary: 'Valid summary for GBP with transparent verification rules for Bangladeshi students.',
    ctaUrl: 'https://eduexpressint.com/china',
    targetChannels: 'both',
    linkedinCopy: 'Apply now for 100% visa guarantee to China!',
  });
  assert.ok(badLinkedIn.error);
  assert.match(badLinkedIn.error, /honesty standards/i);
});
