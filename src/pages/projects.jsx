import React, { useState, useEffect, useCallback, useRef } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import {
  Globe,
  Calendar,
  Sun,
  Moon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Tag,
  Trash2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import apiFetch from "../utils/api/apiFetch";

// Utility function to ensure array
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [];
};

// State preservation manager
const stateManager = {
  state: {
    scrollPosition: 0,
    kitchens: [],
    filteredKitchens: [],
    selectedWoodType: "all",
    page: 1,
    hasMore: true,
    totalKitchens: 0,
  },

  save(newState) {
    this.state = { ...this.state, ...newState };
    try {
      // Only save to sessionStorage if browser supports it
      if (typeof Storage !== "undefined") {
        sessionStorage.setItem(
          "kitchenGalleryState",
          JSON.stringify(this.state)
        );
      }
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  },

  load() {
    try {
      if (typeof Storage !== "undefined") {
        const saved = sessionStorage.getItem("kitchenGalleryState");
        if (saved) {
          const parsedState = JSON.parse(saved);
          // Ensure arrays are always arrays
          this.state = {
            ...this.state,
            ...parsedState,
            kitchens: ensureArray(parsedState.kitchens),
            filteredKitchens: ensureArray(parsedState.filteredKitchens),
          };
        }
      }
    } catch (error) {
      console.error("Failed to load state:", error);
      // Reset to default state on error
      this.state = {
        scrollPosition: 0,
        kitchens: [],
        filteredKitchens: [],
        selectedWoodType: "all",
        page: 1,
        hasMore: true,
        totalKitchens: 0,
      };
    }
    return this.state;
  },

  clear() {
    this.state = {
      scrollPosition: 0,
      kitchens: [],
      filteredKitchens: [],
      selectedWoodType: "all",
      page: 1,
      hasMore: true,
      totalKitchens: 0,
    };
    try {
      if (typeof Storage !== "undefined") {
        sessionStorage.removeItem("kitchenGalleryState");
      }
    } catch (error) {
      console.error("Failed to clear state:", error);
    }
  },
};

const KitchenGallery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load saved state
  const savedState = stateManager.load();

  // State with proper array initialization
  const [kitchens, setKitchens] = useState(() =>
    ensureArray(savedState.kitchens)
  );
  const [filteredKitchens, setFilteredKitchens] = useState(() =>
    ensureArray(savedState.filteredKitchens)
  );
  const [selectedWoodType, setSelectedWoodType] = useState(
    savedState.selectedWoodType || "all"
  );
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(
    savedState.kitchens.length === 0
  );
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [page, setPage] = useState(savedState.page || 1);
  const [hasMore, setHasMore] = useState(
    savedState.hasMore !== undefined ? savedState.hasMore : true
  );
  const [totalKitchens, setTotalKitchens] = useState(
    savedState.totalKitchens || 0
  );
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState(null);

  const loaderRef = useRef(null);
  const isRestoringScroll = useRef(false);
  const hasRestored = useRef(false);

  const isRTL = currentLanguage === "ar";

  const { t } = useTranslation();

  const fetchKitchens = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch(
        `/api/v1/services/posts?page=${pageNum}&limit=15`
      );

      
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch kitchens");
      }
      
      const apiData = response.data || {};
      console.log("the response is ", apiData.data.posts);
      const newKitchens = ensureArray(apiData.data.posts || apiData.posts || []);

      const currentPageItems = newKitchens.length;
      const hasMorePages = currentPageItems === 15; 

      if (append) {
        setKitchens((prev) => {
          const prevArray = ensureArray(prev);
          const updated = [...prevArray, ...newKitchens];
          saveCurrentState({ kitchens: updated });
          return updated;
        });
      } else {
        setKitchens(newKitchens);
        saveCurrentState({ kitchens: newKitchens });
      }

      setPage(pageNum);
      setHasMore(hasMorePages);
      setTotalKitchens(apiData.total || newKitchens.length);
    } catch (error) {
      console.error("Error fetching kitchens:", error);
      setError(error.message || "Failed to load kitchens. Please try again.");

      // Ensure state remains consistent on error
      if (!append) {
        setKitchens([]);
        setFilteredKitchens([]);
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  // Load more kitchens for infinite scroll
  const loadMoreKitchens = useCallback(() => {
    if (loading || !hasMore) return;
    fetchKitchens(page + 1, true);
  }, [loading, hasMore, page, fetchKitchens]);

  // Save current state to manager
  const saveCurrentState = useCallback(
    (additionalState = {}) => {
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;

      stateManager.save({
        scrollPosition,
        kitchens: ensureArray(kitchens),
        filteredKitchens: ensureArray(filteredKitchens),
        selectedWoodType,
        page,
        hasMore,
        totalKitchens,
        ...additionalState,
      });
    },
    [kitchens, filteredKitchens, selectedWoodType, page, hasMore, totalKitchens]
  );

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    if (hasRestored.current) return;

    const savedScrollPosition = savedState.scrollPosition;
    if (savedScrollPosition > 0) {
      isRestoringScroll.current = true;

      setTimeout(() => {
        window.scrollTo({
          top: savedScrollPosition,
          behavior: "auto",
        });

        setTimeout(() => {
          isRestoringScroll.current = false;
          hasRestored.current = true;
        }, 100);
      }, 100);
    } else {
      hasRestored.current = true;
    }
  }, [savedState.scrollPosition]);

  // Delete kitchen function
  const handleDeleteKitchen = async (kitchenId) => {
    if (
      !window.confirm(
        t("confirmDeleteKitchen") ||
          "Are you sure you want to delete this kitchen?"
      )
    ) {
      return;
    }

    setDeleteLoading(kitchenId);

    try {
      const response = await apiFetch(`/api/v1/posts/${kitchenId}`, {
        _method: "DELETE",
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to delete kitchen");
      }

      // Remove from local state
      const kitchensArray = ensureArray(kitchens);
      const filteredArray = ensureArray(filteredKitchens);

      const updatedKitchens = kitchensArray.filter(
        (kitchen) => kitchen.id !== kitchenId
      );
      const updatedFilteredKitchens = filteredArray.filter(
        (kitchen) => kitchen.id !== kitchenId
      );

      setKitchens(updatedKitchens);
      setFilteredKitchens(updatedFilteredKitchens);

      // Update saved state
      saveCurrentState({
        kitchens: updatedKitchens,
        filteredKitchens: updatedFilteredKitchens,
      });

      console.log(`Kitchen ${kitchenId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting kitchen:", error);
      alert(
        t("deleteKitchenError") || "Failed to delete kitchen. Please try again."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // Check admin status
  // useEffect(() => {
  //   const checkAdminStatus = async () => {
  //     try {
  //       const response = await apiFetch("/api/user/role");
  //       if (response.success) {
  //         setIsAdmin(response.data?.role === "admin");
  //       }
  //     } catch (error) {
  //       console.error("Error checking admin status:", error);
  //       setIsAdmin(false);
  //     }
  //   };

  //   checkAdminStatus();
  // }, []);

  // Initial data load
  useEffect(() => {
    const savedKitchens = ensureArray(savedState.kitchens);
    if (savedKitchens.length === 0) {
      fetchKitchens(1, false);
    } else {
      // Data exists, restore scroll position
      setTimeout(restoreScrollPosition, 50);
    }
  }, []);

  // Save scroll position periodically
  useEffect(() => {
    const handleScroll = () => {
      if (!isRestoringScroll.current && ensureArray(kitchens).length > 0) {
        saveCurrentState();
      }
    };

    let throttleTimer;
    const throttledScroll = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleScroll();
        throttleTimer = null;
      }, 150);
    };

    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [kitchens, saveCurrentState]);

  // Filter kitchens and save state
  useEffect(() => {
    const kitchensArray = ensureArray(kitchens);
    let filtered;

    if (selectedWoodType === "all") {
      filtered = kitchensArray;
    } else {
      filtered = kitchensArray.filter(
        (kitchen) =>
          kitchen &&
          (kitchen.woodType === selectedWoodType ||
            kitchen.category === selectedWoodType ||
            kitchen.type === selectedWoodType)
      );
    }

    setFilteredKitchens(filtered);
    saveCurrentState({ filteredKitchens: filtered });
  }, [selectedWoodType, kitchens, saveCurrentState]);

  // Handle kitchen navigation with state preservation
  const handleKitchenClick = (kitchenId) => {
    // Save current state before navigation
    saveCurrentState();
    navigate(`/gallery/${kitchenId}`);
  };

  // RTL direction handling
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMoreKitchens();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreKitchens, loading, hasMore]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (languageCode) => {
    console.log("Selected language:", languageCode);
    i18next.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  // Extract unique wood types from actual data
  const getUniqueWoodTypes = useCallback(() => {
    try {
      const kitchenArray = ensureArray(kitchens);

      // Use Set to ensure uniqueness
      const uniqueTypes = new Set();

      kitchenArray.forEach((kitchen) => {
        if (kitchen && typeof kitchen === "object") {
          const woodType = kitchen.woodType || kitchen.category || kitchen.type;
          if (typeof woodType === "string" && woodType.trim()) {
            uniqueTypes.add(woodType.trim());
          }
        }
      });

      // Convert Set to array and sort alphabetically
      const sortedTypes = Array.from(uniqueTypes).sort();

      return [
        { filter: "all", tag: t("all") || "All" },
        ...sortedTypes.map((type) => ({ filter: type, tag: type })),
      ];
    } catch (error) {
      console.error("Error getting wood types:", error);
      return [{ filter: "all", tag: t("all") || "All" }];
    }
  }, [kitchens, t]);

  const woodTypes = getUniqueWoodTypes();

  const KitchenCarousel = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Handle case where images might be a string or array
    const imageArray = React.useMemo(() => {
      if (Array.isArray(images)) return images;
      if (typeof images === "string" && images.trim()) return [images];
      return [];
    }, [images]);

    const nextSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
      );
    };

    const prevSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1
      );
    };

    if (imageArray.length === 0) {
      return (
        <div className="relative h-64 w-full overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">
            No images available
          </span>
        </div>
      );
    }

    return (
      <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
        <div className="relative h-full w-full">
          {imageArray.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentIndex
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={`${import.meta.env.VITE_REACT_APP_ORIGIN}/${image}`}
                alt={`Kitchen view ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/400x300?text=Kitchen+${
                    index + 1
                  }`;
                }}
              />
            </div>
          ))}
        </div>

        {imageArray.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
            >
              <ChevronLeft size={20} className="cursor-pointer" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
            >
              <ChevronRight size={20} className="cursor-pointer"   />
            </button>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {imageArray.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-yellow-400 scale-125"
                      : "bg-gray-300 bg-opacity-50 dark:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Loading component
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading kitchens...
          </p>
        </div>
      </div>
    );
  }

  // Error component
  if (error && ensureArray(kitchens).length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchKitchens(1, false)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Ensure filteredKitchens is always an array before rendering
  const safeFilteredKitchens = ensureArray(filteredKitchens);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 w-full">
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
            {/* Admin indicator */}
            {isAdmin && (
              <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">
                Admin
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

      {/* Hero Section */}
      <div className="bg-gray-700 text-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              {t("ourKitchen") || "Our Kitchen"}
              <span className="text-yellow-400">{` ${
                t("masterpieces") || "Masterpieces"
              }`}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t("ourWorkDescription") ||
                "Discover our collection of stunning custom kitchens crafted with precision and passion."}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-50 dark:bg-gray-900 pt-8 py-4 sticky top-16 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 w-full md:w-auto">
              <h3 className="text-lg font-semibold text-black dark:text-white whitespace-nowrap">
                {t("filterByWoodType") || "Filter by Type"}
              </h3>
              <select
                value={selectedWoodType}
                onChange={(e) => setSelectedWoodType(e.target.value)}
                className="px-4 py-2 border-2 border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-800 text-black dark:text-white w-full sm:w-auto min-w-[200px]"
              >
                {woodTypes.map(({ filter, tag }) => (
                  <option key={filter} value={filter}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-black dark:text-white self-start md:self-auto">
              <span className="text-lg font-semibold whitespace-nowrap">
                {safeFilteredKitchens.length}{" "}
                {t("kitchensDisplayed") || "kitchens displayed"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-gray-700 dark:bg-gray-900 w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {safeFilteredKitchens.length === 0 && !loading && !initialLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {t("noKitchensFound") || "No kitchens found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {safeFilteredKitchens.map((kitchen) => (
                <div
                  key={kitchen.id}
                  className="bg-white dark:bg-gray-800 border-yellow-400 rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-yellow-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl will-change-transform w-full relative"
                  onClick={() => handleKitchenClick(kitchen.id)}
                >
                  {/* Admin delete button */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteKitchen(kitchen.id);
                        }}
                        disabled={deleteLoading === kitchen.id}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:scale-100"
                        title={t("deleteKitchen") || "Delete Kitchen"}
                      >
                        {deleteLoading === kitchen.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  )}

                  <KitchenCarousel
                    images={kitchen.imageUrls}
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                      {kitchen.title || kitchen.name || `Kitchen ${kitchen.id}`}
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {kitchen.description ||
                        kitchen.content ||
                        "Beautiful custom kitchen design"}
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKitchenClick(kitchen.id);
                        }}
                        className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        {t("viewDetails") || "View Details"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Infinite scroll loader */}
          <div ref={loaderRef} className="py-8 flex justify-center w-full">
            {loading && (
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            )}
            {!hasMore && safeFilteredKitchens.length > 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                {t("noMoreKitchens") || "No more kitchens to load"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-black dark:bg-gray-800 text-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("readyForYourDreamKitchen") || "Ready for Your Dream Kitchen?"}
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("customKitchenDescription") ||
              "Let us create a custom kitchen that perfectly fits your style and needs."}
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            {t("startYourProject") || "Start Your Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenGallery;
