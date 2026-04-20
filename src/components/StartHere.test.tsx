import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import StartHere from './StartHere';
import { renderWithRouter } from '../test/helpers';
import type { Post } from '../data/posts';

const mockPosts: Post[] = [
  {
    slug: 'first-post',
    title: 'First Post Title',
    date: 'January 1, 2024',
    excerpt: 'First post excerpt text.',
    content: 'Some content here.',
    tags: ['ai-products'],
  },
  {
    slug: 'second-post',
    title: 'Second Post Title',
    date: 'February 1, 2024',
    excerpt: 'Second post excerpt text.',
    content: 'More content here.',
    tags: ['career'],
  },
  {
    slug: 'third-post',
    title: 'Third Post Title',
    date: 'March 1, 2024',
    excerpt: 'Third post excerpt text.',
    content: 'Even more content.',
    tags: [],
  },
];

describe('StartHere', () => {
  it('renders "Start here" heading', () => {
    renderWithRouter(<StartHere posts={mockPosts} />);
    expect(screen.getByRole('heading', { name: 'Start here' })).toBeInTheDocument();
  });

  it('renders description "New to the blog? These essays capture what I write about most."', () => {
    renderWithRouter(<StartHere posts={mockPosts} />);
    expect(
      screen.getByText('New to the blog? These essays capture what I write about most.')
    ).toBeInTheDocument();
  });

  it('renders correct number of posts passed via props', () => {
    renderWithRouter(<StartHere posts={mockPosts} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('each post links to /post/{slug}', () => {
    renderWithRouter(<StartHere posts={mockPosts} />);
    mockPosts.forEach((post) => {
      const link = screen.getByRole('link', { name: new RegExp(post.title) });
      expect(link).toHaveAttribute('href', `/post/${post.slug}`);
    });
  });

  it('shows post title and excerpt', () => {
    renderWithRouter(<StartHere posts={mockPosts} />);
    mockPosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.excerpt)).toBeInTheDocument();
    });
  });

  it('returns null when posts array is empty', () => {
    const { container } = renderWithRouter(<StartHere posts={[]} />);
    expect(container.querySelector('.start-here')).toBeNull();
  });

  it('uses ordered list (ol element)', () => {
    renderWithRouter(<StartHere posts={mockPosts} />);
    const ol = document.querySelector('ol.start-here-list');
    expect(ol).not.toBeNull();
  });

  it('has aria-labelledby linking heading to section', () => {
    renderWithRouter(<StartHere posts={mockPosts} />);
    const section = document.querySelector('section.start-here');
    expect(section).not.toBeNull();
    expect(section!.getAttribute('aria-labelledby')).toBe('start-here-heading');
    const heading = document.getElementById('start-here-heading');
    expect(heading).not.toBeNull();
    expect(heading!.textContent).toBe('Start here');
  });
});
