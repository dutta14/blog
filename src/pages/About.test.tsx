import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import About from './About';
import { renderWithRouter } from '../test/helpers';
import { startHereSlugs, posts } from '../data/posts';

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

  it('renders new intro sentence about M365 Copilot', () => {
    renderWithRouter(<About />);
    expect(
      screen.getByText(/I lead the team that builds M365 Copilot at Microsoft/)
    ).toBeInTheDocument();
  });

  it('JSON-LD Person script is present', () => {
    renderWithRouter(<About />);
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const contents = Array.from(scripts).map(s => s.textContent ?? '');
    const hasPerson = contents.some(c => c.includes('"Person"'));
    expect(hasPerson).toBe(true);
  });

  it('original paragraph text still exists', () => {
    renderWithRouter(<About />);
    expect(screen.getByText(/I have been writing since 2010/)).toBeInTheDocument();
    expect(screen.getByText(/I wrote on a WordPress blog/)).toBeInTheDocument();
    expect(screen.getByText(/I build software for a living/)).toBeInTheDocument();
  });

  it('renders "Start here" heading in the start-here section', () => {
    renderWithRouter(<About />);
    expect(screen.getByRole('heading', { level: 2, name: 'Start here' })).toBeInTheDocument();
  });

  it('renders description text for start-here section', () => {
    renderWithRouter(<About />);
    expect(
      screen.getByText("If you're new, these essays capture what I write about most.")
    ).toBeInTheDocument();
  });

  it('renders first 4 start-here posts as links', () => {
    renderWithRouter(<About />);
    const expectedSlugs = startHereSlugs.slice(0, 4);
    expectedSlugs.forEach(slug => {
      const post = posts.find(p => p.slug === slug);
      if (post) {
        const link = screen.getByRole('link', { name: post.title });
        expect(link).toHaveAttribute('href', `/post/${slug}`);
      }
    });
  });

  it('uses ordered list for start-here posts', () => {
    renderWithRouter(<About />);
    const ol = document.querySelector('ol.about-start-here-list');
    expect(ol).not.toBeNull();
  });

  it('has aria-labelledby linking heading to start-here section', () => {
    renderWithRouter(<About />);
    const section = document.querySelector('section.about-start-here');
    expect(section).not.toBeNull();
    expect(section!.getAttribute('aria-labelledby')).toBe('about-start-here-heading');
    const heading = document.getElementById('about-start-here-heading');
    expect(heading).not.toBeNull();
    expect(heading!.textContent).toBe('Start here');
  });
});
