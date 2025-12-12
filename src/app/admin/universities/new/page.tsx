
'use client';

import UniversityForm from '../form';

export default function NewUniversityPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New University</h1>
            <UniversityForm isNew={true} />
        </div>
    );
}
