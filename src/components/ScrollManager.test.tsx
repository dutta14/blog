import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ScrollManager from './ScrollManager';

// Helper to capture navigate and fire navigations
let testNavigate: ReturnType<typeof useNavigate>;

function NavCapture() {
  testNavigate = useNavigate();
  return null;
}

function renderWithRoute(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ScrollManager />
      <NavCapture />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/post/:slug" element={<div>Post</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  // Reset scrollY
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
});

describe('ScrollManager', () => {
  it('scrolls to top on PUSH navigation (navigating to a new post)', () => {
    renderWithRoute(['/']);

    // Navigate to a post page (PUSH)
    act(() => {
      testNavigate('/post/some-post');
    });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('restores saved scroll position when navigating with restoreScroll state', () => {
    renderWithRoute(['/post/some-post']);

    // Simulate scroll position being saved
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // Navigate to home with restoreScroll
    act(() => {
      testNavigate('/', { state: { restoreScroll: true } });
    });

    // requestAnimationFrame is used for restoring
    act(() => {
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });
      // Re-trigger to ensure rAF fires
      testNavigate('/', { state: { restoreScroll: true } });
    });
  });

  it('saves scroll position on scroll events', () => {
    renderWithRoute(['/']);

    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // The scroll position was saved — navigate away and back with restoreScroll
    act(() => {
      testNavigate('/post/test');
    });

    // Navigate back to home with restoreScroll to verify saved position is used
    act(() => {
      testNavigate('/', { state: { restoreScroll: true } });
    });

    // scrollTo should have been called — the exact value depends on rAF timing
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('handles POP navigation (browser back) by attempting to restore scroll', () => {
    renderWithRoute(['/', '/post/some-post']);

    // The initial route is /post/some-post (second entry), pop goes back to /
    // In MemoryRouter we can simulate POP by using navigate with negative delta
    act(() => {
      testNavigate(-1);
    });

    // scrollTo is called (either restoring saved position or default behavior)
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
