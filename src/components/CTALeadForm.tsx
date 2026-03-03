
'use client';

import EnhancedContactForm from './EnhancedContactForm';
import { Shield, Clock, Users, Sparkles } from 'lucide-react';

interface CTALeadFormProps {
    universityName: string;
}

const CTALeadForm = ({ universityName }: CTALeadFormProps) => {
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Urgency Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2" />

                {/* Live indicator */}
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <span className="flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/30">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Free Consultation
                    </span>
                </div>

                <h3 className="text-lg font-extrabold mb-1 leading-tight relative z-10">
                    Apply to {universityName}
                </h3>
                <p className="text-blue-100 text-sm relative z-10">
                    Get expert guidance, scholarship check & admission support — <span className="font-bold text-white">100% free.</span>
                </p>

                {/* Trust stats */}
                <div className="grid grid-cols-3 gap-2 mt-5 relative z-10">
                    {[
                        { icon: <Users className="w-3.5 h-3.5" />, label: '500+', sub: 'Placed' },
                        { icon: <Shield className="w-3.5 h-3.5" />, label: '98%', sub: 'Success' },
                        { icon: <Clock className="w-3.5 h-3.5" />, label: '24h', sub: 'Response' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center bg-white/15 rounded-xl py-2 px-1 border border-white/20">
                            <div className="text-blue-200 mb-0.5">{stat.icon}</div>
                            <p className="text-white font-extrabold text-sm leading-none">{stat.label}</p>
                            <p className="text-blue-200 text-[10px] font-semibold mt-0.5">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form */}
            <div className="p-5">
                <EnhancedContactForm
                    formType="application"
                    source={`university_page_${universityName.toLowerCase().replace(/\s+/g, '_')}`}
                    title=""
                    description=""
                    showCountry={false}
                    showProgram={true}
                    showMessage={true}
                    showLocation={false}
                    className="shadow-none"
                />

                {/* Trust footer */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Shield className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400 leading-snug">
                        Your data is 100% private. No spam, no obligations.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CTALeadForm;

