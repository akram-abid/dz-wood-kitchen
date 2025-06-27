import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Globe,
  Calendar,
  Sun,
  Moon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const KitchenGallery = () => {
  const { t, i18n } = useTranslation();
  const [kitchens, setKitchens] = useState([]);
  const [filteredKitchens, setFilteredKitchens] = useState([]);
  const [selectedWoodType, setSelectedWoodType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  // Check if current language is RTL
  const isRTL = i18next.language === "ar";

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
        `https://source.unsplash.com/random/400x300/?kitchen,${i + 1}`,
        `https://source.unsplash.com/random/400x300/?kitchen,${i + 2}`,
        `https://source.unsplash.com/random/400x300/?kitchen,${i + 3}`,
        `https://source.unsplash.com/random/400x300/?kitchen,${i + 4}`,
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

  // FIXED: Better RTL direction handling
  useEffect(() => {
    const updateDirection = () => {
      const isRTL = i18next.dir() === "rtl" || i18next.language === "ar";
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = i18next.language;
    };

    updateDirection();
    i18next.on("languageChanged", updateDirection);

    return () => {
      i18next.off("languageChanged", updateDirection);
    };
  }, []);

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
    i18n.changeLanguage(languageCode);
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

        {/* FIXED: RTL-aware carousel buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isRTL ? nextSlide() : prevSlide();
          }}
          className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all`}
        >
          <ChevronLeft size={20} className={`cursor-pointer ${isRTL ? 'rotate-180' : ''}`} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            isRTL ? prevSlide() : nextSlide();
          }}
          className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all`}
        >
          <ChevronRight size={20} className={`cursor-pointer ${isRTL ? 'rotate-180' : ''}`} />
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
      <header className="bg-white dark:bg-gray-900 shadow-md py-2 sm:py-3 md:py-4 px-3 sm:px-6 md:px-8 lg:px-14 sticky top-0 z-50 w-full">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img
              src={darkMode ? WLogo : Blogo}
              alt="the logo"
              className="w-[80px] xs:w-[90px] sm:w-[100px] md:w-[120px] lg:w-[140px] h-auto"
            />
          </div>

          {/* FIXED: RTL-aware header controls */}
          <div className={`flex items-center gap-2 sm:gap-3 md:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative">
              <button
                onClick={toggleLanguageDropdown}
                className={`flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 md:p-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                  darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-50 text-gray-900"
                } hover:text-yellow-500 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Globe size={16} className="sm:w-5 sm:h-5" />
                <ChevronDown
                  size={14}
                  className={`sm:w-4 sm:h-4 transition-transform duration-200 ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {/* FIXED: RTL-aware dropdown position */}
              <div
                className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-32 sm:w-36 md:w-40 transition-all duration-200 z-10 ${
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
                      className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 transition-colors duration-200 ${
                        darkMode
                          ? "hover:bg-gray-700 text-white"
                          : "hover:bg-gray-50 text-gray-900"
                      } hover:text-yellow-500 first:rounded-t-lg last:rounded-b-lg ${
                        isRTL ? 'flex-row-reverse text-right' : 'text-left'
                      }`}
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

      {/* FIXED: Filter Section with proper RTL support */}
      <div className="bg-gray-50 dark:bg-gray-900 pt-8 py-4 sticky top-16 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 w-full md:w-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
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

      {/* FIXED: Gallery Grid with proper container */}
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredKitchens.map((kitchen) => (
              <div
                key={kitchen.id}
                className="bg-white dark:bg-gray-900 border-yellow-400 rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-yellow-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl will-change-transform w-full"
              >
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
