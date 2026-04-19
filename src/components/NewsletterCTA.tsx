import { useState, useRef, useEffect } from 'react';
import '../styles/NewsletterCTA.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

const BUTTONDOWN_URL = 'https://buttondown.com/api/emails/embed-subscribe/anindya';

interface Props {
  variant?: 'full' | 'compact';
  location?: string;
}

const RSS_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="6.18" cy="17.82" r="2.18" />
    <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
  </svg>
);

function handleRssClick(location: string) {
  window.umami?.track('rss-subscribe-click', { location });
}

export default function NewsletterCTA({ variant = 'full', location = 'post-inline' }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isCompact = variant === 'compact';
  const headingId = isCompact ? 'newsletter-cta-heading-compact' : 'newsletter-cta-heading';
  const emailId = isCompact ? 'newsletter-cta-email-compact' : 'newsletter-cta-email';

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (honeypotRef.current?.value) {
      setStatus('success');
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(BUTTONDOWN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}`,
        signal: controller.signal,
      });

      if (res.ok) {
        setStatus('success');
        window.umami?.track('newsletter-subscribe', { location });
      } else if (res.status === 409) {
        setStatus('error');
        setErrorMessage('Looks like you\u2019re already subscribed.');
        window.umami?.track('newsletter-subscribe-error', { error: 'already-subscribed' });
      } else {
        setStatus('error');
        setErrorMessage('Something went wrong. Please try again.');
        window.umami?.track('newsletter-subscribe-error', { error: 'api-failure' });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setStatus('error');
        setErrorMessage('Something went wrong. Please try again.');
        window.umami?.track('newsletter-subscribe-error', { error: 'api-failure' });
      }
    }
  }

  const honeypotField = (
    <input
      type="text"
      name="hp"
      ref={honeypotRef}
      style={{ display: 'none' }}
      tabIndex={-1}
      autoComplete="off"
    />
  );

  const successContent = (
    <div className="newsletter-cta-success">
      <svg
        className="newsletter-cta-success-icon"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
        <path
          d="M6 10.5l2.5 2.5L14 7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="newsletter-cta-success-text">
        {isCompact ? "You're in" : "You're in. Check your inbox to confirm your subscription."}
      </span>
    </div>
  );

  if (isCompact) {
    return (
      <aside className="newsletter-cta newsletter-cta--compact" aria-labelledby={headingId}>
        <div className="newsletter-cta-compact-inner">
          <div className="newsletter-cta-compact-text">
            <span className="newsletter-cta-heading" id={headingId}>
              Stay in the loop
            </span>
            <span className="newsletter-cta-description">
              New essays on engineering leadership, AI products, and career decisions.
            </span>
          </div>
          {status === 'success' ? (
            successContent
          ) : (
            <form className="newsletter-cta-compact-form" onSubmit={handleSubmit}>
              {honeypotField}
              <div className="newsletter-cta-field">
                <label htmlFor={emailId} className="sr-only">
                  Email address
                </label>
                <input
                  id={emailId}
                  className="newsletter-cta-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                <button
                  className="newsletter-cta-button"
                  type="submit"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </div>
            </form>
          )}
        </div>
        {status === 'error' && errorMessage && (
          <p className="newsletter-cta-error" role="alert" aria-live="assertive">
            {errorMessage}
          </p>
        )}
        {status !== 'success' && (
          <div className="newsletter-cta-compact-footer">
            <span className="newsletter-cta-privacy">
              Delivered by Buttondown. Unsubscribe anytime.
            </span>
            <a
              href="/blog/feed.xml"
              className="newsletter-cta-rss-link"
              aria-label="Subscribe via RSS feed"
              onClick={() => handleRssClick(location)}
            >
              {RSS_ICON}
              RSS
            </a>
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className="newsletter-cta" aria-labelledby={headingId}>
      <span className="newsletter-cta-heading" id={headingId}>
        Get new essays by email
      </span>

      {status === 'success' ? (
        successContent
      ) : (
        <>
          <span className="newsletter-cta-description">
            I publish new essays every few weeks on engineering leadership, AI product development,
            and career decisions. No spam, no promotions — just essays.
          </span>
          <form onSubmit={handleSubmit}>
            {honeypotField}
            <div className="newsletter-cta-field">
              <label htmlFor={emailId} className="sr-only">
                Email address
              </label>
              <input
                id={emailId}
                className="newsletter-cta-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
              <button
                className="newsletter-cta-button"
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </div>
            {status === 'error' && errorMessage && (
              <p className="newsletter-cta-error" role="alert" aria-live="assertive">
                {errorMessage}
              </p>
            )}
          </form>
          <p className="newsletter-cta-privacy">
            Your email goes to Buttondown, not a marketing database. Unsubscribe anytime.
          </p>
          <span className="newsletter-cta-rss-alt">
            <a
              href="/blog/feed.xml"
              className="newsletter-cta-rss-link"
              aria-label="Subscribe via RSS feed"
              onClick={() => handleRssClick(location)}
            >
              {RSS_ICON}
              Prefer RSS?
            </a>
          </span>
        </>
      )}
    </aside>
  );
}
