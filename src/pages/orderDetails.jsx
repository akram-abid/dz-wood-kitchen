import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WLogo from "../assets/images/blackLogo.webp";
import {
  Clock,
  Hammer,
  Truck,
  CheckCircle,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Home,
  Check,
  Receipt,
  FileText,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Globe, Sun, Moon, ChevronDown } from "lucide-react";
import i18next from "i18next";
import apiFetch from "../utils/api/apiFetch";
import Header from "../components/header";

const OrderDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const currentLanguage = i18next.language;
  const isRTL = currentLanguage === "ar";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for forms and editing
  const [priceProposal, setPriceProposal] = useState("");
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [kitchenData, setKitchenData] = useState({});
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fullscreenStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const [completionForm, setCompletionForm] = useState({
    elements: [],
    currentElement: "",
    notes: "",
  });

  const [paymentData, setPaymentData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "Credit Card",
    notes: "",
  });

  useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/api/v1/orders/${id}`, null, true);

        if (response.success) {
          setOrder(response.data.data.order);
        } else {
          setError(response.error || "Failed to fetch order");
        }
      } catch (error) {
        setError(error.message || "Error fetching order");
      } finally {
        setLoading(false);
      }
    };
    getOrder();
  }, [id]);

  useEffect(() => {
    const fetchPost = async () => {
      if (order?.postId) {
        try {
          const response = await apiFetch(
            `/api/v1/services/posts/${order.postId}`
          );
          if (response.success) {
            const postData = response.data.data;
            const formattedPost = {
              title: postData.title || "",
              description: postData.description || "",
              woodType: postData.woodType || "",
              location: postData.location || "",
              images:
                postData.imageUrls?.map((url) => ({
                  url,
                  isExisting: true,
                })) || [],
              items: postData.items || [],
              currentItem: "",
            };
            setKitchenData(formattedPost);
          } else {
            throw new Error(response.error || "Failed to fetch post");
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          setError(error.message);
        }
      }
    };

    fetchPost();
  }, [order?.postId]);

  // Handler functions
  function handleAddElement() {
    if (completionForm.currentElement.trim()) {
      setCompletionForm((prev) => ({
        ...prev,
        elements: [...prev.elements, prev.currentElement.trim()],
        currentElement: "",
      }));
    }
  }

  function handleRemoveElement(index) {
    const newElements = [...completionForm.elements];
    newElements.splice(index, 1);
    setCompletionForm((prev) => ({ ...prev, elements: newElements }));
  }

  function handleSubmitPriceProposal() {
    if (!priceProposal) return;

    const updatedOrder = {
      ...order,
      offer: parseFloat(priceProposal),
    };
    setOrder(updatedOrder);
    setPriceProposal("");

    try {
      const body = { offer: priceProposal };
      const response = apiFetch(
        `/api/v1/orders/${order.id}/offer`,
        body,
        true,
        "PATCH"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.log("something went wrong: ", error);
    }
  }

  async function handleAddPayment() {
    if (!paymentData.amount) return;

    try {
      const body = {
        newInstallments: [
          {
            date: paymentData.date,
            amount: parseFloat(paymentData.amount),
            method: paymentData.method,
            notes: paymentData.notes,
          },
        ],
      };

      const response = await apiFetch(
        `/api/v1/orders/${order.id}/installments`,
        body,
        true,
        "PATCH"
      );

      if (response.success) {
        const newPayment = {
          amount: parseFloat(paymentData.amount),
          date: paymentData.date,
          method: paymentData.method,
          notes: paymentData.notes,
        };

        const updatedOrder = {
          ...order,
          installments: [...(order.installments || []), newPayment],
          amountPaid: (order.amountPaid || 0) + parseFloat(paymentData.amount),
        };

        setOrder(updatedOrder);
        setPaymentData({
          amount: "",
          date: new Date().toISOString().split("T")[0],
          method: "Credit Card",
          notes: "",
        });
        setShowPaymentForm(false);
      } else {
        throw new Error(response.error || "Failed to add payment");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  }

  const calculateAmountPaid = (installments) => {
    if (!installments || installments.length === 0) return 0;
    return installments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const calculateRemainingBalance = (offer, amountPaid) => {
    return (offer || 0) - (amountPaid || 0);
  };

  function handleCompleteOrder() {
    if (completionForm.elements.length === 0) {
      alert("Please add at least one element to complete the order.");
      return;
    }

    const completedOrder = {
      ...order,
      status: "delivered",
      progress: 3,
      totalPaid: order.amountPaid || 0,
      paymentMethod:
        order.payments && order.payments.length > 0
          ? order.payments[0].method
          : "Unknown",
      completionDetails: {
        elements: completionForm.elements,
        notes: completionForm.notes,
        completedAt: new Date().toISOString(),
      },
    };

    try {
      const body = { articles: completionForm.elements };
      const response = apiFetch(
        `/api/v1/orders/${order.id}/articles`,
        body,
        true,
        "Post"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.log("something went wrong: ", error);
    }

    setOrder(completedOrder);
    updateOrderStatus("delivered");
    setShowCompletionForm(false);
    setCompletionForm({
      elements: [],
      currentElement: "",
      notes: "",
    });
  }

  async function updateOrderStatus(newStatus) {
    let newProgress = order.progress;
    if (newStatus === "waiting") newProgress = 0;
    if (newStatus === "inProgress") newProgress = 1;
    if (newStatus === "shipping") newProgress = 2;

    const updatedOrder = {
      ...order,
      status: newStatus,
      progress: newProgress,
    };

    try {
      const body = { status: newStatus };
      const response = apiFetch(
        `/api/v1/orders/${order.id}/status`,
        body,
        true,
        "PATCH"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.log("something went wrong: ", error);
    }

    setOrder(updatedOrder);
  }

  function handleEditTitle() {
    setEditedTitle(order.title || "");
    setIsEditingTitle(true);
  }

  async function handleSaveTitle() {
    if (!editedTitle.trim()) return;
    const updatedOrder = {
      ...order,
      title: editedTitle.trim(),
    };

    try {
      const formData = new FormData();
      formData.append("title", editedTitle.trim());
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_ORIGIN}/api/v1/orders/${order.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.log("something went wrong: ", error);
    }

    setOrder(updatedOrder);
    setIsEditingTitle(false);
  }

  function handleLanguageChange(languageCode) {
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
    document.documentElement.dir = languageCode === "ar" ? "rtl" : "ltr";
  }

  function toggleLanguageDropdown() {
    setIsLanguageDropdownOpen((prev) => !prev);
  }

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  const handlePrintInvoice = () => {
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
        /* Hide scrollbars in print */
        #invoice-print-container {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        #invoice-print-container::-webkit-scrollbar {
          display: none !important;
        }
      }
      
      /* Hide scrollbars in normal view */
      #invoice-print-container::-webkit-scrollbar {
        display: none;
      }
    `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    window.print();

    setTimeout(() => {
      document.head.removeChild(styleElement);
    }, 1000);
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <p className={darkMode ? "text-white" : "text-gray-900"}>
          Loading order...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <p className={darkMode ? "text-white" : "text-gray-900"}>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <p className={darkMode ? "text-white" : "text-gray-900"}>
          Order not found {`${id}`}
        </p>
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
      dir={isRTL ? "rtl" : "ltr"}
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

      {isFullscreenPreview && order.mediaUrls && (
        <div
          style={fullscreenStyles}
          onClick={() => setIsFullscreenPreview(false)}
          className="cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreenPreview(false);
              }}
              className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 z-10 hover:bg-gray-700"
            >
              <X size={24} />
            </button>

            <img
              src={`${import.meta.env.VITE_REACT_APP_ORIGIN}/${
                order.mediaUrls[currentImageIndex]
              }`}
              alt={`Order ${order.id} - ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {order.mediaUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? order.mediaUrls.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 bg-gray-800 text-white rounded-full p-2 z-10 hover:bg-gray-700"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === order.mediaUrls.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 bg-gray-800 text-white rounded-full p-2 z-10 hover:bg-gray-700"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div
          className={`rounded-2xl p-4 sm:p-6 border transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
              : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
          }`}
        >
          {kitchenData && (
            <div
              className={`mb-6 rounded-2xl p-6 border transition-all duration-300 ${
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
                      loading="lazy"
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
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              {!order.title || isEditingTitle ? (
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder={t("enterOrderTitle")}
                    className={`text-xl sm:text-2xl font-bold bg-transparent border-b-2 border-dashed outline-none w-full ${
                      darkMode
                        ? "text-white border-gray-600 placeholder-gray-400"
                        : "text-gray-900 border-gray-300 placeholder-gray-500"
                    }`}
                    onKeyPress={(e) => e.key === "Enter" && handleSaveTitle()}
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 mb-2">
                  <h2
                    className={`text-xl sm:text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {order.title}
                  </h2>
                  <button
                    onClick={handleEditTitle}
                    className={`p-2 rounded-full transition-colors ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {order.date} • {order.client}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === "waiting"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "inProgress"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "shipping"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {order.status === "waiting"
                ? t("waiting")
                : order.status === "inProgress"
                ? t("inProgress")
                : order.status === "shipping"
                ? t("shipping")
                : t("delivered")}
            </span>
          </div>

          {/* Order Images */}
          {order.mediaUrls && order.mediaUrls.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {order.mediaUrls.map((img, index) => (
                  <div
                    key={index}
                    className="relative h-36 sm:h-48 rounded-xl overflow-hidden cursor-zoom-in"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsFullscreenPreview(true);
                    }}
                  >
                    <img
                      loading="lazy"
                      src={`${import.meta.env.VITE_REACT_APP_ORIGIN}/${img}`}
                      alt={`${order.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <h3
                className={`font-bold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("clientInformation")}
              </h3>
              <div
                className={`p-3 sm:p-4 rounded-lg ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
                }`}
              >
                <p className="font-medium">{order.fullName}</p>
                <p className="text-sm">{order.email}</p>
                <p className="text-sm">{order.phoneNumber}</p>
                <p className="text-sm">{`${order.wilaya}, ${order.daira}, ${order.baladia}, ${order.street}`}</p>
              </div>
            </div>

            <div>
              <h3
                className={`font-bold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("orderInformation")}
              </h3>
              <div
                className={`p-3 sm:p-4 rounded-lg ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
                }`}
              >
                <p>
                  <span className="font-medium">{t("id")}:</span> {order.id}
                </p>
                <p>
                  <span className="font-medium">{t("woodType")}:</span>{" "}
                  {order.woodType}
                </p>
                {order.offer && (
                  <p>
                    <span className="font-medium">{t("estimatedTotal")}:</span>
                    {order.offer?.toLocaleString() + ` ${t("algerianDinar")}` ||
                      "N/A"}
                  </p>
                )}
                {order.completionDetails?.completedAt && (
                  <p>
                    <span className="font-medium">{t("completed")}:</span>{" "}
                    {order.completionDetails?.completedAt.split("T")[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Price Proposal Section */}
          {order.status === "waiting" && (
            <div
              className={`p-3 sm:p-4 rounded-lg mb-6 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <h3
                className={`font-bold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("priceProposal")}
              </h3>

              {!order.offer ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <span
                      className={`absolute ${
                        isRTL ? "right-3" : "left-3"
                      } top-1/2 transform -translate-y-1/2 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {`${t("algerianDinar")} `}
                    </span>
                    <input
                      type="number"
                      value={priceProposal}
                      onChange={(e) => setPriceProposal(e.target.value)}
                      className={`w-full ${
                        isRTL ? "pr-9 pl-5" : "pl-9 pr-5"
                      } py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-600 border-gray-500 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder={t("enterEstimatedPrice")}
                    />
                  </div>
                  <button
                    onClick={handleSubmitPriceProposal}
                    disabled={!priceProposal}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-colors ${
                      !priceProposal
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-400 text-black"
                    }`}
                  >
                    {t("submitProposal")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p
                      className={`font-medium text-lg ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {order.offer.toLocaleString() + ` ${t("algerianDinar")}`}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {t("priceProposalSubmitted")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setPriceProposal(order.offer.toString());
                      const updatedOrder = {
                        ...order,
                        offer: null,
                      };
                      setOrder(updatedOrder);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    {t("editPrice")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payment Information */}
          {order.status !== "waiting" && (
            <div
              className={`p-3 sm:p-4 rounded-lg mb-6 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                <h3
                  className={`font-bold flex items-center ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <DollarSign className="mr-2" size={18} />
                  {t("paymentInformation")}
                </h3>
                {order.status !== "delivered" && (
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className={`text-sm flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-amber-400"
                        : "bg-gray-200 hover:bg-gray-300 text-blue-600"
                    }`}
                  >
                    <Plus size={14} />
                    <span>{t("addPayment")}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
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
                    {order.offer?.toLocaleString() + ` ${t("algerianDinar")}` ||
                      "N/A"}
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
                    {calculateAmountPaid(order.installments).toLocaleString() +
                      ` ${t("algerianDinar")}`}
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
                    {calculateRemainingBalance(
                      order.offer,
                      calculateAmountPaid(order.installments)
                    ).toLocaleString() + ` ${t("algerianDinar")}`}
                  </p>
                </div>
              </div>

              {order.installments?.length > 0 && (
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
                      darkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                  >
                    {order.installments.map((payment, index) => (
                      <div
                        key={index}
                        className={`p-3 border-b last:border-b-0 ${
                          darkMode
                            ? "border-gray-600 bg-gray-800/50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <p
                              className={`font-medium ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {payment.amount.toLocaleString() +
                                ` ${t("algerianDinar")}`}
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {payment.date} • {payment.method}
                            </p>
                          </div>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
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
          )}

          {/* Completion Details */}
          {order.status === "delivered" && order.completionDetails && (
            <div
              className={`p-3 sm:p-4 rounded-lg mb-6 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                <h3
                  className={`font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("completionDetails")}
                </h3>
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                >
                  <Receipt size={16} />
                  <span>{t("viewInvoice")}</span>
                </button>
              </div>

              <div>
                <h4
                  className={`text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("elementsMaded")}
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {order.completionDetails.elements.map((element, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode
                          ? "bg-gray-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {element}
                    </span>
                  ))}
                </div>

                {order.completionDetails.notes && (
                  <>
                    <h4
                      className={`text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("notes")}
                    </h4>
                    <p
                      className={`p-3 rounded-lg ${
                        darkMode
                          ? "bg-gray-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {order.completionDetails.notes}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Order Progress */}
          <div
            className={`p-3 sm:p-4 rounded-lg mb-6 ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <h3
              className={`font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("orderProgress")}
            </h3>

            <div className="relative">
              {/* Progress line */}
              <div
                className={`absolute ${
                  isRTL ? "right-4" : "left-4"
                } top-0 h-full w-0.5 ${
                  darkMode ? "bg-gray-600" : "bg-gray-300"
                }`}
              ></div>

              {/* Steps */}
              <div className="space-y-6 sm:space-y-8">
                {/* Waiting step */}
                <div className="relative flex items-start">
                  <div
                    className={`absolute ${
                      isRTL ? "right-4 -mr-0.5" : "left-4 -ml-0.5"
                    } w-2 h-2 rounded-full mt-1.5 ${
                      [
                        "waiting",
                        "inProgress",
                        "inShipping",
                        "delivered",
                      ].includes(order.status)
                        ? darkMode
                          ? "bg-yellow-400"
                          : "bg-yellow-500"
                        : darkMode
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className={`${isRTL ? "mr-8" : "ml-8"} flex-1`}>
                    <div className="flex items-center">
                      <Clock
                        className={`mr-2 ${
                          [
                            "waiting",
                            "inProgress",
                            "inShipping",
                            "delivered",
                          ].includes(order.status)
                            ? darkMode
                              ? "text-yellow-400"
                              : "text-yellow-500"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                        size={18}
                      />
                      <h4
                        className={`font-medium ${
                          [
                            "waiting",
                            "inProgress",
                            "inShipping",
                            "delivered",
                          ].includes(order.status)
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        {t("waiting")}
                      </h4>
                    </div>
                    {[
                      "waiting",
                      "inProgress",
                      "inShipping",
                      "delivered",
                    ].includes(order.status) && (
                      <p
                        className={`mt-1 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {t("orderReceivedAndWaiting")}
                      </p>
                    )}
                  </div>
                </div>

                {/* In Progress step */}
                <div className="relative flex items-start">
                  <div
                    className={`absolute ${
                      isRTL ? "right-4 -mr-0.5" : "left-4 -ml-0.5"
                    } w-2 h-2 rounded-full mt-1.5 ${
                      ["inProgress", "inShipping", "delivered"].includes(
                        order.status
                      )
                        ? darkMode
                          ? "bg-blue-400"
                          : "bg-blue-500"
                        : darkMode
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className={`${isRTL ? "mr-8" : "ml-8"} flex-1`}>
                    <div className="flex items-center">
                      <Hammer
                        className={`mr-2 ${
                          ["inProgress", "inShipping", "delivered"].includes(
                            order.status
                          )
                            ? darkMode
                              ? "text-blue-400"
                              : "text-blue-500"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                        size={18}
                      />
                      <h4
                        className={`font-medium ${
                          ["inProgress", "inShipping", "delivered"].includes(
                            order.status
                          )
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        {t("inProgress")}
                      </h4>
                    </div>
                    {["inProgress", "inShipping", "delivered"].includes(
                      order.status
                    ) && (
                      <p
                        className={`mt-1 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {t("orderBeingManufactured")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping step */}
                <div className="relative flex items-start">
                  <div
                    className={`absolute ${
                      isRTL ? "right-4 -mr-0.5" : "left-4 -ml-0.5"
                    } w-2 h-2 rounded-full mt-1.5 ${
                      ["inShipping", "delivered"].includes(order.status)
                        ? darkMode
                          ? "bg-purple-400"
                          : "bg-purple-500"
                        : darkMode
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className={`${isRTL ? "mr-8" : "ml-8"} flex-1`}>
                    <div className="flex items-center">
                      <Truck
                        className={`mr-2 ${
                          ["inShipping", "delivered"].includes(order.status)
                            ? darkMode
                              ? "text-purple-400"
                              : "text-purple-500"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                        size={18}
                      />
                      <h4
                        className={`font-medium ${
                          ["inShipping", "delivered"].includes(order.status)
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        {t("shipping")}
                      </h4>
                    </div>
                    {["inShipping", "delivered"].includes(order.status) && (
                      <p
                        className={`mt-1 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {t("orderBeingShipped")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivered step */}
                <div className="relative flex items-start">
                  <div
                    className={`absolute ${
                      isRTL ? "right-4 -mr-0.5" : "left-4 -ml-0.5"
                    } w-2 h-2 rounded-full mt-1.5 ${
                      order.status === "delivered"
                        ? darkMode
                          ? "bg-green-400"
                          : "bg-green-500"
                        : darkMode
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className={`${isRTL ? "mr-8" : "ml-8"} flex-1`}>
                    <div className="flex items-center">
                      <CheckCircle
                        className={`mr-2 ${
                          order.status === "delivered"
                            ? darkMode
                              ? "text-green-400"
                              : "text-green-500"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                        size={18}
                      />
                      <h4
                        className={`font-medium ${
                          order.status === "delivered"
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        {t("delivered")}
                      </h4>
                    </div>
                    {order.status === "delivered" && (
                      <p
                        className={`mt-1 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {t("orderDeliveredToClient")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* Status Change Buttons */}
            {order.status !== "delivered" && (
              <>
                {order.status !== "waiting" && (
                  <button
                    onClick={() => updateOrderStatus("waiting")}
                    className={`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    <Clock size={16} />
                    <span>{t("setToWaiting")}</span>
                  </button>
                )}
                {order.status !== "inProgress" && (
                  <button
                    onClick={() => updateOrderStatus("inProgress")}
                    className={`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-blue-200 hover:bg-blue-300 text-blue-900"
                    }`}
                  >
                    <Hammer size={16} />
                    <span>{t("setToInProgress")}</span>
                  </button>
                )}
                {order.status !== "shipping" && (
                  <button
                    onClick={() => updateOrderStatus("inShipping")}
                    className={`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      darkMode
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : "bg-purple-200 hover:bg-purple-300 text-purple-900"
                    }`}
                  >
                    <Truck size={16} />
                    <span>{t("setToShipping")}</span>
                  </button>
                )}
                <button
                  onClick={() => setShowCompletionForm(true)}
                  className={`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : "bg-green-200 hover:bg-green-300 text-green-900"
                  }`}
                >
                  <CheckCircle size={16} />
                  <span>{t("markAsCompleted")}</span>
                </button>
              </>
            )}

            {/* Invoice Button for completed orders */}
            {order.status === "delivered" && (
              <button
                onClick={() => setShowInvoiceModal(true)}
                className={`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-blue-200 hover:bg-blue-300 text-blue-900"
                }`}
              >
                <Receipt size={16} />
                <span>{t("viewInvoice")}</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
            darkMode ? "bg-black/50" : "bg-black/30"
          }`}
        >
          <div
            className={`relative rounded-2xl w-full max-w-md mx-4 p-4 sm:p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <button
              onClick={() => setShowPaymentForm(false)}
              className={`absolute top-3 ${
                isRTL ? "left-3" : "right-3"
              } p-1 rounded-full ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X size={20} />
            </button>

            <h3
              className={`text-lg font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("addPayment")}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("amount")}
                </label>
                <div className="relative">
                  <span
                    className={`absolute ${
                      isRTL ? "right-3" : "left-3"
                    } top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {` ${t("algerianDinar")}`}
                  </span>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, amount: e.target.value })
                    }
                    className={`w-full ${
                      isRTL ? "pr-9 pl-5" : "pl-9 pr-5"
                    } py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("date")}
                </label>
                <input
                  type="date"
                  value={paymentData.date}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, date: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("paymentMethod")}
                </label>
                <select
                  value={paymentData.method}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, method: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="Credit Card">{t("creditCard")}</option>
                  <option value="Bank Transfer">{t("bankTransfer")}</option>
                  <option value="Cash">{t("cash")}</option>
                  <option value="Check">{t("check")}</option>
                  <option value="Other">{t("other")}</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("notes")}
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, notes: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  rows={3}
                  placeholder={t("anyAdditionalNotes")}
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleAddPayment}
                  disabled={!paymentData.amount}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !paymentData.amount
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  {t("addPayment")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Form Modal */}
      {showCompletionForm && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
            darkMode ? "bg-black/50" : "bg-black/30"
          }`}
        >
          <div
            className={`relative rounded-2xl w-full max-w-md mx-4 p-4 sm:p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <button
              onClick={() => setShowCompletionForm(false)}
              className={`absolute top-3 ${
                isRTL ? "left-3" : "right-3"
              } p-1 rounded-full ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X size={20} />
            </button>

            <h3
              className={`text-lg font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("completeOrder")}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("elements")}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={completionForm.currentElement}
                    onChange={(e) =>
                      setCompletionForm({
                        ...completionForm,
                        currentElement: e.target.value,
                      })
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleAddElement()}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder={t("addElementPlaceholder")}
                  />
                  <button
                    onClick={handleAddElement}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {completionForm.elements.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {completionForm.elements.map((element, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <span
                          className={darkMode ? "text-white" : "text-gray-900"}
                        >
                          {element}
                        </span>
                        <button
                          onClick={() => handleRemoveElement(index)}
                          className={`p-1 rounded-full ${
                            darkMode
                              ? "hover:bg-gray-600 text-red-400"
                              : "hover:bg-gray-200 text-red-500"
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <button
                  onClick={() => setShowCompletionForm(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleCompleteOrder}
                  disabled={completionForm.elements.length === 0}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    completionForm.elements.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500 text-white"
                  }`}
                >
                  {t("completeOrder")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div
          className={`fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto backdrop-blur-sm ${
            darkMode ? "bg-black/50" : "bg-black/30"
          }`}
        >
          <div
            id="invoice-print-container"
            className={`relative rounded-2xl w-full max-w-2xl mx-2 p-4 sm:p-6 max-h-[90vh] overflow-y-auto ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <button
              onClick={() => setShowInvoiceModal(false)}
              className={`absolute top-3 ${
                isRTL ? "left-3" : "right-3"
              } p-1 rounded-full no-print ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X size={20} />
            </button>

            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex items-center">
                <div className="mx-2 sm:mx-4 w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center print-logo">
                  <img
                    loading="lazy"
                    src={WLogo}
                    alt="Company Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {t("invoice")}
                  </h2>
                  <p className="text-sm opacity-80">
                    {t("order")} #{order.id}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-medium">Dz Wood Kitchen</p>
                <p className="text-sm">Ouled-Slama, Blida</p>
                <p className="text-sm">support@dzwoodkitchen.com</p>
              </div>
            </div>

            {/* Client and Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Client Information */}
              <div>
                <h3 className="font-bold mb-2">{t("billTo")}</h3>
                <div
                  className={`p-3 sm:p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <p className="font-medium">{order.fullName}</p>
                  <p className="text-sm">{order.email}</p>
                  <p className="text-sm">{order.phoneNumber}</p>
                  <p className="text-sm">{order.street}</p>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <h3 className="font-bold mb-2">{t("orderDetails")}</h3>
                <div
                  className={`p-3 sm:p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm">{t("orderID")}:</p>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-sm">{t("orderDate")}:</p>
                    <p className="text-sm font-medium">
                      {order.createdAt.split("T")[0]}
                    </p>
                    <p className="text-sm">{t("completionDate")}:</p>
                    <p className="text-sm font-medium">
                      {order.updatedAt.split("T")[0]}
                    </p>
                    <p className="text-sm">{t("woodType")}:</p>
                    <p className="text-sm font-medium">{order.woodType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elements Section */}
            <div className="mb-6">
              <h3 className="font-bold mb-2">{t("elements")}</h3>
              <div
                className={`rounded-lg border flex flex-wrap gap-2 p-3 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {order.articles?.map((element, index) => (
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
                ))}
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
                  <p className="text-sm font-medium text-right">{t("date")}</p>
                </div>

                {order.installments?.map((payment, index) => (
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

                {/* Totals Section */}
                <div
                  className={`p-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <div className="grid grid-cols-3 gap-4">
                    <p className="text-sm font-medium">{t("total")}</p>
                    <p className="text-right text-sm font-medium">
                      {order.offer?.toLocaleString() +
                        ` ${t("algerianDinar")}` || "N/A"}
                    </p>
                    <p></p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <p className="text-sm font-medium">{t("totalPaid")}</p>
                    <p className="text-right text-lg font-bold text-green-500">
                      {calculateAmountPaid(
                        order.installments
                      ).toLocaleString() + ` ${t("algerianDinar")}`}
                    </p>
                    <p></p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <p className="text-sm font-medium">
                      {t("remainingBalance")}
                    </p>
                    <p className="text-right text-sm font-medium text-amber-500">
                      {calculateRemainingBalance(
                        order.offer,
                        calculateAmountPaid(order.installments)
                      ).toLocaleString() + ` ${t("algerianDinar")}`}
                    </p>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
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
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white no-print flex items-center justify-center space-x-2"
                >
                  <FileText size={16} />
                  <span>{t("printInvoice")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
