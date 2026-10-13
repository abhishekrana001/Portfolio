import { Server } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { getDynamicIcon } from "../data/assetRegistry.js";
import "./Skills.css";

function Skills() {
  const { data } = usePortfolio();
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Context se initial data uthao
  const contextData = data?.skills || {};

  useEffect(() => {
    let isMounted = true;
    const load = () => {
      api
        .getSkills()
        .then((res) => {
          if (!isMounted) return;
          if (Array.isArray(res) && res.length > 0) {
            const categories = [
              ...new Set(res.map((s) => s.category)),
            ].map((cat) => ({
              id: cat.toLowerCase().replace(/\s+/g, "-"),
              name: cat,
              subtitle: "",
              icon: "Server",
              items: res.filter((s) => s.category === cat).map((s) => s.name),
            }));
            setSkillsData({ categories });
          } else {
            setSkillsData(contextData);
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          console.warn("API failed, using context data:", err.message);
          setSkillsData(contextData);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    };

    load();
    const interval = setInterval(load, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ab data ready hai
  const finalData = skillsData || contextData;
  const categories = finalData.categories || [];

  if (loading && categories.length === 0) {
    return (
      <section className="section-container skills-section" id="skills">
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Loading skills...
        </p>
      </section>
    );
  }

  return (
    <section className="section-container skills-section" id="skills">
      <div className="section-header">
        <span className="section-tag">
          {finalData.sectionTag || "Core Competencies"}
        </span>
        <h2 className="section-title">
          {finalData.sectionTitle || "Technical Skills"}
        </h2>
        <p className="section-subtitle">
          {finalData.sectionSubtitle ||
            "A structured breakdown of languages, frameworks, libraries, and tools I use to bring ideas to reality."}
        </p>
      </div>

      <div className="skills-grid">
        {categories.map((category) => (
          <div
            className="skills-category-card"
            key={category.id || category.name}
          >
            <div className="skills-card-header">
              <div className="skills-card-icon">
                {typeof category.icon === "string"
                  ? getDynamicIcon(category.icon, Server, { size: 22 })
                  : category.icon}
              </div>
              <div className="skills-card-title-group">
                <h3 className="skills-card-title">{category.name}</h3>
                <span className="skills-card-subtitle">
                  {category.subtitle}
                </span>
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