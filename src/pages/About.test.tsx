import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import About from './About';
import { renderWithRouter } from '../test/helpers';

describe('About page', () => {
  it('renders "About" as the page heading (h1)', () => {
    renderWithRouter(<About />);
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
  });

  it('renders the opening bio paragraph', () => {
    renderWithRouter(<About />);
    expect(
      screen.getByText(/I have been writing since 2010/)
    ).toBeInTheDocument();
  });

  it('renders the WordPress history paragraph', () => {
    renderWithRouter(<About />);
    expect(
      screen.getByText(/I wrote on a WordPress blog/)
    ).toBeInTheDocument();
  });

  it('renders the software engineering paragraph', () => {
    renderWithRouter(<About />);
    expect(
      screen.getByText(/I build software for a living/)
    ).toBeInTheDocument();
  });

  it('renders the closing paragraph with anindya.dev link', () => {
    renderWithRouter(<About />);
    const link = screen.getByRole('link', { name: 'anindya.dev' });
    expect(link).toHaveAttribute('href', 'https://anindya.dev');
  });

  it('renders inside a <main> element', () => {
    renderWithRouter(<About />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
