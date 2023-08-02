import { socket } from "./SuperAdmin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getNotification } from "../API/API";
import profile from "../../assets/DummyProfile.webp";

import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
const Admin = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [messages, setMessages] = useState([]);
  console.log("🚀 ~ file: Admin.jsx:12 ~ Admin ~ messages:", messages);
  const [notificationCount, setNotificationCount] = useState(0);
  const [show, setShow] = useState(false);

  const closeHandler = () => setShowEditModal(false);
  const showHandler = () => setShowEditModal(true);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNotificationCount(0);
    setShow(true);
  };
  useEffect(() => {
    getNotification()
      .then((TotelData) => {
        console.log("🚀 ~ file: Admin.jsx:23 ~ .then ~ data:", TotelData);
        setMessages(TotelData);
      })
      .catch((e) => {
        console.log(e);
      });

    socket.on("receive_message", (data) => {
      console.log("🚀 ~ file: Admin.jsx:30 ~ socket.on ~ data:", data);
      const onLogin = JSON.parse(localStorage.getItem("onLogin"));
      if (parseInt(onLogin.id) == data.adminPath) {
        toast.success(`title:${data.title},message:${data.description}`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          theme: "light",
        });
      }

      setMessages((prevMessages) => [data, ...prevMessages]);
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    axios
      .put("admins")
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
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
                  <span className="notification-badge">
                    {notificationCount}
                  </span>
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

      <div style={{ color: "white", marginTop: "20px" }}>Admin</div>
      <ToastContainer />
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {messages.length > 0 ? (
            messages
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((message, index) => (
                <div key={index}>
                  <strong>{`Title: ${message.title}`}</strong>
                  <p>{`Message: ${message.description}`}</p>
                </div>
              ))
          ) : (
            <p>No messages</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showEditModal} onHide={closeHandler} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Profile</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Password" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button
              variant="primary"
              className="mx-2"
              type="submit"
              onClick={closeHandler}
            >
              Cancel
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Admin;
