import React from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";

export const EditModal = ({
  showEditModal,
  closeHandler,
  handleSubmit,
  submitHandler,
  register,
  errors,
}) => {
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
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit(submitHandler)}>
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
