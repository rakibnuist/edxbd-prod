/** Import structured owner-supplied programme brochures into the local CMS.
 * Preview: node scripts/import-xjtu-brochures.mjs [--input data/research/file.json]
 * Apply: add --apply. Inputs merge by university, never replace the full collection.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });
if (!process.env.DATABASE_URL?.startsWith('file:')) throw new Error('Brochure imports are restricted to a local SQLite database.');
const root = fileURLToPath(new URL('../', import.meta.url));
const inputIndex = process.argv.indexOf('--input');
if (inputIndex >= 0 && (!process.argv[inputIndex + 1] || process.argv[inputIndex + 1].startsWith('--'))) throw new Error('--input requires a JSON path.');
const input = inputIndex >= 0 ? path.resolve(root, process.argv[inputIndex + 1]) : path.join(root, 'data/research/xjtu-2027-programmes.json');
const payload = JSON.parse(await readFile(input, 'utf8'));
const periods = new Set(['programme', 'semester', 'year', 'month', 'oneoff', 'day']);
const keys = new Set(['tuition', 'application', 'deposit', 'housing', 'insurance', 'medical', 'residence', 'other']);
const stringList = value => Array.isArray(value) && value.every(item => typeof item === 'string');
if (payload.schemaVersion !== 1 || !Array.isArray(payload.universities) || !payload.universities.length) throw new Error('Expected schemaVersion 1 and universities.');
for (const item of payload.universities) {
  if (!['slug', 'name', 'city', 'province', 'overview', 'officialUrl'].every(key => typeof item[key] === 'string' && item[key].trim()) || !/^https?:\/\//.test(item.officialUrl) || !Array.isArray(item.programs)) throw new Error(`Incomplete university: ${item.slug}`);
  if (new Set(item.programs.map(program => program.id)).size !== item.programs.length) throw new Error(`Duplicate programme IDs: ${item.slug}`);
  if (item.internal?.replaceScholarshipListing) {
    // Reconcile only supported owner-supplied brochure collections with a complete award list.
    if (!['wzu', 'nuist'].includes(item.slug) || !Array.isArray(item.internal.scholarshipListing) || !item.internal.scholarshipListing.length) throw new Error('Scholarship replacement requires a supported, fully sourced brochure listing.');
    for (const scholarship of item.internal.scholarshipListing) {
      if (!['id', 'title', 'amount', 'condition', 'coverage', 'deadline'].every(key => typeof scholarship[key] === 'string' && scholarship[key].trim()) || !stringList(scholarship.details) || !stringList(scholarship.eligiblePrograms) || scholarship.status !== 'closed') throw new Error('Brochure scholarship reconciliation requires complete facts and a closed cycle.');
    }
  }
  for (const program of item.programs) {
    if (!['id', 'name', 'level', 'duration'].every(key => typeof program[key] === 'string' && program[key].trim()) || !['languages', 'qualifications', 'languageRequirements', 'documents', 'notes'].every(key => stringList(program[key])) || !Array.isArray(program.fees)) throw new Error(`Incomplete programme: ${program.id}`);
    for (const fee of program.fees) {
      if (!keys.has(fee.key) || !periods.has(fee.period) || !['before_china', 'in_china'].includes(fee.stage) || typeof fee.item !== 'string' || typeof fee.currency !== 'string' || (fee.amount !== undefined && (!Number.isFinite(fee.amount) || fee.amount < 0))) throw new Error(`Invalid fee: ${program.id}/${fee.item}`);
    }
  }
}
const normalise = value => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
const readJson = (value, fallback = []) => { try { return JSON.parse(value || 'null') ?? fallback; } catch { return fallback; } };
const periodLabel = { programme: 'programme', semester: 'semester', year: 'year', month: 'month', oneoff: 'one-time', day: 'day' };
const db = new PrismaClient();
try {
  const universities = await db.university.findMany({ include: { programs: true, fees: true, scholarships: true, costPlans: true } });
  const incoming = payload.universities.map(item => {
    const names = [item.name, ...(item.internal?.aliases ?? [])].map(normalise).filter(Boolean);
    const matches = universities.filter(row => row.slug === item.slug || [row.name, ...readJson(row.aliases)].some(name => names.includes(normalise(name))));
    if (matches.length > 1) throw new Error(`Ambiguous university identity; merge requires review: ${item.name}`);
    // Match whole names/aliases only: Xi'an Jiaotong and Xi'an Shiyou are distinct institutions.
    return { item: { ...item, slug: matches[0]?.slug ?? item.slug }, previous: matches[0] };
  });
  if (new Set(incoming.map(({ item }) => item.slug)).size !== incoming.length) throw new Error('Incoming university identities overlap.');
  const campaign = await db.intakeCampaign.findUnique({ where: { slug: 'university-profile-details' } });
  const priorContent = campaign ? readJson(campaign.contentJson, { universities: [] }) : { universities: [] };
  if (!Array.isArray(priorContent.universities)) throw new Error('Existing programme collection is malformed; refusing to overwrite it.');
  console.log(JSON.stringify({ mode: process.argv.includes('--apply') ? 'apply' : 'preview', input: path.relative(root, input), universities: incoming.map(({item,previous}) => ({ slug: item.slug, name: item.name, action: item.internal?.profileOnly ? 'update profile details only' : previous ? 'update programme details' : 'create university', programmes: item.programs.length })) }, null, 2));
  if (process.argv.includes('--apply')) {
    const backupDir = path.join(os.tmpdir(), 'eduexpress-research-backups');
    await mkdir(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `programme-brochures-${Date.now()}.json`);
    await writeFile(backupPath, JSON.stringify({ universities: incoming.map(({previous})=>previous).filter(Boolean), campaign, createdSlugs: incoming.filter(({previous})=>!previous).map(({item})=>item.slug) }, null, 2));
    await db.$transaction(async tx => {
      for (const { item, previous } of incoming) {
        // Profile-only research enriches the detail page without changing a governed catalogue.
        if (item.internal?.profileOnly) {
          if (!previous) throw new Error(`Profile-only import requires an existing university: ${item.slug}`);
          continue;
        }
        const tuitionFees = item.programs.flatMap(program => program.fees.filter(fee => fee.key === 'tuition' && fee.amount !== undefined));
        const tuition = [...new Set(tuitionFees.map(fee => `${fee.currency} ${fee.amount.toLocaleString('en-US')} / ${periodLabel[fee.period]}`))].join('; ') || 'Request a programme-specific fee sheet';
        let universityId = previous?.id;
        if (!universityId) {
          const created = await tx.university.create({ data: {
            slug: item.slug, name: item.name, country: 'China', city: item.city, location: `${item.city}, ${item.province}, China`, officialUrl: item.officialUrl,
            intake: [...new Set(item.programs.map(program => program.intake).filter(Boolean))].join(','), degree: [...new Set(item.programs.map(program=>program.level))].join(','), taught: [...new Set(item.programs.flatMap(program=>program.languages))].join(','),
            majors: [...new Set(item.programs.map(program=>program.name))].join(','), tuition, tuitionDetails:'[]', documents:'[]', notes:JSON.stringify(['Choose a programme for its exact admission and fee conditions.']), badges:'[]', aliases:JSON.stringify(item.internal?.aliases ?? []), legacySlugs:'[]', sourceUrls:JSON.stringify([item.officialUrl]),
            relationshipType:'public_direct_application', verificationStatus:'under_verification', isActive:true,
          } });
          universityId = created.id;
        }
        if (previous && item.internal?.replaceProgramListing) {
          await tx.program.updateMany({ where: { universityId }, data: { status: 'paused' } });
        }
        for (const program of item.programs) {
          const programmeTuition = program.fees.find(fee => fee.key === 'tuition' && fee.amount !== undefined);
          const data = { universityId, level:program.level, name:program.name, subject:program.level === 'Language' ? 'Chinese language' : program.level === 'Foundation' ? 'University preparation' : null, languages:program.languages.join(','), duration:program.duration, intakes:program.intake ?? '', tuition:programmeTuition ? `${programmeTuition.currency} ${programmeTuition.amount.toLocaleString('en-US')} / ${periodLabel[programmeTuition.period]}` : null, applicationDeadline:program.deadline ?? null, eligibility:JSON.stringify([...program.qualifications,...program.languageRequirements]), sourceUrl:item.officialUrl, status:item.internal?.programStatus === 'planned' ? 'planned' : 'active' };
          const deterministicId = `brochure-${item.slug}-${program.id}`;
          const existingProgram = previous?.programs.find(row=>row.id===deterministicId || (row.name===program.name && row.level===program.level));
          await tx.program.upsert({where:{id:existingProgram?.id ?? deterministicId},create:{id:deterministicId,...data},update:data});
        }
        if (item.internal?.replaceScholarshipListing) {
          // Preserve legacy rows for recovery, while removing unsupported active offers.
          await tx.scholarship.updateMany({ where: { universityId }, data: { status: 'closed' } });
          const usedScholarshipIds = new Set();
          for (const scholarship of item.internal.scholarshipListing) {
            const reusable = previous?.scholarships.find(row => row.title === scholarship.title && !usedScholarshipIds.has(row.id))
              ?? previous?.scholarships.find(row => !usedScholarshipIds.has(row.id));
            if (reusable) usedScholarshipIds.add(reusable.id);
            const id = reusable?.id ?? `brochure-scholarship-${item.slug}-${scholarship.id}`;
            const data = { universityId, title: scholarship.title, type: scholarship.type ?? null,
              details: JSON.stringify(scholarship.details), amount: scholarship.amount, condition: scholarship.condition,
              eligiblePrograms: JSON.stringify(scholarship.eligiblePrograms), coverage: scholarship.coverage,
              renewal: scholarship.renewal ?? null, deadline: scholarship.deadline, status: 'closed', sourceUrl: item.officialUrl };
            await tx.scholarship.upsert({ where: { id }, create: { id, ...data }, update: data });
          }
        }
        // Directory summaries must describe the imported choices and their real cycles.
        await tx.university.update({ where: { id: universityId }, data: {
          ...(item.slug === 'nuist' && item.internal?.recognitionAuthority && item.internal?.recognitionSourceUrl ? { recognitionAuthority: item.internal.recognitionAuthority, recognitionSourceUrl: item.internal.recognitionSourceUrl } : {}),
          degree: [...new Set(item.programs.map(program => program.level))].join(','),
          intake: [...new Set(item.programs.map(program => program.intake).filter(Boolean))].join(','),
          taught: [...new Set(item.programs.flatMap(program => program.languages))].join(','),
          majors: [...new Set(item.programs.map(program => program.name))].join(','),
          tuition, tuitionDetails: JSON.stringify([...new Set(tuitionFees.map(fee => `${fee.currency} ${fee.amount.toLocaleString('en-US')} / ${periodLabel[fee.period]}`))]),
          deadlineApplication: [...new Set(item.programs.map(program => program.deadline).filter(Boolean))].length === 1 ? item.programs[0].deadline : 'Varies by programme',
          deadlineStartDate: [...new Set(item.programs.map(program => program.intake).filter(Boolean))].join('; '),
        } });
      }
      const mergedProfiles = new Map(priorContent.universities.map(profile=>[profile.slug,profile]));
      for (const { item } of incoming) mergedProfiles.set(item.slug, item);
      const imports = Array.isArray(priorContent.internal?.imports) ? priorContent.internal.imports : [];
      const importKey = path.relative(root, input);
      const nextContent = { schemaVersion:1, universities:[...mergedProfiles.values()], internal:{...priorContent.internal,imports:[...imports.filter(entry=>entry.input!==importKey),{input:importKey,...payload.internal}]} };
      const data = { title:'University programme details', destination:'China', intake:'Programme-specific admission cycles; see each option', contentJson:JSON.stringify(nextContent), sourceLabel:'Owner-supplied brochures; sources and extraction checks retained internally', verificationStatus:'under_verification', lastReviewedAt: new Date(), isPublished:true };
      await tx.intakeCampaign.upsert({where:{slug:'university-profile-details'},create:{slug:'university-profile-details',...data},update:data});
    });
    console.log(`Imported local programme details. Pre-import snapshot: ${backupPath}`);
  }
} finally { await db.$disconnect(); }
