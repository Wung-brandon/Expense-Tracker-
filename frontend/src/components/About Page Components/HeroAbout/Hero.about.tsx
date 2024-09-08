import { colors } from '@mui/material';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, backgroundImage }) => {
  const heroStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px', 
    position: 'relative',
    color: '#fff', 
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  return (
    <section style={heroStyle} className="d-flex align-items-center">
      <div style={overlayStyle}></div>
      <Container className="text-center">
        <Row>
          <Col>
            <h1 className="display-4" style={{color:"#fff", zIndex:1000}}>{title}</h1>
            <p className="lead">{subtitle}</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
