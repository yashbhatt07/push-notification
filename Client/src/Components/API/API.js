import axios from "axios";

export const login = async (data) => {
  const { email, password } = data;
  return await axios
    .get(`admins?email=${email}&password=${password}`, data)
    .then((res) => {
      return res.data[0];
    })
    .catch((err) => {
      console.error(err);
    });
};

export const allAdmins = async () => {
  return await axios
    .get("admins")
    .then((res) => {
      console.log("🚀 ~ file: API.js:19 ~ .then ~ res:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const notificationAPI = async (message) => {
  return await axios
    .post("notification", message)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getNotification = async () => {
  return await axios
    .get("notification")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log("this is error", error);
    });
};
