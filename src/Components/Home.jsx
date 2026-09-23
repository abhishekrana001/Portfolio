import "./Home.css";
import resume from "../assets/My_Cv.pdf";
import profileImg from "../assets/MyImg.png";


const goToSection = (section) => {
    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.history.pushState({}, "", `/${section}`);
    }

    setMenuOpen(false);
  };


function Home() {
  return (
    <section className="home" id="home">

      <div className="home-content">

        <p className="home-intro">Hello, I'm</p>

        <h1>Abhishek Rana</h1>

        <h2>Java Full Stack Developer</h2>

        <p className="home-description">
          I build scalable web applications using Java, Spring Boot, REST APIs,
          React.js, MySQL, and modern full-stack technologies.
        </p>
        
        <div className="home-buttons">

          <a
            href={resume}
            download="My_Cv.pdf"
            className="resume"
          >
            Download Resume
          </a>

          <button onClick={() => goToSection("projects")}>
            Projects
          </button>

        </div>

      </div>

      <div className="home-image">
        <img src={profileImg} alt="Abhishek Rana" />
      </div>

    </section>
  );
}

export default Home;