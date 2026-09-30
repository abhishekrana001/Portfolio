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

const GH = "https://github.com/abhishekrana001/";

const PROJECTS = [
  {
    name: "Event Management System",
    img: Mang,
    alt: "Event Management System app",
    desc: "Android app where users join and manage events.",
    tags: ["Kotlin", "Android", "Room", "MVVM"],
    repo: "Event-Management-System"
  },

  {
    name: "Weather App",
    img: Weather,
    alt: "Weather app screen",
    desc: "Android app that shows live weather from a weather API.",
    tags: ["Kotlin", "Android", "API"],
    repo: "Weather-Application"
  },

  {
    name: "Notes App",
    img: Notes,
    alt: "Notes app screen",
    desc: "Android app to create, edit and delete notes.",
    tags: ["Kotlin", "Android", "Room"],
    repo: "notes-app"
  },

  {
    name: "Music Player",
    img: Music,
    alt: "Music player app screen",
    desc: "Android app to play and control music tracks.",
    tags: ["Kotlin", "Android", "MediaPlayer"],
    repo: "Music-Player-App"
  },

  {
    name: "Currency Converter",
    img: currency,
    alt: "Currency converter",
    desc: "Web app that converts currencies using live rates.",
    tags: ["HTML", "CSS", "JavaScript", "API"],
    repo: "currency-converter"
  },

  {
    name: "Tic Tac Toe",
    img: Ticgame,
    alt: "Tic Tac Toe board",
    desc: "Browser-based Tic Tac Toe game for two players.",
    tags: ["HTML", "CSS", "JavaScript"],
    repo: "Tic-Tac-Toe-Game"
  },

  {
    name: "Stone Paper Scissors",
    img: Stonegame,
    alt: "Stone Paper Scissors logo",
    desc: "Interactive Stone Paper Scissors game played against the computer.",
    tags: ["HTML", "CSS", "JavaScript"],
    repo: "Stone-Paper-Scissors"
  },

  {
  name: "Airbnb",
  img: Airbnb,
  alt: "Airbnb rental booking website",
  desc: "Property rental platform where users can explore stays, search properties, view details and manage bookings.",
  tags: ["React", "JavaScript", "CSS", "React Router"],
  repo: "Airbnb"
 },

  {
    name: "Job Portal",
    img: JobPortal,
    alt: "Job Portal website",
    desc: "React-based job portal with job search, filters, job cards and saved jobs.",
    tags: ["React", "JavaScript", "CSS", "React Router"],
    repo: "Job-Portal"
  },

  {
    name: "ARKart E-commerce",
    img: Arkart,
    alt: "ARKart E-commerce website",
    desc: "Modern e-commerce website with product browsing, cart and shopping features.",
    tags: ["React", "JavaScript", "CSS", "Context API"],
    repo: "ARKart"
  }
];

function Projects() {
  return (
    <section className="section" id="projects">
      <h2>Projects</h2>
      <ul className="projects">
        {PROJECTS.map((p) => (
          <li className="project" key={p.repo}>
            <img src={p.img} alt={p.alt} loading="lazy" />
            <div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <ul className="tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <a className="btn" href={GH + p.repo} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Projects;
