'use client';

import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, Award, Users } from 'lucide-react';

const WhyChooseSection = () => {
    return (
        <section className="py-24 relative z-10 bg-slate-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">Why Choose EduExpress</h2>
                        <h3 className="text-3xl md:text-5xl font-heading font-black text-slate-900 mb-6 tracking-tight">
                            Your Success is Our <span className="text-blue-600">Mission</span>
                        </h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We bridge the gap between your ambition and admission with a data-driven, transparent, and personalized approach.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Strategic Counseling</h4>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            No generic advice. We use precision matching to align your academic profile with strict university requirements, maximizing acceptance rates.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center text-sm text-slate-700 font-medium">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> 98% Visa Success Rate
                            </li>
                            <li className="flex items-center text-sm text-slate-700 font-medium">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Personalized Roadmap
                            </li>
                        </ul>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl">Top Rated</div>
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                            <Award className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">Scholarship Guarantee</h4>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            From full tuition waivers to monthly stipends, we specialize in securing high-value scholarships like CSC, GKS, and Stipendium Hungaricum.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center text-sm text-slate-700 font-medium">
                                <CheckCircle className="w-4 h-4 text-amber-500 mr-2" /> $5M+ Secured Funding
                            </li>
                            <li className="flex items-center text-sm text-slate-700 font-medium">
                                <CheckCircle className="w-4 h-4 text-amber-500 mr-2" /> Monthly Stipend Access
                            </li>
                        </ul>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 text-violet-600 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors">End-to-End Support</h4>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            We don&apos;t just get you an offer letter. We handle visa processing, travel arrangements, and even help you settle in your new country.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center text-sm text-slate-700 font-medium">
                                <CheckCircle className="w-4 h-4 text-violet-500 mr-2" /> Airport Pickup
                            </li>
                            <li className="flex items-center text-sm text-slate-700 font-medium">
                                <CheckCircle className="w-4 h-4 text-violet-500 mr-2" /> Accommodation Support
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
