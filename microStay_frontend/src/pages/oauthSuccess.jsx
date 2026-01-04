import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // ✅ Clean URL (remove token from address bar)
      window.history.replaceState({}, document.title, "/");

      navigate("/dashboard");
    }
  }, []);

  return <p>Signing you in...</p>;
};

export default OAuthSuccess;
