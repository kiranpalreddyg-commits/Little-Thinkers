import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstructionsPanel } from '@/components/play/InstructionsPanel';

const GAME_NAME = 'Word Pop';
const INSTRUCTIONS =
  'Pop the balloons that spell out the hidden word. Tap each letter in the correct order to win!';

describe('InstructionsPanel', () => {
  it('renders the game name as a heading', () => {
    render(
      <InstructionsPanel
        gameName={GAME_NAME}
        instructions={INSTRUCTIONS}
        acknowledged={false}
        onAcknowledge={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('heading', { name: /Word Pop/i }),
    ).toBeInTheDocument();
  });

  it('renders the instructions text', () => {
    render(
      <InstructionsPanel
        gameName={GAME_NAME}
        instructions={INSTRUCTIONS}
        acknowledged={false}
        onAcknowledge={vi.fn()}
      />,
    );
    expect(screen.getByText(/Pop the balloons/i)).toBeInTheDocument();
  });

  it('renders a "How to play" section heading at h2 level', () => {
    render(
      <InstructionsPanel
        gameName={GAME_NAME}
        instructions={INSTRUCTIONS}
        acknowledged={false}
        onAcknowledge={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: /How to play/i }),
    ).toBeInTheDocument();
  });

  it('renders an unchecked acknowledgement checkbox when acknowledged is false', () => {
    render(
      <InstructionsPanel
        gameName={GAME_NAME}
        instructions={INSTRUCTIONS}
        acknowledged={false}
        onAcknowledge={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('checkbox', { name: /I've read the instructions/i }),
    ).not.toBeChecked();
  });

  it('renders a checked acknowledgement checkbox when acknowledged is true', () => {
    render(
      <InstructionsPanel
        gameName={GAME_NAME}
        instructions={INSTRUCTIONS}
        acknowledged={true}
        onAcknowledge={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('checkbox', { name: /I've read the instructions/i }),
    ).toBeChecked();
  });

  it('calls onAcknowledge(true) when an unchecked checkbox is clicked', async () => {
    const onAcknowledge = vi.fn();
    render(
      <InstructionsPanel
        gameName={GAME_NAME}
        instructions={INSTRUCTIONS}
        acknowledged={false}
        onAcknowledge={onAcknowledge}
      />,
    );
    await userEvent.click(
      screen.getByRole('checkbox', { name: /I've read the instructions/i }),
    );
    expect(onAcknowledge).toHaveBeenCalledWith(true);
  });

  it('calls onAcknowledge(false) when a checked checkbox is clicked again', async () => {
    const onAcknowledge = vi.fn();
    render(
      <InstructionsPanel
        gameName={GAME_NAME}
        instructions={INSTRUCTIONS}
        acknowledged={true}
        onAcknowledge={onAcknowledge}
      />,
    );
    await userEvent.click(
      screen.getByRole('checkbox', { name: /I've read the instructions/i }),
    );
    expect(onAcknowledge).toHaveBeenCalledWith(false);
  });

  it('checkbox has an accessible label', () => {
    render(
      <InstructionsPanel
        gameName={GAME_NAME}
        instructions={INSTRUCTIONS}
        acknowledged={false}
        onAcknowledge={vi.fn()}
      />,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAccessibleName(/I've read the instructions/i);
  });
});
