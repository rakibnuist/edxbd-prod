import Image from 'next/image';

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();

type TeamMember = {
    id: string;
    name: string;
    role: string;
    shortRole?: string | null;
    bio: string | null;
    photoUrl: string | null;
    specialties: string[];
};

export default function TeamSection({ team }: { team: TeamMember[] }) {
    const gridCols = team.length >= 7 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';

    return (
        <section id="team" className="scroll-mt-24 bg-white py-16 lg:py-20">
            <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 max-w-3xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1.5 text-[14px] font-semibold text-lime-deep">The people behind your file</p>
                        <h2 data-anim="up" className="mt-4 font-display text-[34px] font-black leading-[0.98] tracking-[-0.01em] text-petrol-800 sm:text-[46px]">Meet our team.</h2>
                        <p className="mt-4 text-[18px] leading-[1.6] text-ink-soft">
                            Leadership, senior consultants, visa processing specialists, and creative media leads serving students and partners from our Dhanmondi office.
                        </p>
                    </div>

                    <div data-anim="stagger" className={`grid grid-cols-1 gap-5 ${gridCols}`}>
                        {team.map((member) => (
                            <article
                                key={member.id || member.name}
                                className="group relative flex flex-col overflow-hidden rounded-3xl bg-canvas-soft p-3 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-petrol-800">
                                    {member.photoUrl ? (
                                        <Image
                                            src={member.photoUrl}
                                            alt={`${member.name} — ${member.role} at EduExpress International, Dhaka`}
                                            fill
                                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#08263c_0%,#0b2f4a_60%,#174f7a_100%)]">
                                            <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] size-40 rounded-full border-[14px] border-[#a9d6ee]/10" />
                                            <span className="font-heading text-6xl font-bold text-[#a9d6ee]/90">{initials(member.name)}</span>
                                        </div>
                                    )}
                                    {member.shortRole ? (
                                        <span className="absolute bottom-2.5 left-2.5 right-2.5 truncate rounded-full bg-petrol-900/85 px-3 py-1 text-center text-[11px] font-semibold tracking-wide text-lime backdrop-blur-sm">
                                            {member.shortRole}
                                        </span>
                                    ) : null}
                                </div>

                                <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-4">
                                    <h3 className="text-[19px] font-semibold leading-snug text-petrol-800">{member.name}</h3>
                                    <p className="mt-0.5 text-[13.5px] font-semibold text-lime-deep">{member.role}</p>
                                    {member.bio ? (
                                        <p className="mt-2 line-clamp-3 text-[14px] leading-6 text-ink-soft">
                                            {member.bio}
                                        </p>
                                    ) : null}
                                    {member.specialties.length > 0 ? (
                                        <div className="mt-auto flex flex-wrap gap-1.5 pt-3.5">
                                            {member.specialties.slice(0, 3).map(specialty => (
                                                <span key={specialty} className="rounded-lg bg-[#e3f0f9] px-2 py-0.5 text-[11.5px] font-semibold text-[#12436b]">
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>

                    <p className="mt-8 text-center font-mono text-[12px] font-medium uppercase tracking-wider text-slate-500">
                        Verified Dhanmondi, Dhaka leadership, counseling, visa processing, and media team · Synchronized from EduExpress records.
                    </p>
                </div>
            </div>
        </section>
    );
}
