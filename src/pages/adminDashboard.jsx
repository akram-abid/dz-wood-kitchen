import React, { useState, useEffect, useRef } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import {
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Home,
  Package,
  CheckCircle,
  Clock,
  Truck,
  Hammer,
  CreditCard,
  DollarSign,
  Calendar,
  Plus,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
} from "lucide-react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/api/apiFetch";
import { useAuth } from "../utils/protectedRootesVerf";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [completedOrders, setCompletedOrders] = useState([]);
  const [waitingOrders, setWaitingOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const { isAuthenticated, loading } = useAuth("admin");
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completionForm, setCompletionForm] = useState({
    elements: [],
    currentElement: "",
    notes: "",
  });

  if (!isAuthenticated) navigate("/login");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch(
          "/api/v1/orders?status=delivered",
          null
        );
        console.log("the response i got is this ", response);
        if (response.success) {
          setCompletedOrders(response.data.data);
        } else {
          console.error("Failed to fetch orders:", response.error);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch(
          "/api/v1/orders?status=inProgress",
          null
        );
        if (response.success) {
          setOrders(response.data.data);
        } else {
          console.error("Failed to fetch orders:", response.error);
        }

        const response2 = await apiFetch(
          "/api/v1/orders?status=inShipping",
          null
        );
        if (response2.success) {
          setOrders([...response.data.data, ...response2.data.data]);
        } else {
          console.error("Failed to fetch orders:", response.error);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch("/api/v1/orders?status=waiting", null);
        if (response.success) {
          setWaitingOrders(response.data.data);
        } else {
          console.error("Failed to fetch orders:", response.error);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // const [waitingOrders, setWaitingOrders] = useState([
  //   {
  //     id: "ORD-7892",
  //     date: "2023-06-10",
  //     status: "waiting",
  //     title: "Custom Walnut Desk",
  //     client: "Alex Johnson",
  //     email: "alex.j@example.com",
  //     phone: "+1 (555) 234-5678",
  //     woodType: "Walnut",
  //     images: ["https://images.unsplash.com/photo-1517705008128-361805f42e86"],
  //     estimatedTotal: null, // Will be set by admin
  //     clientValidated: false,
  //   },
  // ]);

  const handleAddElement = () => {
    if (completionForm.currentElement.trim()) {
      setCompletionForm({
        ...completionForm,
        elements: [
          ...completionForm.elements,
          completionForm.currentElement.trim(),
        ],
        currentElement: "",
      });
    }
  };

  const handleRemoveElement = (index) => {
    const newElements = [...completionForm.elements];
    newElements.splice(index, 1);
    setCompletionForm({ ...completionForm, elements: newElements });
  };

  const handleCompleteOrder = (orderId) => {
    setCurrentOrder(orders.find((order) => order.id === orderId));
    setShowCompletionForm(true);
  };

  const [paymentData, setPaymentData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "Credit Card",
    notes: "",
  });

  // Layout and direction effects
  useEffect(() => {
    const updateDirection = () => {
      document.documentElement.dir = i18next.dir();
    };
    updateDirection();
    i18next.on("languageChanged", updateDirection);
    return () => i18next.off("languageChanged", updateDirection);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (languageCode) => {
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

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

  const handleAddPayment = () => {
    if (!currentOrder || !paymentData.amount) return;

    const updatedOrders = orders.map((order) => {
      if (order.id === currentOrder.id) {
        const newPayment = {
          amount: parseFloat(paymentData.amount),
          date: paymentData.date,
          method: paymentData.method,
          notes: paymentData.notes,
        };

        console.log("the paiiiiii ", newPayment);

        return {
          ...order,
          amountPaid: order.amountPaid + parseFloat(paymentData.amount),
          payments: [...order.payments, newPayment],
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setShowPaymentModal(false);
    setPaymentData({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      method: "Credit Card",
      notes: "",
    });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders
      .map((order) => {
        if (order.id === orderId) {
          let newProgress = order.progress;
          if (newStatus === "inProgress") newProgress = 1;
          if (newStatus === "shipping") newProgress = 2;
          if (newStatus === "completed") {
            newProgress = 3;
            // Move to completed orders with all required properties
            const completedOrder = {
              ...order,
              status: "delivered",
              progress: 3,
              totalPaid: order.amountPaid, // Ensure totalPaid is set
              paymentMethod:
                order.payments.length > 0
                  ? order.payments[0].method
                  : "Unknown", // Set payment method
            };
            setCompletedOrders([...completedOrders, completedOrder]);
            return null; // Remove from current orders
          }
          return { ...order, status: newStatus, progress: newProgress };
        }
        return order;
      })
      .filter(Boolean);

    setOrders(updatedOrders);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Add these to your component state and refs
  const fileInputRef = useRef(null);

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    woodType: "",
    location: "",
    images: [],
    items: [],
    currentItem: "",
  });

  // Image upload handler
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      // Check if it's an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (event) => {
          const imageObj = {
            file: file,
            preview: event.target.result,
            name: file.name,
          };

          setNewPost((prev) => ({
            ...prev,
            images: [...prev.images, imageObj],
          }));
        };

        reader.readAsDataURL(file);
      }
    });

    // Reset the file input
    e.target.value = "";
  };

  // Remove image function
  const removeImage = (index) => {
    setNewPost((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddItem = () => {
    if (newPost.currentItem.trim()) {
      setNewPost((prev) => ({
        ...prev,
        items: [...prev.items, newPost.currentItem.trim()],
        currentItem: "",
      }));
    }
  };

  const handleRemoveItem = (index) => {
    setNewPost((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Update the handleCreatePost function in AdminDashboard.jsx
  const handleCreatePost = async () => {
    // Validate required fields
    if (
      !newPost.title ||
      !newPost.description ||
      !newPost.woodType ||
      newPost.images.length === 0
    ) {
      alert("Please fill all required fields and upload at least one image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", newPost.title);
      formData.append("description", newPost.description);
      formData.append("woodType", newPost.woodType);
      console.log("these the items ", newPost.items)
      formData.append("items", JSON.stringify(newPost.items));

      if (newPost.location) {
        formData.append("location", newPost.location);
      }

      newPost.images.forEach((image) => {
        formData.append("media", image.file);
      });

      const response = await apiFetch(
        "/api/v1/services/posts",
        formData,
        false,
        "POST"
      );

      console.log("the response is that ", response);

      if (response.success) {
        console.log("Post created successfully:", response.data);
        alert("Post created successfully!");

        setNewPost({
          title: "",
          description: "",
          woodType: "",
          location: "",
          images: [],
          items: [],
          currentItem: "",
        });
        setShowCreatePostModal(false);
      } else {
        console.error("Failed to create post:", response.error);
        alert("Failed to create post: " + response.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post");
    }
  };

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      {/* Header */}
      <header
        className={`backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 border-b transition-all duration-300 ${
          darkMode
            ? "bg-gray-900/80 border-gray-700/50"
            : "bg-white/80 border-gray-200/50"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center min-w-0">
          <div className="flex items-center flex-shrink-0">
            <img
              src={darkMode ? WLogo : Blogo}
              alt="the logo"
              className="w-[80px] xs:w-[90px] sm:w-[100px] md:w-[120px] lg:w-[140px] h-auto"
            />
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={toggleLanguageDropdown}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
                }`}
              >
                <Globe size={16} />
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isLanguageDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl border overflow-hidden z-50 ${
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
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1
            className={`text-2xl sm:text-3xl font-bold mb-4 md:mb-0 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("adminDashboard")}
          </h1>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setShowCreatePostModal(true)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
                darkMode
                  ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                  : "bg-yellow-500 hover:bg-yellow-400 text-black"
              }`}
            >
              <Plus size={16} />
              <span className="text-sm sm:text-base">{t("createPost")}</span>
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("waiting")}
            className={`cursor-pointer px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "waiting"
                ? darkMode
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-yellow-600 border-b-2 border-yellow-600"
                : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("waitingOrders")}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`cursor-pointer px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "orders"
                ? darkMode
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-yellow-600 border-b-2 border-yellow-600"
                : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("currentOrders")}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`cursor-pointer px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "completed"
                ? darkMode
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-yellow-600 border-b-2 border-yellow-600"
                : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("completedOrders")}
          </button>
        </div>
        {/* Search and Filter */}
        <div
          className={`p-4 rounded-xl mb-6 ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
                size={18}
              />
              <input
                type="text"
                placeholder={t("searchOrders")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {activeTab === "orders" && (
              <div className="relative">
                <Filter
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                  size={18}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-8 py-2 rounded-lg border appearance-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="all">{t("allStatuses")}</option>
                  <option value="waiting">{t("waiting")}</option>
                  <option value="inProgress">{t("inProgress")}</option>
                  <option value="shipping">{t("shipping")}</option>
                </select>
                <ChevronDown
                  className={`absolute right-3 top-1/2  transform -translate-y-1/2 pointer-events-none ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  size={16}
                />
              </div>
            )}
          </div>
        </div>
        {/* Orders Content */}
        {activeTab === "waiting" ? (
          <div className="space-y-6">
            {waitingOrders.length > 0 ? (
              waitingOrders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-700/50"
                      : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm hover:bg-gray-100/50"
                  }`}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`text-xl font-bold ${
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
                        {order.id} • {order.client}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {t("waiting")}
                    </span>
                  </div>
                  {order.estimatedTotal && !order.clientValidated && (
                    <div className="mt-4">
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("pendingClientApproval")}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div
                className={`rounded-2xl p-12 text-center ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-white/80 border-gray-200/50"
                }`}
              >
                <Clock
                  size={48}
                  className={`mx-auto mb-4 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-xl font-medium mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("noWaitingOrders")}
                </h3>
              </div>
            )}
          </div>
        ) : activeTab === "orders" ? (
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-700/50"
                      : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm hover:bg-gray-100/50"
                  }`}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`text-xl font-bold ${
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
                        {order.id} • {order.client}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "inProgress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status === "inProgress"
                        ? t("inProgress")
                        : t("shipping")}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {order.offer && (
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
                          {(order.amountPaid || 0).toLocaleString() +
                            ` ${t("algerianDinar")}`}
                        </p>
                      </div>
                    )}
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
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {order.status === "inProgress"
                          ? t("inProduction")
                          : t("inShipping")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`rounded-2xl p-12 text-center ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-white/80 border-gray-200/50"
                }`}
              >
                <Package
                  size={48}
                  className={`mx-auto mb-4 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-xl font-medium mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("noOrdersFound")}
                </h3>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-700/50"
                      : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm hover:bg-gray-100/50"
                  }`}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`text-xl font-bold ${
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
                        {order.id} • {order.client}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {t("delivered")}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("completedOn")}
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {new Date(
                        order.completionDetails?.completedAt || order.date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`rounded-2xl p-12 text-center ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-white/80 border-gray-200/50"
                }`}
              >
                <CheckCircle
                  size={48}
                  className={`mx-auto mb-4 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-xl font-medium mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("noCompletedOrders")}
                </h3>
              </div>
            )}
          </div>
        )}
        {/* Create Post Modal */}
        {showCreatePostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("createNewPost")}
                  </h2>
                  <button
                    onClick={() => setShowCreatePostModal(false)}
                    className={`p-2 rounded-full ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("title")}
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder={t("enterTitle")}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("description")}
                    </label>
                    <textarea
                      rows={4}
                      value={newPost.description}
                      onChange={(e) =>
                        setNewPost({ ...newPost, description: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder={t("enterDescription")}
                    ></textarea>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("woodType")}
                    </label>
                    <select
                      value={newPost.woodType}
                      onChange={(e) =>
                        setNewPost({ ...newPost, woodType: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">{t("selectWoodType")}</option>
                      <option value="Oak">{t("oak")}</option>
                      <option value="Pine">{t("pine")}</option>
                      <option value="Walnut">{t("walnut")}</option>
                      <option value="Cherry">{t("cherry")}</option>
                      <option value="Maple">{t("maple")}</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("location")}
                    </label>
                    <input
                      type="text"
                      value={newPost.location}
                      onChange={(e) =>
                        setNewPost({ ...newPost, location: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder={t("enterLocation")}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("items")} (Optional)
                    </label>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={newPost.currentItem}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            currentItem: e.target.value,
                          })
                        }
                        className={`flex-1 px-4 py-2 rounded-l-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder={t("Add item (e.g. table, chair)")}
                      />
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="px-4 py-2 rounded-r-lg bg-yellow-500 hover:bg-yellow-400 text-black"
                      >
                        {t("Add")}
                      </button>
                    </div>

                    {/* Display added items */}
                    {newPost.items.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newPost.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1"
                          >
                            <span className="text-sm">{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="ml-2 text-gray-500 dark:text-gray-400 hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("images")}
                    </label>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                    />

                    {/* Upload area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        darkMode
                          ? "border-gray-600 bg-gray-700/50 hover:bg-gray-700/70"
                          : "border-gray-300 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <Plus
                          size={24}
                          className={`mb-2 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <p
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("clickToUpload")}
                        </p>
                      </div>
                    </div>

                    {/* Image preview */}
                    {newPost.images && newPost.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {newPost.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreatePostModal(false)}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black"
                  >
                    {t("createPost")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Add Payment Modal */}
        {showPaymentModal && currentOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-2xl w-full max-w-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("addPayment")}
                  </h2>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className={`p-2 rounded-full ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("order")}
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {currentOrder.title} ({currentOrder.id})
                    </p>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("amount")}
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
                          setPaymentData({
                            ...paymentData,
                            amount: e.target.value,
                          })
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
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("date")}
                    </label>
                    <input
                      type="date"
                      value={paymentData.date}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          date: e.target.value,
                        })
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
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("paymentMethod")}
                    </label>
                    <select
                      value={paymentData.method}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          method: e.target.value,
                        })
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
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("notes")}
                    </label>
                    <textarea
                      rows={3}
                      value={paymentData.notes}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          notes: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder={t("optionalNotes")}
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className={`px-4 py-2 rounded-lg ${
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
                    className={`px-4 py-2 rounded-lg ${
                      !paymentData.amount
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-400 text-black"
                    }`}
                  >
                    {t("addPayment")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showCompletionForm && currentOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-2xl w-full max-w-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("completeOrder")}
                  </h2>
                  <button
                    onClick={() => setShowCompletionForm(false)}
                    className={`p-2 rounded-full ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("order")}
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {currentOrder.title} ({currentOrder.id})
                    </p>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("articlesUsed")}
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={completionForm.currentElement}
                        onChange={(e) =>
                          setCompletionForm({
                            ...completionForm,
                            currentElement: e.target.value,
                          })
                        }
                        className={`flex-1 px-4 py-2 rounded-l-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder={t("addArticle")}
                      />
                      <button
                        onClick={handleAddElement}
                        className="px-4 py-2 rounded-r-lg bg-yellow-500 hover:bg-yellow-400 text-black"
                      >
                        {t("add")}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {completionForm.elements.map((element, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1"
                        >
                          <span className="text-sm">{element}</span>
                          <button
                            onClick={() => handleRemoveElement(index)}
                            className="ml-2 text-gray-500 dark:text-gray-400 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("completionNotes")}
                    </label>
                    <textarea
                      rows={3}
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
                      placeholder={t("anySpecialNotes")}
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCompletionForm(false)}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={() => {
                      const completedOrder = {
                        ...currentOrder,
                        status: "delivered",
                        progress: 3,
                        totalPaid: currentOrder.amountPaid,
                        paymentMethod:
                          currentOrder.payments.length > 0
                            ? currentOrder.payments[0].method
                            : "Unknown",
                        completionDetails: {
                          elements: completionForm.elements,
                          notes: completionForm.notes,
                          completedAt: new Date().toISOString(),
                        },
                      };

                      setCompletedOrders([...completedOrders, completedOrder]);
                      setOrders(
                        orders.filter((order) => order.id !== currentOrder.id)
                      );
                      setShowCompletionForm(false);
                      setCompletionForm({
                        elements: [],
                        currentElement: "",
                        notes: "",
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                  >
                    {t("completeOrder")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black dark:text-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("orderDetails")}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className={`p-2 rounded-full ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3
                      className={`font-bold mb-4 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("clientInformation")}
                    </h3>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode ? "bg-gray-700 text-amber-50" : "bg-gray-100"
                      }`}
                    >
                      <p className="font-medium">{selectedOrder.client}</p>
                      <p className="text-sm">{selectedOrder.email}</p>
                      <p className="text-sm">{selectedOrder.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3
                      className={`font-bold mb-4 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("orderInformation")}
                    </h3>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode ? "bg-gray-700  text-amber-50" : "bg-gray-100"
                      }`}
                    >
                      <p>
                        <span className="font-medium">ID:</span>{" "}
                        {selectedOrder.id}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {selectedOrder.date}
                      </p>
                      <p>
                        <span className="font-medium">Wood Type:</span>{" "}
                        {selectedOrder.woodType}
                      </p>
                      {selectedOrder.completionDetails && (
                        <p>
                          <span className="font-medium">Completed:</span>{" "}
                          {new Date(
                            selectedOrder.completionDetails.completedAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedOrder.completionDetails && (
                  <div className="mt-6">
                    <h3
                      className={`font-bold mb-4 ${
                        darkMode ? "text-white " : "text-gray-900"
                      }`}
                    >
                      {t("completionDetails")}
                    </h3>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode ? "bg-gray-700  text-amber-50" : "bg-gray-100"
                      }`}
                    >
                      <h4 className="font-medium mb-2">{t("articlesUsed")}:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedOrder.completionDetails.elements.map(
                          (element, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-900 dark:bg-gray-900 rounded-full text-sm"
                            >
                              {element}
                            </span>
                          )
                        )}
                      </div>

                      {selectedOrder.completionDetails.notes && (
                        <>
                          <h4 className="font-medium mt-4 mb-2">
                            {t("notes")}:
                          </h4>
                          <p className="text-sm">
                            {selectedOrder.completionDetails.notes}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3
                    className={`font-bold mb-4 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("paymentHistory")}
                  </h3>
                  <div
                    className={`rounded-lg overflow-hidden border ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    {selectedOrder.payments &&
                      selectedOrder.payments.map((payment, index) => (
                        <div
                          key={index}
                          className={`p-3 border-b ${
                            darkMode
                              ? "border-gray-700 bg-gray-700/50"
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
                                ${payment.amount.toLocaleString() || 0}
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
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
