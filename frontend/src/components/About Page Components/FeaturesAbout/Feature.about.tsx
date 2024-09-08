import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface FeatureProps {
  features: { title: string; description: string; icon: string }[];
}

const FeatureSection: React.FC<FeatureProps> = ({ features }) => {
  return (
    <section className="p-5 mt-4">
      <Container>
        <Row className="text-center">
          {features.map((feature, index) => (
            <Col key={index} md={4}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <div className="mb-3">
                    <i className={`bi bi-${feature.icon} display-4 text-primary`}></i>
                  </div>
                  <h5>{feature.title}</h5>
                  <p>{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeatureSection;
