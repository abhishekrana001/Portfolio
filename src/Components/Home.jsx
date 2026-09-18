import "./Home.css";
import resume from "../assets/My_Cv.pdf";
import profileImg from "../assets/profile.png";

function Home() {
  return (
    <section className="home" id="home">
      <div className="home-content">
        <p className="home-intro">Hello, I'm</p>

        <h1>Abhishek Rana</h1>

        <h2>Java & Spring Boot Developer</h2>

        <p className="home-description">
          I build backend applications and REST APIs using Java,
          Spring Boot and MySQL.
        </p>

        <div className="home-buttons">
          <a href={resume} download="My_Cv.pdf" className="resume">
            Download Resume
          </a>
          <br />
          <a href="#projects" className="viewprojects">
            View Projects
          </a>
        </div>
      </div>
      <div className="home-image">
        <img src={profileImg} alt="Abhishek Rana" />
      </div>
    </section>
  );
}

export default Home;