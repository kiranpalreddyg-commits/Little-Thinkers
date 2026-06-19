export type ContentType = 'tell-me-why' | 'story-time';
export type CognitiveSkill = 'critical-thinking' | 'creativity' | 'memory' | 'problem-solving' | 'language';
export type ContentStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'staging' | 'live' | 'rejected' | 'revision-requested';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  body: string;
  ageMin: number;
  ageMax: number;
  cognitiveSkill: CognitiveSkill;
  accessibility: string[];
  status: ContentStatus;
  abTestEnabled: boolean;
  tags: string[];
  engagementMetrics?: { views: number; completions: number; variantA: number; variantB: number };
  submittedAt?: string;
  reviewedAt?: string;
  publishedAt?: string;
  reviewNote?: string;
}

const CONTENT_STORE_KEY = 'lt_content_store';

export function loadContentStore(): ContentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CONTENT_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveContentStore(items: ContentItem[]): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(CONTENT_STORE_KEY, JSON.stringify(items)); } catch { /* quota */ }
}

export function createContentItem(
  fields: Omit<ContentItem, 'id' | 'status' | 'abTestEnabled' | 'tags' | 'submittedAt'>,
): ContentItem {
  return {
    ...fields,
    id: `content-${Date.now()}`,
    status: 'submitted',
    abTestEnabled: false,
    tags: [],
    submittedAt: new Date().toISOString(),
  };
}

export function reviewContent(
  items: ContentItem[],
  id: string,
  action: 'approve' | 'reject' | 'request-revision',
  note?: string,
): ContentItem[] {
  return items.map((item) => {
    if (item.id !== id) return item;
    const status: ContentStatus =
      action === 'approve' ? 'staging'
      : action === 'reject' ? 'rejected'
      : 'revision-requested';
    return { ...item, status, reviewNote: note ?? '', reviewedAt: new Date().toISOString() };
  });
}

export function publishToLive(items: ContentItem[], id: string): ContentItem[] {
  return items.map((item) =>
    item.id === id && item.status === 'staging'
      ? { ...item, status: 'live', publishedAt: new Date().toISOString() }
      : item,
  );
}

export function tagContent(items: ContentItem[], id: string, tag: string): ContentItem[] {
  return items.map((item) =>
    item.id === id ? { ...item, tags: [...new Set([...item.tags, tag])] } : item,
  );
}

export function enableAbTest(items: ContentItem[], id: string): ContentItem[] {
  return items.map((item) =>
    item.id === id
      ? { ...item, abTestEnabled: true, engagementMetrics: item.engagementMetrics ?? { views: 0, completions: 0, variantA: 0, variantB: 0 } }
      : item,
  );
}
