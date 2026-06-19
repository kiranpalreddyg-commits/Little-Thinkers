'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';
import { readChildSummary, formatWeekLabel, type ChildWeeklySummary } from '@/lib/utils/parentDashboard';
import type { ChildProfile } from '@/lib/types/auth';

interface ChildWithSummary {
  profile: ChildProfile;
  summary: ChildWeeklySummary;
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [children, setChildren] = useState<ChildWithSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient
      .getChildren()
      .then((profiles) => {
        const withSummaries = profiles.map((profile) => ({
          profile,
          summary: readChildSummary(profile.id),
        }));
        setChildren(withSummaries);
      })
      .catch(() => setError('Failed to load child profiles.'))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quick View</h1>
          <p className="text-gray-500 mt-1">{formatWeekLabel()}</p>
        </div>

        {error && (
          <p className="mb-6 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Child summary cards */}
        {children.length === 0 && !error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            <p>No child profiles found.</p>
            <Link
              href="/signup/child-setup"
              className="mt-4 inline-block text-sm text-[var(--color-brand)] font-medium hover:underline"
            >
              Add a child profile →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {children.map(({ profile, summary }) => (
              <ChildSummaryCard key={profile.id} profile={profile} summary={summary} />
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex gap-4 text-sm">
          <Link
            href="/parent/consent"
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Manage Consent
          </Link>
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ChildSummaryCardProps {
  profile: ChildProfile;
  summary: ChildWeeklySummary;
}

function ChildSummaryCard({ profile, summary }: ChildSummaryCardProps) {
  return (
    <div
      data-child-id={profile.id}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      {/* Child header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg">
          {profile.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{profile.name}</p>
          <p className="text-xs text-gray-500">Age {profile.age}</p>
        </div>
      </div>

      {/* Engagement metrics */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Engagement
      </p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Metric
          testId={`streak-${profile.id}`}
          label="Day Streak"
          value={summary.currentStreak}
          icon="🔥"
        />
        <Metric
          testId={`sparks-${profile.id}`}
          label="Total Sparks"
          value={summary.totalSparks}
          icon="⚡"
        />
      </div>

      {/* Achievement metrics */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Achievements
      </p>
      <div className="grid grid-cols-3 gap-3">
        <Metric
          testId={`badges-${profile.id}`}
          label="New Badges"
          value={summary.badgesThisWeek}
          icon="🏆"
        />
        <Metric
          testId={`areas-${profile.id}`}
          label="Areas"
          value={summary.worldAreasUnlocked}
          icon="🗺️"
        />
        <Metric
          testId={`mascot-${profile.id}`}
          label="Mascot Lv"
          value={summary.mascotLevel}
          icon="🐣"
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href={`/parent/full-view?child=${profile.id}`}
          className="text-sm font-semibold text-[var(--color-brand)] hover:underline"
        >
          Full View →
        </Link>
      </div>
    </div>
  );
}

interface MetricProps {
  testId: string;
  label: string;
  value: number;
  icon: string;
}

function Metric({ testId, label, value, icon }: MetricProps) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2 text-center">
      <p className="text-lg">{icon}</p>
      <p
        data-testid={testId}
        className="text-xl font-bold text-gray-900 leading-none mt-1"
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
