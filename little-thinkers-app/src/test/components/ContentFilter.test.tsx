import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContentFilterBar } from '@/components/home/ContentFilter';
import { ContentFilter } from '@/lib/types/content';

const DEFAULT_FILTER: ContentFilter = { topic: '', ageMin: 7, ageMax: 15 };

describe('ContentFilterBar', () => {
  it('renders topic and age selects with labels', () => {
    render(<ContentFilterBar filter={DEFAULT_FILTER} onFilterChange={vi.fn()} />);
    expect(screen.getByRole('combobox', { name: 'Topic:' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Age:' })).toBeInTheDocument();
  });

  it('calls onFilterChange with topic when topic select changes', async () => {
    const onFilterChange = vi.fn();
    render(<ContentFilterBar filter={DEFAULT_FILTER} onFilterChange={onFilterChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Topic:' }), 'vocabulary');
    expect(onFilterChange).toHaveBeenCalledWith({ topic: 'vocabulary' });
  });

  it('calls onFilterChange with age range when age select changes', async () => {
    const onFilterChange = vi.fn();
    render(<ContentFilterBar filter={DEFAULT_FILTER} onFilterChange={onFilterChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Age:' }), '7-10');
    expect(onFilterChange).toHaveBeenCalledWith({ ageMin: 7, ageMax: 10 });
  });

  it('does not show clear button when filter is at defaults', () => {
    render(<ContentFilterBar filter={DEFAULT_FILTER} onFilterChange={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /Clear all filters/i })).not.toBeInTheDocument();
  });

  it('shows clear button when topic filter is active', () => {
    render(<ContentFilterBar filter={{ topic: 'logic', ageMin: 7, ageMax: 15 }} onFilterChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Clear all filters/i })).toBeInTheDocument();
  });

  it('clears filter when clear button is clicked', async () => {
    const onFilterChange = vi.fn();
    render(<ContentFilterBar filter={{ topic: 'logic', ageMin: 7, ageMax: 15 }} onFilterChange={onFilterChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Clear all filters/i }));
    expect(onFilterChange).toHaveBeenCalledWith({ topic: '', ageMin: 7, ageMax: 15 });
  });

  it('filter controls are keyboard accessible (have min-h for tap target)', () => {
    render(<ContentFilterBar filter={DEFAULT_FILTER} onFilterChange={vi.fn()} />);
    const topicSelect = screen.getByRole('combobox', { name: 'Topic:' });
    expect(topicSelect.className).toContain('min-h');
  });

  it('has search landmark with accessible label', () => {
    render(<ContentFilterBar filter={DEFAULT_FILTER} onFilterChange={vi.fn()} />);
    expect(screen.getByRole('search', { name: /Filter content/i })).toBeInTheDocument();
  });
});
