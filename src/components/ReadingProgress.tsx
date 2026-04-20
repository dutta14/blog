import { useEffect, useRef, useState } from 'react';
import '../styles/ReadingProgress.css';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const article = document.querySelector('.post-body') as HTMLElement | null;
    if (!article) return;

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!article) return;
        const rect = article.getBoundingClientRect();
        const articleTop = rect.top + window.scrollY;
        const articleHeight = rect.height;
        const viewportHeight = window.innerHeight;

        const raw = (window.scrollY - articleTop) / (articleHeight - viewportHeight);
        setProgress(Math.min(1, Math.max(0, raw)));
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="reading-progress" aria-hidden="true" role="presentation">
      <div
        className="reading-progress-bar"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
