'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, Star, ArrowRight, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackConsultationRequest, trackPageView } from '@/lib/analytics';
import { Update, UpdatesResponse } from '@/lib/types';

const DEFAULT_CATEGORY_FILTERS = [
  'Announcement',
  'University',
  'Success',
  'Partnership',
  'News'
];

const ITEMS_PER_PAGE = 9;

const normalizeFilterValue = (value?: string | null) => value ? value.trim().toLowerCase() : '';
const getPrimaryCategory = (update: Update) => update.category || update.categories?.[0] || '';
const mergeUniqueCategories = (base: string[], additions: string[]) => {
  const seen = new Set<string>();
  const merged: string[] = [];

  [...base, ...additions].forEach((category) => {
    const trimmed = category?.trim();
    if (!trimmed) {
      return;
    }
    const key = trimmed.toLowerCase();
    if (!seen.has(key) && key !== 'all') {
      seen.add(key);
      merged.push(trimmed);
    }
  });

  return merged;
};

export default function UpdatesClient() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<Update[]>([]);
  const [apiCategories, setApiCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/updates');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdatesResponse = await response.json();

      setUpdates(data.updates || []);
      setApiCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching updates:', error);
      setUpdates([]);
      setApiCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUpdates = useCallback(() => {
    let filtered = [...updates];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(update =>
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      const normalizedSelectedCategory = normalizeFilterValue(selectedCategory);
      filtered = filtered.filter(update => {
        const singleCategoryMatch = normalizeFilterValue(update.category) === normalizedSelectedCategory;
        const multiCategoryMatch = (update.categories || []).some(
          (categoryItem) => normalizeFilterValue(categoryItem) === normalizedSelectedCategory
        );
        return singleCategoryMatch || multiCategoryMatch;
      });
    }

    // Date filter
    if (dateFilter !== 'All') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'Last Week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'Last Month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'Last Year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(update => {
        const updateDate = new Date(update.publishedAt || update.createdAt);
        return updateDate >= filterDate;
      });
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(update => update.isFeatured);
    }

    // Sort updates
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt);
      const dateB = new Date(b.publishedAt || b.createdAt);

      switch (sortBy) {
        case 'newest':
          return dateB.getTime() - dateA.getTime();
        case 'oldest':
          return dateA.getTime() - dateB.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return dateB.getTime() - dateA.getTime();
      }
    });

    setFilteredUpdates(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [updates, searchTerm, selectedCategory, dateFilter, sortBy, showFeaturedOnly]);

  useEffect(() => {
    fetchUpdates();
    trackPageView('updates_page');
  }, []);

  useEffect(() => {
    filterUpdates();
  }, [updates, searchTerm, selectedCategory, dateFilter, sortBy, showFeaturedOnly, filterUpdates]);


  const closeModal = () => {
    setShowModal(false);
    setSelectedUpdate(null);
  };

  const handleContactFormOpen = () => {
    trackConsultationRequest('updates_page_cta_clicked');
    window.dispatchEvent(new CustomEvent('openQuickForm'));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setDateFilter('All');
    setSortBy('newest');
    setShowFeaturedOnly(false);
    setCurrentPage(1);
  };


  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Scholarships': 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
      'Visa Updates': 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
      'Events': 'bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100',
      'Partnerships': 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
      'Success Stories': 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100',
      'Announcement': 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
      'News': 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
    };
    return colors[category] || 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100';
  };

  const selectedPrimaryCategory = selectedUpdate ? getPrimaryCategory(selectedUpdate) : '';
  const categoryOptions = useMemo(
    () => ['All', ...mergeUniqueCategories(DEFAULT_CATEGORY_FILTERS, apiCategories)],
    [apiCategories]
  );

  const isAnyFilterActive = useMemo(() => {
    return searchTerm !== '' ||
      selectedCategory !== 'All' ||
      dateFilter !== 'All' ||
      showFeaturedOnly === true;
  }, [searchTerm, selectedCategory, dateFilter, showFeaturedOnly]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUpdates.length / ITEMS_PER_PAGE);
  const paginatedUpdates = filteredUpdates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 600, behavior: 'smooth' }); // Scroll to top of grid
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Loading updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Vibrant Hero Section */}
      <div className="relative bg-[#0F172A] overflow-hidden">
        {/* Dynamic Background with brighter gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px]"></div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8 backdrop-blur-md shadow-xl ring-1 ring-white/10">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="tracking-wide">Explore Global Opportunities</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
            <span className="text-white drop-shadow-lg">Study Abroad </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient">Updates</span>
          </h1>

          <p className="text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Your daily source for scholarship news, university announcements, and visa policy updates from around the world.
          </p>

          <button
            onClick={handleContactFormOpen}
            className="group relative inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95"
          >
            <span className="relative z-10 flex items-center">
              Get Updates
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-10">

        {/* Modern Glass Filters Panel */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 mb-16 ring-1 ring-black/5">

          {/* Top Row: Big Search & Toggle */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Find scholarships, news, articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium text-lg leading-6"
                />
              </div>
            </div>

            {/* Desktop Featured Toggle */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 border-2 ${showFeaturedOnly
                  ? 'border-amber-200 bg-amber-50/50 text-amber-700'
                  : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Star className={`w-5 h-5 ${showFeaturedOnly ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`} />
                <span className="whitespace-nowrap">Featured Only</span>
              </button>
            </div>
          </div>

          {/* Categories Chips - More Vibrant */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${selectedCategory === category
                    ? getCategoryColor(category).replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-').replace('hover:', '') + ' ring-2 ring-offset-2 ring-transparent shadow-sm scale-105'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Granular Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100/50">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="block w-full py-2.5 pl-3 pr-10 text-sm text-gray-700 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="All">All Time</option>
                <option value="Last Week">Last Week</option>
                <option value="Last Month">Last Month</option>
                <option value="Last Year">Last Year</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full py-2.5 pl-3 pr-10 text-sm text-gray-700 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            {/* Mobile Featured Toggle */}
            <div className="sm:hidden space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
              <button
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${showFeaturedOnly ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-600'
                  }`}
              >
                {showFeaturedOnly ? 'Showing Featured' : 'Show Featured'}
              </button>
            </div>

            {/* Clear Filters Button (Full width on mobile, auto on desktop) */}
            {isAnyFilterActive && (
              <div className="sm:col-span-2 lg:col-span-1 flex items-end justify-start lg:justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-bold text-rose-500 hover:text-rose-600 flex items-center py-2 px-4 rounded-lg hover:bg-rose-50 transition-all group w-full lg:w-auto justify-center lg:justify-start"
                >
                  <X className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Latest Updates
              {loading && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
            </h2>
            <p className="text-gray-500 mt-1">Discover opportunities and news tailored for you.</p>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            Found <span className="text-blue-600 font-bold">{filteredUpdates.length}</span> results
          </div>
        </div>


        {/* Updates Grid */}
        {filteredUpdates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
            <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-blue-50/20">
              <Search className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No updates found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">We couldn&apos;t find any updates matching your current filters. Try adjusting them or clear everything.</p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-lg shadow-gray-900/10"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedUpdates.map((update) => {
              const primaryCategory = getPrimaryCategory(update);

              return (
                <article
                  key={update._id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative h-60 overflow-hidden">
                    {update.featuredImage ? (
                      <Image
                        src={update.featuredImage}
                        alt={update.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        priority={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl">
                          📰
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    {update.isFeatured && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-white/95 backdrop-blur-sm text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg transform group-hover:scale-105 transition-transform">
                          <Star className="w-3.5 h-3.5 mr-1.5 fill-amber-500 text-amber-500" />
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Category Badge overlay */}
                    {primaryCategory && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md border backdrop-blur-md ${getCategoryColor(primaryCategory)} bg-white/90`}>
                          {primaryCategory}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    {/* Date */}
                    <div className="flex items-center text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      {formatDate(update.publishedAt || update.createdAt)}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/updates/${update.slug}`} className="focus:outline-none">
                        {update.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    {update.excerpt && (
                      <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                        {update.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                      <Link
                        href={`/updates/${update.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-bold transition-all group/link bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg ml-auto"
                      >
                        Read
                        <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {filteredUpdates.length > ITEMS_PER_PAGE && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

      {/* Modern Modal */}
      {showModal && selectedUpdate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full text-gray-500 hover:text-red-500 transition-all z-10 backdrop-blur-sm shadow-sm ring-1 ring-black/5"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Hero Image in Modal */}
              <div className="relative h-72 w-full bg-gray-100">
                {selectedUpdate.featuredImage ? (
                  <Image
                    src={selectedUpdate.featuredImage}
                    alt={selectedUpdate.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <div className="text-6xl">📰</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedPrimaryCategory && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(selectedPrimaryCategory)} bg-white/95`}>
                        {selectedPrimaryCategory}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight shadow-black/20 drop-shadow-md">
                    {selectedUpdate.title}
                  </h2>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-6 text-gray-500 text-sm mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-center font-medium">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    {formatDate(selectedUpdate.publishedAt || selectedUpdate.createdAt)}
                  </div>
                </div>

                {selectedUpdate.excerpt && (
                  <div className="text-gray-600 leading-relaxed text-lg mb-8">
                    {selectedUpdate.excerpt}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href={`/updates/${selectedUpdate.slug}`}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5"
                  >
                    Read Full Article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
