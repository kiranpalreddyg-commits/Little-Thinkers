import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContentSection } from '@/components/home/ContentSection';
import { ScienceTopic } from '@/lib/types/content';

const mockTopics: ScienceTopic[] = [
  { id: 'sci-1', question: 'Why do matches catch fire?', cognitiveSkills: ['curiosity'], ageRange: { min: 8, max: 15 } },
  { id: 'sci-2', question: 'How do airplanes fly?', cognitiveSkills: ['curiosity'], ageRange: { min: 8, max: 15 } },
];

const icon = <svg aria-hidden="true" />;

describe('ContentSection', () => {
  it('renders the section heading as h2', () => {
    render(
      <ContentSection
        heading="Tell Me Why?"
        description="Science questions answered"
        items={mockTopics}
        icon={icon}
        accentColor="bg-amber-500"
        onItemSelect={vi.fn()}
      />
    );
    const heading = screen.getByRole('heading', { level: 2, name: 'Tell Me Why?' });
    expect(heading).toBeInTheDocument();
  });

  it('renders content items as a list', () => {
    render(
      <ContentSection
        heading="Tell Me Why?"
        description="Science questions answered"
        items={mockTopics}
        icon={icon}
        accentColor="bg-amber-500"
        onItemSelect={vi.fn()}
      />
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders item labels', () => {
    render(
      <ContentSection
        heading="Tell Me Why?"
        description="Science questions answered"
        items={mockTopics}
        icon={icon}
        accentColor="bg-amber-500"
        onItemSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Why do matches catch fire?')).toBeInTheDocument();
    expect(screen.getByText('How do airplanes fly?')).toBeInTheDocument();
  });

  it('calls onItemSelect with correct id when item is clicked', async () => {
    const onItemSelect = vi.fn();
    render(
      <ContentSection
        heading="Tell Me Why?"
        description="Science questions answered"
        items={mockTopics}
        icon={icon}
        accentColor="bg-amber-500"
        onItemSelect={onItemSelect}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /Why do matches catch fire/i }));
    expect(onItemSelect).toHaveBeenCalledWith('sci-1');
  });

  it('shows skeletons when items array is empty', () => {
    render(
      <ContentSection
        heading="Tell Me Why?"
        description="Science questions answered"
        items={[]}
        icon={icon}
        accentColor="bg-amber-500"
        onItemSelect={vi.fn()}
      />
    );
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
