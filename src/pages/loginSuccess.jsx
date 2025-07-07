import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleOAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    const code_verifier = sessionStorage.getItem("code_verifier");

    if (!code || !state || !code_verifier) {
      console.error("Missing OAuth info");
      return;
    }

    fetch(`${import.meta.env.VITE_REACT_APP_ORIGIN}/connect/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, code_verifier, state }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          navigate("/"); // or wherever you want
        } else {
          console.error("OAuth failed:", data);
        }
      });
  }, [navigate]);

  return <p>Signing you in...</p>;
}
