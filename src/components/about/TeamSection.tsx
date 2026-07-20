import Image from 'next/image';

// To use a real photo, drop it in /public/team/ and set `image: '/team/name.jpg'`.
// Members without a photo show a clean monogram — never a stock stand-in face.
type Member = { name: string; role: string; bio: string; image?: string };

const teamMembers: Member[] = [
    {
        name: 'Abdullah Al Rakib',
        role: 'Founder & CEO',
        bio: 'Leads the strategic direction of EduExpress. Entered Chinese higher education in 2018 and built the institutional relationships behind the China flagship service.',
    },
    {
        name: 'Sakib Al Jubaer',
        role: 'Managing Director',
        bio: 'Oversees daily operations and service delivery against the written evidence standard across every student file.',
    },
    {
        name: 'Tahmid Al Jamee',
        role: 'Head of Marketing',
        bio: 'Connects students with verified opportunities and keeps public claims aligned with the evidence-first standard.',
    },
    {
        name: 'Md Taj Ahmed',
        role: 'Application Processing',
        bio: 'Prepares university applications and keeps each submission complete, accurate and on deadline.',
    },
    {
        name: 'Mukta Rahaman',
        role: 'Senior Counselor',
        bio: 'Provides program and university guidance, comparing fit, recognition and total cost before any recommendation.',
    },
    {
        name: 'Jannatun Ema',
        role: 'Counselor',
        bio: 'Supports students through their study-abroad options with structured, written follow-up.',
    },
    {
        name: 'Md Abdullah Al Razib',
        role: 'Application Processing',
        bio: 'Handles documentation and application tracking, keeping references and receipts recorded for every step.',
    },
    {
        name: 'Md Tauhidul Islam Nur',
        role: 'Country Manager (China)',
        bio: 'Leads China operations and the relationships with Chinese universities behind the flagship record.',
    },
    {
        name: 'Md Infeter Islam',
        role: 'Marketing Executive',
        bio: 'Runs student outreach campaigns and responds to inquiries from across Bangladesh.',
    },
    {
        name: 'Md Israfil Hossain',
        role: 'Marketing Executive',
        bio: 'Connects with students and shares verified guidance on international education.',
    },
    {
        name: 'Md Tanver Islam',
        role: 'Marketing Executive',
        bio: 'Engages the community through events and digital channels and routes student queries to the right desk.',
    },
];

function initials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + second).toUpperCase();
}

export default function TeamSection() {
    return (
        <section id="team" className="py-20 bg-[#f4f8fa] border-b border-[#174f7a]/15 scroll-mt-24">
            <div className="container mx-auto px-5 sm:px-8 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">The people behind your file</p>
                        <h2 className="mt-2 font-heading text-4xl font-bold text-[#08263c]">Meet Our Team</h2>
                        <p className="text-base text-slate-600 max-w-2xl mx-auto mt-3">
                            Counselors, document specialists, and admissions officers working under written evidence guidelines from our Dhanmondi decision desk.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member) => (
                            <div
                                key={member.name}
                                className="group relative bg-white border-2 border-[#08263c] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#174f7a]"
                            >
                                <div className="aspect-[3/4] relative overflow-hidden bg-[#08263c]">
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#08263c_0%,#0b2f4a_60%,#174f7a_100%)]">
                                            <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] size-40 rounded-full border-[14px] border-[#64b5df]/10" />
                                            <span className="font-heading text-6xl font-bold text-[#8ed0ee]/90">{initials(member.name)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 text-center bg-white border-t border-[#174f7a]/15">
                                    <h3 className="font-heading text-lg font-bold text-[#08263c] mb-1">{member.name}</h3>
                                    <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-2">{member.role}</p>
                                    <p className="text-slate-600 text-xs leading-5 line-clamp-3">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        Real team photos are added as written consent is recorded.
                    </p>
                </div>
            </div>
        </section>
    );
}
