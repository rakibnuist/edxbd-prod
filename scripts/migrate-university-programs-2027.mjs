import nextEnv from '@next/env';
import mongoose from 'mongoose';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const COLLECTION = 'universityv2s';
const BACKUP_COLLECTION = 'universityv2s_program_backup_20260719';

const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const keyFor = value => clean(value).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '');
const unique = values => Array.from(new Map((Array.isArray(values) ? values : []).map(value => [keyFor(value), clean(value)])).values()).filter(Boolean);

const moveCycleTo2027 = value => {
  if (typeof value === 'string') return value.replace(/2026/g, '2027');
  if (Array.isArray(value)) return value.map(moveCycleTo2027);
  if (value && typeof value === 'object' && !(value instanceof Date) && !(value instanceof mongoose.Types.ObjectId)) {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, moveCycleTo2027(child)]));
  }
  return value;
};

const levelFor = (major, degrees) => {
  if (/mbbs|clinical medicine|medicine and surgery/i.test(major) && degrees.includes('MBBS')) return 'MBBS';
  if (/master|msc|mba/i.test(major) && degrees.includes("Master's")) return "Master's";
  return degrees[0] || 'Bachelor';
};

const tuitionFor = (major, document) => {
  const details = document.details?.tuitionDetails || [];
  const majorKey = keyFor(major).replace(/years?\d*/g, '');
  const match = details.find(detail => {
    const label = clean(detail).split(':')[0];
    const labelKey = keyFor(label);
    return labelKey && (majorKey.includes(labelKey) || labelKey.includes(majorKey));
  });
  return match?.includes(':') ? clean(match.slice(match.indexOf(':') + 1)) : clean(document.details?.tuition);
};

const eligibilityFrom = notes => unique((notes || []).filter(note => /hsc|gpa|requirement|ielts|toefl|duolingo|det|efset|moi|age|csca|diploma|a level/i.test(note)));

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection(COLLECTION);
  const backup = db.collection(BACKUP_COLLECTION);
  const documents = await collection.find({ isActive: true }).toArray();

  await backup.bulkWrite(documents.map(document => ({
    replaceOne: {
      filter: { _id: document._id },
      replacement: {
        ...document,
        _backup: {
          sourceCollection: COLLECTION,
          reason: '2027 cycle update and structured program migration',
          createdAt: new Date('2026-07-19T00:00:00.000Z'),
        },
      },
      upsert: true,
    },
  })));

  for (const original of documents) {
    const document = moveCycleTo2027(original);
    const degrees = unique(document.degree).map(level => level === 'Masters' ? "Master's" : level);
    const majors = unique(document.details?.majors);
    const existingPrograms = Array.isArray(document.programs) ? document.programs : [];
    const programs = existingPrograms.length ? existingPrograms : majors.map(major => ({
      level: levelFor(major, degrees),
      name: major,
      subject: '',
      languages: unique(document.taught),
      duration: clean(major.match(/\((\d+\s*years?)\)/i)?.[1]),
      intakes: unique(document.intake).map(value => value.replace(/2026/g, '2027')),
      tuition: tuitionFor(major, document),
      tuitionAfterScholarship: '',
      applicationDeadline: clean(document.deadlines?.application),
      eligibility: eligibilityFrom(document.notes),
      sourceUrl: '',
      status: 'active',
    }));

    const fees = (document.fees || []).map(fee => ({
      ...fee,
      item: clean(fee.item),
      cost: clean(fee.cost),
      validFor: clean(fee.validFor) || '2027 intake',
      refundable: clean(fee.refundable),
      sourceUrl: clean(fee.sourceUrl),
    }));
    const scholarships = (document.scholarships || []).map(scholarship => ({
      ...scholarship,
      eligiblePrograms: unique(scholarship.eligiblePrograms),
      coverage: clean(scholarship.coverage),
      renewal: clean(scholarship.renewal),
      deadline: clean(scholarship.deadline) || clean(document.deadlines?.application),
      sourceUrl: clean(scholarship.sourceUrl),
      status: clean(scholarship.status) || 'active',
    }));

    await collection.updateOne({ _id: original._id }, {
      $set: {
        name: clean(document.name),
        location: clean(document.location),
        intake: unique(document.intake).map(value => value.replace(/2026/g, '2027')),
        degree: degrees,
        taught: unique(document.taught),
        details: document.details,
        programs,
        fees,
        scholarships,
        documents: document.documents,
        deadlines: document.deadlines,
        notes: document.notes,
        badges: document.badges,
      },
    });
  }

  const migrated = await collection.find({ isActive: true }).toArray();
  console.log(JSON.stringify({
    backupCollection: BACKUP_COLLECTION,
    backupRecords: await backup.countDocuments(),
    universityRecords: migrated.length,
    structuredPrograms: migrated.reduce((total, document) => total + (document.programs?.length || 0), 0),
    recordsWithPrograms: migrated.filter(document => document.programs?.length).length,
    remaining2026CycleStrings: migrated.reduce((total, document) => total + (JSON.stringify(document).match(/2026/g)?.length || 0), 0),
  }, null, 2));
}

run()
  .finally(() => mongoose.disconnect())
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
