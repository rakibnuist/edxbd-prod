import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get('endDate') || new Date().toISOString();
    const country = searchParams.get('country');
    const source = searchParams.get('source');

    // Build filter
    const where: any = {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    };

    if (country) where.country = country;
    if (source) where.source = source;

    // Get leads data
    const leads = await prisma.lead.findMany({ where });

    // Calculate metrics
    const totalLeads = leads.length;
    const totalConversions = leads.filter(lead =>
      ['admission_received', 'visa_approved', 'enrolled', 'converted'].includes(lead.status)
    ).length;

    const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;

    // Group by country
    const countryStats = leads.reduce((acc, lead) => {
      const country = lead.country || 'Unknown';
      if (!acc[country]) {
        acc[country] = { leads: 0, conversions: 0 };
      }
      acc[country].leads++;
      if (['admission_received', 'visa_approved', 'enrolled', 'converted'].includes(lead.status)) {
        acc[country].conversions++;
      }
      return acc;
    }, {} as Record<string, { leads: number; conversions: number }>);

    // Group by source
    const sourceStats = leads.reduce((acc, lead) => {
      const source = lead.source || 'Unknown';
      if (!acc[source]) {
        acc[source] = { leads: 0, conversions: 0 };
      }
      acc[source].leads++;
      if (['admission_received', 'visa_approved', 'enrolled', 'converted'].includes(lead.status)) {
        acc[source].conversions++;
      }
      return acc;
    }, {} as Record<string, { leads: number; conversions: number }>);

    // Group by status
    const statusStats = leads.reduce((acc, lead) => {
      const status = lead.status || 'Unknown';
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    }, {} as Record<string, number>);

    // Calculate daily trends
    const dailyStats = leads.reduce((acc, lead) => {
      const date = new Date(lead.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { leads: 0, conversions: 0 };
      }
      acc[date].leads++;
      if (['admission_received', 'visa_approved', 'enrolled', 'converted'].includes(lead.status)) {
        acc[date].conversions++;
      }
      return acc;
    }, {} as Record<string, { leads: number; conversions: number }>);

    // Top countries by leads
    const topCountries = Object.entries(countryStats)
      .map(([country, stats]) => ({ country, ...stats }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 10);

    // Top sources by leads
    const topSources = Object.entries(sourceStats)
      .map(([source, stats]) => ({ source, ...stats }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 10);

    return NextResponse.json({
      summary: {
        totalLeads,
        totalConversions,
        conversionRate: Math.round(conversionRate * 100) / 100,
        period: { startDate, endDate }
      },
      topCountries,
      topSources,
      statusBreakdown: statusStats,
      dailyTrends: dailyStats,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
