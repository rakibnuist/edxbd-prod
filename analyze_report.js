const fs = require('fs');
const report = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));

console.log('Categories:');
Object.values(report.categories).forEach(cat => {
    console.log(`${cat.title}: ${Math.round(cat.score * 100)}`);
});

console.log('\nFailing Audits:');
Object.values(report.audits).forEach(audit => {
    if (audit.score !== null && audit.score < 1) { // checking strictly < 1 for "all failures"
        console.log(`- ${audit.title} (${audit.id}): ${audit.displayValue || ''}`);
    }
});
