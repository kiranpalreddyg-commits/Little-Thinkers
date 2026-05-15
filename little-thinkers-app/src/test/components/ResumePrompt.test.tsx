import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumePrompt } from '@/components/game/ResumePrompt';
import type { GameSession } from '@/lib/types/gameSession';

const MOCK_SESSION: GameSession = {
  gameType: 'word-pop',
  difficulty: 'medium',
  startedAt: '2026-05-14T10:00:00.000Z',
  pausedAt: '2026-05-14T10:05:00.000Z',
  progress: 42,
  isPaused: true,
};

describe('ResumePrompt', () => {
  it('shows the "saved game" message text (AC6)', () => {
    render(
      <ResumePrompt
        session={MOCK_SESSION}
        onResume={vi.fn()}
        onNewGame={vi.fn()}
      />,
    );
    expect(screen.getByText(/saved game/i)).toBeInTheDocument();
  });

  it('shows the "continue" message text (AC6)', () => {
    render(
      <ResumePrompt
        session={MOCK_SESSION}
        onResume={vi.fn()}
        onNewGame={vi.fn()}
      />,
    );
    expect(screen.getByText(/continue/i)).toBeInTheDocument();
  });

  it('displays the difficulty from the session capitalised (AC6)', () => {
    render(
      <ResumePrompt
        session={MOCK_SESSION}
        onResume={vi.fn()}
        onNewGame={vi.fn()}
      />,
    );
    expect(screen.getByText(/Medium/)).toBeInTheDocument();
  });

  it('displays the progress percentage from the session (AC6)', () => {
    render(
      <ResumePrompt
        session={MOCK_SESSION}
        onResume={vi.fn()}
        onNewGame={vi.fn()}
      />,
    );
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  it('calls onResume when the "Resume Game" button is clicked (AC7)', async () => {
    const onResume = vi.fn();
    render(
      <ResumePrompt
        session={MOCK_SESSION}
        onResume={onResume}
        onNewGame={vi.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Resume Game/i }),
    );
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('calls onNewGame when the "New Game" button is clicked (AC8)', async () => {
    const onNewGame = vi.fn();
    render(
      <ResumePrompt
        session={MOCK_SESSION}
        onResume={vi.fn()}
        onNewGame={onNewGame}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /New Game/i }));
    expect(onNewGame).toHaveBeenCalledTimes(1);
  });

  it('Resume Game button has an accessible label', () => {
    render(
      <ResumePrompt
        session={MOCK_SESSION}
        onResume={vi.fn()}
        onNewGame={vi.fn()}
      />,
    );
    const button = screen.getByRole('button', { name: /Resume Game/i });
    expect(button).toHaveAccessibleName(/Resume Game/i);
  });

  it('New Game button has an accessible label', () => {
    render(
      <ResumePrompt
        session={MOCK_SESSION}
        onResume={vi.fn()}
        onNewGame={vi.fn()}
      />,
    );
    const button = screen.getByRole('button', { name: /New Game/i });
    expect(button).toHaveAccessibleName(/New Game/i);
  });

  it('reflects a different difficulty when the session uses hard', () => {
    const hardSession: GameSession = { ...MOCK_SESSION, difficulty: 'hard' };
    render(
      <ResumePrompt
        session={hardSession}
        onResume={vi.fn()}
        onNewGame={vi.fn()}
      />,
    );
    expect(screen.getByText(/Hard/)).toBeInTheDocument();
  });
});
