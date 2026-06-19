'use client';

import { useState } from 'react';
import { createContentItem, loadContentStore, saveContentStore, ContentType, CognitiveSkill } from '@/lib/utils/contentManager';

const COGNITIVE_SKILLS: CognitiveSkill[] = ['critical-thinking', 'creativity', 'memory', 'problem-solving', 'language'];
const ACCESSIBILITY_OPTIONS = ['screen-reader', 'high-contrast', 'large-text', 'captions'];

export default function ContentCreatePage() {
  const [type, setType] = useState<ContentType>('tell-me-why');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [ageMin, setAgeMin] = useState('7');
  const [ageMax, setAgeMax] = useState('15');
  const [cognitiveSkill, setCognitiveSkill] = useState<CognitiveSkill>('critical-thinking');
  const [accessibility, setAccessibility] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const isValid = title.trim() && body.trim();

  function toggleAccessibility(option: string) {
    setAccessibility((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    const item = createContentItem({
      type,
      title: title.trim(),
      body: body.trim(),
      ageMin: Number(ageMin),
      ageMax: Number(ageMax),
      cognitiveSkill,
      accessibility,
    });
    const store = loadContentStore();
    store.push(item);
    saveContentStore(store);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Content</h1>

        {submitted ? (
          <div data-testid="submit-confirmation" className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <p className="text-lg font-semibold text-green-800">Content submitted for review!</p>
            <p className="text-sm text-green-600 mt-1">Your submission has entered the review workflow.</p>
            <button
              type="button"
              data-testid="create-another"
              onClick={() => {
                setTitle(''); setBody(''); setSubmitted(false); setAccessibility([]);
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
            >
              Create Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} data-testid="content-create-form" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <label htmlFor="content-type" className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <select
                id="content-type"
                data-testid="content-type-select"
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="tell-me-why">Tell Me Why</option>
                <option value="story-time">Story Time</option>
              </select>
            </div>

            <div>
              <label htmlFor="content-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="content-title"
                type="text"
                data-testid="content-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="content-body" className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <textarea
                id="content-body"
                data-testid="content-body-input"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age-min" className="block text-sm font-medium text-gray-700 mb-1">Age Min</label>
                <input
                  id="age-min"
                  type="number"
                  data-testid="age-min-input"
                  min={7}
                  max={15}
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="age-max" className="block text-sm font-medium text-gray-700 mb-1">Age Max</label>
                <input
                  id="age-max"
                  type="number"
                  data-testid="age-max-input"
                  min={7}
                  max={15}
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cognitive-skill" className="block text-sm font-medium text-gray-700 mb-1">Cognitive Skill</label>
              <select
                id="cognitive-skill"
                data-testid="cognitive-skill-select"
                value={cognitiveSkill}
                onChange={(e) => setCognitiveSkill(e.target.value as CognitiveSkill)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                {COGNITIVE_SKILLS.map((s) => (
                  <option key={s} value={s}>{s.replace('-', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Accessibility Features</p>
              <div className="flex flex-wrap gap-2" data-testid="accessibility-options">
                {ACCESSIBILITY_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      data-testid={`accessibility-${option}`}
                      checked={accessibility.includes(option)}
                      onChange={() => toggleAccessibility(option)}
                      className="w-4 h-4 accent-purple-600"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              data-testid="content-submit-button"
              disabled={!isValid}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-40 transition-colors"
            >
              Submit for Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
