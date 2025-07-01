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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import apiFetch from "../utils/api/apiFetch";

const KitchenGallery = () => {
  const navigate = useNavigate();
  const [kitchens, setKitchens] = useState([]);
  const [filteredKitchens, setFilteredKitchens] = useState([]);
  const [selectedWoodType, setSelectedWoodType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const loaderRef = useRef(null);

  // Check if current language is RTL
  const isRTL = currentLanguage === "ar";

  // Translation function
  const { t } = useTranslation();

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch('/api/user/role');
        const data = await response.json();
        setIsAdmin(data.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(true);
      }
    };

    checkAdminStatus();
  }, []);

  // Delete kitchen function - you can implement the actual API call here
  const handleDeleteKitchen = async (kitchenId) => {
    if (!window.confirm(t('confirmDeleteKitchen') || 'Are you sure you want to delete this kitchen?')) {
      return;
    }

    setDeleteLoading(kitchenId);
    
    try {
      // TODO: Implement your actual delete API call here
      // const response = await fetch(`/api/kitchens/${kitchenId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete kitchen');
      // }

      // For now, just remove from local state (replace with actual API call)
      setKitchens(prev => prev.filter(kitchen => kitchen.id !== kitchenId));
      setFilteredKitchens(prev => prev.filter(kitchen => kitchen.id !== kitchenId));
      
      // You can add a success notification here
      console.log(`Kitchen ${kitchenId} deleted successfully`);
      
    } catch (error) {
      console.error('Error deleting kitchen:', error);
      // You can add an error notification here
      alert(t('deleteKitchenError') || 'Failed to delete kitchen. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Fake data generator
  const generateFakeKitchens = (count) => {
    const woodTypes = [
      "Oak",
      "Pine",
      "Walnut",
      "Cherry",
      "Reclaimed Oak",
      "Maple",
    ];
    const styles = [
      "Modern",
      "Rustic",
      "Contemporary",
      "Traditional",
      "Industrial",
      "Coastal",
    ];
    const locations = [
      "Manhattan, NY",
      "Brooklyn, NY",
      "Queens, NY",
      "Bronx, NY",
      "Staten Island, NY",
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      title: `${styles[i % styles.length]} ${
        woodTypes[i % woodTypes.length]
      } Kitchen`,
      images: [
        `https://picsum.photos/400/300?random=${Date.now() + i + 1}`,
        `https://picsum.photos/400/300?random=${Date.now() + i + 2}`,
        `https://picsum.photos/400/300?random=${Date.now() + i + 3}`,
        `https://picsum.photos/400/300?random=${Date.now() + i + 4}`,
      ],
      description: `A beautiful ${styles[
        i % styles.length
      ].toLowerCase()} kitchen featuring ${woodTypes[
        i % woodTypes.length
      ].toLowerCase()} cabinetry. Custom designed for modern living with premium appliances.`,
      location: locations[i % locations.length],
      client: `Client ${i + 1}`,
      duration: `${6 + (i % 6)} weeks`,
      woodType: woodTypes[i % woodTypes.length],
      completedDate: new Date(Date.now() - i * 86400000)
        .toISOString()
        .split("T")[0],
      featured: i % 3 === 0,
    }));
  };

  useEffect(() => { }, [])


  // Load more kitchens for infinite scroll
  const loadMoreKitchens = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const newKitchens = generateFakeKitchens(6);
      setKitchens((prev) => [...prev, ...newKitchens]);
      setLoading(false);
      setPage((prev) => prev + 1);
    }, 1000);
  }, []);

  // Initial load
  useEffect(() => {
    loadMoreKitchens();
  }, [loadMoreKitchens]);

  // Filter kitchens
  useEffect(() => {
    if (selectedWoodType === "all") {
      setFilteredKitchens(kitchens);
    } else {
      setFilteredKitchens(
        kitchens.filter((kitchen) => kitchen.woodType === selectedWoodType)
      );
    }
  }, [selectedWoodType, kitchens]);

  // RTL direction handling
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
  }, [loadMoreKitchens]);

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
    setIsLanguageDropdownOpen(false);
  };

  const woodTypes = [
    { filter: "all", tag: t("all") },
    { filter: "Oak", tag: t("oak") },
    { filter: "Pine", tag: t("pine") },
    { filter: "Walnut", tag: t("walnut") },
    { filter: "Cherry", tag: t("cherry") },
    { filter: "Reclaimed Oak", tag: t("reclaimedOak") },
    { filter: "Maple", tag: t("maple") },
  ];

  const KitchenCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };

    const prevSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };

    return (
      <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
        <div className="relative h-full w-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentIndex
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
              style={{
                transitionProperty: "opacity",
                willChange: "opacity",
              }}
            >
              <img
                src={image}
                alt={`Kitchen view ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Carousel Navigation - Fixed for RTL */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
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
      </div>
    );
  };

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
      <div className="bg-black text-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              {t("ourKitchen")}
              <span className="text-yellow-400">{` ${t("masterpieces")}`}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t("ourWorkDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section - Proper RTL handling */}
      <div className="bg-gray-50 dark:bg-gray-900 pt-8 py-4 sticky top-16 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 w-full md:w-auto">
              <h3 className="text-lg font-semibold text-black dark:text-white whitespace-nowrap">
                {t("filterByWoodType")}
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
                {filteredKitchens.length} {t("kitchensDisplayed")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredKitchens.map((kitchen) => (
              <div
                key={kitchen.id}
                className="bg-white dark:bg-gray-900 border-yellow-400 rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-yellow-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl will-change-transform w-full"
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
                      title={t('deleteKitchen') || 'Delete Kitchen'}
                    >
                      {deleteLoading === kitchen.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                )}

                <KitchenCarousel images={kitchen.images} />

                <div className="p-6">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                    {kitchen.title}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {kitchen.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/gallery/${kitchen.id}`)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      {t("viewDetails")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite scroll loader */}
          <div ref={loaderRef} className="py-8 flex justify-center w-full">
            {loading && (
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-black dark:bg-gray-800 text-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("readyForYourDreamKitchen")}
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("customKitchenDescription")}
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            {t("startYourProject")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenGallery;