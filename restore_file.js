const fs = require('fs');

const path = 'src/app/partnership/universities/[id]/UniversityDetailClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// The git checkout restored it to lines ~343.
// Wait, what does the file look like right now after git checkout?
