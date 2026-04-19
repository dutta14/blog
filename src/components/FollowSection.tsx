export default function FollowSection() {
  return (
    <div className="follow-section">
      <div className="follow-section-inner">
        <div className="follow-section-text">
          <span className="follow-section-heading">Follow along</span>
          <span className="follow-section-description">
            New essays on engineering leadership, AI products, and career decisions. Delivered by RSS, no algorithms.
          </span>
        </div>
        <a
          className="follow-section-rss-link"
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
    </div>
  );
}
