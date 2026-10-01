import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "./Icons";
import Stonegame from "../assets/PSS_logo.svg";
import currency from "../assets/foreign-exchange.png";
import Ticgame from "../assets/tic-tac-toe.png";
import Notes from "../assets/note-app.png";
import Music from "../assets/player.png";
import Weather from "../assets/weather-app.png";
import Mang from "../assets/event-planner.png";
import JobPortal from "../assets/job-portal.png";
import Arkart from "../assets/arkart.png";
import Airbnb from "../assets/airbnb.png";
import "./Projects.css";

const GH = "https://github.com/abhishekrana001/";

const PROJECTS = [
  {
    name: "Airbnb Clone",
    category: "web",
    img: Airbnb,
    alt: "Airbnb rental booking website preview",
    desc: "Full-featured property rental platform where users can explore stays, search properties, inspect amenities, view details, and manage bookings seamlessly.",
    tags: ["React", "JavaScript", "CSS", "React Router"],
    repo: "Airbnb",
  },
  {
    name: "ARKart E-Commerce",
    category: "web",
    img: Arkart,
    alt: "ARKart E-commerce website preview",
    desc: "Modern e-commerce platform offering responsive product catalogs, dynamic cart calculations, item filtering, and streamlined checkout simulation.",
    tags: ["React", "JavaScript", "CSS", "Context API"],
    repo: "ARKart",
  },
  {
    name: "Job Portal Platform",
    category: "web",
    img: JobPortal,
    alt: "Job Portal website preview",
    desc: "Interactive job search portal featuring career listings, category filters, job detail views, application tracking, and saved bookmarks.",
    tags: ["React", "JavaScript", "CSS", "React Router"],
    repo: "Job-Portal",
  },
  {
    name: "Event Management System",
    category: "android",
    img: Mang,
    alt: "Event Management System app preview",
    desc: "Native Android application engineered for users to discover, register, and organize community and personal events with offline Room support.",
    tags: ["Kotlin", "Android", "Room DB", "MVVM"],
    repo: "Event-Management-System",
  },
  {
    name: "Live Weather App",
    category: "android",
    img: Weather,
    alt: "Weather app screen preview",
    desc: "Real-time weather forecast application displaying current temperature, wind speed, humidity, and forecasts utilizing external REST APIs.",
    tags: ["Kotlin", "Android", "REST API", "Coroutines"],
    repo: "Weather-Application",
  },
  {
    name: "Smart Notes App",
    category: "android",
    img: Notes,
    alt: "Notes app screen preview",
    desc: "Clean Android note-taking application providing quick note creation, category sorting, search, and local persistent data caching.",
    tags: ["Kotlin", "Android", "Room DB", "Material Design"],
    repo: "notes-app",
  },
  {
    name: "Music Player",
    category: "android",
    img: Music,
    alt: "Music player app screen preview",
    desc: "Native media playback Android application with track listing, queue management, progress tracking, and playback notification controls.",
    tags: ["Kotlin", "Android", "MediaPlayer", "UI"],
    repo: "Music-Player-App",
  },
  {
    name: "Currency Converter",
    category: "tools",
    img: currency,
    alt: "Currency converter preview",
    desc: "Web utility that performs instant multi-currency conversions using live market exchange rate endpoints with clean interactive input controls.",
    tags: ["HTML5", "CSS3", "JavaScript", "Exchange API"],
    repo: "currency-converter",
  },
  {
    name: "Tic Tac Toe Game",
    category: "tools",
    img: Ticgame,
    alt: "Tic Tac Toe board preview",
    desc: "Classic browser game with interactive 2-player turn logic, win-detection algorithms, turn indicators, and scorekeeping.",
    tags: ["HTML5", "CSS3", "JavaScript", "Game Logic"],
    repo: "Tic-Tac-Toe-Game",
  },
  {
    name: "Stone Paper Scissors",
    category: "tools",
    img: Stonegame,
    alt: "Stone Paper Scissors game preview",
    desc: "Dynamic web game featuring randomized AI opponent decisions, score tracking, round history, and celebratory visual effects.",
    tags: ["HTML5", "CSS3", "JavaScript", "DOM API"],
    repo: "Stone-Paper-Scissors",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Projects" },
  { key: "web", label: "Web & Full Stack" },
  { key: "android", label: "Android Apps" },
  { key: "tools", label: "Games & Utilities" },
];

function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects =
    activeCategory === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section className="section-container projects-section" id="projects">
      <div className="section-header">
        <span className="section-tag">Featured Work</span>
        <h2 className="section-title">Projects Portfolio</h2>
        <p className="section-subtitle">
          A showcase of full stack web applications, native Android projects, and interactive tools built with clean code and modern technologies.
        </p>
      </div>
      <div className="projects-filter-bar" role="tablist" aria-label="Project Categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            role="tab"
            aria-selected={activeCategory === cat.key}
            className={`filter-tab ${activeCategory === cat.key ? "is-active" : ""}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="projects-grid">
        {filteredProjects.map((p) => (
          <article className="project-card" key={p.repo}>
            <div className="project-img-wrapper">
              <img className="project-img" src={p.img} alt={p.alt} loading="lazy" />
              <span className="project-cat-badge">{p.category}</span>
            </div>

            <div className="project-body">
              <h3 className="project-title">{p.name}</h3>
              <p className="project-desc">{p.desc}</p>

              <div className="project-tags">
                {p.tags.map((t) => (
                  <span className="project-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="project-footer">
                <a
                  className="project-btn"
                  href={GH + p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${p.name} source code on GitHub`}
                >
                  <GithubIcon size={16} />
                  <span>View Repository</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
