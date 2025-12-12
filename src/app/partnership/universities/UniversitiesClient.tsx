
'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    School,
    MapPin,
    Filter,
    ArrowRight,
    TrendingUp,
    X,
    ChevronDown,
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

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const fetchUniversities = async () => {
                    try {
                        const res = await fetch('/api/admin/universities');
                        if (res.ok) {
                            const data = await res.json();
                            setUniversities(data);
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
            }, []);

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
            // 1. Search Query (Name or Location string)
            const matchesSearch =
                uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                uni.location.toLowerCase().includes(searchQuery.toLowerCase());

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
                                                placeholder="Name..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                                onChange={(e) => setSelectedDegree(e.target.value)}
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

                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden">
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
                                <div className="grid md:grid-cols-2 gap-6">
                                    {filteredUniversities.map((uni, index) => (
                                        <motion.div
                                            key={uni._id || uni.slug}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-300 transition-all duration-300 group flex flex-col"
                                        >
                                            <div className="p-6 flex-1">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden">
                                                        {uni.logo ? (
                                                            <img src={uni.logo} alt={uni.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            uni.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 flex-wrap justify-end">
                                                        {uni.country && (
                                                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-bold">
                                                                {uni.country}
                                                            </span>
                                                        )}
                                                        {uni.degree && uni.degree[0] && (
                                                            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md font-bold">
                                                                {uni.degree[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                                    {uni.name}
                                                </h3>

                                                <div className="flex items-center text-slate-500 text-sm mb-4">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {uni.location}
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {uni.rankings?.world && (
                                                        <div className="flex items-center text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                                            <GraduationCap className="w-3 h-3 mr-1" />
                                                            World #{uni.rankings.world}
                                                        </div>
                                                    )}
                                                    {uni.rankings?.national && (
                                                        <div className="flex items-center text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                                            <TrendingUp className="w-3 h-3 mr-1" />
                                                            National #{uni.rankings.national}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="border-t border-slate-100 pt-4">
                                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Available Majors</p>
                                                    <p className="text-sm text-slate-600 line-clamp-2">
                                                        {uni.details?.majors?.join(', ')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-400">Tuition</p>
                                                    <p className="text-sm font-bold text-slate-900">{uni.details?.tuition}</p>
                                                </div>
                                                <Link
                                                    href={`/partnership/universities/${uni.slug}`}
                                                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
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
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UniversitiesClient;
