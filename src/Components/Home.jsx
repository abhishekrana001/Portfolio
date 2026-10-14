import defaultProfileImg from "../assets/MyImg.webp";
import { ArrowRight, Download, Mail, Code2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { usePortfolio } from "../context/PortfolioContext";
import { resolveProfileImage, resolveResumeUrl } from "../data/assetRegistry.js";
import "./Home.css";

function Home() {
  const { data } = usePortfolio();
  const homeData = data?.home || {};

  const avatarSrc = resolveProfileImage(homeData.customAvatarUrl);
  const resumeDownloadSrc = resolveResumeUrl(homeData.resumeUrl);
  const resumeFileName = homeData.resumeFileName || "Abhishek_Rana_CV.pdf";

  return (
    <section className="hero-section" id="home">
      <div className="hero-glow-bg" aria-hidden="true" />
      <div className="hero-wrapper">
        <div className="hero-content">
          <div className="hero-status">
            <span className="status-dot" aria-hidden="true"></span>
            <span>{homeData.statusText || "Available for Full-time Roles & Projects"}</span>
          </div>

          <p className="hero-greeting">{homeData.greeting || "Hi there, I am"}</p>
          <h1 className="hero-name">
            {homeData.firstName || "Abhishek"}{" "}
            <span className="hero-name-gradient">{homeData.lastName || "Rana"}</span>
          </h1>
          <p className="hero-title">{homeData.title || "Java Full Stack & Android Developer"}</p>

          <p className="hero-description">
            {homeData.description ||
              "I specialize in architecting scalable backend systems with Java, Spring Boot, REST APIs, and MySQL, while building modern reactive interfaces with React.js and native mobile apps with Kotlin."}
          </p>

          <div className="hero-actions">
            <a className="btn-primary" href="#projects">
              <span>{homeData.projectsButtonText || "View Projects"}</span>
              <ArrowRight size={18} />
            </a>
            <a className="btn-secondary" href={resumeDownloadSrc} download={resumeFileName}>
              <Download size={18} />
              <span>{homeData.resumeButtonText || "Download Resume"}</span>
            </a>
          </div>

          <div className="hero-socials">
            {homeData.socials?.github && (
              <a
                href={homeData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="GitHub profile"
              >
                <GithubIcon size={20} />
              </a>
            )}
            {homeData.socials?.linkedin && (
              <a
                href={homeData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="LinkedIn profile"
              >
                <LinkedinIcon size={20} />
              </a>
            )}
            {homeData.socials?.email && (
              <a
                href={`mailto:${homeData.socials.email}`}
                className="hero-social-link"
                aria-label="Send Email"
              >
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-card">
            <div className="hero-image-frame">
              <img
                className="hero-avatar"
                src={avatarSrc}
                alt={`${homeData.firstName || "Abhishek"} ${homeData.lastName || "Rana"} profile`}
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultProfileImg;
                }}
              />
            </div>

            <div className="hero-badge-float">
              <div className="badge-float-icon">
                <Code2 size={20} />
              </div>
              <div className="badge-float-text">
                <span className="badge-float-title">{homeData.badgeTitle || "Specialization"}</span>
                <span className="badge-float-subtitle">{homeData.badgeSubtitle || "Spring Boot & React"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
