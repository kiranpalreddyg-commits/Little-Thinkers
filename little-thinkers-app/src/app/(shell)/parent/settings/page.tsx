'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import posthog from 'posthog-js';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';
import { readChildDetailedView } from '@/lib/utils/parentDashboard';
import type { ChildProfile } from '@/lib/types/auth';

// ── localStorage keys ──────────────────────────────────────────────────────
const REPORT_SETTINGS_KEY = 'lt_report_settings_parent';
const DELETION_KEY = 'lt_deletion_request_parent';
const FRIEND_VISIBILITY_PREFIX = 'lt_friend_visibility_';

function loadFriendVisibility(childId: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(`${FRIEND_VISIBILITY_PREFIX}${childId}`);
    return raw === null ? true : raw === 'true';
  } catch { return true; }
}

function saveFriendVisibility(childId: string, visible: boolean) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`${FRIEND_VISIBILITY_PREFIX}${childId}`, String(visible)); } catch { /* quota */ }
}

interface ReportSettings { cadence: 'weekly' | 'monthly' | 'quarterly'; detailLevel: 'summary' | 'detailed' }
interface DeletionRequest { requestedAt: string; completesAt: string }

function loadReportSettings(): ReportSettings {
  if (typeof window === 'undefined') return { cadence: 'weekly', detailLevel: 'summary' };
  try {
    const raw = localStorage.getItem(REPORT_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { cadence: 'weekly', detailLevel: 'summary' };
  } catch { return { cadence: 'weekly', detailLevel: 'summary' }; }
}

function saveReportSettings(s: ReportSettings) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(REPORT_SETTINGS_KEY, JSON.stringify(s)); } catch { /* quota/private */ }
}

function loadDeletion(): DeletionRequest | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DELETION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveDeletion(req: DeletionRequest) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(DELETION_KEY, JSON.stringify(req)); } catch { /* quota/private */ }
}

function generateExport(child: ChildProfile): string {
  const detail = readChildDetailedView(child.id, child.name);
  const payload = {
    exportedAt: new Date().toISOString(),
    child: { id: child.id, name: child.name, age: child.age, gameplay_mode: child.gameplay_mode },
    sparks: { totalSparks: detail.totalSparks },
    badges: detail.badges,
    worldAreas: detail.worldAreas,
    streak: { currentStreak: detail.currentStreak, longestStreak: detail.longestStreak },
    skills: detail.skills,
    quarterlyAssessments: detail.quarterlyAssessments,
  };
  return JSON.stringify(payload, null, 2);
}

