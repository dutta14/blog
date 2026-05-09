import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test/helpers';

vi.mock('../data/posts', () => ({
  startHereSlugs: ['nonexistent-slug-1', 'nonexistent-slug-2'],
  posts: [
    {
      slug: 'real-post',
      title: 'Real Post',
      date: 'January 1, 2024',
      excerpt: 'An excerpt.',
      content: 'Some content.',
      tags: ['ai-products'],
    },
  ],
}));

// Lazy-import so vi.mock is applied before the module loads
const { default: About } = await import('./About');

describe('About — Start Here with no matching slugs', () => {
  it('does not render Start Here section when no slugs match any posts', () => {
    renderWithRouter(<About />);
    expect(screen.queryByRole('heading', { name: 'Start here' })).not.toBeInTheDocument();
    expect(document.querySelector('.about-start-here')).toBeNull();
  });

  it('still renders the main About content', () => {
    renderWithRouter(<About />);
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
    expect(screen.getByText(/I have been writing since 2010/)).toBeInTheDocument();
  });
});
