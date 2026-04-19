import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { caseStudies } from '../../data/caseStudies';
import '../../styles/CaseStudy.css';

function getReadingTime(sections: { body: string }[]): number {
  const words = sections.reduce(
    (n, s) => n + s.body.split(/\s+/).filter(Boolean).length,
    0
  );
  return Math.max(1, Math.round(words / 200));
}

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeSection, setActiveSection] = useState(-1);
  const [progress, setProgress] = useState(0);

  const study = caseStudies.find(cs => cs.slug === slug);
  const idx = caseStudies.findIndex(cs => cs.slug === slug);
  const prev = idx > 0 ? caseStudies[idx - 1] : null;
  const next =
    idx >= 0 && idx < caseStudies.length - 1 ? caseStudies[idx + 1] : null;

  const readingTime = useMemo(
    () => (study ? getReadingTime(study.sections) : 0),
    [study]
  );

  /* Reset on navigation */
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSection(-1);
    setProgress(0);
  }, [slug]);

  /* Reading-progress bar */
  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector('.case-study') as HTMLElement | null;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(100);
        return;
      }
      setProgress(Math.min(100, Math.max(0, (-top / scrollable) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Active-section tracking for TOC highlight */
  useEffect(() => {
    if (!study) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = parseInt(entry.target.id.replace('section-', ''), 10);
            if (!isNaN(i)) setActiveSection(i);
          }
        }
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );

    study.sections.forEach((_, i) => {
      const el = document.getElementById(`section-${i}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [study]);

  const scrollToSection = useCallback((i: number) => {
    document.getElementById(`section-${i}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  /* ── Not found ── */
  if (!study) {
    return (
      <article className="case-study">
        <div className="cs-wrap">
          <div className="case-study-not-found">
            <p>Case study not found.</p>
            <Link to="/#products">← Back to projects</Link>
          </div>
        </div>
      </article>
    );
  }

  const { title, subtitle, image, role, company, year, impact, sections } =
    study;

  return (
    <>
      {/* Reading-progress indicator */}
      <div
        className="case-study-progress"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: `${progress}%` }}
      />

      <article className="case-study">
        {/* ── Hero header ─────────────────────────────────── */}
        <header className="case-study-hero">
          <div className="cs-wrap cs-wrap--wide">
            <Link to="/#products" className="case-study-back">
              <span className="case-study-back-arrow" aria-hidden="true">
                ←
              </span>
              All Projects
            </Link>

            <div className="case-study-meta">
              <span className="case-study-company">{company}</span>
              <span className="case-study-meta-dot" aria-hidden="true">
                ·
              </span>
              <span className="case-study-year">{year}</span>
              <span className="case-study-meta-dot" aria-hidden="true">
                ·
              </span>
              <span className="case-study-reading-time">
                {readingTime} min read
              </span>
            </div>

            <h1 className="case-study-title">{title}</h1>
            <p className="case-study-subtitle">{subtitle}</p>

            <div className="case-study-stats">
              <div className="case-study-stat">
                <span className="case-study-stat-label">Role</span>
                <span className="case-study-stat-value">{role}</span>
              </div>
              <div className="case-study-stat">
                <span className="case-study-stat-label">Year</span>
                <span className="case-study-stat-value">{year}</span>
              </div>
              <div className="case-study-stat">
                <span className="case-study-stat-label">Impact</span>
                <span className="case-study-stat-value">{impact}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Hero image ──────────────────────────────────── */}
        <div className="case-study-hero-img">
          <div className="cs-wrap cs-wrap--wide">
            <img src={image} alt={title} />
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────── */}
        <div className="case-study-content">
          <div className="cs-wrap">
            {/* Table of contents */}
            <nav className="case-study-toc" aria-label="Table of contents">
              <span className="case-study-toc-title">In this case study</span>
              <ol className="case-study-toc-list">
                {sections.map((section, i) => (
                  <li
                    key={i}
                    className={activeSection === i ? 'active' : ''}
                  >
                    <a
                      href={`#section-${i}`}
                      onClick={e => {
                        e.preventDefault();
                        scrollToSection(i);
                      }}
                    >
                      <span className="case-study-toc-num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Body sections */}
            <div className="case-study-body">
              {sections.map((section, i) => (
                <section
                  key={i}
                  id={`section-${i}`}
                  className="case-study-section"
                >
                  <div className="case-study-section-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h2>{section.heading}</h2>
                  {section.body.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </section>
              ))}
            </div>

            {/* Next / Previous navigation */}
            {(prev || next) && (
              <nav
                className="case-study-pagination"
                aria-label="More case studies"
              >
                {prev ? (
                  <Link
                    to={`/case-study/${prev.slug}`}
                    className="case-study-page-link cs-page-prev"
                  >
                    <span className="case-study-page-dir">← Previous</span>
                    <span className="case-study-page-name">{prev.title}</span>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    to={`/case-study/${next.slug}`}
                    className="case-study-page-link cs-page-next"
                  >
                    <span className="case-study-page-dir">Next →</span>
                    <span className="case-study-page-name">{next.title}</span>
                  </Link>
                ) : (
                  <div />
                )}
              </nav>
            )}

            {/* Footer */}
            <footer className="case-study-footer">
              <Link to="/#products" className="case-study-footer-link">
                ← All projects
              </Link>
            </footer>
          </div>
        </div>
      </article>
    </>
  );
}