function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ParentSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportSettings, setReportSettings] = useState<ReportSettings>({ cadence: 'weekly', detailLevel: 'summary' });
  const [deletion, setDeletion] = useState<DeletionRequest | null>(null);
  const [childEdits, setChildEdits] = useState<Record<string, { name: string; age: string; gameplay_mode: string }>>({});
  const [savedFlags, setSavedFlags] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [friendVisibility, setFriendVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    setReportSettings(loadReportSettings());
    setDeletion(loadDeletion());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient.getChildren()
      .then((profiles) => {
        setChildren(profiles);
        const edits: Record<string, { name: string; age: string; gameplay_mode: string }> = {};
        const fv: Record<string, boolean> = {};
        profiles.forEach((p) => {
          edits[p.id] = { name: p.name, age: String(p.age), gameplay_mode: p.gameplay_mode };
          fv[p.id] = loadFriendVisibility(p.id);
        });
        setChildEdits(edits);
        setFriendVisibility(fv);
      })
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const handleCadenceChange = useCallback((cadence: ReportSettings['cadence']) => {
    const next = { ...reportSettings, cadence };
    setReportSettings(next);
    saveReportSettings(next);
  }, [reportSettings]);

  const handleDetailChange = useCallback((detailLevel: ReportSettings['detailLevel']) => {
    const next = { ...reportSettings, detailLevel };
    setReportSettings(next);
    saveReportSettings(next);
  }, [reportSettings]);

  const handleExport = useCallback((child: ChildProfile) => {
    const content = generateExport(child);
    triggerDownload(content, `little-thinkers-${child.name.toLowerCase()}-report.json`);
    posthog.capture('parent_data_exported', { child_id: child.id, child_age: child.age });
  }, []);

  const handlePrintCertificate = useCallback((child: ChildProfile) => {
    const detail = readChildDetailedView(child.id, child.name);
    const certWindow = window.open('', '_blank', 'width=800,height=600');
    if (certWindow) {
      certWindow.document.write(`
        <html><head><title>Certificate — ${child.name}</title>
        <style>body{font-family:sans-serif;text-align:center;padding:60px;}
        h1{font-size:2.5rem;color:#7C3AED;}
        .badge{display:inline-block;margin:8px;padding:8px 16px;background:#EDE9FE;border-radius:9999px;font-size:.9rem;}</style>
        </head><body>
        <h1>Achievement Certificate</h1>
        <p style="font-size:1.2rem;">Awarded to <strong>${child.name}</strong></p>
        <p>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <p>${detail.badges.map((b) => `<span class="badge">${b.name}</span>`).join('') || '<em>Keep playing to earn badges!</em>'}</p>
        <p style="margin-top:40px;color:#7C3AED;font-weight:bold;">Little Thinkers</p>
        </body></html>
      `);
      certWindow.document.close();
      certWindow.print();
    } else {
      window.print();
    }
    posthog.capture('parent_certificate_printed', { child_id: child.id, child_age: child.age });
  }, []);

  const handleRequestDeletion = useCallback(() => {
    const requestedAt = new Date().toISOString();
    const completesAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const req = { requestedAt, completesAt };
    saveDeletion(req);
    setDeletion(req);
    posthog.capture('parent_account_deletion_requested');
  }, []);

  const handleChildFieldChange = useCallback(
    (childId: string, field: 'name' | 'age' | 'gameplay_mode', value: string) => {
      setChildEdits((prev) => ({ ...prev, [childId]: { ...prev[childId], [field]: value } }));
      setSavedFlags((prev) => ({ ...prev, [childId]: false }));
    }, [],
  );

  const handleFriendVisibilityToggle = useCallback((childId: string) => {
    setFriendVisibility((prev) => {
      const next = { ...prev, [childId]: !prev[childId] };
      saveFriendVisibility(childId, next[childId]);
      return next;
    });
  }, []);

  const handleSaveChild = useCallback(async (childId: string) => {
    const edits = childEdits[childId];
    if (!edits) return;
    setSaving((prev) => ({ ...prev, [childId]: true }));
    try {
      await apiClient.updateChild(childId, {
        name: edits.name,
        age: Number(edits.age),
        gameplay_mode: edits.gameplay_mode as 'smart' | 'chill' | 'challenge',
      });
      posthog.capture('child_profile_updated', { child_id: childId, gameplay_mode: edits.gameplay_mode });
      setSavedFlags((prev) => ({ ...prev, [childId]: true }));
    } finally {
      setSaving((prev) => ({ ...prev, [childId]: false }));
    }
  }, [childEdits]);

  if (authLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><span className="sr-only">Loading…</span></div>;
  }

  const completesAt = deletion ? new Date(deletion.completesAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Parent Settings</h1>
          <Link href="/parent/dashboard" className="text-sm text-[var(--color-brand)] font-medium hover:underline">← Quick View</Link>
        </div>

        {/* ── Reports & Export (AC1 + AC3) ─────────────────────────────────── */}
        <section data-testid="section-reports" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Reports &amp; Export</h2>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="report-cadence" className="block text-xs font-semibold text-gray-500 mb-1">Report Cadence</label>
              <select
                id="report-cadence"
                data-testid="report-cadence-select"
                value={reportSettings.cadence}
                onChange={(e) => handleCadenceChange(e.target.value as ReportSettings['cadence'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand)]"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label htmlFor="report-detail" className="block text-xs font-semibold text-gray-500 mb-1">Detail Level</label>
              <select
                id="report-detail"
                data-testid="report-detail-select"
                value={reportSettings.detailLevel}
                onChange={(e) => handleDetailChange(e.target.value as ReportSettings['detailLevel'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand)]"
              >
                <option value="summary">Summary</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Download Report</p>
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                data-testid={`export-button-${child.id}`}
                onClick={() => handleExport(child)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                <span>{child.name}&apos;s Report</span>
                <span className="text-xs text-[var(--color-brand)] font-semibold">Download JSON ↓</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Certificates (AC2) ───────────────────────────────────────────── */}
        <section data-testid="section-certificates" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Achievement Certificates</h2>
          <div className="space-y-2">
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                data-testid={`print-certificate-${child.id}`}
                onClick={() => handlePrintCertificate(child)}
                className="w-full flex items-center justify-between px-4 py-3 bg-violet-50 hover:bg-violet-100 rounded-xl text-sm font-medium text-violet-700 transition-colors"
              >
                <span>{child.name}&apos;s Certificate</span>
                <span className="text-xs font-semibold">Print 🖨️</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Child Profile Settings (AC5) ──────────────────────────────────── */}
        <section data-testid="section-child-settings" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Child Profile Settings</h2>
          <div className="space-y-6">
            {children.map((child) => {
              const edits = childEdits[child.id] ?? { name: child.name, age: String(child.age), gameplay_mode: child.gameplay_mode };
              return (
                <div key={child.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">{child.name}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`name-${child.id}`} className="block text-xs text-gray-500 mb-1">Name</label>
                      <input
                        id={`name-${child.id}`}
                        type="text"
                        data-testid={`child-name-input-${child.id}`}
                        value={edits.name}
                        onChange={(e) => handleChildFieldChange(child.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand)]"
                      />
                    </div>
                    <div>
                      <label htmlFor={`age-${child.id}`} className="block text-xs text-gray-500 mb-1">Age</label>
                      <input
                        id={`age-${child.id}`}
                        type="number"
                        min={7}
                        max={15}
                        data-testid={`child-age-input-${child.id}`}
                        value={edits.age}
                        onChange={(e) => handleChildFieldChange(child.id, 'age', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`mode-${child.id}`} className="block text-xs text-gray-500 mb-1">Learning Mode</label>
                    <select
                      id={`mode-${child.id}`}
                      data-testid={`child-mode-select-${child.id}`}
                      value={edits.gameplay_mode}
                      onChange={(e) => handleChildFieldChange(child.id, 'gameplay_mode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand)]"
                    >
                      <option value="smart">Smart (AI-adaptive)</option>
                      <option value="chill">Chill</option>
                      <option value="challenge">Challenge</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      data-testid={`child-settings-save-${child.id}`}
                      disabled={saving[child.id]}
                      onClick={() => handleSaveChild(child.id)}
                      className="px-4 py-2 bg-[var(--color-brand)] text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {saving[child.id] ? 'Saving…' : 'Save'}
                    </button>
                    {savedFlags[child.id] && (
                      <span data-testid={`child-settings-saved-${child.id}`} className="text-xs text-green-600 font-semibold">
                        Saved ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Friend Visibility (Story 2.5 AC2) ────────────────────────────── */}
        <section data-testid="section-friend-visibility" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Friend Feature Visibility</h2>
          <p className="text-sm text-gray-500 mb-4">Control whether the friend feature is visible to each child.</p>
          <div className="space-y-3">
            {children.map((child) => (
              <div key={child.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">{child.name}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    data-testid={`friend-visibility-toggle-${child.id}`}
                    checked={!!friendVisibility[child.id]}
                    onChange={() => handleFriendVisibilityToggle(child.id)}
                    className="w-4 h-4 accent-[var(--color-brand)]"
                  />
                  <span className="text-xs text-gray-500">{friendVisibility[child.id] ? 'Visible' : 'Hidden'}</span>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* ── Account Deletion (AC4) ────────────────────────────────────────── */}
        <section data-testid="section-account" className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Account Management</h2>
          <p className="text-sm text-gray-500 mb-4">
            Requesting account deletion will permanently remove all data after a 30-day review period.
          </p>

          {deletion ? (
            <div data-testid="deletion-status" className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-amber-800">Deletion request pending</p>
              <p className="text-xs text-amber-600 mt-1">
                Your account and all data will be deleted on {completesAt} (30-day SLA).
              </p>
            </div>
          ) : (
            <button
              type="button"
              data-testid="deletion-request-button"
              onClick={handleRequestDeletion}
              className="px-4 py-2 border border-red-300 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors"
            >
              Request Account Deletion
            </button>
          )}
        </section>

      </div>
    </div>
  );
}
