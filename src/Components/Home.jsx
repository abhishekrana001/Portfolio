import "./Home.css";

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
          <button>View Projects</button>
          <button>Contact Me</button>
        </div>
      </div>
    </section>
  );
}

export default Home;