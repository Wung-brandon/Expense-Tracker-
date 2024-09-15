import Hero from '../components/Home Page Components/Hero/Hero.components';
import Solution from '../components/Home Page Components/Solution/Solution';
import Benefit from '../components/Home Page Components/Benefits/Benefits.components';
import Features from '../components/Home Page Components/Features/Features.components';
import Reviews from '../components/Home Page Components/Reviews/Review.components';
import Faq from '../components/Home Page Components/FAQ/Faq.components';
import { motion, useScroll } from "framer-motion";

function HomePage() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#fff" }}>
      {/* Progress Bar */}
      <motion.div
        className="progress-bar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "10px",
          backgroundColor: "#4a148c",  
          transformOrigin: "0%",
          scaleX: scrollYProgress,  
          zIndex: 1000  
        }}
      />

      {/* Page Content */}
      <div className="flex-grow-1">
        <Hero />
        <Solution />
        <Benefit />
        <Features />
        <Reviews />
        <Faq />
      </div>
    </div>
  );
}

export default HomePage;
