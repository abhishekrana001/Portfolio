import { useState } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { GithubIcon } from "./Icons";
import { usePortfolio } from "../context/PortfolioContext";
import { defaultPortfolioData } from "../data/defaultPortfolioData";
import { resolveProjectImage } from "../data/assetRegistry.js";
import "./Projects.css";

function Projects() {
  const { data } = usePortfolio();
  const projectsData = data?.projects || {};
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = projectsData.categories || [
    { key: "all", label: "All Projects" },
    { key: "web", label: "Web & Full Stack" },
    { key: "android", label: "Android Apps" },
    { key: "tools", label: "Games & Utilities" },
  ];

  const githubBase =
    projectsData.githubBase || "https://github.com/abhishekrana001/";
  const items =
    projectsData.items &&
    Array.isArray(projectsData.items) &&
    projectsData.items.length > 0
      ? projectsData.items
      : defaultPortfolioData.projects.items;

  const filteredProjects =
    activeCategory === "all"
      ? items
      : items.filter(
          (p) => p.category?.toLowerCase() === activeCategory?.toLowerCase()
        );

  return (
    <section className="section-container projects-section" id="projects">
      <div className="section-header">
        <span className="section-tag">
          {projectsData.sectionTag || "Featured Work"}
        </span>
        <h2 className="section-title">
          {projectsData.sectionTitle || "Projects Portfolio"}
        </h2>
        <p className="section-subtitle">
          {projectsData.sectionSubtitle ||
            "A showcase of full stack web applications, native Android projects, and interactive tools built with clean code and modern technologies."}
        </p>
      </div>

      <div
        className="projects-filter-bar"
        role="tablist"
        aria-label="Project Categories"
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            role="tab"
            aria-selected={activeCategory === cat.key}
            className={`filter-tab ${
              activeCategory === cat.key ? "is-active" : ""
            }`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map((p) => {
          const repoHref = p.repo?.startsWith("http")
            ? p.repo
            : `${githubBase}${p.repo || ""}`;
          const imgSrc = resolveProjectImage(p);

          return (
            <article className="project-card" key={p.id || p.repo || p.name}>
              <div className="project-img-wrapper">
                <img
                  className="project-img"
                  src={imgSrc}
                  alt={p.alt || `${p.name} preview`}
                  loading="lazy"
                />
                <span className="project-cat-badge">{p.category}</span>
              </div>

              <div className="project-body">
                <h3 className="project-title">{p.name}</h3>
                <p className="project-desc">{p.desc}</p>

                <div className="project-tags">
                  {p.tags?.map((t) => (
                    <span className="project-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="project-footer">
                  {p.repo && (
                    <a
                      className="project-btn"
                      href={repoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${p.name} source code on GitHub`}
                    >
                      <GithubIcon size={16} />
                      <span>View Code</span>
                      <ExternalLink size={14} />
                    </a>
                  )}

                  {p.demoUrl && (
                    <a
                      className="project-btn demo-btn"
                      href={p.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${p.name} live demo`}
                    >
                      <Globe size={15} />
                      <span>Live Demo</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;