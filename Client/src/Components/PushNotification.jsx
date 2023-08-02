import React from "react";
import addNotification from "react-push-notification";
import icon from "../assets/profilelogo.png";
const PushNotification = ({ messageTitle, messageDescription }) => {
  addNotification({
    title: messageTitle,
    message: messageDescription,
    duration: "15000",
    native: true,
    icon: icon,
  });
  return <div>PushNotification</div>;
};

export default PushNotification;
