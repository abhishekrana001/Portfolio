const LAYERS = [
  { name: "Backend", items: ["Java", "Spring Boot", "REST APIs", "Node.js", "Express.js"] },
  { name: "Frontend", items: ["React.js", "JavaScript", "HTML", "CSS"] },
  { name: "Mobile", items: ["Kotlin", "Android"] },
  { name: "Data and tools", items: ["SQL", "MySQL", "MongoDB", "Git & GitHub"] },
];

function Skills() {
  return (
    <section className="section" id="skills">
      <h2>Skills</h2>
      <dl className="layers">
        {LAYERS.map((l) => (
          <div className="layer" key={l.name}>
            <dt>{l.name}</dt>
            <dd>
              <ul>
                {l.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default Skills;
