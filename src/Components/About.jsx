import { CheckCircle2, GraduationCap } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { getDynamicIcon } from "../data/assetRegistry.js";
import "./About.css";

function About() {
  const { data } = usePortfolio();
  const aboutData = data?.about || {};

  const highlights = aboutData.highlights || [
    "Expertise in designing RESTful APIs and database schemas with Spring Boot & MySQL.",
    "Skilled in modern React patterns, state management, and component architecture.",
    "Native mobile app engineering using Kotlin, Android SDK, and MVVM principles.",
    "Passionate about writing clean, maintainable, and well-documented code.",
  ];

  const cards = aboutData.cards || [
    {
      id: "c1",
      icon: "GraduationCap",
      title: "Education",
      value: "B.Sc. in IT Graduate",
      desc: "Strong academic foundation in computer science and software development.",
    },
    {
      id: "c2",
      icon: "Server",
      title: "Backend Focus",
      value: "Java & Spring Boot",
      desc: "Robust architecture, Hibernate/JPA, REST APIs & MySQL database design.",
    },
    {
      id: "c3",
      icon: "Layers",
      title: "Full Stack Web",
      value: "MERN & React.js",
      desc: "Responsive web apps with React.js, Node.js, Express, and MongoDB.",
    },
    {
      id: "c4",
      icon: "Smartphone",
      title: "Mobile Apps",
      value: "Android (Kotlin)",
      desc: "Building user-centric Android applications with Room DB & MVVM.",
    },
  ];

  const paragraphs = aboutData.paragraphs || [
    "I am a B.Sc. IT graduate and Full Stack Developer with deep enthusiasm for engineering robust, performant digital solutions. My core foundation lies in Java and Spring Boot, crafting secure RESTful APIs and managing relational databases with MySQL.",
    "Alongside Java enterprise technologies, I actively build full stack web solutions using the MERN stack (React.js, Node.js, Express.js, MongoDB), ensuring smooth, responsive, and intuitive user experiences.",
    "On the mobile front, I build native Android applications using Kotlin and modern Android architecture components. I love solving real-world challenges, exploring emerging tech, and continuously refining my engineering capabilities.",
  ];

  return (
    <section className="section-container about-section" id="about">
      <div className="section-header">
        <span className="section-tag">{aboutData.sectionTag || "About Me"}</span>
        <h2 className="section-title">{aboutData.sectionTitle || "Background & Passion"}</h2>
        <p className="section-subtitle">
          {aboutData.sectionSubtitle ||
            "Driven software engineer with a strong focus on backend scalability, modern web design, and mobile app development."}
        </p>
      </div>

      <div className="about-grid">
        <div className="about-narrative">
          {paragraphs.map((p, index) => (
            <p className="about-text" key={index}>
              {p}
            </p>
          ))}

          <div className="about-highlights-list">
            {highlights.map((h, i) => (
              <div className="about-highlight-item" key={i}>
                <span className="highlight-bullet">
                  <CheckCircle2 size={15} />
                </span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-cards">
          {cards.map((c, i) => (
            <div className="about-card" key={c.id || i}>
              <div className="about-card-icon">
                {typeof c.icon === "string"
                  ? getDynamicIcon(c.icon, GraduationCap, { size: 22 })
                  : c.icon}
              </div>
              <span className="about-card-title">{c.title}</span>
              <h3 className="about-card-value">{c.value}</h3>
              <p className="about-card-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;