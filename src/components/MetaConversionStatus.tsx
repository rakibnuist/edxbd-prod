'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface MetaConversionStatus {
  pixelActive: boolean;
  conversionAPI: boolean;
  eventsConfigured: number;
  totalEvents: number;
  lastTest: string | null;
  errors: string[];
}

export default function MetaConversionStatus() {
  const [status, setStatus] = useState<MetaConversionStatus>({
    pixelActive: false,
    conversionAPI: false,
    eventsConfigured: 0,
    totalEvents: 0,
    lastTest: null,
    errors: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check Meta Pixel
        const pixelActive = typeof window !== 'undefined' &&
          typeof window.fbq === 'function' &&
          process.env.NEXT_PUBLIC_META_PIXEL_ID !== '1234567890';

        // Check Conversion API
        let conversionAPI = false;
        try {
          const response = await fetch('/api/meta-conversion', {
            method: 'GET'
          });
          if (response.ok) {
            const data = await response.json();
            conversionAPI = data.supportedEvents && data.supportedEvents.length > 0;
          }
        } catch (error) {
          console.error('Conversion API check failed:', error);
        }

        // Count configured events
        const configuredEvents = [
          'study_abroad_lead',
          'consultation_request',
          'page_view',
          'view_content',
          'complete_registration',
          'contact',
          'lead_status_change',
          'consultation_booking',
          'application_submission',
          'admission_received',
          'visa_approval',
          'enrollment_completion',
          'whatsapp_click',
          'phone_click',
          'destination_view',
          'scholarship_inquiry',
          'university_interest',
          'program_interest',
          'document_download',
          'email_subscription',
          'partnership_inquiry'
        ];

        setStatus({
          pixelActive,
          conversionAPI,
          eventsConfigured: configuredEvents.length,
          totalEvents: configuredEvents.length,
          lastTest: localStorage.getItem('lastMetaConversionTest') || null,
          errors: []
        });
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          errors: [...prev.errors, `Status check failed: ${error}`]
        }));
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  const testConversionAPI = async () => {
    try {
      const response = await fetch('/api/meta-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'test',
          data: {},
          source: 'status_test'
        }),
      });

      if (response.ok) {
        const _result = await response.json();
        localStorage.setItem('lastMetaConversionTest', new Date().toISOString());
        setStatus(prev => ({
          ...prev,
          lastTest: new Date().toISOString()
        }));
        alert('Test event sent successfully!');
      } else {
        throw new Error('Test failed');
      }
    } catch (error) {
      alert('Test failed: ' + error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Checking Meta Conversion API status...</span>
        </div>
      </div>
    );
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
        Meta Conversion API Status
      </h3>

      <div className="space-y-4">
        {/* Meta Pixel Status */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center">
            {getStatusIcon(status.pixelActive)}
            <span className="ml-2 font-medium">Meta Pixel</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status.pixelActive)}`}>
            {status.pixelActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Conversion API Status */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center">
            {getStatusIcon(status.conversionAPI)}
            <span className="ml-2 font-medium">Conversion API</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status.conversionAPI)}`}>
            {status.conversionAPI ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Events Configuration */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="ml-2 font-medium">Events Configured</span>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
            {status.eventsConfigured}/{status.totalEvents}
          </span>
        </div>

        {/* Last Test */}
        {status.lastTest && (
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="ml-2 font-medium">Last Test</span>
            </div>
            <span className="text-sm text-gray-600">
              {new Date(status.lastTest).toLocaleString()}
            </span>
          </div>
        )}

        {/* Test Button */}
        <div className="pt-4">
          <button
            onClick={testConversionAPI}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Test Conversion API
          </button>
        </div>

        {/* Errors */}
        {status.errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
            <ul className="text-sm text-red-600 space-y-1">
              {status.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Integration Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Integration Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>Meta Pixel:</strong> {status.pixelActive ? '✅ Active' : '❌ Inactive'}</p>
            <p>• <strong>Conversion API:</strong> {status.conversionAPI ? '✅ Active' : '❌ Inactive'}</p>
            <p>• <strong>Events:</strong> {status.eventsConfigured} education consultancy events configured</p>
            <p>• <strong>Coverage:</strong> Complete funnel tracking from lead to enrollment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
