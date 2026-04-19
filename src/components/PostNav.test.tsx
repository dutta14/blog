import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import PostNav from './PostNav';
import { renderWithRouter, makePost } from '../test/helpers';

const mockPosts = [
  makePost({ slug: 'newest', title: 'Newest Post', date: 'June 1, 2024' }),
  makePost({ slug: 'middle', title: 'Middle Post', date: 'May 1, 2024' }),
  makePost({ slug: 'oldest', title: 'Oldest Post', date: 'April 1, 2024' }),
];

vi.mock('../data/posts', async () => {
  const actual = await vi.importActual('../data/posts');
  return {
    ...actual,
    posts: [
      { slug: 'newest', title: 'Newest Post', date: 'June 1, 2024', excerpt: '', content: 'words', tags: [] },
      { slug: 'middle', title: 'Middle Post', date: 'May 1, 2024', excerpt: '', content: 'words', tags: [] },
      { slug: 'oldest', title: 'Oldest Post', date: 'April 1, 2024', excerpt: '', content: 'words', tags: [] },
    ],
  };
});

describe('PostNav', () => {
  it('shows previous and next links for a middle post', () => {
    renderWithRouter(<PostNav current={mockPosts[1]} />);
    expect(screen.getByLabelText('Previous post: Oldest Post')).toBeInTheDocument();
    expect(screen.getByLabelText('Next post: Newest Post')).toBeInTheDocument();
  });

  it('first post (newest, index 0) has no "Next" link', () => {
    renderWithRouter(<PostNav current={mockPosts[0]} />);
    expect(screen.queryByText('Next →')).not.toBeInTheDocument();
    expect(screen.getByText('← Previous')).toBeInTheDocument();
  });

  it('last post (oldest, last index) has no "Previous" link', () => {
    renderWithRouter(<PostNav current={mockPosts[2]} />);
    expect(screen.queryByText('← Previous')).not.toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
  });

  it('previous link points to the correct post URL', () => {
    renderWithRouter(<PostNav current={mockPosts[1]} />);
    const link = screen.getByLabelText('Previous post: Oldest Post');
    expect(link).toHaveAttribute('href', '/post/oldest');
  });

  it('next link points to the correct post URL', () => {
    renderWithRouter(<PostNav current={mockPosts[1]} />);
    const link = screen.getByLabelText('Next post: Newest Post');
    expect(link).toHaveAttribute('href', '/post/newest');
  });

  it('nav has accessible aria-label', () => {
    renderWithRouter(<PostNav current={mockPosts[1]} />);
    expect(screen.getByRole('navigation', { name: 'Previous and next posts' })).toBeInTheDocument();
  });
});
