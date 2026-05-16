import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MascotWidget } from '@/components/progression/MascotWidget';
import type { MascotState } from '@/lib/types/progression';

const level1: MascotState = { childId: 'child-1', level: 1, experience: 0, accessories: [] };
const level2: MascotState = { childId: 'child-1', level: 2, experience: 25, accessories: ['glasses'] };
const level3: MascotState = { childId: 'child-1', level: 3, experience: 55, accessories: ['glasses', 'hat'] };

describe('MascotWidget', () => {
  it('shows "Level 1 Thinker" for a level 1 mascot (AC5)', () => {
    render(<MascotWidget mascot={level1} />);
    expect(screen.getByText(/Level 1 Thinker/i)).toBeInTheDocument();
  });

  it('shows "Level 2 Thinker" and the glasses accessory (AC5)', () => {
    render(<MascotWidget mascot={level2} />);
    expect(screen.getByText(/Level 2 Thinker/i)).toBeInTheDocument();
    expect(screen.getByText(/glasses/i)).toBeInTheDocument();
  });

  it('shows "Level 3 Thinker" with glasses and hat accessories (AC5)', () => {
    render(<MascotWidget mascot={level3} />);
    expect(screen.getByText(/Level 3 Thinker/i)).toBeInTheDocument();
    expect(screen.getByText(/glasses/i)).toBeInTheDocument();
    expect(screen.getByText(/hat/i)).toBeInTheDocument();
  });

  it('shows a loading state when mascot is null (AC5, AC7)', () => {
    render(<MascotWidget mascot={null} />);
    expect(screen.getByText(/Loading mascot/i)).toBeInTheDocument();
  });

  it('has an aria-label describing level and accessory count (AC5, AC7)', () => {
    const { container } = render(<MascotWidget mascot={level2} />);
    const labelled = container.querySelector('[aria-label]');
    expect(labelled).not.toBeNull();
    const label = labelled!.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/Level 2 Thinker/i);
    expect(label).toMatch(/1/); // 1 accessory
  });
});
