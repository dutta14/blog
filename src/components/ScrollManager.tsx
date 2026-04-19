import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions = new Map<string, number>();

export default function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType();
  const key = location.pathname + location.search;
  const prevKey = useRef(key);
  const transitioning = useRef(false);

  // Continuously save scroll position — but not during transitions
  useEffect(() => {
    const handleScroll = () => {
      if (!transitioning.current) {
        scrollPositions.set(prevKey.current, window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Pause the scroll listener so DOM-swap scroll events
    // don't overwrite the saved position for the previous page
    transitioning.current = true;

    const state = location.state as { restoreScroll?: boolean } | null;

    if (navType === 'POP') {
      const saved = scrollPositions.get(key);
      requestAnimationFrame(() => {
        window.scrollTo(0, saved ?? 0);
        requestAnimationFrame(() => { transitioning.current = false; });
      });
    } else if (state?.restoreScroll) {
      const saved = scrollPositions.get(key);
      requestAnimationFrame(() => {
        window.scrollTo(0, saved ?? 0);
        requestAnimationFrame(() => { transitioning.current = false; });
      });
      window.history.replaceState({}, '');
    } else {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => { transitioning.current = false; });
    }

    prevKey.current = key;
  }, [key, navType, location.state]);

  return null;
}
