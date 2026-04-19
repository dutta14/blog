import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookingModal from './BookingModal';

describe('BookingModal', () => {
  it('renders the correct Google Calendar link', () => {
    render(<BookingModal open={true} onClose={vi.fn()} />);
    const link = screen.getByRole('link', { name: /open google calendar/i });
    expect(link).toHaveAttribute(
      'href',
      'https://calendar.app.google/UeHBbGhSZYHaBGMC9'
    );
  });

  it('opens calendar link in a new tab', () => {
    render(<BookingModal open={true} onClose={vi.fn()} />);
    const link = screen.getByRole('link', { name: /open google calendar/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render when closed', () => {
    render(<BookingModal open={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders conversation copy by default', () => {
    render(<BookingModal open={true} onClose={vi.fn()} />);
    expect(screen.getByText('Let\u2019s find a time')).toBeInTheDocument();
  });

  it('renders speaking copy when context is speaking', () => {
    render(<BookingModal open={true} onClose={vi.fn()} context="speaking" />);
    expect(screen.getByText('Book a speaking session')).toBeInTheDocument();
  });
});
