import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Subscribe from './Subscribe';
import { renderWithRouter } from '../test/helpers';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  delete (window as Record<string, unknown>).umami;
});

/* ── Page structure ─────────────────────────────────────── */

describe('Subscribe page — structure', () => {
  it('renders "Subscribe" as h1', () => {
    renderWithRouter(<Subscribe />);
    expect(screen.getByRole('heading', { level: 1, name: 'Subscribe' })).toBeInTheDocument();
  });

  it('renders "← Back to Writing" link pointing to "/"', () => {
    renderWithRouter(<Subscribe />);
    const link = screen.getByRole('link', { name: '← Back to Writing' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders description text about essays', () => {
    renderWithRouter(<Subscribe />);
    expect(
      screen.getByText(/I publish new essays every few weeks/)
    ).toBeInTheDocument();
  });

  it('renders frequency text "~2 emails per month"', () => {
    renderWithRouter(<Subscribe />);
    expect(screen.getByText(/~2 emails per month/)).toBeInTheDocument();
  });

  it('renders email input with accessible label', () => {
    renderWithRouter(<Subscribe />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('renders subscribe button', () => {
    renderWithRouter(<Subscribe />);
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('renders "Prefer RSS?" label', () => {
    renderWithRouter(<Subscribe />);
    expect(screen.getByText('Prefer RSS?')).toBeInTheDocument();
  });

  it('renders RSS feed link pointing to /blog/feed.xml', () => {
    renderWithRouter(<Subscribe />);
    const link = screen.getByLabelText('Subscribe via RSS feed');
    expect(link).toHaveAttribute('href', '/blog/feed.xml');
  });

  it('renders RSS link text "Subscribe via RSS"', () => {
    renderWithRouter(<Subscribe />);
    expect(screen.getByText('Subscribe via RSS')).toBeInTheDocument();
  });

  it('renders privacy text', () => {
    renderWithRouter(<Subscribe />);
    expect(
      screen.getByText(/Your email goes to Buttondown/)
    ).toBeInTheDocument();
  });

  it('renders inside a <main> element', () => {
    renderWithRouter(<Subscribe />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

/* ── Honeypot ───────────────────────────────────────────── */

describe('Subscribe page — honeypot', () => {
  it('honeypot field is hidden', () => {
    renderWithRouter(<Subscribe />);
    const hp = document.querySelector('input[name="hp"]') as HTMLInputElement;
    expect(hp).not.toBeNull();
    expect(hp.style.display).toBe('none');
  });

  it('filling honeypot shows fake success without API call', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch);

    renderWithRouter(<Subscribe />);

    const hp = document.querySelector('input[name="hp"]') as HTMLInputElement;
    hp.value = 'bot';

    await user.type(screen.getByLabelText('Email address'), 'bot@spam.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByText(/You're in/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

/* ── Successful submission ──────────────────────────────── */

describe('Subscribe page — successful submission', () => {
  it('shows success message after successful API response', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/You're in/)).toBeInTheDocument();
    });
  });

  it('hides the form after successful submission', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument();
    });
  });

  it('RSS section remains visible after successful subscription', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/You're in/)).toBeInTheDocument();
    });
    // RSS section is outside the form conditional — should persist
    expect(screen.getByText('Prefer RSS?')).toBeInTheDocument();
    expect(screen.getByLabelText('Subscribe via RSS feed')).toBeInTheDocument();
  });
});

/* ── Error states ───────────────────────────────────────── */

describe('Subscribe page — error states', () => {
  it('shows "already subscribed" message on 409 response', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 409 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/already subscribed/)).toBeInTheDocument();
    });
  });

  it('shows "Something went wrong" on server error', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it('shows "Something went wrong" on network failure', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it('error message has role="alert"', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

/* ── Loading state ──────────────────────────────────────── */

describe('Subscribe page — loading state', () => {
  it('shows "Subscribing…" during loading', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockReturnValueOnce(new Promise(() => {}));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByRole('button', { name: 'Subscribing…' })).toBeInTheDocument();
  });

  it('disables email input during loading', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockReturnValueOnce(new Promise(() => {}));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByLabelText('Email address')).toBeDisabled();
  });

  it('disables submit button during loading', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockReturnValueOnce(new Promise(() => {}));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByRole('button', { name: 'Subscribing…' })).toBeDisabled();
  });
});

/* ── Analytics ──────────────────────────────────────────── */

describe('Subscribe page — analytics', () => {
  it('tracks newsletter-subscribe on success with location "subscribe-page"', async () => {
    const user = userEvent.setup();
    const trackFn = vi.fn();
    window.umami = { track: trackFn };
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(trackFn).toHaveBeenCalledWith('newsletter-subscribe', { location: 'subscribe-page' });
    });
  });

  it('tracks newsletter-subscribe-error on failure', async () => {
    const user = userEvent.setup();
    const trackFn = vi.fn();
    window.umami = { track: trackFn };
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(trackFn).toHaveBeenCalledWith('newsletter-subscribe-error', { error: 'api-failure' });
    });
  });

  it('does not crash when window.umami is undefined', async () => {
    const user = userEvent.setup();
    expect(window.umami).toBeUndefined();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');

    await expect(
      user.click(screen.getByRole('button', { name: 'Subscribe' }))
    ).resolves.not.toThrow();
  });

  it('tracks rss-subscribe-click when RSS link is clicked', async () => {
    const user = userEvent.setup();
    const trackFn = vi.fn();
    window.umami = { track: trackFn };

    renderWithRouter(<Subscribe />);
    await user.click(screen.getByLabelText('Subscribe via RSS feed'));

    expect(trackFn).toHaveBeenCalledWith('rss-subscribe-click', { location: 'subscribe-page' });
  });
});

/* ── API call ───────────────────────────────────────────── */

describe('Subscribe page — API call', () => {
  it('sends POST to Buttondown with URL-encoded email', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderWithRouter(<Subscribe />);
    await user.type(screen.getByLabelText('Email address'), 'hello@world.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'https://buttondown.com/api/emails/embed-subscribe/anindya',
        expect.objectContaining({
          method: 'POST',
          body: 'email=hello%40world.com',
        })
      );
    });
  });
});
