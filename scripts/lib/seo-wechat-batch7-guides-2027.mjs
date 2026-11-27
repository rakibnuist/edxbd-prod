// 3 WeChat Batch 7 Guides & University Upserts (2027 Admissions)
// Strict zero-competitor, global international audience, rich SEO & LLM support

import { WECHAT_BATCH7_3_GUIDES_DATA } from '../../src/data/newWechatBatch7Guides2027.ts';

export const WECHAT_BATCH7_3_GUIDE_SPECS = Object.values(WECHAT_BATCH7_3_GUIDES_DATA).map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  metaTitle: guide.metaTitle,
  metaDescription: guide.metaDescription,
  excerpt: guide.excerpt,
  category: guide.category,
  categories: guide.categories,
  tags: guide.tags,
  author: guide.author,
  reviewer: guide.reviewer,
  featuredImage: guide.featuredImage,
  sourceUrls: guide.sourceUrls,
  deadlineAt: guide.deadlineAt,
  content: guide.content,
}));

export async function upsertWechatBatch7Universities(prisma) {
  let changes = 0;

  // 1. Hebei University of Technology (HEBUT)
  const hebut = await prisma.university.findUnique({
    where: { slug: 'hebei-university-of-technology' },
  });

  if (hebut) {
    await prisma.university.update({
      where: { id: hebut.id },
      data: {
        chineseName: '河北工业大学',
        cscAgencyNumber: '10080',
        isCscDesignated: true,
        aliases: JSON.stringify(['HEBUT', 'Hebei University of Technology', '河北工业大学', 'Hebei Tech Tianjin']),
        legacySlugs: JSON.stringify(['hebut']),
        city: 'Tianjin',
        province: 'Hebei / Tianjin',
        location: 'Tianjin, China',
      },
    });
    changes++;
    console.log('✓ Synced HEBUT in seo hygiene');
  }

  // 2. Southwestern University of Finance and Economics (SWUFE)
  const swufe = await prisma.university.findUnique({
    where: { slug: 'southwestern-university-of-finance-and-economics' },
  });

  if (swufe) {
    await prisma.university.update({
      where: { id: swufe.id },
      data: {
        chineseName: '西南财经大学',
        cscAgencyNumber: '10651',
        isCscDesignated: true,
        aliases: JSON.stringify(['SWUFE', 'Southwestern University of Finance and Economics', '西南财经大学']),
        legacySlugs: JSON.stringify(['swufe']),
        city: 'Chengdu',
        province: 'Sichuan',
        location: 'Chengdu, Sichuan Province, China',
      },
    });
    changes++;
    console.log('✓ Synced SWUFE in seo hygiene');
  }

  // 3. Nanjing University of Science and Technology (NJUST)
  const njust = await prisma.university.findUnique({
    where: { slug: 'nanjing-university-of-science-and-technology' },
  });

  if (njust) {
    await prisma.university.update({
      where: { id: njust.id },
      data: {
        chineseName: '南京理工大学',
        cscAgencyNumber: '10288',
        isCscDesignated: true,
        aliases: JSON.stringify(['NJUST', 'Nanjing University of Science and Technology', '南京理工大学']),
        legacySlugs: JSON.stringify(['njust']),
        city: 'Nanjing',
        province: 'Jiangsu',
        location: 'Nanjing, Jiangsu Province, China',
      },
    });
    changes++;
    console.log('✓ Synced NJUST in seo hygiene');
  }

  return changes;
}
