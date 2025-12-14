'use client';

import Image from 'next/image';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const teamMembers = [
    {
        name: 'Abdullah Al Rakib',
        role: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
        bio: 'Visionary leader with a passion for global education, guiding the strategic direction of EduExpress since its inception.',
    },
    {
        name: 'Sakib Al Jubaer',
        role: 'Managing Director',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
        bio: 'Overseeing daily operations and ensuring excellence in service delivery across all our branches.',
    },
    {
        name: 'Tahmid Al Jamee',
        role: 'Head of Marketing',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
        bio: 'Driving our brand presence and connecting students with opportunities through innovative marketing strategies.',
    },
    {
        name: 'Md Taj Ahmed',
        role: 'Application Processing',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        bio: 'Expert in university admissions, ensuring every application is meticulously prepared for success.',
    },
    {
        name: 'Mukta Rahaman',
        role: 'Senior Counselor',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        bio: 'Experienced mentor providing in-depth career guidance and university selection advice to students.',
    },
    {
        name: 'Jannatun Ema',
        role: 'Counselor',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
        bio: 'Dedicated to helping students navigate their study abroad options with personalized support.',
    },
    {
        name: 'Md Abdullah Al Razib',
        role: 'Application Processing',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
        bio: 'Specialist in documentation and application tracking, ensuring timely submissions and updates.',
    },
    {
        name: 'Md Tauhidul Islam Nur',
        role: 'Country Manager (China)',
        image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop',
        bio: 'Leading our operations in China, building strong relationships with top Chinese universities.',
    },
    {
        name: 'Md Infeter Islam',
        role: 'Marketing Executive',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
        bio: 'Executing dynamic marketing campaigns to reach aspiring students across the country.',
    },
    {
        name: 'Md Israfil Hossain',
        role: 'Marketing Executive',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
        bio: 'Passionate about connecting with students and sharing the transformative power of international education.',
    },
    {
        name: 'Md Tanver Islam',
        role: 'Marketing Executive',
        image: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?q=80&w=800&auto=format&fit=crop',
        bio: 'Engaging with our community through events and digital channels to support student queries.',
    },
];

export default function TeamSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Expert Team</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Behind every successful student is a team of dedicated professionals committed to your future.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <div className="flex gap-4 justify-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <a href="#" className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white hover:text-blue-900 transition-colors">
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                            <a href="#" className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white hover:text-blue-400 transition-colors">
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                            <a href="#" className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white hover:text-red-500 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
