import "./Hero.css";
import expenseImage from "../../../assets/expense-tracker-app.png"; // Replace with your image path
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  
  return (
    <div className="hero">
      <div className="container h-100">
        <div className="row align-items-center h-100 justify-content-center text-center">
          <div className="col-lg-6 col-md-12 mb-4 mb-lg-0 slide-left">
            <h1 className="hero-title text-capitalize">track your expenses with ExpenseEye</h1>
            <p className="hero-description">
              ExpenseEye is your go-to solution for managing and tracking your expenses with ease. Take control of your finances and make informed decisions with our user-friendly platform.
            </p>
            <button className="mt-3 start-btn" onClick={() => navigate('/signup')}>Get Started</button>
          </div>
          <div className="col-lg-6 col-md-12 slide-right">
            <img src={expenseImage} alt="Expense Tracker" className="img-fluid hero-image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
