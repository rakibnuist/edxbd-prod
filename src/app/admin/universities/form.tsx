
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, X, Plus, Trash } from 'lucide-react';

import { IUniversity } from '@/types/university';

interface UniversityFormProps {
    initialData?: IUniversity;
    isNew?: boolean;
}

export default function UniversityForm({ initialData, isNew = false }: UniversityFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<IUniversity>>({
        name: '',
        slug: '',
        location: '',
        country: '',
        city: '',
        intake: [],
        degree: [],
        taught: [],
        rankings: { country: 0, world: 0 },
        details: { majors: [], tuition: '', tuitionDetails: [] },
        fees: [],
        scholarships: [],
        documents: [],
        deadlines: { application: '', startDate: '' },
        notes: [],
        badges: [],
        badges: [],
        logo: '',
        isActive: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev: any) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleArrayChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value.split(',').map(s => s.trim()) });
    };

    // Helper to manage specific fees within the generic fees array
    const getFeeValue = (itemName: string) => {
        const fee = formData.fees?.find((f: any) => f.item === itemName);
        return fee ? fee.cost : '';
    };

    const setFeeValue = (itemName: string, cost: string) => {
        setFormData((prev: any) => {
            const existingFees = prev.fees || [];
            const feeIndex = existingFees.findIndex((f: any) => f.item === itemName);

            let newFees;
            if (feeIndex >= 0) {
                newFees = [...existingFees];
                newFees[feeIndex] = { ...newFees[feeIndex], cost };
            } else {
                newFees = [...existingFees, { item: itemName, cost }];
            }
            return { ...prev, fees: newFees };
        });
    };

    // Generic list manager (add/remove strings)
    const addItemToList = (field: string, item: string) => {
        if (!item) return;
        setFormData((prev: any) => ({
            ...prev,
            [field]: [...(prev[field] || []), item]
        }));
    };

    const removeItemFromList = (field: string, index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: prev[field].filter((_: any, i: number) => i !== index)
        }));
    };

    // Scholarship manager
    const addScholarship = () => {
        setFormData((prev: any) => ({
            ...prev,
            scholarships: [...(prev.scholarships || []), { title: '', type: '', amount: '', details: [] }]
        }));
    };

    const updateScholarship = (index: number, field: string, value: any) => {
        setFormData((prev: any) => {
            const newScholarships = [...prev.scholarships];
            newScholarships[index] = { ...newScholarships[index], [field]: value };
            return { ...prev, scholarships: newScholarships };
        });
    };

    const removeScholarship = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            scholarships: prev.scholarships.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isNew ? '/api/admin/universities' : `/api/admin/universities/${formData._id || formData.slug}`; // Fallback to slug if _id missing in initialData
            const method = isNew ? 'POST' : 'PUT';

            const token = localStorage.getItem('admin_token');
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/admin/universities');
                router.refresh();
            } else {
                alert('Failed to save');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-12">

            {/* Basic Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Slug (ID)</label>
                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 border rounded-lg" required disabled={!isNew} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Location Display String</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="e.g. Chengdu, China" />
                    </div>
                </div>
            </div>
        </div>

            {/* Logo URL */ }
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">Branding</h2>
        <div className="grid grid-cols-1">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">University Logo URL</label>
                <input type="text" name="logo" value={formData.logo || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="https://example.com/logo.png" />
                {formData.logo && (
                    <div className="mt-2 p-2 border rounded-lg bg-slate-50 w-fit">
                        <img src={formData.logo} alt="Preview" className="h-16 object-contain" />
                    </div>
                )}
            </div>
        </div>
    </div>

    {/* Rankings & Deadlines */ }
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">Rankings & Deadlines</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">World Rank</label>
                <input type="number" name="rankings.world" value={formData.rankings?.world || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">National Rank</label>
                <input type="number" name="rankings.national" value={formData.rankings?.national || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">App Deadline</label>
                <input type="text" name="deadlines.application" value={formData.deadlines?.application || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                <input type="text" name="deadlines.startDate" value={formData.deadlines?.startDate || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
        </div>
    </div>

    {/* Tuition & Fees */ }
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">Tuition & Fees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Standard Fees Inputs */}
            {['Annual Tuition', 'Accommodation', 'Medical Insurance', 'Residence Permit', 'Health Check up', 'Registration Fees'].map((feeItem) => (
                <div key={feeItem}>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{feeItem}</label>
                    <input
                        type="text"
                        value={getFeeValue(feeItem)}
                        onChange={(e) => setFeeValue(feeItem, e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g. 500 CNY/Year"
                    />
                </div>
            ))}
        </div>
        {/* Fallback for other custom fees if needed in future */}
    </div>

    {/* Required Documents */ }
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">Required Documents</h2>
        <div className="space-y-3">
            {formData.documents?.map((doc: string, index: number) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        value={doc}
                        onChange={(e) => {
                            const newDocs = [...formData.documents];
                            newDocs[index] = e.target.value;
                            setFormData({ ...formData, documents: newDocs });
                        }}
                        className="w-full p-2 border rounded-lg"
                    />
                    <button type="button" onClick={() => removeItemFromList('documents', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash size={18} />
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => addItemToList('documents', 'New Document')} className="text-blue-600 font-bold text-sm flex items-center gap-1">
                <Plus size={16} /> Add Document
            </button>
        </div>
    </div>

    {/* Scholarships */ }
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">Scholarships</h2>
        <div className="space-y-6">
            {formData.scholarships?.map((scholarship: any, index: number) => (
                <div key={index} className="p-4 border rounded-xl bg-slate-50 relative">
                    <button type="button" onClick={() => removeScholarship(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Scholarship Title</label>
                            <input type="text" value={scholarship.title} onChange={(e) => updateScholarship(index, 'title', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Type (e.g. Full, Partial)</label>
                            <input type="text" value={scholarship.type} onChange={(e) => updateScholarship(index, 'type', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Amount</label>
                            <input type="text" value={scholarship.amount} onChange={(e) => updateScholarship(index, 'amount', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Details (Comma Separated)</label>
                        <textarea
                            value={scholarship.details?.join(', ')}
                            onChange={(e) => updateScholarship(index, 'details', e.target.value.split(',').map((s: string) => s.trim()))}
                            className="w-full p-2 border rounded-lg h-20"
                        />
                    </div>
                </div>
            ))}
            <button type="button" onClick={addScholarship} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 font-bold text-slate-700">
                <Plus size={18} /> Add Scholarship
            </button>
        </div>
    </div>

    {/* Important Notes */ }
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">Important Notes</h2>
        <div className="space-y-3">
            {formData.notes?.map((note: string, index: number) => (
                <div key={index} className="flex gap-2">
                    <textarea
                        value={note}
                        onChange={(e) => {
                            const newNotes = [...formData.notes];
                            newNotes[index] = e.target.value;
                            setFormData({ ...formData, notes: newNotes });
                        }}
                        className="w-full p-2 border rounded-lg"
                        rows={2}
                    />
                    <button type="button" onClick={() => removeItemFromList('notes', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start">
                        <Trash size={18} />
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => addItemToList('notes', 'New Note')} className="text-blue-600 font-bold text-sm flex items-center gap-1">
                <Plus size={16} /> Add Note
            </button>
        </div>
    </div>

    {/* Other Lists */ }
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold mb-4">Tags & Other Lists (Comma Separated)</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Intakes</label>
                        <input type="text" value={formData.intake?.join(', ')} onChange={(e) => handleArrayChange('intake', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Degrees</label>
                        <input type="text" value={formData.degree?.join(', ')} onChange={(e) => handleArrayChange('degree', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Languages Taught</label>
                        <input type="text" value={formData.taught?.join(', ')} onChange={(e) => handleArrayChange('taught', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Major List</label>
                        <textarea value={formData.details?.majors?.join(', ')} onChange={(e) => {
                            const majors = e.target.value.split(',').map(s => s.trim());
                            setFormData((prev: any) => ({ ...prev, details: { ...prev.details, majors } }));
                        }} className="w-full p-2 border rounded-lg h-24" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50">
                <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2">
                    {loading && <Loader2 className="animate-spin" />}
                    Save University
                </button>
            </div>
        </form >
    );
}
