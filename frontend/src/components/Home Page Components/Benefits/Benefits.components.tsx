
import "./Benefits.css";
import { FaChartLine, FaWallet, FaMobileAlt, FaShieldAlt } from "react-icons/fa"; // Importing icons from react-icons

function Benefits() {
  return (
    <div className="benefit">
      <div className="container">
        <h2 className="text-center text-capitalize slide-top title-color">Benefits of using ExpenseEye</h2>
        <div className="row py-4 slide-left">
          <div className="col-lg-6 col-sm-12 text-center">
            <FaChartLine className="benefit-icon" />
            <h3 className="benefit-title">Financial Insights</h3>
            <p className="benefit-description">
              Get detailed reports and insights into your spending habits, helping you make informed financial decisions.
            </p>
          </div>
          <div className="col-lg-6 col-sm-12 text-center">
            <FaWallet className="benefit-icon" />
            <h3 className="benefit-title">Expense Management</h3>
            <p className="benefit-description">
              Easily track your expenses and manage your budget effectively with our user-friendly interface.
            </p>
          </div>
        </div>

        <div className="row my-2 slide-right">
          <div className="col-lg-6 col-sm-12 text-center">
            <FaMobileAlt className="benefit-icon" />
            <h3 className="benefit-title">Mobile Accessibility</h3>
            <p className="benefit-description">
              Access your financial data anytime, anywhere, with our fully responsive website.
            </p>
          </div>
          <div className="col-lg-6 col-sm-12 text-center">
            <FaShieldAlt className="benefit-icon" />
            <h3 className="benefit-title">Secure Transactions</h3>
            <p className="benefit-description">
              Your data is protected with the highest level of security, ensuring safe and secure transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Benefits;
