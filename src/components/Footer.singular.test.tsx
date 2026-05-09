import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test/helpers';

vi.mock('../data/posts', () => ({
  posts: [
    {
      slug: 'only-post',
      title: 'Only Post',
      date: 'January 1, 2024',
      excerpt: 'The one post.',
      content: 'Content here.',
      tags: [],
    },
  ],
}));

const { default: Footer } = await import('./Footer');

describe('Footer — singular essay count', () => {
  it('renders "1 essay and counting" when there is exactly one post', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('1 essay and counting')).toBeInTheDocument();
  });

  it('does not render "essays" (plural) when count is 1', () => {
    renderWithRouter(<Footer />);
    expect(screen.queryByText(/essays and counting/)).not.toBeInTheDocument();
  });
});
