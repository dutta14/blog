import '../styles/AuthorCard.css';

export default function AuthorCard() {
  return (
    <aside className="author-card" aria-label="About the author">
      <div className="author-card-inner">
        <div className="author-card-text">
          <span className="author-card-name">Anindya Dutta</span>
          <span className="author-card-role">
            Principal SWE Manager, Microsoft · M365 Copilot
          </span>
          <span className="author-card-bio">
            Writing about engineering leadership, AI products, and the decisions
            behind them.
          </span>
        </div>
        <a href="https://anindya.dev" className="author-card-link">
          anindya.dev
          <svg
            className="author-card-link-icon"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 11L11 5M11 5H6M11 5V10" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
