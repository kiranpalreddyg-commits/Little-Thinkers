'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useAuth } from '@/hooks/useAuth';
import { ProfileSelector } from '@/components/auth/ProfileSelector';
import { ChildProfile } from '@/lib/types/auth';

export default function ProfileSelectPage() {
  const { isAuthenticated, childProfile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (childProfile) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, childProfile, isLoading, router]);

  const handleProfileSelected = (profile: ChildProfile) => {
    posthog.capture('child_profile_selected', {
      child_id: profile.id,
      child_age: profile.age,
      gameplay_mode: profile.gameplay_mode,
    });
    // Navigate to home after a brief delay to show selection feedback
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Little Thinkers!</h1>
          <p className="text-gray-600 text-lg">Choose your learning adventure</p>
        </div>

        {/* Profile Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProfileSelector onProfileSelected={handleProfileSelected} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Each profile is personalized to your learning style and progress.
          </p>
        </div>
      </div>
    </div>
  );
}