/* eslint-disable no-undef */
// import React, { useState } from "react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
// import { notificationAPI } from "../API/API";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { EditById, allAdmins, notificationAPI } from "../API/API";
import DataTable from "../DataTable/DataTable";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { messageSchema } from "../Schema/Schema";
import moment from "moment";
import { useParams } from "react-router-dom";
import { EditFromSuper } from "../EditFromSuper";

export const socket = io.connect("http://localhost:5175");

const SuperAdmin = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const params = useParams();
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  console.log("🚀 ~ file: SuperAdmin.jsx:24 ~ SuperAdmin ~ params:", params);
  // const current = JSON.parse(localStorage.getItem(params.id + "__onLogin"));

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(messageSchema),
  });
  const closeHandler = () => {
    setShowEditModal(false);
    // window.location.reload();
  };

  const showHandler = (admin) => {
    setShowEditModal(true);
    setSelectedAdmin(admin);
  };
  // const [messageTitle, setMessageTitle] = useState("");
  // const [messageDescription, setMessageDescription] = useState("");
  // const [titleError, setTitleError] = useState("");
  // const [descriptionError, setDescriptionError] = useState("");
  // const [selectedAdmins, setSelectedAdmins] = useState([]);
  // const [messageData, setMessageData] = useState({
  //   title: "",
  //   description: "",
  //   adminPath: [],
  // });

  // useEffect(() => {
  //   setMessageData({
  //     title: messageTitle,
  //     description: messageDescription,
  //   });
  // }, [messageTitle, messageDescription]);

  // const handleAdminSelection = (admin) => {
  //   if (selectedAdmins.includes(admin)) {
  //     setSelectedAdmins(selectedAdmins.filter((a) => a !== admin));
  //   } else {
  //     setSelectedAdmins([...selectedAdmins, admin]);
  //   }
  // };
  // Adding a new key to the form data

  const sendMessage = (data, event) => {
    console.log("🚀 ~ file: SuperAdmin.jsx:71 ~ sendMessage ~ data:", data);
    const currentTime = moment().format("MMMM Do YYYY");
    event.preventDefault();
    setValue("sentAt", currentTime);

    socket.emit("send_message", {
      title: data.title,
      description: data.description,
      id: data.id,
      sentAt: data.sentAt,
    });
    notificationAPI(data);

    toast.success("message successfully sent", {
      position: "top-right",
      autoClose: 3000,
      closeOnClick: true,
      theme: "light",
    });
    reset();

    // allAdmins().then((admins) => {
    //   const trueStatusAdmins = admins.filter((admin) => admin.status === true);
    //   trueStatusAdmins.forEach((admin) => {
    //     console.log(
    //       "🚀 ~ file: SuperAdmin.jsx:94 ~ trueStatusAdmins.forEach ~ admin:",
    //       admin
    //     );
    //     Email.send({
    //       SecureToken: "a971eb7f-5f97-4762-a0dc-2484e24509a4",
    //       To: admin.email,
    //       From: "testwings121221@gmail.com",
    //       Subject: data.title,
    //       Body: data.description,
    //     }).then((message) => {
    //       console.log(message);
    //       alert(message);
    //     });
    //   });
    // });
  };

  const clearHandler = () => {
    reset();
  };

  // const submitHandler = (data, event) => {
  //   event.preventDefault();

  //   const userId = current.id;
  //   console.log(
  //     "🚀 ~ file: SuperAdmin.jsx:110 ~ submitHandler ~ userId:",
  //     userId
  //   );
  //   const updatedData = { ...current, ...data };
  //   console.log(
  //     "🚀 ~ file: Admin.jsx:119 ~ submitHandler ~ updatedData:",
  //     updatedData
  //   );

  //   allAdmins()
  //     .then((admin) => {
  //       console.log("🚀 ~ file: Admin.jsx:122 ~ .then ~ admin:", admin);
  //       const isEmailUnique = admin.every(
  //         (adminData) =>
  //           adminData.id === userId ||
  //           (adminData.email !== updatedData.email &&
  //             adminData.firstname !== updatedData.firstname &&
  //             adminData.lastname !== updatedData.lastname)
  //       );

  //       if (!isEmailUnique) {
  //         toast.error("something is already exists for another admin.", {
  //           position: "top-center",
  //           autoClose: 3000,
  //           closeOnClick: true,
  //           theme: "light",
  //         });
  //         return;
  //       }
  //       localStorage.setItem(
  //         params.id + "__onLogin",
  //         JSON.stringify(updatedData)
  //       );
  //       toast.success("You Data Is Updated", {
  //         position: "top-center",
  //         autoClose: 3000,
  //         closeOnClick: true,
  //         theme: "light",
  //       });

  //       EditById(userId, updatedData)
  //         .then((res) => {
  //           console.log("Updated data:", res);
  //         })
  //         .catch((err) => {
  //           console.error("Error updating data:", err);
  //         });
  //       closeHandler();
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching admin data:", error);
  //     });
  // };
  return (
    <>
      <Link className="d-flex justify-content-end" to="/logout" reloadDocument>
        <Button className="btn-light"> Logout</Button>
      </Link>
      <div className="d-flex">
        <div style={{ margin: "auto 0" }}>
          <h1 style={{ color: "white" }}>SuperAdmin</h1>
          <ToastContainer />
          <Form
            onSubmit={handleSubmit(sendMessage)}
            style={{ width: "300px", margin: "auto" }}
          >
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label className="text-white">Title</Form.Label>
              <Form.Control
                // value={messageTitle}
                type="text"
                // onChange={(event) => {
                //   setMessageTitle(event.target.value);
                // }}
                {...register("title")}
              />

              <span className="text-danger mt-1"> {errors.title?.message}</span>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
              style={{ width: "100%" }}
            >
              <Form.Label className="text-white">Message</Form.Label>
              <Form.Control
                // value={messageDescription}
                // onChange={(event) => {
                //   setMessageDescription(event.target.value);
                // }}
                {...register("description")}
                as="textarea"
                rows={3}
              />

              <span className="text-danger mt-1">
                {" "}
                {errors.description?.message}
              </span>
            </Form.Group>
            <Button className="mx-3" type="submit">
              Send Message
            </Button>
            <Button onClick={clearHandler}>Cancel</Button> <br />
          </Form>
        </div>
        <div style={{ width: "50%", margin: "80px 0 0 0" }}>
          <DataTable
            // selectedAdmins={selectedAdmins}
            // setSelectedAdmins={setSelectedAdmins}
            showHandler={showHandler}
            // submitHandler={submitHandler}
          />
        </div>
      </div>
      <EditFromSuper
        selectedAdmin={selectedAdmin}
        // submitHandler={submitHandler}
        showEditModal={showEditModal}
        closeHandler={closeHandler}
      />
    </>
  );
};

export default SuperAdmin;
