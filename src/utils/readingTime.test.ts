import { describe, it, expect } from 'vitest';
import { readingTime } from './readingTime';

describe('readingTime', () => {
  it('returns 1 for very short content under 230 words', () => {
    const content = 'Hello world this is a short post.';
    expect(readingTime(content)).toBe(1);
  });

  it('returns correct value for known word count (460 words = 2 min)', () => {
    const content = Array(460).fill('word').join(' ');
    expect(readingTime(content)).toBe(2);
  });

  it('returns 1 for an empty string (never returns 0)', () => {
    expect(readingTime('')).toBe(1);
  });

  it('returns 3 for approximately 690 words', () => {
    const content = Array(690).fill('word').join(' ');
    expect(readingTime(content)).toBe(3);
  });

  it('rounds to nearest minute (345 words rounds to 2)', () => {
    // 345 / 230 = 1.5 → rounds to 2
    const content = Array(345).fill('word').join(' ');
    expect(readingTime(content)).toBe(2);
  });
});
