import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';

beforeEach(() => {
  document.body.classList.remove('dark-mode');
  localStorage.clear();
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
});
