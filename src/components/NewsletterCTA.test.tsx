import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterCTA from './NewsletterCTA';
import { renderWithRouter } from '../test/helpers';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  delete (window as Record<string, unknown>).umami;
});

/* ── Full variant (default) ─────────────────────────────── */

describe('NewsletterCTA — full variant', () => {
  it('renders heading "Get new essays by email"', () => {
    renderWithRouter(<NewsletterCTA />);
    expect(screen.getByText('Get new essays by email')).toBeInTheDocument();
  });

  it('renders an accessible email input with screen-reader label', () => {
    renderWithRouter(<NewsletterCTA />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('renders a subscribe button', () => {
    renderWithRouter(<NewsletterCTA />);
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('renders "Prefer RSS?" link pointing to /blog/feed.xml', () => {
    renderWithRouter(<NewsletterCTA />);
    const rssLink = screen.getByLabelText('Subscribe via RSS feed');
    expect(rssLink).toHaveAttribute('href', '/blog/feed.xml');
    expect(screen.getByText('Prefer RSS?')).toBeInTheDocument();
  });

  it('renders privacy disclosure text', () => {
    renderWithRouter(<NewsletterCTA />);
    expect(
      screen.getByText(/Your email goes to Buttondown, not a marketing database/)
    ).toBeInTheDocument();
  });

  it('renders as an aside element with aria-labelledby', () => {
    renderWithRouter(<NewsletterCTA />);
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-labelledby', 'newsletter-cta-heading');
  });

  it('email input has type="email" and required attribute', () => {
    renderWithRouter(<NewsletterCTA />);
    const input = screen.getByLabelText('Email address');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
  });
});

/* ── Compact variant ────────────────────────────────────── */

describe('NewsletterCTA — compact variant', () => {
  it('renders heading "Stay in the loop"', () => {
    renderWithRouter(<NewsletterCTA variant="compact" />);
    expect(screen.getByText('Stay in the loop')).toBeInTheDocument();
  });

  it('renders RSS link in compact footer', () => {
    renderWithRouter(<NewsletterCTA variant="compact" />);
    const rssLink = screen.getByLabelText('Subscribe via RSS feed');
    expect(rssLink).toHaveAttribute('href', '/blog/feed.xml');
    expect(screen.getByText('RSS')).toBeInTheDocument();
  });

  it('renders description text', () => {
    renderWithRouter(<NewsletterCTA variant="compact" />);
    expect(
      screen.getByText(/New essays on engineering leadership/)
    ).toBeInTheDocument();
  });

  it('renders as an aside with compact aria-labelledby', () => {
    renderWithRouter(<NewsletterCTA variant="compact" />);
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-labelledby', 'newsletter-cta-heading-compact');
  });
});

/* ── Honeypot ───────────────────────────────────────────── */

describe('NewsletterCTA — honeypot protection', () => {
  it('honeypot field is hidden with display:none', () => {
    renderWithRouter(<NewsletterCTA />);
    const hp = document.querySelector('input[name="hp"]') as HTMLInputElement;
    expect(hp).not.toBeNull();
    expect(hp.style.display).toBe('none');
    expect(hp.tabIndex).toBe(-1);
  });

  it('filling honeypot shows fake success without making API call', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch);

    renderWithRouter(<NewsletterCTA />);

    // Fill honeypot via DOM (hidden from user, but bots fill it)
    const hp = document.querySelector('input[name="hp"]') as HTMLInputElement;
    hp.value = 'bot-value';

    // Fill the visible email and submit
    await user.type(screen.getByLabelText('Email address'), 'bot@spam.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    // Should show success (full variant includes the inbox confirmation text)
    expect(screen.getByText(/You're in/)).toBeInTheDocument();
    // Should NOT have called fetch
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

/* ── Successful submission ──────────────────────────────── */

describe('NewsletterCTA — successful submission', () => {
  it('shows success message "You\'re in" after successful API response (full)', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/You're in/)).toBeInTheDocument();
    });
  });

  it('hides the form after successful submission', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument();
    });
  });

  it('hides RSS link after successful submission (full variant)', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.queryByText('Prefer RSS?')).not.toBeInTheDocument();
    });
  });

  it('shows compact success text "You\'re in" in compact variant', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<NewsletterCTA variant="compact" />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText("You're in")).toBeInTheDocument();
    });
  });

  it('hides compact RSS footer after successful submission', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<NewsletterCTA variant="compact" />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('Subscribe via RSS feed')).not.toBeInTheDocument();
    });
  });
});

