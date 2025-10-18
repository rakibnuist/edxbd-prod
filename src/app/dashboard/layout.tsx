'use client';

import Link from 'next/link';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import LogoutButton from '@/components/LogoutButton';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <div className="flex h-screen">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div className={`
              fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <div className="flex flex-col h-full">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                      EduExpress User
                    </h1>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <nav className="mt-2 sm:mt-6 flex-1 px-2 sm:px-0">
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 sm:px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 sm:mx-0 mb-1 text-sm sm:text-base"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/content"
                    className="flex items-center px-4 sm:px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 sm:mx-0 mb-1 text-sm sm:text-base"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Content
                  </Link>
                  <Link
                    href="/dashboard/testimonials"
                    className="flex items-center px-4 sm:px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 sm:mx-0 mb-1 text-sm sm:text-base"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Testimonials
                  </Link>
                  <Link
                    href="/dashboard/leads"
                    className="flex items-center px-4 sm:px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 sm:mx-0 mb-1 text-sm sm:text-base"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Leads
                  </Link>
                  <Link
                    href="/dashboard/partnerships"
                    className="flex items-center px-4 sm:px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 sm:mx-0 mb-1 text-sm sm:text-base"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Partnerships
                  </Link>
                </nav>
                
                {/* Logout Button */}
                <div className="p-4 sm:p-6 border-t border-gray-200">
                  <LogoutButton />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
              {/* Mobile header */}
              <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 touch-manipulation"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
                  <div className="w-10"></div> {/* Spacer for centering */}
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
