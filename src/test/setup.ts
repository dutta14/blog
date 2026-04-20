/// <reference types="vitest" />
import '@testing-library/jest-dom';

// Provide a default matchMedia mock for jsdom (which doesn't implement it).
// Individual tests can override window.matchMedia with their own mock.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});
