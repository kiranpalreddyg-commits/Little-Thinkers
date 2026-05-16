import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StreakDisplay } from '@/components/progression/StreakDisplay';
import type { ThinkingStreak } from '@/lib/types/progression';

const streak: ThinkingStreak = {
  childId: 'child-1',
  currentStreak: 5,
  longestStreak: 9,
  lastActivityDate: '2026-05-15',
  pausedUntil: null,
};

describe('StreakDisplay', () => {
  it('shows "0-day streak" when streak is null (AC6, AC7)', () => {
    render(<StreakDisplay streak={null} />);
    expect(screen.getByText(/0-day streak/i)).toBeInTheDocument();
  });

  it('shows the current streak number (AC6, AC7)', () => {
    render(<StreakDisplay streak={streak} />);
    expect(screen.getByText(/5-day streak/i)).toBeInTheDocument();
  });

  it('has an aria-label describing the streak (AC7)', () => {
    const { container } = render(<StreakDisplay streak={streak} />);
    const labelled = container.querySelector('[aria-label]');
    expect(labelled).not.toBeNull();
    expect(labelled!.getAttribute('aria-label')).toMatch(/Thinking streak: 5 days/i);
  });

  it('aria-label reflects 0 days when streak is null (AC7)', () => {
    const { container } = render(<StreakDisplay streak={null} />);
    const labelled = container.querySelector('[aria-label]');
    expect(labelled).not.toBeNull();
    expect(labelled!.getAttribute('aria-label')).toMatch(/Thinking streak: 0 days/i);
  });
});
