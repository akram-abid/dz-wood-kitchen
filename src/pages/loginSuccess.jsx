import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    let code_verifier; 

    const provider = localStorage.getItem("provider"); 

    if (provider === "facebook"){
        if (!code || !state) {
          console.error("Missing OAuth info");
          setHasFailed(true);
          return;
        }
    } else if (provider === "google") {
      code_verifier = localStorage.getItem("code_verifier");
      if (!code || !state || !code_verifier) {
          console.error("Missing OAuth info");
          setHasFailed(true);
          return;
      }
    }
          


    const maxRetries = 3;
    let attempts = 0;

    const tryOAuth = async () => {
      while (attempts < maxRetries) {
        try {
            const requestBody =
            provider === "google"
                ? { code, code_verifier, state }
                : { code, state };

          const res = await fetch(`${import.meta.env.VITE_REACT_APP_ORIGIN}/connect/${provider}/callback`,
            {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                body: JSON.stringify(requestBody),
            }
          );

          const data = await res.json();

          if (res.ok && data.data?.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);

            const token = data.data.accessToken;

            // Decode JWT
            const payload = JSON.parse(
              atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
            );

            // Store accessToken and user info
            localStorage.setItem("accessToken", token);
            localStorage.setItem("user", JSON.stringify(payload));

            // Clean up
            localStorage.removeItem("code_verifier");
            localStorage.removeItem("state");

            navigate("/profile");
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
            setHasFailed(true);
            setTimeout(() => navigate("/"), 4000);
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
        {!hasFailed ? (
          <>
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-sm">Signing you in...</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-red-600 text-sm">
              Login failed. Redirecting you back...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
