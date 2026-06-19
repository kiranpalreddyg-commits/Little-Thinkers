'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';
import type { ChildProfile } from '@/lib/types/auth';

interface ChildFormState {
  name: string;
  age: string;
  gameplay_mode: 'smart' | 'chill' | 'challenge';
  coppa_consented: boolean;
}

const EMPTY_FORM: ChildFormState = {
  name: '',
  age: '',
  gameplay_mode: 'smart',
  coppa_consented: false,
};

export default function ChildSetupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [enrolledChildren, setEnrolledChildren] = useState<ChildProfile[]>([]);
  const [form, setForm] = useState<ChildFormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const isFormValid =
    form.name.trim().length > 0 &&
    Number(form.age) >= 7 &&
    Number(form.age) <= 15 &&
    form.coppa_consented;

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const child = await apiClient.addChild(
        form.name.trim(),
        Number(form.age),
        form.gameplay_mode,
        form.coppa_consented,
      );
      posthog.capture('child_profile_created', {
        child_age: Number(form.age),
        gameplay_mode: form.gameplay_mode,
        coppa_consented: form.coppa_consented,
      });
      setEnrolledChildren((prev) => [...prev, child]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add child. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAddAnother() {
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function handleContinue() {
    router.push('/profile-select');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Your Child's Profile</h1>
          <p className="text-gray-600">
            Add one or more child profiles and provide consent for each.
          </p>
        </div>

        {/* Enrolled children list */}
        {enrolledChildren.length > 0 && (
          <ul className="mb-6 space-y-2">
            {enrolledChildren.map((child) => (
              <li
                key={child.id}
                className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200 flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">{child.name}</span>
                <span className="text-xs text-green-600 font-semibold">Consent granted ✓</span>
              </li>
            ))}
          </ul>
        )}

        {/* Add child form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-4">
            <form onSubmit={handleAddChild} className="space-y-4">
              <div>
                <label
                  htmlFor="child-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Child&rsquo;s Name
                </label>
                <input
                  id="child-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your child's name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-base"
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="child-age"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Age
                </label>
                <input
                  id="child-age"
                  type="number"
                  min={7}
                  max={15}
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                  required
                  disabled={isSubmitting}
                  placeholder="7–15"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="gameplay-mode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Learning Mode
                </label>
                <select
                  id="gameplay-mode"
                  value={form.gameplay_mode}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      gameplay_mode: e.target.value as 'smart' | 'chill' | 'challenge',
                    }))
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-base"
                >
                  <option value="smart">Smart (AI-adaptive)</option>
                  <option value="chill">Chill (relaxed pace)</option>
                  <option value="challenge">Challenge (harder content)</option>
                </select>
              </div>

              <label className="flex items-start cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.coppa_consented}
                  onChange={(e) => setForm((f) => ({ ...f, coppa_consented: e.target.checked }))}
                  disabled={isSubmitting}
                  aria-label="COPPA consent for this child"
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  I provide COPPA consent for this child to use Little Thinkers. I understand their
                  gameplay data will be used to personalise their learning experience.
                </span>
              </label>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-medium mt-2"
              >
                {isSubmitting ? 'Adding…' : 'Add Child'}
              </button>
            </form>
          </div>
        )}

        {/* Post-add actions */}
        {!showForm && enrolledChildren.length > 0 && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddAnother}
              className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-base font-medium"
            >
              Add Another Child
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-base font-medium"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
