import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = ({ showHandler, notificationCount, handleShow, profile }) => {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav
          className="me-auto"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
            flexDirection: "row",
          }}
        >
          {" "}
          <span>
            <i className="fa-solid fa-bell spacing" onClick={handleShow}>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </i>
          </span>
          <Link to="/logout" reloadDocument style={{ marginRight: "5px" }}>
            <Button className="btn-dark" style={{ margin: " 9px 0 0 0" }}>
              {" "}
              Logout
            </Button>
          </Link>
          <img src={profile} width={50} alt="profile" onClick={showHandler} />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
