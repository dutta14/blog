import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import RelatedPosts from './RelatedPosts';
import { renderWithRouter, makePost } from '../test/helpers';

// Mock the posts module to control test data
vi.mock('../data/posts', async () => {
  const actual = await vi.importActual('../data/posts');
  return {
    ...actual,
    posts: [
      {
        slug: 'current-post',
        title: 'Current Post',
        date: 'June 1, 2024',
        excerpt: 'Current excerpt',
        content: 'Content for the current post with enough words.',
        tags: ['ai-products', 'career'],
      },
      {
        slug: 'related-one',
        title: 'Related One',
        date: 'May 15, 2024',
        excerpt: 'Related excerpt one',
        content: 'Content for related one.',
        tags: ['ai-products'],
      },
      {
        slug: 'related-two',
        title: 'Related Two',
        date: 'April 10, 2024',
        excerpt: 'Related excerpt two',
        content: 'Content for related two.',
        tags: ['career'],
      },
      {
        slug: 'unrelated',
        title: 'Unrelated Post',
        date: 'March 5, 2024',
        excerpt: 'Unrelated excerpt',
        content: 'Content for unrelated.',
        tags: ['building'],
      },
    ],
  };
});

describe('RelatedPosts', () => {
  it('renders the "Keep reading" heading', () => {
    const current = makePost({ slug: 'current-post', tags: ['ai-products', 'career'] });
    renderWithRouter(<RelatedPosts current={current} />);
    expect(screen.getByRole('heading', { name: 'Keep reading' })).toBeInTheDocument();
  });

  it('renders related post links', () => {
    const current = makePost({ slug: 'current-post', tags: ['ai-products', 'career'] });
    renderWithRouter(<RelatedPosts current={current} />);
    expect(screen.getByText('Related One')).toBeInTheDocument();
    expect(screen.getByText('Related Two')).toBeInTheDocument();
  });

  it('renders as an aside with aria-labelledby for accessibility', () => {
    const current = makePost({ slug: 'current-post', tags: ['ai-products', 'career'] });
    renderWithRouter(<RelatedPosts current={current} />);
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-labelledby', 'related-posts-heading');
  });

  it('shows reading time for each related post', () => {
    const current = makePost({ slug: 'current-post', tags: ['ai-products', 'career'] });
    renderWithRouter(<RelatedPosts current={current} />);
    // All mock posts have short content, so 1 min read
    const readTimes = screen.getAllByText(/min read/);
    expect(readTimes.length).toBeGreaterThanOrEqual(2);
  });
});
