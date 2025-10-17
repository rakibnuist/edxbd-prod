'use client';

import { User, ArrowRight, Share2, MessageCircle, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackConsultationRequest } from '@/lib/analytics';
import { Update, UpdateClientProps } from '@/lib/types';

export default function UpdateClient({ update }: UpdateClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const whiteTextStyle = {
    color: '#ffffff',
    WebkitTextFillColor: '#ffffff',
    textFillColor: '#ffffff',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    fontWeight: '500'
  };

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
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .cta-title {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          text-fill-color: #ffffff !important;
        }
        .cta-title * {
          color: #ffffff !important;
        }
      `}</style>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200 pt-20 pb-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100 rounded-full translate-y-40 -translate-x-40 opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 bg-clip-text text-transparent leading-tight flex-1">
                {update.title}
              </h1>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 ml-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Featured Image Section */}
      {update.featuredImage && (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-48 -translate-x-48 opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-100 rounded-full translate-y-40 translate-x-40 opacity-10"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 relative group">
                <img 
                  src={update.featuredImage} 
                  alt={update.title}
                  className="w-full h-80 lg:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Content Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full -translate-y-48 translate-x-48 opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full translate-y-40 -translate-x-40 opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-12 shadow-xl relative overflow-hidden">
              {/* Content decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="article-body relative z-10">
                {isClient ? (
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-li:text-slate-700 prose-blockquote:text-slate-600 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: update.content }}
                    suppressHydrationWarning={true}
                  />
                ) : (
                  <div className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-li:text-slate-700 prose-blockquote:text-slate-600 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-xl">
                    <div dangerouslySetInnerHTML={{ __html: update.content }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional CTA Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/80"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 
                className="cta-title text-4xl sm:text-5xl font-bold drop-shadow-2xl shadow-black/50 bg-black/20 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/10" 
                style={{
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff'
                }}
              >
                Ready to Start Your Journey?
              </h2>
            </div>
            <p className="text-xl text-white mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              Get your <span className="font-semibold text-blue-300">FREE consultation</span> today and take the first step towards your international education.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => {
                  trackConsultationRequest('update_final_cta');
                  window.dispatchEvent(new CustomEvent('openQuickForm'));
                }}
                className="group flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 min-h-[60px] border border-blue-500"
              >
                <User className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Get FREE Consultation
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="https://wa.me/8801983333566?text=Hi! I'm interested in study abroad consultation. Can you help me?"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 min-h-[60px] border border-green-500"
              >
                <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Chat on WhatsApp
                <div className="ml-3 relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
                </div>
              </a>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg">
                  <Phone className="w-8 h-8 text-blue-300" />
                </div>
                <div className="text-2xl font-bold text-blue-300 drop-shadow-md">24/7</div>
                <div className="text-sm" style={whiteTextStyle}>Support</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg">
                  <User className="w-8 h-8 text-blue-300" />
                </div>
                <div className="text-2xl font-bold text-blue-300 drop-shadow-md">FREE</div>
                <div className="text-sm" style={whiteTextStyle}>Consultation</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-blue-300" />
                </div>
                <div className="text-2xl font-bold text-blue-300 drop-shadow-md">Instant</div>
                <div className="text-sm" style={whiteTextStyle}>Response</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg">
                  <ArrowRight className="w-8 h-8 text-blue-300" />
                </div>
                <div className="text-2xl font-bold text-blue-300 drop-shadow-md">Fast</div>
                <div className="text-sm" style={whiteTextStyle}>Processing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Form Modal */}
    </div>
  );
}
