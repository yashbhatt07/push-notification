// import React, { useState } from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
// import { notificationAPI } from "../API/API";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { notificationAPI } from "../API/API";
import DataTable from "../Table/Table";
export const socket = io.connect("http://localhost:5175");

const SuperAdmin = () => {
  const [messageTitle, setMessageTitle] = useState("");
  const [messageDescription, setMessageDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [selectedAdmins, setSelectedAdmins] = useState([]);

  console.log(
    "🚀 ~ file: SuperAdmin.jsx:18 ~ SuperAdmin ~ selectedAdmins:",
    selectedAdmins
  );

  const handleAdminSelection = (admin) => {
    if (selectedAdmins.includes(admin)) {
      setSelectedAdmins(selectedAdmins.filter((a) => a !== admin));
    } else {
      setSelectedAdmins([...selectedAdmins, admin]);
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();

    if (messageTitle === "") {
      setTitleError("Please Enter Title");
    }
    if (messageDescription === "") {
      setDescriptionError("Please Enter Description");
    } else {
      selectedAdmins.forEach((admin) => {
        socket.emit("send_message", {
          title: messageTitle,
          description: messageDescription,
          adminPath: admin,
        });
        notificationAPI({
          title: messageTitle,
          description: messageDescription,
          adminPath: admin,
        });
      });

      toast.success("message successfully sent", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "light",
      });
      setMessageDescription("");
      setMessageTitle("");
      setDescriptionError("");
      setTitleError("");
      setSelectedAdmins([]);
    }
  };

  const clearHandler = () => {
    setMessageDescription("");
    setMessageTitle("");
    setDescriptionError("");
    setTitleError("");
  };
  return (
    <>
      <div>
        <Link
          className="d-flex justify-content-end"
          to="/logout"
          reloadDocument
        >
          <Button className="btn-light"> Logout</Button>
        </Link>
      </div>
      <h1 style={{ color: "white" }}>SuperAdmin</h1>
      <ToastContainer />
      <DataTable />
      <Form onSubmit={sendMessage} style={{ width: "300px", margin: "auto" }}>
        <Form.Label className="text-white">Send To</Form.Label>
        <div
          className="d-flex text-white gap-2 "
          style={{
            backgroundColor: "rgb(23 26 26)",
            padding: "5px 16px",
            width: "100%",
          }}
        >
          <Form.Check
            aria-label="option 1"
            label="a-1"
            onChange={() => handleAdminSelection(1)}
            checked={selectedAdmins.includes(1)}
          />
          <Form.Check
            aria-label="option 2"
            label="a-2"
            onChange={() => handleAdminSelection(2)}
            checked={selectedAdmins.includes(2)}
          />
          <Form.Check
            aria-label="option 3"
            label="a-3"
            onChange={() => handleAdminSelection(3)}
            checked={selectedAdmins.includes(3)}
          />
          <Form.Check
            aria-label="option 4"
            label="a-4"
            onChange={() => handleAdminSelection(4)}
            checked={selectedAdmins.includes(4)}
          />
          <Form.Check
            aria-label="option 5"
            label="a-5"
            onChange={() => handleAdminSelection(5)}
            checked={selectedAdmins.includes(5)}
          />
        </div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="text-white">Title</Form.Label>
          <Form.Control
            value={messageTitle}
            type="text"
            onChange={(event) => {
              setMessageTitle(event.target.value);
            }}
          />
          {messageTitle.length > 0 ? (
            ""
          ) : (
            <span className="text-danger d-flex">{titleError}</span>
          )}
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="exampleForm.ControlTextarea1"
          style={{ width: "100%" }}
        >
          <Form.Label className="text-white">Message</Form.Label>
          <Form.Control
            value={messageDescription}
            onChange={(event) => {
              setMessageDescription(event.target.value);
            }}
            as="textarea"
            rows={3}
          />
          {messageDescription.length > 0 ? (
            ""
          ) : (
            <span className="text-danger d-flex">{descriptionError}</span>
          )}
        </Form.Group>
        <Button className="mx-3" type="submit">
          Send Message
        </Button>
        <Button onClick={clearHandler}>Cancel</Button> <br />
      </Form>
    </>
  );
};

export default SuperAdmin;
