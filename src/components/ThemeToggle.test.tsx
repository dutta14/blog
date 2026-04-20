import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';

let listeners: Array<(e: MediaQueryListEvent) => void> = [];
let matchesDark = false;

function mockMatchMedia(query: string): MediaQueryList {
  return {
    matches: query === '(prefers-color-scheme: dark)' && matchesDark,
    media: query,
    onchange: null,
    addEventListener: vi.fn((_event: string, handler: EventListenerOrEventListenerObject) => {
      listeners.push(handler as (e: MediaQueryListEvent) => void);
    }),
    removeEventListener: vi.fn((_event: string, handler: EventListenerOrEventListenerObject) => {
      listeners = listeners.filter((l) => l !== handler);
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

beforeEach(() => {
  document.body.classList.remove('dark-mode');
  localStorage.clear();
  listeners = [];
  matchesDark = false;
  window.matchMedia = mockMatchMedia;
});

describe('ThemeToggle', () => {
  it('renders a button with "Switch to dark mode" label by default', () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('renders a button element', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles to dark mode on click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByLabelText('Switch to dark mode'));

    expect(document.body.classList.contains('dark-mode')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('toggles back to light mode on second click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByLabelText('Switch to dark mode'));
    await user.click(screen.getByLabelText('Switch to light mode'));

    expect(document.body.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('reads initial state from body class', () => {
    document.body.classList.add('dark-mode');
    render(<ThemeToggle />);
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('follows system preference change when no localStorage value', () => {
    render(<ThemeToggle />);
    expect(listeners.length).toBe(1);

    act(() => {
      listeners[0]({ matches: true } as MediaQueryListEvent);
    });

    expect(document.body.classList.contains('dark-mode')).toBe(true);
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('switches back to light when system preference changes to light', () => {
    document.body.classList.add('dark-mode');
    render(<ThemeToggle />);

    act(() => {
      listeners[0]({ matches: false } as MediaQueryListEvent);
    });

    expect(document.body.classList.contains('dark-mode')).toBe(false);
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('does not listen for system changes when localStorage has a value', () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);
    expect(listeners.length).toBe(0);
  });

  it('stops following system preference after manual toggle', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<ThemeToggle />);
    expect(listeners.length).toBe(1);

    await user.click(screen.getByLabelText('Switch to dark mode'));

    expect(localStorage.getItem('theme')).toBe('dark');

    // Listener was registered on first mount; re-mount to verify it won't re-register
    unmount();
    document.body.classList.remove('dark-mode');
    listeners = [];
    render(<ThemeToggle />);
    expect(listeners.length).toBe(0);
  });

  it('cleans up media query listener on unmount', () => {
    const addSpy = vi.fn();
    const removeSpy = vi.fn();

    window.matchMedia = (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: addSpy,
      removeEventListener: removeSpy,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const { unmount } = render(<ThemeToggle />);
    expect(addSpy).toHaveBeenCalledTimes(1);

    unmount();
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith('change', addSpy.mock.calls[0][1]);
  });
});
