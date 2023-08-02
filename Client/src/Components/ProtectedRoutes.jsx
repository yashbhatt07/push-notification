import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRouter({ Component, ...props }) {
  const navigate = useNavigate();
  useEffect(() => {
    let login = localStorage.getItem("auth");
    if (!login) {
      return navigate("/login", { replace: true });
    }
  }, []);

  return <Component {...props} />;
}

export default ProtectedRouter;
