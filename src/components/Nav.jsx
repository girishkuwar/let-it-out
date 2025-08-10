import React from 'react';
import { Link } from 'react-router-dom';

function Nav({ isDark, toggleDark }) {
    return (
        <nav className="nav">
      <div className="container nav-container">
        <Link to="/" className="logo">LetItOut</Link>
        <div className="nav-links">
          <Link to="/write" className="btn-link">Write</Link>
          <Link to="/random" className="btn-link">Random</Link>
          <button onClick={toggleDark} className="btn-toggle">
            {isDark ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
    );
}

export default Nav;