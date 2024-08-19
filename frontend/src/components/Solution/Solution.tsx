import React from 'react';
import './Solution.css';
import solutionImage from '../../assets/sol.png'; 

function Solution() {
  return (
    <div className='solution'>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 text-center text-lg-start mb-4 mb-lg-0 slide-left">
            <img src={solutionImage} alt="Problem Solution" className="img-fluid sol-img" />
          </div>
          <div className="col-lg-6 col-md-12 text-center text-lg-start slide-right">
            <h2 className="solution-title">The Problem</h2>
            <p className="solution-description">
              Managing personal finances can be overwhelming, especially when dealing with multiple expenses across various categories. Many people struggle to keep track of their spending, leading to financial stress and poor decision-making.
            </p>
            <h2 className="solution-title">Our Solution</h2>
            <p className="solution-description">
              ExpenseEye provides a streamlined and intuitive platform to track and categorize expenses effortlessly. With real-time insights and user-friendly features, users can gain control over their finances, make informed decisions, and achieve their financial goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Solution;
