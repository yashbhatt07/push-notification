import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "./Schema/Schema";
import { Button, Form } from "react-bootstrap";
import _ from "lodash";
import { login } from "./API/API";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(LoginSchema) });

  const submit = async (data) => {
    console.log("🚀 ~ file: LogIn.jsx:24 ~ submit ~ data:", data);
    LoginSchema.validate(data);

    const onLogin = await login(data);

    if (!_.isEmpty(onLogin)) {
      if (data.email === onLogin.email && data.password === onLogin.password) {
        if (onLogin.role === "superadmin") {
          setError("");

          return navigate("/superadmin");
        } else {
          localStorage.setItem("onLogin", JSON.stringify(onLogin));

          return navigate(`/admin/${onLogin.id}`);
        }
      } else {
        setError("Wrong Credential");
      }
    } else {
      setError("Wrong Credential");
    }
  };

  return (
    <div style={{ height: "100vh" }} className="main-l">
      <Form
        style={{
          margin: "auto",
          width: "350px",
          backgroundColor: "black",
          height: "300px",
        }}
        onSubmit={handleSubmit(submit)}
      >
        <h3
          style={{
            color: "white",
            marginRight: "20px",
            marginBottom: "30px",
          }}
        >
          LogIn
        </h3>

        <Form.Group
          className="mb-3 "
          controlId="exampleForm.ControlInput1"
          style={{ margin: "12px", textAlign: "left" }}
        >
          <Form.Label
            style={{ color: "white", marginLeft: "40px", fontSize: "20px" }}
          >
            Email{" "}
          </Form.Label>
          <Form.Control
            type="email"
            style={{ width: "250px", margin: "0 auto" }}
            placeholder="Please Enter Email"
            {...register("email")}
          />
          <span className="text-danger" style={{ marginLeft: "43px" }}>
            {errors.email?.message}
          </span>
        </Form.Group>
        <Form.Group
          className="mb-3"
          style={{ margin: "12px", textAlign: "left" }}
        >
          <Form.Label
            style={{ color: "white", marginLeft: "40px", fontSize: "20px" }}
          >
            Password
          </Form.Label>
          <Form.Control
            type="password"
            style={{ width: "250px", margin: "0 auto" }}
            placeholder="Please Enter Password"
            {...register("password")}
          />
          <span className="text-danger" style={{ marginLeft: "43px" }}>
            {errors.password?.message}
          </span>
        </Form.Group>
        <span className="text-danger my-2">{error}</span>

        <Button type="submit" style={{ marginRight: "168px" }}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default LogIn;
