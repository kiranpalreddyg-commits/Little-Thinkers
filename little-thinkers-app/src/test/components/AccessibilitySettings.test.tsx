import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { AccessibilitySettings } from '@/components/settings/AccessibilitySettings';
import { useAccessibilityStore } from '@/lib/stores/accessibilityStore';
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/lib/types/accessibility';

vi.mock('@/lib/stores/accessibilityStore', () => ({
  useAccessibilityStore: vi.fn(),
}));

const CHILD_ID = 'child-1';

const hydrateSettings = vi.fn();
const updateSetting = vi.fn();
const resetSettings = vi.fn();

const mockedUseAccessibilityStore = vi.mocked(useAccessibilityStore);

function setStoreState(overrides = {}) {
  const state = {
    settings: { ...DEFAULT_ACCESSIBILITY_SETTINGS },
    childId: CHILD_ID,
    hydrateSettings,
    updateSetting,
    resetSettings,
    ...overrides,
  };
  mockedUseAccessibilityStore.mockImplementation(
    (selector?: (s: typeof state) => unknown) =>
      selector ? selector(state) : state,
  );
}

beforeEach(() => {
  hydrateSettings.mockClear();
  updateSetting.mockClear();
  resetSettings.mockClear();
  setStoreState();
});

describe('AccessibilitySettings', () => {
  it('renders all 6 setting controls (AC1-AC6)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    expect(
      screen.getByRole('group', { name: /Gameplay Mode/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /Reduced Motion/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /Color-Blind Mode/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /Dyslexia-Friendly Font/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /Text Size/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /One-Handed Layout/i }),
    ).toBeInTheDocument();
  });

  it('calls hydrateSettings with childId on mount (AC7)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    expect(hydrateSettings).toHaveBeenCalledWith(CHILD_ID);
  });

  it('Gameplay Mode has 3 radio buttons: Smart, Chill, Focus (AC1)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    const group = screen.getByRole('group', { name: /Gameplay Mode/i });
    expect(
      within(group).getByRole('radio', { name: /Smart/i }),
    ).toBeInTheDocument();
    expect(
      within(group).getByRole('radio', { name: /Chill/i }),
    ).toBeInTheDocument();
    expect(
      within(group).getByRole('radio', { name: /Focus/i }),
    ).toBeInTheDocument();
  });

  it('Gameplay Mode defaults to Smart being checked (AC1)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    const group = screen.getByRole('group', { name: /Gameplay Mode/i });
    expect(within(group).getByRole('radio', { name: /Smart/i })).toBeChecked();
    expect(
      within(group).getByRole('radio', { name: /Chill/i }),
    ).not.toBeChecked();
  });

  it('Text Size has 3 radio buttons: Small, Medium, Large (AC5)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    const group = screen.getByRole('group', { name: /Text Size/i });
    expect(
      within(group).getByRole('radio', { name: /Small/i }),
    ).toBeInTheDocument();
    expect(
      within(group).getByRole('radio', { name: /Medium/i }),
    ).toBeInTheDocument();
    expect(
      within(group).getByRole('radio', { name: /Large/i }),
    ).toBeInTheDocument();
  });

  it('Text Size defaults to Medium being checked (AC5)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    const group = screen.getByRole('group', { name: /Text Size/i });
    expect(within(group).getByRole('radio', { name: /Medium/i })).toBeChecked();
  });

  it('Handed Layout has 3 radio buttons: Default, Left, Right (AC6)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    const group = screen.getByRole('group', { name: /One-Handed Layout/i });
    expect(
      within(group).getByRole('radio', { name: /Default/i }),
    ).toBeInTheDocument();
    expect(
      within(group).getByRole('radio', { name: /Left/i }),
    ).toBeInTheDocument();
    expect(
      within(group).getByRole('radio', { name: /Right/i }),
    ).toBeInTheDocument();
  });

  it('Handed Layout defaults to Default being checked (AC6)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    const group = screen.getByRole('group', { name: /One-Handed Layout/i });
    expect(
      within(group).getByRole('radio', { name: /Default/i }),
    ).toBeChecked();
  });

  it('Reduced Motion checkbox starts unchecked (AC2)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    expect(
      screen.getByRole('checkbox', { name: /Reduced Motion/i }),
    ).not.toBeChecked();
  });

  it('Color-Blind Mode checkbox starts unchecked (AC3)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    expect(
      screen.getByRole('checkbox', { name: /Color-Blind Mode/i }),
    ).not.toBeChecked();
  });

  it('Dyslexia-Friendly Font checkbox starts unchecked (AC4)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    expect(
      screen.getByRole('checkbox', { name: /Dyslexia-Friendly Font/i }),
    ).not.toBeChecked();
  });

  it('clicking the Chill gameplay radio calls updateSetting with gameplayMode/chill (AC1)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    const group = screen.getByRole('group', { name: /Gameplay Mode/i });
    fireEvent.click(within(group).getByRole('radio', { name: /Chill/i }));
    expect(updateSetting).toHaveBeenCalledWith(
      CHILD_ID,
      'gameplayMode',
      'chill',
    );
  });

  it('clicking the Reduced Motion checkbox toggles it via updateSetting (AC2)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    fireEvent.click(
      screen.getByRole('checkbox', { name: /Reduced Motion/i }),
    );
    expect(updateSetting).toHaveBeenCalledWith(
      CHILD_ID,
      'reducedMotion',
      true,
    );
  });

  it('clicking the Large text size radio calls updateSetting with textSize/large (AC5)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    const group = screen.getByRole('group', { name: /Text Size/i });
    fireEvent.click(within(group).getByRole('radio', { name: /Large/i }));
    expect(updateSetting).toHaveBeenCalledWith(CHILD_ID, 'textSize', 'large');
  });

  it('renders a "Reset to Defaults" button (AC7)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    expect(
      screen.getByRole('button', { name: /Reset to Defaults/i }),
    ).toBeInTheDocument();
  });

  it('clicking "Reset to Defaults" calls resetSettings with childId (AC7)', () => {
    render(<AccessibilitySettings childId={CHILD_ID} />);
    fireEvent.click(
      screen.getByRole('button', { name: /Reset to Defaults/i }),
    );
    expect(resetSettings).toHaveBeenCalledWith(CHILD_ID);
  });

  it('all fieldsets expose accessible <legend> elements (AC8)', () => {
    const { container } = render(
      <AccessibilitySettings childId={CHILD_ID} />,
    );
    const legends = container.querySelectorAll('fieldset > legend');
    const legendText = Array.from(legends).map((l) =>
      (l.textContent ?? '').trim(),
    );
    expect(legendText).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Gameplay Mode/i),
        expect.stringMatching(/Text Size/i),
        expect.stringMatching(/One-Handed Layout/i),
      ]),
    );
    expect(legends.length).toBeGreaterThanOrEqual(3);
  });

  it('reflects non-default settings from the store (AC1, AC5)', () => {
    setStoreState({
      settings: {
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        gameplayMode: 'focus',
        textSize: 'large',
        reducedMotion: true,
      },
    });
    render(<AccessibilitySettings childId={CHILD_ID} />);
    const gameplay = screen.getByRole('group', { name: /Gameplay Mode/i });
    expect(
      within(gameplay).getByRole('radio', { name: /Focus/i }),
    ).toBeChecked();
    const textSize = screen.getByRole('group', { name: /Text Size/i });
    expect(
      within(textSize).getByRole('radio', { name: /Large/i }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: /Reduced Motion/i }),
    ).toBeChecked();
  });
});
