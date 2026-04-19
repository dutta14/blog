import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareBar from './ShareBar';
import { renderWithRouter } from '../test/helpers';

beforeEach(() => {
  // Ensure desktop viewport (no native share)
  Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
  // Remove navigator.share to force desktop rendering
  Object.defineProperty(navigator, 'share', { value: undefined, writable: true, configurable: true });
});

describe('ShareBar', () => {
  const defaultProps = {
    title: 'Test Post',
    url: 'https://anindya.dev/blog/post/test-post',
  };

  it('renders LinkedIn share link', () => {
    renderWithRouter(<ShareBar {...defaultProps} />);
    const link = screen.getByLabelText('Share this post on LinkedIn (opens in new tab)');
    expect(link).toHaveAttribute('href', expect.stringContaining('linkedin.com/sharing'));
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders Twitter share link', () => {
    renderWithRouter(<ShareBar {...defaultProps} />);
    const link = screen.getByLabelText('Share this post on Twitter (opens in new tab)');
    expect(link).toHaveAttribute('href', expect.stringContaining('twitter.com/intent/tweet'));
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders Copy Link button', () => {
    renderWithRouter(<ShareBar {...defaultProps} />);
    const button = screen.getByLabelText('Copy link to this post');
    expect(button).toBeInTheDocument();
  });

  it('all share elements have correct aria-labels', () => {
    renderWithRouter(<ShareBar {...defaultProps} />);
    expect(screen.getByLabelText('Share this post on LinkedIn (opens in new tab)')).toBeInTheDocument();
    expect(screen.getByLabelText('Share this post on Twitter (opens in new tab)')).toBeInTheDocument();
    expect(screen.getByLabelText('Copy link to this post')).toBeInTheDocument();
  });

  it('shows "Link copied" feedback after clicking copy link button', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    renderWithRouter(<ShareBar {...defaultProps} />);
    const copyButton = screen.getByLabelText('Copy link to this post');

    await user.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Link copied')).toBeInTheDocument();
    });
    expect(writeTextMock).toHaveBeenCalledWith(defaultProps.url);
  });

  it('LinkedIn URL contains the encoded post URL', () => {
    renderWithRouter(<ShareBar {...defaultProps} />);
    const link = screen.getByLabelText('Share this post on LinkedIn (opens in new tab)');
    expect(link).toHaveAttribute(
      'href',
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(defaultProps.url)}`
    );
  });

  it('Twitter URL contains both encoded URL and title', () => {
    renderWithRouter(<ShareBar {...defaultProps} />);
    const link = screen.getByLabelText('Share this post on Twitter (opens in new tab)');
    const expected = `https://twitter.com/intent/tweet?url=${encodeURIComponent(defaultProps.url)}&text=${encodeURIComponent(defaultProps.title)}`;
    expect(link).toHaveAttribute('href', expected);
  });
});
