import React, { useEffect, useState } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import picture from "../assets/images/homeMain.jpg";
import {
  Mail,
  Lock,
  User,
  Github,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  CheckCircle,
  Facebook,
} from "lucide-react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import apiFetch from "../utils/api/apiFetch";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when form is submitted
    const signupData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };
    console.log("User Signup Data:", {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
    });

    try {
      const result = await apiFetch("/api/v1/auth/signup", signupData);

      if (result.success) {
        console.log("Signup successful:", result.data);
        navigate("/login", {
          state: {
            message: t("signupSuccessMessage"),
          },
        });
      } else {
        console.error("Signup failed:", result.error);
        // Handle error (show error message to user)
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (languageCode) => {
    console.log("Selected language:", languageCode);
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  // Layout and direction effects
  useEffect(() => {
    const updateDirection = () => {
      document.documentElement.dir = i18next.dir();
    };
    updateDirection();
    i18next.on("languageChanged", updateDirection);
    return () => i18next.off("languageChanged", updateDirection);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div
            className={`lg:w-1/2 rounded-2xl p-8 border transition-all duration-300 ${
              darkMode
                ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
            }`}
          >
            <h1
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("signUpAccount")}
            </h1>
            <p
              className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {t("enterYourDetails")}
            </p>

            {/* Social Login Buttons */}
            <div className="flex flex-col space-y-4 mb-6">
              <button
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                    : "bg-white border-gray-300 hover:bg-gray-50 text-gray-800"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.177-2.664-6.735-2.664-5.521 0-10 4.479-10 10s4.479 10 10 10c8.396 0 10-7.496 10-9.634 0-0.768-0.085-1.354-0.189-1.939h-9.811z"></path>
                </svg>
                <span>{t("continueWithGoogle")}</span>
              </button>
              <button
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                    : "bg-white border-gray-300 hover:bg-gray-50 text-gray-800"
                }`}
              >
                <Facebook size={20} />
                <span>{t("continueWithFacebook")}</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${
                    darkMode ? "border-gray-700" : "border-gray-300"
                  }`}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 ${
                    darkMode
                      ? "bg-gray-800 text-gray-400"
                      : "bg-white text-gray-500"
                  }`}
                >
                  {t("orSignUpWithEmail")}
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("fullName")}
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={16}
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="eg. John Francisco"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
              </div>

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
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={16}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="eg. printing@gmail.com"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={16}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("enterYourPassword")}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
                <p
                  className={`mt-2 text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  {t("passwordRequirements")}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading} // Disable button when loading
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                  darkMode
                    ? "bg-yellow-500 hover:bg-yellow-400 text-white"
                    : "bg-yellow-500 hover:bg-yellow-400 text-white"
                } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("signingUp")}
                  </>
                ) : (
                  t("signUp")
                )}
              </button>
            </form>

            <div
              className={`mt-6 text-center ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("alreadyHaveAccount")}
              <a
                href="/login"
                className={`font-medium ${
                  darkMode
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-yellow-500 hover:text-yellow-400"
                }`}
              >
                {t("logIn")}
              </a>
            </div>
          </div>

          {/* Image/Message Section */}
          <div
            className={`lg:w-1/2 rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-center ${
              darkMode
                ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
            }`}
          >
            <div className="text-center">
              <img
                src={picture}
                alt="Kitchen Design"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h2
                className={`text-2xl font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("createYourDreamKitchen")}
              </h2>
              <p
                className={`mb-6 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("joinThousands")}
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle
                    className={`mx-2 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                    size={20}
                  />
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    {t("customDesigns")}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle
                    className={`mx-2 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                    size={20}
                  />
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    {t("premiumMaterials")}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle
                    className={`mx-2 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                    size={20}
                  />
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    {t("expertSupport")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
