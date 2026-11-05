/** Add the owner's 45 medical university records without replacing existing catalogues.
 * Run without flags to preview; --apply performs a backed-up, local SQLite transaction.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config({path:'.env.local',quiet:true});
dotenv.config({quiet:true});
if (!process.env.DATABASE_URL?.startsWith('file:')) throw new Error('This import supports the local SQLite CMS only.');
const db = new PrismaClient();
const parse = (value, fallback=[]) => { try {return JSON.parse(value || 'null') ?? fallback;} catch {return fallback;} };
const normal = value => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const slugify = value => value.normalize('NFKD').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const distinct = values => [...new Set(values.filter(Boolean))];
const logoAssets=await readFile('data/research/mbbs-directory/logo-assets.json','utf8').then(JSON.parse).catch(()=>[]);
const logoBySlug=new Map(logoAssets.map(asset=>[asset.slug,asset.asset]));
const suppliedLogos={'wenzhou-medical-university':'/images/campaigns/march-2027/wenzhou-medical-university.png','chongqing-medical-university':'/images/campaigns/march-2027/chongqing-medical-university.png'};
const raw = JSON.parse(await readFile('data/research/china-mbbs-workbook.json','utf8'));
const corrections = JSON.parse(await readFile('data/research/mbbs-directory/source-corrections.json','utf8'));
const rows = raw['45 MOE MBBS + Foundation'].filter(row => row.row>=4 && row.row<=48);
if (rows.length!==45 || new Set(rows.map(row=>normal(row.cells.B))).size!==45) throw new Error('Expected 45 distinct workbook university records.');
const documents = ['Valid passport and photograph','SSC and HSC or equivalent graduation certificates and full academic transcripts','English or Chinese language evidence for the selected programme','Required academic entrance or CSCA score report','Foreigner Physical Examination Form','Police clearance / non-criminal record certificate','Financial support evidence and any university application forms'];
const checks = ['Match your science subjects and results to the university’s medical admission requirements.','Meet the selected programme’s academic, language and entrance assessment requirements.'];
const knownAcronyms = {9:'TMU',12:'BHU',13:'CMU',28:'NBU',32:'ZZU',33:'WHU',35:'CTGU',44:'NSMC',48:'SHZU'};
const knownFacts = {
  9:'Tianjin Medical University is a specialist medical university in Tianjin. Its medical study route connects foundational science with clinical education.',
  12:'Beihua University is located in Jilin City. Medical study forms part of a wider university offering in the northeast of China.',
  13:'China Medical University is located in Shenyang, Liaoning. International medical applicants can compare its clinical medicine route alongside the city’s study and living arrangements.',
  28:'Ningbo University’s medical school describes its MBBS teaching in basic medicine, anatomy and biochemistry within a comprehensive university environment.',
  32:'Zhengzhou University is located in the capital of Henan Province. Students considering medicine can plan their academic file, language evidence and living budget together.',
  33:'Wuhan University is located in Wuhan, Hubei. Its comprehensive university setting supports study across medical and other academic disciplines.',
  35:'China Three Gorges University is located in Yichang, Hubei. Its College of Medicine provides the medical education setting for the university’s international medical study route.',
  44:'North Sichuan Medical College is located in Nanchong, Sichuan. Its medical education combines foundational subjects with clinical learning.',
  48:'Shihezi University’s medical school provides an English-taught international clinical medicine education route within a comprehensive university in Xinjiang.',
};
const rowSources = {28:'https://medicine.nbu.edu.cn/EN/Education/MBBS.htm',35:'https://eng.ctgu.edu.cn/info/1025/1289.htm',48:'https://www.shzu.edu.cn/2024/1101/c2a211876/page.htm'};
const fee = (key,item,amount,period='year',stage='in_china',extra={})=>({key,item,amount,currency:'CNY',period,stage,...extra});
function tuitionFromText(value, sourceUrl) {
  const m=value?.match(/^(?:(CNY|RMB)\s*)?(\d[\d,]*)\s*(CNY|RMB)?\s*\/\s*(year|semester|program(?:me)?)/i);
  if (!m) return [];
  const amount=Number(m[2].replaceAll(',',''));
  return [{key:'tuition',item:'Tuition',currency:'CNY',period:m[4].toLowerCase().replace('program','programme').replace('programmeme','programme'),stage:'in_china',...(sourceUrl?{amount}:{displayAmount:`CNY ${amount.toLocaleString('en-US')} / ${m[4]} (estimate)`})}];
}
function existingDetail(program, university) {
  return {id:program.id,name:program.name,level:/mbbs/i.test(program.level)?'Bachelor':program.level,languages:program.languages.split(',').map(v=>v.trim()).filter(Boolean),duration:program.duration || 'Programme-specific',intake:program.intakes,deadline:program.applicationDeadline || undefined,qualifications:parse(program.eligibility),languageRequirements:[],documents:parse(university.documents),fees:tuitionFromText(program.tuition,program.sourceUrl),notes:[],sourceUrl:program.sourceUrl || undefined};
}
function award(id,title,coverage,conditions,renewal,program,extra={}) {
  return {id,title,type:'University scholarship',levels:['Bachelor'],programIds:[program.id],programNames:[program.name],languages:program.languages,coverage,conditions,renewal,documents:['Academic transcripts and award-specific supporting evidence'],applicationSteps:['Include the required evidence with your university application.','Follow the university’s selection and award notification process.'],status:'confirm',notes:[],...extra};
}
function awardsFor(row,p) {
  if (row===27) return [award('wmu-mbbs-freshman','WMU MBBS Freshman Scholarship',['Up to CNY 20,000','Freshman tiers: CNY 20,000, 10,000 or 5,000; allocations 25%, 25% and 50%.'],['Assessment follows full tuition payment and registration.','Selection uses entrance performance and CSCA results.'],['Freshman award; later academic scholarships have separate selection.'],p)];
  if (row===45) return [award('cqmu-mbbs-freshman','CQMU Freshman Scholarship',['CNY 15,000 for the first year'],['University selection from new self-funded undergraduates; 30% of the enrolment quota.'],['First-year award; later funding follows separate scholarship rules.'],p)];
  if (row===19) return [
    award('nmu-full','NMU Full Tuition Freshman Scholarship',['100% tuition waiver','CNY 34,000; selection allocation 5%.'],['University selection for eligible self-funded MBBS freshmen.','The required deposit must still be paid.'],['Freshman selection; subsequent support follows the university’s review rules.'],p,{tuitionReduction:{type:'percent',value:100,period:'year'}}),
    award('nmu-half','NMU Half Tuition Freshman Scholarship',['50% tuition waiver','CNY 17,000; selection allocation 10%.'],['University selection for eligible self-funded MBBS freshmen.'],['Freshman selection; subsequent support follows the university’s review rules.'],p,{tuitionReduction:{type:'percent',value:50,period:'year'}}),
    award('nmu-quarter','NMU Quarter Tuition Freshman Scholarship',['25% tuition waiver','CNY 8,500; selection allocation 15%.'],['University selection for eligible self-funded MBBS freshmen.'],['Freshman selection; subsequent support follows the university’s review rules.'],p,{tuitionReduction:{type:'percent',value:25,period:'year'}}),
    award('nmu-general','NMU General Entrance Scholarship',['CNY 5,000','Selection allocation 70%.'],['University entrance scholarship assessment.'],['Entrance award; later support follows separate assessment.'],p),
  ];
  if (row===25) return [
    award('xzmu-full','XZMU First Class Freshman Scholarship',['100% tuition waiver','CNY 33,000 for the first academic year; allocation 50%.'],['Excellent high-school performance.','Full-time undergraduate applicant; no concurrent scholarship.','Accommodation and registration remain payable.'],['First academic year only.'],p,{tuitionReduction:{type:'percent',value:100,period:'year'}}),
    award('xzmu-half','XZMU Second Class Freshman Scholarship',['50% tuition waiver','CNY 16,500 for the first academic year; allocation 30%.'],['University selection; no concurrent scholarship.'],['First academic year only.'],p,{tuitionReduction:{type:'percent',value:50,period:'year'}}),
    award('xzmu-quarter','XZMU Third Class Freshman Scholarship',['25% tuition waiver','CNY 8,250 for the first academic year; allocation 20%.'],['University selection; no concurrent scholarship.'],['First academic year only.'],p,{tuitionReduction:{type:'percent',value:25,period:'year'}}),
  ];
  if (row===30) return [award('fjmu-merit','FJMU Outstanding International Student Scholarship',['Up to CNY 35,000 per academic year','Award tiers: CNY 35,000, 15,000, 10,000 or 5,000.'],['Top 30% of self-funded freshman candidates.','Admission ranking uses 30% previous education and 70% entrance examination.'],['Later awards follow the university’s scholarship assessment.'],p)];
  if (row===43) return [award('swmu-provincial','Sichuan Provincial Government Scholarship',['CNY 20,000/year'],['Competitive selection under the provincial and university rules.'],['Subject to annual review.'],p),award('swmu-entrance','SWMU Entrance Scholarship',['Up to CNY 6,000','One-time tiers: CNY 4,000, 5,000 or 6,000.'],['Based on the freshman entrance examination results.'],['One-time entrance award.'],p)];
  if (row===46) return [award('kmu-freshman-support','KMU Freshman Study Grant',['CNY 1,000/month for 10 months','CNY 10,000 total for the academic year.'],['For eligible self-funded English MBBS freshmen who apply and pass university assessment.','Full tuition is paid first; grants follow monthly academic review.'],['Freshman grant; later academic scholarships use separate assessment.'],p,{stipend:'CNY 1,000/month for 10 months'})];
  return [];
}
try {
  const universities = await db.university.findMany({include:{programs:true,scholarships:true,fees:true,costPlans:true}});
  const campaign = await db.intakeCampaign.findUnique({where:{slug:'university-profile-details'}});
  const prior = campaign ? parse(campaign.contentJson,{universities:[]}) : {universities:[]};
  if (!Array.isArray(prior.universities)) throw new Error('Existing profile collection is malformed.');
  const nextProfiles = new Map(prior.universities.map(p=>[p.slug,p]));
  const entries = rows.map(row=>{
    const c=row.cells, patch=corrections.rows[row.row] || {};
    const matches=universities.filter(u=>[u.name,...parse(u.aliases)].some(name=>normal(name)===normal(c.B) || name===c.C));
    if(matches.length>1) throw new Error(`Ambiguous identity: ${c.B}`);
    const previous=matches[0]; const slug=previous?.slug || slugify(c.B);
    const officialUrl = patch.sourceUrl ? `https://${new URL(patch.sourceUrl).hostname.split('.').slice(-3).join('.')}/` : c.AA.replace(/^http:/,'https:');
    const sourceUrl=patch.sourceUrl || rowSources[row.row];
    const verified=Boolean(patch.sourceUrl) && patch.feeVerified !== false;
    const tuition=patch.tuition ?? c.L;
    const publicTuition=verified ? `CNY ${tuition.toLocaleString('en-US')} / year` : `CNY ${tuition.toLocaleString('en-US')} / year (estimate)`;
    const id=`mbbs-workbook-${slug}`;
    const medical = {id,name:patch.name || 'Clinical Medicine (MBBS)',level:'Bachelor',languages:patch.languages || ['English'],duration:patch.duration || '6 years',intake:patch.intake || 'September',qualifications:patch.qualifications || ['Senior high school science qualification with Biology, Chemistry and Physics.',...checks],languageRequirements:[...(patch.language || ['Prepare language evidence meeting the selected medical programme’s requirements.']),patch.csca || 'Prepare the entrance and CSCA results required for your selected programme.'],documents,fees:[verified?fee('tuition','Tuition',tuition):{key:'tuition',item:'Tuition budget',currency:'CNY',period:'year',stage:'in_china',displayAmount:publicTuition,notes:'Planning estimate from the supplied university budget; final charges belong in your written programme cost plan.'}],notes:['For medical practice in Bangladesh, complete the degree and clinical training, then follow BMDC’s qualifying examination, applicable internship and registration process.'],sourceUrl:patch.sourceUrl};
    if(patch.application) medical.fees.push(fee('application','Application fee',patch.application,'oneoff','before_china'));
    if(patch.registration) medical.fees.push(fee('other','First-year registration',patch.registration,'oneoff'));
    if(patch.insurance) medical.fees.push(fee('insurance','Insurance',patch.insurance));
    if(patch.medical) medical.fees.push(fee('medical','Medical examination',patch.medical,'oneoff'));
    if(patch.residence) medical.fees.push(fee('residence','Residence permit',patch.residence,'oneoff'));
    if(patch.deposit) medical.fees.push({key:'deposit',item:'Admission deposit',currency:'CNY',period:'oneoff',stage:'before_china',displayAmount:`CNY ${patch.deposit.toLocaleString('en-US')}`,notes:'Non-refundable deposit. Use the pre-admission notice to allocate this payment against the university charges before calculating the balance.'});
    if(patch.housingAmount) medical.fees.push(fee('housing','Accommodation',patch.housingAmount,'year','in_china',{notes:patch.housing}));
    else if(patch.housing) medical.fees.push({key:'housing',item:'Accommodation',currency:'CNY',period:'year',stage:'in_china',displayAmount:patch.housing});
    const oldProfile=nextProfiles.get(slug);
    const sameMedical=p=>/clinical medicine|\bmbbs\b|ophthalmological and optometric/i.test(p.name) && /bachelor|mbbs/i.test(p.level);
    const oldPrograms=oldProfile?.programs ?? previous?.programs.filter(p=>p.status!=='paused').map(p=>existingDetail(p,previous)) ?? [];
    const retained=oldPrograms.filter(p=>!sameMedical(p));
    const fullName=c.B, acronym=patch.acronym || knownAcronyms[row.row];
    const strength=patch.fact || knownFacts[row.row];
    const overview=`${fullName}${acronym?` (${acronym})`:''} is located in ${c.E}, ${c.D}, China. ${strength || ''} Explore ${medical.name} (${medical.languages.join(' / ')}, ${medical.duration}), annual tuition, application documents and scholarship planning for students from Bangladesh. Prepare your academic and language evidence, compare accommodation arrangements and build a written study budget around the selected programme.`;
    const sources=distinct([sourceUrl,patch.secondarySource,officialUrl,...(oldProfile?.internal?.searchPublication?.sources || [])]);
    const awards=awardsFor(row.row,medical);
    const originalProfile=oldProfile?.internal?.workbookImport ? oldProfile.internal.workbookImport.originalProfile : (oldProfile?{overview:oldProfile.overview,highlights:oldProfile.highlights || []}:null);
    const profile={...oldProfile,slug,name:previous?.name || fullName,officialUrl,overview,highlights:[{title:'Medical study route',description:`${medical.name} · ${medical.duration} · ${medical.languages.join(' / ')}`},{title:'Location',description:`${c.E}, ${c.D}, China`},{title:'Academic focus',description:strength || `Medical study and clinical-science preparation in ${c.E}.`}],programs:[medical,...retained],scholarshipOptions:[...awards,...(oldProfile?.scholarshipOptions || []).filter(a=>!a.id.startsWith('mbbs-workbook-') && !awards.some(n=>n.id===a.id))],internal:{...oldProfile?.internal,workbookImport:{originalProfile,key:'eduexpress-china-mbbs-45-v1',sheet:'45 MOE MBBS + Foundation',row:row.row,original:c,checkedAt:corrections.checkedAt,feeBasis:verified?'university-published':'owner-planning-estimate',sourceUrl,correction:patch.correction},...(verified?{searchPublication:{mode:'evergreen_guide',index:true,researchedAt:new Date().toISOString(),sources}}:{})}};
    // Existing researched profiles retain their overview and publication record.
    if(originalProfile) { profile.overview=`${originalProfile.overview} ${strength || ''}`; profile.highlights=[...(originalProfile.highlights || []),{title:'Medical study route',description:`${medical.name} · ${medical.duration} · ${medical.languages.join(' / ')}`}]; }
    nextProfiles.set(slug,profile);
    return {row:row.row,c,patch,slug,previous,medical,profile,officialUrl,sourceUrl,verified,tuition,publicTuition,acronym,awards};
  });
  if(new Set(entries.map(e=>e.slug)).size!==45) throw new Error('University identities overlap.');
  const manifest={key:'eduexpress-china-mbbs-45-v1',source:'EduExpress_China_MBBS.xlsx',checkedAt:corrections.checkedAt,entries:entries.map(e=>({row:e.row,slug:e.slug,name:e.c.B,action:e.previous?'merge':'create',publishedTuition:e.publicTuition,feeBasis:e.verified?'university-published':'owner-planning-estimate',programme:e.medical.name,languages:e.medical.languages,indexEligible:e.verified})),created:entries.filter(e=>!e.previous).length,merged:entries.filter(e=>e.previous).length};
  await mkdir('data/research/mbbs-directory',{recursive:true});
  await writeFile('data/research/mbbs-directory/import-manifest.json',JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify({mode:process.argv.includes('--apply')?'apply':'preview',total:entries.length,created:manifest.created,merged:manifest.merged,universitySourcedFees:entries.filter(e=>e.verified).length,planningFigures:entries.filter(e=>!e.verified).length},null,2));
  if(process.argv.includes('--apply')) {
    await mkdir('data/research/backups',{recursive:true});
    const backup=`data/research/backups/mbbs-universities-${Date.now()}.json`;
    await writeFile(backup,JSON.stringify({campaign,universities:entries.map(e=>e.previous).filter(Boolean),createdSlugs:entries.filter(e=>!e.previous).map(e=>e.slug)},null,2)+'\n');
    await db.$transaction(async tx=>{
      for(const e of entries) {
        const {c,slug,previous,medical,profile,verified,sourceUrl,officialUrl,acronym}=e;
        let universityId=previous?.id;
        if(!universityId) {
          const created=await tx.university.create({data:{slug,name:c.B,city:c.E,country:'China',location:`${c.E}, ${c.D}, China`,intake:'September',degree:'Bachelor',taught:medical.languages.join(','),majors:medical.name,tuition:e.publicTuition,tuitionDetails:JSON.stringify([e.publicTuition]),documents:JSON.stringify(documents),notes:'[]',badges:'[]',officialUrl,aliases:JSON.stringify(distinct([c.C,acronym])),legacySlugs:'[]',sourceUrls:JSON.stringify(distinct([officialUrl,sourceUrl])),relationshipType:'public_direct_application',verificationStatus:'under_verification',isActive:true}});
          universityId=created.id;
        }
        const matches=previous?.programs.filter(p=>/clinical medicine|\bmbbs\b/i.test(p.name) && /bachelor|mbbs/i.test(p.level)) || [];
        const existing=matches.find(p=>p.id===medical.id) || matches[0];
        // Reuse a matching medical row and preserve unrelated courses.
        const data={universityId,name:medical.name,level:'Bachelor',subject:medical.name,languages:medical.languages.join(','),duration:medical.duration,intakes:medical.intake,tuition:e.publicTuition,eligibility:JSON.stringify([...medical.qualifications,...medical.languageRequirements]),sourceUrl:sourceUrl || null,status:verified?'active':'planned',applicationDeadline:null};
        await tx.program.upsert({where:{id:existing?.id || medical.id},create:{id:medical.id,...data},update:data});
        if(matches.length>1) await tx.program.updateMany({where:{id:{in:matches.filter(p=>p.id!==existing?.id).map(p=>p.id)}},data:{status:'paused'}});
        const programs=await tx.program.findMany({where:{universityId,status:{not:'paused'}}});
        await tx.university.update({where:{id:universityId},data:{...(suppliedLogos[slug] || logoBySlug.get(slug) ? {logo:suppliedLogos[slug] || logoBySlug.get(slug)} : {}),officialUrl:previous?.officialUrl || officialUrl,sourceUrls:JSON.stringify(distinct([...parse(previous?.sourceUrls),...profile.internal.searchPublication?.sources || [],sourceUrl])),aliases:JSON.stringify(distinct([...parse(previous?.aliases),c.C,acronym])),degree:distinct(programs.map(p=>p.level)).join(','),taught:distinct(programs.flatMap(p=>p.languages.split(','))).join(','),intake:distinct(programs.flatMap(p=>p.intakes.split(','))).join(','),majors:distinct(programs.map(p=>p.name)).join(','),...(!previous?{tuition:e.publicTuition}:{}),isActive:true}});
        for(const a of e.awards) {
          const awardData={universityId,title:a.title,type:a.type,details:JSON.stringify(a.conditions),amount:a.coverage[0],condition:a.conditions.join(' '),eligiblePrograms:JSON.stringify(a.programNames),coverage:a.coverage.join(' '),renewal:a.renewal.join(' '),sourceUrl:sourceUrl || null,status:'planned'};
          await tx.scholarship.upsert({where:{id:`mbbs-workbook-${slug}-${a.id}`},create:{id:`mbbs-workbook-${slug}-${a.id}`,...awardData},update:awardData});
        }
      }
      const content={...prior,universities:[...nextProfiles.values()],internal:{...prior.internal,mbbsWorkbookImport:manifest}};
      const campaignData={title:campaign?.title || 'University programme details',destination:'China',intake:campaign?.intake || 'Programme-specific study routes',contentJson:JSON.stringify(content),sourceLabel:campaign?.sourceLabel || 'University programme research; source records retained internally',verificationStatus:campaign?.verificationStatus || 'under_verification',lastReviewedAt:new Date(),isPublished:true};
      await tx.intakeCampaign.upsert({where:{slug:'university-profile-details'},create:{slug:'university-profile-details',...campaignData},update:campaignData});
    },{timeout:60000});
    console.log(`Imported 45 university records. Backup: ${backup}`);
  }
} finally {await db.$disconnect();}
