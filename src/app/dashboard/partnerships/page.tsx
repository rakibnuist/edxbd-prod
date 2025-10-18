'use client';

import { useEffect, useState } from 'react';
import { Partnership } from '@/lib/types';

export default function UserPartnershipsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    partnershipType: '',
    status: 'pending',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingPartnershipId, setEditingPartnershipId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>('');

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchPartnerships = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/partnerships');
      if (response.ok) {
        const data = await response.json();
        // API returns { partnerships: [...], pagination: {...}, stats: {...} }
        setPartnerships(data.partnerships || []);
      } else {
        setPartnerships([]);
        showMessage('error', 'Failed to fetch partnerships');
      }
    } catch (error) {
      setPartnerships([]);
      showMessage('error', 'Network error while fetching partnerships');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingPartnership ? `/api/admin/partnerships/${editingPartnership._id}` : '/api/admin/partnerships';
      const method = editingPartnership ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showMessage('success', editingPartnership ? 'Partnership updated successfully!' : 'Partnership created successfully!');
        fetchPartnerships();
        setShowForm(false);
        setEditingPartnership(null);
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          country: '',
          partnershipType: '',
          status: 'pending',
          priority: 'medium'
        });
      } else {
        const errorData = await response.json();
        showMessage('error', `Failed to ${editingPartnership ? 'update' : 'create'} partnership: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      showMessage('error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (partnership: Partnership) => {
    setEditingPartnership(partnership);
    setFormData({
      companyName: partnership.companyName || '',
      contactPerson: partnership.contactPerson || '',
      email: partnership.email || '',
      phone: partnership.phone || '',
      country: partnership.country || '',
      partnershipType: partnership.partnershipType || '',
      status: partnership.status || '',
      priority: partnership.priority || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this partnership?')) {
      try {
        const response = await fetch(`/api/admin/partnerships/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Update local state immediately
          setPartnerships(prevPartnerships => 
            prevPartnerships.filter(partnership => partnership._id !== id)
          );
          showMessage('success', 'Partnership deleted successfully!');
        } else {
          showMessage('error', 'Failed to delete partnership');
        }
      } catch (error) {
        showMessage('error', 'Network error while deleting partnership');
      }
    }
  };

  const updatePartnershipStatus = async (partnershipId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/partnerships/${partnershipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state immediately for better UX
        setPartnerships(prevPartnerships => 
          prevPartnerships.map(partnership => 
            partnership._id === partnershipId 
              ? { ...partnership, status: newStatus as any, updatedAt: new Date().toISOString() }
              : partnership
          )
        );
        
        showMessage('success', 'Partnership status updated successfully!');
        setEditingPartnershipId(null);
        setEditingStatus('');
      } else {
        showMessage('error', 'Failed to update partnership status');
      }
    } catch (error) {
      showMessage('error', 'Network error while updating partnership status');
    }
  };

  const startEditingStatus = (partnershipId: string, currentStatus: string) => {
    setEditingPartnershipId(partnershipId);
    setEditingStatus(currentStatus);
  };

  const cancelEditingStatus = () => {
    setEditingPartnershipId(null);
    setEditingStatus('');
  };

  const saveStatusEdit = async (partnershipId: string) => {
    if (editingStatus) {
      await updatePartnershipStatus(partnershipId, editingStatus);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'on_hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading partnerships...</div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-6 xl:px-8">
      {/* Message Display */}
      {message && (
        <div className={`mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm lg:text-base">{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-4 text-lg font-bold touch-manipulation"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-0">
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">Partnerships Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingPartnership(null);
            setFormData({
              companyName: '',
              contactPerson: '',
              email: '',
              phone: '',
              country: '',
              partnershipType: '',
              status: 'pending',
              priority: 'medium'
            });
          }}
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium touch-manipulation"
        >
          Add New Partnership
        </button>
      </div>

      {/* Partnerships List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partnerships.map((partnership) => (
                <tr key={partnership._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{partnership.companyName}</div>
                      <div className="text-sm text-gray-500">{partnership.country}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{partnership.contactPerson}</div>
                      <div className="text-sm text-gray-500">{partnership.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {partnership.partnershipType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingPartnershipId === partnership._id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="on_hold">On Hold</option>
                        </select>
                        <button
                          onClick={() => saveStatusEdit(partnership._id)}
                          className="text-green-600 hover:text-green-800 text-xs"
                          title="Save"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEditingStatus}
                          className="text-red-600 hover:text-red-800 text-xs"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingStatus(partnership._id, partnership.status)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(partnership.status)}`}
                        title="Click to edit status"
                      >
                        {partnership.status.replace('_', ' ')}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(partnership.priority)}`}>
                      {partnership.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(partnership)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(partnership._id)}
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingPartnership ? 'Edit Partnership' : 'Add New Partnership'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium text-gray-700">Partnership Type</label>
                    <select
                      value={formData.partnershipType}
                      onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="university">University Partnership</option>
                      <option value="agent">Agent Partnership</option>
                      <option value="corporate">Corporate Partnership</option>
                      <option value="government">Government Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                </div>

                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingPartnership ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      `${editingPartnership ? 'Update' : 'Add'} Partnership`
                    )}
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
