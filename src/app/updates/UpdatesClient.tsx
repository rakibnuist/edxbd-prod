'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, Star, ArrowRight, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackConsultationRequest, trackPageView } from '@/lib/analytics';
import { Update, UpdatesResponse } from '@/lib/types';
import PageHeader from '@/components/PageHeader';

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
      'Scholarships': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Visa Updates': 'bg-blue-50 text-blue-700 border-blue-200',
      'Events': 'bg-violet-50 text-violet-700 border-violet-200',
      'Partnerships': 'bg-orange-50 text-orange-700 border-orange-200',
      'Success Stories': 'bg-amber-50 text-amber-700 border-amber-200',
      'Announcement': 'bg-pink-50 text-pink-700 border-pink-200',
      'News': 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
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
      window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll to top of grid
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Loading updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-100 selection:text-amber-900">

      <PageHeader
        title="Study Abroad"
        highlight="Updates"
        description="Your daily source for scholarship news, university announcements, and visa policy updates from around the world."
        icon={<Sparkles />}
        badgeText="Latest News & Insights"
      >
        <button
          onClick={handleContactFormOpen}
          className="group relative inline-flex items-center px-8 py-4 bg-amber-500 text-slate-900 rounded-full font-bold text-lg hover:bg-amber-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
        >
          <span className="relative z-10 flex items-center">
            Get Updates
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </PageHeader>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-10">

        {/* Modern Glass Filters Panel */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mb-16 ring-1 ring-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10 opacity-50"></div>

          {/* Top Row: Big Search & Toggle */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Find scholarships, news, articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search updates"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all font-medium text-lg leading-6 outline-none"
                />
              </div>
            </div>

            {/* Desktop Featured Toggle */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 border-2 ${showFeaturedOnly
                  ? 'border-amber-500 bg-amber-50 text-amber-900'
                  : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200/80'
                  }`}
              >
                <Star className={`w-5 h-5 ${showFeaturedOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">Featured Only</span>
              </button>
            </div>
          </div>

          {/* Categories Chips */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${selectedCategory === category
                    ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Granular Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="block w-full py-2.5 pl-3 pr-10 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium cursor-pointer hover:bg-slate-50 transition-colors outline-none"
              >
                <option value="All">All Time</option>
                <option value="Last Week">Last Week</option>
                <option value="Last Month">Last Month</option>
                <option value="Last Year">Last Year</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full py-2.5 pl-3 pr-10 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium cursor-pointer hover:bg-slate-50 transition-colors outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            {/* Mobile Featured Toggle */}
            <div className="sm:hidden space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
              <button
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${showFeaturedOnly ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500'
                  }`}
              >
                {showFeaturedOnly ? 'Showing Featured' : 'Show Featured'}
              </button>
            </div>

            {/* Clear Filters Button */}
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
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Latest Updates
              {loading && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
            </h2>
            <p className="text-slate-500 mt-1">Discover opportunities and news tailored for you.</p>
          </div>
          <div className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            Found <span className="text-amber-600 font-bold">{filteredUpdates.length}</span> results
          </div>
        </div>


        {/* Updates Grid */}
        {filteredUpdates.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-20 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No updates found</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">We couldn&apos;t find any updates matching your current filters. Try adjusting them or clear everything.</p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-8 py-3 bg-amber-500 text-slate-900 rounded-xl hover:bg-amber-400 transition-all font-bold shadow-lg shadow-amber-500/10"
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
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
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
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl">
                          📰
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    {update.isFeatured && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-sm border border-slate-100 transform group-hover:scale-105 transition-transform">
                          <Star className="w-3.5 h-3.5 mr-1.5 fill-amber-500 text-amber-500" />
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Category Badge overlay */}
                    {primaryCategory && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border navbar-glass ${getCategoryColor(primaryCategory)} backdrop-blur-md`}>
                          {primaryCategory}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    {/* Date */}
                    <div className="flex items-center text-slate-500 text-xs font-bold mb-4 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                      {formatDate(update.publishedAt || update.createdAt)}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/updates/${update.slug}`} className="focus:outline-none">
                        {update.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    {update.excerpt && (
                      <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                        {update.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
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
              aria-label="Previous page"
              className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page
                    ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

      {/* Modern Modal */}
      {showModal && selectedUpdate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2.5 rounded-full text-slate-500 hover:text-rose-500 transition-all z-10 backdrop-blur-sm shadow-sm ring-1 ring-black/5"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Hero Image in Modal */}
              <div className="relative h-72 w-full bg-slate-100">
                {selectedUpdate.featuredImage ? (
                  <Image
                    src={selectedUpdate.featuredImage}
                    alt={selectedUpdate.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <div className="text-6xl">📰</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedPrimaryCategory && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(selectedPrimaryCategory)} bg-white/90 backdrop-blur-md !text-slate-900 !border-white`}>
                        {selectedPrimaryCategory}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-md">
                    {selectedUpdate.title}
                  </h2>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-6 text-slate-500 text-sm mb-8 pb-6 border-b border-slate-100">
                  <div className="flex items-center font-medium">
                    <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                    {formatDate(selectedUpdate.publishedAt || selectedUpdate.createdAt)}
                  </div>
                </div>

                {selectedUpdate.excerpt && (
                  <div className="text-slate-600 leading-relaxed text-lg mb-8">
                    {selectedUpdate.excerpt}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href={`/updates/${selectedUpdate.slug}`}
                    className="px-8 py-3 bg-amber-500 text-slate-900 rounded-xl hover:bg-amber-400 transition-all font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5"
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
