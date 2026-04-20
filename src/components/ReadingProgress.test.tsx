import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import ReadingProgress from './ReadingProgress';

afterEach(() => {
  cleanup();
});

describe('ReadingProgress', () => {
  it('renders a container with aria-hidden="true" and role="presentation"', () => {
    const { container } = render(<ReadingProgress />);
    const wrapper = container.querySelector('.reading-progress');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.getAttribute('aria-hidden')).toBe('true');
    expect(wrapper!.getAttribute('role')).toBe('presentation');
  });

  it('renders a bar with initial width of 0%', () => {
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector('.reading-progress-bar') as HTMLElement;
    expect(bar).not.toBeNull();
    expect(bar.style.width).toBe('0%');
  });

  it('bar has class reading-progress-bar', () => {
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector('.reading-progress-bar');
    expect(bar).not.toBeNull();
  });

  it('container has the reading-progress class (pointer-events: none applied via CSS)', () => {
    const { container } = render(<ReadingProgress />);
    const wrapper = container.querySelector('.reading-progress');
    expect(wrapper).not.toBeNull();
  });

  it('progress increases as user scrolls down through the article', async () => {
    const postBody = document.createElement('div');
    postBody.className = 'post-body';
    document.body.appendChild(postBody);

    // Simulate a tall article: 3000px tall, starting 400px from page top
    vi.spyOn(postBody, 'getBoundingClientRect').mockImplementation(() => {
      // rect.top = absoluteTop - scrollY
      const absoluteTop = 400;
      return {
        top: absoluteTop - window.scrollY,
        height: 3000,
        bottom: absoluteTop - window.scrollY + 3000,
        left: 0,
        right: 680,
        width: 680,
        x: 0,
        y: absoluteTop - window.scrollY,
        toJSON: () => {},
      };
    });

    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    // Mock rAF to fire synchronously
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    const { container } = render(<ReadingProgress />);
    const bar = () => container.querySelector('.reading-progress-bar') as HTMLElement;

    // At top of page, before article: progress should be 0
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    const widthAtTop = parseFloat(bar().style.width);
    expect(widthAtTop).toBe(0);

    // Scroll to middle of article: progress should be ~50%
    Object.defineProperty(window, 'scrollY', { value: 400 + 1100, configurable: true });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    const widthAtMid = parseFloat(bar().style.width);

    // Scroll to end of article: progress should be 100%
    Object.defineProperty(window, 'scrollY', { value: 400 + 3000 - 800, configurable: true });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    const widthAtEnd = parseFloat(bar().style.width);

    // Core assertion: progress must increase as user scrolls down
    expect(widthAtMid).toBeGreaterThan(widthAtTop);
    expect(widthAtEnd).toBeGreaterThan(widthAtMid);
    expect(widthAtEnd).toBe(100);

    postBody.remove();
    vi.restoreAllMocks();
  });

  it('cleans up scroll listener on unmount', () => {
    // ReadingProgress only attaches scroll listener when .post-body exists
    const postBody = document.createElement('div');
    postBody.className = 'post-body';
    document.body.appendChild(postBody);

    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ReadingProgress />);

    const scrollAddCalls = addSpy.mock.calls.filter(([event]) => event === 'scroll');
    expect(scrollAddCalls.length).toBeGreaterThanOrEqual(1);

    unmount();

    const scrollRemoveCalls = removeSpy.mock.calls.filter(([event]) => event === 'scroll');
    expect(scrollRemoveCalls.length).toBeGreaterThanOrEqual(1);

    postBody.remove();
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
