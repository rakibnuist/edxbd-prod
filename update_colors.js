const fs = require('fs');

const path = 'src/app/partnership/universities/[id]/UniversityDetailClient.tsx';
let content = fs.readFileSync(path, 'utf8');

const anchorStart = '                            {/* Scholarship Card - Highly Highlighted & Interactive */}';
const anchorEnd = '                            </motion.div>\n\n                            <CTALeadForm';

const startIndex = content.indexOf(anchorStart);
const endIndex = content.indexOf(anchorEnd) + '                            </motion.div>'.length;

if (startIndex === -1 || endIndex === -1) {
    console.error("Anchors not found", { startIndex, endIndex });
    process.exit(1);
}

let blockToMove = content.substring(startIndex, endIndex);

// Replace gradients
blockToMove = blockToMove.replace(/from-amber-500 via-orange-500 to-red-500/g, 'from-slate-800 via-blue-900 to-indigo-950');
blockToMove = blockToMove.replace(/shadow-orange-500\/40/g, 'shadow-blue-900/40');
blockToMove = blockToMove.replace(/from-amber-600 via-orange-600 to-red-600/g, 'from-slate-800 via-indigo-900 to-slate-900');
blockToMove = blockToMove.replace(/bg-yellow-300\/30/g, 'bg-blue-400/20');

// Replace badge
blockToMove = blockToMove.replace(/bg-emerald-400/g, 'bg-cyan-400');
blockToMove = blockToMove.replace(/rgba\(52,211,153,0\.8\)/g, 'rgba(34,211,238,0.8)'); // cyan glow

// Replace sub-element colors
blockToMove = blockToMove.replace(/bg-amber-300/g, 'bg-cyan-400');
blockToMove = blockToMove.replace(/text-amber-50/g, 'text-blue-50');
blockToMove = blockToMove.replace(/text-amber-100/g, 'text-blue-100');
blockToMove = blockToMove.replace(/text-amber-200/g, 'text-cyan-200');
blockToMove = blockToMove.replace(/text-amber-300/g, 'text-cyan-300');
blockToMove = blockToMove.replace(/text-amber-400/g, 'text-cyan-400');

let finalContent = content.slice(0, startIndex) + blockToMove + content.slice(endIndex);

fs.writeFileSync(path, finalContent, 'utf8');
console.log("Color update successful!");
