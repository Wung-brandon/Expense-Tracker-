import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

interface CallToActionSectionProps {
  title: string;
  description: string;
  buttonText: string;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ title, description, buttonText }) => {
  return (
    <section className="py-5 text-center" style={{ backgroundColor: '#5d3ebc', color: '#fff' }}>
      <Container>
        <Row>
          <Col>
            <h2>{title}</h2>
            <p className="lead">{description}</p>
            <Button variant="light" size="lg">
              {buttonText}
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CallToActionSection;
