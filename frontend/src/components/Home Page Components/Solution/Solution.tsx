import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import solutionImage from '../../../assets/sol.png';
import './Solution.css';

// Define slide animation variants
const slideLeftVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
};

const slideRightVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
};

function Solution() {
  const { ref: leftRef, inView: leftInView } = useInView({
    threshold: 0.1, // Adjust threshold as needed
  });

  const { ref: rightRef, inView: rightInView } = useInView({
    threshold: 0.1,
  });

  return (
    <div className='solution'>
      <div className="container">
        <div className="row align-items-center">
          {/* Left image section */}
          <div className="col-lg-6 col-md-12 text-center text-lg-start mb-4 mb-lg-0">
            <motion.div
              ref={leftRef}
              variants={slideLeftVariants}
              initial="hidden"
              animate={leftInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.5 }}
            >
              <img src={solutionImage} alt="Problem Solution" className="img-fluid sol-img" />
            </motion.div>
          </div>

          {/* Right text section */}
          <div className="col-lg-6 col-md-12 text-center text-lg-start">
            <motion.div
              ref={rightRef}
              variants={slideRightVariants}
              initial="hidden"
              animate={rightInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.5 }}
            >
              <h2 className="solution-title">The Problem</h2>
              <p className="solution-description">
                Managing personal finances can be overwhelming, especially when dealing with multiple expenses across various categories. Many people struggle to keep track of their spending, leading to financial stress and poor decision-making.
              </p>
              <h2 className="solution-title">Our Solution</h2>
              <p className="solution-description">
                ExpenseEye provides a streamlined and intuitive platform to track and categorize expenses effortlessly. With real-time insights and user-friendly features, users can gain control over their finances, make informed decisions, and achieve their financial goals.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Solution;
