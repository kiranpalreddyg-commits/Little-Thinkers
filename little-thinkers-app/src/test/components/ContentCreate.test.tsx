/**
 * Story 4.1 — RED tests: Create and submit content for review
 *
 * AC: content enters review workflow on submission;
 *     submission includes age range, cognitive skill, and accessibility metadata
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createContentItem, reviewContent, ContentItem } from '@/lib/utils/contentManager';

import ContentCreatePage from '@/app/(shell)/content-manager/create/page';

describe('ContentManager utils — Story 4.1', () => {
  it('AC: createContentItem sets status to submitted', () => {
    const item = createContentItem({
      type: 'tell-me-why',
      title: 'Why is the sky blue?',
      body: 'The sky is blue because of Rayleigh scattering.',
      ageMin: 7,
      ageMax: 12,
      cognitiveSkill: 'critical-thinking',
      accessibility: ['screen-reader'],
    });
    expect(item.status).toBe('submitted');
    expect(item.id).toBeTruthy();
  });

  it('AC: createContentItem includes all metadata fields', () => {
    const item = createContentItem({
      type: 'story-time',
      title: 'The Magic Forest',
      body: 'Once upon a time...',
      ageMin: 8,
      ageMax: 14,
      cognitiveSkill: 'creativity',
      accessibility: ['high-contrast', 'captions'],
    });
    expect(item.ageMin).toBe(8);
    expect(item.ageMax).toBe(14);
    expect(item.cognitiveSkill).toBe('creativity');
    expect(item.accessibility).toContain('high-contrast');
    expect(item.accessibility).toContain('captions');
    expect(item.type).toBe('story-time');
    expect(item.submittedAt).toBeTruthy();
  });
});

describe('ContentCreatePage — Story 4.1', () => {
  it('AC: shows content type, title, and body inputs', async () => {
    await act(async () => { render(<ContentCreatePage />); });
    expect(screen.getByTestId('content-type-select')).toBeInTheDocument();
    expect(screen.getByTestId('content-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('content-body-input')).toBeInTheDocument();
  });

  it('AC: shows age range, cognitive skill, and accessibility fields', async () => {
    await act(async () => { render(<ContentCreatePage />); });
    expect(screen.getByTestId('age-min-input')).toBeInTheDocument();
    expect(screen.getByTestId('age-max-input')).toBeInTheDocument();
    expect(screen.getByTestId('cognitive-skill-select')).toBeInTheDocument();
    expect(screen.getByTestId('accessibility-options')).toBeInTheDocument();
  });

  it('AC: submit button is disabled when title or body is empty', async () => {
    await act(async () => { render(<ContentCreatePage />); });
    const btn = screen.getByTestId('content-submit-button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('AC: submit button enables when title and body are filled', async () => {
    await act(async () => { render(<ContentCreatePage />); });
    fireEvent.change(screen.getByTestId('content-title-input'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByTestId('content-body-input'), { target: { value: 'Test body.' } });
    const btn = screen.getByTestId('content-submit-button') as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it('AC: submitting shows confirmation that content entered review', async () => {
    await act(async () => { render(<ContentCreatePage />); });
    fireEvent.change(screen.getByTestId('content-title-input'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByTestId('content-body-input'), { target: { value: 'Test body.' } });
    await act(async () => {
      fireEvent.click(screen.getByTestId('content-submit-button'));
    });
    expect(screen.getByTestId('submit-confirmation')).toBeInTheDocument();
  });
});
