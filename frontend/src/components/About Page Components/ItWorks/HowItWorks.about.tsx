import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-5">
      <Container>
        <Row className="text-center mb-4">
          <Col>
            <h2>How It Works</h2>
            <p className="lead">Start tracking your expenses in just three easy steps!</p>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="text-center">
            <h4>1. Sign Up</h4>
            <p>Create an account and get started with your financial journey.</p>
          </Col>
          <Col md={4} className="text-center">
            <h4>2. Add Expenses</h4>
            <p>Easily log your expenses, categorize them, and set budgets.</p>
          </Col>
          <Col md={4} className="text-center">
            <h4>3. Get Insights</h4>
            <p>Track your spending habits and get detailed reports and insights.</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorksSection;
