import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export const TopPanel = () => {
  const { userId, isLoading } = useUser();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Breender</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!userId && <Nav.Link as={Link} to="/">Welcome</Nav.Link>}
            {userId && <Nav.Link as={Link} to="/user-profile">Profile</Nav.Link>}
            {userId && <Nav.Link as={Link} to="/animals">Animals</Nav.Link>}
            {!userId && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            {!userId && <Nav.Link as={Link} to="/signup">Register</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
