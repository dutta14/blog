import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
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

  it('featured section hides when a filter is active', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    // Featured section should be visible by default
    expect(screen.getByText('Featured')).toBeInTheDocument();

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

  it('shows "All Posts" heading by default', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('heading', { name: 'All Posts' })).toBeInTheDocument();
  });

  it('shows filtered tag name as heading when filter is active', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: 'Career' }));

    expect(screen.getByRole('heading', { name: 'Career' })).toBeInTheDocument();
  });
});
