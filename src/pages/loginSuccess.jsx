import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleOAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    const code_verifier = localStorage.getItem("code_verifier");

    if (!code || !state || !code_verifier) {
      console.error("Missing OAuth info");
      return;
    }

    const maxRetries = 3;
    let attempts = 0;

    const tryOAuth = async () => {
      while (attempts < maxRetries) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_REACT_APP_ORIGIN}/connect/google/callback`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code, code_verifier, state }),
            }
          );

          const data = await res.json();

          if (res.ok && data.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);
            navigate("/");
            return;
          } else {
            console.error("OAuth failed:", data);
            break;
          }
        } catch (err) {
          attempts++;
          console.warn(`Attempt ${attempts} failed. Retrying...`, err);
          if (attempts >= maxRetries) {
            console.error("All attempts failed. Giving up.");
          } else {
            await new Promise((r) => setTimeout(r, 15000 * attempts));
          }
        }
      }
    };

    tryOAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
