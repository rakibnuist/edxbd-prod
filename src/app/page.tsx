'use client';

import {
  ArrowRight,
  Users,
  CheckCircle,
  Award,
  MessageCircle,
  Globe,
  Building2,
  Handshake,
  Briefcase,
  Star,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

import { useState, useEffect, memo } from 'react';
import EngagementTracker from '@/components/EngagementTracker';
import { featuredCountries } from '@/lib/countries';
import Link from 'next/link';

import InfinityTicker from '@/components/InfinityTicker';

// Types
import { Testimonial } from '@/lib/types';

// --- REFRACTIVE GLASS CARD COMPONENT ---
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`relative backdrop-blur-3xl bg-white/40 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] overflow-hidden ${className}`}>
      {/* Refractive Highlight Edge (Top/Left) */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-white/50 pointer-events-none z-20 mix-blend-overlay"></div>

      {/* Inner Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none z-10"></div>

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay z-0"></div>

      <div className="relative z-30 h-full">
        {children}
      </div>
    </div>
  );
};

// --- 3D PRISM HERO CARD ---
const HeroCard = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <div style={{ perspective: 2000 }} className="hidden lg:flex justify-center items-center">
      <motion.div
        style={{ rotateX, rotateY, z: 100 }}
        drag
        dragElastic={0.10}
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        whileHover={{ cursor: "grab" }}
        whileTap={{ cursor: "grabbing" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const width = rect.width;
          const height = rect.height;
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const xPct = mouseX / width - 0.5;
          const yPct = mouseY / height - 0.5;
          x.set(xPct * 400);
          y.set(yPct * 400);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="relative w-full max-w-md aspect-[3/4] rounded-[2.5rem] bg-white/10 backdrop-blur-3xl border-2 border-white/30 shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] p-8 flex flex-col overflow-hidden group transition-all duration-300 ease-out"
      >
        {/* Holographic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 via-purple-400/10 to-amber-400/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

        {/* Prismatic Edge Shine */}
        <div className="absolute -inset-[2px] rounded-[2.5rem] bg-gradient-to-br from-white/80 via-transparent to-white/20 opacity-100 pointer-events-none z-50 mix-blend-overlay"></div>

        {/* Inner Glass Thickness */}
        <div className="absolute inset-[1px] rounded-[2.5rem] bg-white/20 backdrop-blur-md z-0"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-white/40 flex items-center justify-center border border-white/50 shadow-inner backdrop-blur-md">
              <Globe className="w-8 h-8 text-blue-600 drop-shadow-sm" />
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-800 uppercase tracking-widest font-black mb-1">Your Future</div>
              <div className="text-3xl font-black text-slate-800 font-heading tracking-tight drop-shadow-sm">Secured</div>
            </div>
          </div>

          {/* Middle: Checklist */}
          <div className="space-y-4 flex-grow pointer-events-none">
            {[
              { label: "Profile Evaluation", checked: true },
              { label: "Check Eligibility", checked: true },
              { label: "Scholarship Search", checked: true },
              { label: "Visa Approval", checked: false, highlight: true }
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md ${item.highlight ? 'bg-blue-500/10 border-blue-400/30' : 'bg-white/30 border-white/40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 backdrop-blur-sm ${item.checked ? 'bg-green-500 text-white scale-110' : (item.highlight ? 'bg-blue-600 shadow-blue-500/50 animate-pulse text-white' : 'border-2 border-white/50 text-transparent')}`}>
                  {(item.checked || item.highlight) && <CheckCircle className="w-5 h-5" />}
                </div>
                <span className={`font-bold text-lg drop-shadow-sm ${item.highlight ? 'text-blue-900' : 'text-slate-700'}`}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Bottom: Action */}
          <div className="mt-auto pt-6">
            <button
              onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('openQuickForm')); }}
              className="w-full py-4 bg-slate-900/90 hover:bg-blue-700/90 backdrop-blur-md text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 border border-white/20 flex items-center justify-center gap-2 group/btn"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover/btn:animate-spin" />
              <span>Verify Now</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Home = memo(function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);

  // REALISTIC Ticker Data
  const tickerItems = [
    "🎉 Visa Granted: China (X1 Student Visa)",
    "🎉 Scholarship Won: Stipendium Hungaricum (Hungary)",
    "🎉 Visa Granted: UK (University of Portsmouth)",
    "🎉 Admission Offer: GKS Scholarship (South Korea)"
  ];

  // Duplicate countries for infinity scroll
  const marqueeCountries = [...featuredCountries, ...featuredCountries];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  // Fetch testimonials
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        } else {
          // Fallback data
          setTestimonials([
            {
              _id: "1",
              name: "Sadia Rahman",
              location: "Zhejiang University",
              program: "MBBS",
              quote: "EduExpress helped me get the CSC Type A full scholarship. I am studying Medicine in China completely free of cost!",
              rating: 5,
              image: "🇨🇳",
              country: "China",
              university: "Zhejiang University",
              isActive: true,
              featured: true,
              createdAt: "",
              updatedAt: ""
            },
            {
              _id: "2",
              name: "Tanvir Hasan",
              location: "University of Debrecen",
              program: "BSc Engineering",
              quote: "The team guided me perfectly for the Stipendium Hungaricum scholarship. Now I'm in Europe with full funding.",
              rating: 5,
              image: "🇭🇺",
              country: "Hungary",
              university: "University of Debrecen",
              isActive: true,
              featured: true,
              createdAt: "",
              updatedAt: ""
            },
            {
              _id: "3",
              name: "Mahmud Hasan",
              location: "University of South Wales",
              program: "MSc Management",
              quote: "Visa processing for the UK was complex, but they made it so simple. got my visa in just 7 days without an interview!",
              rating: 5,
              image: "🇬🇧",
              country: "UK",
              university: "University of South Wales",
              isActive: true,
              featured: true,
              createdAt: "",
              updatedAt: ""
            }
          ]);
        }
      } catch (e) { console.error(e); }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-rose-500/20 selection:text-rose-900 overflow-x-hidden relative bg-[#FAFAFA]">
      <EngagementTracker pageName="home" />

      {/* --- BACKGROUND AURORA (FIXED) --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-[1]"></div>

        {/* Aurora Blobs */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-blue-300/30 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1], x: [0, 100, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-rose-300/30 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-amber-200/30 blur-[100px] mix-blend-multiply"
        />
      </div>

      {/* --- HERO SECTION: CRYSTAL CLEAR --- */}
      <section className="relative min-h-[100vh] flex items-center pt-32 pb-20 relative z-10 overflow-hidden">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl relative"
          >
            {/* Glass Ticker */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-lg shadow-blue-500/5 mb-10 overflow-hidden hover:scale-105 transition-all cursor-default relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-lg shadow-green-500/50"></span>
              </span>
              <AnimatePresence mode='wait'>
                <motion.span
                  key={tickerIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm font-bold tracking-wide text-green-800 whitespace-nowrap drop-shadow-sm"
                >
                  {tickerItems[tickerIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <h1 className="text-5xl lg:text-8xl font-black font-heading leading-[1.05] mb-8 tracking-tighter text-slate-900 drop-shadow-lg">
              <span className="block mb-2">Crafting</span>
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 pb-2">Global</span>
                {/* Text Glint Effect */}
                <div className="absolute -inset-1 bg-blue-400/20 blur-xl -z-10 rounded-full"></div>
              </span>
              <span className="block mt-2">Success.</span>
            </h1>

            <p className="text-xl text-slate-700 mb-12 leading-relaxed font-semibold max-w-lg drop-shadow-sm">
              Unlock prestigious, fully funded opportunities in <span className="bg-white/50 px-2 py-1 rounded-lg border border-white/40 text-blue-700 shadow-sm">China</span>, <span className="bg-white/50 px-2 py-1 rounded-lg border border-white/40 text-blue-700 shadow-sm">Europe</span> & <span className="bg-white/50 px-2 py-1 rounded-lg border border-white/40 text-blue-700 shadow-sm">UK</span> with our precision-matched consultancy.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <motion.button
                suppressHydrationWarning
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.dispatchEvent(new CustomEvent('openQuickForm'))}
                className="px-10 py-5 bg-slate-900 text-white font-black text-lg rounded-full shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all flex items-center justify-center gap-3 group relative overflow-hidden ring-4 ring-white/30 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <Link href="/destinations/china" className="px-10 py-5 bg-white/50 backdrop-blur-lg border border-white/60 text-slate-800 font-bold text-lg rounded-full hover:bg-white/80 transition-all flex items-center justify-center shadow-lg shadow-slate-200/50 hover:shadow-xl">
                Explore Destinations
              </Link>
            </div>

            {/* Stats Strip - Glass Style */}
            <div className="mt-20 pt-10 border-t border-slate-900/10 w-full flex gap-12">
              <div className="group cursor-default">
                <div className="text-5xl font-black font-heading text-slate-900 mb-1 drop-shadow-sm group-hover:text-blue-600 transition-colors">100%</div>
                <div className="text-xs text-slate-600 uppercase tracking-widest font-bold">Visa Success Rate</div>
              </div>
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-400/50 to-transparent"></div>
              <div className="group cursor-default">
                <div className="text-5xl font-black font-heading text-slate-900 mb-1 drop-shadow-sm group-hover:text-amber-500 transition-colors">$5M+</div>
                <div className="text-xs text-slate-600 uppercase tracking-widest font-bold">Scholarships Secured</div>
              </div>
            </div>

          </motion.div>

          {/* RIGHT: Interactive 3D Card */}
          <HeroCard />

        </div>
      </section>

      {/* --- SERVICES (FROSTED BENTO) --- */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <span className="text-blue-800 font-extrabold tracking-widest text-xs uppercase bg-blue-100/50 backdrop-blur-md px-6 py-2 rounded-full border border-blue-200/50 mb-8 shadow-sm inline-flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Why Choose EduExpress
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-heading font-black text-slate-900 mt-2 leading-[0.9] tracking-tighter drop-shadow-lg mb-8">
              Expert Guidance. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 opacity-90">Crystal Clear Results.</span>
            </h2>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
              We combine data-driven university matching with personalized mentorship to ensure your study abroad success is transparent and guaranteed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 auto-rows-[auto]">

            {/* Large Card: Strategic Consultation */}
            <motion.div className="md:col-span-2" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <GlassCard className="h-full p-10 md:p-14 group hover:bg-white/60 transition-colors duration-500">
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 text-left">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 text-blue-600 border border-blue-200/50 backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <MessageCircle className="w-10 h-10 drop-shadow-md" />
                    </div>
                    <h3 className="text-4xl font-heading font-bold text-slate-900 mb-6 drop-shadow-sm">Strategic Consultation</h3>
                    <p className="text-slate-700 leading-relaxed text-lg mb-10 font-medium">
                      We don&apos;t do generic advice. We adhere to a <span className="text-blue-800 font-bold bg-blue-100/50 px-2 py-0.5 rounded border border-blue-200">precision-matching protocol</span> that aligns your academic profile with elite institutions.
                    </p>

                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('openQuickForm'))}
                      className="flex items-center gap-3 px-8 py-4 bg-slate-900/90 text-white font-bold rounded-full hover:bg-blue-700/90 transition-all group/btn shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-md"
                    >
                      Start Profile Analysis <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Visual Decor: Clean Stats Grid */}
                  <div className="grid grid-cols-1 gap-5 min-w-[220px] w-full md:w-auto">
                    <div className="p-8 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-lg group-hover:bg-white/60 transition-all">
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Success Rate</div>
                      <div className="text-5xl font-heading font-black text-slate-900 tracking-tight">98.5%</div>
                    </div>
                    <div className="p-8 bg-blue-500/10 backdrop-blur-xl rounded-[2rem] border border-blue-200/40 shadow-lg group-hover:bg-blue-500/20 transition-all">
                      <div className="text-xs text-blue-800 font-bold uppercase tracking-wider mb-2">Partner Unis</div>
                      <div className="text-5xl font-heading font-black text-blue-700 tracking-tight">150+</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Tall Card: Scholarship Expert */}
            <motion.div className="md:row-span-2" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <GlassCard className="h-full bg-gradient-to-b from-blue-600/90 to-indigo-700/90 border-blue-400/30 p-10 md:p-12 text-white group shadow-blue-900/20">
                {/* Inner Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                <div className="relative z-10 h-full flex flex-col items-start text-left">
                  <div className="flex justify-between items-start w-full mb-12">
                    <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center text-white backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Award className="w-10 h-10 drop-shadow-lg" />
                    </div>
                    <div className="px-4 py-2 bg-amber-400/90 backdrop-blur-sm text-slate-900 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-900/20 border border-amber-300">
                      Premium
                    </div>
                  </div>

                  <h3 className="text-5xl font-heading font-black text-white mb-8 leading-none tracking-tight drop-shadow-md">
                    Funding <br /><span className="text-amber-300">Secured.</span>
                  </h3>

                  <p className="text-blue-50 leading-relaxed text-lg mb-12 font-medium opacity-90 drop-shadow-sm">
                    Access prestigious fully-funded opportunities. We specialize in <span className="text-white font-bold decoration-amber-400 underline underline-offset-4">CSC, GKS, & Stipendium Hungaricum</span>.
                  </p>

                  <div className="mt-auto space-y-4 w-full">
                    {['100% Tuition Waiver', 'Monthly Stipend', 'Accommodation'].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors backdrop-blur-md shadow-lg shadow-blue-900/10">
                        <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center text-green-300 border border-green-400/30">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 w-full border-t border-white/10">
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('openQuickForm'))}
                      className="w-full py-5 bg-white text-blue-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-50 active:scale-95"
                    >
                      <span>Check Eligibility</span> <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Card: Post-Arrival */}
            <motion.div className="md:col-span-2" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <GlassCard className="p-10 md:p-12 group hover:bg-teal-50/40 border-teal-100/30 transition-colors duration-500">
                <div className="relative z-10 text-left flex flex-col sm:flex-row gap-10 items-start sm:items-center">
                  <div className="flex-grow">
                    <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 text-teal-600 border border-teal-200/50 backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Users className="w-8 h-8 drop-shadow-sm" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4 drop-shadow-sm">Post-Arrival Care</h3>
                    <p className="text-slate-700 font-medium text-lg leading-relaxed mb-2 max-w-md">
                      We ensure a safe landing. From airport pickup to finding accommodation, our local community helps you settle in.
                    </p>
                  </div>

                  <Link
                    href="/services"
                    className="shrink-0 flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-md text-teal-700 font-bold rounded-full border border-teal-200/50 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all group/btn shadow-lg hover:shadow-xl"
                  >
                    <span>View Services</span> <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- DESTINATIONS MARQUEE (GLASS CARDS) --- */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Wash */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-indigo-600 font-black tracking-widest text-xs uppercase bg-indigo-50/50 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-200/50 shadow-sm">Global Opportunities</span>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 mt-6 tracking-tight drop-shadow-lg">Top Destinations</h2>
            <p className="text-slate-600 mt-6 max-w-xl mx-auto text-lg font-medium">Swipe through our most popular study destinations and find your perfect match.</p>
          </motion.div>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden py-10 group/marquee z-10">
          <div
            className="flex gap-10 w-max animate-marquee-scroll hover:[animation-play-state:paused]"
            style={{ width: "max-content", animationDuration: '60s' }}
          >
            {[...marqueeCountries, ...marqueeCountries].map((country, i) => (
              <motion.div
                key={`${country.name}-${i}`}
                whileHover={{ scale: 1.02, y: -10 }}
                className="shrink-0 w-[350px] h-[520px] rounded-[3rem] overflow-hidden relative group cursor-pointer"
              >
                <GlassCard className="h-full !rounded-[3rem] border-opacity-80 bg-white/80 hover:bg-white/95 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Image Section (Top Half) */}
                  <div className="h-3/5 w-full relative overflow-hidden p-3">
                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                      {/* Gradient Placeholder */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 mix-blend-multiply transition-transform duration-700 group-hover:scale-110`}></div>
                      <div className="absolute inset-0 flex items-center justify-center text-[10rem] opacity-20 select-none grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                        {country.flag}
                      </div>

                      {/* Overlay tag */}
                      <div className="absolute top-6 right-6 z-20">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide bg-white/80 backdrop-blur-md shadow-sm border border-white/50 text-slate-800`}>
                          Top Choice
                        </span>
                      </div>

                      {/* Flag centered */}
                      <div className="absolute bottom-6 left-8 z-20">
                        <span className="text-7xl drop-shadow-xl filter">{country.flag}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section (Bottom Half) */}
                  <div className="h-2/5 px-8 pb-8 pt-2 flex flex-col relative z-10">
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-2 drop-shadow-sm">{country.name}</h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {country.scholarships[0] && (
                        <span className="text-[10px] font-bold px-3 py-1.5 bg-amber-400/20 text-amber-900 border border-amber-400/20 rounded-lg uppercase tracking-wide backdrop-blur-sm">
                          {country.scholarships[0].split(' ')[0]} Scholarship
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                      {country.description}
                    </p>

                    <button
                      className="mt-auto w-full py-4 bg-white/50 hover:bg-blue-600 hover:text-white text-slate-900 border border-white/60 font-bold rounded-2xl transition-all flex justify-center items-center gap-2 group/btn text-sm backdrop-blur-sm shadow-sm"
                      onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('openQuickForm')); }}
                    >
                      View Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PARTNERSHIP (GLASS PREMIUM) --- */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-0 border-white/60 bg-white/40">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-0">

              {/* Left Content */}
              <div className="p-12 md:p-20 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/60 shadow-sm mb-8 backdrop-blur-md">
                    <Handshake className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-800 text-xs font-bold uppercase tracking-widest">B2B Partnership Program</span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 mb-8 leading-[1]">
                    Scale Your Business <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Without Limits.</span>
                  </h2>

                  <p className="text-lg text-slate-700 mb-10 max-w-lg leading-relaxed font-medium">
                    Join our global network of educational agents and institutions. Access exclusive university contracts, high commission rates, and 24/7 processing support.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link href="/partnership" className="px-10 py-5 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-800 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 group/btn border border-white/20">
                      Become a Partner <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>

                {/* Trust Indicators */}
                <div className="mt-16 flex items-center gap-12 border-t border-slate-900/10 pt-8">
                  <div>
                    <div className="text-3xl font-black text-slate-900">50+</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider font-bold">Active Partners</div>
                  </div>
                  <div className="w-px h-12 bg-slate-300"></div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">24h</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider font-bold">Response Time</div>
                  </div>
                </div>
              </div>

              {/* Right Visual: Network Graph */}
              <div className="relative min-h-[400px] lg:min-h-auto bg-white/20 border-t lg:border-t-0 lg:border-l border-white/40 flex items-center justify-center overflow-hidden">
                {/* Interactive Map Visual (Simulated) */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Noise Overlay */}
                  <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                  {/* Central Node */}
                  <div className="absolute z-20 w-28 h-28 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(37,99,235,0.2)] border border-white/60 group-hover:scale-110 transition-transform duration-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-inner">
                      <Globe className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Orbiting Nodes */}
                  <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                    <div className="absolute top-1/4 left-1/4 p-5 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl -rotate-[45deg]">
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="absolute bottom-1/4 right-1/4 p-5 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl -rotate-[45deg]">
                      <Building2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>

                  {/* Connecting Lines (SVG) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <circle cx="50%" cy="50%" r="120" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="text-blue-400 animate-[spin_30s_linear_infinite_reverse]" />
                    <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-indigo-400 animate-[spin_40s_linear_infinite]" />
                  </svg>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* --- TESTIMONIALS (GLASS) --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center md:text-left mb-16">
            <div className="inline-flex items-center gap-2 text-amber-600 font-bold tracking-widest text-sm uppercase mb-4 bg-amber-50/50 px-4 py-2 rounded-full border border-amber-100 backdrop-blur-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>Student Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 leading-tight drop-shadow-lg">
              Don&apos;t just take our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 text-glow-amber">word for it.</span>
            </h2>
          </div>

          {/* Marquee Container */}
          <div className="relative w-full overflow-hidden py-10 -mx-4 px-4">
            {/* Gradient Masks */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>

            {/* CSS Animation Definitions (Inline for simplicity) */}
            <style jsx>{`
              @keyframes marquee-scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.333%); }
              }
              .animate-marquee-scroll {
                animation: marquee-scroll 40s linear infinite;
              }
              .animate-marquee-scroll:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="flex gap-8 w-max animate-marquee-scroll">
              {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="w-[450px] shrink-0">
                  <GlassCard className="p-10 hover:border-blue-300/50 hover:bg-white/60 transition-all duration-300 group flex flex-col h-full rounded-[2.5rem]">
                    {/* Verified Badge */}
                    <div className="absolute top-8 right-8 flex items-center gap-1.5 px-3 py-1 bg-green-50/50 border border-green-200/50 rounded-full backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Verified</span>
                    </div>

                    {/* Quote Icon */}
                    <div className="mb-8">
                      <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 shadow-sm border border-white/50 transition-all duration-300">
                        <MessageCircle className="w-6 h-6 opacity-80" />
                      </div>
                    </div>

                    <blockquote className="text-xl text-slate-700 leading-relaxed font-semibold mb-8 flex-grow">
                      &quot;{t.quote}&quot;
                    </blockquote>

                    <div className="flex items-center gap-4 mt-auto pt-8 border-t border-slate-900/5">
                      <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center text-3xl border border-white shadow-sm overflow-hidden relative">
                        <span className="relative z-10">{t.image}</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">{t.name}</div>
                        <div className="text-sm text-slate-500 font-medium">{t.university}</div>
                      </div>
                      <div className="ml-auto flex text-amber-500 gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badge Strip */}
          <div className="mt-16 pt-12 border-t border-slate-900/5 flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60 mix-blend-multiply">
            {['CSC Scholarship', 'British Council', 'Study In China', 'GKS Algebra', 'UniAssist'].map((badge, i) => (
              <span key={i} className="text-lg font-bold text-slate-400 font-heading uppercase tracking-widest">{badge}</span>
            ))}
          </div>
        </div>
      </section>


      {/* FINAL CTA (GLASS BOARDING PASS) */}
      <section className="py-24 relative overflow-hidden">
        {/* ... (existing content) ... */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            <GlassCard className="p-16 md:p-24 overflow-hidden relative bg-white/60 border-white/80 !shadow-2xl">
              {/* Flight Path Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="flight-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-900" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#flight-grid)" />
              </svg>

              <div className="relative z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center justify-center p-2.5 bg-white/80 border border-white rounded-2xl mb-8 shadow-sm backdrop-blur-md"
                >
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-amber-500/20">
                    <Zap className="w-6 h-6 text-white text-glow" />
                  </div>
                  <div className="text-left pr-4">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1.5">Approaching Deadline</div>
                    <div className="text-slate-900 font-black text-lg leading-none">2026 Intake</div>
                  </div>
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 mb-6 leading-tight tracking-tighter drop-shadow-md">
                  Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Boarding Pass</span> <br />
                  is Waiting.
                </h2>

                <p className="text-xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
                  Stop dreaming about studying abroad. Start packing. We handle the paperwork, you handle the farewell party.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openQuickForm'))}
                    className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white font-black text-xl rounded-full hover:bg-blue-700 transition-all shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 border-4 border-white/20 hover:scale-105 active:scale-95"
                  >
                    Start Free Application <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </section>

      {/* Infinity Ticker Section */}
      <section className="mb-0">
        <InfinityTicker />
      </section>

    </div>
  );
});

export default Home;
