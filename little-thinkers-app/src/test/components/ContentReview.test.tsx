/**
 * Story 4.2 — RED tests: Review, approve, and publish content through staging
 *
 * AC: reviewer can approve/revise/reject; approved content moves staging → live
 */

import { describe, it, expect } from 'vitest';
import { createContentItem, reviewContent, publishToLive } from '@/lib/utils/contentManager';

function makeItem() {
  return createContentItem({
    type: 'tell-me-why',
    title: 'Test',
    body: 'Body.',
    ageMin: 7,
    ageMax: 12,
    cognitiveSkill: 'memory',
    accessibility: [],
  });
}

describe('Content Review — Story 4.2', () => {
  it('AC: approving content moves it to staging', () => {
    const item = makeItem();
    const updated = reviewContent([item], item.id, 'approve');
    expect(updated[0].status).toBe('staging');
  });

  it('AC: rejecting content moves it to rejected', () => {
    const item = makeItem();
    const updated = reviewContent([item], item.id, 'reject');
    expect(updated[0].status).toBe('rejected');
  });

  it('AC: requesting revision sets status to revision-requested', () => {
    const item = makeItem();
    const updated = reviewContent([item], item.id, 'request-revision');
    expect(updated[0].status).toBe('revision-requested');
  });

  it('AC: review note is stored on the item', () => {
    const item = makeItem();
    const updated = reviewContent([item], item.id, 'reject', 'Needs more detail.');
    expect(updated[0].reviewNote).toBe('Needs more detail.');
  });

  it('AC: publishing staging content moves it to live', () => {
    const item = makeItem();
    const staged = reviewContent([item], item.id, 'approve');
    const live = publishToLive(staged, item.id);
    expect(live[0].status).toBe('live');
    expect(live[0].publishedAt).toBeTruthy();
  });

  it('AC: publishing a non-staging item has no effect', () => {
    const item = makeItem(); // status: submitted
    const result = publishToLive([item], item.id);
    expect(result[0].status).toBe('submitted');
  });

  it('AC: review sets reviewedAt timestamp', () => {
    const item = makeItem();
    const updated = reviewContent([item], item.id, 'approve');
    expect(updated[0].reviewedAt).toBeTruthy();
  });
});
