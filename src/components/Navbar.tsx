import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import BookingModal from './BookingModal';
import '../styles/Navbar.css';

export default function Navbar() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">Anindya Dutta</Link>
            <a href="https://anindya.dev" className="navbar-back">anindya.dev</a>
          </div>
          <div className="navbar-right">
            <Link to="/about">About</Link>
            <button
              className="navbar-book"
              type="button"
              onClick={() => setBookingOpen(true)}
            >
              Book 30 Minutes
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
