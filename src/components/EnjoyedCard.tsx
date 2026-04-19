export default function EnjoyedCard() {
  return (
    <div className="enjoyed-card">
      <span className="enjoyed-card-heading">Enjoyed this?</span>
      <span className="enjoyed-card-description">
        I publish new essays every few weeks on engineering, AI, and career decisions. RSS is the best way to keep up without the noise.
      </span>
      <a
        className="enjoyed-card-rss-link"
        href="/blog/feed.xml"
        aria-label="Subscribe via RSS feed"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="6.18" cy="17.82" r="2.18" />
          <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
        </svg>
        Subscribe via RSS
      </a>
    </div>
  );
}
