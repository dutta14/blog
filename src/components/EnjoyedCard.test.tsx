import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import EnjoyedCard from './EnjoyedCard';
import { renderWithRouter } from '../test/helpers';

describe('EnjoyedCard', () => {
  it('renders the "Enjoyed this?" heading', () => {
    renderWithRouter(<EnjoyedCard />);
    expect(screen.getByText('Enjoyed this?')).toBeInTheDocument();
  });

  it('renders an RSS link pointing to /blog/feed.xml', () => {
    renderWithRouter(<EnjoyedCard />);
    const link = screen.getByLabelText('Subscribe via RSS feed');
    expect(link).toHaveAttribute('href', '/blog/feed.xml');
  });

  it('renders descriptive text about the content', () => {
    renderWithRouter(<EnjoyedCard />);
    expect(screen.getByText(/essays every few weeks/i)).toBeInTheDocument();
  });

  it('link text says "Subscribe via RSS"', () => {
    renderWithRouter(<EnjoyedCard />);
    expect(screen.getByText('Subscribe via RSS')).toBeInTheDocument();
  });
});
