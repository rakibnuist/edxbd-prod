#!/usr/bin/env node
/**
 * Idempotently seeds the rotating Google Business Profile (GBP) post queue
 * and default automation cadence settings (`enabled: true`, `cadenceDays: 7`)
 * without overwriting live publish counters, timestamps, or admin edits.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_GBP_POSTS = [
  {
    slug: 'china-march-2027-visa-first-intake',
    topicType: 'STANDARD',
    title: 'China March 2027 Intake & Visa-First Policy',
    summary:
      'Applications are open for March and September 2027 English-taught Bachelor, Master, and MBBS programs across 150 verified Chinese universities. EduExpress International follows a strict Visa-First policy: BDT 0 consultancy service fee before visa approval, with complete JW201/JW202 and X1 visa preparation from our Dhanmondi office.',
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://eduexpressint.com/china?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_china_2027',
    mediaUrl: '/images/gbp/dhanmondi-brandwall.jpg',
    language: 'en',
    category: 'china',
    sortOrder: 10,
    isRecurring: true,
  },
  {
    slug: 'bangladesh-study-abroad-market-2027-en',
    topicType: 'STANDARD',
    title: 'Bangladesh Study Abroad Market Report 2027',
    summary:
      'Compare verified annual tuition, Bangladesh Bank Student File requirements, living costs, and post-O-Level/HSC admission routes across 12 study destinations using primary official data from UNESCO UIS, Open Doors, and Ministry registries before committing to any offer letter.',
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://eduexpressint.com/bangladesh-study-abroad-market?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_bd_market',
    mediaUrl: '/images/gbp/dhanmondi-desk.jpg',
    language: 'en',
    category: 'bangladesh-market',
    sortOrder: 20,
    isRecurring: true,
  },
  {
    slug: 'malaysia-bdt-zero-direct-admission',
    topicType: 'STANDARD',
    title: 'Study in Malaysia with BDT 0 Service Fee',
    summary:
      'Explore direct admissions at 9 verified Malaysian partner universities including Taylor’s, Sunway, APU, and UCSI. Students pay official tuition and EMGS fees directly to the university while receiving BDT 0 consultancy service support from our Dhanmondi counseling team.',
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://eduexpressint.com/malaysia?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_malaysia',
    mediaUrl: '/images/gbp/counselor-office.jpg',
    language: 'en',
    category: 'malaysia',
    sortOrder: 30,
    isRecurring: true,
  },
  {
    slug: 'o-level-ssc-fast-track-china-malaysia',
    topicType: 'STANDARD',
    title: 'Fast-Track Overseas Study After O-Level or SSC',
    summary:
      'Completed O-Level, SSC, or Dakhil in Bangladesh? Review structured Foundation and Diploma pathways in China and Malaysia that let eligible students progress into accredited Engineering, Computing, and Business Bachelor degrees without losing an extra academic year.',
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://eduexpressint.com/study-in-china-after-o-level-ssc?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_olevel',
    mediaUrl: '/images/gbp/dhanmondi-shanghai-wall.jpg',
    language: 'en',
    category: 'o-level',
    sortOrder: 40,
    isRecurring: true,
  },
  {
    slug: 'china-csc-provincial-scholarships-2027',
    topicType: 'STANDARD',
    title: 'Chinese Scholarships & Authentic Cost Calculator',
    summary:
      'Check scholarship eligibility, MoE/BMDC recognition notes, hostel expenses, and realistic family budgets for Chinese universities. Every profile is reviewed honestly against official university rules in Dhanmondi before submitting documents.',
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://eduexpressint.com/study-in-china-from-bangladesh?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_china_guide',
    mediaUrl: '/images/gbp/dhanmondi-reception.jpg',
    language: 'en',
    category: 'china',
    sortOrder: 50,
    isRecurring: true,
  },
  {
    slug: 'bn-bangladesh-study-abroad-guide-2027',
    topicType: 'STANDARD',
    title: 'বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা ২০২৭ গাইড',
    summary:
      'বিদেশে পড়তে যাওয়ার আগে সঠিক বিশ্ববিদ্যালয়, টিউশন ফি, বাংলাদেশ ব্যাংকের স্টুডেন্ট ফাইল ও ভিসা খরচ যাচাই করুন। এসএসসি/ও-লেভেল এবং এইচএসসি/এ-লেভেল শিক্ষার্থীদের জন্য সম্পূর্ণ ফ্যাক্ট-ভিত্তিক রোডম্যাপ এখন আমাদের ওয়েবসাইটে পাওয়া যাচ্ছে।',
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://eduexpressint.com/bn/bangladesh-study-abroad-market?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_bd_bn',
    mediaUrl: '/images/gbp/dhanmondi-brandwall.jpg',
    language: 'bn',
    category: 'bangladesh-market',
    sortOrder: 60,
    isRecurring: true,
  },
  {
    slug: 'bn-china-visa-first-dhanmondi-consultation',
    topicType: 'STANDARD',
    title: 'চীন ভর্তিতে ভিসা-ফার্স্ট নীতি ও ফ্রি মূল্যায়ন',
    summary:
      'চীন পড়াশোনায় অ্যাডমিশন বা ফাইল প্রসেসিংয়ের আগে ভিসা-ফার্স্ট নীতিতে স্বচ্ছ খরচ জানুন। ভিসা হওয়ার আগে কোনো সার্ভিস চার্জ নেই। ধানমন্ডি সাতমসজিদ রোড অফিসে সরাসরি এসে কিংবা অনলাইনে ফ্রি প্রোফাইল মূল্যায়ন বুক করুন।',
    callToAction: 'BOOK',
    ctaUrl: 'https://eduexpressint.com/bn/study-in-china?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_china_bn',
    mediaUrl: '/images/gbp/dhanmondi-desk.jpg',
    language: 'bn',
    category: 'china',
    sortOrder: 70,
    isRecurring: true,
  },
  {
    slug: 'dhanmondi-free-eligibility-assessment-offer',
    topicType: 'OFFER',
    title: 'Free Study Abroad File Review (BDT 0 Check)',
    summary:
      'Book a free 1-on-1 Education Fit & Scholarship Assessment at our Dhanmondi Satmasjid Road office or online. Compare China, Malaysia, and European tuition plans with a clear written cost breakdown before spending on applications.',
    callToAction: 'BOOK',
    ctaUrl: 'https://eduexpressint.com/education-fit-assessment?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_offer',
    mediaUrl: '/images/gbp/counselor-office.jpg',
    offerRedeemUrl: 'https://eduexpressint.com/education-fit-assessment?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_offer',
    offerTerms: 'Open to SSC, O-Level, HSC, A-Level, and Bachelor graduates across Bangladesh. Official university/visa fees paid directly to institutions.',
    language: 'en',
    category: 'offer',
    sortOrder: 80,
    isRecurring: true,
  },
];

const DEFAULT_SETTINGS = [
  ['gbp_autopost_enabled', 'true'],
  ['gbp_autopost_cadence_days', '7'],
  ['gbp_autopost_mode', 'google_api'],
  ['gbp_telegram_notify', 'true'],
];

async function main() {
  for (const [key, value] of DEFAULT_SETTINGS) {
    const existing = await prisma.setting.findUnique({ where: { key } });
    if (!existing) {
      await prisma.setting.create({ data: { key, value } });
    }
  }

  let created = 0;
  let untouched = 0;

  for (const post of DEFAULT_GBP_POSTS) {
    const existing = await prisma.gbpScheduledPost.findUnique({ where: { slug: post.slug } });
    if (!existing) {
      await prisma.gbpScheduledPost.create({
        data: {
          slug: post.slug,
          topicType: post.topicType,
          title: post.title,
          summary: post.summary,
          callToAction: post.callToAction,
          ctaUrl: post.ctaUrl,
          mediaUrl: post.mediaUrl,
          offerRedeemUrl: post.offerRedeemUrl ?? null,
          offerTerms: post.offerTerms ?? null,
          language: post.language,
          category: post.category,
          sortOrder: post.sortOrder,
          status: 'queued',
          isRecurring: post.isRecurring,
        },
      });
      created += 1;
    } else {
      untouched += 1;
    }
  }

  console.log(`GBP seed complete: created=${created}, existing=${untouched}`);
}

main()
  .catch((err) => {
    console.error('GBP seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
