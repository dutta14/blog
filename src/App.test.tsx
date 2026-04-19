import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mock posts data consistently for all route tests
vi.mock('./data/posts', () => ({
  TAG_LABELS: {
    'ai-products': 'AI Products',
    'career': 'Career',
  },
  featuredSlugs: new Set([]),
  posts: [
    {
      slug: 'test-post',
      title: 'Test Post',
      date: 'June 1, 2024',
      excerpt: 'Test excerpt',
      content: Array(460).fill('word').join(' '),
      tags: ['ai-products'],
    },
  ],
}));

// We test routes by rendering each page component directly with MemoryRouter
// to avoid coupling to App's BrowserRouter
import Home from './pages/Home';
import About from './pages/About';
import Subscribe from './pages/Subscribe';
import Post from './pages/Post';

function renderRoute(initialEntries: string[]) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('App routes', () => {
  it('"/" renders the Home page with "Writing" heading', () => {
    renderRoute(['/']);
    expect(screen.getByRole('heading', { level: 1, name: 'Writing' })).toBeInTheDocument();
  });

  it('"/about" renders the About page', () => {
    renderRoute(['/about']);
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
  });

  it('"/subscribe" renders the Subscribe page', () => {
    renderRoute(['/subscribe']);
    expect(screen.getByRole('heading', { level: 1, name: 'Subscribe' })).toBeInTheDocument();
  });

  it('"/post/:slug" renders the Post page for a valid slug', () => {
    renderRoute(['/post/test-post']);
    expect(screen.getByRole('heading', { level: 1, name: 'Test Post' })).toBeInTheDocument();
  });

  it('"/post/:slug" shows "Post not found" for an invalid slug', () => {
    renderRoute(['/post/nonexistent']);
    expect(screen.getByText('Post not found.')).toBeInTheDocument();
  });

  it('unknown route renders the fallback', () => {
    renderRoute(['/unknown-route']);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });
});
