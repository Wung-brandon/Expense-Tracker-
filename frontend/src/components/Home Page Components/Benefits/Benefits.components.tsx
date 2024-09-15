import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaWallet, FaMobileAlt, FaShieldAlt } from 'react-icons/fa'; // Importing icons from react-icons
import { useInView } from 'react-intersection-observer'; // Import the correct hook
import './Benefits.css';

// Define slide animation variants
const slideInVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
};

function Benefits() {
  const { ref: titleRef, inView: titleInView } = useInView({  threshold: 0.1 });
  const { ref: iconRef, inView: iconInView } = useInView({  threshold: 0.1 });

  return (
    <div className="benefit">
      <div className="container">
        <motion.h2
          ref={titleRef}
          className="text-center text-capitalize title-color"
          variants={slideInVariants}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.5 }}
        >
          Benefits of using ExpenseEye
        </motion.h2>
        <div className="row py-4">
          <motion.div
            ref={iconRef}
            className="col-lg-6 col-sm-12 text-center"
            variants={slideInVariants}
            initial="hidden"
            animate={iconInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaChartLine className="benefit-icon" />
            <h3 className="benefit-title">Financial Insights</h3>
            <p className="benefit-description">
              Get detailed reports and insights into your spending habits, helping you make informed financial decisions.
            </p>
          </motion.div>
          <motion.div
            ref={iconRef}
            className="col-lg-6 col-sm-12 text-center"
            variants={slideInVariants}
            initial="hidden"
            animate={iconInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FaWallet className="benefit-icon" />
            <h3 className="benefit-title">Expense Management</h3>
            <p className="benefit-description">
              Easily track your expenses and manage your budget effectively with our user-friendly interface.
            </p>
          </motion.div>
        </div>

        <div className="row my-2">
          <motion.div
            ref={iconRef}
            className="col-lg-6 col-sm-12 text-center"
            variants={slideInVariants}
            initial="hidden"
            animate={iconInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <FaMobileAlt className="benefit-icon" />
            <h3 className="benefit-title">Mobile Accessibility</h3>
            <p className="benefit-description">
              Access your financial data anytime, anywhere, with our fully responsive website.
            </p>
          </motion.div>
          <motion.div
            ref={iconRef}
            className="col-lg-6 col-sm-12 text-center"
            variants={slideInVariants}
            initial="hidden"
            animate={iconInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <FaShieldAlt className="benefit-icon" />
            <h3 className="benefit-title">Secure Transactions</h3>
            <p className="benefit-description">
              Your data is protected with the highest level of security, ensuring safe and secure transactions.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Benefits;
