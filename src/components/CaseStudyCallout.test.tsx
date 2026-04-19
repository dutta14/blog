import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CaseStudyCallout from './CaseStudyCallout';

afterEach(() => {
  delete (window as unknown as Record<string, unknown>).umami;
});

/* ── Rendering for mapped slugs ─────────────────────────── */

describe('CaseStudyCallout — mapped slugs', () => {
  it('renders callout for "what-it-felt-like-to-ship-to-five-million-people"', () => {
    render(<CaseStudyCallout postSlug="what-it-felt-like-to-ship-to-five-million-people" />);
    expect(screen.getByText('Alexa Hands-Free')).toBeInTheDocument();
    expect(screen.getByText('From the portfolio')).toBeInTheDocument();
  });

  it('renders callout for "the-first-copilot-feature-nobody-saw"', () => {
    render(<CaseStudyCallout postSlug="the-first-copilot-feature-nobody-saw" />);
    expect(screen.getByText('Voice Assistant in Outlook')).toBeInTheDocument();
  });

  it('renders callout for "the-chatgpt-moment-from-inside-microsoft"', () => {
    render(<CaseStudyCallout postSlug="the-chatgpt-moment-from-inside-microsoft" />);
    expect(screen.getByText('M365 Copilot')).toBeInTheDocument();
  });

  it('renders callout for "what-copilot-is-becoming"', () => {
    render(<CaseStudyCallout postSlug="what-copilot-is-becoming" />);
    expect(screen.getByText('M365 Copilot')).toBeInTheDocument();
  });

  it('renders callout for "building-for-india-from-seattle"', () => {
    render(<CaseStudyCallout postSlug="building-for-india-from-seattle" />);
    expect(screen.getByText('Alexa Hands-Free')).toBeInTheDocument();
  });

  it('renders callout for "building-voice-on-a-phone-with-bad-signal"', () => {
    render(<CaseStudyCallout postSlug="building-voice-on-a-phone-with-bad-signal" />);
    expect(screen.getByText('Alexa Hands-Free')).toBeInTheDocument();
  });
});

/* ── Non-mapped slug ────────────────────────────────────── */

describe('CaseStudyCallout — unmapped slugs', () => {
  it('does not render anything for an unmapped slug', () => {
    const { container } = render(<CaseStudyCallout postSlug="some-random-post" />);
    expect(container.innerHTML).toBe('');
  });

  it('does not render anything for empty string slug', () => {
    const { container } = render(<CaseStudyCallout postSlug="" />);
    expect(container.innerHTML).toBe('');
  });
});

/* ── Link behavior ──────────────────────────────────────── */

describe('CaseStudyCallout — link behavior', () => {
  it('link points to portfolio products section', () => {
    render(<CaseStudyCallout postSlug="the-chatgpt-moment-from-inside-microsoft" />);
    const link = screen.getByRole('link', { name: /View M365 Copilot case study/i });
    expect(link).toHaveAttribute('href', 'https://anindya.dev/#products');
  });

  it('link opens in a new tab with noopener noreferrer', () => {
    render(<CaseStudyCallout postSlug="the-chatgpt-moment-from-inside-microsoft" />);
    const link = screen.getByRole('link', { name: /View M365 Copilot case study/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('link has descriptive aria-label including case study title', () => {
    render(<CaseStudyCallout postSlug="the-first-copilot-feature-nobody-saw" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'aria-label',
      'View Voice Assistant in Outlook case study on portfolio site (opens in new tab)'
    );
  });

  it('link text says "View case study →"', () => {
    render(<CaseStudyCallout postSlug="the-chatgpt-moment-from-inside-microsoft" />);
    expect(screen.getByText('View case study →')).toBeInTheDocument();
  });
});

/* ── Description ────────────────────────────────────────── */

describe('CaseStudyCallout — content', () => {
  it('renders the description text about product and engineering decisions', () => {
    render(<CaseStudyCallout postSlug="the-chatgpt-moment-from-inside-microsoft" />);
    expect(
      screen.getByText(/See the product, team structure, and engineering decisions/)
    ).toBeInTheDocument();
  });
});

/* ── Analytics ──────────────────────────────────────────── */

describe('CaseStudyCallout — analytics', () => {
  it('tracks case-study-callout-click on link click', async () => {
    const user = userEvent.setup();
    const trackFn = vi.fn();
    window.umami = { track: trackFn };

    render(<CaseStudyCallout postSlug="the-chatgpt-moment-from-inside-microsoft" />);
    await user.click(screen.getByRole('link'));

    expect(trackFn).toHaveBeenCalledWith('case-study-callout-click', { caseStudy: 'm365-copilot' });
  });

  it('does not crash when window.umami is undefined on click', async () => {
    const user = userEvent.setup();
    expect(window.umami).toBeUndefined();

    render(<CaseStudyCallout postSlug="the-chatgpt-moment-from-inside-microsoft" />);
    await expect(user.click(screen.getByRole('link'))).resolves.not.toThrow();
  });
});
