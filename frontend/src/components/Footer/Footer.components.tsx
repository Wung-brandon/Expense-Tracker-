import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Email, Facebook, Twitter, LinkedIn } from "@mui/icons-material";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="footer mt-auto shadow text-white py-4 px-5">
      <div className="container-fluid">
        <div className="row mt-4">
          {/* About Us Section */}
          <div className="col-lg-3 col-md-6 mb-4 ">
            <h5 className="text-uppercase">About Us</h5>
            <p>
              ExpenseEye is dedicated to helping you manage your expenses with ease and efficiency. Our platform provides a comprehensive tool for tracking your spending and making informed financial decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white">Home</Link></li>
              <li><Link to="/about" className="text-white">About</Link></li>
              <li><Link to="/contact" className="text-white">Contact</Link></li>
              <li><Link to="/login" className="text-white">Login</Link></li>
              <li><Link to="/signup" className="text-white">Signup</Link></li>
            </ul>
          </div>

          {/* Get Started & Contact Us */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase">Wants to track your expenses?</h5>
            <Button variant="contained" onClick={() => navigate("/signup")} color="primary" className="w-100 mb-3">
              Get Started
            </Button>
            <h5 className="text-uppercase">Contact Us</h5>
            <Box component="form" noValidate autoComplete="off" className="d-flex align-items-center">
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                size="small"
                className="me-2"
                fullWidth
                InputProps={{
                  style: { backgroundColor: 'white', borderRadius: '4px' }
                }}
              />
              <Button variant="contained" color="primary" endIcon={<Email />}>
                Send
              </Button>
            </Box>
          </div>

          {/* Social Media Icons */}
          <div className="col-lg-3 col-md-6 d-flex align-items-center justify-content-center mb-4">
            <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
              <Facebook fontSize="large" />
            </Link>
            <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
              <Twitter fontSize="large" />
            </Link>
            <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white">
              <LinkedIn fontSize="large" />
            </Link>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} ExpenseEye. All Rights Reserved.</p>
          <p>Need help? <a href="/contact" className="text-white">Contact us</a></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
