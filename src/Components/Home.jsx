import "./Home.css";
import resume from "../assets/My_Cv.pdf";
import profileImg from "../assets/Profile.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="home" id="home">

      <div className="home-content">

        <p className="home-intro">Hello, I'm</p>

        <h1>Abhishek Rana</h1>

        <h2>Java Full Stack Developer</h2>

        <p className="home-description">
          I build responsive web applications using React.js,
          Java, Spring Boot, REST APIs and MySQL.
        </p>

        <div className="home-buttons">

          <a
            href={resume}
            download="My_Cv.pdf"
            className="resume"
          >
            Download Resume
          </a>

          <Link to="/projects" className="viewprojects">
            View Projects
          </Link>

        </div>

      </div>

      <div className="home-image">
        <img src={profileImg} alt="Abhishek Rana" />
      </div>

    </section>
  );
}

export default Home;