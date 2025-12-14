const fs = require('fs');
const report = JSON.parse(fs.readFileSync('lighthouse-verify.json', 'utf8'));

console.log('Categories:');
Object.values(report.categories).forEach(cat => {
    console.log(`${cat.title}: ${Math.round(cat.score * 100)}`);
});

console.log('\nFailing Audits:');
Object.values(report.audits).forEach(audit => {
    if (audit.score !== null && audit.score < 1) {
        console.log(`- ${audit.title} (${audit.id}): ${audit.displayValue || ''}`);
    }
});

const lcpElement = report.audits['largest-contentful-paint-element'];
if (lcpElement && lcpElement.details && lcpElement.details.items) {
    console.log('\nLCP Element Items:', JSON.stringify(lcpElement.details.items, null, 2));
}

const byteWeight = report.audits['total-byte-weight'];
if (byteWeight && byteWeight.details && byteWeight.details.items) {
    console.log('\nTop 5 Heaviest Assets:');
    byteWeight.details.items.slice(0, 5).forEach(item => {
        console.log(`- ${item.url}: ${(item.totalBytes / 1024).toFixed(2)} KB`);
    });
}
