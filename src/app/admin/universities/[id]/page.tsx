
'use client';

import { useState, useEffect } from 'react';
import UniversityForm from '../form';
import { Loader2 } from 'lucide-react';

import { useParams } from 'next/navigation';

export default function EditUniversityPage() {
    const params = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.id) {
            fetch(`/api/admin/universities/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setData(data);
                    setLoading(false);
                });
        }
    }, [params?.id]);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit University</h1>
            <UniversityForm initialData={data || undefined} />
        </div>
    );
}
