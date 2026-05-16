import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BadgeNotification } from '@/components/progression/BadgeNotification';
import type { Badge } from '@/lib/types/progression';

const badge: Badge = {
  id: 'b1',
  childId: 'child-1',
  badgeType: 'first-correct',
  name: 'First Spark!',
  description: 'You got your first correct answer — brilliant start!',
  earnedAt: '2026-05-01T10:00:00.000Z',
};

afterEach(() => {
  vi.useRealTimers();
});

describe('BadgeNotification', () => {
  it('renders the "You earned a badge!" heading (AC1)', () => {
    render(<BadgeNotification badge={badge} onDismiss={vi.fn()} />);
    expect(screen.getByText(/You earned a badge!/i)).toBeInTheDocument();
  });

  it('renders the badge name (AC1)', () => {
    render(<BadgeNotification badge={badge} onDismiss={vi.fn()} />);
    expect(screen.getByText('First Spark!')).toBeInTheDocument();
  });

  it('renders the badge description (AC1)', () => {
    render(<BadgeNotification badge={badge} onDismiss={vi.fn()} />);
    expect(screen.getByText('You got your first correct answer — brilliant start!')).toBeInTheDocument();
  });

  it('has role="dialog" and aria-modal="true" (AC1)', () => {
    render(<BadgeNotification badge={badge} onDismiss={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby pointing at the badge name heading (AC1)', () => {
    render(<BadgeNotification badge={badge} onDismiss={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const labelEl = document.getElementById(labelledBy!);
    expect(labelEl).toHaveTextContent('First Spark!');
  });

  it('renders a dismiss button (AC1)', () => {
    render(<BadgeNotification badge={badge} onDismiss={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Got it!|Celebrate!/i })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button clicked (AC1)', async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<BadgeNotification badge={badge} onDismiss={onDismiss} />);
    await user.click(screen.getByRole('button', { name: /Got it!|Celebrate!/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss automatically after 4 seconds (AC1)', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<BadgeNotification badge={badge} onDismiss={onDismiss} />);
    vi.advanceTimersByTime(4000);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onDismiss before 4 seconds elapse (AC1)', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<BadgeNotification badge={badge} onDismiss={onDismiss} />);
    vi.advanceTimersByTime(3999);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
