'use client';

import { ArrowRight, Share2, Calendar, Clock, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { trackConsultationRequest } from '@/lib/analytics';
import { UpdateClientProps } from '@/lib/types';

export default function UpdateClient({ update }: UpdateClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: update.title,
          text: update.excerpt || update.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  // Calculate read time
  const readTime = Math.max(1, Math.ceil((update.content.length || 0) / 1000)) + ' min read';

  // Dynamic Category Colors (Matching Main List)
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Scholarships': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Visa Updates': 'bg-blue-100 text-blue-800 border-blue-200',
      'Events': 'bg-violet-100 text-violet-800 border-violet-200',
      'Partnerships': 'bg-orange-100 text-orange-800 border-orange-200',
      'Success Stories': 'bg-amber-100 text-amber-800 border-amber-200',
      'Announcement': 'bg-pink-100 text-pink-800 border-pink-200',
      'News': 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-24">

      {/* 1. Sticky Professional Header */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 transition-all">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link
            href="/updates"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-slate-100 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to Updates
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-white hover:text-slate-900 transition-all border border-slate-200 hover:border-slate-300 shadow-sm bg-white/50"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </nav>

      <main className="pt-28 md:pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* 2. Structured White Card Container */}
          <article className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 overflow-hidden p-8 md:p-12 lg:p-16 mb-16">

            {/* Header Info */}
            <header className="mb-12 text-center max-w-2xl mx-auto">
              {/* Meta Caps */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                {update.category && (
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getCategoryColor(update.category)}`}>
                    {update.category}
                  </span>
                )}
                <span className="text-slate-300 text-lg">•</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  {formatDate(update.publishedAt || update.createdAt)}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 mb-8 leading-[1.15] tracking-tight text-balance">
                {update.title}
              </h1>

              {/* Read Time */}
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                <Clock className="w-4 h-4" />
                {readTime}
              </div>
            </header>

            {/* Wide Focus Image */}
            {update.featuredImage && (
              <div className="mb-16 -mx-8 md:-mx-12 lg:-mx-16 relative aspect-video shadow-sm border-y border-slate-100 bg-slate-50">
                <Image
                  src={update.featuredImage}
                  alt={update.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg md:prose-xl max-w-none prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:text-slate-700 prose-p:leading-8 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold prose-img:rounded-2xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/30 prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:my-10 prose-blockquote:not-italic prose-blockquote:rounded-r-xl">
              {update.excerpt && (
                <p className="lead text-2xl font-normal text-slate-600 mb-12 not-prose leading-relaxed border-b border-slate-100 pb-12">
                  {update.excerpt}
                </p>
              )}

              <div dangerouslySetInnerHTML={{ __html: update.content }} />
            </div>
          </article>

          {/* 6. High-Visibility Gradient CTA Banner */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-10 md:p-16 text-center shadow-2xl shadow-blue-600/30 relative overflow-hidden mb-12">

            {/* Subtle Pattern to add texture without reducing contrast */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
                Start your study abroad journey
              </h2>
              <p className="text-blue-50 mb-10 max-w-2xl mx-auto text-lg/relaxed font-medium drop-shadow-sm">
                Join thousands of students who have realized their dreams. Our expert counselors are here to guide you through every step.
              </p>

              <button
                onClick={() => {
                  trackConsultationRequest('update_footer_cta');
                  window.dispatchEvent(new CustomEvent('openQuickForm'));
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-700 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:bg-blue-50 hover:-translate-y-1"
              >
                Book Free Consultation
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
