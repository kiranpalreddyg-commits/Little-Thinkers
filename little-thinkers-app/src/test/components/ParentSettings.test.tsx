/**
 * Story 2.4 — RED tests: Parent Settings Page
 *
 * AC1: system generates a data-export report on request
 * AC2: system generates a printable achievement certificate
 * AC3: parent can configure report cadence and detail level
 * AC4: parent can request account deletion (30-day SLA) and view status
 * AC5: parent can manage child profile settings
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/lib/api/auth', () => ({
  apiClient: {
    getChildren: vi.fn(),
    updateChild: vi.fn(),
  },
}));

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';

import ParentSettingsPage from '@/app/(shell)/parent/settings/page';

const MOCK_CHILDREN = [
  {
    id: 'child-1',
    parent_id: 'parent-1',
    name: 'Aiden',
    age: 8,
    gameplay_mode: 'smart',
    coppa_consented: true,
    coppa_consented_at: '2026-05-01T00:00:00Z',
    accessibility_settings: {},
    avatar_url: null,
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
  },
];

describe('ParentSettingsPage — Story 2.4', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>);
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'parent-1', email: 'james@example.com' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useAuth>);
    vi.mocked(apiClient.getChildren).mockResolvedValue(MOCK_CHILDREN);
    vi.mocked(apiClient.updateChild).mockResolvedValue({ ...MOCK_CHILDREN[0], name: 'Aiden Updated' });
  });

  // ── AC1: data export ───────────────────────────────────────────────────────
  it('AC1: shows the reports section', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-reports');
    expect(screen.getByTestId('section-reports')).toBeInTheDocument();
  });

  it('AC1: shows an export button for each child', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('export-button-child-1');
    expect(screen.getByTestId('export-button-child-1')).toBeInTheDocument();
  });

  it('AC1: clicking export triggers a download (creates an <a> with download attr)', async () => {
    // Spy on URL.createObjectURL used by the export handler
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

    // Spy on click() so the hidden anchor doesn't cause JSDOM navigation errors
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('export-button-child-1');

    await act(async () => {
      fireEvent.click(screen.getByTestId('export-button-child-1'));
    });

    expect(createObjectURL).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  // ── AC2: certificate ──────────────────────────────────────────────────────
  it('AC2: shows certificate section with a print button per child', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-certificates');
    expect(screen.getByTestId('print-certificate-child-1')).toBeInTheDocument();
  });

  it('AC2: clicking print certificate calls window.print()', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('print-certificate-child-1');

    await act(async () => {
      fireEvent.click(screen.getByTestId('print-certificate-child-1'));
    });

    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });

  // ── AC3: report settings ──────────────────────────────────────────────────
  it('AC3: shows report cadence selector', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-reports');
    expect(screen.getByTestId('report-cadence-select')).toBeInTheDocument();
  });

  it('AC3: shows report detail level selector', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-reports');
    expect(screen.getByTestId('report-detail-select')).toBeInTheDocument();
  });

  it('AC3: changing cadence persists the selection', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('report-cadence-select');
    fireEvent.change(screen.getByTestId('report-cadence-select'), { target: { value: 'monthly' } });
    expect((screen.getByTestId('report-cadence-select') as HTMLSelectElement).value).toBe('monthly');
  });

  // ── AC4: account deletion ─────────────────────────────────────────────────
  it('AC4: shows account deletion section', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-account');
    expect(screen.getByTestId('section-account')).toBeInTheDocument();
  });

  it('AC4: shows deletion request button', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('deletion-request-button');
    expect(screen.getByTestId('deletion-request-button')).toBeInTheDocument();
  });

  it('AC4: clicking deletion request shows pending status with 30-day SLA message', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('deletion-request-button');

    await act(async () => {
      fireEvent.click(screen.getByTestId('deletion-request-button'));
    });

    expect(screen.getByTestId('deletion-status')).toHaveTextContent(/pending|30/i);
  });

  // ── AC5: child profile settings ───────────────────────────────────────────
  it('AC5: shows child settings section', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-child-settings');
    expect(screen.getByTestId('section-child-settings')).toBeInTheDocument();
  });

  it('AC5: shows Aiden name in the child settings form', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-child-settings');
    const nameInput = screen.getByTestId('child-name-input-child-1') as HTMLInputElement;
    expect(nameInput.value).toBe('Aiden');
  });

  it('AC5: editing child name and saving calls apiClient.updateChild (AC5)', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-child-settings');

    fireEvent.change(screen.getByTestId('child-name-input-child-1'), {
      target: { value: 'Aiden Updated' },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('child-settings-save-child-1'));
    });

    expect(apiClient.updateChild).toHaveBeenCalledWith(
      'child-1',
      expect.objectContaining({ name: 'Aiden Updated' }),
    );
  });
});
