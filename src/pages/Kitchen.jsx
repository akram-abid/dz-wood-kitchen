import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  MapPin,
  Clock,
  Tag,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import WLogo from "../assets/images/whiteLogo.png";
import Blogo from "../assets/images/blackLogo.png";
import i18next from "i18next";

const KitchenDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [kitchen, setKitchen] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    const fakeKitchen = {
      id,
      title: "Modern Oak Kitchen",
      images: [
        "https://source.unsplash.com/random/800x600/?kitchen,1",
        "https://source.unsplash.com/random/800x600/?kitchen,2",
        "https://source.unsplash.com/random/800x600/?kitchen,3",
        "https://source.unsplash.com/random/800x600/?kitchen,4",
      ],
      description:
        "A beautiful modern kitchen featuring oak cabinetry. Custom designed for contemporary living with premium appliances. The kitchen includes a large island with quartz countertops, professional-grade stainless steel appliances, and custom storage solutions.",
      location: "Manhattan, NY",
      client: "Client 1",
      duration: "8 weeks",
      woodType: "Oak",
      completedDate: "2023-05-15",
      features: [
        "Custom cabinetry",
        "Quartz countertops",
        "Stainless steel appliances",
        "Under-cabinet lighting",
        "Pull-out pantry",
      ],
    };
    setKitchen(fakeKitchen);
  }, [id]);

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
    i18n.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === kitchen?.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? kitchen?.images.length - 1 : prev - 1
    );
  };

  if (!kitchen) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 lg:px-14 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <img
            src={darkMode ? WLogo : Blogo}
            alt="logo"
            className="w-[140px]"
          />

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleLanguageDropdown}
                className={`flex items-center space-x-2 p-2 md:p-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                  darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-50 text-gray-900"
                } hover:text-yellow-500`}
              >
                <Globe size={20} />
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`absolute right-0 mt-2 w-40 transition-all duration-200 ${
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
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 ${
                        darkMode
                          ? "hover:bg-gray-700 text-white"
                          : "hover:bg-gray-50 text-gray-900"
                      } hover:text-yellow-500 first:rounded-t-lg last:rounded-b-lg`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="font-medium">{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 mb-6 transition-colors"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-180px)]">
          {/* Image Gallery - Full height on desktop */}
          <div className="relative rounded-xl overflow-hidden shadow-lg h-full min-h-[400px] lg:min-h-full">
            <div className="relative h-full w-full">
              {kitchen.images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                    index === currentImageIndex
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={image}
                    alt={kitchen.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={prevImage}
              className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 dark:bg-[#ffffff52] bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 dark:bg-[#ffffff52] bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {kitchen.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-yellow-400 scale-125"
                      : "bg-gray-300 bg-opacity-50 dark:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details Section - Scrollable on desktop */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 lg:overflow-y-auto lg:h-full">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
              {kitchen.title}
            </h1>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {kitchen.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <DetailItem
                icon={<MapPin className="text-yellow-500" />}
                label={t("location")} 
                value={kitchen.location}
              />
              <DetailItem
                icon={<Clock className="text-yellow-500" />}
                label={t("duration")}
                value={kitchen.duration}
              />
              <DetailItem
                icon={<Calendar className="text-yellow-500" />}
                label={t("completedDate")}
                value={kitchen.completedDate}
              />
              <DetailItem
                icon={<Tag className="text-yellow-500" />}
                label={t("woodType")}
                value={kitchen.woodType}
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                {t("features")}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {kitchen.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <span className="mx-3">{icon}</span>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-black dark:text-white">{value}</p>
    </div>
  </div>
);

export default KitchenDetails;
