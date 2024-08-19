import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../../assets/expenseEye-removebg-preview.png";
import "./Navbar.css"; // Assuming you have a separate CSS file for custom styles

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <img src={logo} alt="Logo" style={{ width: '100px' }} />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav ms-auto text-center-sm">
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
          <div className="d-flex ms-auto">
          <NavLink className="btn login me-2 fs-5" to="/login">Login</NavLink>
          <NavLink className="btn btn-primary signup-btn fs-5" to="/signup">Signup</NavLink>
        </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
