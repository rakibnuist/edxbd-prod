import nextEnv from '@next/env';
import mongoose from 'mongoose';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const COLLECTION = 'universityv2s';
const BACKUP_COLLECTION = 'universityv2s_cleanup_backup_20260719';

const duplicatePairs = [
  ['shaoxing-university', 'sxu'],
  ['shanghai-polytechnic-university', 'sspu'],
  ['hubei-university-of-technology', 'hut'],
  ['shanghai-business-school', 'sbs'],
  ['xuzhou-medical-university', 'xzmu'],
  ['taiyuan-university-of-technology', 'tyut'],
];

const canonicalOverrides = {
  'shanghai-polytechnic-university': {
    'details.tuition': '20,000 CNY/Year (Original record)',
  },
  'hubei-university-of-technology': {
    'details.tuition': '7,000 CNY/Year (After scholarship record)',
  },
  'xuzhou-medical-university': {
    degree: ['MBBS', 'Bachelor'],
  },
  'taiyuan-university-of-technology': {
    'details.tuition': '10,000 CNY/Year (Original record)',
  },
};

const cleanText = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const keyFor = value => cleanText(value)
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/\bfees?\b/g, 'fee')
  .replace(/[^a-z0-9]+/g, '');

const uniqueStrings = values => {
  const seen = new Set();
  return (Array.isArray(values) ? values : []).map(cleanText).filter(value => {
    const key = keyFor(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const uniqueObjects = (values, keyFrom) => {
  const seen = new Set();
  return (Array.isArray(values) ? values : []).filter(value => {
    const key = keyFrom(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const cleanCurrency = value => cleanText(value)
  .replace(/\bRMB\b/gi, 'CNY')
  .replace(/\bYuan\b/gi, 'CNY')
  .replace(/\s*[-–—]\s*/g, ' – ')
  .replace(/\/year\b/gi, '/Year')
  .replace(/\s+/g, ' ')
  .trim();

const cleanDegree = value => {
  const key = keyFor(value);
  if (key === 'masters' || key === 'master') return "Master's";
  if (key === 'phd' || key === 'doctorate') return 'PhD';
  if (key === 'bachelors' || key === 'bachelor') return 'Bachelor';
  if (key === 'mbbs' || key === 'medicine') return 'MBBS';
  return cleanText(value);
};

const normalizeDocument = document => {
  const acronymMatch = cleanText(document.name).match(/\s+\(([A-Z0-9-]{2,12})\)\s*$/);
  const name = cleanText(document.name).replace(/\s+\([A-Z0-9-]{2,12}\)\s*$/, '').trim();
  const aliases = uniqueStrings([
    ...(document.aliases || []),
    ...(acronymMatch ? [acronymMatch[1], cleanText(document.name)] : []),
  ]).filter(alias => keyFor(alias) !== keyFor(name));

  const sourceUrls = uniqueStrings(document.sourceUrls);
  const update = {
    name,
    aliases,
    legacySlugs: uniqueStrings(document.legacySlugs).map(value => value.toLowerCase()),
    degree: uniqueStrings(document.degree).map(cleanDegree),
    taught: uniqueStrings(document.taught),
    intake: uniqueStrings(document.intake).map(value => /^(fall\s+2026|september)$/i.test(value) ? 'September 2026' : value),
    'details.majors': uniqueStrings(document.details?.majors),
    'details.tuition': cleanCurrency(document.details?.tuition),
    'details.tuitionDetails': uniqueStrings(document.details?.tuitionDetails).map(cleanCurrency),
    documents: uniqueStrings(document.documents),
    notes: uniqueStrings(document.notes),
    badges: uniqueStrings(document.badges),
    sourceUrls,
    fees: uniqueObjects(document.fees, fee => keyFor(`${fee?.item}|${cleanCurrency(fee?.cost)}|${fee?.notes || ''}`)).map(fee => ({
      item: cleanText(fee.item),
      cost: cleanCurrency(fee.cost),
      ...(cleanText(fee.notes) ? { notes: cleanText(fee.notes) } : {}),
    })),
    scholarships: uniqueObjects(document.scholarships, scholarship => keyFor(`${scholarship?.title}|${scholarship?.amount || ''}|${JSON.stringify(scholarship?.details || [])}`)).map(scholarship => ({
      title: cleanText(scholarship.title),
      ...(cleanText(scholarship.type) ? { type: cleanText(scholarship.type) } : {}),
      details: uniqueStrings(scholarship.details),
      ...(cleanText(scholarship.amount) ? { amount: cleanCurrency(scholarship.amount) } : {}),
      ...(cleanText(scholarship.condition) ? { condition: cleanText(scholarship.condition) } : {}),
    })),
  };

  if (!sourceUrls.length || !document.lastVerifiedAt || !document.verificationExpiresAt) {
    update.verificationStatus = 'under_verification';
  }
  if (!document.relationshipEvidenceUrl) update.relationshipType = 'unverified';
  return update;
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection(COLLECTION);
  const backup = db.collection(BACKUP_COLLECTION);
  const documents = await collection.find({}).toArray();

  await backup.bulkWrite(documents.map(document => ({
    replaceOne: {
      filter: { _id: document._id },
      replacement: {
        ...document,
        _backup: {
          sourceCollection: COLLECTION,
          reason: 'University normalization and duplicate consolidation',
          createdAt: new Date('2026-07-19T00:00:00.000Z'),
        },
      },
      upsert: true,
    },
  })));

  for (const document of documents) {
    await collection.updateOne({ _id: document._id }, { $set: normalizeDocument(document) });
  }

  for (const [canonicalSlug, duplicateSlug] of duplicatePairs) {
    const canonical = await collection.findOne({ slug: canonicalSlug });
    const duplicate = await collection.findOne({ slug: duplicateSlug });
    if (!canonical || !duplicate) continue;

    const duplicateAcronym = cleanText(duplicate.name).match(/\s+\(([A-Z0-9-]{2,12})\)\s*$/)?.[1];
    const aliases = uniqueStrings([
      ...(canonical.aliases || []),
      ...(duplicate.aliases || []),
      cleanText(duplicate.name),
      duplicateAcronym,
    ]).filter(Boolean).filter(alias => keyFor(alias) !== keyFor(canonical.name));

    await collection.updateOne(
      { _id: canonical._id },
      {
        $set: {
          aliases,
          legacySlugs: uniqueStrings([...(canonical.legacySlugs || []), duplicate.slug]),
          verificationStatus: 'under_verification',
          ...(canonicalOverrides[canonicalSlug] || {}),
        },
      },
    );
    await collection.deleteOne({ _id: duplicate._id });
  }

  const finalDocuments = await collection.find({ isActive: true }).toArray();
  const normalizedNames = new Map();
  const collisions = [];
  for (const document of finalDocuments) {
    const key = keyFor(document.name);
    if (normalizedNames.has(key)) collisions.push([normalizedNames.get(key), document.slug]);
    else normalizedNames.set(key, document.slug);
  }

  console.log(JSON.stringify({
    backupCollection: BACKUP_COLLECTION,
    backupCount: await backup.countDocuments(),
    activeRecords: finalDocuments.length,
    removedDuplicateRecords: documents.length - finalDocuments.length,
    remainingNameCollisions: collisions,
    legacyRedirects: finalDocuments.reduce((total, document) => total + (document.legacySlugs?.length || 0), 0),
  }, null, 2));
}

run()
  .finally(() => mongoose.disconnect())
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
