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
    fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
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
      setUser(null);
      router.push('/login');
    }
  };

  const getAuthHeaders = (): Record<string, string> => {
    // Authentication is carried by the httpOnly cookie. Callers set a content
    // type only when needed so FormData uploads retain their multipart boundary.
    return {};
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.user) setUser(data.user);
        return Boolean(data?.user);
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

    const response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
      credentials: 'include',
    });

    if (response.status === 401 || response.status === 403) {
      setUser(null);
      router.push('/login');
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
