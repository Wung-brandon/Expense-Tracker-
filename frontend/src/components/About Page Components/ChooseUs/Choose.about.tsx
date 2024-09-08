import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const WhyChooseSection: React.FC = () => {
  return (
    <section className="py-5" style={{ backgroundColor: '#f9f9f9', paddingTop:"50px" }}>
      <Container>
        <Row className="text-center mb-4">
          <Col>
            <h2>Why Choose ExpenseEye?</h2>
            <p className="lead">ExpenseEye is built to help you stay on top of your finances with ease.</p>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="text-center">
            <h4>Easy to Use</h4>
            <p>ExpenseEye’s user-friendly interface makes it easy for anyone to start tracking their expenses right away.</p>
          </Col>
          <Col md={4} className="text-center">
            <h4>Powerful Features</h4>
            <p>From budget tracking to detailed reports, ExpenseEye has all the features you need to manage your finances.</p>
          </Col>
          <Col md={4} className="text-center">
            <h4>Secure & Reliable</h4>
            <p>Your data is safe with us. We provide secure cloud storage and backup for all your financial data.</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WhyChooseSection;
