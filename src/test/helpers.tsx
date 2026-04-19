import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import type { Post } from '../data/posts';

export function renderWithRouter(ui: ReactNode, { route = '/' }: { route?: string } = {}) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </HelmetProvider>
  );
}

export function makePost(overrides: Partial<Post> = {}): Post {
  return {
    slug: 'test-post',
    title: 'Test Post Title',
    date: 'January 1, 2024',
    excerpt: 'A test excerpt for the post.',
    content: Array(460).fill('word').join(' '),
    tags: ['ai-products', 'career'],
    ...overrides,
  };
}
