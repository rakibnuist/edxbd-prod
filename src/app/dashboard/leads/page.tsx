'use client';

import { useEffect, useState } from 'react';
import { Lead } from '@/lib/types';
import { trackLeadStatusChange } from '@/lib/meta-conversion-api';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function UserLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter, countryFilter]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (sourceFilter !== 'all') {
        params.append('source', sourceFilter);
      }
      if (countryFilter !== 'all') {
        params.append('country', countryFilter);
      }

      const url = `/api/admin/leads${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLeads(data);

        // Extract unique countries for filter dropdown
        const countries = [...new Set(data.map((lead: Lead) => lead.country))].sort() as string[];
        setAvailableCountries(countries);
      } else {
        setLeads([]);
        showMessage('error', 'Failed to fetch leads');
      }
    } catch (error) {
      setLeads([]);
      showMessage('error', 'Network error while fetching leads');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Track status change with enhanced Meta Conversion API
        const lead = leads.find(l => l._id === leadId);
        if (lead) {
          try {
            await trackLeadStatusChange({
              name: lead.name,
              email: lead.email,
              phone: lead.phone,
              country: lead.country,
              program: lead.program,
              previousStatus: lead.status,
              newStatus: newStatus
            });
          } catch (conversionError) {
            console.error('Meta Conversion API error for status update:', conversionError);
          }
        }

        // Update local state immediately for better UX
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            lead._id === leadId
              ? { ...lead, status: newStatus as Lead['status'], updatedAt: new Date().toISOString() }
              : lead
          )
        );

        // Update selected lead if it's the one being edited
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: newStatus as Lead['status'], updatedAt: new Date().toISOString() } : null);
        }

        showMessage('success', 'Lead status updated successfully!');
      } else {
        showMessage('error', 'Failed to update lead status');
      }
    } catch (error) {
      showMessage('error', 'Network error while updating lead status');
    }
  };

  const handleCall = (phoneNumber: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const handleWhatsAppTracking = async (data: unknown) => {
    // Track WhatsApp interaction for user dashboard
    console.log('WhatsApp contact tracked:', data);

    // You can add additional tracking here if needed
    // For example, send to analytics service
  };

  const deleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        const response = await fetch(`/api/admin/leads/${leadId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          showMessage('success', 'Lead deleted successfully!');
          fetchLeads();
          setSelectedLead(null);
        } else {
          showMessage('error', 'Failed to delete lead');
        }
      } catch (_error) {
        showMessage('error', 'Network error while deleting lead');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'consultation_scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'consultation_completed': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-yellow-100 text-yellow-800';
      case 'application_started': return 'bg-orange-100 text-orange-800';
      case 'application_submitted': return 'bg-amber-100 text-amber-800';
      case 'admission_received': return 'bg-emerald-100 text-emerald-800';
      case 'visa_applied': return 'bg-teal-100 text-teal-800';
      case 'visa_approved': return 'bg-cyan-100 text-cyan-800';
      case 'enrolled': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'not_interested': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-5 lg:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Leads Management</h1>
            <p className="text-sm text-gray-600">Manage and track your leads</p>
          </div>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600">Loading leads...</div>
            <div className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-6 xl:px-8">
      {/* Message Display */}
      {message && (
        <div className={`mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg ${message.type === 'success'
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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-5 lg:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Leads Management</h1>
          <p className="text-sm text-gray-600">Manage and track your leads</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {leads.length} Leads
            </div>
            {leads.length > 0 && (
              <div className="text-xs text-gray-500">
                {leads.filter(lead => lead.status === 'new').length} new
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-lg shadow mb-4 sm:mb-5 lg:mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3 sm:mb-4">Filter Leads</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="consultation_scheduled">Consultation Scheduled</option>
              <option value="consultation_completed">Consultation Completed</option>
              <option value="qualified">Qualified</option>
              <option value="application_started">Application Started</option>
              <option value="application_submitted">Application Submitted</option>
              <option value="admission_received">Admission Received</option>
              <option value="visa_applied">Visa Applied</option>
              <option value="visa_approved">Visa Approved</option>
              <option value="enrolled">Enrolled</option>
              <option value="converted">Converted</option>
              <option value="not_interested">Not Interested</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation bg-white"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="social_media">Social Media</option>
              <option value="referral">Referral</option>
              <option value="advertisement">Advertisement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation bg-white"
            >
              <option value="all">All Countries</option>
              {availableCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(statusFilter !== 'all' || sourceFilter !== 'all' || countryFilter !== 'all') && (
          <div className="mt-3 sm:mt-4">
            <button
              onClick={() => {
                setStatusFilter('all');
                setSourceFilter('all');
                setCountryFilter('all');
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg touch-manipulation transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="hidden md:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500 truncate">{lead.email}</div>
                      {lead.phone && (
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => handleCall(lead.phone)}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            title="Click to call"
                          >
                            📞 {lead.phone}
                          </button>
                          <WhatsAppButton
                            phoneNumber={lead.phone}
                            leadName={lead.name}
                            leadCountry={lead.country}
                            leadProgram={lead.program}
                            leadStatus={lead.status}
                            size="small"
                            showText={false}
                            onTrack={handleWhatsAppTracking}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.country}
                  </td>
                  <td className="hidden md:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.source}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                      className={`text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${getStatusColor(lead.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="consultation_scheduled">Consultation Scheduled</option>
                      <option value="consultation_completed">Consultation Completed</option>
                      <option value="qualified">Qualified</option>
                      <option value="application_started">Application Started</option>
                      <option value="application_submitted">Application Submitted</option>
                      <option value="admission_received">Admission Received</option>
                      <option value="visa_applied">Visa Applied</option>
                      <option value="visa_approved">Visa Approved</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="converted">Converted</option>
                      <option value="not_interested">Not Interested</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="hidden lg:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteLead(lead._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden">
          {leads.map((lead) => (
            <div key={lead._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 mr-2">{lead.country}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500 ml-2">{lead.source}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 touch-manipulation"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteLead(lead._id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 touch-manipulation"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Contact Actions */}
              {lead.phone && (
                <div className="flex items-center space-x-2 mb-3">
                  <button
                    onClick={() => handleCall(lead.phone)}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 touch-manipulation"
                    title="Click to call"
                  >
                    <span>📞</span>
                    <span className="text-sm">{lead.phone}</span>
                  </button>
                  <WhatsAppButton
                    phoneNumber={lead.phone}
                    leadName={lead.name}
                    leadCountry={lead.country}
                    leadProgram={lead.program}
                    leadStatus={lead.status}
                    size="medium"
                    showText={true}
                    onTrack={handleWhatsAppTracking}
                    className="flex-1"
                  />
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>
                <select
                  value={lead.status}
                  onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                  className={`text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 touch-manipulation ${getStatusColor(lead.status)}`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="consultation_scheduled">Consultation Scheduled</option>
                  <option value="consultation_completed">Consultation Completed</option>
                  <option value="qualified">Qualified</option>
                  <option value="application_started">Application Started</option>
                  <option value="application_submitted">Application Submitted</option>
                  <option value="admission_received">Admission Received</option>
                  <option value="visa_applied">Visa Applied</option>
                  <option value="visa_approved">Visa Approved</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="converted">Converted</option>
                  <option value="not_interested">Not Interested</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-2 sm:top-4 lg:top-20 mx-auto p-4 sm:p-5 lg:p-6 border w-11/12 sm:w-10/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-2 sm:mt-3">
              <div className="flex justify-between items-center mb-4 sm:mb-5">
                <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900">Lead Details</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-500 hover:text-gray-600 touch-manipulation p-2 -m-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedLead.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedLead.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="mt-1">
                      {selectedLead.phone ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleCall(selectedLead.phone)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 touch-manipulation"
                            title="Click to call"
                          >
                            <span className="text-lg">📞</span>
                            <span className="text-sm font-medium">{selectedLead.phone}</span>
                          </button>
                          <WhatsAppButton
                            phoneNumber={selectedLead.phone}
                            leadName={selectedLead.name}
                            leadCountry={selectedLead.country}
                            leadProgram={selectedLead.program}
                            leadStatus={selectedLead.status}
                            size="large"
                            variant="default"
                            showText={true}
                            onTrack={handleWhatsAppTracking}
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">Not provided</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedLead.country}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedLead.source}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(selectedLead.status)}`}>
                      {selectedLead.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                {selectedLead.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{new Date(selectedLead.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Update Status</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {['new', 'contacted', 'consultation_scheduled', 'consultation_completed', 'qualified', 'application_started', 'application_submitted', 'admission_received', 'visa_applied', 'visa_approved', 'enrolled', 'converted', 'not_interested', 'closed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateLeadStatus(selectedLead._id, status)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg touch-manipulation transition-colors ${selectedLead.status === status
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                          }`}
                      >
                        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
