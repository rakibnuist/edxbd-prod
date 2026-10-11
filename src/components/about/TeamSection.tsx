import Image from 'next/image';

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();

type TeamMember = { id: string; name: string; role: string; bio: string | null; photoUrl: string | null; specialties: string[] };

export default function TeamSection({ team }: { team: TeamMember[] }) {
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="group relative bg-white border-2 border-[#08263c] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#174f7a]"
                            >
                                <div className="aspect-[3/4] relative overflow-hidden bg-[#08263c]">
                                    {member.photoUrl ? (
                                        <Image
                                            src={member.photoUrl}
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
                                    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                                        {member.specialties.map(specialty => <span key={specialty} className="bg-[#e9f7fd] px-2 py-1 text-[9px] font-bold text-[#174f7a]">{specialty}</span>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        Team details are maintained in the central public record. Photos appear after consent is recorded.
                    </p>
                </div>
            </div>
        </section>
    );
}
