import "./Projects.css";
import Stonegame from "../assets/PSS_logo.svg";
import currency from "../assets/foreign-exchange.png";
import Ticgame from "../assets/tic-tac-toe.png";

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

        <button>View Project</button>
      </div>

      <div className="project-card">
        <h3>Currency Converter</h3>
        <img src={currency} alt="image" />
        <p>
          A web application that converts currencies using JavaScript.
        </p>

        <p>HTML | CSS | JavaScript | API</p>

        <button>View Project</button>
      </div>

      <div className="project-card">
        <h3>Tic Tac Toe</h3>
        <img src={Ticgame} alt="image" />
        <p>
          A simple browser-based Tic Tac Toe game with interactive gameplay.
        </p>

        <p>HTML | CSS | JavaScript</p>

        <button>View Project</button>
      </div>

    </section>
    </>
  );
  
}

export default Projects;