import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ teamMembers }) => {
  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">Meet the Team</h2>
        <Row>
          {teamMembers.map((member, index) => (
            <Col key={index} md={4} className="text-center">
              <Card className="shadow-sm mb-4">
                <Card.Img variant="top" src={member.image} />
                <Card.Body>
                  <h5>{member.name}</h5>
                  <p className="text-muted">{member.role}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TeamSection;
