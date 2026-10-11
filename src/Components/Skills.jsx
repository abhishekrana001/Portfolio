import { Server } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { getDynamicIcon } from "../data/assetRegistry.js";
import "./Skills.css";

function Skills() {
  const { data } = usePortfolio();
  const skillsData = data?.skills || {};
  const categories = skillsData.categories || [];

  return (
    <section className="section-container skills-section" id="skills">
      <div className="section-header">
        <span className="section-tag">{skillsData.sectionTag || "Core Competencies"}</span>
        <h2 className="section-title">{skillsData.sectionTitle || "Technical Skills"}</h2>
        <p className="section-subtitle">
          {skillsData.sectionSubtitle ||
            "A structured breakdown of languages, frameworks, libraries, and tools I use to bring ideas to reality."}
        </p>
      </div>

      <div className="skills-grid">
        {categories.map((category) => (
          <div className="skills-category-card" key={category.id || category.name}>
            <div className="skills-card-header">
              <div className="skills-card-icon">
                {typeof category.icon === "string"
                  ? getDynamicIcon(category.icon, Server, { size: 22 })
                  : category.icon}
              </div>
              <div className="skills-card-title-group">
                <h3 className="skills-card-title">{category.name}</h3>
                <span className="skills-card-subtitle">{category.subtitle}</span>
              </div>
            </div>

            <div className="skills-list">
              {category.items?.map((skill) => (
                <div className="skill-pill" key={skill}>
                  <span className="skill-dot" aria-hidden="true"></span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
