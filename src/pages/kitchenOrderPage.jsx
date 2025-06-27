import React, { use, useEffect, useState } from "react";
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
} from "lucide-react";
import { useTranslation } from "react-i18next";

const KitchenOrderPage = () => {
  const wilayas = [
    { id: 1, name: "Adrar", name_ar: "أدرار" },
    { id: 2, name: "Chlef", name_ar: "الشلف" },
    { id: 3, name: "Laghouat", name_ar: "الأغواط" },
    { id: 4, name: "Oum El Bouaghi", name_ar: "أم البواقي" },
    { id: 5, name: "Batna", name_ar: "باتنة" },
    { id: 6, name: "Bejaia", name_ar: "بجاية" },
    { id: 7, name: "Biskra", name_ar: "بسكرة" },
    { id: 8, name: "Bechar", name_ar: "بشار" },
    { id: 9, name: "Blida", name_ar: "البليدة" },
    { id: 10, name: "Bouira", name_ar: "البويرة" },
  ];

  const dairas = [
    { id: 1, wilaya_id: 1, name: "Adrar", name_ar: "أدرار" },
    { id: 2, wilaya_id: 1, name: "Aougrout", name_ar: "أوقروت" },
    { id: 3, wilaya_id: 2, name: "Chlef", name_ar: "الشلف" },
    { id: 4, wilaya_id: 2, name: "Tenes", name_ar: "تنس" },
    { id: 5, wilaya_id: 3, name: "Laghouat", name_ar: "الأغواط" },
    { id: 6, wilaya_id: 4, name: "Oum El Bouaghi", name_ar: "أم البواقي" },
    { id: 7, wilaya_id: 5, name: "Batna", name_ar: "باتنة" },
    { id: 8, wilaya_id: 6, name: "Bejaia", name_ar: "بجاية" },
    { id: 9, wilaya_id: 7, name: "Biskra", name_ar: "بسكرة" },
    { id: 10, wilaya_id: 8, name: "Bechar", name_ar: "بشار" },
    { id: 11, wilaya_id: 9, name: "Blida", name_ar: "البليدة" },
    { id: 12, wilaya_id: 10, name: "Bouira", name_ar: "البويرة" },
  ];

  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const [orderData, setOrderData] = useState({
    fullName: "",
    email: "",
    wilaya: "",
    daira: "",
    street: "",
    description: "",
    woodType: "",
    kitchen: {
      id: "123",
      title: language === "en" ? "Modern Oak Kitchen" : "مطبخ بلوط حديث",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
  });

  const [wilayaSearch, setWilayaSearch] = useState("");
  const [dairaSearch, setDairaSearch] = useState("");
  const [showWilayaSuggestions, setShowWilayaSuggestions] = useState(false);
  const [showDairaSuggestions, setShowDairaSuggestions] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const { t } = useTranslation();

  const filteredWilayas = wilayas
    .filter((w) => w.name.toLowerCase().includes(wilayaSearch.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredDairas = orderData.wilaya
    ? dairas
        .filter(
          (d) =>
            d.wilaya_id ===
              wilayas.find((w) => w.name === orderData.wilaya)?.id &&
            d.name.toLowerCase().includes(dairaSearch.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const selectWilaya = (wilaya) => {
    setOrderData((prev) => ({ ...prev, wilaya, daira: "" }));
    setWilayaSearch(wilaya);
    setShowWilayaSuggestions(false);
  };

  const selectDaira = (daira) => {
    setOrderData((prev) => ({ ...prev, daira }));
    setDairaSearch(daira);
    setShowDairaSuggestions(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!orderData.fullName.trim()) newErrors.fullName = t("fillAllFields");
    if (!orderData.email.trim()) newErrors.email = t("fillAllFields");
    else if (!/\S+@\S+\.\S+/.test(orderData.email))
      newErrors.email = t("invalidEmail");
    if (!orderData.wilaya) newErrors.wilaya = t("fillAllFields");
    if (!orderData.daira) newErrors.daira = t("fillAllFields");
    if (!orderData.street.trim()) newErrors.street = t("fillAllFields");
    if (!orderData.woodType) newErrors.woodType = t("fillAllFields");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = () => {
    if (!validateForm()) return;
    setOrderSubmitted(true);
  };

  const handleSeeOrder = () => {
    console.log("Navigate to order details", orderData);
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
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowWilayaSuggestions(false);
      setShowDairaSuggestions(false);
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
                <span className="text-sm font-medium">
                  {language === "en" ? "EN" : "AR"}
                </span>
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
                      } ${
                        language === lang.code
                          ? darkMode
                            ? "bg-gray-700"
                            : "bg-gray-50"
                          : ""
                      }`}
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
      <main className="max-w-4xl mx-auto px-6 py-12">
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

        {!orderSubmitted ? (
          <div className="space-y-8">
            {/* Selected Kitchen Card */}
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
                <Home className="mr-2" size={20} />
                {t("selectedKitchen")}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden">
                  <img
                    src={orderData.kitchen.image}
                    alt={orderData.kitchen.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3
                    className={`font-semibold text-lg ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {orderData.kitchen.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Premium custom kitchen design
                  </p>
                </div>
              </div>
            </div>

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
                        setOrderData({ ...orderData, fullName: e.target.value })
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
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                {/* Wilaya Dropdown - Fixed Version */}
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
                      } ${errors.wilaya ? "border-red-500" : ""}`}
                    />
                    {orderData.wilaya && (
                      <button
                        onClick={() => {
                          setOrderData({ ...orderData, wilaya: "", daira: "" });
                          setWilayaSearch("");
                        }}
                        className={`absolute right-3 top-3 ${
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
                            {language === "en" ? wilaya.name : wilaya.name_ar}
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
                    <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>
                  )}
                </div>

                {/* Daira Dropdown - Fixed Version */}
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
                        !orderData.wilaya ? "opacity-50 cursor-not-allowed" : ""
                      } ${errors.daira ? "border-red-500" : ""}`}
                    />
                    {orderData.daira && (
                      <button
                        onClick={() => {
                          setOrderData({ ...orderData, daira: "" });
                          setDairaSearch("");
                        }}
                        className={`absolute right-3 top-3 ${
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
                            {language === "en" ? daira.name : daira.name_ar}
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
                    <p className="text-red-500 text-sm mt-1">{errors.daira}</p>
                  )}
                </div>

                {/* Street Address (unchanged) */}
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
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
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
                    <option value="oak">{t("oak")}</option>
                    <option value="pine">{t("pine")}</option>
                    <option value="walnut">{t("walnut")}</option>
                    <option value="cherry">{t("cherry")}</option>
                    <option value="reclaimedOak">{t("reclaimedOak")}</option>
                    <option value="maple">{t("maple")}</option>
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
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmitOrder}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 ${
                  darkMode
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 hover:from-amber-400 hover:to-orange-400 shadow-lg hover:shadow-amber-500/25"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25"
                }`}
              >
                {t("submitOrder")}
              </button>
            </div>
          </div>
        ) : (
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
            </div>

            <button
              onClick={handleSeeOrder}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 flex items-center justify-center space-x-2 mx-auto ${
                darkMode
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 hover:from-amber-400 hover:to-orange-400 shadow-lg hover:shadow-amber-500/25"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25"
              }`}
            >
              <span>{t("seeOrder")}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default KitchenOrderPage;
