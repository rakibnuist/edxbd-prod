
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, GraduationCap, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UniversitiesPage() {
    const { user } = useAuth();
    const [universities, setUniversities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Fetch data
    const fetchUniversities = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/universities?search=${search}`, {
                headers: {
                    // 'Authorization': `Bearer ${token}` 
                    // relying on cookie/verifyTokenFromRequest logic which might read from cookie
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUniversities(data);
            }
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniversities();
    }, [search]); // Debounce usually better but simple for now

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this university?')) return;

        const res = await fetch(`/api/admin/universities/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchUniversities();
        }
    };

    const handleMigrate = async () => {
        setLoading(true);
        await fetch('/api/admin/universities/migrate', { method: 'POST' });
        fetchUniversities();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Universities</h1>
                    <p className="text-slate-500 text-sm">Manage university partners and programs</p>
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

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search universities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {universities.map((uni) => (
                        <div key={uni._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
                                    {uni.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{uni.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {uni.location}</span>
                                        <span className="flex items-center gap-1"><GraduationCap size={14} /> {uni.degree.join(', ')}</span>
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
                                    onClick={() => handleDelete(uni._id)}
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
        </div>
    );
}
