'use client';

import { useCallback, useEffect, useState } from 'react';
import { Country } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const slugifyCountry = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function CountriesPage() {
  const { authenticatedFetch } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  const fetchCountries = useCallback(async () => {
    try {
      setError(null);
      const response = await authenticatedFetch('/api/admin/countries');
      const data = await response.json().catch(() => null);
      if (response.ok && Array.isArray(data)) {
        setCountries(data);
      } else {
        setError((data && (data.error || data.message)) || `Failed to load destinations (${response.status})`);
      }
    } catch {
      setError('Network error while loading destinations.');
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchCountries(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchCountries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = editingCountry ? `/api/admin/countries/${editingCountry.id}` : '/api/admin/countries';
      const method = editingCountry ? 'PUT' : 'POST';

      const response = await authenticatedFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        await fetchCountries();
        setShowForm(false);
        setEditingCountry(null);
        setSlugTouched(false);
        setFormData({
          name: '',
          slug: '',
          description: '',
          isActive: true,
        });
      } else {
        setError(data.error || data.message || 'Could not save destination.');
      }
    } catch {
      setError('Network error while saving destination.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (country: Country) => {
    setError(null);
    setEditingCountry(country);
    setSlugTouched(true);
    setFormData({
      name: country.name || '',
      slug: country.slug || '',
      description: country.description || '',
      isActive: country.isActive !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this country?')) {
      setError(null);
      try {
        const response = await authenticatedFetch(`/api/admin/countries/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          await fetchCountries();
        } else {
          setError(data.error || data.message || 'Could not delete destination.');
        }
      } catch {
        setError('Network error while deleting destination.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading countries...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Study Corridors
          </p>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Study Destinations</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Configure active study abroad destinations and counselor visibility
          </p>
        </div>
        <button
          onClick={() => {
            setError(null);
            setShowForm(true);
            setEditingCountry(null);
            setSlugTouched(false);
            setFormData({
              name: '',
              slug: '',
              description: '',
              isActive: true,
            });
          }}
          className="rounded-xl bg-[#0f3a5c] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0c2e49]"
        >
          + Add Destination
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="font-bold text-rose-600 hover:text-rose-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <div key={country.id} className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{country.name}</h3>
                <p className="mt-0.5 font-mono text-xs text-slate-400">/{country.slug}</p>
                {country.description && <p className="mt-2 text-gray-600 text-sm">{country.description}</p>}
              </div>

              <div className="flex justify-center space-x-2 mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  country.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {country.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleEdit(country)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(country.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-3 sm:p-4">
          <div className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-xl border bg-white p-4 sm:p-5 shadow-lg">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCountry ? 'Edit Country' : 'Add New Country'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const nextName = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          name: nextName,
                          slug: !slugTouched ? slugifyCountry(nextName) : prev.slug,
                        }));
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setFormData({ ...formData, slug: e.target.value });
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. south-korea"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : `${editingCountry ? 'Update' : 'Add'} Country`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
