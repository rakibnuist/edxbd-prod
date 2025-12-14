'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Trophy, Building2 } from 'lucide-react';

const stats = [
    { label: 'Students Placed', value: '5,000+', icon: Users },
    { label: 'Visa Success', value: '98%', icon: Trophy },
    { label: 'University Partners', value: '150+', icon: Building2 },
];

const AboutPreviewSection = () => {
    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,_rgba(59,130,246,0.3),transparent_70%)]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Image/Visual - Using a placeholder for team/office environment */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-blue-600 rounded-3xl -rotate-6 opacity-30 blur-2xl transform scale-95" />
                        <div className="relative rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
                            {/* Placeholder image from unsplash representing team/discussion */}
                            <Image
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop"
                                alt="EduExpress Team"
                                width={800}
                                height={600}
                                className="object-cover w-full h-[500px]"
                            />

                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
                                <p className="text-white font-medium italic">&quot;We treat every application as if it were our own.&quot;</p>
                                <p className="text-blue-400 text-sm mt-2">- The EduExpress Team</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-4 block"
                        >
                            Who We Are
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                        >
                            Bridging the Gap Between <span className="text-blue-400">Talent</span> and <span className="text-amber-400">Opportunity</span>.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-300 text-lg mb-8 leading-relaxed"
                        >
                            EduExpress isn&apos;t just a consultancy; we are a team of former international students, educators, and career strategists. We understand the anxiety of applying abroad because we&apos;ve been there. Our mission is to make quality education accessible to every deserving student.
                        </motion.p>

                        <div className="grid grid-cols-3 gap-6 mb-10">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                >
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</h3>
                                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link href="/about" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all hover:gap-4">
                                Meet Our Team <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutPreviewSection;
