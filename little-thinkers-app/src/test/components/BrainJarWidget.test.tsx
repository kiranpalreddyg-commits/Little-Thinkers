import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrainJarWidget } from '@/components/rewards/BrainJarWidget';
import type { BrainJar } from '@/lib/types/rewards';

const fullJar: BrainJar = {
  childId: 'child-1',
  totalSparks: 12,
  capacity: 20,
  fillPercent: 60,
};

describe('BrainJarWidget', () => {
  it('renders "Brain Jar" label (AC5)', () => {
    render(<BrainJarWidget brainJar={fullJar} />);
    expect(screen.getByText(/Brain Jar/i)).toBeInTheDocument();
  });

  it('shows the spark count (AC5)', () => {
    render(<BrainJarWidget brainJar={fullJar} />);
    expect(screen.getByText(/12 Sparks/i)).toBeInTheDocument();
  });

  it('has role="progressbar" (AC5, AC8)', () => {
    render(<BrainJarWidget brainJar={fullJar} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow to fillPercent (AC5)', () => {
    render(<BrainJarWidget brainJar={fullJar} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');
  });

  it('sets aria-valuemin="0" and aria-valuemax="100" (AC8)', () => {
    render(<BrainJarWidget brainJar={fullJar} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('sets aria-label describing the jar state (AC8)', () => {
    render(<BrainJarWidget brainJar={fullJar} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-label', expect.stringMatching(/Brain Jar/i));
    expect(bar).toHaveAttribute('aria-label', expect.stringMatching(/12/));
    expect(bar).toHaveAttribute('aria-label', expect.stringMatching(/20/));
  });

  it('renders gracefully when brainJar is null (AC5)', () => {
    render(<BrainJarWidget brainJar={null} />);
    // Should not crash and should show 0 sparks / empty state
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('reflects updated fillPercent visually via inline style height on fill div (AC3)', () => {
    render(<BrainJarWidget brainJar={fullJar} />);
    const fill = document.querySelector('[data-testid="brain-jar-fill"]');
    expect(fill).toHaveStyle({ height: '60%' });
  });
});
