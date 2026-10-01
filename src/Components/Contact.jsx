import { useState } from "react";
import { Mail, Copy, Check, ExternalLink, Sparkles, Clock, MapPin, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import "./Contact.css";

function Contact() {
  const [copied, setCopied] = useState(false);
  const emailAddress = "abhishekrana99813@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="section-container contact-section" id="contact">
      <div className="section-header">
        <span className="section-tag">Get In Touch</span>
        <h2 className="section-title">Let's Connect & Collaborate</h2>
        <p className="section-subtitle">
          Whether you have an exciting job opportunity, a project proposal, or just want to discuss software engineering, my inbox is always open.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-info-col">
          <div>
            <h3 className="contact-intro-title">Start a Conversation</h3>
            <p className="contact-intro-text">
              I am actively seeking Full Stack (Java/Spring Boot, MERN) and Android Developer roles. Reach out via email or connect with me on professional platforms.
            </p>
          </div>

          <div className="contact-cards-grid">
            <div className="contact-card">
              <div className="contact-card-left">
                <div className="contact-card-icon">
                  <Mail size={22} />
                </div>
                <div className="contact-card-details">
                  <span className="contact-card-label">Email Address</span>
                  <span className="contact-card-value">{emailAddress}</span>
                </div>
              </div>

              <div className="contact-card-actions">
                <button
                  className={`contact-action-btn ${copied ? "is-copied" : ""}`}
                  onClick={handleCopyEmail}
                  title="Copy email address"
                  aria-label="Copy email address to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  className="contact-action-btn"
                  href={`mailto:${emailAddress}`}
                  aria-label="Send direct email"
                >
                  <ExternalLink size={14} />
                  <span>Send</span>
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-left">
                <div className="contact-card-icon">
                  <LinkedinIcon size={22} />
                </div>
                <div className="contact-card-details">
                  <span className="contact-card-label">LinkedIn</span>
                  <span className="contact-card-value">in/abhishekrana99813</span>
                </div>
              </div>

              <div className="contact-card-actions">
                <a
                  className="contact-action-btn"
                  href="https://linkedin.com/in/abhishekrana99813"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect on LinkedIn"
                >
                  <ExternalLink size={14} />
                  <span>Connect</span>
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-left">
                <div className="contact-card-icon">
                  <GithubIcon size={22} />
                </div>
                <div className="contact-card-details">
                  <span className="contact-card-label">GitHub</span>
                  <span className="contact-card-value">github.com/abhishekrana001</span>
                </div>
              </div>

              <div className="contact-card-actions">
                <a
                  className="contact-action-btn"
                  href="https://github.com/abhishekrana001"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View GitHub repositories"
                >
                  <ExternalLink size={14} />
                  <span>Explore</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-quick-box">
          <div className="quick-box-badge">
            <Sparkles size={16} />
            <span>Open to Opportunities</span>
          </div>

          <h3 className="quick-box-heading">Ready to discuss your next breakthrough project?</h3>

          <p className="quick-box-desc">
            I bring a strong work ethic, rapid learning ability, and dedication to crafting high quality web backends, responsive UIs, and robust mobile applications.
          </p>

          <div className="quick-box-benefits">
            <div className="quick-benefit-item">
              <Clock size={18} />
              <span>Fast response time within 24 hours</span>
            </div>
            <div className="quick-benefit-item">
              <MapPin size={18} />
              <span>Available for Remote, Hybrid & Relocation</span>
            </div>
          </div>

          <a
            className="quick-send-btn"
            href={`mailto:${emailAddress}?subject=Discussion%20regarding%20Developer%20Opportunity&body=Hi%20Abhishek,%0D%0A%0D%0AI%20reviewed%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you.`}
          >
            <Send size={18} />
            <span>Compose Email Now</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
