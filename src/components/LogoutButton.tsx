'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function LogoutButton() {
  const { logout, user } = useAuth();

  return (
    <div className="space-y-3">
      {user && (
        <div className="text-sm text-gray-300">
          <p className="font-semibold text-white truncate">{user.name || 'EduExpress Staff'}</p>
          <p className="hidden sm:block text-xs text-slate-400 truncate">{user.email}</p>
        </div>
      )}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold rounded-xl text-white bg-red-600/90 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-xs"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  );
}
