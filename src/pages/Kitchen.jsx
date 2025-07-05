import React, { useState, useEffect, useRef } from "react";
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
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import i18next from "i18next";
import apiFetch from "../utils/api/apiFetch";
import { useAuth } from "../utils/protectedRootesVerf";
import Header from "../components/header";

const KitchenDetails = () => {
  const { kitchenId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated } = useAuth("admin");
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Store original post data for canceling edits
  const [originalPost, setOriginalPost] = useState(null);

  // Post data state
  const [post, setPost] = useState({
    title: "",
    description: "",
    woodType: "",
    location: "",
    images: [],
    items: [],
    currentItem: "",
  });

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch(`/api/v1/services/posts/${kitchenId}`);
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
          setPost(formattedPost);
          setOriginalPost(formattedPost); // Store original data
        } else {
          throw new Error(response.error || "Failed to fetch post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
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
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original post data without fetching
    if (originalPost) {
      setPost({ ...originalPost });
    }
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      isExisting: false,
    }));

    setPost((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageFiles],
    }));

    // Reset the file input
    e.target.value = "";
  };

  // Remove image function
  const removeImage = (index) => {
    setPost((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddItem = () => {
    if (post.currentItem.trim()) {
      setPost((prev) => ({
        ...prev,
        items: [...prev.items, post.currentItem.trim()],
        currentItem: "",
      }));
    }
  };

  const handleRemoveItem = (index) => {
    setPost((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (field, value) => {
    setPost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdatePost = async () => {
    // Validate required fields
    if (
      !post.title ||
      !post.description ||
      !post.woodType ||
      post.images.length === 0
    ) {
      alert("Please fill all required fields and keep at least one image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description);
      formData.append("woodType", post.woodType);
      formData.append("items", JSON.stringify(post.items));

      if (post.location) {
        formData.append("location", post.location);
      }

      // Add new images (files)
      post.images.forEach((image) => {
        if (!image.isExisting) {
          formData.append("media", image.file);
        }
      });

      // Send PUT request for update
      const response = await apiFetch(
        `/api/v1/services/posts/${kitchenId}`,
        formData,
        false,
        "PATCH"
      );

      if (response.success) {
        alert("Post updated successfully!");
        setIsEditing(false);
        // Update both the current post and original post with the new data
        const updatedPost = response.data.data;
        const formattedUpdatedPost = {
          title: updatedPost.title,
          description: updatedPost.description,
          woodType: updatedPost.woodType,
          location: updatedPost.location,
          images: updatedPost.imageUrls.map((url) => ({
            url,
            isExisting: true,
          })),
          items: updatedPost.items || [],
          currentItem: "",
        };
        setPost(formattedUpdatedPost);
        setOriginalPost(formattedUpdatedPost); // Update original post too
      } else {
        console.error("Failed to update post:", response.error);
        alert("Failed to update post: " + response.error);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post");
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  // Only show loading spinner on initial load, not during editing
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLanguageChange={handleLanguageChange}
        isLanguageDropdownOpen={isLanguageDropdownOpen}
        toggleLanguageDropdown={toggleLanguageDropdown}
      />

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
            {/* Image Gallery */}
            <div className="relative rounded-xl overflow-hidden shadow-lg h-full min-h-[300px] sm:min-h-[400px] lg:min-h-full">
              {isEditing && (
                <div className="absolute top-4 right-4 z-10">
                  <label className="flex items-center space-x-2 bg-yellow-500 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-yellow-600 transition-colors">
                    <Upload size={16} />
                    <span className="text-sm">{t("uploadImages")}</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div className="relative h-full w-full">
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                      index === currentImageIndex
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={
                        image.isExisting
                          ? `${import.meta.env.VITE_REACT_APP_ORIGIN}${
                              image.url
                            }`
                          : image.preview
                      }
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    )}
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
                {post.images.map((_, index) => (
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

            {/* Details Section */}
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 lg:overflow-y-auto lg:h-full">
              {isEditing ? (
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3 sm:mb-4 w-full bg-transparent border-b-2 border-yellow-500 focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3 sm:mb-4">
                  {post.title}
                </h1>
              )}

              {isEditing ? (
                <textarea
                  value={post.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base w-full h-24 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-500 resize-none"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                  {post.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <EditableDetailItem
                  icon={<MapPin className="text-yellow-500" />}
                  label={t("location")}
                  value={post.location}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("location", value)}
                />
                <EditableDetailItem
                  icon={<Tag className="text-yellow-500" />}
                  label={t("woodType")}
                  value={post.woodType}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("woodType", value)}
                />
              </div>

              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3 sm:mb-4">
                  {t("elements")}
                </h3>
                <div className="space-y-2">
                  {post.items.map((item, index) => (
                    <div key={index} className="flex items-center">
                      {isEditing ? (
                        <div className="flex items-center w-full space-x-2">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...post.items];
                              newItems[index] = e.target.value;
                              setPost((prev) => ({ ...prev, items: newItems }));
                            }}
                            className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base focus:outline-none focus:border-yellow-500"
                          />
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mx-2 flex-shrink-0"></span>
                          {item}
                        </div>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="text"
                        value={post.currentItem}
                        onChange={(e) =>
                          handleInputChange("currentItem", e.target.value)
                        }
                        placeholder={t("Add new item")}
                        className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base focus:outline-none focus:border-yellow-500"
                      />
                      <button
                        onClick={handleAddItem}
                        className="text-yellow-500 hover:text-yellow-600 p-1"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Similar Button - Only shown when not in edit mode */}
              {!isEditing && (
                <button
                  onClick={() => {
                    navigate("/order", {
                      state: {
                        kitchenTemplate: { ...post },
                        source: "gallery",
                        originalKitchenId: kitchenId,
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