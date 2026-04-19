import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import PostCard from './PostCard';
import { renderWithRouter, makePost } from '../test/helpers';

describe('PostCard', () => {
  it('shows reading time alongside date', () => {
    const post = makePost({ date: 'March 15, 2024', content: Array(460).fill('word').join(' ') });
    renderWithRouter(<PostCard post={post} />);
    expect(screen.getByText('2 min read')).toBeInTheDocument();
    expect(screen.getByText('March 15, 2024')).toBeInTheDocument();
  });

  it('shows inline tag pills for a post with tags', () => {
    const post = makePost({ tags: ['ai-products', 'career'] });
    renderWithRouter(<PostCard post={post} />);
    expect(screen.getByRole('link', { name: 'AI Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Career' })).toBeInTheDocument();
  });

  it('does not render tag section when post has no tags', () => {
    const post = makePost({ tags: [] });
    renderWithRouter(<PostCard post={post} />);
    expect(screen.queryByLabelText('Topics')).not.toBeInTheDocument();
  });

  it('renders the post title as a link to the post page', () => {
    const post = makePost({ slug: 'my-post', title: 'My Post Title' });
    renderWithRouter(<PostCard post={post} />);
    const link = screen.getByRole('link', { name: 'My Post Title' });
    expect(link).toHaveAttribute('href', '/post/my-post');
  });

  it('renders the post excerpt', () => {
    const post = makePost({ excerpt: 'This is the excerpt text.' });
    renderWithRouter(<PostCard post={post} />);
    expect(screen.getByText('This is the excerpt text.')).toBeInTheDocument();
  });
});
