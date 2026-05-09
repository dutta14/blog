import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../test/helpers';
import Home from './Home';

// Mock posts data
vi.mock('../data/posts', () => ({
  TAG_LABELS: {
    'ai-products': 'AI Products',
    'engineering-leadership': 'Leadership',
    'career': 'Career',
    'big-tech': 'Big Tech',
    'building': 'Building',
  },
  startHereSlugs: ['the-chatgpt-moment-from-inside-microsoft'],
  featuredSlugs: new Set(['featured-post']),
  posts: [
    {
      slug: 'featured-post',
      title: 'Featured Post Title',
      date: 'June 1, 2024',
      excerpt: 'Featured excerpt',
      content: Array(460).fill('word').join(' '),
      tags: ['ai-products'],
    },
    {
      slug: 'regular-post',
      title: 'Regular Post Title',
      date: 'May 15, 2024',
      excerpt: 'Regular excerpt',
      content: Array(230).fill('word').join(' '),
      tags: ['career'],
    },
    {
      slug: 'another-post',
      title: 'Another Post Title',
      date: 'April 10, 2024',
      excerpt: 'Another excerpt',
      content: Array(690).fill('word').join(' '),
      tags: ['ai-products', 'building'],
    },
    {
      slug: 'the-chatgpt-moment-from-inside-microsoft',
      title: 'The ChatGPT Moment',
      date: 'March 1, 2024',
      excerpt: 'ChatGPT excerpt',
      content: Array(460).fill('word').join(' '),
      tags: ['ai-products'],
    },
    {
      slug: 'amazon-writing-culture',
      title: 'Amazon Writing Culture',
      date: 'February 1, 2024',
      excerpt: 'Amazon excerpt',
      content: Array(230).fill('word').join(' '),
      tags: ['big-tech'],
    },
    {
      slug: 'old-post-2023',
      title: 'Old Post From 2023',
      date: 'December 15, 2023',
      excerpt: 'An older post excerpt.',
      content: Array(230).fill('word').join(' '),
      tags: ['career'],
    },
    {
      slug: 'leadership-post-2023',
      title: 'Leadership Post 2023',
      date: 'November 1, 2023',
      excerpt: 'Leadership excerpt.',
      content: Array(460).fill('word').join(' '),
      tags: ['engineering-leadership'],
    },
  ],
}));

