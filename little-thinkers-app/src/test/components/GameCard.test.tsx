import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameCard } from '@/components/home/GameCard';
import { Game } from '@/lib/types/content';

const mockGame: Game = {
  type: 'word-pop',
  name: 'Word Pop',
  description: 'Guess the hidden word by choosing letters.',
  themedArea: 'Word Woods',
  cognitiveSkill: 'vocabulary',
  bloomsLevel: 'apply',
  difficulties: ['easy', 'medium', 'hard'],
};

describe('GameCard', () => {
  it('renders the game name and description', () => {
    render(<GameCard game={mockGame} onSelect={vi.fn()} />);
    expect(screen.getByText('Word Pop')).toBeInTheDocument();
    expect(screen.getByText(/Guess the hidden word/)).toBeInTheDocument();
  });

  it('shows the cognitive skill badge', () => {
    render(<GameCard game={mockGame} onSelect={vi.fn()} />);
    expect(screen.getByText('Vocabulary')).toBeInTheDocument();
  });

  it('shows the themed area badge', () => {
    render(<GameCard game={mockGame} onSelect={vi.fn()} />);
    expect(screen.getByText('Word Woods')).toBeInTheDocument();
  });

  it('calls onSelect with game type on click', async () => {
    const onSelect = vi.fn();
    render(<GameCard game={mockGame} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Play Word Pop/i }));
    expect(onSelect).toHaveBeenCalledWith('word-pop');
  });

  it('calls onSelect on Enter key press', async () => {
    const onSelect = vi.fn();
    render(<GameCard game={mockGame} onSelect={onSelect} />);
    const card = screen.getByRole('button', { name: /Play Word Pop/i });
    card.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('word-pop');
  });

  it('calls onSelect on Space key press', async () => {
    const onSelect = vi.fn();
    render(<GameCard game={mockGame} onSelect={onSelect} />);
    const card = screen.getByRole('button', { name: /Play Word Pop/i });
    card.focus();
    await userEvent.keyboard(' ');
    expect(onSelect).toHaveBeenCalledWith('word-pop');
  });

  it('has an accessible aria-label', () => {
    render(<GameCard game={mockGame} onSelect={vi.fn()} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('Word Pop'));
  });

  it('is keyboard focusable (tabIndex=0)', () => {
    render(<GameCard game={mockGame} onSelect={vi.fn()} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabindex', '0');
  });
});
