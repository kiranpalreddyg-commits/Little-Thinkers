import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DifficultySelector } from '@/components/play/DifficultySelector';
import { Difficulty } from '@/lib/types/content';

const ALL_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

describe('DifficultySelector', () => {
  it('renders a radio for every available difficulty', () => {
    render(
      <DifficultySelector
        difficulties={ALL_DIFFICULTIES}
        selected="easy"
        onSelect={vi.fn()}
      />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('renders accessible labels for Easy, Medium and Hard', () => {
    render(
      <DifficultySelector
        difficulties={ALL_DIFFICULTIES}
        selected="easy"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByRole('radio', { name: /Easy/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Medium/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Hard/i })).toBeInTheDocument();
  });

  it('only renders the difficulties passed in via props', () => {
    render(
      <DifficultySelector
        difficulties={['easy', 'medium']}
        selected="easy"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByRole('radio', { name: /Easy/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Medium/i })).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: /Hard/i })).not.toBeInTheDocument();
  });

  it('marks the currently selected difficulty as checked', () => {
    render(
      <DifficultySelector
        difficulties={ALL_DIFFICULTIES}
        selected="medium"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByRole('radio', { name: /Easy/i })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: /Medium/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /Hard/i })).not.toBeChecked();
  });

  it('calls onSelect with the new difficulty when a different option is clicked', async () => {
    const onSelect = vi.fn();
    render(
      <DifficultySelector
        difficulties={ALL_DIFFICULTIES}
        selected="easy"
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByRole('radio', { name: /Hard/i }));
    expect(onSelect).toHaveBeenCalledWith('hard');
  });

  it('calls onSelect when clicking the medium option', async () => {
    const onSelect = vi.fn();
    render(
      <DifficultySelector
        difficulties={ALL_DIFFICULTIES}
        selected="easy"
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByRole('radio', { name: /Medium/i }));
    expect(onSelect).toHaveBeenCalledWith('medium');
  });

  it('exposes a radiogroup with an accessible label', () => {
    render(
      <DifficultySelector
        difficulties={ALL_DIFFICULTIES}
        selected="easy"
        onSelect={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('radiogroup', { name: /Choose Difficulty/i }),
    ).toBeInTheDocument();
  });
});
