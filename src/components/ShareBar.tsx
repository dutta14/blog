import { useState, useCallback, useEffect } from 'react';

interface Props {
  title: string;
  url: string;
}

export default function ShareBar({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const [isMobileShare, setIsMobileShare] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobileShare(
        window.innerWidth <= 768 && typeof navigator.share === 'function'
      );
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // User cancelled or not supported
    }
  }, [title, url]);

  if (isMobileShare) {
    return (
      <div className="share-bar" aria-label="Share this post">
        <button
          className="share-btn share-btn--native"
          aria-label="Share this post"
          onClick={handleNativeShare}
        >
          <svg className="share-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span className="share-btn-label">Share</span>
        </button>
      </div>
    );
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="share-bar" aria-label="Share this post">
      <a
        className="share-btn share-btn--linkedin"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share this post on LinkedIn (opens in new tab)"
      >
        <svg className="share-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
      <a
        className="share-btn share-btn--twitter"
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share this post on Twitter (opens in new tab)"
      >
        <svg className="share-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <button
        className={`share-btn share-btn--copy${copied ? ' copied' : ''}`}
        aria-label="Copy link to this post"
        onClick={handleCopy}
      >
        {copied ? (
          <svg className="share-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg className="share-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
        <span className="share-btn-label">{copied ? 'Link copied' : 'Copy link'}</span>
      </button>
      {copied && (
        <span className="sr-only" role="status" aria-live="polite">
          Link copied to clipboard
        </span>
      )}
    </div>
  );
}
