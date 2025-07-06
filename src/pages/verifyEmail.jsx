import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import apiFetch from "../utils/api/apiFetch";
import Header from "../components/header";
import i18next from "i18next";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [error, setError] = useState(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const verifyEmail = async () => {
    try {
      const response = await apiFetch(
        "/api/v1/auth/verify-email",
        { token: token },
        true,
        "POST"
      );

      if (response.success) {
        setStatus("success");
        // Auto redirect after 3 seconds
        setTimeout(() => {
          navigate("/login", {
            state: { message: t("emailVerifiedSuccessfully") },
          });
        }, 3000);
      } else {
        setStatus("error");
        setError(response.message || t("verificationFailed"));
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setError(t("verificationError"));
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendSuccess(false);
    setError(null);

    try {
      const response = await apiFetch(
        "/api/v1/auth/resend-verification",
        { email },
        false,
        "POST"
      );

      if (response.success) {
        setResendSuccess(true);
      } else {
        setError(response.message || t("resendFailed"));
      }
    } catch (error) {
      console.error("Resend error:", error);
      setError(t("resendError"));
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setError(t("invalidVerificationLink"));
    }
  }, [token]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (languageCode) => {
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      {/* Header */}
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLanguageChange={handleLanguageChange}
        isLanguageDropdownOpen={isLanguageDropdownOpen}
        toggleLanguageDropdown={toggleLanguageDropdown}
      />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div
          className={`rounded-2xl p-8 border transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
              : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
          }`}
        >
          <div className="text-center mb-8">
            <h1
              className={`text-3xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("emailVerification")}
            </h1>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("verifyingYourEmailAddress")}
            </p>
          </div>

          <div className="flex flex-col items-center">
            {status === "verifying" && (
              <div className="flex flex-col items-center py-8">
                <Loader2
                  className={`animate-spin mb-4 ${
                    darkMode ? "text-amber-400" : "text-amber-500"
                  }`}
                  size={48}
                />
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("verifyingYourEmail")}
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center py-8">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                    darkMode ? "bg-green-900/30" : "bg-green-100"
                  }`}
                >
                  <CheckCircle
                    size={48}
                    className={darkMode ? "text-green-400" : "text-green-600"}
                  />
                </div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("verificationSuccessful")}
                </h2>
                <p
                  className={`mb-6 text-center ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("emailVerifiedSuccessMessage")}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {t("redirectingToLogin")}
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center py-8 w-full">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                    darkMode ? "bg-red-900/30" : "bg-red-100"
                  }`}
                >
                  <XCircle
                    size={48}
                    className={darkMode ? "text-red-400" : "text-red-600"}
                  />
                </div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("verificationFailed")}
                </h2>
                <p
                  className={`mb-6 text-center ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {error || t("verificationFailedMessage")}
                </p>

                {email && (
                  <div className="w-full max-w-md">
                    <div
                      className={`mb-6 p-4 rounded-xl ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <p
                        className={`flex items-center ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <Mail
                          size={18}
                          className={`mr-2 ${
                            darkMode ? "text-amber-400" : "text-amber-500"
                          }`}
                        />
                        {email}
                      </p>
                    </div>

                    <button
                      onClick={resendVerificationEmail}
                      disabled={isResending}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                        darkMode
                          ? "bg-amber-500 hover:bg-amber-400 text-white"
                          : "bg-amber-500 hover:bg-amber-400 text-white"
                      } ${isResending ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {isResending ? (
                        <>
                          <Loader2
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            size={16}
                          />
                          {t("sending")}
                        </>
                      ) : (
                        t("resendVerificationEmail")
                      )}
                    </button>

                    {resendSuccess && (
                      <div
                        className={`mt-4 p-3 rounded-xl text-center ${
                          darkMode ? "bg-green-900/30" : "bg-green-100"
                        }`}
                      >
                        <p
                          className={`${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          {t("verificationEmailSent")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigate("/login")}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    {t("backToLogin")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmailPage;