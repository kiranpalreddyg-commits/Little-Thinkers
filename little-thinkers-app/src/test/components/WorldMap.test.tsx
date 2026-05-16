import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { WorldMap } from '@/components/progression/WorldMap';
import type { WorldMapArea } from '@/lib/types/progression';

const areas: WorldMapArea[] = [
  { id: 'word-woods', name: 'Word Woods', isUnlocked: true, sparkThreshold: 0 },
  { id: 'math-mountains', name: 'Math Mountains', isUnlocked: true, sparkThreshold: 20 },
  { id: 'science-sea', name: 'Science Sea', isUnlocked: false, sparkThreshold: 50 },
  { id: 'art-archipelago', name: 'Art Archipelago', isUnlocked: false, sparkThreshold: 100 },
  { id: 'history-highlands', name: 'History Highlands', isUnlocked: false, sparkThreshold: 200 },
];

describe('WorldMap', () => {
  it('renders all 5 areas by name (AC2, AC3)', () => {
    render(<WorldMap areas={areas} />);
    expect(screen.getByText(/Word Woods/i)).toBeInTheDocument();
    expect(screen.getByText(/Math Mountains/i)).toBeInTheDocument();
    expect(screen.getByText(/Science Sea/i)).toBeInTheDocument();
    expect(screen.getByText(/Art Archipelago/i)).toBeInTheDocument();
    expect(screen.getByText(/History Highlands/i)).toBeInTheDocument();
  });

  it('renders an unlocked area as an interactive button (AC3)', () => {
    render(<WorldMap areas={areas} />);
    expect(screen.getByRole('button', { name: /Word Woods/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Math Mountains/i })).toBeInTheDocument();
  });

  it('shows "Locked" text for a locked area (AC2)', () => {
    render(<WorldMap areas={areas} />);
    const locks = screen.getAllByText(/Locked/i);
    // 3 locked areas: science-sea, art-archipelago, history-highlands
    expect(locks.length).toBeGreaterThanOrEqual(3);
  });

  it('locked area has an accessible label with the spark requirement (AC2)', () => {
    render(<WorldMap areas={areas} />);
    const lockedScience = screen.getByLabelText(/Science Sea — Locked, requires 50 Sparks/i);
    expect(lockedScience).toBeInTheDocument();
  });

  it('does not render locked areas as enabled buttons (AC2, AC3)', () => {
    render(<WorldMap areas={areas} />);
    expect(screen.queryByRole('button', { name: /^Science Sea$/i })).not.toBeInTheDocument();
  });

  it('wraps all areas in a nav with aria-label="World Map" (AC3)', () => {
    render(<WorldMap areas={areas} />);
    const nav = screen.getByRole('navigation', { name: /World Map/i });
    expect(nav).toBeInTheDocument();
    expect(within(nav).getByText(/Word Woods/i)).toBeInTheDocument();
  });
});
