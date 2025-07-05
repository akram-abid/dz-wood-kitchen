import React, { useState, useEffect } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import i18next from "i18next";
import {
  Globe,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiFetch from "../utils/api/apiFetch";
import Header from "../components/header";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);

  const { t } = useTranslation();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      try {

        console.log("the token i have got is this",  token)

        const response = await apiFetch(`/api/v1/auth/verify-reset-token?token=${token}`, false, true, "GET")

        // if (!data.valid) throw new Error("Invalid token");

        setTokenValid(true);
      } catch (err) {
        console.log("this thisdfjhsmlfsmqdkjjfsdkjhfsdqkljh ", err)
        setMessage({
          type: "error",
          text: t("invalidOrExpiredToken"),
        });
        setTokenValid(false);
      } finally {
        setTokenLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setMessage({
        type: "error",
        text: t("noTokenProvided"),
      });
      setTokenLoading(false);
    }
  }, [token, t]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!password.trim()) newErrors.password = t("fillAllFields");
    else if (password.length < 8) newErrors.password = t("passwordMinLength");
    
    if (!confirmPassword.trim()) newErrors.confirmPassword = t("fillAllFields");
    else if (password !== confirmPassword) newErrors.confirmPassword = t("passwordsDontMatch");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await apiFetch("/api/v1/auth/reset-password",
        { token, newPassword: password },
        true,
        "POST",);

        console.log("this is the respons after sending ", response)
      
      setMessage({
        type: "success",
        text: t("passwordResetSuccess"),
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
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

  if (tokenLoading) {
    return (
      <div
        className={`min-h-screen transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        }`}
      >
        {/* Header */}
        <header
          className={`backdrop-blur-md py-4 px-6 lg:px-8 sticky top-0 z-50 border-b transition-all duration-300 ${
            darkMode
              ? "bg-gray-900/80 border-gray-700/50"
              : "bg-white/80 border-gray-200/50"
          }`}
        >
          {/* Header content same as below */}
        </header>
        
        <main className="max-w-md mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div
                className={`h-12 w-12 mx-auto mb-4 rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`h-6 w-3/4 mx-auto mb-2 rounded ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`h-4 w-1/2 mx-auto rounded ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              ></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            {t("resetPassword")}
          </h1>
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {tokenValid ? t("enterNewPassword") : t("invalidTokenMessage")}
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

        {tokenValid ? (
          <form onSubmit={handleSubmit}>
            <div
              className={`rounded-2xl p-6 border transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                  : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
              }`}
            >
              <div className="space-y-6">
                {/* New Password Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("newPassword")}
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                      size={20}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("enterNewPassword")}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                      } ${errors.password ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                      size={20}
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("confirmNewPassword")}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                      } ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
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
                    {isLoading ? t("updating") : t("resetPassword")}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div
            className={`rounded-2xl p-6 border text-center transition-all duration-300 ${
              darkMode
                ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
            }`}
          >
            <AlertCircle
              size={48}
              className={`mx-auto mb-4 ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
            />
            <h3
              className={`text-xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("invalidTokenTitle")}
            </h3>
            <p
              className={`mb-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("invalidTokenMessage")}
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className={`px-6 py-2 rounded-lg font-medium ${
                darkMode
                  ? "bg-amber-500 hover:bg-amber-400 text-gray-900"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {t("requestNewLink")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResetPassword;