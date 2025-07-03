import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  MapPin,
  Clock,
  Tag,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Edit3,
  Save,
  X,
  Upload,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import i18next from "i18next";
import apiFetch from "../utils/api/apiFetch";

const KitchenDetails = () => {
  const { kitchenId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [kitchen, setKitchen] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedKitchen, setEditedKitchen] = useState(null);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchKitchen = async () => {
      try {
        const response = await apiFetch(`/api/v1/services/posts/${kitchenId}`);
        if (!response.success) {
          throw new Error("Failed to fetch kitchen data");
        }
        console.log("Kitchen data fetched successfully:", response.data);
        setKitchen(response.data.data);
      } catch (error) {
        console.log("we have encountred an error", error);
      }
    };

    setKitchen(kitchen);
    setEditedKitchen(kitchen);
    fetchKitchen();
  }, [kitchenId]);

  // Layout and direction effects
  useEffect(() => {
    const updateDirection = () => {
      document.documentElement.dir = i18next.dir();
    };
    updateDirection();
    i18next.on("languageChanged", updateDirection);
    return () => i18next.off("languageChanged", updateDirection);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguageDropdown = () =>
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const handleLanguageChange = (languageCode) => {
    console.log("Selected language:", languageCode);
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === kitchen?.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? kitchen?.imageUrls.length - 1 : prev - 1
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedKitchen({ ...kitchen });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedKitchen({ ...kitchen });
    setNewImages([]);
  };

  const handleSave = async () => {
    try {
      // Prepare form data for API call
      const formData = new FormData();
      formData.append("title", editedKitchen.title);
      formData.append("description", editedKitchen.description);
      formData.append("location", editedKitchen.location);
      formData.append("client", editedKitchen.client);
      formData.append("woodType", editedKitchen.woodType);
      formData.append("completedDate", editedKitchen.completedDate);
      formData.append("elements", JSON.stringify(editedKitchen.elements));

      // Add new images if any
      newImages.forEach((image, index) => {
        formData.append(`images`, image);
      });

      // Replace with your actual API call
      const response = await fetch(`/api/kitchens/${kitchenId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const updatedKitchen = await response.json();
        setKitchen(updatedKitchen);
        setIsEditing(false);
        setNewImages([]);
      } else {
        console.error("Failed to update kitchen");
        setKitchen(null);
      }
    } catch (error) {
      console.error("Error updating kitchen:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedKitchen((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleElementChange = (index, value) => {
    const newElements = [...editedKitchen.elements];
    newElements[index] = value;
    setEditedKitchen((prev) => ({
      ...prev,
      elements: newElements,
    }));
  };

  const addElement = () => {
    setEditedKitchen((prev) => ({
      ...prev,
      elements: [...prev.elements, ""],
    }));
  };

  const removeElement = (index) => {
    const newElements = editedKitchen.elements.filter((_, i) => i !== index);
    setEditedKitchen((prev) => ({
      ...prev,
      elements: newElements,
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewImages(files);

    // Preview new images
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setEditedKitchen((prev) => ({
      ...prev,
      images: imageUrls,
    }));
    setCurrentImageIndex(0);
  };

  if (!kitchen) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  const displayKitchen = isEditing ? editedKitchen : kitchen;

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md py-2 sm:py-3 md:py-4 px-3 sm:px-6 md:px-8 lg:px-14 sticky top-0 z-50">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img
              src={darkMode ? WLogo : Blogo}
              alt="the logo"
              className="w-[80px] xs:w-[90px] sm:w-[100px] md:w-[120px] lg:w-[140px] h-auto"
            />
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {isAdmin && !isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 md:p-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors shadow-md hover:shadow-lg"
              >
                <Edit3 size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm">{t("edit")}</span>
              </button>
            )}

            {isAdmin && isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-1 p-1.5 sm:p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  <Save size={16} className="sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-1 p-1.5 sm:p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            )}

            <div className="relative">
              <button
                onClick={toggleLanguageDropdown}
                className={`flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 md:p-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                  darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-50 text-gray-900"
                } hover:text-yellow-500`}
              >
                <Globe size={16} className="sm:w-5 sm:h-5" />
                <ChevronDown
                  size={14}
                  className={`sm:w-4 sm:h-4 transition-transform duration-200 ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`absolute right-0 mt-2 w-32 sm:w-36 md:w-40 transition-all duration-200 z-10 ${
                  isLanguageDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div
                  className={`rounded-lg shadow-xl border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {[
                    { code: "en", name: "English", flag: "🇺🇸" },
                    { code: "ar", name: "العربية", flag: "🇸🇦" },
                  ].map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-left transition-colors duration-200 ${
                        darkMode
                          ? "hover:bg-gray-700 text-white"
                          : "hover:bg-gray-50 text-gray-900"
                      } hover:text-yellow-500 first:rounded-t-lg last:rounded-b-lg`}
                    >
                      <span className="text-sm sm:text-base md:text-lg">
                        {language.flag}
                      </span>
                      <span className="font-medium text-xs sm:text-sm md:text-base truncate">
                        {language.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
            >
              {darkMode ? (
                <Moon size={16} className="sm:w-5 sm:h-5" />
              ) : (
                <Sun size={16} className="sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="w-full max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 mb-4 sm:mb-6 transition-colors"
          >
            {i18n.dir() === "rtl" ? (
              <>
                <ChevronRight className="ml-1" />
                {t("backToGallery")}
              </>
            ) : (
              <>
                <ChevronLeft className="mr-1" />
                {t("backToGallery")}
              </>
            )}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 lg:h-[calc(100vh-180px)]">
            {/* Image Gallery - Full height on desktop */}
            <div className="relative rounded-xl overflow-hidden shadow-lg h-full min-h-[300px] sm:min-h-[400px] lg:min-h-full">
              {isEditing && (
                <div className="absolute top-4 right-4 z-10">
                  <label className="flex items-center space-x-2 bg-yellow-500 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-yellow-600 transition-colors">
                    <Upload size={16} />
                    <span className="text-sm">{t("uploadImages")}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div className="relative h-full w-full">
                {displayKitchen.imageUrls.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                      index === currentImageIndex
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_ORIGIN}${image}`}
                      alt={displayKitchen.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={prevImage}
                className="cursor-pointer absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 dark:bg-[#ffffff52] bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextImage}
                className="cursor-pointer absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 dark:bg-[#ffffff52] bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-2">
                {displayKitchen.imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-yellow-400 scale-125"
                        : "bg-gray-300 bg-opacity-50 dark:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Details Section - Scrollable on desktop */}
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 lg:overflow-y-auto lg:h-full">
              {isEditing ? (
                <input
                  type="text"
                  value={editedKitchen.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3 sm:mb-4 w-full bg-transparent border-b-2 border-yellow-500 focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3 sm:mb-4">
                  {displayKitchen.title}
                </h1>
              )}

              {isEditing ? (
                <textarea
                  value={editedKitchen.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base w-full h-24 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-500 resize-none"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                  {displayKitchen.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <EditableDetailItem
                  icon={<MapPin className="text-yellow-500" />}
                  label={t("location")}
                  value={displayKitchen.location}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("location", value)}
                />
                <EditableDetailItem
                  icon={<Calendar className="text-yellow-500" />}
                  label={t("completedDate")}
                  value={displayKitchen.createdAt.substring(0, 10)}
                  isEditing={isEditing}
                  type="date"
                  onChange={(value) =>
                    handleInputChange("completedDate", value)
                  }
                />
                <EditableDetailItem
                  icon={<Tag className="text-yellow-500" />}
                  label={t("woodType")}
                  value={displayKitchen.woodType}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("woodType", value)}
                />
              </div>

              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3 sm:mb-4">
                  {t("elements")}
                </h3>
                <div className="space-y-2">
                  {displayKitchen.items.map((element, index) => (
                    <div key={index} className="flex items-center">
                      {isEditing ? (
                        <div className="flex items-center w-full space-x-2">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></span>
                          <input
                            type="text"
                            value={element}
                            onChange={(e) =>
                              handleElementChange(index, e.target.value)
                            }
                            className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base focus:outline-none focus:border-yellow-500"
                          />
                          <button
                            onClick={() => removeElement(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mx-2 flex-shrink-0"></span>
                          {element}
                        </div>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={addElement}
                      className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-600 mt-2"
                    >
                      <Plus size={16} />
                      <span className="text-sm">{t("addElement")}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Order Similar Button - Only shown when not in edit mode */}
              {!isEditing && (
                <button
                  onClick={() => {
                    if (!displayKitchen) {
                      console.error("Cannot proceed - kitchen data is missing");
                      return;
                    }

                    console.log("Creating order from kitchen:", displayKitchen);

                    navigate("/order", {
                      replace: true,
                      state: {
                        kitchenTemplate: { ...displayKitchen }, // Spread to avoid reference issues
                        source: "gallery",
                        originalKitchenId: kitchenId,
                        timestamp: new Date().toISOString(), // Useful for debugging
                      },
                    });
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mt-4"
                >
                  <ShoppingCart size={18} />
                  <span>{t("orderSimilar")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const EditableDetailItem = ({
  icon,
  label,
  value,
  isEditing,
  onChange,
  type = "text",
}) => (
  <div className="flex items-center space-x-2">
    <span className="mr-2 sm:mr-3 flex-shrink-0">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-medium text-black dark:text-white text-sm sm:text-base w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-yellow-500"
        />
      ) : (
        <p className="font-medium text-black dark:text-white text-sm sm:text-base truncate">
          {value}
        </p>
      )}
    </div>
  </div>
);

export default KitchenDetails;
