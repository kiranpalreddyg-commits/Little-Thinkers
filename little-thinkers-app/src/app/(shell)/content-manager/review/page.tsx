'use client';

import { useState, useEffect } from 'react';
import { loadContentStore, saveContentStore, reviewContent, publishToLive, ContentItem } from '@/lib/utils/contentManager';

export default function ContentReviewPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setItems(loadContentStore());
  }, []);

  function handleReview(id: string, action: 'approve' | 'reject' | 'request-revision') {
    const updated = reviewContent(items, id, action, notes[id] ?? '');
    saveContentStore(updated);
    setItems(updated);
  }

  function handlePublish(id: string) {
    const updated = publishToLive(items, id);
    saveContentStore(updated);
    setItems(updated);
  }

  const pending = items.filter((i) => i.status === 'submitted' || i.status === 'under-review');
  const staging = items.filter((i) => i.status === 'staging');
  const live = items.filter((i) => i.status === 'live');
  const rejected = items.filter((i) => i.status === 'rejected' || i.status === 'revision-requested');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Review Queue</h1>

        {/* Pending */}
        <section data-testid="section-pending">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Pending Review ({pending.length})</h2>
          {pending.length === 0 && <p className="text-sm text-gray-400">No items pending review.</p>}
          {pending.map((item) => (
            <div key={item.id} data-testid={`review-item-${item.id}`} className="bg-white rounded-2xl border border-gray-200 p-5 mb-3 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.type} · Ages {item.ageMin}–{item.ageMax} · {item.cognitiveSkill}</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">{item.status}</span>
              </div>
              <p className="text-sm text-gray-600">{item.body}</p>
              <textarea
                placeholder="Optional review note…"
                data-testid={`review-note-${item.id}`}
                value={notes[item.id] ?? ''}
                onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid={`approve-button-${item.id}`}
                  onClick={() => handleReview(item.id, 'approve')}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  type="button"
                  data-testid={`revise-button-${item.id}`}
                  onClick={() => handleReview(item.id, 'request-revision')}
                  className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600"
                >
                  Request Revision
                </button>
                <button
                  type="button"
                  data-testid={`reject-button-${item.id}`}
                  onClick={() => handleReview(item.id, 'reject')}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Staging → Live */}
        <section data-testid="section-staging">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Staging ({staging.length})</h2>
          {staging.map((item) => (
            <div key={item.id} data-testid={`staging-item-${item.id}`} className="bg-white rounded-2xl border border-indigo-100 p-5 mb-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-400">{item.type}</p>
              </div>
              <button
                type="button"
                data-testid={`publish-button-${item.id}`}
                onClick={() => handlePublish(item.id)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"
              >
                Publish to Live
              </button>
            </div>
          ))}
        </section>

        {/* Live */}
        <section data-testid="section-live">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Live ({live.length})</h2>
          {live.map((item) => (
            <div key={item.id} data-testid={`live-item-${item.id}`} className="bg-green-50 rounded-2xl border border-green-200 p-5 mb-3">
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-xs text-green-600 font-semibold mt-1">Published {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}</p>
            </div>
          ))}
        </section>

        {/* Rejected / Revision Requested */}
        {rejected.length > 0 && (
          <section data-testid="section-rejected">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Rejected / Needs Revision ({rejected.length})</h2>
            {rejected.map((item) => (
              <div key={item.id} data-testid={`rejected-item-${item.id}`} className="bg-red-50 rounded-2xl border border-red-200 p-5 mb-3">
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-red-600 font-semibold mt-1">{item.status}</p>
                {item.reviewNote && <p className="text-xs text-gray-500 mt-1">Note: {item.reviewNote}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
