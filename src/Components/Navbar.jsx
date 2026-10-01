import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Sun, Moon, Menu, X } from "lucide-react";
import "./Navbar.css";

const LINKS = ["home", "about", "skills", "projects", "contact"];

function Navbar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px" }
    );

    LINKS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="nav-header">
      <div className="nav-container">
        <a href="#home" className="nav-logo" aria-label="Abhishek Rana Portfolio">
          Abhishek<span className="nav-logo-accent">.</span>
        </a>
        <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Main Navigation">
          {LINKS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link ${active === id ? "is-active" : ""}`}
              aria-current={active === id ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {id}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="theme-icon" size={20} />
            ) : (
              <Moon className="theme-icon" size={20} />
            )}
          </button>

          <button
            className="nav-mobile-toggle"
            aria-label="Toggle mobile navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  theme: PropTypes.string,
  toggleTheme: PropTypes.func,
};

export default Navbar;
