
'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, GraduationCap, MapPin, Loader2, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { IUniversity } from '@/types/university';

export default function UniversitiesPage() {
    const { authenticatedFetch } = useAuth();
    const [universities, setUniversities] = useState<IUniversity[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('all');
    const [degree, setDegree] = useState('all');
    const [filterOptions, setFilterOptions] = useState<{ countries: string[]; degrees: string[] }>({ countries: [], degrees: [] });

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch data
    const fetchUniversities = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ search, country, degree, page: String(page), limit: '10' });
            const res = await authenticatedFetch(`/api/admin/universities?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setUniversities(data.universities);
                setTotalPages(data.pagination.totalPages);
                setTotalItems(data.pagination.total);
                setFilterOptions(data.filters || { countries: [], degrees: [] });
            }
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    }, [authenticatedFetch, country, degree, page, search]);

    useEffect(() => {
        fetchUniversities();
    }, [fetchUniversities]);

    // Old handleDelete removed as it is replaced by modal logic above

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ... fetch logic ...

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setIsDeleting(true);
            const res = await authenticatedFetch(`/api/admin/universities/${deleteId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Determine if we are on the last item of the page and not on the first page
                if (universities.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    fetchUniversities();
                }
                setDeleteId(null); // Close modal
            } else {
                const data = await res.json();
                alert(`Failed to delete: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('An error occurred while deleting');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleMigrate = async () => {
        setLoading(true);
        await authenticatedFetch('/api/admin/universities/migrate', { method: 'POST' });
        fetchUniversities();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Universities</h1>
                    <p className="text-slate-500 text-sm">Manage university profiles, programs, fees and scholarships</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleMigrate}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm"
                    >
                        Sync Data
                    </button>
                    <Link
                        href="/admin/universities/new"
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add University
                    </Link>
                </div>
            </div>

            {/* Search and destination filters */}
            <div className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_220px_auto]">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search university, city or destination"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select value={country} onChange={event => { setCountry(event.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Filter universities by destination">
                    <option value="all">All destinations</option>
                    {filterOptions.countries.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
                <select value={degree} onChange={event => { setDegree(event.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Filter universities by study level">
                    <option value="all">All study levels</option>
                    {filterOptions.degrees.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
                <button type="button" onClick={() => { setSearch(''); setCountry('all'); setDegree('all'); setPage(1); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50"><RotateCcw size={16} />Reset</button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {universities.map((uni) => (
                        <div key={uni.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-white p-1.5 text-xl font-bold text-blue-600">
                                    {uni.logo ? <Image src={uni.logo} alt={`${uni.name} logo`} fill sizes="56px" unoptimized className="object-contain p-1.5" /> : uni.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{uni.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {[uni.city || uni.location, uni.country].filter(Boolean).join(', ')}</span>
                                        <span className="flex items-center gap-1"><GraduationCap size={14} /> {uni.programs?.length || uni.details?.majors?.length || 0} programs across {new Set((uni.programs || []).map(program => program.level)).size || uni.degree.length} level{(new Set((uni.programs || []).map(program => program.level)).size || uni.degree.length) === 1 ? '' : 's'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/admin/universities/${uni.slug}`}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit size={20} />
                                </Link>
                                <button
                                    onClick={() => handleDeleteClick(uni.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {universities.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No universities found. Try syncing data or adding a new one.
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-sm text-slate-500">
                        Showing {universities.length} of {totalItems} universities (Page {page} of {totalPages})
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto text-red-600">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Delete University?</h3>
                        <p className="text-slate-500 text-center mb-6">
                            Are you sure you want to delete this university? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
