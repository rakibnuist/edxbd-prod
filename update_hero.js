const fs = require('fs');

const path = 'src/app/partnership/universities/[id]/UniversityDetailClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// The block to replace:
// From: {uni.deadlines?.application && (
// To end of the right side logo card: </motion.div>\n                        )}

const blockPattern = /\{uni\.deadlines\?\.application && \([\s\S]*?\n\s*\{uni\.logo && \([\s\S]*?<\/motion\.div>\n\s*\)\}/;

const match = content.match(blockPattern);

if (!match) {
    console.error("Pattern not found!");
    process.exit(1);
}

const professionalRankings = `
                            {/* Professional Rankings & Key Stats */}
                            <div className="mt-8 space-y-4">
                                {/* Global Rankings */}
                                {(uni.rankings?.world || uni.rankings?.national || (uni.badges && uni.badges.some(b => b.toLowerCase().match(/rank|news|edu|qs/)))) && (
                                    <div>
                                        <p className="text-blue-200/80 text-xs font-bold uppercase tracking-widest mb-3">Global Recognition</p>
                                        <div className="flex flex-wrap gap-3">
                                            {uni.rankings?.world && (
                                                <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 backdrop-blur-md border border-blue-400/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg shadow-blue-900/20 hover:border-blue-400/40 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-blue-200/70 uppercase font-bold tracking-wider">World Rank</p>
                                                        <p className="text-white font-black text-lg leading-tight">#{uni.rankings.world}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {uni.rankings?.national && (
                                                <div className="bg-gradient-to-r from-emerald-900/60 to-teal-900/60 backdrop-blur-md border border-emerald-400/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg shadow-emerald-900/20 hover:border-emerald-400/40 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                                                        <MapPin className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-emerald-200/70 uppercase font-bold tracking-wider">National Rank</p>
                                                        <p className="text-white font-black text-lg leading-tight">#{uni.rankings.national}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {uni.badges?.map((badge, i) => {
                                                const isRank = badge.toLowerCase().match(/rank|news|edu|qs/);
                                                if (isRank) {
                                                    const parts = badge.split(':');
                                                    const label = parts[0]?.trim();
                                                    const value = parts[1]?.trim() || '';
                                                    return (
                                                        <div key={\`rank-\${i}\`} className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 backdrop-blur-md border border-amber-400/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg shadow-amber-900/20 hover:border-amber-400/40 transition-colors">
                                                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
                                                                <Trophy className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-amber-200/70 uppercase font-bold tracking-wider">{label}</p>
                                                                <p className="text-white font-black text-lg leading-tight">{value.startsWith('#') ? value : \`#\${value}\`}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Base Stats */}
                                <div className="flex gap-3 pt-2">
                                    {uni.details?.tuition && (
                                        <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                                                <Wallet className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Tuition</p>
                                                <p className="text-white font-bold">{uni.details.tuition.split(' ')[0]}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Visuals & Deadline */}
                        <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto mt-8 lg:mt-0">
                            {/* Logo Card */}
                            {uni.logo ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-shrink-0 relative group"
                                >
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
                                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-[280px] h-[280px] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                                        <img
                                            src={uni.logo}
                                            alt={\`\${uni.name} logo\`}
                                            className="w-full h-full object-contain filter drop-shadow-lg"
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-shrink-0 hidden lg:flex relative w-[280px] h-[280px] items-center justify-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20">
                                    <GraduationCap className="w-24 h-24 text-white/20" />
                                </div>
                            )}

                            {/* Application Deadline */}
                            {uni.deadlines?.application && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full md:w-[280px] flex items-center gap-4 bg-white/10 backdrop-blur-xl px-5 py-4 rounded-2xl border border-white/20 shadow-2xl group hover:bg-white/15 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/30 group-hover:bg-amber-500/30 transition-colors flex-shrink-0">
                                        <Clock className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-amber-200/80 font-bold uppercase tracking-widest mb-0.5">Application Deadline</p>
                                        <p className="text-white font-black text-sm tracking-tight leading-tight">{uni.deadlines.application}</p>
                                    </div>
                                </motion.div>
                            )}
`;

content = content.replace(blockPattern, professionalRankings);

// Fix badges mapping to filter out ranks
content = content.replace(/{uni\.badges\?\.map\(\(badge, i\) => \(/, "{uni.badges?.filter(b => !b.toLowerCase().match(/rank|news|edu|qs/)).map((badge, i) => (");

fs.writeFileSync(path, content, 'utf8');
console.log("Hero layout injected successfully");
