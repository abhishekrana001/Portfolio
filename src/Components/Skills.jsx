import { Server, Layout, Smartphone, Terminal } from "lucide-react";
import "./Skills.css";

const SKILL_CATEGORIES = [
  {
    name: "Backend Architecture",
    subtitle: "Enterprise APIs & Scalable Logic",
    icon: <Server size={22} />,
    items: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "Spring Security",
      "Node.js",
      "Express.js",
      "Microservices Concept",
    ],
  },
  {
    name: "Frontend Development",
    subtitle: "Interactive & Responsive Interfaces",
    icon: <Layout size={22} />,
    items: [
      "React.js",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Responsive Web Design",
      "Context API",
      "React Router",
    ],
  },
  {
    name: "Mobile App Development",
    subtitle: "Native Android Experiences",
    icon: <Smartphone size={22} />,
    items: [
      "Kotlin",
      "Android SDK",
      "Room Database",
      "MVVM Architecture",
      "XML Layouts",
      "REST API Integration",
    ],
  },
  {
    name: "Databases & Tooling",
    subtitle: "Storage, DevOps & Version Control",
    icon: <Terminal size={22} />,
    items: [
      "MySQL",
      "MongoDB",
      "SQL",
      "Git & GitHub",
      "Postman",
      "Vite",
      "VS Code / IntelliJ",
    ],
  },
];

function Skills() {
  return (
    <section className="section-container skills-section" id="skills">
      <div className="section-header">
        <span className="section-tag">Core Competencies</span>
        <h2 className="section-title">Technical Skills</h2>
        <p className="section-subtitle">
          A structured breakdown of languages, frameworks, libraries, and tools I use to bring ideas to reality.
        </p>
      </div>

      <div className="skills-grid">
        {SKILL_CATEGORIES.map((category) => (
          <div className="skills-category-card" key={category.name}>
            <div className="skills-card-header">
              <div className="skills-card-icon">{category.icon}</div>
              <div className="skills-card-title-group">
                <h3 className="skills-card-title">{category.name}</h3>
                <span className="skills-card-subtitle">{category.subtitle}</span>
              </div>
            </div>

            <div className="skills-list">
              {category.items.map((skill) => (
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
