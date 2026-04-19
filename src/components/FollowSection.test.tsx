import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import FollowSection from './FollowSection';
import { renderWithRouter } from '../test/helpers';

describe('FollowSection', () => {
  it('renders the "Follow along" heading', () => {
    renderWithRouter(<FollowSection />);
    expect(screen.getByText('Follow along')).toBeInTheDocument();
  });

  it('renders an RSS subscribe link pointing to /blog/feed.xml', () => {
    renderWithRouter(<FollowSection />);
    const link = screen.getByLabelText('Subscribe via RSS feed');
    expect(link).toHaveAttribute('href', '/blog/feed.xml');
  });

  it('RSS link contains "Subscribe via RSS" text', () => {
    renderWithRouter(<FollowSection />);
    expect(screen.getByText('Subscribe via RSS')).toBeInTheDocument();
  });

  it('renders descriptive text about the content', () => {
    renderWithRouter(<FollowSection />);
    expect(screen.getByText(/engineering leadership/i)).toBeInTheDocument();
  });
});
