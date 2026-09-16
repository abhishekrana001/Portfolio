import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar.jsx'
import Home from "./Components/Home.jsx";
import About from "./Components/About.jsx";
import Skills from "./Components/Skills.jsx";
import Projects from "./Components/Projects.jsx";
import Contact from "./Components/Contact.jsx";
import Footer from "./Components/Footer.jsx";


function App() {
  return (
    <>
    <Navbar/>
    
    <Home/>

    <About/>

    <Skills/>

    <Projects/>

    <Contact/>

    <Footer/>
    </>
  );
}

export default App;
