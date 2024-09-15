import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../../assets/expenseEye-removebg-preview.png";
import "./Navbar.css";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Animation for toggler icon (burger icon)
  const toggleIconVariants = {
    open: { rotate: 90 }, // Rotate when open
    closed: { rotate: 0 }, // Reset to normal when closed
  };

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <img src={logo} alt="Logo" style={{ width: '100px' }} />
        </NavLink>
        {/* Toggler button with animation */}
        <motion.button
          className="navbar-toggler"
          type="button"
          onClick={handleNavToggle}
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
          animate={isNavOpen ? "open" : "closed"}
          variants={toggleIconVariants}
          whileHover={{ scale: 1.1 }} // Optional hover effect
        >
          <motion.span className="navbar-toggler-icon" />
        </motion.button>

        <div className={`collapse navbar-collapse justify-content-center ${isNavOpen ? 'show' : ''}`} id="navbarNav">
          {/* Center links vertically in small screen */}
          <ul className="navbar-nav justify-content-center flex-column flex-md-row ms-auto text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contact</NavLink>
            </li>
          </ul>

          <div className="d-flex flex-column flex-md-row justify-content-center ms-md-auto mt-2 mt-md-0">
            <NavLink className="btn login mb-2 mb-md-0 me-md-2 fs-5" to="/login">Login</NavLink>
            <NavLink className="btn btn-primary signup-btn fs-5" to="/signup">Signup</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
