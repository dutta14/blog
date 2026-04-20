import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

afterEach(() => {
  delete (window as unknown as Record<string, unknown>).umami;
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

  it('NewsletterCTA renders with RSS link', () => {
    renderPostPage('newest-post');
    expect(screen.getByText('Prefer RSS?')).toBeInTheDocument();
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

/* ── Analytics: umami tracking ──────────────────────────── */

describe('Post page — analytics tracking', () => {
  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).umami;
  });

  it('renders correctly when window.umami is undefined (script not loaded)', () => {
    expect(window.umami).toBeUndefined();
    renderPostPage('newest-post');
    expect(screen.getByRole('heading', { level: 1, name: 'Newest Post' })).toBeInTheDocument();
  });

  it('renders correctly when window.umami is defined (script loaded)', () => {
    window.umami = { track: vi.fn() };
    renderPostPage('newest-post');
    expect(screen.getByRole('heading', { level: 1, name: 'Newest Post' })).toBeInTheDocument();
  });

  it('calls window.umami.track with "post-view" event and correct data when umami is available', () => {
    const trackFn = vi.fn();
    window.umami = { track: trackFn };
    renderPostPage('newest-post');
    expect(trackFn).toHaveBeenCalledWith('post-view', { slug: 'newest-post', readingTime: 2 });
  });

  it('does not throw when umami is unavailable and a post is viewed', () => {
    expect(window.umami).toBeUndefined();
    expect(() => renderPostPage('newest-post')).not.toThrow();
  });

  it('does not call track when post is not found', () => {
    const trackFn = vi.fn();
    window.umami = { track: trackFn };
    renderPostPage('nonexistent-slug');
    expect(trackFn).not.toHaveBeenCalled();
  });
});

/* ── "Back to Writing" button ───────────────────────────── */

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Post page — "Back to Writing" button', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders "Back to Writing" as a <button> element', () => {
    renderPostPage('newest-post');
    const btn = screen.getByRole('button', { name: 'Back to Writing' });
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
  });

  it('clicking "Back to Writing" navigates to "/" with restoreScroll state', async () => {
    const user = userEvent.setup();
    renderPostPage('newest-post');
    await user.click(screen.getByRole('button', { name: 'Back to Writing' }));
    expect(mockNavigate).toHaveBeenCalledWith('/', { state: { restoreScroll: true } });
  });
});

/* ── Hooks ordering: post not found → valid post ────────── */

describe('Post page — hooks ordering safety', () => {
  it('renders "Post not found" for invalid slug without crashing', () => {
    renderPostPage('nonexistent-slug');
    expect(screen.getByText('Post not found.')).toBeInTheDocument();
  });

  it('handles rendering a valid post after an invalid post without hooks violation', () => {
    const { unmount } = render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/post/nonexistent-slug']}>
          <Routes>
            <Route path="/post/:slug" element={<Post />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(screen.getByText('Post not found.')).toBeInTheDocument();
    unmount();

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/post/newest-post']}>
          <Routes>
            <Route path="/post/:slug" element={<Post />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Newest Post' })).toBeInTheDocument();
  });
});

/* ── New features: ReadingProgress, AuthorCard, JSON-LD, scroll depth ── */

describe('Post page — ReadingProgress component', () => {
  it('renders a ReadingProgress bar container in post view', () => {
    renderPostPage('newest-post');
    const progressBar = document.querySelector('.reading-progress');
    expect(progressBar).not.toBeNull();
  });

  it('ReadingProgress is not rendered for not-found posts', () => {
    renderPostPage('nonexistent-slug');
    const progressBar = document.querySelector('.reading-progress');
    expect(progressBar).toBeNull();
  });
});

describe('Post page — AuthorCard component', () => {
  it('renders AuthorCard with author name in post view', () => {
    renderPostPage('newest-post');
    expect(screen.getByText('Anindya Dutta')).toBeInTheDocument();
  });

  it('renders AuthorCard aside with "About the author" label', () => {
    renderPostPage('newest-post');
    expect(screen.getByRole('complementary', { name: 'About the author' })).toBeInTheDocument();
  });

  it('AuthorCard is not rendered for not-found posts', () => {
    renderPostPage('nonexistent-slug');
    expect(screen.queryByRole('complementary', { name: 'About the author' })).not.toBeInTheDocument();
  });
});

describe('Post page — JSON-LD structured data', () => {
  it('JSON-LD BlogPosting script present for valid post', () => {
    renderPostPage('newest-post');
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const contents = Array.from(scripts).map(s => s.textContent ?? '');
    const hasBlogPosting = contents.some(c => c.includes('"BlogPosting"'));
    expect(hasBlogPosting).toBe(true);
  });

  it('JSON-LD BreadcrumbList script present for valid post', () => {
    renderPostPage('newest-post');
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const contents = Array.from(scripts).map(s => s.textContent ?? '');
    const hasBreadcrumb = contents.some(c => c.includes('"BreadcrumbList"'));
    expect(hasBreadcrumb).toBe(true);
  });

  it('JSON-LD is not injected for not-found posts', () => {
    renderPostPage('nonexistent-slug');
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const contents = Array.from(scripts).map(s => s.textContent ?? '');
    const hasBlogPosting = contents.some(c => c.includes('"BlogPosting"'));
    expect(hasBlogPosting).toBe(false);
  });
});

describe('Post page — scroll depth sentinels', () => {
  it('post body element exists for sentinel attachment', () => {
    renderPostPage('newest-post');
    const body = document.querySelector('.post-body');
    expect(body).not.toBeNull();
  });
});
