import { Link } from 'react-router-dom';
import { posts } from '../data/posts';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-left">
            <span className="footer-text">Anindya Dutta</span>
            <span className="footer-post-count">{posts.length} {posts.length === 1 ? 'essay' : 'essays'} and counting</span>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <Link to="/" className="footer-nav-link">Writing</Link>
            <Link to="/about" className="footer-nav-link">About</Link>
            <Link to="/subscribe" className="footer-nav-link">Subscribe</Link>
            <a href="/blog/feed.xml" className="footer-nav-link footer-rss" aria-label="RSS feed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="6.18" cy="17.82" r="2.18" />
                <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
              </svg>
              RSS
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
