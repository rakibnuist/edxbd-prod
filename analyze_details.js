const fs = require('fs');
const report = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));

const lcpElement = report.audits['largest-contentful-paint-element'];
if (lcpElement && lcpElement.details && lcpElement.details.items) {
    console.log('LCP Element Items:', JSON.stringify(lcpElement.details.items, null, 2));
}

const byteWeight = report.audits['total-byte-weight'];
if (byteWeight && byteWeight.details && byteWeight.details.items) {
    console.log('Top 10 Heaviest Assets:');
    byteWeight.details.items.slice(0, 10).forEach(item => {
        console.log(`- ${item.url}: ${(item.totalBytes / 1024).toFixed(2)} KB`);
    });
}

const mainThread = report.audits['mainthread-work-breakdown'];
if (mainThread && mainThread.details && mainThread.details.items) {
    console.log('\nMain Thread Work Breakdown:');
    mainThread.details.items.slice(0, 5).forEach(item => {
        console.log(`- ${item.groupLabel}: ${item.duration.toFixed(2)} ms`);
    });
}
