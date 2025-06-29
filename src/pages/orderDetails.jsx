import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WLogo from "../assets/images/blackLogo.png";
import {
  Clock,
  Hammer,
  Truck,
  CheckCircle,
  DollarSign,
  X,
  ChevronLeft,
  Plus,
  Edit2,
  Check,
  Receipt,
  FileText,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Globe, Sun, Moon, ChevronDown } from "lucide-react";
import i18next from "i18next";

const OrderDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  console.log("Order ID: ", id);

  // Enhanced fake data with some orders missing titles
  const [orders, setOrders] = useState([
    {
      id: "ORD-7890",
      date: "2023-05-15",
      status: "inProgress",
      title: "Modern Oak Kitchen",
      client: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City, State 12345",
      woodType: "Oak",
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
        "https://images.unsplash.com/photo-1600585152220",
      ],
      progress: 1,
      estimatedTotal: 12500,
      amountPaid: 5000,
      payments: [
        {
          amount: 5000,
          date: "2023-05-20",
          method: "Credit Card",
          notes: "Initial deposit",
        },
      ],
      nextPaymentDate: "2023-06-15",
    },
    {
      id: "ORD-7891",
      date: "2023-06-01",
      status: "waiting",
      title: "", // Empty title to test editing
      client: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave, City, State 67890",
      woodType: "Walnut",
      images: [
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
        "https://images.unsplash.com/photo-1600210492493-0946911123ea",
      ],
      progress: 0,
      estimatedTotal: null,
      amountPaid: 0,
      payments: [],
      nextPaymentDate: "2023-06-30",
      clientValidated: false,
    },
  ]);

  const [completedOrders, setCompletedOrders] = useState([
    {
      id: "ORD-4567",
      date: "2023-03-10",
      status: "delivered",
      title: "Classic Walnut Kitchen",
      client: "Michael Brown",
      email: "michael.b@example.com",
      phone: "+1 (555) 456-7890",
      address: "789 Pine St, City, State 54321",
      woodType: "Walnut",
      images: [
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      ],
      totalPaid: 9800,
      estimatedTotal: 9800,
      amountPaid: 9800,
      paymentMethod: "Bank Transfer",
      payments: [
        {
          amount: 5000,
          date: "2023-03-15",
          method: "Bank Transfer",
          notes: "First payment",
        },
        {
          amount: 4800,
          date: "2023-04-01",
          method: "Bank Transfer",
          notes: "Final payment",
        },
      ],
      completionDetails: {
        elements: ["Cabinet doors", "Drawer fronts", "Countertop"],
        notes: "Client requested additional polishing",
        completedAt: "2023-04-15T12:00:00Z",
      },
    },
  ]);

  const [waitingOrders, setWaitingOrders] = useState([
    {
      id: "ORD-7892",
      date: "2023-06-10",
      status: "waiting",
      title: "Custom Walnut Desk",
      client: "Alex Johnson",
      email: "alex.j@example.com",
      phone: "+1 (555) 234-5678",
      address: "321 Elm St, City, State 98765",
      woodType: "Walnut",
      images: ["https://images.unsplash.com/photo-1517705008128-361805f42e86"],
      estimatedTotal: null,
      clientValidated: false,
      amountPaid: 0,
      payments: [],
    },
  ]);

  const handlePrintInvoice = () => {
    // Create print styles
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

    // Create style element
    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    // Print the invoice
    window.print();

    // Clean up
    setTimeout(() => {
      document.head.removeChild(styleElement);
    }, 1000);
  };

  // State for forms and editing
  const [priceProposal, setPriceProposal] = useState("");
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

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

  const allOrders = [...orders, ...completedOrders, ...waitingOrders];
  const order = allOrders.find((o) => o.id === id);

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

    // Update in orders array
    const updatedOrders = orders.map((o) =>
      o.id === order.id
        ? {
            ...o,
            estimatedTotal: parseFloat(priceProposal),
          }
        : o
    );
    setOrders(updatedOrders);

    // Update in waitingOrders array
    const updatedWaitingOrders = waitingOrders.map((o) =>
      o.id === order.id
        ? {
            ...o,
            estimatedTotal: parseFloat(priceProposal),
          }
        : o
    );
    setWaitingOrders(updatedWaitingOrders);

    setPriceProposal("");
  }

  function handleAddPayment() {
    if (!paymentData.amount) return;

    const newPayment = {
      amount: parseFloat(paymentData.amount),
      date: paymentData.date,
      method: paymentData.method,
      notes: paymentData.notes,
    };

    const updatedOrders = orders.map((o) => {
      if (o.id === order.id) {
        return {
          ...o,
          amountPaid: (o.amountPaid || 0) + parseFloat(paymentData.amount),
          payments: [...(o.payments || []), newPayment],
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    setPaymentData({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      method: "Credit Card",
      notes: "",
    });
    setShowPaymentForm(false);
  }

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

    setCompletedOrders([...completedOrders, completedOrder]);
    setOrders(orders.filter((o) => o.id !== order.id));
    setShowCompletionForm(false);
    setCompletionForm({
      elements: [],
      currentElement: "",
      notes: "",
    });
  }

  function updateOrderStatus(orderId, newStatus) {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        let newProgress = order.progress;
        if (newStatus === "waiting") newProgress = 0;
        if (newStatus === "inProgress") newProgress = 1;
        if (newStatus === "shipping") newProgress = 2;

        return {
          ...order,
          status: newStatus,
          progress: newProgress,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
  }

  function handleEditTitle() {
    setEditedTitle(order.title || "");
    setIsEditingTitle(true);
  }

  function handleSaveTitle() {
    if (!editedTitle.trim()) return;

    // Update in all relevant arrays
    const updatedOrders = orders.map((o) =>
      o.id === order.id ? { ...o, title: editedTitle.trim() } : o
    );
    setOrders(updatedOrders);

    const updatedWaitingOrders = waitingOrders.map((o) =>
      o.id === order.id ? { ...o, title: editedTitle.trim() } : o
    );
    setWaitingOrders(updatedWaitingOrders);

    const updatedCompletedOrders = completedOrders.map((o) =>
      o.id === order.id ? { ...o, title: editedTitle.trim() } : o
    );
    setCompletedOrders(updatedCompletedOrders);

    setIsEditingTitle(false);
  }

  function handleLanguageChange(languageCode) {
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  }

  function toggleLanguageDropdown() {
    setIsLanguageDropdownOpen((prev) => !prev);
  }

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
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
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${
              darkMode
                ? "hover:bg-gray-700 text-white"
                : "hover:bg-gray-100 text-gray-900"
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <h1
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Order Details - {order.id}
          </h1>

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
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div
          className={`rounded-2xl p-6 border transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
              : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
          }`}
        >
          {/* Order Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {!order.title || isEditingTitle ? (
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Enter order title..."
                    className={`text-2xl font-bold bg-transparent border-b-2 border-dashed outline-none ${
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
                    className={`text-2xl font-bold ${
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
                ? "Waiting"
                : order.status === "inProgress"
                ? "In Progress"
                : order.status === "shipping"
                ? "Shipping"
                : "Delivered"}
            </span>
          </div>

          {/* Order Images */}
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {order.images.map((img, index) => (
                <div
                  key={index}
                  className="relative h-48 rounded-xl overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${order.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3
                className={`font-bold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Client Information
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <p className="font-medium">{order.client}</p>
                <p className="text-sm">{order.email}</p>
                <p className="text-sm">{order.phone}</p>
                <p className="text-sm">{order.address}</p>
              </div>
            </div>

            <div>
              <h3
                className={`font-bold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Order Information
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <p>
                  <span className="font-medium">ID:</span> {order.id}
                </p>
                <p>
                  <span className="font-medium">Wood Type:</span>{" "}
                  {order.woodType}
                </p>
                {order.estimatedTotal && (
                  <p>
                    <span className="font-medium">Estimated Total:</span> $
                    {order.estimatedTotal?.toLocaleString() || "N/A"}
                  </p>
                )}
                {order.status === "delivered" && (
                  <p>
                    <span className="font-medium">Completed:</span>{" "}
                    {new Date(
                      order.completionDetails?.completedAt || order.date
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Price Proposal Section (for waiting orders) */}
          {order.status === "waiting" && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <h3
                className={`font-bold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Price Proposal
              </h3>

              {!order.estimatedTotal ? (
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <span
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      value={priceProposal}
                      onChange={(e) => setPriceProposal(e.target.value)}
                      className={`w-full pl-8 pr-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-600 border-gray-500 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Enter estimated price"
                    />
                  </div>
                  <button
                    onClick={handleSubmitPriceProposal}
                    disabled={!priceProposal}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      !priceProposal
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-400 text-black"
                    }`}
                  >
                    Submit Proposal
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`font-medium text-lg ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${order.estimatedTotal.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      Price proposal submitted
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setPriceProposal(order.estimatedTotal.toString());
                      // Reset estimated total to allow editing
                      const updatedOrders = orders.map((o) =>
                        o.id === order.id ? { ...o, estimatedTotal: null } : o
                      );
                      setOrders(updatedOrders);
                      const updatedWaitingOrders = waitingOrders.map((o) =>
                        o.id === order.id ? { ...o, estimatedTotal: null } : o
                      );
                      setWaitingOrders(updatedWaitingOrders);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    Edit Price
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payment Information */}
          {order.status !== "waiting" && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3
                  className={`font-bold flex items-center ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <DollarSign className="mr-2" size={18} />
                  Payment Information
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
                    <span>Add Payment</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Estimated Total
                  </p>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${order.estimatedTotal?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Amount Paid
                  </p>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    ${(order.amountPaid || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Remaining Balance
                  </p>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-amber-400" : "text-amber-600"
                    }`}
                  >
                    $
                    {(
                      (order.estimatedTotal || 0) - (order.amountPaid || 0)
                    ).toLocaleString()}
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
                    Payment History
                  </h4>
                  <div
                    className={`rounded-lg overflow-hidden border ${
                      darkMode ? "border-gray-600" : "border-gray-200"
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
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              ${payment.amount.toLocaleString()}
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
              className={`p-4 rounded-lg mb-6 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3
                  className={`font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Completion Details
                </h3>
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                >
                  <Receipt size={16} />
                  <span>View Invoice</span>
                </button>
              </div>

              <div>
                <h4
                  className={`text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Elements Used
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
                      Notes
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
            className={`p-4 rounded-lg mb-6 ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <h3
              className={`font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Order Progress
            </h3>

            <div className="relative">
              {/* Progress line */}
              <div
                className={`absolute left-4 top-0 h-full w-0.5 ${
                  darkMode ? "bg-gray-600" : "bg-gray-300"
                }`}
              ></div>

              {/* Steps */}
              <div className="space-y-8">
                {/* Waiting step */}
                <div className="relative flex items-start">
                  <div
                    className={`absolute left-4 -ml-0.5 w-2 h-2 rounded-full mt-1.5 ${
                      order.progress >= 0
                        ? darkMode
                          ? "bg-yellow-400"
                          : "bg-yellow-500"
                        : darkMode
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className="ml-8 flex-1">
                    <div className="flex items-center">
                      <Clock
                        className={`mr-2 ${
                          order.progress >= 0
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
                          order.progress >= 0
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        Waiting
                      </h4>
                    </div>
                    {order.progress >= 0 && (
                      <p
                        className={`mt-1 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Order received and waiting for processing
                      </p>
                    )}
                  </div>
                </div>

                {/* In Progress step */}
                <div className="relative flex items-start">
                  <div
                    className={`absolute left-4 -ml-0.5 w-2 h-2 rounded-full mt-1.5 ${
                      order.progress >= 1
                        ? darkMode
                          ? "bg-blue-400"
                          : "bg-blue-500"
                        : darkMode
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className="ml-8 flex-1">
                    <div className="flex items-center">
                      <Hammer
                        className={`mr-2 ${
                          order.progress >= 1
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
                          order.progress >= 1
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        In Progress
                      </h4>
                    </div>
                    {order.progress >= 1 && (
                      <p
                        className={`mt-1 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Order is being manufactured
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping step */}
                <div className="relative flex items-start">
                  <div
                    className={`absolute left-4 -ml-0.5 w-2 h-2 rounded-full mt-1.5 ${
                      order.progress >= 2
                        ? darkMode
                          ? "bg-purple-400"
                          : "bg-purple-500"
                        : darkMode
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className="ml-8 flex-1">
                    <div className="flex items-center">
                      <Truck
                        className={`mr-2 ${
                          order.progress >= 2
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
                          order.progress >= 2
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        Shipping
                      </h4>
                    </div>
                    {order.progress >= 2 && (
                      <p
                        className={`mt-1 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Order is being shipped to the client
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivered step */}
                <div className="relative flex items-start">
                  <div
                    className={`absolute left-4 -ml-0.5 w-2 h-2 rounded-full mt-1.5 ${
                      order.progress >= 3
                        ? darkMode
                          ? "bg-green-400"
                          : "bg-green-500"
                        : darkMode
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className="ml-8 flex-1">
                    <div className="flex items-center">
                      <CheckCircle
                        className={`mr-2 ${
                          order.progress >= 3
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
                          order.progress >= 3
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        Delivered
                      </h4>
                    </div>
                    {order.progress >= 3 && (
                      <p
                        className={`mt-1 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Order has been delivered to the client
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Status Change Buttons */}
            {order.status !== "delivered" && (
              <>
                {order.status !== "waiting" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "waiting")}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    <Clock size={16} />
                    <span>Set to Waiting</span>
                  </button>
                )}
                {order.status !== "inProgress" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "inProgress")}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-blue-200 hover:bg-blue-300 text-blue-900"
                    }`}
                  >
                    <Hammer size={16} />
                    <span>Set to In Progress</span>
                  </button>
                )}
                {order.status !== "shipping" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "shipping")}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      darkMode
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : "bg-purple-200 hover:bg-purple-300 text-purple-900"
                    }`}
                  >
                    <Truck size={16} />
                    <span>Set to Shipping</span>
                  </button>
                )}
                <button
                  onClick={() => setShowCompletionForm(true)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : "bg-green-200 hover:bg-green-300 text-green-900"
                  }`}
                >
                  <CheckCircle size={16} />
                  <span>Mark as Completed</span>
                </button>
              </>
            )}

            {/* Invoice Button for completed orders */}
            {order.status === "delivered" && (
              <button
                onClick={() => setShowInvoiceModal(true)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-blue-200 hover:bg-blue-300 text-blue-900"
                }`}
              >
                <Receipt size={16} />
                <span>View Invoice</span>
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
            className={`relative rounded-2xl w-full max-w-md p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <button
              onClick={() => setShowPaymentForm(false)}
              className={`absolute top-4 right-4 p-1 rounded-full ${
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
              Add Payment
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Amount
                </label>
                <div className="relative">
                  <span
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, amount: e.target.value })
                    }
                    className={`w-full pl-8 pr-4 py-2 rounded-lg border ${
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
                  Date
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
                  Payment Method
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
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Notes
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
                  placeholder="Any additional notes..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  Cancel
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
                  Add Payment
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
            className={`relative rounded-2xl w-full max-w-md p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <button
              onClick={() => setShowCompletionForm(false)}
              className={`absolute top-4 right-4 p-1 rounded-full ${
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
              Complete Order
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Elements
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
                    placeholder="Add element (e.g., Cabinet doors)"
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

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Completion Notes
                </label>
                <textarea
                  value={completionForm.notes}
                  onChange={(e) =>
                    setCompletionForm({
                      ...completionForm,
                      notes: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  rows={3}
                  placeholder="Any notes about the completion..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowCompletionForm(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  Cancel
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
                  Complete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Invoice Modal */}
      {showInvoiceModal && (
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
                {/* Company Logo - Replace with your actual logo */}
                <div className="mr-4 w-16 h-16 flex items-center justify-center print-logo">
                  <img
                    src={WLogo}
                    alt="Company Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Invoice</h2>
                  <p className="text-sm opacity-80">Order #{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">Furniture Craft</p>
                <p className="text-sm">123 Workshop St, Woodville</p>
                <p className="text-sm">contact@furniturecraft.com</p>
              </div>
            </div>

            {/* Client and Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Client Information */}
              <div>
                <h3 className="font-bold mb-2">Bill To</h3>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <p className="font-medium">{order.client}</p>
                  <p className="text-sm">{order.email}</p>
                  <p className="text-sm">{order.phone}</p>
                  <p className="text-sm">{order.address}</p>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <h3 className="font-bold mb-2">Order Details</h3>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm">Order ID:</p>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-sm">Order Date:</p>
                    <p className="text-sm font-medium">{order.date}</p>
                    <p className="text-sm">Completion Date:</p>
                    <p className="text-sm font-medium">
                      {new Date(
                        order.completionDetails?.completedAt || order.date
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm">Wood Type:</p>
                    <p className="text-sm font-medium">{order.woodType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elements Section */}
            <div className="mb-6">
              <h3 className="font-bold mb-2">Elements</h3>
              <div
                className={`rounded-lg border ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {order.completionDetails?.elements.map((element, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b last:border-b-0 ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <p>{element}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-6">
              <h3 className="font-bold mb-2">Payment Summary</h3>
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
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm font-medium text-right">Amount</p>
                  <p className="text-sm font-medium text-right">Date</p>
                </div>

                {/* Payment Rows */}
                {order.payments?.map((payment, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b last:border-b-0 grid grid-cols-3 gap-4 ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <p className="text-sm">
                      Payment {index + 1} ({payment.method})
                    </p>
                    <p className="text-sm text-right font-medium">
                      ${payment.amount.toLocaleString()}
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
                  className={`p-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <div className="grid grid-cols-3 gap-4">
                    <p className="text-sm font-medium">Total Paid</p>
                    <p className="text-right text-lg font-bold text-green-500">
                      ${order.amountPaid?.toLocaleString()}
                    </p>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Removed gradient background */}
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
                  Close
                </button>
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white no-print flex items-center space-x-2"
                >
                  <FileText size={16} />
                  <span>Print Invoice</span>
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
