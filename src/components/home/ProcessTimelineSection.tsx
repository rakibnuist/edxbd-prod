'use client';

import { motion } from 'framer-motion';
import { MessageCircle, FileText, Plane } from 'lucide-react';
import Image from 'next/image';

const steps = [
    {
        id: 1,
        title: 'Consult',
        description: 'Come meet our expert counselors for a free consultation',
        icon: MessageCircle,
        color: 'bg-blue-600',
        ring: 'ring-blue-100',
        text: 'text-blue-600'
    },
    {
        id: 2,
        title: 'Apply',
        description: 'With the help of our team get admission at your desired university',
        icon: FileText,
        color: 'bg-blue-600', // Kept consistent blue as per image
        ring: 'ring-blue-100',
        text: 'text-blue-600'
    },
    {
        id: 3,
        title: 'Fly',
        description: 'Get your visa done with our team, and fly to your dream',
        icon: Plane,
        color: 'bg-blue-600', // Kept consistent blue as per image
        ring: 'ring-blue-100',
        text: 'text-blue-600'
    }
];

const ProcessTimelineSection = () => {
    return (
        <section className="py-24 relative z-10 bg-slate-50">
            {/* Background Image Removed */}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
                    >
                        How We Work
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 font-medium px-4"
                    >
                        Let Your First Step Be Your Only Step
                    </motion.p>
                </div>

                {/* Timeline Container */}
                <div className="relative max-w-5xl mx-auto px-4 md:px-0">

                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-0 w-full h-[3px] bg-slate-100 -z-10">
                        <motion.div
                            initial={{ width: '0%' }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="h-full bg-blue-600"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + (index * 0.2) }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                {/* Step Title (Top for visual balance like reference) */}
                                <h3 className={`text-xl font-bold ${step.text} mb-6 transition-colors duration-300`}>
                                    {step.title}
                                </h3>

                                {/* Number Circle */}
                                <div className="relative mb-6">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                        className={`w-12 h-12 md:w-16 md:h-16 ${step.color} rounded-full flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg shadow-blue-200/50 relative z-10`}
                                    >
                                        <step.icon className="w-6 h-6 md:w-8 md:h-8" />
                                    </motion.div>

                                    {/* Pulse Effect */}
                                    <div className={`absolute inset-0 ${step.color} opacity-20 rounded-full animate-ping`} />
                                </div>

                                {/* Description */}
                                <p className="text-slate-500 max-w-[250px] leading-relaxed mx-auto">
                                    {step.description}
                                </p>

                                {/* Connecting Line (Mobile) */}
                                {index !== steps.length - 1 && (
                                    <div className="md:hidden absolute bottom-[-48px] left-1/2 -translate-x-1/2 w-[2px] h-12 bg-slate-200 -z-10" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ProcessTimelineSection;
