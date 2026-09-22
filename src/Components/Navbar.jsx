import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = ["home", "about", "skills", "projects", "contact"];

  const goToSection = (section) => {
    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.history.pushState({}, "", `/${section}`);
    }

    setMenuOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.id;

            window.history.replaceState({}, "", `/${section}`);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="navbar">

      <h2 className="navbar-logo">
        Dev_Abhishek Rana
      </h2>

      <div className="navbar-links">

        <button onClick={() => goToSection("home")}>
          Home
        </button>

        <button onClick={() => goToSection("about")}>
          About
        </button>

        <button onClick={() => goToSection("skills")}>
          Skills
        </button>

        <button onClick={() => goToSection("projects")}>
          Projects
        </button>

        <button onClick={() => goToSection("contact")}>
          Contact
        </button>

      </div>

      <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {menuOpen && (
        <div className="mobile-menu">

          <button onClick={() => goToSection("home")}>
            Home
          </button>

          <button onClick={() => goToSection("about")}>
            About
          </button>

          <button onClick={() => goToSection("skills")}>
            Skills
          </button>

          <button onClick={() => goToSection("projects")}>
            Projects
          </button>

          <button onClick={() => goToSection("contact")}>
            Contact
          </button>

        </div>
      )}

    </nav>
  );
}

export default Navbar;