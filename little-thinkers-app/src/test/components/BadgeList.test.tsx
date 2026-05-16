import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BadgeList } from '@/components/progression/BadgeList';
import type { Badge } from '@/lib/types/progression';

const badges: Badge[] = [
  {
    id: 'b1',
    childId: 'child-1',
    badgeType: 'first-correct',
    name: 'First Spark!',
    description: 'You got your first correct answer — brilliant start!',
    earnedAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'b2',
    childId: 'child-1',
    badgeType: 'ten-correct',
    name: 'Spark Collector',
    description: 'You answered 10 questions correctly — great thinking!',
    earnedAt: '2026-05-02T10:00:00.000Z',
  },
  {
    id: 'b3',
    childId: 'child-1',
    badgeType: 'explorer',
    name: 'Explorer',
    description: 'You unlocked a new world area — adventure awaits!',
    earnedAt: '2026-05-03T10:00:00.000Z',
  },
];

describe('BadgeList', () => {
  it('renders each badge name (AC1)', () => {
    render(<BadgeList badges={badges} />);
    expect(screen.getByText('First Spark!')).toBeInTheDocument();
    expect(screen.getByText('Spark Collector')).toBeInTheDocument();
    expect(screen.getByText('Explorer')).toBeInTheDocument();
  });

  it('renders each badge description explaining why it was earned (AC1)', () => {
    render(<BadgeList badges={badges} />);
    expect(screen.getByText('You got your first correct answer — brilliant start!')).toBeInTheDocument();
    expect(screen.getByText('You answered 10 questions correctly — great thinking!')).toBeInTheDocument();
    expect(screen.getByText('You unlocked a new world area — adventure awaits!')).toBeInTheDocument();
  });

  it('shows an empty state message when no badges (AC1)', () => {
    render(<BadgeList badges={[]} />);
    expect(screen.getByText(/No badges yet/i)).toBeInTheDocument();
  });

  it('uses role="list" container (AC1)', () => {
    render(<BadgeList badges={badges} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders one listitem per badge (AC1)', () => {
    render(<BadgeList badges={badges} />);
    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });
});
