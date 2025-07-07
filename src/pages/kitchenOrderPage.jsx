import React, { useEffect, useState } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import i18next from "i18next";
import {
  Globe,
  Sun,
  Moon,
  ChevronDown,
  X,
  CheckCircle,
  ChevronRight,
  MapPin,
  User,
  Mail,
  Home,
  MessageSquare,
  Palette,
  Phone,
  Image,
  Upload,
  AlertCircle,
} from "lucide-react";
import processLocationData from "../utils/algeriaLocationData";
import rawLocationData from "../assets/addresses.json";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import { useAuth } from "../utils/protectedRootesVerf";

const KitchenOrderPage = () => {
  const { wilayas, dairas, communes } = processLocationData(rawLocationData);
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const location = useLocation();
  const kitchenData = location.state?.kitchenTemplate
    ? location.state.kitchenTemplate
    : null;
  const originalKitchenId = location.state?.originalKitchenId;

  const [orderData, setOrderData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    wilaya: "",
    daira: "",
    baladia: "",
    street: "",
    description: "",
    woodType: "",
    media: [],
    key: kitchenData?.id,
  });

  const [wilayaSearch, setWilayaSearch] = useState("");
  const [dairaSearch, setDairaSearch] = useState("");
  const [baladiaSearch, setBaladiaSearch] = useState("");
  const [showWilayaSuggestions, setShowWilayaSuggestions] = useState(false);
  const [showDairaSuggestions, setShowDairaSuggestions] = useState(false);
  const [showBaladiaSuggestions, setShowBaladiaSuggestions] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const { t } = useTranslation();

  const {
      isAuthenticated,
      isEmailVerified,
      authError,
      loading: authLoading,
    } = useAuth();
  
    // Handle authentication check in useEffect
    useEffect(() => {
      console.log("Auth state:", {
        isAuthenticated,
        isEmailVerified,
        authError,
        authLoading,
      });
    }, [isAuthenticated, authLoading, navigate]);
    
      if(!isAuthenticated){
        navigate('/login', { state: { problem: t("sessionExpiredOrNoAccount") } });
      }
      if(!isEmailVerified){
        navigate('/login', { state: { problem: t("emailNotVerified") } });
      }
  const filteredWilayas = wilayas
    .filter((w) => w.name.toLowerCase().includes(wilayaSearch.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredDairas = orderData.wilaya
    ? dairas
        .filter(
          (d) =>
            d.wilaya_id ===
              wilayas.find((w) => w.name === orderData.wilaya)?.id &&
            (d.name.toLowerCase().includes(dairaSearch.toLowerCase()) ||
              d.name_ar.includes(dairaSearch))
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const filteredCommunes = orderData.daira
    ? communes
        .filter(
          (b) =>
            b.daira_id === dairas.find((d) => d.name === orderData.daira)?.id &&
            (b.name.toLowerCase().includes(baladiaSearch.toLowerCase()) ||
              b.name_ar.includes(baladiaSearch))
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const selectWilaya = (wilaya) => {
    setOrderData((prev) => ({ ...prev, wilaya, daira: "", baladia: "" }));
    setWilayaSearch(wilaya);
    setShowWilayaSuggestions(false);
  };

  const selectDaira = (daira) => {
    setOrderData((prev) => ({ ...prev, daira, baladia: "" }));
    setDairaSearch(daira);
    setShowDairaSuggestions(false);
  };

  const selectBaladia = (commune) => {
    setOrderData((prev) => ({ ...prev, baladia: commune }));
    setBaladiaSearch(commune);
    setShowBaladiaSuggestions(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setOrderData((prev) => ({
      ...prev,
      media: [...prev.media, ...files],
    }));
  };

  const removeFile = (index) => {
    setOrderData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!orderData.fullName.trim()) newErrors.fullName = t("fillAllFields");
    if (!orderData.email.trim()) newErrors.email = t("fillAllFields");
    else if (!/\S+@\S+\.\S+/.test(orderData.email))
      newErrors.email = t("invalidEmail");
    if (!orderData.phoneNumber.trim()) newErrors.phone = t("fillAllFields");
    if (!orderData.wilaya) newErrors.wilaya = t("fillAllFields");
    if (!orderData.daira) newErrors.daira = t("fillAllFields");
    if (!orderData.baladia) newErrors.baladia = t("fillAllFields");
    if (!orderData.street.trim()) newErrors.street = t("fillAllFields");
    if (!orderData.woodType) newErrors.woodType = t("fillAllFields");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const token = localStorage.getItem("accessToken");
  const handleSeeOrder = () => {
    navigate("/profile");
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form is not valid");
      return;
    }

    setOrderStatus("loading");
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append("title", "");
      formData.append("postId", originalKitchenId || "");
      formData.append("description", orderData.description);
      formData.append("woodType", orderData.woodType);
      formData.append("baladia", orderData.baladia);
      formData.append("email", orderData.email);
      formData.append("fullName", orderData.fullName);
      formData.append("street", orderData.street);
      formData.append("daira", orderData.daira);
      formData.append("wilaya", orderData.wilaya);
      formData.append("phoneNumber", orderData.phoneNumber);

      // Append files
      orderData.media.forEach((file) => {
        formData.append("media", file);
      });

      const response = await fetch("https://dzwoodkitchen.com/api/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const result = await response.json();
      console.log("✅ Response:", result);
      setOrderStatus("success");
    } catch (err) {
      console.error("❌ Error:", err);
      setOrderStatus("error");
      setApiError(err.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const updateDirection = () => {
      document.documentElement.dir = i18next.dir();
    };

    updateDirection();

    i18next.on("languageChanged", updateDirection);

    return () => {
      i18next.off("languageChanged", updateDirection);
    };
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguageDropdown = () =>
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const handleLanguageChange = (languageCode) => {
    console.log("Selected language:", languageCode);
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowWilayaSuggestions(false);
      setShowDairaSuggestions(false);
      setShowBaladiaSuggestions(false);
      setIsLanguageDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
        showProfileButton={true}
      />
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Error Popup */}
        {apiError && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
            <div
              className={`max-w-md w-full mx-4 p-6 rounded-2xl shadow-xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                  <AlertCircle
                    size={32}
                    className="text-red-500 dark:text-red-400"
                  />
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("error")}
                </h3>
                <p
                  className={`mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {apiError}
                </p>
                <button
                  onClick={() => setApiError(null)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    darkMode
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {t("tryAgain")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("orderYourKitchen")}
          </h1>
          <p
            className={`text-lg md:text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("customKitchenSubtitle")}
          </p>
        </div>

        {orderStatus === "success" ? (
          /* Order Submitted View */
          <div
            className={`rounded-2xl p-8 border text-center transition-all duration-300 ${
              darkMode
                ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
            }`}
          >
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle
                  size={40}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <h2
                className={`text-3xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("thankYou")}
              </h2>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("contactSoon")}
              </p>
            </div>

            {/* Order Summary */}
            <div
              className={`mb-8 p-6 rounded-xl text-left ${
                darkMode ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("orderDetails")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("fullName")}
                    </span>
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {orderData.fullName}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("email")}
                    </span>
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {orderData.email}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("phone")}
                    </span>
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {orderData.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("woodType")}
                    </span>
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t(orderData.woodType)}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("wilaya")}
                    </span>
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {orderData.wilaya}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("daira")}
                    </span>
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {orderData.daira}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("baladia")}
                    </span>
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {orderData.baladia}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("street")}
                    </span>
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {orderData.street}
                    </p>
                  </div>
                </div>
              </div>
              {orderData.description && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("description")}
                  </span>
                  <p
                    className={`font-semibold mt-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {orderData.description}
                  </p>
                </div>
              )}
              {orderData.media.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("uploadedImages")}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {orderData.media.map((file, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSeeOrder}
              className={`cursor-pointer px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 flex items-center justify-center space-x-2 mx-auto ${
                darkMode
                  ? "bg-gradient-to-r bg-yellow-500  text-gray-900 hover:from-amber-400 hover:to-orange-400 shadow-lg hover:shadow-amber-500/25"
                  : "bg-gradient-to-r bg-yellow-600  text-white hover:from-yellow-500 hover:to-yellow-500 shadow-lg hover:shadow-blue-500/25"
              }`}
            >
              <span>{t("seeOrder")}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmitOrder}>
            <div className="space-y-8">
              {/* Selected Kitchen Card */}
              {kitchenData && (
                <div
                  className={`rounded-2xl p-6 border transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                      : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
                  }`}
                >
                  <h2
                    className={`text-xl font-semibold mb-4 flex items-center ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Home className="mx-2" size={20} />
                    {t("selectedKitchen")}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden">
                      {kitchenData.images && (
                        <img
                          src={`${import.meta.env.VITE_REACT_APP_ORIGIN}/${
                            kitchenData.images[0].url
                          }`}
                          alt={kitchenData.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-lg ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {kitchenData.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {kitchenData.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Personal Information */}
              <div
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
                }`}
              >
                <h2
                  className={`text-xl font-semibold mb-6 flex items-center ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <User className="mr-2" size={20} />
                  {t("personalInfo")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className={`absolute left-3 top-3 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                        size={20}
                      />

                      <input
                        type="text"
                        value={orderData.fullName}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            fullName: e.target.value,
                          })
                        }
                        placeholder={t("enterFullName")}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                        } ${errors.fullName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
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
                        className={`absolute left-3 top-3 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                        size={20}
                      />
                      <input
                        type="email"
                        value={orderData.email}
                        onChange={(e) =>
                          setOrderData({ ...orderData, email: e.target.value })
                        }
                        placeholder={t("enterEmail")}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                        } ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("phone")}
                    </label>
                    <div className="relative">
                      <Phone
                        className={`absolute left-3 top-3 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                        size={20}
                      />
                      <input
                        type="tel"
                        value={orderData.phoneNumber}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder={t("enterPhone")}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                        } ${errors.phone ? "border-red-500" : ""}`}
                      />
                    </div>

                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Location Information */}
              <div
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
                }`}
              >
                <h2
                  className={`text-xl font-semibold mb-6 flex items-center ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <MapPin className="mr-2" size={20} />
                  {t("locationInfo")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Wilaya Dropdown */}
                  <div
                    className="dropdown-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("wilaya")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={wilayaSearch}
                        onChange={(e) => {
                          setWilayaSearch(e.target.value);
                          setShowWilayaSuggestions(true);
                        }}
                        onFocus={() => setShowWilayaSuggestions(true)}
                        placeholder={t("selectWilaya")}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                        } ${errors.wilaya ? "border-red-500" : ""} ${
                          i18next.dir() === "rtl" ? "pr-2" : "pl-2"
                        }`}
                      />
                      {orderData.wilaya && (
                        <button
                          onClick={() => {
                            setOrderData({
                              ...orderData,
                              wilaya: "",
                              daira: "",
                              baladia: "",
                            });
                            setWilayaSearch("");
                          }}
                          className={`absolute top-3 ${
                            i18next.dir() === "rtl" ? "left-3" : "right-3"
                          } ${
                            darkMode
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {showWilayaSuggestions && (
                      <div
                        className={`dropdown-menu mt-1 max-h-60 overflow-auto rounded-xl shadow-xl border ${
                          darkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {filteredWilayas.length > 0 ? (
                          filteredWilayas.map((wilaya) => (
                            <div
                              key={wilaya.id}
                              className={`px-4 py-3 cursor-pointer transition-colors ${
                                darkMode
                                  ? "hover:bg-gray-700 text-white"
                                  : "hover:bg-gray-50 text-gray-900"
                              }`}
                              onClick={() => selectWilaya(wilaya.name)}
                            >
                              {i18next.language === "en"
                                ? wilaya.name
                                : wilaya.name_ar}
                            </div>
                          ))
                        ) : (
                          <div
                            className={`px-4 py-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("noOptionsFound")}
                          </div>
                        )}
                      </div>
                    )}
                    {errors.wilaya && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.wilaya}
                      </p>
                    )}
                  </div>
                  {/* Daira Dropdown */}
                  <div
                    className="dropdown-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("daira")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dairaSearch}
                        onChange={(e) => {
                          setDairaSearch(e.target.value);
                          setShowDairaSuggestions(true);
                        }}
                        onFocus={() => setShowDairaSuggestions(true)}
                        placeholder={t("selectDaira")}
                        disabled={!orderData.wilaya}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                        } ${
                          !orderData.wilaya
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        } ${errors.daira ? "border-red-500" : ""} ${
                          i18next.dir() === "rtl" ? "pr-2" : "pl-2"
                        }`}
                      />
                      {orderData.daira && (
                        <button
                          onClick={() => {
                            setOrderData({
                              ...orderData,
                              daira: "",
                              baladia: "",
                            });
                            setDairaSearch("");
                          }}
                          className={`absolute top-3 ${
                            i18next.dir() === "rtl" ? "left-3" : "right-3"
                          } ${
                            darkMode
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {showDairaSuggestions && orderData.wilaya && (
                      <div
                        className={`dropdown-menu mt-1 max-h-60 overflow-auto rounded-xl shadow-xl border ${
                          darkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {filteredDairas.length > 0 ? (
                          filteredDairas.map((daira) => (
                            <div
                              key={daira.id}
                              className={`px-4 py-3 cursor-pointer transition-colors ${
                                darkMode
                                  ? "hover:bg-gray-700 text-white"
                                  : "hover:bg-gray-50 text-gray-900"
                              }`}
                              onClick={() => selectDaira(daira.name)}
                            >
                              {i18next.language === "en"
                                ? daira.name
                                : daira.name_ar}
                            </div>
                          ))
                        ) : (
                          <div
                            className={`px-4 py-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("noOptionsFound")}
                          </div>
                        )}
                      </div>
                    )}
                    {errors.daira && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.daira}
                      </p>
                    )}
                  </div>
                  {/* Baladia Dropdown */}
                  <div
                    className="dropdown-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("baladia")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={baladiaSearch}
                        onChange={(e) => {
                          setBaladiaSearch(e.target.value);
                          setShowBaladiaSuggestions(true);
                        }}
                        onFocus={() => setShowBaladiaSuggestions(true)}
                        placeholder={t("selectBaladia")}
                        disabled={!orderData.daira}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                        } ${
                          !orderData.daira
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        } ${errors.baladia ? "border-red-500" : ""} ${
                          i18next.dir() === "rtl" ? "pr-2" : "pl-2"
                        }`}
                      />
                      {orderData.baladia && (
                        <button
                          onClick={() => {
                            setOrderData({ ...orderData, baladia: "" });
                            setBaladiaSearch("");
                          }}
                          className={`absolute top-3 ${
                            i18next.dir() === "rtl" ? "left-3" : "right-3"
                          } ${
                            darkMode
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {showBaladiaSuggestions && orderData.daira && (
                      <div
                        className={`dropdown-menu mt-1 max-h-60 overflow-auto rounded-xl shadow-xl border ${
                          darkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {filteredCommunes.length > 0 ? (
                          filteredCommunes.map((commune) => (
                            <div
                              key={commune.id}
                              className={`px-4 py-3 cursor-pointer transition-colors ${
                                darkMode
                                  ? "hover:bg-gray-700 text-white"
                                  : "hover:bg-gray-50 text-gray-900"
                              }`}
                              onClick={() => selectBaladia(commune.name)}
                            >
                              {i18next.language === "en"
                                ? commune.name
                                : commune.name_ar}
                            </div>
                          ))
                        ) : (
                          <div
                            className={`px-4 py-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("noOptionsFound")}
                          </div>
                        )}
                      </div>
                    )}
                    {errors.baladia && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.baladia}
                      </p>
                    )}
                  </div>
                  {/* Street Address */}
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("street")}
                    </label>
                    <input
                      type="text"
                      value={orderData.street}
                      onChange={(e) =>
                        setOrderData({ ...orderData, street: e.target.value })
                      }
                      placeholder={t("enterStreet")}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                      } ${errors.street ? "border-red-500" : ""}`}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Kitchen Preferences */}
              <div
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
                }`}
              >
                <h2
                  className={`text-xl font-semibold mb-6 flex items-center ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Palette className="mr-2" size={20} />
                  {t("preferences")}
                </h2>
                <div className="space-y-6">
                  {/* Wood Type */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("woodType")}
                    </label>
                    <select
                      value={orderData.woodType}
                      onChange={(e) =>
                        setOrderData({ ...orderData, woodType: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600 text-white focus:border-amber-500 focus:bg-gray-700"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:bg-white"
                      } ${errors.woodType ? "border-red-500" : ""}`}
                    >
                      <option value="">{t("selectWoodType")}</option>
                      <option value="Egger">Egger</option>
                      <option value="High-Gloss">High Gloss</option>
                      <option value="MDF">MDF</option>
                    </select>
                    {errors.woodType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.woodType}
                      </p>
                    )}
                  </div>
                  {/* Description */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("description")}
                    </label>
                    <div className="relative">
                      <MessageSquare
                        className={`absolute left-3 top-3 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                        size={20}
                      />
                      <textarea
                        rows={4}
                        value={orderData.description}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            description: e.target.value,
                          })
                        }
                        placeholder={t("describeKitchen")}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border resize-none transition-all duration-200 ${
                          darkMode
                            ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:bg-gray-700"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                        }`}
                      />
                    </div>
                  </div>
                  {/* File Upload */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("uploadImages")}
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                        darkMode
                          ? "border-gray-600 hover:border-amber-500 bg-gray-700/30"
                          : "border-gray-300 hover:border-blue-500 bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Upload
                          size={40}
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <label
                          className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                            darkMode
                              ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                              : "bg-yellow-500 text-white hover:bg-yellow-400"
                          }`}
                        >
                          {t("selectFiles")}
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    {/* Uploaded Files Preview */}
                    {orderData.media.length > 0 && (
                      <div className="mt-4">
                        <h4
                          className={`text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("uploadedFiles")} ({orderData.media.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {orderData.media.map((file, index) => (
                            <div
                              key={index}
                              className="relative group rounded-lg overflow-hidden"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => removeFile(index)}
                                  className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={orderStatus === "loading"}
                  className={`cursor-pointer px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 ${
                    darkMode
                      ? "bg-gradient-to-r bg-yellow-500 text-gray-900 hover:from-yellow-400 shadow-lg hover:shadow-amber-500/25"
                      : "bg-gradient-to-r bg-yellow-500 text-white hover:from-yellow-400 shadow-lg hover:shadow-blue-500/25"
                  } ${orderStatus === "loading" ? "opacity-70" : ""}`}
                >
                  {orderStatus === "loading"
                    ? t("submitting")
                    : t("submitOrder")}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default KitchenOrderPage;
