import Image from 'next/image';

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();

type TeamMember = { id: string; name: string; role: string; bio: string | null; photoUrl: string | null; specialties: string[] };

export default function TeamSection({ team }: { team: TeamMember[] }) {
    return (
        <section id="team" className="scroll-mt-24 bg-white py-16 lg:py-20">
            <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 max-w-3xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1.5 text-[14px] font-semibold text-lime-deep">The people behind your file</p>
                        <h2 data-anim="up" className="mt-4 font-display text-[34px] font-black leading-[0.98] tracking-[-0.01em] text-petrol-800 sm:text-[46px]">Meet our team.</h2>
                        <p className="mt-4 text-[18px] leading-[1.6] text-ink-soft">
                            Counselors, document specialists, and admissions officers working under written evidence guidelines from our Dhanmondi decision desk.
                        </p>
                    </div>

                    <div data-anim="stagger" className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="group relative overflow-hidden rounded-3xl bg-canvas-soft p-3 transition duration-300 hover:-translate-y-1"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-petrol-800">
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
                                            <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] size-40 rounded-full border-[14px] border-[#a9d6ee]/10" />
                                            <span className="font-heading text-6xl font-bold text-[#a9d6ee]/90">{initials(member.name)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="px-3 pb-3 pt-5">
                                    <h3 className="text-[20px] font-semibold leading-snug text-petrol-800">{member.name}</h3>
                                    <p className="mt-0.5 text-[14px] font-semibold text-lime-deep">{member.role}</p>
                                    <p className="mt-2 line-clamp-3 text-[15px] leading-6 text-ink-soft">
                                        {member.bio}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {member.specialties.map(specialty => <span key={specialty} className="bg-[#e3f0f9] px-2 py-1 text-[12px] font-bold text-[#12436b]">{specialty}</span>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-center font-mono text-[12px] font-medium uppercase tracking-wider text-slate-500">
                        Team details are maintained in the central public record. Photos appear after consent is recorded.
                    </p>
                </div>
            </div>
        </section>
    );
}
