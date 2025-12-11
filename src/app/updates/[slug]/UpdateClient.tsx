'use client';

import { ArrowRight, Share2, Calendar, Clock, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
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

  // Smart title splitting for PageHeader
  const words = update.title.split(' ');
  const titlePart = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const highlightPart = words.slice(Math.ceil(words.length / 2)).join(' ');

  // Calculate read time
  const readTime = Math.max(1, Math.ceil((update.content.length || 0) / 1000)) + ' min read';

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">

      {/* 1. Standardized Header */}
      <PageHeader
        title={titlePart}
        highlight={highlightPart}
        description={update.excerpt || "Latest updates and opportunities from EduExpress International"}
        icon={Calendar}
        badgeText={update.category || "Update"}
      >
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            {readTime}
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Calendar className="w-4 h-4 text-blue-500" />
            {formatDate(update.publishedAt || update.createdAt)}
          </div>
        </div>
      </PageHeader>

      <main className="relative z-10 -mt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Link
              href="/updates"
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all group bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Updates
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white/90 backdrop-blur-md border border-slate-200 hover:border-slate-300 transition-all hover:bg-slate-50 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* 2. Content Card */}
          <article className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden p-8 md:p-12 lg:p-16 mb-16 ring-1 ring-slate-100">

            {/* Wide Focus Image */}
            {update.featuredImage && (
              <div className="mb-12 -mx-8 md:-mx-12 lg:-mx-16 mt-[-2rem] md:mt-[-3rem] lg:mt-[-4rem] relative aspect-video shadow-sm border-b border-slate-100">
                <Image
                  src={update.featuredImage}
                  alt={update.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            )}

            {/* Content - Prose Slate (Dark text) */}
            <div className="update-content-fix prose prose-lg md:prose-xl max-w-none prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:leading-8 prose-p:text-slate-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold prose-img:rounded-2xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 prose-blockquote:text-slate-700 prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:my-10 prose-blockquote:not-italic prose-blockquote:rounded-r-xl prose-strong:text-slate-900">
              <div dangerouslySetInnerHTML={{ __html: update.content }} />
            </div>
          </article>

          {/* 6. High-Visibility Gradient CTA Banner */}
          <div className="bg-slate-900 rounded-[2rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden mb-12 group">

            <div className="absolute inset-0 bg-blue-900/20"></div>
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
                Start your study abroad journey
              </h2>
              <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg/relaxed font-medium">
                Join thousands of students who have realized their dreams. Our expert counselors are here to guide you through every step.
              </p>

              <button
                onClick={() => {
                  trackConsultationRequest('update_footer_cta');
                  window.dispatchEvent(new CustomEvent('openQuickForm'));
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-slate-900 rounded-full font-bold text-lg transition-all shadow-lg shadow-amber-500/20 hover:bg-amber-400 hover:scale-105 active:scale-95 hover:shadow-amber-500/30"
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
