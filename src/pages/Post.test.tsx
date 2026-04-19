import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Post from './Post';

// Mock posts data with 3 posts: newest, middle, oldest
vi.mock('../data/posts', () => ({
  TAG_LABELS: {
    'ai-products': 'AI Products',
    'engineering-leadership': 'Leadership',
    'career': 'Career',
    'big-tech': 'Big Tech',
    'building': 'Building',
  },
  featuredSlugs: new Set([]),
  posts: [
    {
      slug: 'newest-post',
      title: 'Newest Post',
      date: 'June 1, 2024',
      excerpt: 'Newest excerpt',
      content: Array(460).fill('word').join(' '),
      tags: ['ai-products', 'career'],
    },
    {
      slug: 'middle-post',
      title: 'Middle Post',
      date: 'May 1, 2024',
      excerpt: 'Middle excerpt',
      content: Array(690).fill('word').join(' '),
      tags: ['career'],
    },
    {
      slug: 'oldest-post',
      title: 'Oldest Post',
      date: 'April 1, 2024',
      excerpt: 'Oldest excerpt',
      content: Array(230).fill('word').join(' '),
      tags: [],
    },
  ],
}));

function renderPostPage(slug: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/post/${slug}`]}>
        <Routes>
          <Route path="/post/:slug" element={<Post />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );
}

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
  Object.defineProperty(navigator, 'share', { value: undefined, writable: true, configurable: true });
});

describe('Post page', () => {
  it('shows reading time in the post header', () => {
    renderPostPage('newest-post');
    expect(screen.getByText('2 min read')).toBeInTheDocument();
  });

  it('shows tags below date for a post with tags', () => {
    renderPostPage('newest-post');
    expect(screen.getByRole('link', { name: 'AI Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Career' })).toBeInTheDocument();
  });

  it('does not show tags section for a post without tags', () => {
    renderPostPage('oldest-post');
    expect(screen.queryByLabelText('Post topics')).not.toBeInTheDocument();
  });

  it('ShareBar renders LinkedIn, Twitter, and Copy Link buttons', () => {
    renderPostPage('middle-post');
    expect(screen.getByLabelText('Share this post on LinkedIn (opens in new tab)')).toBeInTheDocument();
    expect(screen.getByLabelText('Share this post on Twitter (opens in new tab)')).toBeInTheDocument();
    expect(screen.getByLabelText('Copy link to this post')).toBeInTheDocument();
  });

  it('share buttons have correct aria-labels', () => {
    renderPostPage('newest-post');
    expect(screen.getByLabelText(/LinkedIn/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Twitter/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Copy link/)).toBeInTheDocument();
  });

  it('copy link button shows "Link copied" after click', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    renderPostPage('newest-post');

    await user.click(screen.getByLabelText('Copy link to this post'));

    await waitFor(() => {
      expect(screen.getByText('Link copied')).toBeInTheDocument();
    });
  });

  it('RelatedPosts section renders with "Keep reading" heading', () => {
    renderPostPage('newest-post');
    expect(screen.getByRole('heading', { name: 'Keep reading' })).toBeInTheDocument();
  });

  it('EnjoyedCard renders with RSS link', () => {
    renderPostPage('newest-post');
    expect(screen.getByText('Enjoyed this?')).toBeInTheDocument();
    expect(screen.getByLabelText('Subscribe via RSS feed')).toBeInTheDocument();
  });

  it('PostNav shows previous and next links for a middle post', () => {
    renderPostPage('middle-post');
    expect(screen.getByLabelText('Previous post: Oldest Post')).toBeInTheDocument();
    expect(screen.getByLabelText('Next post: Newest Post')).toBeInTheDocument();
  });

  it('first post (newest, index 0) has no "Next" link', () => {
    renderPostPage('newest-post');
    expect(screen.queryByText('Next →')).not.toBeInTheDocument();
    expect(screen.getByText('← Previous')).toBeInTheDocument();
  });

  it('last post (oldest, last index) has no "Previous" link', () => {
    renderPostPage('oldest-post');
    expect(screen.queryByText('← Previous')).not.toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
  });

  it('shows "Post not found" for an unknown slug', () => {
    renderPostPage('nonexistent-slug');
    expect(screen.getByText('Post not found.')).toBeInTheDocument();
  });

  it('shows the post title as an h1', () => {
    renderPostPage('middle-post');
    expect(screen.getByRole('heading', { level: 1, name: 'Middle Post' })).toBeInTheDocument();
  });

  it('shows the post date', () => {
    renderPostPage('newest-post');
    expect(screen.getByText('June 1, 2024')).toBeInTheDocument();
  });
});
