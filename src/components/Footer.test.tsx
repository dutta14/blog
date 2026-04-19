import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders "RSS Feed" link pointing to /blog/feed.xml', () => {
    render(<Footer />);
    const link = screen.getByLabelText('RSS feed');
    expect(link).toHaveAttribute('href', '/blog/feed.xml');
    expect(link).toHaveTextContent('RSS Feed');
  });

  it('renders the author name', () => {
    render(<Footer />);
    expect(screen.getByText('Anindya Dutta')).toBeInTheDocument();
  });

  it('footer is rendered with the correct semantic element', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
