import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/Subscribe.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

const BUTTONDOWN_URL = 'https://buttondown.com/api/emails/embed-subscribe/anindya';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

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
        window.umami?.track('newsletter-subscribe', { location: 'subscribe-page' });
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

  return (
    <>
      <Helmet>
        <title>Subscribe — Anindya Dutta</title>
        <meta name="description" content="Get new essays on engineering, leadership, and building things. Delivered by email, every few weeks." />
        <meta property="og:title" content="Subscribe — Anindya Dutta" />
        <meta property="og:description" content="Get new essays on engineering, leadership, and building things. Delivered by email, every few weeks." />
        <meta property="og:url" content="https://anindya.dev/blog/subscribe" />
        <meta property="og:image" content="https://anindya.dev/img/og-card.png" />
        <link rel="canonical" href="https://anindya.dev/blog/subscribe" />
      </Helmet>
      <main className="container">
        <div className="subscribe-page">
          <Link to="/" className="subscribe-back">← Back to Writing</Link>
          <h1>Subscribe</h1>

          <p className="subscribe-description">
            I publish new essays every few weeks on engineering leadership, AI product development,
            and career decisions. Each one is something I've actually learned, not a repackaged thread.
          </p>
          <p className="subscribe-frequency">
            ~2 emails per month. No spam. No promotions.
          </p>

          {status === 'success' ? (
            <div className="subscribe-form-success">
              <svg
                className="subscribe-form-success-icon"
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
              <span className="subscribe-form-success-text">
                You're in. Check your inbox to confirm your subscription.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="hp"
                ref={honeypotRef}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              <div className="subscribe-form-field">
                <label htmlFor="subscribe-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="subscribe-email"
                  className="subscribe-form-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                <button
                  className="subscribe-form-button"
                  type="submit"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </div>
              {status === 'error' && errorMessage && (
                <p className="subscribe-form-error" role="alert" aria-live="assertive">
                  {errorMessage}
                </p>
              )}
              <p className="subscribe-form-privacy">
                Your email goes to Buttondown, not a marketing database. Unsubscribe anytime.
              </p>
            </form>
          )}

          <div className="subscribe-rss">
            <span className="subscribe-rss-label">Prefer RSS?</span>
            <a
              className="subscribe-rss-link"
              href="/blog/feed.xml"
              aria-label="Subscribe via RSS feed"
              onClick={() => window.umami?.track('rss-subscribe-click', { location: 'subscribe-page' })}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="6.18" cy="17.82" r="2.18" />
                <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
              </svg>
              Subscribe via RSS
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
