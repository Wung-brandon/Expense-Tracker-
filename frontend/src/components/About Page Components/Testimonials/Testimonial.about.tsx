import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface Testimonial {
  name: string;
  review: string;
  image: string;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-5" style={{ backgroundColor: '#f9f9f9' }}>
      <Container>
        <Row className="text-center mb-4">
          <Col>
            <h2>What Our Users Say</h2>
          </Col>
        </Row>
        <Row>
          {testimonials.map((testimonial, index) => (
            <Col md={6} className="mb-4" key={index}>
              <div className="testimonial text-center">
                <img src={testimonial.image} alt={testimonial.name} className="rounded-circle mb-3" style={{ width: '80px', height: '80px' }} />
                <h5>{testimonial.name}</h5>
                <p>{testimonial.review}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialSection;
