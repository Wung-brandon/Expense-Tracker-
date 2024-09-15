import React from "react";
import "./Hero.css";
import expenseImage from "../../../assets/expense-tracker-app.png"; // Replace with your image path
import { useNavigate } from "react-router-dom";
import AnimatedText from "../AnimatedText";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Define animation variants
const fadeInVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const imageVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

function Hero() {
  const navigate = useNavigate();
  const texts = ['welcome to expenseEye', 'track your expenses with expenseEye'];

  // InView hooks for animations
  const { ref: textRef, inView: textInView } = useInView({
    threshold: 0.1,
  });
  const { ref: imageRef, inView: imageInView } = useInView({
    threshold: 0.1,
  });

  return (
    <div className="hero">
      <div className="container h-100">
        <div className="row align-items-center h-100 justify-content-center text-center">
          {/* Animated Text and Button Section */}
          <motion.div
            className="col-lg-6 col-md-12 mb-4 mb-lg-0"
            ref={textRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={textInView ? "visible" : "hidden"}
            transition={{ duration: 0.5 }}
          >
            <AnimatedText text={texts} className='text-capitalize h3' repeatDelay={1000} />
            <p className="hero-description">
              ExpenseEye as the name implies watches and track your expenses daily, weekly and monthly. ExpenseEye 
              is your go-to solution for managing and tracking your expenses with ease. Take control of your finances and make informed 
              decisions with our user-friendly platform.
            </p>
            <button className="mt-3 start-btn" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </motion.div>

          {/* Animated Image Section */}
          <motion.div
            className="col-lg-6 col-md-12"
            ref={imageRef}
            variants={imageVariants}
            initial="hidden"
            animate={imageInView ? "visible" : "hidden"}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src={expenseImage} alt="Expense Tracker" className="img-fluid hero-image" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
