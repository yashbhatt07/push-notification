import React, { useEffect, useState } from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditSchema } from "./Schema/Schema";
import { useParams } from "react-router-dom";
import { EditById, allAdmins } from "./API/API";
import { ToastContainer, toast } from "react-toastify";

export const EditFromSuper = ({
  showEditModal,
  closeHandler,
  selectedAdmin,
}) => {
  const [currentData, setCurrentData] = useState([]);

  let params = useParams();
  console.log(
    "🚀 ~ file: EditFromSuper.jsx:12 ~ EditFromSuper ~ params:",
    params
  );
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(EditSchema),
  });

  useEffect(() => {
    allAdmins().then(
      (admin) => {
        console.log("🚀 ~ file: EditFromSuper.jsx:34 ~ .then ~ admin:", admin);

        if (selectedAdmin) {
          setValue("firstname", selectedAdmin.firstname);
          setValue("lastname", selectedAdmin.lastname);
          setValue("email", selectedAdmin.email);
          // Set other form fields as needed
        }
      },
      [selectedAdmin, setValue]
    );
  });

  const submit = (data) => {
    const updatedAdmin = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
    };
    allAdmins()
      .then((admin) => {
        console.log("🚀 ~ file: Admin.jsx:122 ~ .then ~ admin:", admin);
        const isEmailUnique = admin.every(
          (adminData) =>
            adminData.email !== data.email &&
            adminData.firstname !== data.firstname &&
            adminData.lastname !== data.lastname
        );

        if (!isEmailUnique) {
          toast.error("something is already exists for another admin.", {
            position: "top-center",
            autoClose: 3000,
            closeOnClick: true,
            theme: "light",
          });
          return;
        }

        toast.success("You Data Is Updated", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          theme: "light",
        });
        EditById(selectedAdmin.id, updatedAdmin)
          .then((res) => {
            console.log("🚀 ~ file: EditFromSuper.jsx:39 ~ .then ~ res:", res);
            closeHandler();
          })
          .catch((error) => {
            console.error("Error updating admin data:", error);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <Offcanvas show={showEditModal} onHide={closeHandler} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {/* {current.id === 1
              ? "Admin 1"
              : current.id === 2
              ? "Admin 2"
              : current.id === 3
              ? "Admin 3"
              : current.id === 4
              ? "Admin 4"
              : current.id === 5
              ? "Admin 5"
              : "Admin"} */}
          </Offcanvas.Title>
          <ToastContainer />
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit(submit)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                {...register("firstname")}
              />
              <span className="text-danger"> {errors.firstname?.message}</span>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last name"
                {...register("lastname")}
              />
              <span className="text-danger"> {errors.lastname?.message}</span>
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
