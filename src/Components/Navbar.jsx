import { useEffect, useState } from "react";

const LINKS = ["home", "about", "skills", "projects", "contact"];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
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
    <header className="nav">
      <a href="#home" className="nav-logo">Abhishek Rana</a>
      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Main">
        {LINKS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={active === id ? "is-active" : ""}
            aria-current={active === id ? "true" : undefined}
            onClick={() => setOpen(false)}
          >
            {id}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
