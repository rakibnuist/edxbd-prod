
'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    School,
    MapPin,
    Filter,
    ArrowRight,
    TrendingUp,
    GraduationCap,
    Loader2
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IUniversity } from '@/types/university';
import Link from 'next/link';

// Constant Data for Filters
const COUNTRIES = ['China', 'South Korea', 'UK', 'Hungary', 'Croatia', 'Finland', 'Cyprus', 'Malaysia', 'Georgia'];
const INTAKES = ['March', 'September'];
const DEGREES = ['Diploma', 'Bachelor', 'Masters', 'PhD', 'Language', 'Foundation'];
const TAUGHT_LANGUAGES = ['English', 'Chinese'];

const UniversitiesClient = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [universities, setUniversities] = useState<IUniversity[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedIntake, setSelectedIntake] = useState<string>('');
    const [selectedDegree, setSelectedDegree] = useState<string>('');
    const [selectedTaught, setSelectedTaught] = useState<string>('');
    const [selectedMajor, setSelectedMajor] = useState<string>('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                setLoading(true);
                // Create query parameters
                const params = new URLSearchParams();

                // When searching, fetch ALL universities for client-side filtering
                // When not searching, use normal pagination
                if (searchQuery.trim()) {
                    params.append('limit', '1000'); // Fetch all for search
                    params.append('page', '1');
                } else {
                    params.append('page', page.toString());
                    params.append('limit', '10');
                }

                // Only send country/degree to backend for base filtering
                // Search will be done client-side for all fields
                if (selectedCountry) params.append('country', selectedCountry);
                if (selectedDegree) params.append('degree', selectedDegree);

                const res = await fetch(`/api/admin/universities?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setUniversities(data.universities);

                    // Only show pagination when NOT searching
                    if (!searchQuery.trim()) {
                        setTotalPages(data.pagination.totalPages);
                    } else {
                        setTotalPages(1); // Hide pagination during search
                    }
                } else {
                    setError(`Failed to fetch: ${res.status} ${res.statusText}`);
                }
            } catch (error) {
                console.error("Failed to fetch universities", error);
                setError(error instanceof Error ? error.message : String(error));
            } finally {
                setLoading(false);
            }
        };
        fetchUniversities();
    }, [page, selectedCountry, selectedDegree, searchQuery]); // Added searchQuery back

    // Memoize ONLY for fields NOT filtered by backend if mixed (Intake, Taught, Major)
    // NOTE: This logic is tricky if backend only returns ONE page. 
    // We will apply client-side filtering to the RECEIVED page which is imperfect but safe.
    // Or we reset page to 1 when filters change (Added to onChange handlers below).

    // Derived Options
    const majors = useMemo(() => {
        const allMajors = universities.flatMap(u => u.details?.majors || []);
        return Array.from(new Set(allMajors)).sort();
    }, [universities]);

    const cities = useMemo(() => {
        // Filter cities based on selected country if applicable
        const unis = selectedCountry
            ? universities.filter(u => u.country === selectedCountry)
            : universities;

        return Array.from(new Set(unis.map(u => u.city))).sort();
    }, [selectedCountry, universities]);

    // Filter Logic
    const filteredUniversities = useMemo(() => {
        return universities.filter(uni => {
            // 1. Enhanced Multi-Field Search (University name, Major, Degree, Location)
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = searchQuery === '' || (
                uni.name.toLowerCase().includes(searchLower) ||
                uni.location.toLowerCase().includes(searchLower) ||
                uni.degree.some(d => d.toLowerCase().includes(searchLower)) ||
                uni.details?.majors?.some(m => m.toLowerCase().includes(searchLower)) || false
            );

            // 2. Exact Match Filters
            const matchesCountry = selectedCountry ? uni.country === selectedCountry : true;
            const matchesCity = selectedCity ? uni.city === selectedCity : true;

            // 3. Array Inclusion Filters
            const matchesIntake = selectedIntake ? uni.intake.includes(selectedIntake) : true;
            const matchesDegree = selectedDegree ? uni.degree.includes(selectedDegree) : true;
            const matchesTaught = selectedTaught ? uni.taught.includes(selectedTaught) : true;
            const matchesMajor = selectedMajor ? uni.details?.majors?.includes(selectedMajor) : true;

            return matchesSearch && matchesCountry && matchesCity && matchesIntake && matchesDegree && matchesTaught && matchesMajor;
        });
    }, [
        universities,
        searchQuery,
        selectedCountry,
        selectedCity,
        selectedIntake,
        selectedDegree,
        selectedTaught,
        selectedMajor
    ]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCountry('');
        setSelectedCity('');
        setSelectedIntake('');
        setSelectedDegree('');
        setSelectedTaught('');
        setSelectedMajor('');
    };

    const hasActiveFilters = searchQuery || selectedCountry || selectedCity || selectedIntake || selectedDegree || selectedTaught || selectedMajor;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <PageHeader
                title="Partner"
                highlight="Universities"
                description="Search and filter through our global network of partner universities"
                icon={School}
                badgeText="University Directory"
            />

            <section className="py-12 px-6">
                <div className="container mx-auto">

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar Filters - Desktop */}
                        <div className={`lg:w-72 flex-shrink-0 space-y-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg flex items-center">
                                        <Filter className="w-5 h-5 mr-2" />
                                        Filters
                                    </h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs text-blue-600 font-bold hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* Search */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Search</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Name, Major, Degree, Location..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                value={searchQuery}
                                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                            />
                                        </div>
                                    </div>

                                    {/* Filters Group */}
                                    <div className="space-y-4">

                                        {/* Country */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Country</label>
                                            <select
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                value={selectedCountry}
                                                onChange={(e) => {
                                                    setSelectedCountry(e.target.value);
                                                    setSelectedCity(''); // Reset city when country changes
                                                    setPage(1);
                                                }}
                                            >
                                                <option value="">All Countries</option>
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        {/* City (Location) */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Location (City)</label>
                                            <select
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                value={selectedCity}
                                                onChange={(e) => setSelectedCity(e.target.value)}
                                                disabled={cities.length === 0}
                                            >
                                                <option value="">All Cities</option>
                                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        {/* Intake */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Intake</label>
                                            <select
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                value={selectedIntake}
                                                onChange={(e) => setSelectedIntake(e.target.value)}
                                            >
                                                <option value="">Any Intake</option>
                                                {INTAKES.map(i => <option key={i} value={i}>{i}</option>)}
                                            </select>
                                        </div>

                                        {/* Degree */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Degree</label>
                                            <select
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                value={selectedDegree}
                                                onChange={(e) => { setSelectedDegree(e.target.value); setPage(1); }}
                                            >
                                                <option value="">Any Degree</option>
                                                {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>

                                        {/* Taught Choice */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Taught In</label>
                                            <select
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                value={selectedTaught}
                                                onChange={(e) => setSelectedTaught(e.target.value)}
                                            >
                                                <option value="">Any Language</option>
                                                {TAUGHT_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        </div>

                                        {/* Major */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Major</label>
                                            <select
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                value={selectedMajor}
                                                onChange={(e) => setSelectedMajor(e.target.value)}
                                            >
                                                <option value="">All Majors</option>
                                                {majors.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Search (Always Visible) */}
                        <div className="lg:hidden space-y-4">
                            {/* Search Bar */}
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search university, major, degree, location..."
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                    />
                                </div>
                            </div>

                            {/* Filter Toggle Button */}
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center justify-center w-full bg-white border border-slate-200 p-4 rounded-xl shadow-sm font-bold text-slate-700"
                            >
                                <Filter className="w-5 h-5 mr-2" />
                                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Results Count */}
                            <div className="mb-6 flex justify-between items-center">
                                <p className="text-slate-500">
                                    Showing <span className="font-bold text-slate-900">{filteredUniversities.length}</span> universities
                                </p>
                            </div>

                            {/* Grid */}
                            {/* Grid */}
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                                </div>
                            ) : error ? (
                                <div className="text-center py-20 text-red-500 font-bold">
                                    Error loading universities: {error}
                                </div>
                            ) : (
                                <>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {filteredUniversities.map((uni, index) => (
                                            <motion.div
                                                key={uni._id || uni.slug}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-300 transition-all duration-300 group flex flex-col relative"
                                            >
                                                {/* Background Logo Watermark */}
                                                {uni.logo && (
                                                    <div className="absolute right-0 top-0 h-full w-[60%] z-0 flex items-center justify-end opacity-[0.1] pointer-events-none select-none overflow-hidden pr-4">
                                                        <img
                                                            src={uni.logo}
                                                            alt=""
                                                            className="h-[80%] w-full object-contain object-right"
                                                        />
                                                    </div>
                                                )}

                                                <div className="p-6 flex-1 relative z-10 flex flex-col h-full">
                                                    {/* Header: Badges */}
                                                    <div className="flex flex-wrap gap-2 justify-end mb-4">
                                                        {uni.country && (
                                                            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                                                                {uni.country}
                                                            </span>
                                                        )}
                                                        {uni.degree && uni.degree[0] && (
                                                            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100 shadow-sm">
                                                                {uni.degree[0]}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Main Content */}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h3 className="text-xl font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                                                                {uni.name}
                                                            </h3>

                                                            <div className="flex items-center text-slate-600 text-sm font-medium mt-2">
                                                                <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-slate-400" />
                                                                {uni.location}
                                                            </div>
                                                        </div>

                                                        {/* Rankings */}
                                                        <div className="flex flex-wrap gap-2">
                                                            {uni.rankings?.world && (
                                                                <div className="flex items-center text-xs font-semibold bg-slate-50 border border-slate-100 px-2 py-1.5 rounded text-slate-600">
                                                                    <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                                                                    World #{uni.rankings.world}
                                                                </div>
                                                            )}
                                                            {uni.rankings?.national && (
                                                                <div className="flex items-center text-xs font-semibold bg-slate-50 border border-slate-100 px-2 py-1.5 rounded text-slate-600">
                                                                    <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                                                                    National #{uni.rankings.national}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Majors */}
                                                        <div className="pt-4 mt-auto">
                                                            <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider mb-2">Available Majors</p>
                                                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                                                {uni.details?.majors?.join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Footer: Tuition & Action */}
                                                <div className="px-6 py-4 bg-white/50 backdrop-blur-sm border-t border-slate-100 flex items-center justify-between relative z-10">
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Tuition</p>
                                                        <p className="text-sm font-bold text-slate-900">{uni.details?.tuition}</p>
                                                    </div>
                                                    <Link
                                                        href={`/partnership/universities/${uni.slug}`}
                                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm"
                                                    >
                                                        <ArrowRight className="w-5 h-5" />
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center space-x-2 mt-8">
                                            <button
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                                            >
                                                Previous
                                            </button>
                                            <div className="text-sm font-medium text-slate-600">
                                                Page {page} of {totalPages}
                                            </div>
                                            <button
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}

                                    {filteredUniversities.length === 0 && (
                                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">No universities found</h3>
                                            <p className="text-slate-500 max-w-md mx-auto mb-6">
                                                Try adjusting your search criteria or clearing filters to see more results.
                                            </p>
                                            <button
                                                onClick={clearFilters}
                                                className="text-blue-600 font-bold hover:underline"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UniversitiesClient;
