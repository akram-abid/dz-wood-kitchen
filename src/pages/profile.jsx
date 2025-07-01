import React, { useEffect, useState } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import {
  Receipt,
  FileText,
  Plus,
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
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [tempName, setTempName] = useState("John Doe");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
  });

  const [currentOrders, setCurrentOrders] = useState([
    {
      id: "ORD-7890",
      date: "2023-05-15",
      status: "inProgress",
      title: "Modern Oak Kitchen",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      progress: 1,
      estimatedTotal: 12500,
      amountPaid: 5000,
      paymentMethod: "Credit Card",
      payments: [
        {
          amount: 3000,
          date: "2023-05-20",
          method: "Credit Card",
          notes: "Initial deposit",
        },
        {
          amount: 2000,
          date: "2023-06-15",
          method: "Credit Card",
          notes: "Final payment",
        },
      ],
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
      amountPaid: 9800, // Add this
      paymentMethod: "Bank Transfer",
      payments: [
        // Add payments array
        {
          amount: 5000,
          date: "2023-03-15",
          method: "Bank Transfer",
          notes: "Initial deposit",
        },
        {
          amount: 4800,
          date: "2023-03-25",
          method: "Bank Transfer",
          notes: "Final payment",
        },
        {
          amount: 5000,
          date: "2023-03-15",
          method: "Bank Transfer",
          notes: "Initial deposit",
        },
        {
          amount: 4800,
          date: "2023-03-25",
          method: "Bank Transfer",
          notes: "Final payment",
        },{
          amount: 5000,
          date: "2023-03-15",
          method: "Bank Transfer",
          notes: "Initial deposit",
        },
      ],
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

  const getInitialsAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
      <div
        className={`w-24 h-24 rounded-full ${randomColor} flex items-center justify-center text-white text-3xl font-bold`}
      >
        {initials}
      </div>
    );
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
                className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
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
              className={`cursor-pointer p-2 rounded-xl transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700"
                  : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 shadow-sm"
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => navigate("/")} // You'll need to handle the navigation logic
              className={`cursor-pointer flex gap-1 items-center px-5 py-2 rounded-xl transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
              }`}
            >
              <Home size={20} />
              {t("home")}
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
                  className={`cursor-pointer flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm ${
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
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                    <User
                      size={40}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>
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

                        {/* Payment Information */}
                        <div className="mt-6">
                          <h4
                            className={`flex items-center text-sm font-medium mb-3 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <DollarSign className="mr-1" size={16} />
                            {t("paymentInformation")}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p
                                className={`text-sm ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {t("estimatedTotal")}
                              </p>
                              <p
                                className={`font-medium ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {order.estimatedTotal?.toLocaleString() +
                                  ` ${t("algerianDinar")}` || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p
                                className={`text-sm ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {t("amountPaid")}
                              </p>
                              <p
                                className={`font-medium ${
                                  darkMode ? "text-green-400" : "text-green-600"
                                }`}
                              >
                                {order.amountPaid?.toLocaleString() +
                                  ` ${t("algerianDinar")}` || "0"}
                              </p>
                            </div>
                            <div>
                              <p
                                className={`text-sm ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {t("remainingBalance")}
                              </p>
                              <p
                                className={`font-medium ${
                                  darkMode ? "text-amber-400" : "text-amber-600"
                                }`}
                              >
                                {(
                                  (order.estimatedTotal || 0) -
                                  (order.amountPaid || 0)
                                ).toLocaleString() + ` ${t("algerianDinar")}`}
                              </p>
                            </div>
                          </div>

                          {order.payments?.length > 0 && (
                            <div>
                              <h4
                                className={`text-sm font-medium mb-2 ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {t("paymentHistory")}
                              </h4>
                              <div
                                className={`rounded-lg overflow-hidden border ${
                                  darkMode
                                    ? "border-gray-600"
                                    : "border-gray-200"
                                }`}
                              >
                                {order.payments.map((payment, index) => (
                                  <div
                                    key={index}
                                    className={`p-3 border-b last:border-b-0 ${
                                      darkMode
                                        ? "border-gray-600 bg-gray-800/50"
                                        : "border-gray-200 bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <p
                                          className={`font-medium ${
                                            darkMode
                                              ? "text-white"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {payment.amount.toLocaleString() +
                                            ` ${t("algerianDinar")}`}
                                        </p>
                                        <p
                                          className={`text-xs ${
                                            darkMode
                                              ? "text-gray-400"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          {payment.date} • {payment.method}
                                        </p>
                                      </div>
                                      <p
                                        className={`text-xs ${
                                          darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {payment.notes}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
                {t("noCurrentOrders")}
              </p>
            )}
          </div>

          {/* Completed Orders */}
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
                        {order.totalPaid.toLocaleString() +
                          ` ${t("algerianDinar")}`}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowInvoiceModal(true);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm ${
                    darkMode
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  <Receipt size={16} />
                  <span>{t("viewInvoice")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Invoice Modal */}
        {showInvoiceModal && selectedOrder && (
          <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto backdrop-blur-sm ${
              darkMode ? "bg-black/50" : "bg-black/30"
            }`}
          >
            {/* Main Invoice Container */}
            <div
              id="invoice-print-container"
              className={`relative rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowInvoiceModal(false)}
                className={`absolute top-4 right-4 p-1 rounded-full no-print ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <X size={20} />
              </button>

              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <img
                    src={darkMode ? WLogo : Blogo}
                    alt="Company Logo"
                    className="w-16 h-auto mr-4" // Changed h-16 to h-auto to maintain aspect ratio
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{t("invoice")}</h2>
                    <p className="text-sm opacity-80">
                      {t("order")} #{selectedOrder.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{t("furnitureCraft")}</p>
                  <p className="text-sm">123 Workshop St, Woodville</p>
                  <p className="text-sm">contact@furniturecraft.com</p>
                </div>
              </div>

              {/* Client and Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Client Information */}
                <div>
                  <h3 className="font-bold mb-2">{t("billTo")}</h3>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <p className="font-medium">{userData.name}</p>
                    <p className="text-sm">{userData.email}</p>
                  </div>
                </div>

                {/* Order Information */}
                <div>
                  <h3 className="font-bold mb-2">{t("orderDetails")}</h3>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-sm">{t("orderID")}:</p>
                      <p className="text-sm font-medium">{selectedOrder.id}</p>
                      <p className="text-sm">{t("orderDate")}:</p>
                      <p className="text-sm font-medium">
                        {selectedOrder.date}
                      </p>
                      {selectedOrder.status === "delivered" && (
                        <>
                          <p className="text-sm">{t("completionDate")}:</p>
                          <p className="text-sm font-medium">
                            {new Date(
                              selectedOrder.completionDetails?.completedAt ||
                                selectedOrder.date
                            ).toLocaleDateString()}
                          </p>
                        </>
                      )}
                      <p className="text-sm">{t("woodType")}:</p>
                      <p className="text-sm font-medium">
                        {selectedOrder.woodType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elements Section */}
              {selectedOrder.completionDetails?.elements && (
                <div className="mb-6">
                  <h3 className="font-bold mb-2">{t("elements")}</h3>
                  <div
                    className={`rounded-lg border flex flex-wrap gap-2 p-3 ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    {selectedOrder.completionDetails.elements.map(
                      (element, index) => (
                        <div
                          key={index}
                          className={`px-3 py-2 rounded border ${
                            darkMode
                              ? "bg-gray-700 border-gray-600"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <p>{element}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="mb-6">
                <h3 className="font-bold mb-2">{t("paymentSummary")}</h3>
                <div
                  className={`rounded-lg border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  {/* Header Row */}
                  <div
                    className={`p-3 border-b grid grid-cols-3 gap-4 ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <p className="text-sm font-medium">{t("description")}</p>
                    <p className="text-sm font-medium text-right">
                      {t("amount")}
                    </p>
                    <p className="text-sm font-medium text-right">
                      {t("date")}
                    </p>
                  </div>

                  {/* Payment Rows */}
                  {selectedOrder.payments?.map((payment, index) => (
                    <div
                      key={index}
                      className={`p-3 border-b last:border-b-0 grid grid-cols-3 gap-4 ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <p className="text-sm">
                        {t("payment")} {index + 1} ({payment.method})
                      </p>
                      <p className="text-sm text-right font-medium">
                        {payment.amount.toLocaleString() +
                          ` ${t("algerianDinar")}`}
                      </p>
                      <p className="text-sm text-right opacity-80">
                        {payment.date}
                      </p>
                      {payment.notes && (
                        <p className="text-xs mt-1 opacity-70 col-span-3">
                          {payment.notes}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Total Row */}
                  <div
                    className={`p-3 ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <p className="text-sm font-medium">{t("totalPaid")}</p>
                      <p className="text-right text-lg font-bold text-green-500">
                        {(
                          selectedOrder.totalPaid ||
                          selectedOrder.amountPaid ||
                          0
                        ).toLocaleString() + ` ${t("algerianDinar")}`}
                      </p>
                      <p></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className={`px-4 py-2 rounded-lg no-print ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {t("close")}
                  </button>
                  <button
                    onClick={() => {
                      const printStyles = `
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #invoice-print-container, #invoice-print-container * {
                    visibility: visible;
                  }
                  #invoice-print-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    max-width: 100%;
                    padding: 20px;
                    background: white !important;
                    color: black !important;
                    border-radius: 0 !important;
                    overflow: visible !important;
                    max-height: none !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                  .dark\\:bg-gray-800,
                  .dark\\:bg-gray-700 {
                    background: white !important;
                  }
                  .dark\\:text-white {
                    color: black !important;
                  }
                  .bg-gray-100,
                  .bg-gray-50 {
                    background: #f8f9fa !important;
                  }
                  .border-gray-700,
                  .border-gray-200 {
                    border-color: #dee2e6 !important;
                  }
                  .rounded-lg,
                  .rounded-2xl {
                    border-radius: 8px !important;
                  }
                  .text-green-500 {
                    color: #28a745 !important;
                  }
                }
              `;

                      const styleElement = document.createElement("style");
                      styleElement.innerHTML = printStyles;
                      document.head.appendChild(styleElement);
                      window.print();
                      setTimeout(() => {
                        document.head.removeChild(styleElement);
                      }, 1000);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white no-print flex items-center space-x-2"
                  >
                    <FileText size={16} />
                    <span>{t("printInvoice")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
