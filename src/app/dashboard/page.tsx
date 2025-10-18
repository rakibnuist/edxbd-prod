'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-1 sm:space-y-2">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            EduExpress International User Dashboard
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
        {/* User Info Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-3 sm:p-4 lg:p-5">
            <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                  User Information
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Role: {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-3 sm:p-4 lg:p-5">
            <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">
                  Quick Actions
                </h3>
                <div className="space-y-1 sm:space-y-2">
                  <Link
                    href="/dashboard/content"
                    className="block text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Manage Content
                  </Link>
                  <Link
                    href="/dashboard/leads"
                    className="block text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Leads
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updates Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 sm:col-span-2 lg:col-span-1">
          <div className="p-3 sm:p-4 lg:p-5">
            <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">
                  Latest Updates
                </h3>
                <Link
                  href="/updates"
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all updates →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-3 sm:p-4 lg:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Management Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            <Link
              href="/dashboard/content"
              className="flex items-center p-2 sm:p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors touch-manipulation"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-900">Content</h4>
                <p className="text-xs text-gray-500">Manage website content</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/testimonials"
              className="flex items-center p-2 sm:p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors touch-manipulation"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-900">Testimonials</h4>
                <p className="text-xs text-gray-500">Manage customer reviews</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/leads"
              className="flex items-center p-2 sm:p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors touch-manipulation"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-900">Leads</h4>
                <p className="text-xs text-gray-500">View and manage leads</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/partnerships"
              className="flex items-center p-2 sm:p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors touch-manipulation"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-900">Partnerships</h4>
                <p className="text-xs text-gray-500">Manage partnerships</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="p-3 sm:p-4 lg:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Welcome to EduExpress International
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            You have access to manage content, testimonials, leads, and partnerships. 
            Use the navigation menu to access different sections of your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link
              href="/dashboard/content"
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors touch-manipulation"
            >
              Manage Content
            </Link>
            <Link
              href="/dashboard/leads"
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors touch-manipulation"
            >
              View Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
