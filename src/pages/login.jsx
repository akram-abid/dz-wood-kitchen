import React, { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  Github,
  Facebook,
  CheckCircle,
  Sun,
  Moon,
  Globe,
  ChevronDown,
} from "lucide-react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import picture from "../assets/images/homeMain.jpg";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
    const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
      <header
        className={`backdrop-blur-md py-4 px-6 lg:px-8 sticky top-0 z-50 border-b transition-all duration-300 ${
          darkMode
            ? "bg-gray-900/80 border-gray-700/50"
            : "bg-white/80 border-gray-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img
              src={darkMode ? WLogo : Blogo}
              alt="the logo"
              className="w-[80px] xs:w-[90px] sm:w-[100px] md:w-[120px] lg:w-[140px] h-auto"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={toggleLanguageDropdown}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
                }`}
              >
                <Globe size={18} />
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isLanguageDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl border overflow-hidden ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {[
                    { code: "en", name: "English", flag: "🇺🇸" },
                    { code: "ar", name: "العربية", flag: "🇸🇦" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                        darkMode
                          ? "hover:bg-gray-700 text-white"
                          : "hover:bg-gray-50 text-gray-900"
                      } `}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700"
                  : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 shadow-sm"
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

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
              {t("welcomeBack")}
            </h1>
            <p
              className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {t("loginDescription")}
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
                  {t("orLogInWithEmail")}
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        ? "bg-gray-700 border-gray-600 text-white focus:border-yellow-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-yellow-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  
                </div>
                <a
                  href="/forgot-password"
                  className={`text-sm font-medium ${
                    darkMode
                      ? "text-yellow-400 hover:text-yellow-300"
                      : "text-yellow-600 hover:text-yellow-500"
                  }`}
                >
                  {t("forgotPassword")}
                </a>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  darkMode
                    ? "bg-yellow-500 hover:bg-yellow-400 text-white"
                    : "bg-yellow-500 hover:bg-yellow-400 text-white"
                }`}
              >
                {t("logIn")}
              </button>
            </form>

            <div
              className={`mt-6 text-center ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("don'tHaveAnAccount?")}
              <a
                href="/signup"
                className={`font-medium ${
                  darkMode
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-yellow-600 hover:text-yellow-500"
                }`}
              >
                {t("signUp")}
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
                {t("yourDreamKitchenAwaits")}
              </h2>
              <p
                className={`mb-6 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("dashboardAccess")}
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
                    {t("trackOrderStatus")}
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
                    {t("personalizedRecommendations")}
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
                    {t("exclusiveResources")}
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

export default LoginPage;