/* ── Error states ───────────────────────────────────────── */

describe('NewsletterCTA — error states', () => {
  it('shows "already subscribed" message on 409 response', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 409 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/already subscribed/)).toBeInTheDocument();
    });
  });

  it('shows "Something went wrong" on non-409 error response', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it('shows "Something went wrong" on network error', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it('error message has role="alert" for screen reader announcement', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('error message appears in compact variant too', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

    renderWithRouter(<NewsletterCTA variant="compact" />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });
});

/* ── Loading state ──────────────────────────────────────── */

describe('NewsletterCTA — loading state', () => {
  it('shows "Subscribing…" button text during loading', async () => {
    const user = userEvent.setup();
    // Never-resolving promise to keep loading state
    vi.mocked(fetch).mockReturnValueOnce(new Promise(() => {}));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByRole('button', { name: 'Subscribing…' })).toBeInTheDocument();
  });

  it('disables the input during loading', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockReturnValueOnce(new Promise(() => {}));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByLabelText('Email address')).toBeDisabled();
  });

  it('disables the button during loading', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockReturnValueOnce(new Promise(() => {}));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByRole('button', { name: 'Subscribing…' })).toBeDisabled();
  });
});

/* ── Analytics ──────────────────────────────────────────── */

describe('NewsletterCTA — analytics', () => {
  it('tracks newsletter-subscribe on success with correct location', async () => {
    const user = userEvent.setup();
    const trackFn = vi.fn();
    window.umami = { track: trackFn };
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<NewsletterCTA location="post-inline" />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(trackFn).toHaveBeenCalledWith('newsletter-subscribe', { location: 'post-inline' });
    });
  });

  it('tracks newsletter-subscribe-error on API failure', async () => {
    const user = userEvent.setup();
    const trackFn = vi.fn();
    window.umami = { track: trackFn };
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(trackFn).toHaveBeenCalledWith('newsletter-subscribe-error', { error: 'api-failure' });
    });
  });

  it('tracks newsletter-subscribe-error with already-subscribed on 409', async () => {
    const user = userEvent.setup();
    const trackFn = vi.fn();
    window.umami = { track: trackFn };
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 409 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(trackFn).toHaveBeenCalledWith('newsletter-subscribe-error', { error: 'already-subscribed' });
    });
  });

  it('does NOT crash when window.umami is undefined', async () => {
    const user = userEvent.setup();
    expect(window.umami).toBeUndefined();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');

    await expect(
      user.click(screen.getByRole('button', { name: 'Subscribe' }))
    ).resolves.not.toThrow();

    await waitFor(() => {
      expect(screen.getByText(/You're in/)).toBeInTheDocument();
    });
  });

  it('tracks rss-subscribe-click when RSS link is clicked (full)', async () => {
    const user = userEvent.setup();
    const trackFn = vi.fn();
    window.umami = { track: trackFn };

    renderWithRouter(<NewsletterCTA location="post-inline" />);
    await user.click(screen.getByLabelText('Subscribe via RSS feed'));

    expect(trackFn).toHaveBeenCalledWith('rss-subscribe-click', { location: 'post-inline' });
  });
});

/* ── API call ───────────────────────────────────────────── */

describe('NewsletterCTA — API call', () => {
  it('sends POST to Buttondown with URL-encoded email', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<NewsletterCTA />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'https://buttondown.com/api/emails/embed-subscribe/anindya',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'email=test%40example.com',
        })
      );
    });
  });
});
