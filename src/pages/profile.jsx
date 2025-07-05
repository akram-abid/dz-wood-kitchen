import React, { useEffect, useState } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import {
  Receipt,
  FileText,
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
  DollarSign,
} from "lucide-react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/api/apiFetch";
import { useAuth } from "../utils/protectedRootesVerf";
import Header from "../components/header";

const ProfilePage = () => {
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userData, setUserData] = useState({});
  const [currentOrders, setCurrentOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const { t } = useTranslation();

  if (!isAuthenticated) navigate("/login");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/api/v1/orders/client", null, true);
        if (response.success) {
          const allOrders = response.data.data;
          setCurrentOrders(
            allOrders.filter((order) => order.status !== "delivered")
          );
          setCompletedOrders(
            allOrders.filter((order) => order.status === "delivered")
          );
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && token.split(".").length === 3) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserData({
          name: payload.name,
          role: payload.role,
          email: payload.email,
        });
        setTempName(payload.name);
      } catch (e) {
        console.error("Could not decode token payload", e);
      }
    }
  }, []);

  useEffect(() => {
    const updateDirection = () => {
      document.documentElement.dir = i18next.dir();
    };
    updateDirection();
    i18next.on("languageChanged", updateDirection);
    return () => i18next.off("languageChanged", updateDirection);
  }, []);

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (languageCode) => {
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData({ ...userData, name: tempName });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(userData.name);
    setIsEditing(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getStatusBadge = (status) => {
    switch (status) {
      case "waiting":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {t("waiting")}
          </span>
        );
      case "inProgress":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {t("inProgress")}
          </span>
        );
      case "inShipping":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {t("shipping")}
          </span>
        );
      case "delivered":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {t("delivered")}
          </span>
        );
      default:
        return null;
    }
  };

  const getProgressSteps = (order) => {
    const steps = [
      {
        icon: <Clock size={16} />,
        label: t("waiting"),
        active: order.status !== "waiting",
        status: "waiting",
      },
      {
        icon: <Hammer size={16} />,
        label: t("production"),
        active: ["inProgress", "inShipping", "delivered"].includes(order.status),
        status: "inProgress",
      },
      {
        icon: <Truck size={16} />,
        label: t("shipping"),
        active: ["inShipping", "delivered"].includes(order.status),
        status: "inShipping",
      },
      {
        icon: <CheckCircle size={16} />,
        label: t("completed"),
        active: order.status === "delivered",
        status: "delivered",
      },
    ];
    return steps;
  };

  const calculateTotalPaid = (order) => {
    if (!order.installments) return 0;
    return order.installments.reduce((sum, installment) => sum + installment.amount, 0);
  };

  const calculateRemainingAmount = (order) => {
    return (order.offer || 0) - calculateTotalPaid(order);
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
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500 flex items-center justify-center">
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    darkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                >
                  <User
                    size={40}
                    className={darkMode ? "text-gray-400" : "text-gray-500"}
                  />
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

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div
                  className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                    darkMode ? "border-amber-400" : "border-amber-500"
                  }`}
                ></div>
              </div>
            ) : currentOrders.length > 0 ? (
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
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {order.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {order.id}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {order.status === "waiting" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("offer")}
                          </p>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {order.offer?.toLocaleString() || "N/A"}{" "}
                            {t("algerianDinar")}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("status")}
                          </p>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-yellow-400" : "text-yellow-600"
                            }`}
                          >
                            {t("pendingApproval")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Order Progress */}
                        <div className="mb-6">
                          <h4
                            className={`flex items-center text-sm font-medium mb-3 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("orderProgress")}
                          </h4>
                          <div className="relative">
                            <div
                              className={`absolute ${
                                i18next.dir() === "rtl" ? "right-4" : "left-4"
                              } top-0 h-full w-0.5 ${
                                darkMode ? "bg-gray-600" : "bg-gray-300"
                              }`}
                            ></div>

                            <div className="space-y-8">
                              {getProgressSteps(order).map((step, index) => (
                                <div
                                  key={index}
                                  className="relative flex items-start"
                                >
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
                                          {order.status === "inShipping" &&
                                            t("orderBeingShipped")}
                                        </p>
                                      )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("offer")}
                            </p>
                            <p
                              className={`font-medium ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {order.offer?.toLocaleString() || "N/A"}{" "}
                              {t("algerianDinar")}
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
                              {calculateTotalPaid(order)?.toLocaleString() || "0"}{" "}
                              {t("algerianDinar")}
                            </p>
                          </div>
                          <div>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("remainingAmount")}
                            </p>
                            <p
                              className={`font-medium ${
                                darkMode ? "text-amber-400" : "text-amber-600"
                              }`}
                            >
                              {calculateRemainingAmount(order)?.toLocaleString()}{" "}
                              {t("algerianDinar")}
                            </p>
                          </div>
                        </div>

                        {/* Installments History */}
                        {order.installments?.length > 0 && (
                          <div className="mt-6">
                            <h4
                              className={`text-sm font-medium mb-2 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {t("paymentHistory")}
                            </h4>
                            <div
                              className={`rounded-lg overflow-hidden border ${
                                darkMode ? "border-gray-600" : "border-gray-200"
                              }`}
                            >
                              {order.installments.map((installment, index) => (
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
                                          darkMode ? "text-white" : "text-gray-900"
                                        }`}
                                      >
                                        {installment.amount?.toLocaleString()}{" "}
                                        {t("algerianDinar")}
                                      </p>
                                      <p
                                        className={`text-xs ${
                                          darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {installment.date}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
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

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div
                  className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                    darkMode ? "border-amber-400" : "border-amber-500"
                  }`}
                ></div>
              </div>
            ) : completedOrders.length > 0 ? (
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
                              {new Date(
                                order.updatedAt || order.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("totalPaid")}
                            </span>
                            <p
                              className={`font-medium ${
                                darkMode ? "text-green-400" : "text-green-600"
                              }`}
                            >
                              {calculateTotalPaid(order)?.toLocaleString() || "0"}{" "}
                              {t("algerianDinar")}
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

        {/* Invoice Modal */}
        {showInvoiceModal && selectedOrder && (
          <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto backdrop-blur-sm ${
              darkMode ? "bg-black/50" : "bg-black/30"
            }`}
          >
            <div
              id="invoice-print-container"
              className={`relative rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
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
                    className="w-16 h-auto mr-4"
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
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm">{t("completionDate")}:</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedOrder.updatedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm">{t("woodType")}:</p>
                      <p className="text-sm font-medium">
                        {selectedOrder.woodType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mb-6">
                <h3 className="font-bold mb-2">{t("paymentSummary")}</h3>
                <div
                  className={`rounded-lg border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
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

                  {selectedOrder.installments?.map((installment, index) => (
                    <div
                      key={index}
                      className={`p-3 border-b last:border-b-0 grid grid-cols-3 gap-4 ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <p className="text-sm">
                        {t("payment")} {index + 1}
                      </p>
                      <p className="text-sm text-right font-medium">
                        {installment.amount.toLocaleString()} {t("algerianDinar")}
                      </p>
                      <p className="text-sm text-right opacity-80">
                        {installment.date}
                      </p>
                    </div>
                  ))}

                  <div
                    className={`p-3 ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <p className="text-sm font-medium">{t("totalPaid")}</p>
                      <p className="text-right text-lg font-bold text-green-500">
                        {calculateTotalPaid(selectedOrder)?.toLocaleString() || "0"}{" "}
                        {t("algerianDinar")}
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