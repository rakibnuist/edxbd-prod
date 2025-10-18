'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalTestimonials: number;
  totalCountries: number;
  totalPartnerships: number;
  newPartnerships: number;
  recentLeads: any[];
  recentPartnerships: any[];
}

interface MetaStatus {
  pixelId: string | null;
  accessToken: string | null;
  pixelActive: boolean;
  conversionApiActive: boolean;
  eventsTracked: number;
}

export default function AdminDashboardNew() {
  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
  totalLeads: 0,
  newLeads: 0,
  totalTestimonials: 0,
  totalCountries: 0,
  totalPartnerships: 0,
  newPartnerships: 0,
  recentLeads: [],
  recentPartnerships: []
  });
  const [metaStatus, setMetaStatus] = useState<MetaStatus>({
    pixelId: null,
    accessToken: null,
    pixelActive: false,
    conversionApiActive: false,
    eventsTracked: 0
  });
  const [metaLoading, setMetaLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchData();
      checkMetaStatus();
    }
  }, [isAuthenticated, authLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use authenticated fetch with automatic token refresh
      const response = await authenticatedFetch('/api/admin/dashboard');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      console.log('Dashboard API response status:', response.status);
      
      // Direct assignment - no complex state management
      setStats({
        totalLeads: data.totalLeads || 0,
        newLeads: data.newLeads || 0,
        totalTestimonials: data.totalTestimonials || 0,
        totalCountries: data.totalCountries || 0,
        totalPartnerships: data.totalPartnerships || 0,
        newPartnerships: data.newPartnerships || 0,
        recentLeads: data.recentLeads || [],
        recentPartnerships: data.recentPartnerships || []
      });
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const checkMetaStatus = async () => {
    try {
      setMetaLoading(true);
      const response = await fetch('/api/meta-status');
      if (response.ok) {
        const data = await response.json();
        setMetaStatus(data);
        console.log('Meta status fetched:', data);
      } else {
        console.error('Failed to fetch Meta status:', response.status);
        // Set default values if API fails
        setMetaStatus({
          pixelId: null,
          accessToken: null,
          pixelActive: false,
          conversionApiActive: false,
          eventsTracked: 0
        });
      }
    } catch (error) {
      console.error('Error fetching Meta status:', error);
      // Set default values if API fails
      setMetaStatus({
        pixelId: null,
        accessToken: null,
        pixelActive: false,
        conversionApiActive: false,
        eventsTracked: 0
      });
    } finally {
      setMetaLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-gray-600">Authentication required</div>
          <div className="text-sm text-gray-500 mt-2">Please login to access the dashboard</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600">Error loading dashboard</div>
          <div className="text-sm text-gray-500 mt-2">{error}</div>
          <div className="mt-4 space-x-2">
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                fetchData();
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Auth & Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Database: connected</span>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h3 className="font-bold text-yellow-800">Debug Info:</h3>
        <p className="text-sm text-yellow-700">
          Total Leads: {stats.totalLeads} | 
          Total Testimonials: {stats.totalTestimonials} | 
          Total Countries: {stats.totalCountries}
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'} | 
          Loading: {loading ? 'Yes' : 'No'} | 
          Error: {error || 'None'}
        </p>
      </div>

      {/* Meta Connectivity Status */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-blue-800">Meta Connectivity Status</h3>
          {metaLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-xs text-blue-600">Loading...</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${metaStatus.pixelActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">Meta Pixel</span>
            <span className={`text-xs px-2 py-1 rounded ${metaStatus.pixelActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {metaStatus.pixelActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${metaStatus.conversionApiActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">Conversion API</span>
            <span className={`text-xs px-2 py-1 rounded ${metaStatus.conversionApiActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {metaStatus.conversionApiActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="text-sm">
            <span className="font-medium text-gray-700">Pixel ID:</span>
            <span className="text-gray-600 ml-1">{metaStatus.pixelId || 'Not Set'}</span>
              </div>
          
          <div className="text-sm">
            <span className="font-medium text-gray-700">Access Token:</span>
            <span className="text-gray-600 ml-1">{metaStatus.accessToken || 'Not Set'}</span>
            </div>
        </div>
        
        {!metaStatus.pixelActive && (
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Setup Required:</strong> Add NEXT_PUBLIC_META_PIXEL_ID to your environment variables to enable Meta Pixel tracking.
            </p>
          </div>
        )}
        
        {!metaStatus.conversionApiActive && (
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Setup Required:</strong> Add META_ACCESS_TOKEN to your environment variables to enable Meta Conversion API tracking.
            </p>
          </div>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Testimonials</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTestimonials}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Countries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCountries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Partnerships</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPartnerships}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Partnerships</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newPartnerships}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
            {stats.recentLeads.length > 0 ? (
            <div className="space-y-3">
              {stats.recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">{lead.country}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent leads</p>
            )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Partnerships</h3>
            {stats.recentPartnerships.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPartnerships.map((partnership, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                    <p className="font-medium text-gray-900">{partnership.companyName}</p>
                    <p className="text-sm text-gray-600">{partnership.contactEmail}</p>
                  </div>
                  <span className="text-sm text-gray-500">{partnership.country}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent partnerships</p>
            )}
          </div>
      </div>
    </div>
  );
}