describe('Home page', () => {
  it('renders the tag filter bar with 5 tag buttons', () => {
    renderWithRouter(<Home />);
    const toolbar = screen.getByRole('toolbar', { name: 'Filter posts by topic' });
    const tagButtons = toolbar.querySelectorAll('button');
    expect(tagButtons).toHaveLength(5);
    expect(screen.getByRole('button', { name: 'AI Products' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Leadership' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Career' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Big Tech' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Building' })).toBeInTheDocument();
  });

  it('filter bar has role="toolbar" and aria-label', () => {
    renderWithRouter(<Home />);
    const toolbar = screen.getByRole('toolbar', { name: 'Filter posts by topic' });
    expect(toolbar).toBeInTheDocument();
  });

  it('clicking a tag filters the post list to matching posts only', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'Career' }));

    expect(screen.getByText('Regular Post Title')).toBeInTheDocument();
    expect(screen.queryByText('Featured Post Title')).not.toBeInTheDocument();
  });

  it('clicking an active tag clears the filter', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'Career' }));
    expect(screen.queryByText('Featured Post Title')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Career' }));
    // After clearing, featured section should be back (non-featured posts show in All Posts)
    expect(screen.getByText('Featured Post Title')).toBeInTheDocument();
  });

  it('"Featured" heading is visually hidden (sr-only) when no filter', () => {
    renderWithRouter(<Home />);
    const featured = screen.getByText('Featured');
    expect(featured).toBeInTheDocument();
    expect(featured.className).toContain('sr-only');
  });

  it('"Featured" sr-only text hides when a filter is active', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'AI Products' }));

    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('NewsletterCTA compact renders RSS link on homepage', () => {
    renderWithRouter(<Home />);
    expect(screen.getByLabelText('Subscribe via RSS feed')).toBeInTheDocument();
  });

  it('NewsletterCTA compact hides when a filter is active', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    expect(screen.getByText('Stay in the loop')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Career' }));

    expect(screen.queryByText('Stay in the loop')).not.toBeInTheDocument();
  });

  it('shows "All Posts" heading with count by default', () => {
    renderWithRouter(<Home />);
    const heading = screen.getByRole('heading', { level: 2, name: /All Posts/ });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('(7)');
  });

  it('shows filtered tag name with count as heading when filter is active', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'Career' }));

    const heading = screen.getByRole('heading', { level: 2, name: /Career/ });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('(2)');
  });

  it('renders new tagline about building AI for hundreds of millions', () => {
    renderWithRouter(<Home />);
    expect(
      screen.getByText('What building AI for hundreds of millions of people is actually like.')
    ).toBeInTheDocument();
  });

  it('StartHere section renders on home page when no tag filter is active', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('heading', { name: /Start here/ })).toBeInTheDocument();
  });

  it('StartHere section hides when a tag filter is active', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'Career' }));

    expect(screen.queryByRole('heading', { name: 'Start here' })).not.toBeInTheDocument();
  });

  it('groups posts under year headings (h3)', () => {
    renderWithRouter(<Home />);
    const yearHeading = screen.getByRole('heading', { level: 3, name: '2024' });
    expect(yearHeading).toBeInTheDocument();
    expect(yearHeading.id).toBe('year-2024');
  });

  it('year-group sections have aria-labelledby pointing to year heading', () => {
    renderWithRouter(<Home />);
    const section = document.querySelector('section.year-group');
    expect(section).not.toBeNull();
    expect(section!.getAttribute('aria-labelledby')).toBe('year-2024');
  });

  it('year groups work with active tag filter', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'Career' }));

    const yearHeading = screen.getByRole('heading', { level: 3, name: '2024' });
    expect(yearHeading).toBeInTheDocument();
  });

  it('does not show Clear button when no filter is active', () => {
    renderWithRouter(<Home />);
    expect(screen.queryByRole('button', { name: 'Clear filter' })).not.toBeInTheDocument();
  });

  it('shows Clear button when a tag filter is active', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'Career' }));

    expect(screen.getByRole('button', { name: 'Clear filter' })).toBeInTheDocument();
  });

  it('clicking Clear button removes the filter and shows all posts', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'Career' }));
    expect(screen.queryByText('Featured Post Title')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filter' }));
    expect(screen.getByText('Featured Post Title')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear filter' })).not.toBeInTheDocument();
  });

  it('renders a sentinel div before the tag filter bar for sticky detection', () => {
    renderWithRouter(<Home />);
    const sentinel = document.querySelector('.tag-filter-sentinel');
    expect(sentinel).not.toBeNull();
    expect(sentinel!.getAttribute('aria-hidden')).toBe('true');
  });

  it('tag filter bar has position sticky CSS class', () => {
    renderWithRouter(<Home />);
    const toolbar = screen.getByRole('toolbar', { name: 'Filter posts by topic' });
    expect(toolbar.className).toContain('tag-filter-bar');
  });

  // Post count tests (Issue #3)
  it('post-count span is aria-hidden with sr-only text for screen readers', () => {
    renderWithRouter(<Home />);
    const countSpan = document.querySelector('.all-posts-heading .post-count');
    expect(countSpan).not.toBeNull();
    expect(countSpan!.getAttribute('aria-hidden')).toBe('true');
    const srOnly = document.querySelector('.all-posts-heading .sr-only');
    expect(srOnly).not.toBeNull();
    expect(srOnly!.textContent).toBe('7 posts');
  });

  it('post count updates when filter changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'AI Products' }));

    const countSpan = document.querySelector('.all-posts-heading .post-count');
    expect(countSpan).not.toBeNull();
    expect(countSpan!.textContent).toContain('(3)');
    const srOnly = document.querySelector('.all-posts-heading .sr-only');
    expect(srOnly).not.toBeNull();
    expect(srOnly!.textContent).toBe('3 posts');
  });

  // Multi-year grouping (Issue #1)
  it('renders year headings for multiple years in descending order', () => {
    renderWithRouter(<Home />);
    const yearHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(yearHeadings.length).toBeGreaterThanOrEqual(2);
    expect(yearHeadings[0]).toHaveTextContent('2024');
    expect(yearHeadings[1]).toHaveTextContent('2023');
  });

  it('hides year groups that have no matching posts under active filter', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    // 'Big Tech' only has posts in 2024
    await user.click(screen.getByRole('button', { name: 'Big Tech' }));

    expect(screen.getByRole('heading', { level: 3, name: '2024' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: '2023' })).not.toBeInTheDocument();
  });

  it('shows both year groups when filter spans multiple years', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    // 'Career' has posts in both 2024 and 2023
    await user.click(screen.getByRole('button', { name: 'Career' }));

    expect(screen.getByRole('heading', { level: 3, name: '2024' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: '2023' })).toBeInTheDocument();
  });

  // Empty state for zero-match filter
  it('shows empty state message when filter matches no posts', () => {
    renderWithRouter(<Home />, { route: '/?tag=nonexistent' });
    const emptyState = document.querySelector('.empty-state');
    expect(emptyState).not.toBeNull();
    expect(emptyState!.textContent).toContain('No posts tagged');
    expect(emptyState!.textContent).toContain('nonexistent');
    expect(emptyState!.textContent).toContain('More essays are on the way');
  });

  // Clear button accessibility (Issue #2)
  it('Clear button SVG icon has aria-hidden', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'Career' }));

    const clearBtn = screen.getByRole('button', { name: 'Clear filter' });
    const svg = clearBtn.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
  });

  // Heading aria-live (Issue #3)
  it('all-posts heading has aria-live="polite" for dynamic updates', () => {
    renderWithRouter(<Home />);
    const heading = screen.getByRole('heading', { level: 2, name: /All Posts/ });
    expect(heading.getAttribute('aria-live')).toBe('polite');
  });

  // Sticky bar (Issue #5)
  it('tag-filter-bar does not have --stuck class by default', () => {
    renderWithRouter(<Home />);
    const toolbar = screen.getByRole('toolbar', { name: 'Filter posts by topic' });
    expect(toolbar.className).not.toContain('tag-filter-bar--stuck');
  });

  describe('sticky tag bar (IntersectionObserver)', () => {
    let observerCallback: IntersectionObserverCallback;

    beforeEach(() => {
      vi.stubGlobal('IntersectionObserver', class {
        constructor(cb: IntersectionObserverCallback) {
          observerCallback = cb;
        }
        observe = vi.fn();
        disconnect = vi.fn();
        unobserve = vi.fn();
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('adds --stuck class when sentinel leaves viewport', () => {
      renderWithRouter(<Home />);
      act(() => {
        observerCallback(
          [{ isIntersecting: false } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });
      const toolbar = screen.getByRole('toolbar', { name: 'Filter posts by topic' });
      expect(toolbar.className).toContain('tag-filter-bar--stuck');
    });

    it('removes --stuck class when sentinel re-enters viewport', () => {
      renderWithRouter(<Home />);
      act(() => {
        observerCallback(
          [{ isIntersecting: false } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });
      act(() => {
        observerCallback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });
      const toolbar = screen.getByRole('toolbar', { name: 'Filter posts by topic' });
      expect(toolbar.className).not.toContain('tag-filter-bar--stuck');
    });
  });
});
