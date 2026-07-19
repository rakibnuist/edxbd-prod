'use client';

import { useEffect, useState } from 'react';
import { trackDashboardView, trackTestimonialManagement } from '@/lib/analytics';
import { Testimonial } from '@/lib/types';

const emptyTestimonialForm = {
  name: '',
  displayName: '',
  location: '',
  university: '',
  program: '',
  quote: '',
  rating: 5,
  image: '',
  country: '',
  isActive: true,
  featured: false,
  academicProfile: '',
  decisionFactors: '',
  applicationTimeline: '',
  serviceProvided: '',
  studentPaid: '',
  currentUpdate: '',
  consentVerified: false,
  consentEvidenceId: '',
  consentRecordedAt: '',
  consentExpiresAt: '',
  consentRevokedAt: '',
  consentImageApproved: false,
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({ ...emptyTestimonialForm });

  useEffect(() => {
    trackDashboardView('testimonials_management');
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      // Error fetching testimonials
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTestimonial ? `/api/admin/testimonials/${editingTestimonial._id}` : '/api/admin/testimonials';
      const method = editingTestimonial ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const action = editingTestimonial ? 'update' : 'create';
        trackTestimonialManagement(action, { 
          testimonial_id: editingTestimonial?._id,
          name: formData.name,
          university: formData.university,
          country: formData.country,
          success: true
        });
        fetchTestimonials();
        setShowForm(false);
        setEditingTestimonial(null);
        setFormData({ ...emptyTestimonialForm });
      } else {
        const action = editingTestimonial ? 'update' : 'create';
        trackTestimonialManagement(action, { 
          testimonial_id: editingTestimonial?._id,
          name: formData.name,
          success: false,
          error: 'api_error'
        });
      }
    } catch (error) {
      // Error saving testimonial
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      displayName: testimonial.displayName || '',
      location: testimonial.location,
      university: testimonial.university,
      program: testimonial.program,
      quote: testimonial.quote,
      rating: testimonial.rating,
      image: testimonial.image || '',
      country: testimonial.country,
      isActive: testimonial.isActive,
      featured: testimonial.featured,
      academicProfile: testimonial.academicProfile || '',
      decisionFactors: testimonial.decisionFactors || '',
      applicationTimeline: testimonial.applicationTimeline || '',
      serviceProvided: testimonial.serviceProvided || '',
      studentPaid: testimonial.studentPaid || '',
      currentUpdate: testimonial.currentUpdate || '',
      consentVerified: testimonial.consentVerified || false,
      consentEvidenceId: testimonial.consentEvidenceId || '',
      consentRecordedAt: testimonial.consentRecordedAt?.slice(0, 10) || '',
      consentExpiresAt: testimonial.consentExpiresAt?.slice(0, 10) || '',
      consentRevokedAt: testimonial.consentRevokedAt?.slice(0, 10) || '',
      consentImageApproved: testimonial.consentImageApproved || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const response = await fetch(`/api/admin/testimonials/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchTestimonials();
        }
      } catch (error) {
        // Error deleting testimonial
      }
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      // Error updating testimonial status
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Testimonial Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingTestimonial(null);
            setFormData({ ...emptyTestimonialForm });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Testimonial
        </button>
      </div>

      {/* Testimonials List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testimonials.map((testimonial) => (
                <tr key={testimonial._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{testimonial.university}</div>
                      <div className="text-sm text-gray-500">{testimonial.program}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-500' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {testimonial.featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${testimonial.consentVerified && testimonial.consentEvidenceId ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                        {testimonial.consentVerified && testimonial.consentEvidenceId ? 'Consent recorded' : 'Not publishable'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(testimonial._id, testimonial.isActive)}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      {testimonial.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto max-h-[calc(100vh-2rem)] w-11/12 overflow-y-auto border bg-white p-5 shadow-lg md:w-3/4 lg:w-2/3">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Approved display name</label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="Use only the name approved for public display"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">University</label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Program</label>
                    <input
                      type="text"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quote</label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <section className="border border-blue-200 bg-blue-50 p-4">
                  <h4 className="font-bold text-blue-950">Evidence based story details</h4>
                  <p className="mt-1 text-xs text-blue-800">Do not enter passport numbers, dates of birth, visa identifiers or unredacted financial data.</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {([
                      ['academicProfile', 'Academic profile, budget and constraints'],
                      ['decisionFactors', 'Options considered and final decision'],
                      ['applicationTimeline', 'Application and visa timeline'],
                      ['serviceProvided', 'Exact EduExpress service provided'],
                      ['studentPaid', 'What the student paid'],
                      ['currentUpdate', 'Current update after arrival'],
                    ] as const).map(([field, label]) => (
                      <label key={field} className="block text-sm font-medium text-gray-700">{label}
                        <textarea value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} rows={3} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
                      </label>
                    ))}
                  </div>
                </section>

                <section className="border border-amber-300 bg-amber-50 p-4">
                  <h4 className="font-bold text-amber-950">Public consent record</h4>
                  <p className="mt-1 text-xs text-amber-800">A story remains private until consent is verified and an internal evidence ID is recorded.</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700">Internal consent evidence ID
                      <input value={formData.consentEvidenceId} onChange={(e) => setFormData({ ...formData, consentEvidenceId: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Example: CN-STORY-2027-001" />
                    </label>
                    <label className="text-sm font-medium text-gray-700">Consent recorded date
                      <input type="date" value={formData.consentRecordedAt} onChange={(e) => setFormData({ ...formData, consentRecordedAt: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="text-sm font-medium text-gray-700">Consent expiry date
                      <input type="date" value={formData.consentExpiresAt} onChange={(e) => setFormData({ ...formData, consentExpiresAt: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="text-sm font-medium text-gray-700">Consent revoked date
                      <input type="date" value={formData.consentRevokedAt} onChange={(e) => setFormData({ ...formData, consentRevokedAt: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-5">
                    <label className="flex items-center text-sm text-gray-700"><input type="checkbox" checked={formData.consentVerified} onChange={(e) => setFormData({ ...formData, consentVerified: e.target.checked })} className="mr-2" />Written public consent verified</label>
                    <label className="flex items-center text-sm text-gray-700"><input type="checkbox" checked={formData.consentImageApproved} onChange={(e) => setFormData({ ...formData, consentImageApproved: e.target.checked })} className="mr-2" />Photo approved for public display</label>
                  </div>
                </section>
                
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
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingTestimonial ? 'Update' : 'Add'} Testimonial
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
