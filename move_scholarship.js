const fs = require('fs');

const path = 'src/app/partnership/universities/[id]/UniversityDetailClient.tsx';
let content = fs.readFileSync(path, 'utf8');

const anchorStart = '                            {/* Scholarship Card - Highly Highlighted & Interactive */}';
const anchorEnd = '                            </motion.div>\n\n                            <CTALeadForm';

const startIndex = content.indexOf(anchorStart);
const endIndex = content.indexOf(anchorEnd) + '                            </motion.div>'.length;

if (startIndex === -1 || endIndex === -1) {
    console.error("Anchors not found");
    process.exit(1);
}

const blockToMove = content.substring(startIndex, endIndex);
let newContent = content.slice(0, startIndex) + content.slice(endIndex);

const targetAnchor = '                        {/* Programs Section */}';
const targetIndex = newContent.indexOf(targetAnchor);

if (targetIndex === -1) {
    console.error("Target anchor not found");
    process.exit(1);
}

// Ensure proper indentation for the target: 
// The block is indented with 28 spaces in the sidebar. In the main column, it should probably be 24 spaces.
// Let's replace the 28 spaces with 24 spaces in blockToMove if it matters, but React doesn't care about JSX indent.
// So let's just insert it. Wait, the main col is `                        ` (24 space indent), the sidebar is `                            ` (28 space indent). 
// Let's leave indent as is, it's just visual.

let finalContent = newContent.slice(0, targetIndex) + blockToMove + '\n\n' + newContent.slice(targetIndex);

fs.writeFileSync(path, finalContent, 'utf8');
console.log("Move successful!");
