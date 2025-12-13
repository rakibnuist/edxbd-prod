import { Testimonial } from '@/lib/types';
import EngagementTracker from '@/components/EngagementTracker';
import InfinityTicker from '@/components/InfinityTicker';

// Client Components
import HeroSection from '@/components/home/HeroSection';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import DestinationsSection from '@/components/home/DestinationsSection';
import PartnershipSection from '@/components/home/PartnershipSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export const dynamic = 'force-dynamic'; // Ensure fresh data if needed, or remove for static generation

// import connectDB from '@/lib/mongodb';
// import TestimonialModel from '@/models/Testimonial';

async function getTestimonials(): Promise<Testimonial[]> {
  // Returning hardcoded real testimonials as requested
  return [
    {
      _id: "t1",
      name: "Birinda Nemezo Ella Franck Levy",
      location: "Shaoxing University",
      program: "Computer Science",
      quote: "I am now studying Computer Science at Shaoxing University with a full scholarship. Thanks to EduExpress, my tuition and hostel are free, and I even receive a 500 CNY monthly stipend.",
      rating: 5,
      image: "🇨🇳",
      country: "China",
      university: "Shaoxing University",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "t2",
      name: "Orarigdech Yannapong",
      location: "Jiangsu Shipping College",
      program: "Diploma in Computer Network Technology",
      quote: "I secured a full scholarship for my Diploma in Computer Network Technology at Jiangsu Shipping College. Thanks to EduExpress, my journey from Thailand was seamless, and my tuition and hostel are fully covered.",
      rating: 5,
      image: "🇨🇳",
      country: "China",
      university: "Jiangsu Shipping College",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "t3",
      name: "Md. Sakib Hasan",
      location: "Shanghai University of Engineering Science",
      program: "Artificial Intelligence",
      quote: "I secured a tuition-free scholarship for Artificial Intelligence at Shanghai University of Engineering Science. EduExpress handled everything seamlessly, from my application and visa processing to airport pickup.",
      rating: 5,
      image: "🇨🇳",
      country: "China",
      university: "Shanghai University of Engineering Science",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "t4",
      name: "Tharushi Chathurika David Arachchilage",
      location: "Southwest Petroleum University",
      program: "Computer Science",
      quote: "I achieved a Full Tuition Fee Scholarship for Computer Science at Southwest Petroleum University. EduExpress made my dream a reality, guiding me all the way from Sri Lanka.",
      rating: 5,
      image: "🇨🇳",
      country: "China",
      university: "Southwest Petroleum University",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "t5",
      name: "Lija Akter",
      location: "Nantong University",
      program: "Pharmacy",
      quote: "I was awarded a full scholarship for Pharmacy at Nantong University. EduExpress handled everything seamlessly—from my visa processing in Bangladesh to airport pickup and registration.",
      rating: 5,
      image: "🇨🇳",
      country: "China",
      university: "Nantong University",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "t6",
      name: "Md Khaled Mahmud",
      location: "Taiyuan University of Technology",
      program: "Scholarship Recipient",
      quote: "I secured a Full Tuition Scholarship and a 1000 CNY monthly stipend at Taiyuan University of Technology. EduExpress made my journey smooth, handling everything from visa assistance to on-ground support.",
      rating: 5,
      image: "🇨🇳",
      country: "China",
      university: "Taiyuan University of Technology",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "t7",
      name: "Naoroj Jaman Rafi",
      location: "Shanghai University of Electric Power",
      program: "Scholarship Recipient",
      quote: "I obtained a Full Tuition Scholarship and a 1200 CNY monthly stipend at Shanghai University of Electric Power. EduExpress ensured a seamless transition from Bangladesh, handling my visa and even airport pickup.",
      rating: 5,
      image: "🇨🇳",
      country: "China",
      university: "Shanghai University of Electric Power",
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  /*
  try {
    await connectDB();
    // Fetch active and featured testimonials, sorted by newest
    const testimonials = await TestimonialModel.find({ isActive: true, featured: true })
      .sort({ createdAt: -1 })
      .lean();
    
    // Serialize to standard JSON objects to avoid serialization warnings with ObjectId
    return JSON.parse(JSON.stringify(testimonials));
  } catch (error) {
    console.error("Failed to fetch testimonials", error);
    return [];
  }
  */
}

export default async function Home() {
  const testimonials = await getTestimonials();

  return (
    <div className="min-h-screen font-sans selection:bg-rose-500/20 selection:text-rose-900 overflow-x-hidden relative bg-[#FAFAFA]">
      <EngagementTracker pageName="home" />

      {/* Hero Section (Aurora + 3D Card) */}
      <HeroSection />

      {/* Why Choose EduExpress */}
      <WhyChooseSection />

      {/* Top Destinations */}
      <DestinationsSection />

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
