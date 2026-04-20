import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
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
