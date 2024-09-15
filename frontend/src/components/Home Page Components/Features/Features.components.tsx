import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaRegChartBar, FaWallet, FaBell, FaFileInvoiceDollar, FaUserShield, FaMobileAlt } from 'react-icons/fa';
import './Features.css';

// Define slide animation variants
const slideInVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
};

function Features() {
  return (
    <div className="features">
      <h2 className="text-center title-color text-capitalize slide-top">Features of ExpenseEye</h2>
      <div className="container">
        <div className="row mt-5">
          {[
            { icon: <FaRegChartBar className="benefit-icon" />, title: 'Detailed Analytics', description: 'Get in-depth insights into your spending habits with easy-to-understand analytics.' },
            { icon: <FaWallet className="benefit-icon" />, title: 'Budget Tracking', description: 'Set budgets and track your spending to ensure you stay within your financial limits.' },
            { icon: <FaBell className="benefit-icon" />, title: 'Expense Reminders', description: 'Receive notifications for upcoming bills and expenses to avoid late fees.' },
            { icon: <FaFileInvoiceDollar className="benefit-icon" />, title: 'Receipt Management', description: 'Easily upload and manage your receipts to keep track of all your transactions.' },
            { icon: <FaUserShield className="benefit-icon" />, title: 'Secure Data', description: 'Your financial data is encrypted and securely stored, ensuring your privacy.' },
            { icon: <FaMobileAlt className="benefit-icon" />, title: 'Mobile Friendly', description: 'Access and manage your expenses on the go with our mobile-friendly platform.' },
          ].map((feature, index) => {
            const { ref, inView } = useInView({ threshold: 0.1 });

            return (
              <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <motion.div
                  ref={ref}
                  variants={slideInVariants}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  transition={{ duration: 0.5 }}
                  className="card shadow text-center"
                >
                  <div className="card-body">
                    {feature.icon}
                    <h5 className="card-title benefit-title">{feature.title}</h5>
                    <p className="card-text benefit-description">{feature.description}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Features;
