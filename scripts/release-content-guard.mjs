/** Check that content imports preserve operational records. Hashes stay server-side. */
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
const [mode, file] = process.argv.slice(2);
if (!['snapshot','verify'].includes(mode) || !file) throw new Error('Usage: snapshot|verify PRIVATE_FILE');
const db = new PrismaClient();
const protectedModels = ['lead','user','message','partnership','setting','office','teamMember','country','content','testimonial','evidenceAsset','trustMetric'];
const changedPackages = ['china-full-scholarship-package','china-partial-scholarship-package','china-complete-support-package'];
const digest = row => createHash('sha256').update(JSON.stringify(row)).digest('hex');
try {
  const current={};
  for (const model of [...protectedModels,'servicePackage']) {
    const rows = await db[model].findMany(model==='servicePackage'?{where:{slug:{notIn:changedPackages}}}:{});
    current[model]=Object.fromEntries(rows.map(row=>[row.id??row.key,digest(row)]));
  }
  if(mode==='snapshot') {
    await writeFile(file,JSON.stringify(current),{mode:0o600});
    console.log('Protected operational record hashes saved.');
  } else {
    const before=JSON.parse(await readFile(file,'utf8'));
    for(const [model,rows] of Object.entries(before)) for(const [id,hash] of Object.entries(rows)) if(current[model][id]!==hash) throw new Error(`Protected operational record changed: ${model}`);
    console.log('Protected operational records preserved; university/research and requested China package updates only.');
  }
} finally {await db.$disconnect();}
