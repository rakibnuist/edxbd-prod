'use client';

import { Globe, ArrowRight, GraduationCap, Building2, Wallet } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ConsultationButton from '@/components/ConsultationButton';
import { countries } from '@/lib/countries';

export default function DestinationsClient() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <PageHeader
                title="Study Abroad"
                highlight="Destinations"
                description="Explore top study abroad destinations with scholarship opportunities. Study in UK, China, South Korea, Hungary, Cyprus, Croatia, Georgia, Finland, Netherlands and more."
                icon={<Globe />}
                badgeText="Global Opportunities"
            />

            {/* Countries Grid */}
            <section className="py-24 relative bg-slate-50">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {countries.map((country) => (
                            <Link
                                href={country.slug === 'china' ? '/destinations/china' : `/destinations/${country.slug}`}
                                key={country.slug}
                                className="group relative bg-white rounded-[2rem] border border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col h-full"
                            >
                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="p-8 flex flex-col flex-grow relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                                            {country.flag}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 shadow-sm">
                                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                                        {country.name}
                                    </h2>
                                    <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                                        {country.description}
                                    </p>

                                    {/* Quick Stats */}
                                    <div className="space-y-4 mt-auto">
                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 group-hover:bg-white/80 transition-colors">
                                            <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm uppercase tracking-wide">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>Top Universities</span>
                                            </div>
                                            <ul className="text-sm text-slate-600 space-y-1 ml-6 list-disc marker:text-blue-400">
                                                {country.universities.slice(0, 2).map((uni, i) => (
                                                    <li key={i}>{uni}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:bg-white/80 transition-colors">
                                                <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                                                    <Building2 className="w-3 h-3 text-blue-500" />
                                                    <span>Tuition</span>
                                                </div>
                                                <p className="text-slate-600 text-xs font-medium">{country.costs.tuition}</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:bg-white/80 transition-colors">
                                                <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                                                    <Wallet className="w-3 h-3 text-green-500" />
                                                    <span>Living</span>
                                                </div>
                                                <p className="text-slate-600 text-xs font-medium">{country.costs.living}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-blue-900/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white text-center">
                            Ready to Start Your <span className="text-amber-400">Journey?</span>
                        </h2>
                        <p className="text-xl mb-10 text-slate-300 text-center leading-relaxed">
                            Get FREE consultation and scholarship assistance for your dream destination.
                            Our experts are here to guide you every step of the way.
                        </p>
                        <ConsultationButton
                            text="Get FREE Consultation"
                            source="destinations_page_cta"
                            className="inline-flex items-center bg-amber-500 text-slate-900 hover:bg-amber-400 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] shadow-lg"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
