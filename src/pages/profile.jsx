import React, { useEffect, useState } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import {
  User,
  Mail,
  Edit,
  Check,
  X,
  ChevronDown,
  Globe,
  Sun,
  Moon,
  Home,
  Package,
  CheckCircle,
  Clock,
  Truck,
  Hammer,
  CreditCard,
  DollarSign,
  Calendar,
} from "lucide-react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [tempName, setTempName] = useState("John Doe");
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  const [currentOrders, setCurrentOrders] = useState([
    {
      id: "ORD-7890",
      date: "2023-05-15",
      status: "inProgress",
      title: "Modern Oak Kitchen",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      progress: 1, // 0: waiting, 1: production, 2: shipping, 3: completed
      estimatedTotal: 12500,
      amountPaid: 5000,
      paymentMethod: "Credit Card",
      nextPaymentDate: "2023-06-15",
    },
  ]);

  const [completedOrders, setCompletedOrders] = useState([
    {
      id: "ORD-4567",
      date: "2023-03-10",
      status: "delivered",
      title: "Classic Walnut Kitchen",
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
      totalPaid: 9800,
      paymentMethod: "Bank Transfer",
    },
    {
      id: "ORD-1234",
      date: "2023-01-05",
      status: "delivered",
      title: "Rustic Pine Kitchen",
      image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      totalPaid: 7500,
      paymentMethod: "Credit Card",
    },
  ]);

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

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (languageCode) => {
    console.log("Selected language:", languageCode);
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  const { t } = useTranslation();

  const handleEdit = () => {
    setTempName(userData.name);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData({ ...userData, name: tempName });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getProgressSteps = (progress) => {
    const steps = [
      { icon: <Clock size={16} />, label: t("waiting"), active: progress >= 0 },
      {
        icon: <Hammer size={16} />,
        label: t("production"),
        active: progress >= 1,
      },
      {
        icon: <Truck size={16} />,
        label: t("shipping"),
        active: progress >= 2,
      },
      {
        icon: <CheckCircle size={16} />,
        label: t("completed"),
        active: progress >= 3,
      },
    ];
    return steps;
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
        {/* Profile Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("profile")}
          </h1>
        </div>

        <div className="space-y-8">
          {/* Personal Information Card */}
          <div
            className={`rounded-2xl p-6 border transition-all duration-300 ${
              darkMode
                ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-semibold flex items-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <User className="mr-2" size={20} />
                {t("personalInformation")}
              </h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-amber-400"
                      : "bg-gray-100 hover:bg-gray-200 text-blue-600"
                  }`}
                >
                  <Edit size={16} />
                  <span>{t("edit")}</span>
                </button>
              ) : null}
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500">
                  <img
                    src={userData.avatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button
                    className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    } border-2 border-amber-500`}
                  >
                    <Edit size={16} className="text-amber-500" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 w-full space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("fullName")}
                  </label>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className={`p-2 rounded-xl ${
                            darkMode
                              ? "bg-green-600 hover:bg-green-500 text-white"
                              : "bg-green-500 hover:bg-green-400 text-white"
                          }`}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className={`p-2 rounded-xl ${
                            darkMode
                              ? "bg-red-600 hover:bg-red-500 text-white"
                              : "bg-red-500 hover:bg-red-400 text-white"
                          }`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className={`px-4 py-2 rounded-xl ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {userData.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("email")}
                  </label>
                  <p
                    className={`px-4 py-2 rounded-xl ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Orders */}
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
              <Package className="mr-2" size={20} />
              {t("currentOrders")}
            </h2>

            {currentOrders.length > 0 ? (
              <div className="space-y-6">
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-6 rounded-xl border transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                      <div className="flex-1 space-y-4">
                        <h3
                          className={`text-lg font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {order.title}
                        </h3>

                        {/* Order Progress */}
                        <div>
                          <h4
                            className={`flex items-center text-sm font-medium mb-3 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <ChevronDown className="mr-1" size={16} />
                            {t("orderProgress")}
                          </h4>
                          <div className="relative">
                            {/* Progress line background - RTL aware */}
                            <div
                              className={`absolute ${
                                i18next.dir() === "rtl" ? "right-4" : "left-4"
                              } top-0 h-full w-0.5 ${
                                darkMode ? "bg-gray-600" : "bg-gray-300"
                              }`}
                            ></div>

                            {/* Progress steps */}
                            <div className="space-y-8">
                              {[
                                {
                                  icon: <Clock size={16} />,
                                  label: t("waiting"),
                                  active: order.progress >= 0,
                                  status: "waiting",
                                },
                                {
                                  icon: <Hammer size={16} />,
                                  label: t("production"),
                                  active: order.progress >= 1,
                                  status: "inProgress",
                                },
                                {
                                  icon: <Truck size={16} />,
                                  label: t("shipping"),
                                  active: order.progress >= 2,
                                  status: "shipping",
                                },
                                {
                                  icon: <CheckCircle size={16} />,
                                  label: t("completed"),
                                  active: order.progress >= 3,
                                  status: "completed",
                                },
                              ].map((step, index) => (
                                <div
                                  key={index}
                                  className="relative flex items-start"
                                >
                                  {/* Step indicator - RTL aware */}
                                  <div
                                    className={`absolute ${
                                      i18next.dir() === "rtl"
                                        ? "right-4 -mr-0.5"
                                        : "left-4 -ml-0.5"
                                    } w-2 h-2 rounded-full mt-1.5 ${
                                      step.active
                                        ? order.status === step.status
                                          ? darkMode
                                            ? "bg-amber-400"
                                            : "bg-amber-500"
                                          : darkMode
                                          ? "bg-green-400"
                                          : "bg-green-500"
                                        : darkMode
                                        ? "bg-gray-500"
                                        : "bg-gray-400"
                                    }`}
                                  ></div>

                                  <div
                                    className={`${
                                      i18next.dir() === "rtl" ? "mr-8" : "ml-8"
                                    } flex-1`}
                                  >
                                    <div className="flex items-center">
                                      <div
                                        className={`${
                                          i18next.dir() === "rtl"
                                            ? "ml-2"
                                            : "mr-2"
                                        } ${
                                          step.active
                                            ? order.status === step.status
                                              ? darkMode
                                                ? "text-amber-400"
                                                : "text-amber-500"
                                              : darkMode
                                              ? "text-green-400"
                                              : "text-green-500"
                                            : darkMode
                                            ? "text-gray-500"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        {step.icon}
                                      </div>
                                      <h4
                                        className={`font-medium ${
                                          step.active
                                            ? order.status === step.status
                                              ? darkMode
                                                ? "text-amber-400"
                                                : "text-amber-600"
                                              : darkMode
                                              ? "text-green-400"
                                              : "text-green-600"
                                            : darkMode
                                            ? "text-gray-500"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {step.label}
                                      </h4>
                                    </div>
                                    {step.active &&
                                      order.status === step.status && (
                                        <p
                                          className={`mt-1 text-sm ${
                                            darkMode
                                              ? "text-gray-400"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {order.status === "waiting" &&
                                            t("orderReceivedWaiting")}
                                          {order.status === "inProgress" &&
                                            t("orderBeingManufactured")}
                                          {order.status === "shipping" &&
                                            t("orderBeingShipped")}
                                          {order.status === "completed" &&
                                            t("orderDelivered")}
                                        </p>
                                      )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Rest of your order details (payment info, etc.) */}
                        {/* ... */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className={`text-center py-8 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("noCurrentOrders")}
              </p>
            )}
          </div>

          {/* Completed Orders */}
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
              <CheckCircle className="mr-2" size={20} />
              {t("completedOrders")}
            </h2>

            {completedOrders.length > 0 ? (
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {order.title}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          <div>
                            <span
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("status")}
                            </span>
                            <div className="flex items-center">
                              <CheckCircle
                                size={16}
                                className={`mr-1 ${
                                  darkMode ? "text-green-400" : "text-green-600"
                                }`}
                              />
                              <span
                                className={`font-medium ${
                                  darkMode ? "text-green-400" : "text-green-600"
                                }`}
                              >
                                {t("delivered")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("date")}
                            </span>
                            <p
                              className={`font-medium ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {order.date}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("amountPaid")}
                            </span>
                            <p
                              className={`font-medium ${
                                darkMode ? "text-green-400" : "text-green-600"
                              }`}
                            >
                              ${order.totalPaid.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className={`text-center py-8 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("noCompletedOrders")}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
