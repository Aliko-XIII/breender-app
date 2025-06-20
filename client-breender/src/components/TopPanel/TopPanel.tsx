import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCookies } from 'react-cookie';

export const TopPanel = () => {
  const { userId, setUserId, setUserEmail } = useUser();
  const [ , , removeCookie] = useCookies(['access_token']);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie('access_token', { path: '/' });
    setUserId(null);
    setUserEmail(null);
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/home">Breender</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Before auth */}
            {!userId && <Nav.Link as={Link} to="/">Welcome</Nav.Link>}
            {!userId && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            {!userId && <Nav.Link as={Link} to="/signup">Register</Nav.Link>}

            {/* After auth */}
            {userId && <Nav.Link as={Link} to="/user-profile">Profile</Nav.Link>}
            {userId && <Nav.Link as={Link} to="/animals">My Animals</Nav.Link>}
            {userId && <Nav.Link as={Link} to={`/users/${userId}/records`}>My Records</Nav.Link>}
            {userId && <Nav.Link as={Link} to={`/users/${userId}/reminders`}>My Reminders</Nav.Link>}
            {userId && <Nav.Link as={Link} to="/map">Find Animals</Nav.Link>}
            {userId && <Nav.Link as={Link} to="/partnerships">Partnerships</Nav.Link>}
            {userId && <Nav.Link as={Link} to={`/users/${userId}/photos`}>My Photos</Nav.Link>}
            {userId && <Nav.Link as={Link} to={`/users/${userId}/documents`}>My Documents</Nav.Link>}
          </Nav>

          {/* Logout button aligned right */}
          {userId && (
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
