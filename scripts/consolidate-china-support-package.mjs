import { PrismaClient } from '@prisma/client';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const prisma=new PrismaClient();
try {
  const previous=await prisma.servicePackage.findMany({where:{destination:'China',slug:{in:['china-full-scholarship-package','china-partial-scholarship-package','china-complete-support-package']}}});
  let base=previous.find(item=>item.slug==='china-complete-support-package')||previous.find(item=>item.slug==='china-full-scholarship-package');
  if(!base) {
    const approved=JSON.parse(await readFile(new URL('../data/research/china-support-package.json',import.meta.url),'utf8'));
    if(approved.slug!=='china-complete-support-package'||approved.destination!=='China'||!approved.priceLabel||!approved.paymentTerms||!approved.refundTerms) throw new Error('Reviewed China package terms required.');
    base=approved;
    previous.push(approved);
  }
  await mkdir('data/research/backups',{recursive:true});
  await writeFile(`data/research/backups/china-support-packages-${Date.now()}.json`,JSON.stringify(previous,null,2)+'\n');
  const included=[...new Set(previous.flatMap(item=>JSON.parse(item.includedItems)))];
  const data={destination:'China',title:'Complete China Support Package',packageType:'complete_support',priceLabel:base.priceLabel,summary:'One complete package for your China application, visa preparation, travel and arrival support.',outcomeScope:'The university award determines scholarship coverage. University tuition, accommodation and other study costs are itemised separately from the EduExpress support package.',includedItems:JSON.stringify(included),excludedItems:base.excludedItems,paymentTerms:base.paymentTerms,refundTerms:base.refundTerms,securityOptions:base.securityOptions,complianceNote:base.complianceNote,isPublished:true,displayOrder:1};
  await prisma.$transaction(async tx=>{
    await tx.servicePackage.upsert({where:{slug:'china-complete-support-package'},create:{slug:'china-complete-support-package',...data},update:data});
    await tx.servicePackage.updateMany({where:{slug:{in:['china-full-scholarship-package','china-partial-scholarship-package']}},data:{isPublished:false}});
  });
  console.log('One complete China support package published; original price, inclusions and payment terms preserved. Legacy records retained internally.');
} finally {await prisma.$disconnect();}
