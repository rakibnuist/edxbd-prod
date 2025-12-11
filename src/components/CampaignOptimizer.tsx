'use client';

import { useState, useEffect } from 'react';
import { Target, AlertCircle } from 'lucide-react';

interface CampaignData {
  campaignId: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  objective: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  costPerLead: number;
  costPerConversion: number;
  conversionRate: number;
  roi: number;
  countries: string[];
  lastUpdated: string;
}

export default function CampaignOptimizer() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCampaigns: CampaignData[] = [
      {
        campaignId: '1',
        name: 'South Korea Study Abroad',
        status: 'active',
        objective: 'Lead Generation',
        budget: 50000,
        spent: 32450,
        impressions: 125000,
        clicks: 3200,
        leads: 156,
        conversions: 12,
        costPerLead: 208,
        costPerConversion: 2704,
        conversionRate: 7.7,
        roi: 320,
        countries: ['South Korea'],
        lastUpdated: new Date().toISOString()
      },
      {
        campaignId: '2',
        name: 'China University Programs',
        status: 'active',
        objective: 'Lead Generation',
        budget: 30000,
        spent: 18900,
        impressions: 89000,
        clicks: 2100,
        leads: 98,
        conversions: 8,
        costPerLead: 193,
        costPerConversion: 2363,
        conversionRate: 8.2,
        roi: 280,
        countries: ['China'],
        lastUpdated: new Date().toISOString()
      },
      {
        campaignId: '3',
        name: 'UK Scholarship Opportunities',
        status: 'paused',
        objective: 'Lead Generation',
        budget: 25000,
        spent: 15200,
        impressions: 67000,
        clicks: 1800,
        leads: 67,
        conversions: 5,
        costPerLead: 227,
        costPerConversion: 3040,
        conversionRate: 7.5,
        roi: 180,
        countries: ['UK'],
        lastUpdated: new Date().toISOString()
      }
    ];

    setCampaigns(mockCampaigns);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    return value >= threshold ? 'text-green-600' : 'text-red-600';
  };

  /* const getPerformanceIcon = (score: number) => {
    if (score >= 90) return <Zap className="w-4 h-4 text-amber-500" />;
    if (score >= 70) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <RefreshCw className="w-4 h-4 text-blue-500" />;
  }; */

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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Campaign Performance Optimizer</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
          Create Campaign
        </button>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.campaignId}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedCampaign === campaign.campaignId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            onClick={() => setSelectedCampaign(
              selectedCampaign === campaign.campaignId ? null : campaign.campaignId
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <h4 className="font-semibold text-lg">{campaign.name}</h4>
                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Budget: ৳{campaign.budget.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Spent: ৳{campaign.spent.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{campaign.leads}</p>
                <p className="text-sm text-gray-600">Leads</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{campaign.conversions}</p>
                <p className="text-sm text-gray-600">Conversions</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getPerformanceColor(campaign.conversionRate, 7)}`}>
                  {campaign.conversionRate}%
                </p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getPerformanceColor(campaign.roi, 200)}`}>
                  {campaign.roi}%
                </p>
                <p className="text-sm text-gray-600">ROI</p>
              </div>
            </div>

            {selectedCampaign === campaign.campaignId && (
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Performance Metrics</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Cost per Lead:</span>
                        <span className={getPerformanceColor(campaign.costPerLead, 250)}>
                          ৳{campaign.costPerLead}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost per Conversion:</span>
                        <span className={getPerformanceColor(campaign.costPerConversion, 3000)}>
                          ৳{campaign.costPerConversion.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>CTR:</span>
                        <span>{(campaign.clicks / campaign.impressions * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Optimization Recommendations</h5>
                    <div className="space-y-2 text-sm">
                      {campaign.costPerLead > 250 && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span>High cost per lead - consider audience refinement</span>
                        </div>
                      )}
                      {campaign.conversionRate < 7 && (
                        <div className="flex items-center text-yellow-600">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span>Low conversion rate - optimize landing pages</span>
                        </div>
                      )}
                      {campaign.roi < 200 && (
                        <div className="flex items-center text-orange-600">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span>ROI below target - review campaign strategy</span>
                        </div>
                      )}
                      {campaign.costPerLead <= 250 && campaign.conversionRate >= 7 && campaign.roi >= 200 && (
                        <div className="flex items-center text-green-600">
                          <Target className="w-4 h-4 mr-2" />
                          <span>Campaign performing well - consider scaling</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                    Scale Up
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                    Optimize
                  </button>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm">
                    Pause
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                    Stop
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-3">Overall Performance Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Leads</p>
            <p className="font-medium text-lg">
              {campaigns.reduce((sum, c) => sum + c.leads, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total Conversions</p>
            <p className="font-medium text-lg">
              {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Avg. Conversion Rate</p>
            <p className="font-medium text-lg">
              {(campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total ROI</p>
            <p className="font-medium text-lg">
              {(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
