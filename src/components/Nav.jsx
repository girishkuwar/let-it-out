import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css'; // Import the styles

function Nav({ isDark, toggleDark }) {
  return (
    <nav className="nav">
      <div className="container nav-container">
        <Link to="/" className="logo">LetItOut</Link>

        <div className="nav-links">
          <Link to="/write" className="btn-link">Write</Link>
          <Link to="/random" className="btn-link">Random</Link>

        </div>
        <input
          className="tglmode"
          type="checkbox"
          id="dark-mode"
          checked={isDark}
          onChange={toggleDark}
        />
        <label htmlFor="dark-mode" className="toggle-label"></label>
      </div>
    </nav>
  );
}

export default Nav;
