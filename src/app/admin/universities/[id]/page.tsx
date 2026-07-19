
'use client';

import { useState, useEffect } from 'react';
import UniversityForm from '../form';
import { Loader2 } from 'lucide-react';

import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function EditUniversityPage() {
    const params = useParams();
    const { authenticatedFetch } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.id) {
            authenticatedFetch(`/api/admin/universities/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setData(data);
                    setLoading(false);
                });
        }
    }, [params?.id, authenticatedFetch]);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="mx-auto max-w-7xl">
            <UniversityForm initialData={data || undefined} />
        </div>
    );
}
