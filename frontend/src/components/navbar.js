import React, { useEffect, useState } from "react";
import getUserInfo from '../utils/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    setUser(null);
    window.location.href = "/login"; 
  };

  return (
    <ReactNavbar bg="dark" variant="dark">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Start</Nav.Link>
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
          <Nav.Link href="/mapPage">View Map</Nav.Link>
          <Nav.Link href="/tripPlannerPage">Trip Planner</Nav.Link>
          <Nav.Link href="/tripSummaryPage">Trip Summary</Nav.Link>

        </Nav>
        <Nav className="ms-auto">
          {user && (
            <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
          )}
        </Nav>
      </Container>
    </ReactNavbar>
  );
}
