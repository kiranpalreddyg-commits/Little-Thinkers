import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AnswerFeedback } from '@/components/rewards/AnswerFeedback';
import type { AnswerFeedback as AnswerFeedbackType } from '@/lib/types/rewards';

const correctFeedback: AnswerFeedbackType = {
  type: 'correct',
  message: 'Great thinking! +1 Spark ✨',
  sparksAwarded: 1,
};

const incorrectFeedback: AnswerFeedbackType = {
  type: 'incorrect',
  message: 'Nice try! Keep going 💪',
  sparksAwarded: 0,
};

describe('AnswerFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders an empty persistent live region when feedback is null (AC1, AC2)', () => {
    render(<AnswerFeedback feedback={null} onDismiss={vi.fn()} />);
    const el = screen.getByRole('status');
    expect(el).toBeInTheDocument();
    expect(el).toBeEmptyDOMElement();
  });

  it('renders correct feedback message (AC1)', () => {
    render(<AnswerFeedback feedback={correctFeedback} onDismiss={vi.fn()} />);
    expect(screen.getByText(/Great thinking/i)).toBeInTheDocument();
  });

  it('renders incorrect feedback message (AC2)', () => {
    render(<AnswerFeedback feedback={incorrectFeedback} onDismiss={vi.fn()} />);
    expect(screen.getByText(/Nice try/i)).toBeInTheDocument();
  });

  it('has role="status" for screen reader announcement (AC8)', () => {
    render(<AnswerFeedback feedback={correctFeedback} onDismiss={vi.fn()} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live="polite" on the status element (AC8)', () => {
    render(<AnswerFeedback feedback={correctFeedback} onDismiss={vi.fn()} />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  it('calls onDismiss after 2 seconds (AC1)', async () => {
    const onDismiss = vi.fn();
    render(<AnswerFeedback feedback={correctFeedback} onDismiss={onDismiss} />);
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(2000); });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss before 2 seconds (AC1)', async () => {
    const onDismiss = vi.fn();
    render(<AnswerFeedback feedback={correctFeedback} onDismiss={onDismiss} />);
    act(() => { vi.advanceTimersByTime(1999); });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('uses orange/amber color class for incorrect, not red (AC2, AC8)', () => {
    const { container } = render(
      <AnswerFeedback feedback={incorrectFeedback} onDismiss={vi.fn()} />,
    );
    // The container should NOT have any red-* Tailwind classes
    expect(container.innerHTML).not.toMatch(/\bbg-red-\d+\b/);
    expect(container.innerHTML).not.toMatch(/\btext-red-\d+\b/);
  });
});
