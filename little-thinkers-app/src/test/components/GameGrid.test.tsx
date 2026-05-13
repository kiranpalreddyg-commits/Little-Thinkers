import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameGrid } from '@/components/home/GameGrid';
import { Game } from '@/lib/types/content';

const MOCK_GAMES: Game[] = [
  { type: 'word-pop', name: 'Word Pop', description: 'Guess the word.', themedArea: 'Word Woods', cognitiveSkill: 'vocabulary', bloomsLevel: 'apply', difficulties: ['easy'] },
  { type: 'connection-quest', name: 'Connection Quest', description: 'Find connections.', themedArea: 'Connection Canyon', cognitiveSkill: 'logic', bloomsLevel: 'analyze', difficulties: ['easy'] },
  { type: 'memory-flip', name: 'Memory Flip', description: 'Flip cards.', themedArea: 'Memory Marsh', cognitiveSkill: 'memory', bloomsLevel: 'remember', difficulties: ['easy'] },
  { type: 'pattern-builder', name: 'Pattern Builder', description: 'Build patterns.', themedArea: 'Pattern Peaks', cognitiveSkill: 'pattern-recognition', bloomsLevel: 'apply', difficulties: ['easy'] },
  { type: 'grid-logic', name: 'Grid Logic', description: 'Solve logic puzzles.', themedArea: 'Logic Lab', cognitiveSkill: 'logic', bloomsLevel: 'evaluate', difficulties: ['easy'] },
];

describe('GameGrid', () => {
  it('renders skeletons while games are loading', () => {
    render(<GameGrid games={[]} onGameSelect={vi.fn()} />);
    expect(screen.getByLabelText('Loading games')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders all 5 games when loaded', () => {
    render(<GameGrid games={MOCK_GAMES} onGameSelect={vi.fn()} />);
    expect(screen.getByText('Word Pop')).toBeInTheDocument();
    expect(screen.getByText('Connection Quest')).toBeInTheDocument();
    expect(screen.getByText('Memory Flip')).toBeInTheDocument();
    expect(screen.getByText('Pattern Builder')).toBeInTheDocument();
    expect(screen.getByText('Grid Logic')).toBeInTheDocument();
  });

  it('uses a list with accessible label', () => {
    render(<GameGrid games={MOCK_GAMES} onGameSelect={vi.fn()} />);
    expect(screen.getByRole('list', { name: /Available games/i })).toBeInTheDocument();
  });

  it('renders each game as a list item', () => {
    render(<GameGrid games={MOCK_GAMES} onGameSelect={vi.fn()} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
  });
});
