import { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { usePortfolio } from "../context/PortfolioContext";
import { api } from "../services/api";
import "./Contact.css";

function Contact() {
  const { data } = usePortfolio();
  const contactData = data?.contact || {};

  const [copied, setCopied] = useState(false);
  const emailAddress = contactData.emailAddress || "abhishekrana99813@gmail.com";

  // MongoDB Message form state
  const [msgForm, setMsgForm] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoSubject = encodeURIComponent(
    contactData.emailSubject || "Discussion regarding Developer Opportunity"
  );
  const mailtoBody = encodeURIComponent(
    contactData.emailBody ||
      "Hi Abhishek,\n\nI reviewed your portfolio and would like to connect with you."
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgForm.name.trim() || !msgForm.email.trim() || !msgForm.message.trim()) {
      return;
    }

    setIsSending(true);
    setSendSuccess(null);

    try {
      await api.sendMessage(msgForm);
      setSendSuccess("Message received! Saved to MongoDB.");
      setMsgForm({ name: "", email: "", message: "" });
    } catch {
      setSendSuccess("Direct mail option ready below.");
    } finally {
      setIsSending(false);
      setTimeout(() => setSendSuccess(null), 5000);
    }
  };

  return (
    <section className="section-container contact-section" id="contact">
      <div className="section-header">
        <span className="section-tag">
          {contactData.sectionTag || "Get In Touch"}
        </span>
        <h2 className="section-title">
          {contactData.sectionTitle || "Let's Connect & Collaborate"}
        </h2>
        <p className="section-subtitle">
          {contactData.sectionSubtitle ||
            "Whether you have an exciting job opportunity, a project proposal, or just want to discuss software engineering, my inbox is always open."}
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-info-col">
          <div>
            <h3 className="contact-intro-title">
              {contactData.introTitle || "Start a Conversation"}
            </h3>
            <p className="contact-intro-text">
              {contactData.introText ||
                "I am actively seeking Full Stack (Java/Spring Boot, MERN) and Android Developer roles. Reach out via email or connect with me on professional platforms."}
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

            {contactData.linkedinUrl && (
              <div className="contact-card">
                <div className="contact-card-left">
                  <div className="contact-card-icon">
                    <LinkedinIcon size={22} />
                  </div>
                  <div className="contact-card-details">
                    <span className="contact-card-label">LinkedIn</span>
                    <span className="contact-card-value">
                      {contactData.linkedinHandle || "LinkedIn Profile"}
                    </span>
                  </div>
                </div>

                <div className="contact-card-actions">
                  <a
                    className="contact-action-btn"
                    href={contactData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect on LinkedIn"
                  >
                    <ExternalLink size={14} />
                    <span>Connect</span>
                  </a>
                </div>
              </div>
            )}

            {contactData.githubUrl && (
              <div className="contact-card">
                <div className="contact-card-left">
                  <div className="contact-card-icon">
                    <GithubIcon size={22} />
                  </div>
                  <div className="contact-card-details">
                    <span className="contact-card-label">GitHub</span>
                    <span className="contact-card-value">
                      {contactData.githubHandle || "GitHub Profile"}
                    </span>
                  </div>
                </div>

                <div className="contact-card-actions">
                  <a
                    className="contact-action-btn"
                    href={contactData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View GitHub repositories"
                  >
                    <ExternalLink size={14} />
                    <span>Explore</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Message Box with Direct MongoDB Submission */}
        <div className="contact-quick-box">
          <div className="quick-box-badge">
            <Sparkles size={16} />
            <span>{contactData.quickBadge || "Open to Opportunities"}</span>
          </div>

          <h3 className="quick-box-heading">
            {contactData.quickHeading ||
              "Ready to discuss your next breakthrough project?"}
          </h3>

          <form onSubmit={handleSendMessage} className="contact-direct-form">
            <div className="form-field-group">
              <input
                type="text"
                placeholder="Your Name"
                value={msgForm.name}
                onChange={(e) =>
                  setMsgForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="contact-form-input"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={msgForm.email}
                onChange={(e) =>
                  setMsgForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="contact-form-input"
              />
            </div>

            <textarea
              placeholder="Your Message..."
              value={msgForm.message}
              onChange={(e) =>
                setMsgForm((prev) => ({ ...prev, message: e.target.value }))
              }
              required
              rows={3}
              className="contact-form-textarea"
            />

            <button
              type="submit"
              className="quick-send-btn"
              disabled={isSending}
              style={{ width: "100%", cursor: "pointer", border: "none" }}
            >
              <Send size={16} />
              <span>{isSending ? "Sending to MongoDB..." : "Send Message"}</span>
            </button>

            {sendSuccess && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#10b981",
                  fontSize: "0.85rem",
                  marginTop: "8px",
                  justifyContent: "center",
                }}
              >
                <CheckCircle2 size={16} />
                <span>{sendSuccess}</span>
              </div>
            )}
          </form>

          <div className="quick-box-benefits" style={{ marginTop: "1rem" }}>
            <div className="quick-benefit-item">
              <Clock size={16} />
              <span>
                {contactData.responseTime ||
                  "Fast response time within 24 hours"}
              </span>
            </div>
            <div className="quick-benefit-item">
              <MapPin size={16} />
              <span>
                {contactData.locationStatus ||
                  "Available for Remote, Hybrid & Relocation"}
              </span>
            </div>
          </div>

          <a
            className="contact-mailto-link"
            href={`mailto:${emailAddress}?subject=${mailtoSubject}&body=${mailtoBody}`}
          >
            Or send directly via email client →
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
