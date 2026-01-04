import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const role = params.get("role");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
};

export default OAuth2RedirectHandler;
