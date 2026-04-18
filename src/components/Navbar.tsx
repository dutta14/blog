import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">Anindya Dutta</Link>
          <a href="https://anindya.dev" className="navbar-back">anindya.dev</a>
        </div>
        <div className="navbar-right">
          <Link to="/about">About</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
