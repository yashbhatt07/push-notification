import * as yup from "yup";
const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const CharacterRegex = /^[A-Za-z\s]*$/;

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Invalid email format"),
  password: yup
    .string()
    .required("Passwork is required")
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be less then 12 characters"),
  // title: yup
  //   .string()
  //   .required("title is required")
  //   .min(4, "title must be at least 8 characters")
  //   .max(30, "title must be less then 12 characters"),
  // description: yup
  //   .string()
  //   .required("description is required")
  //   .min(6, "description must be at least 8 characters"),
});

export const EditSchema = yup.object().shape({
  firstname: yup
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(20, "Password must be less then 20 characters")
    .matches(CharacterRegex, "Only Characters Allowed"),
  lastname: yup
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(20, "Password must be less then 20 characters")
    .matches(CharacterRegex, "Only Characters Allowed"),
  email: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(emailRegex, "Invalid email format"),
});

export const messageSchema = yup.object().shape({
  title: yup
    .string()
    .required("title is required")
    .min(4, "title must be at least 4 characters")
    .max(30, "title must be less then 30 characters")
    .matches(CharacterRegex, "Only Characters Allowed"),
  description: yup
    .string()
    .required("description is required")
    .min(6, "description must be at least 6 characters"),
});
