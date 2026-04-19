import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { renderWithRouter } from '../test/helpers';

describe('Navbar', () => {
  it('renders site brand linking to home', () => {
    renderWithRouter(<Navbar />);
    const brand = screen.getByRole('link', { name: 'Anindya Dutta' });
    expect(brand).toHaveAttribute('href', '/');
  });

  it('renders link to anindya.dev', () => {
    renderWithRouter(<Navbar />);
    const link = screen.getByRole('link', { name: 'anindya.dev' });
    expect(link).toHaveAttribute('href', 'https://anindya.dev');
  });

  it('renders About link pointing to /about', () => {
    renderWithRouter(<Navbar />);
    const link = screen.getByRole('link', { name: 'About' });
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders "Book 30 Minutes" button', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByRole('button', { name: 'Book 30 Minutes' })).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByLabelText(/Switch to (dark|light) mode/)).toBeInTheDocument();
  });

  it('renders navigation element', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

/* ── BookingModal integration ───────────────────────────── */

describe('Navbar — BookingModal integration', () => {
  it('clicking "Book 30 Minutes" opens the BookingModal', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Book 30 Minutes' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opened BookingModal contains the Google Calendar link', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Book 30 Minutes' }));

    await waitFor(() => {
      const calLink = screen.getByRole('link', { name: /open google calendar/i });
      expect(calLink).toHaveAttribute(
        'href',
        'https://calendar.app.google/UeHBbGhSZYHaBGMC9'
      );
    });
  });

  it('BookingModal can be closed via the close button', async () => {
    const user = userEvent.setup();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderWithRouter(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Book 30 Minutes' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Close dialog'));

    // Wait for close animation (150ms)
    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });
});
