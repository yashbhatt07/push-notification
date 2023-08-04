// import React, { useState } from "react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
// import { notificationAPI } from "../API/API";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { notificationAPI } from "../API/API";
import DataTable from "../DataTable/DataTable";
export const socket = io.connect("http://localhost:5175");

const SuperAdmin = () => {
  const [messageTitle, setMessageTitle] = useState("");
  const [messageDescription, setMessageDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [messageData, setMessageData] = useState({
    title: "",
    description: "",
    adminPath: [1, 2, 3, 4, 5],
  });

  console.log(
    "🚀 ~ file: SuperAdmin.jsx:18 ~ SuperAdmin ~ selectedAdmins:",
    selectedAdmins
  );
  useEffect(() => {
    setMessageData({
      title: messageTitle,
      description: messageDescription,
      adminPath: selectedAdmins,
    });
  }, [messageTitle, messageDescription, selectedAdmins]);

  // const handleAdminSelection = (admin) => {
  //   if (selectedAdmins.includes(admin)) {
  //     setSelectedAdmins(selectedAdmins.filter((a) => a !== admin));
  //   } else {
  //     setSelectedAdmins([...selectedAdmins, admin]);
  //   }
  // };
  const sendMessage = (event) => {
    event.preventDefault();
    // Email.send({
    //   SecureToken: "a971eb7f-5f97-4762-a0dc-2484e24509a4",
    //   To: "testwings121221@gmail.com",
    //   From: "testwings121221@gmail.com",
    //   Subject: messageTitle,
    //   Body: messageDescription,
    // }).then((message) => {
    //   console.log(message);

    //   alert(message);
    // });
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
        notificationAPI(messageData);
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
      <Link className="d-flex justify-content-end" to="/logout" reloadDocument>
        <Button className="btn-light"> Logout</Button>
      </Link>
      <div style={{ display: "flex" }}>
        <div style={{ width: "40%", margin: "auto 0" }}>
          <h1 style={{ color: "white" }}>SuperAdmin</h1>
          <ToastContainer />
          <Form
            onSubmit={sendMessage}
            style={{ width: "300px", margin: "auto" }}
          >
            {/* <div
              className="d-flex text-white gap-2 "
              style={{
                backgroundColor: "rgb(23 26 26)",
                padding: "5px 16px",
                width: "100%",
              }}
            >
              <Form.Check
                type="switch"
                label="1"
                onChange={() => handleAdminSelection(1)}
                checked={selectedAdmins.includes(1)}
              />
              <Form.Check
                type="switch"
                label="2"
                onChange={() => handleAdminSelection(2)}
                checked={selectedAdmins.includes(2)}
              />
              <Form.Check
                type="switch"
                label="3"
                onChange={() => handleAdminSelection(3)}
                checked={selectedAdmins.includes(3)}
              />
              <Form.Check
                type="switch"
                label="4"
                onChange={() => handleAdminSelection(4)}
                checked={selectedAdmins.includes(4)}
              />
              <Form.Check
                type="switch"
                label="5"
                onChange={() => handleAdminSelection(5)}
                checked={selectedAdmins.includes(5)}
              />
            </div> */}
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
        </div>
        <div style={{ width: "50%", margin: "80px 0 0 0" }}>
          <DataTable
            selectedAdmins={selectedAdmins}
            setSelectedAdmins={setSelectedAdmins}
          />
        </div>
      </div>
    </>
  );
};

export default SuperAdmin;
