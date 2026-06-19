import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PauseOverlay } from '@/components/game/PauseOverlay';

const GAME_NAME = 'Word Pop';

describe('PauseOverlay', () => {
  it('renders the "Game Paused" heading (AC2)', () => {
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={vi.fn()}
        onQuit={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('heading', { name: /Game Paused/i }),
    ).toBeInTheDocument();
  });

  it('shows the game name (AC2)', () => {
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={vi.fn()}
        onQuit={vi.fn()}
      />,
    );
    expect(screen.getByText(/Word Pop/i)).toBeInTheDocument();
  });

  it('renders a "Resume" button that calls onResume when clicked (AC3)', async () => {
    const onResume = vi.fn();
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={onResume}
        onQuit={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Resume/i }));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('renders a "Quit to Home" button that calls onQuit when clicked (AC4)', async () => {
    const onQuit = vi.fn();
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={vi.fn()}
        onQuit={onQuit}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Quit to Home/i }),
    );
    expect(onQuit).toHaveBeenCalledTimes(1);
  });

  it('Resume button is focusable via keyboard', async () => {
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={vi.fn()}
        onQuit={vi.fn()}
      />,
    );
    const resumeButton = screen.getByRole('button', { name: /Resume/i });
    resumeButton.focus();
    expect(resumeButton).toHaveFocus();
  });

  it('Resume button activates on Enter key press', async () => {
    const onResume = vi.fn();
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={onResume}
        onQuit={vi.fn()}
      />,
    );
    const resumeButton = screen.getByRole('button', { name: /Resume/i });
    resumeButton.focus();
    await userEvent.keyboard('{Enter}');
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('Resume button activates on Space key press', async () => {
    const onResume = vi.fn();
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={onResume}
        onQuit={vi.fn()}
      />,
    );
    const resumeButton = screen.getByRole('button', { name: /Resume/i });
    resumeButton.focus();
    await userEvent.keyboard(' ');
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('exposes a dialog role for modal semantics (a11y)', () => {
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={vi.fn()}
        onQuit={vi.fn()}
      />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('Tab from the last button wraps focus back to the first button (focus trap)', async () => {
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={vi.fn()}
        onQuit={vi.fn()}
      />,
    );
    const quit = screen.getByRole('button', { name: /Quit to Home/i });
    quit.focus();
    expect(quit).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: /Resume/i })).toHaveFocus();
  });

  it('Shift+Tab from the first button wraps focus to the last button (focus trap)', async () => {
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={vi.fn()}
        onQuit={vi.fn()}
      />,
    );
    const resume = screen.getByRole('button', { name: /Resume/i });
    resume.focus();
    expect(resume).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole('button', { name: /Quit to Home/i })).toHaveFocus();
  });

  it('Escape key calls onResume (focus trap handler)', async () => {
    const onResume = vi.fn();
    render(
      <PauseOverlay
        gameName={GAME_NAME}
        onResume={onResume}
        onQuit={vi.fn()}
      />,
    );
    screen.getByRole('button', { name: /Resume/i }).focus();
    await userEvent.keyboard('{Escape}');
    expect(onResume).toHaveBeenCalledTimes(1);
  });
});
