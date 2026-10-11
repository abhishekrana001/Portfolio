import { ArrowUp, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { usePortfolio } from "../context/PortfolioContext";
import "./Footer.css";

const NAV_LINKS = ["home", "about", "skills", "projects", "contact"];

function Footer() {
  const { data } = usePortfolio();
  const footerData = data?.footer || {};
  const homeData = data?.home || {};

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();
  const copyrightText = footerData.copyrightNote
    ? footerData.copyrightNote.replace("{year}", currentYear)
    : `Abhishek Rana. All rights reserved. Built with React & Vite.`;

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">
              {footerData.brandName || "Abhishek"}
              <span className="footer-logo-accent">.</span>
            </span>
            <p className="footer-tagline">
              {footerData.tagline ||
                "Java Full Stack & Android Developer • Building high-impact software"}
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer Navigation">
            {NAV_LINKS.map((link) => (
              <a key={link} href={`#${link}`} className="footer-nav-link">
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} {copyrightText}
          </p>

          <div className="footer-right-actions">
            <div className="hero-socials" style={{ gap: "0.75rem" }}>
              {homeData.socials?.github && (
                <a
                  href={homeData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="GitHub profile"
                >
                  <GithubIcon size={18} />
                </a>
              )}
              {homeData.socials?.linkedin && (
                <a
                  href={homeData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="LinkedIn profile"
                >
                  <LinkedinIcon size={18} />
                </a>
              )}
              {homeData.socials?.email && (
                <a
                  href={`mailto:${homeData.socials.email}`}
                  className="footer-social-link"
                  aria-label="Email Abhishek Rana"
                >
                  <Mail size={18} />
                </a>
              )}
            </div>

            <button
              onClick={scrollToTop}
              className="back-to-top-btn"
              aria-label="Scroll back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp size={15} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;