

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function Footer() {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="py-3"
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      <Container>
        <span className="text-secondary">&copy; ToDoApp_SPA 2025</span>
      </Container>
    </Navbar>
  );
}