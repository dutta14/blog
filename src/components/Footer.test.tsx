import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Footer from './Footer';
import { renderWithRouter } from '../test/helpers';
import { posts } from '../data/posts';

describe('Footer', () => {
  it('renders "RSS" link pointing to /blog/feed.xml', () => {
    renderWithRouter(<Footer />);
    const link = screen.getByLabelText('RSS feed');
    expect(link).toHaveAttribute('href', '/blog/feed.xml');
    expect(link).toHaveTextContent('RSS');
  });

  it('renders the author name', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('Anindya Dutta')).toBeInTheDocument();
  });

  it('footer is rendered with the correct semantic element', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders dynamic post count with "essays and counting"', () => {
    renderWithRouter(<Footer />);
    expect(
      screen.getByText(`${posts.length} essays and counting`)
    ).toBeInTheDocument();
  });

  it('renders Writing link pointing to /', () => {
    renderWithRouter(<Footer />);
    const link = screen.getByRole('link', { name: 'Writing' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders About link pointing to /about', () => {
    renderWithRouter(<Footer />);
    const link = screen.getByRole('link', { name: 'About' });
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders Subscribe link pointing to /subscribe', () => {
    renderWithRouter(<Footer />);
    const link = screen.getByRole('link', { name: 'Subscribe' });
    expect(link).toHaveAttribute('href', '/subscribe');
  });

  it('has footer navigation landmark with aria-label', () => {
    renderWithRouter(<Footer />);
    const nav = screen.getByRole('navigation', { name: 'Footer navigation' });
    expect(nav).toBeInTheDocument();
  });
});
