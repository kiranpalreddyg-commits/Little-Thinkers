'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';
import {
  readChildDetailedView,
  formatWeekLabel,
  type ChildDetailedView,
} from '@/lib/utils/parentDashboard';
import type { ChildProfile } from '@/lib/types/auth';

function FullViewInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const selectedChildId = searchParams.get('child');

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
  const [detail, setDetail] = useState<ChildDetailedView | null>(null);
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
        setChildren(profiles);
        const target = profiles.find((p) => p.id === selectedChildId) ?? profiles[0] ?? null;
        setActiveChild(target);
      })
      .catch(() => setError('Failed to load child profiles.'))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, selectedChildId]);

  useEffect(() => {
    if (activeChild) {
      setDetail(readChildDetailedView(activeChild.id, activeChild.name));
    }
  }, [activeChild]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Full View</h1>
            <p className="text-gray-500 mt-1">{formatWeekLabel()}</p>
          </div>
          <Link
            href="/parent/dashboard"
            className="text-sm text-[var(--color-brand)] font-medium hover:underline"
          >
            ← Quick View
          </Link>
        </div>

        {/* Child selector */}
        {children.length > 1 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            {children.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveChild(c);
                  router.push(`/parent/full-view?child=${c.id}`);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeChild?.id === c.id
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="mb-6 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        {detail && activeChild && (
          <div className="space-y-6">

            {/* ── Skill Tracking (AC1) ────────────────────────────────────── */}
            <section data-testid="section-skills" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Skill Tracking</h2>
              <div className="space-y-3">
                {detail.skills.map((skill) => (
                  <div key={skill.gameType} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-gray-700 w-40 shrink-0">
                      {skill.displayName}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[var(--color-brand)] h-2 rounded-full"
                        style={{ width: `${(skill.difficultyLevel / 5) * 100}%` }}
                      />
                    </div>
                    <span
                      data-testid={`skill-level-${skill.gameType}`}
                      className="text-sm font-bold text-[var(--color-brand)] w-12 text-right"
                    >
                      {skill.difficultyLevel}
                    </span>
                    <span className="text-xs text-gray-400 w-20 text-right shrink-0">
                      {skill.hintsUsed} hint{skill.hintsUsed !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── World Map (AC1) ─────────────────────────────────────────── */}
            <section data-testid="section-world-map" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">World Map Progress</h2>
              <ul className="space-y-2">
                {detail.worldAreas.map((area) => (
                  <li key={area.id} className="flex items-center gap-3">
                    <span className={`text-lg ${area.isUnlocked ? '' : 'grayscale opacity-40'}`}>
                      {area.isUnlocked ? '🌍' : '🔒'}
                    </span>
                    <span className={`text-sm font-medium ${area.isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                      {area.name}
                    </span>
                    {!area.isUnlocked && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {area.sparkThreshold} Sparks to unlock
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Streak (AC1) ────────────────────────────────────────────── */}
            <section data-testid="section-streak" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Streak Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-orange-500" data-testid="current-streak">
                    {detail.currentStreak}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current Streak</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-gray-700" data-testid="longest-streak">
                    {detail.longestStreak}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Longest Streak</p>
                </div>
              </div>
              {detail.lastActivityDate && (
                <p className="text-xs text-gray-400 mt-3">
                  Last active: {detail.lastActivityDate}
                </p>
              )}
            </section>

            {/* ── Brain Report (AC2) ──────────────────────────────────────── */}
            <section data-testid="section-brain-report" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Weekly Brain Report</h2>
              <p className="text-xs text-gray-400 mb-4">{formatWeekLabel()}</p>
              <p
                data-testid="brain-report-text"
                className="text-sm text-gray-700 leading-relaxed bg-violet-50 rounded-xl px-4 py-3"
              >
                {detail.brainReport}
              </p>
            </section>

            {/* ── Quarterly Assessments (AC3) ─────────────────────────────── */}
            <section data-testid="section-assessments" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quarterly Assessments</h2>
              <ul className="space-y-3">
                {detail.quarterlyAssessments.map((a, i) => (
                  <li
                    key={i}
                    data-testid={`assessment-${i}`}
                    className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{a.label}</p>
                      {a.date && (
                        <p className="text-xs text-gray-400">{a.date}</p>
                      )}
                    </div>
                    {a.status === 'completed' ? (
                      <span className="text-sm font-bold text-green-600">
                        {a.score}/100
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                        Pending
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Accessibility & Learning Preferences (AC4) ──────────────── */}
            <section data-testid="section-accessibility" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Accessibility &amp; Learning Preferences
              </h2>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Learning Mode
                </p>
                <p className="text-sm font-semibold text-[var(--color-brand)] capitalize">
                  {activeChild.gameplay_mode}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Accessibility Settings
                </p>
                <ul className="space-y-2">
                  {Object.entries(activeChild.accessibility_settings as Record<string, unknown>).map(([key, value]) => (
                    <li key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                      </span>
                      <span
                        data-testid={`setting-${key}`}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          value === true
                            ? 'bg-green-100 text-green-700'
                            : value === false
              ? 'bg-gray-100 text-gray-500'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {value === true ? 'On' : value === false ? 'Off' : String(value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          </div>
        )}

        {/* Back navigation */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FullViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="sr-only">Loading…</span></div>}>
      <FullViewInner />
    </Suspense>
  );
}
