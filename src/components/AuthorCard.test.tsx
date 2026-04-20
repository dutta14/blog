import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthorCard from './AuthorCard';

describe('AuthorCard', () => {
  it('renders "Anindya Dutta" name', () => {
    render(<AuthorCard />);
    expect(screen.getByText('Anindya Dutta')).toBeInTheDocument();
  });

  it('renders role text "Principal SWE Manager, Microsoft · M365 Copilot"', () => {
    render(<AuthorCard />);
    expect(
      screen.getByText('Principal SWE Manager, Microsoft · M365 Copilot')
    ).toBeInTheDocument();
  });

  it('renders bio text about engineering leadership', () => {
    render(<AuthorCard />);
    expect(
      screen.getByText(/Writing about engineering leadership, AI products, and the decisions/)
    ).toBeInTheDocument();
  });

  it('renders anindya.dev link pointing to https://anindya.dev', () => {
    render(<AuthorCard />);
    const link = screen.getByRole('link', { name: /anindya\.dev/ });
    expect(link).toHaveAttribute('href', 'https://anindya.dev');
  });

  it('link has an SVG icon with aria-hidden="true"', () => {
    render(<AuthorCard />);
    const link = screen.getByRole('link', { name: /anindya\.dev/ });
    const svg = link.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders as aside with aria-label="About the author"', () => {
    render(<AuthorCard />);
    const aside = screen.getByRole('complementary', { name: 'About the author' });
    expect(aside).toBeInTheDocument();
  });
});
