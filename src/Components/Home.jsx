import resume from "../assets/My_Cv.pdf";
import profileImg from "../assets/MyImg.webp";

function Home() {
  return (
    <section className="hero" id="home">
      <div className="hero-text">
        <p className="hero-hello">Hi, I'm</p>
        <h1>Abhishek Rana</h1>
        <p className="hero-role">Java Full Stack Developer</p>
        <p className="lead">
          I build web applications with Java, Spring Boot, REST APIs, React.js
          and MySQL, and Android apps with Kotlin.
        </p>
        <div className="actions">
          <a className="btn btn-primary" href="#projects">View projects</a>
          <a className="btn" href={resume} download="Abhishek_Rana_CV.pdf">
            Download resume
          </a>
        </div>
      </div>
      <img className="hero-photo" src={profileImg} alt="Abhishek Rana" />
    </section>
  );
}

export default Home;
