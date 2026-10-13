import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import Skills from "./Components/Skills";
import Projects from "./Components/Projects";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import AdminLauncher from "./Components/AdminLauncher";
import AdminDashboard from "./Components/Admin/AdminDashboard";

function PortfolioView({ theme, toggleTheme }) {
  return (
    <div className="app-container">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main id="main-content">
        <Home />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <AdminLauncher />
    </div>
  );
}

PortfolioView.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          {/* Public portfolio */}
          <Route
            path="/"
            element={<PortfolioView theme={theme} toggleTheme={toggleTheme} />}
          />

          {/* Admin Studio */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/admin/dashboard"
            element={<Navigate to="/admin" replace />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  );
}

export default App;