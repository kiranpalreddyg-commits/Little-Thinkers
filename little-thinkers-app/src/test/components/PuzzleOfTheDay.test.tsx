import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PuzzleOfTheDay } from '@/components/home/PuzzleOfTheDay';
import { DailyPuzzle } from '@/lib/types/content';

const MOCK_PUZZLE: DailyPuzzle = {
  id: 'puzzle-today',
  type: 'word-pop',
  difficulty: 'medium',
  hint: 'A 5-letter word for something that shines at night',
  createdAt: '2026-05-13T00:00:00Z',
};

describe('PuzzleOfTheDay', () => {
  it('shows loading skeleton with aria-busy when puzzle is null', () => {
    const { container } = render(<PuzzleOfTheDay puzzle={null} onStart={vi.fn()} />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(screen.queryByText(/Today's Puzzle/i)).not.toBeInTheDocument();
  });

  it('renders heading and puzzle type when loaded', () => {
    render(<PuzzleOfTheDay puzzle={MOCK_PUZZLE} onStart={vi.fn()} />);
    expect(screen.getByText(/Today's Puzzle/i)).toBeInTheDocument();
    expect(screen.getByText(/word pop/i)).toBeInTheDocument();
  });

  it('renders medium difficulty badge', () => {
    render(<PuzzleOfTheDay puzzle={MOCK_PUZZLE} onStart={vi.fn()} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders easy difficulty badge with green color class', () => {
    render(<PuzzleOfTheDay puzzle={{ ...MOCK_PUZZLE, difficulty: 'easy' }} onStart={vi.fn()} />);
    const badge = screen.getByText('Easy');
    expect(badge.className).toContain('green');
  });

  it('renders hard difficulty badge', () => {
    render(<PuzzleOfTheDay puzzle={{ ...MOCK_PUZZLE, difficulty: 'hard' }} onStart={vi.fn()} />);
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('shows hint text when hint is provided', () => {
    render(<PuzzleOfTheDay puzzle={MOCK_PUZZLE} onStart={vi.fn()} />);
    expect(screen.getByText(/A 5-letter word for something that shines at night/i)).toBeInTheDocument();
  });

  it('does not show hint section when hint is absent', () => {
    const { hint: _hint, ...puzzleNoHint } = MOCK_PUZZLE;
    render(<PuzzleOfTheDay puzzle={puzzleNoHint} onStart={vi.fn()} />);
    expect(screen.queryByText(/A 5-letter/i)).not.toBeInTheDocument();
  });

  it('calls onStart when Play Now button is clicked', async () => {
    const onStart = vi.fn();
    render(<PuzzleOfTheDay puzzle={MOCK_PUZZLE} onStart={onStart} />);
    await userEvent.click(screen.getByRole('button', { name: /Start today's puzzle/i }));
    expect(onStart).toHaveBeenCalledOnce();
  });
});
