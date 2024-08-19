import "./Features.css";
import { FaRegChartBar, FaWallet, FaBell, FaFileInvoiceDollar, FaUserShield, FaMobileAlt } from "react-icons/fa";

function Features() {
  return (
    <div className="features">
      <h2 className="text-center title-color text-capitalize slide-top">Features of ExpenseEye</h2>
      <div className="container">

        <div className="row mt-5 slide-right">
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card shadow text-center">
              <div className="card-body">
                <FaRegChartBar className="benefit-icon" />
                <h5 className="card-title benefit-title">Detailed Analytics</h5>
                <p className="card-text benefit-description">Get in-depth insights into your spending habits with easy-to-understand analytics.</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card shadow text-center">
              <div className="card-body">
                <FaWallet className="benefit-icon" />
                <h5 className="card-title benefit-title">Budget Tracking</h5>
                <p className="card-text benefit-description">Set budgets and track your spending to ensure you stay within your financial limits.</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card shadow text-center">
              <div className="card-body">
                <FaBell className="benefit-icon" />
                <h5 className="card-title benefit-title">Expense Reminders</h5>
                <p className="card-text benefit-description">Receive notifications for upcoming bills and expenses to avoid late fees.</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card shadow text-center">
              <div className="card-body">
                <FaFileInvoiceDollar className="benefit-icon" />
                <h5 className="card-title benefit-title">Receipt Management</h5>
                <p className="card-text benefit-description">Easily upload and manage your receipts to keep track of all your transactions.</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card shadow text-center">
              <div className="card-body">
                <FaUserShield className="benefit-icon" />
                <h5 className="card-title benefit-title">Secure Data</h5>
                <p className="card-text benefit-description">Your financial data is encrypted and securely stored, ensuring your privacy.</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card shadow text-center">
              <div className="card-body">
                <FaMobileAlt className="benefit-icon" />
                <h5 className="card-title benefit-title">Mobile Friendly</h5>
                <p className="card-text benefit-description">Access and manage your expenses on the go with our mobile-friendly platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
