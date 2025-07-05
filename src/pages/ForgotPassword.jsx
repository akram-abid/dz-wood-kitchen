import React, { useState } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import i18next from "i18next";
import apiFetch from "../utils/api/apiFetch";
import {
  Globe,
  Sun,
  Moon,
  ChevronDown,
  X,
  CheckCircle,
  ChevronRight,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = t("fillAllFields");
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t("invalidEmail");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // In a real app, you would call your password reset API here
      // const response = await fetch("/api/auth/forgot-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();

      const response = await apiFetch(
        "/api/v1/auth/request-reset-password",
        { email},
        true,
      );

      if(!response.success){
        console.log("sending reset password request failed ", response)
      }

      setMessage({
        type: "success",
        text: t("resetPasswordEmailSent"),
      });
    } catch (err) {
      console.error("Error:", err);
      setMessage({
        type: "error",
        text: t("somethingWentWrong"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguageDropdown = () =>
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

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
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <Lock
            size={48}
            className={`mx-auto mb-4 ${
              darkMode ? "text-amber-400" : "text-blue-500"
            }`}
          />
          <h1
            className={`text-3xl md:text-4xl font-bold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("forgotPassword")}
          </h1>
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("enterEmailToReset")}
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === "success"
                ? darkMode
                  ? "bg-green-900/30 border border-green-800"
                  : "bg-green-50 border border-green-200"
                : darkMode
                ? "bg-red-900/30 border border-red-800"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start">
              {message.type === "success" ? (
                <CheckCircle
                  className={`flex-shrink-0 mt-1 mr-3 ${
                    darkMode ? "text-green-400" : "text-green-500"
                  }`}
                  size={20}
                />
              ) : (
                <AlertCircle
                  className={`flex-shrink-0 mt-1 mr-3 ${
                    darkMode ? "text-red-400" : "text-red-500"
                  }`}
                  size={20}
                />
              )}
              <p
                className={`${
                  darkMode ? "text-gray-100" : "text-gray-800"
                } text-sm`}
              >
                {message.text}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className={`rounded-2xl p-6 border transition-all duration-300 ${
              darkMode
                ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
            }`}
          >
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("email")}
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-3 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("enterEmail")}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                    } ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                    darkMode
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 hover:from-amber-400 hover:to-yellow-400 shadow-lg hover:shadow-amber-500/25"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400 shadow-lg hover:shadow-blue-500/25"
                  } ${isLoading ? "opacity-70" : ""}`}
                >
                  {isLoading ? t("sending") : t("resetPassword")}
                </button>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className={`text-sm font-medium ${
                    darkMode
                      ? "text-amber-400 hover:text-amber-300"
                      : "text-blue-500 hover:text-blue-600"
                  }`}
                >
                  {t("backToLogin")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
