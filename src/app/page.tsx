import { Testimonial } from '@/lib/types';
import EngagementTracker from '@/components/EngagementTracker';
import InfinityTicker from '@/components/InfinityTicker';

// Client Components
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection'; // [NEW]
import AboutPreviewSection from '@/components/home/AboutPreviewSection'; // [NEW]

import ProcessTimelineSection from '@/components/home/ProcessTimelineSection';
import DestinationsSection from '@/components/home/DestinationsSection';
import PartnershipSection from '@/components/home/PartnershipSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Study Abroad Consultancy | EduExpress International",
  description: "Transform your education journey with EduExpress International. Expert study abroad consultancy in Bangladesh with FREE scholarship assistance for UK, USA, Canada, & more.",
};

// import connectDB from '@/lib/mongodb';
// import TestimonialModel from '@/models/Testimonial';

async function getTestimonials(): Promise<Testimonial[]> {
  // Returning hardcoded real testimonials as requested
  return [
    {
      _id: "t1",
      name: "Tanveer Shuvo",
      location: "University of Oulu",
      university: "University of Oulu",
      program: "Student",
      quote: "Highly recommended. They are very much professional and highly skilled and helped me a lot throughout my whole journey. It was a great experience with them.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
      country: "Finland",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "t2",
      name: "Sarah Rahman",
      location: "Tbilisi State Medical University",
      university: "Tbilisi State Medical University",
      program: "Master's Student",
      quote: "The guidance I received for my visa application was exceptional. They handled every detail with precision. I'm now living my dream in Europe thanks to EduExpress.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      country: "Georgia",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "t3",
      name: "Michael Chen",
      location: "Seoul National University",
      university: "Seoul National University",
      program: "Research Fellow",
      quote: "Getting a full scholarship seemed impossible until I met this team. Their strategic advice and essay editing were game-changers for my application.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      country: "South Korea",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "t4",
      name: "Ayesha Siddiqua",
      location: "University of Cyprus",
      university: "University of Cyprus",
      program: "Undergraduate",
      quote: "Supportive, transparent, and always available. They didn't just process my file; they mentored me through the entire interview process.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
      country: "Cyprus",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

export default async function Home() {
  const testimonials = await getTestimonials();

  return (
    <div className="min-h-screen font-sans selection:bg-rose-500/20 selection:text-rose-900 overflow-x-hidden relative bg-[#FAFAFA]">
      <EngagementTracker pageName="home" />

      {/* Hero Section (Aurora + 3D Card) */}
      <HeroSection />

      {/* Features / Why Choose Us - Added for Trust */}
      <FeaturesSection />

      {/* Top Destinations (Acting as University Partners/Destinations) */}
      <DestinationsSection />

      {/* Process Timeline */}
      <ProcessTimelineSection />

      {/* About/Team Preview - Added for Trust */}
      <AboutPreviewSection />

      {/* Partnership Program */}
      <PartnershipSection />

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Final CTA (Boarding Pass) */}
      <CTASection />

      {/* Infinity Ticker Section */}
      <section className="mb-0">
        <InfinityTicker />
      </section>

    </div>
  );
}
