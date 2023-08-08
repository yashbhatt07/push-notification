import { socket } from "./SuperAdmin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditById, getNotification } from "../API/API";
import profile from "../../assets/DummyProfile.webp";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { EditSchema } from "../Schema/Schema";
const Admin = () => {
  const params = useParams();
  const current = JSON.parse(localStorage.getItem(params.id + "__onLogin"));
  console.log("🚀 ~ file: Admin.jsx:29 ~ Admin ~ current:", current);

  const [currentUser, setCurrentUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  console.log("🚀 ~ file: Admin.jsx:27 ~ Admin ~ currentUser:", currentUser);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(EditSchema),
    defaultValue: currentUser,
  });

  // const [editData, setEditData] = useState({
  //   firstName: "",
  //   lastNamee: "",
  //   email: "",
  // });
  // console.log("🚀 ~ file: Admin.jsx:34 ~ Admin ~ editData:", editData);

  const [showEditModal, setShowEditModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [show, setShow] = useState(false);
  const closeHandler = () => {
    setShowEditModal(false);
    setCurrentUser(currentUser);
  };
  const showHandler = () => setShowEditModal(true);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNotificationCount(0);
    setShow(true);
  };

  useEffect(() => {
    if (current) {
      setCurrentUser({
        firstName: current.firstname,
        lastName: current.lastname,
        email: current.email,
        id: current.id,
      });

      setValue("firstname", current.firstname);
      setValue("lastname", current.lastname);
      setValue("email", current.email);
    }
  }, [setValue]);
  console.log(currentUser);
  useEffect(() => {
    getNotification()
      .then((TotelData) => {
        console.log("🚀 ~ file: Admin.jsx:23 ~ .then ~ data:", TotelData);
        if (TotelData != undefined) {
          setMessages(TotelData);
        }
      })
      .catch((e) => {
        console.log(e);
      });

    socket.on("receive_message", (data) => {
      let id = params.id;
      console.log(id);
      const onLogin = JSON.parse(localStorage.getItem(id + "__onLogin"));
      console.log("🚀 ~ file: Admin.jsx:87 ~ socket.on ~ onLogin:", onLogin);

      if (onLogin.status === true) {
        toast.success(`title:${data.title},message:${data.description}`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          theme: "light",
        });
      }

      setMessages((prevMessages) => [...prevMessages, data]);
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [socket]);

  const submitHandler = (data, event) => {
    console.log("🚀 ~ file: Admin.jsx:114 ~ submitHandler ~ data:", data);
    event.preventDefault();

    const userId = current.id;
    const updatedData = { ...current, ...data };
    localStorage.setItem(params.id + "__onLogin", JSON.stringify(updatedData));

    EditById(userId, updatedData)
      .then((res) => {
        console.log("Updated data:", res);
      })
      .catch((err) => {
        console.error("Error updating data:", err);
      });
    closeHandler();
  };
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

      <h3 style={{ color: "white", marginTop: "20px" }}>
        {current.id === 1
          ? "Admin 1"
          : current.id === 2
          ? "Admin 2"
          : current.id === 3
          ? "Admin 3"
          : current.id === 4
          ? "Admin 4"
          : current.id === 5
          ? "Admin 5"
          : "Admin"}
      </h3>
      <ToastContainer />
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {messages.length > 0 ? (
            [...messages].reverse().map((message, index) => (
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
          <Form onSubmit={handleSubmit(submitHandler)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                {...register("firstname")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last name"
                {...register("lastname")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="email"
                {...register("email")}
              />
              <span className="text-danger"> {errors.email?.message}</span>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button
              variant="primary"
              className="mx-2"
              type="button"
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
