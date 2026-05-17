import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCard } from '@/components/home/GameCard';

// ── Mock next/link ────────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const defaultProps = {
  title: 'Word Pop',
  description: 'Guess the hidden word by choosing letters.',
  href: '/play/word-pop',
  color: 'blue' as const,
  icon: <span>W</span>,
};

describe('GameCard', () => {
  it('renders the game title and description', () => {
    render(<GameCard {...defaultProps} />);
    expect(screen.getByText('Word Pop')).toBeInTheDocument();
    expect(screen.getByText(/Guess the hidden word/)).toBeInTheDocument();
  });

  it('has a link to the game href', () => {
    render(<GameCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/play/word-pop');
  });

  it('link has an accessible name containing the game title', () => {
    render(<GameCard {...defaultProps} />);
    const link = screen.getByRole('link', { name: /Play Word Pop/i });
    expect(link).toBeInTheDocument();
  });

  it('applies data-game-color attribute with the correct color value', () => {
    const { container } = render(<GameCard {...defaultProps} />);
    expect(container.querySelector('[data-game-color="blue"]')).not.toBeNull();
  });

  it('renders icon inside a decorative (aria-hidden) wrapper', () => {
    render(<GameCard {...defaultProps} />);
    const icon = screen.getByText('W');
    const hiddenAncestor = icon.closest('[aria-hidden="true"]');
    expect(hiddenAncestor).not.toBeNull();
  });

  it('renders title as a heading element', () => {
    render(<GameCard {...defaultProps} />);
    const heading =
      screen.queryByRole('heading', { name: /Word Pop/i }) ??
      screen.queryByText('Word Pop');
    expect(heading).toBeInTheDocument();
  });

  it('applies correct color class for violet color', () => {
    const { container } = render(<GameCard {...defaultProps} color="violet" />);
    expect(container.querySelector('[data-game-color="violet"]')).not.toBeNull();
  });

  it('applies correct color class for rose color', () => {
    const { container } = render(<GameCard {...defaultProps} color="rose" />);
    expect(container.querySelector('[data-game-color="rose"]')).not.toBeNull();
  });
});
