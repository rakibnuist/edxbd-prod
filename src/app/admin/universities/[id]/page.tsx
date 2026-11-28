
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UniversityForm from '../form';
import { Loader2 } from 'lucide-react';
import type { IUniversity } from '@/types/university';

import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function EditUniversityPage() {
    const params = useParams();
    const { authenticatedFetch } = useAuth();
    const [data, setData] = useState<IUniversity | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params?.id) return;
        let cancelled = false;
        authenticatedFetch(`/api/admin/universities/${encodeURIComponent(String(params.id))}`)
            .then(async (res) => {
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || json.message || `University not found (${res.status})`);
                return json as IUniversity;
            })
            .then((uni) => {
                if (!cancelled) {
                    setData(uni);
                    setError(null);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Failed to load university.');
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [params?.id, authenticatedFetch]);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    if (error || !data) {
        return (
            <div className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
                <p className="text-sm font-bold text-rose-800">{error || 'University record could not be loaded.'}</p>
                <Link
                    href="/admin/universities"
                    className="mt-4 inline-flex rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white hover:bg-[#124b7a]"
                >
                    ← Back to Universities
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl">
            <UniversityForm initialData={data} />
        </div>
    );
}
