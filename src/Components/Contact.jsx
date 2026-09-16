import "./Contact.css";

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-content">
        <p className="section-subtitle">Get In Touch</p>

        <h2>Contact Me</h2>

        <p className="contact-text">
          If you have an opportunity or would like to connect,
          feel free to contact me.
        </p>

        <div className="contact-links">
          <a href="abhishekrana99813@gmail.com">
            Email Me
          </a>

          <a
            href="https://github.com/abhishekrana001"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com/in/abhishek-rana-28872a294"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;