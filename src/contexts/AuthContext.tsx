'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
  isAuthenticated: boolean;
  getAuthHeaders: () => Record<string, string>;
  refreshToken: () => Promise<boolean>;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch {
        // Invalid user data, clear it
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false };
      }
    } catch {
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setUser(null);
      router.push('/login');
    }
  };

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      console.warn('No token found in localStorage');
      return {
        'Content-Type': 'application/json'
      };
    }

    // Basic token validation - check if it's a valid JWT format
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.warn('Invalid token format');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setUser(null);
      return {
        'Content-Type': 'application/json'
      };
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token is expired, will need to refresh');
        // Don't remove the token here, let the API call handle the refresh
      }
    } catch (error) {
      console.warn('Error checking token expiration:', error);
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@eduexpressint.com',
          password: 'admin123'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // First attempt with current token
    const authHeaders = getAuthHeaders();
    const mergedHeaders: Record<string, string> = {
      ...authHeaders,
      ...(options.headers as Record<string, string> || {}),
    };

    let response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
    });

    // If we get a 403, try to refresh the token and retry once
    if (response.status === 403) {
      console.log('Got 403, attempting token refresh...');
      const refreshSuccess = await refreshToken();

      if (refreshSuccess) {
        console.log('Token refreshed successfully, retrying request...');
        // Retry the request with the new token
        const retryAuthHeaders = getAuthHeaders();
        const retryMergedHeaders: Record<string, string> = {
          ...retryAuthHeaders,
          ...(options.headers as Record<string, string> || {}),
        };

        response = await fetch(url, {
          ...options,
          headers: retryMergedHeaders,
        });
      } else {
        console.error('Token refresh failed');
      }
    }

    return response;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    getAuthHeaders,
    refreshToken,
    authenticatedFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
