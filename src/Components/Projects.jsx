import "./Projects.css";
import Stonegame from "../assets/PSS_logo.svg";
import currency from "../assets/foreign-exchange.png";
import Ticgame from "../assets/tic-tac-toe.png";
import Notes from "../assets/note-app.png";
import Music from "../assets/player.png";
import Weather from "../assets/weather-app.png";
import Mang from "../assets/event-planner.png";

function Projects() {
  return (
    <>
    <h2>My Projects</h2>
    <section className="projects" id="projects">

      <div className="project-card">
        <h3>Stone Paper Scissors</h3>
        <img src={Stonegame} alt="image" />
        <p>
          A simple interactive game developed using HTML, CSS and JavaScript.
        </p>

        <p>HTML | CSS | JavaScript</p>

        <button><a href="https://github.com/abhishekrana001/Stone-Paper-Scissors"
                  target="_blank"
                  rel="noopener noreferrer">
                 View Project
                </a>
        </button>
      </div>

      <div className="project-card">
        <h3>Currency Converter</h3>
        <img src={currency} alt="image" />
        <p>
          A web application that converts currencies using JavaScript.
        </p>

        <p>HTML | CSS | JavaScript | API</p>

        <button>
          <a href="https://github.com/abhishekrana001/currency-converter"
                  target="_blank"
                  rel="noopener noreferrer">
                 View Project
                </a>
        </button>
      </div>

      <div className="project-card">
        <h3>Tic Tac Toe</h3>
        <img src={Ticgame} alt="image" />
        <p>
          A simple browser-based Tic Tac Toe game with interactive gameplay.
        </p>

        <p>HTML | CSS | JavaScript</p>

        <button>
          <a href="https://github.com/abhishekrana001/Tic-Tac-Toe-Game"
                  target="_blank"
                  rel="noopener noreferrer">
                 View Project
                </a>
        </button>
      </div>

      <div className="project-card">
        <h3>Weather App</h3>
        <img src={Weather} alt="Weather App" />
        <p>
          An Android application that displays weather information using a weather API.
        </p>

        <p>Kotlin | Android | API</p>

        <button>
          <a
            href="https://github.com/abhishekrana001/Weather-Application"
            target="_blank"
            rel="noopener noreferrer"
            >
            View Project
          </a>
        </button>
      </div>

      <div className="project-card">
        <h3>Notes App</h3>
        <img src={Notes} alt="Notes App" />
        <p>
          An Android application that allows users to create, edit, and delete notes.
        </p>

        <p>Kotlin | Android | Room Database</p>

        <button>
          <a
            href="https://github.com/abhishekrana001/notes-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project
          </a>
        </button>
      </div>

      <div className="project-card">
        <h3>Music Player</h3>
        <img src={Music} alt="Music Player" />
        <p>
          An Android application that allows users to play and control music tracks.
        </p>

        <p>Kotlin | Android | MediaPlayer</p>

        <button>
          <a
            href="https://github.com/abhishekrana001/Music-Player-App"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project
          </a>
        </button>
      </div>

      <div className="project-card">
        <h3>Event Management System App</h3>
        <img src={Mang} alt="Event Management App" />
        <p>
          An Android application that allows users to join and manage events.
        </p>

        <p>Kotlin | Android | Room Database | MVVM</p>

        <button>
          <a
            href="https://github.com/abhishekrana001/Event-Management-System"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project
          </a>
        </button>
      </div>  


    </section>
    </>
  );
  
}

export default Projects;