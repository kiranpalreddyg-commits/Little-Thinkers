/**
 * Story 4.3 — RED tests: Tag content and A/B test with engagement tracking
 *
 * AC: content can be tagged by cognitive skill; A/B test enables engagement metrics
 */

import { describe, it, expect } from 'vitest';
import { createContentItem, tagContent, enableAbTest, reviewContent, publishToLive } from '@/lib/utils/contentManager';

function makeItem() {
  return createContentItem({
    type: 'story-time',
    title: 'Forest Friends',
    body: 'Once upon a time…',
    ageMin: 7,
    ageMax: 10,
    cognitiveSkill: 'creativity',
    accessibility: [],
  });
}

describe('Content Tagging & A/B Tests — Story 4.3', () => {
  it('AC: tagging content adds the tag to the item', () => {
    const item = makeItem();
    const tagged = tagContent([item], item.id, 'critical-thinking');
    expect(tagged[0].tags).toContain('critical-thinking');
  });

  it('AC: multiple tags can be added without duplicates', () => {
    const item = makeItem();
    let items = tagContent([item], item.id, 'creativity');
    items = tagContent(items, item.id, 'creativity');
    items = tagContent(items, item.id, 'memory');
    expect(items[0].tags).toHaveLength(2);
    expect(items[0].tags).toContain('creativity');
    expect(items[0].tags).toContain('memory');
  });

  it('AC: enabling A/B test sets abTestEnabled to true', () => {
    const item = makeItem();
    const abEnabled = enableAbTest([item], item.id);
    expect(abEnabled[0].abTestEnabled).toBe(true);
  });

  it('AC: A/B test initialises engagement metrics', () => {
    const item = makeItem();
    const abEnabled = enableAbTest([item], item.id);
    expect(abEnabled[0].engagementMetrics).toBeDefined();
    expect(abEnabled[0].engagementMetrics?.views).toBe(0);
    expect(abEnabled[0].engagementMetrics?.variantA).toBe(0);
    expect(abEnabled[0].engagementMetrics?.variantB).toBe(0);
  });

  it('AC: engagement metrics have variantA and variantB for comparison', () => {
    const item = makeItem();
    const abEnabled = enableAbTest([item], item.id);
    const metrics = abEnabled[0].engagementMetrics!;
    expect('variantA' in metrics).toBe(true);
    expect('variantB' in metrics).toBe(true);
  });
});
