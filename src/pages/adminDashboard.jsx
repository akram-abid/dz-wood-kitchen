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
import Header from "../components/header";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth("admin");

  // State for orders and loading states
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [waitingOrders, setWaitingOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState({
    completed: false,
    inProgress: false,
    waiting: false,
  });

  // UI state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [creatingPost, setCreatingPost] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Form states
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
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    woodType: "",
    location: "",
    images: [],
    items: [],
    currentItem: "",
  });

  const fileInputRef = useRef(null);

  if (!isAuthenticated && !authLoading) navigate("/login");

  // Fetch completed orders
  useEffect(() => {
    const fetchCompletedOrders = async () => {
      setLoadingOrders((prev) => ({ ...prev, completed: true }));
      try {
        const response = await apiFetch(
          "/api/v1/orders?status=delivered",
          null
        );
        if (response.success) {
          setCompletedOrders(response.data.data);
        } else {
          console.error("Failed to fetch completed orders:", response.error);
        }
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      } finally {
        setLoadingOrders((prev) => ({ ...prev, completed: false }));
      }
    };
    fetchCompletedOrders();
  }, []);

  // Fetch in-progress and shipping orders
  useEffect(() => {
    const fetchInProgressOrders = async () => {
      setLoadingOrders((prev) => ({ ...prev, inProgress: true }));
      try {
        const response = await apiFetch(
          "/api/v1/orders?status=inProgress",
          null
        );
        const response2 = await apiFetch(
          "/api/v1/orders?status=inShipping",
          null
        );

        const combinedOrders = [];
        if (response.success) combinedOrders.push(...response.data.data);
        if (response2.success) combinedOrders.push(...response2.data.data);

        setOrders(combinedOrders);
      } catch (error) {
        console.error("Error fetching in-progress orders:", error);
      } finally {
        setLoadingOrders((prev) => ({ ...prev, inProgress: false }));
      }
    };
    fetchInProgressOrders();
  }, []);

  // Fetch waiting orders
  useEffect(() => {
    const fetchWaitingOrders = async () => {
      setLoadingOrders((prev) => ({ ...prev, waiting: true }));
      try {
        const response = await apiFetch("/api/v1/orders?status=waiting", null);
        if (response.success) {
          setWaitingOrders(response.data.data);
        } else {
          console.error("Failed to fetch waiting orders:", response.error);
        }
      } catch (error) {
        console.error("Error fetching waiting orders:", error);
      } finally {
        setLoadingOrders((prev) => ({ ...prev, waiting: false }));
      }
    };
    fetchWaitingOrders();
  }, []);

  // Layout and direction effects
  useEffect(() => {
    const updateDirection = () => {
      document.documentElement.dir = i18next.dir();
    };
    updateDirection();
    i18next.on("languageChanged", updateDirection);
    return () => i18next.off("languageChanged", updateDirection);
  }, []);

  // Helper functions
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguageDropdown = () =>
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  const handleLanguageChange = (languageCode) => {
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

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

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const response = await apiFetch(
        `/api/v1/orders/${orderToDelete.id}`,
        null,
        false,
        "DELETE"
      );

      if (response.success) {
        if (orderToDelete.status === "waiting") {
          setWaitingOrders(
            waitingOrders.filter((order) => order.id !== orderToDelete.id)
          );
        } else {
          setOrders(orders.filter((order) => order.id !== orderToDelete.id));
        }
        setShowDeleteConfirmation(false);
        setOrderToDelete(null);
      } else {
        console.error("Failed to delete order:", response.error);
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("An error occurred while deleting the order");
    }
  };

  const handleCompleteOrder = (orderId) => {
    setCurrentOrder(orders.find((order) => order.id === orderId));
    setShowCompletionForm(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
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
    e.target.value = "";
  };

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

  const handleCreatePost = async () => {
    if (
      !newPost.title ||
      !newPost.description ||
      !newPost.woodType ||
      newPost.images.length === 0
    ) {
      alert("Please fill all required fields and upload at least one image");
      return;
    }

    setCreatingPost(true);
    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("description", newPost.description);
      formData.append("woodType", newPost.woodType);
      formData.append("items", JSON.stringify(newPost.items));

      if (newPost.location) formData.append("location", newPost.location);
      newPost.images.forEach((image) => formData.append("media", image.file));

      const response = await apiFetch(
        "/api/v1/services/posts",
        formData,
        false,
        "POST"
      );

      if (response.success) {
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
    } finally {
      setCreatingPost(false);
    }
  };

  const handleAddPayment = async () => {
    if (!currentOrder || !paymentData.amount) return;

    try {
      const updatedOrders = orders.map((order) => {
        if (order.id === currentOrder.id) {
          const newPayment = {
            amount: parseFloat(paymentData.amount),
            date: paymentData.date,
            method: paymentData.method,
            notes: paymentData.notes,
          };

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
    } catch (error) {
      console.error("Error adding payment:", error);
    }
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
            const completedOrder = {
              ...order,
              status: "delivered",
              progress: 3,
              totalPaid: order.amountPaid,
              paymentMethod:
                order.payments.length > 0
                  ? order.payments[0].method
                  : "Unknown",
            };
            setCompletedOrders([...completedOrders, completedOrder]);
            return null;
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

  // Loading spinner component
  const Spinner = ({
    size = 24,
    color = darkMode ? "text-yellow-400" : "text-yellow-600",
  }) => (
    <div
      className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${color}`}
      style={{ width: size, height: size }}
    />
  );

  if (authLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-all duration-300 ${
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
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
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
          loadingOrders.waiting ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size={48} />
            </div>
          ) : waitingOrders.length > 0 ? (
            <div className="space-y-6">
              {waitingOrders.map((order) => (
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
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {t("waiting")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrderToDelete(order);
                          setShowDeleteConfirmation(true);
                        }}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
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
              ))}
            </div>
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
          )
        ) : activeTab === "orders" ? (
          loadingOrders.inProgress ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size={48} />
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
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
                    <div className="flex items-center space-x-2">
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrderToDelete(order);
                          setShowDeleteConfirmation(true);
                        }}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
          )
        ) : loadingOrders.completed ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size={48} />
          </div>
        ) : completedOrders.length > 0 ? (
          <div className="space-y-6">
            {completedOrders.map((order) => (
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
            ))}
          </div>
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
                      <option value="Egger">Egger</option>
                      <option value="High-Gloss">High Gloss</option>
                      <option value="MDF">MDF</option>
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
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                      <input
                        type="text"
                        value={newPost.currentItem}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            currentItem: e.target.value,
                          })
                        }
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder={t("Add item (e.g. table, chair)")}
                      />
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black whitespace-nowrap"
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
                    disabled={creatingPost}
                    className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center min-w-[120px]"
                  >
                    {creatingPost ? (
                      <Spinner size={20} color="text-black" />
                    ) : (
                      t("createPost")
                    )}
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

                {/* Payment form fields remain the same */}

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

        {/* Completion Form Modal */}
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

                {/* Completion form fields remain the same */}

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

        {showDeleteConfirmation && (
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
                    {t("confirmDelete")}
                  </h2>
                  <button
                    onClick={() => {
                      setShowDeleteConfirmation(false);
                      setOrderToDelete(null);
                    }}
                    className={`p-2 rounded-full ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p
                  className={`mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("areYouSureDeleteOrder")} "{orderToDelete?.title}"?
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirmation(false);
                      setOrderToDelete(null);
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleDeleteOrder}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    {t("delete")}
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

                {/* Order details content remains the same */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
