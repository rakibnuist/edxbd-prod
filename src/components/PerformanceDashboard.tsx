'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Target, AlertCircle, CheckCircle } from 'lucide-react';

interface PerformanceMetrics {
  totalLeads: number;
  totalConversions: number;
  conversionRate: number;
  costPerLead: number;
  costPerConversion: number;
  roi: number;
  topCountries: Array<{ country: string; leads: number; conversions: number }>;
  topEvents: Array<{ event: string; count: number; value: number }>;
  lastUpdated: string;
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // This would typically fetch from your analytics API
        // For now, we'll simulate the data
        const mockMetrics: PerformanceMetrics = {
          totalLeads: 1247,
          totalConversions: 89,
          conversionRate: 7.14,
          costPerLead: 450,
          costPerConversion: 6300,
          roi: 320,
          topCountries: [
            { country: 'South Korea', leads: 456, conversions: 34 },
            { country: 'China', leads: 389, conversions: 28 },
            { country: 'UK', leads: 234, conversions: 15 },
            { country: 'Hungary', leads: 168, conversions: 12 }
          ],
          topEvents: [
            { event: 'Study Abroad Lead', count: 1247, value: 0 },
            { event: 'Consultation Request', count: 892, value: 0 },
            { event: 'Application Submitted', count: 156, value: 0 },
            { event: 'Admission Received', count: 89, value: 89000 },
            { event: 'Visa Approved', count: 67, value: 134000 },
            { event: 'Student Enrolled', count: 45, value: 225000 }
          ],
          lastUpdated: new Date().toISOString()
        };

        setMetrics(mockMetrics);
      } catch (_err) {
        setError('Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Meta Conversion Performance</h3>
        <span className="text-sm text-gray-500">
          Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.totalLeads.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Conversions</p>
              <p className="text-2xl font-bold text-green-600">{metrics.totalConversions}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.roi}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3">Top Performing Countries</h4>
        <div className="space-y-2">
          {metrics.topCountries.map((country, index) => (
            <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <span className="font-medium">{country.country}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{country.leads} leads</p>
                <p className="text-sm font-medium text-green-600">{country.conversions} conversions</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Events */}
      <div>
        <h4 className="text-md font-semibold mb-3">Event Performance</h4>
        <div className="space-y-2">
          {metrics.topEvents.map((event, _index) => (
            <div key={event.event} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium">{event.event}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{event.count} events</p>
                <p className="text-sm font-medium text-blue-600">
                  {event.value > 0 ? `৳${event.value.toLocaleString()}` : 'No value'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-md font-semibold mb-3">Performance Indicators</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Cost per Lead</p>
            <p className="font-medium">৳{metrics.costPerLead}</p>
          </div>
          <div>
            <p className="text-gray-600">Cost per Conversion</p>
            <p className="font-medium">৳{metrics.costPerConversion.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">ROI</p>
            <p className="font-medium text-green-600">{metrics.roi}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
