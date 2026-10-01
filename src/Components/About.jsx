import { GraduationCap, Server, Layers, Smartphone, CheckCircle2 } from "lucide-react";
import "./About.css";

function About() {
  const highlights = [
    "Expertise in designing RESTful APIs and database schemas with Spring Boot & MySQL.",
    "Skilled in modern React patterns, state management, and component architecture.",
    "Native mobile app engineering using Kotlin, Android SDK, and MVVM principles.",
    "Passionate about writing clean, maintainable, and well-documented code.",
  ];

  const cards = [
    {
      icon: <GraduationCap size={22} />,
      title: "Education",
      value: "B.Sc. in IT Graduate",
      desc: "Strong academic foundation in computer science and software development.",
    },
    {
      icon: <Server size={22} />,
      title: "Backend Focus",
      value: "Java & Spring Boot",
      desc: "Robust architecture, Hibernate/JPA, REST APIs & MySQL database design.",
    },
    {
      icon: <Layers size={22} />,
      title: "Full Stack Web",
      value: "MERN & React.js",
      desc: "Responsive web apps with React.js, Node.js, Express, and MongoDB.",
    },
    {
      icon: <Smartphone size={22} />,
      title: "Mobile Apps",
      value: "Android (Kotlin)",
      desc: "Building user-centric Android applications with Room DB & MVVM.",
    },
  ];

  return (
    <section className="section-container about-section" id="about">
      <div className="section-header">
        <span className="section-tag">About Me</span>
        <h2 className="section-title">Background & Passion</h2>
        <p className="section-subtitle">
          Driven software engineer with a strong focus on backend scalability, modern web design, and mobile app development.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-narrative">
          <p className="about-text">
            I am a <strong>B.Sc. IT graduate</strong> and <strong>Full Stack Developer</strong> with
            deep enthusiasm for engineering robust, performant digital solutions. My core foundation
            lies in <strong>Java and Spring Boot</strong>, crafting secure RESTful APIs and managing
            relational databases with <strong>MySQL</strong>.
          </p>

          <p className="about-text">
            Alongside Java enterprise technologies, I actively build full stack web solutions using
            the <strong>MERN stack (React.js, Node.js, Express.js, MongoDB)</strong>, ensuring smooth,
            responsive, and intuitive user experiences.
          </p>

          <p className="about-text">
            On the mobile front, I build native Android applications using <strong>Kotlin</strong> and
            modern Android architecture components. I love solving real-world challenges, exploring
            emerging tech, and continuously refining my engineering capabilities.
          </p>

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
            <div className="about-card" key={i}>
              <div className="about-card-icon">{c.icon}</div>
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