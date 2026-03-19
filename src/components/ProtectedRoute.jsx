"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Enforce basic auth redirect
        router.push('/login');
      } else if (adminOnly && user.role !== 'admin') {
        // Redirect standard users away from admin-exclusive interfaces immediately
        router.push('/');
      }
    }
  }, [user, loading, router, adminOnly]);

  if (loading || !user || (adminOnly && user.role !== 'admin')) {
    // Returns a theme-compliant dark aesthetic loader while evaluating logic
    return (
      <div className="flex h-full w-full items-center justify-center bg-brand-bg text-text-primary py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-t-accent-buy border-gray-700 animate-spin"></div>
          <p className="text-text-secondary font-medium tracking-wide">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return children;
}
