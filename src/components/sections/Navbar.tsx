import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <img src="/assets/kec-logo.png" alt="Kongu Engineering College" />
        </Link>
        <nav className="desktop-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            end
          >
            HOME
          </NavLink>
          <NavLink
            to="/schedule"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            SCHEDULE
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            EVENTS
          </NavLink>
        </nav>
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            HOME
          </NavLink>
          <NavLink
            to="/schedule"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            SCHEDULE
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            EVENTS
          </NavLink>
        </nav>
      )}
    </header>
  );
}
