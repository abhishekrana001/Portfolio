import resume from "../assets/My_Cv.pdf";
import profileImg from "../assets/MyImg.webp";
import { ArrowRight, Download, Mail, Code2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import "./Home.css";

function Home() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-glow-bg" aria-hidden="true" />
      <div className="hero-wrapper">
        <div className="hero-content">
          <div className="hero-status">
            <span className="status-dot" aria-hidden="true"></span>
            <span>Available for Full-time Roles & Projects</span>
          </div>

          <p className="hero-greeting">Hi there, I am</p>
          <h1 className="hero-name">
            Abhishek <span className="hero-name-gradient">Rana</span>
          </h1>
          <p className="hero-title">Java Full Stack & Android Developer</p>

          <p className="hero-description">
            I specialize in architecting scalable backend systems with Java, Spring Boot, REST APIs,
            and MySQL, while building modern reactive interfaces with React.js and native mobile apps
            with Kotlin.
          </p>

          <div className="hero-actions">
            <a className="btn-primary" href="#projects">
              <span>View Projects</span>
              <ArrowRight size={18} />
            </a>
            <a className="btn-secondary" href={resume} download="Abhishek_Rana_CV.pdf">
              <Download size={18} />
              <span>Download Resume</span>
            </a>
          </div>

          <div className="hero-socials">
            <a
              href="https://github.com/abhishekrana001"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-link"
              aria-label="GitHub profile"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href="https://linkedin.com/in/abhishekrana99813"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-link"
              aria-label="LinkedIn profile"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href="mailto:abhishekrana99813@gmail.com"
              className="hero-social-link"
              aria-label="Send Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-card">
            <div className="hero-image-frame">
              <img
                className="hero-avatar"
                src={profileImg}
                alt="Abhishek Rana - Java Full Stack Developer"
                loading="eager"
              />
            </div>
            
            <div className="hero-badge-float">
              <div className="badge-float-icon">
                <Code2 size={20} />
              </div>
              <div className="badge-float-text">
                <span className="badge-float-title">Specialization</span>
                <span className="badge-float-subtitle">Spring Boot & React</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
