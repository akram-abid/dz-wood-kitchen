import "./App.css";
import React, { useState, useEffect } from "react";
import WLogo from "./assets/images/whiteLogo.png";
import Blogo from "./assets/images/blackLogo.png";
import "./utils/i18n/i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faCopy } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import img1 from "./assets/images/carousel/imgcarousel1.jpg";
import img2 from "./assets/images/carousel/imgcarousel2.jpg";
import img3 from "./assets/images/carousel/imgcarousel3.jpg";
import img4 from "./assets/images/carousel/imgcarousel4.jpg";
import img5 from "./assets/images/carousel/imgcarousel5.jpg";
import img6 from "./assets/images/carousel/imgcarousel6.jpg";
import img7 from "./assets/images/carousel/imgcarousel7.jpg";
import img8 from "./assets/images/carousel/imgcarousel8.jpg";
import img9 from "./assets/images/carousel/imgcarousel9.jpg";
import workshop from "./assets/images/workshop.jpg";
import designExcellenceImage from "./assets/images/designExcellenceImage.jpg";
import craftsmanshipImage from "./assets/images/craftsmanshipImage.jpg";
import precisionWorkImage from "./assets/images/precisionWorkImage.jpg";
import akram from "./assets/images/akram.jpg";
import abdeldjalile from "./assets/images/abdeldjalile.jpg";
import samir from "./assets/images/samir.jpg";
import {
  User,
  Globe,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  ArrowDown,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Camera,
  Wrench,
  Palette,
  Target,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useNavigate } from "react-router-dom";
import apiFetch from "./utils/api/apiFetch";

function App() {
  const { t } = useTranslation();
  const title1 = useTypingEffect(t("title1"), 80, 500);
  const title2 = useTypingEffect(t("title2"), 80, title1.isComplete ? 500 : 0);

  const projectsCount = useCountAnimation(
    "2000+",
    2000,
    title2.isComplete ? 1000 : 0
  );
  const yearsCount = useCountAnimation(
    "15+",
    2000,
    title2.isComplete ? 1200 : 0
  );
  const satisfactionCount = useCountAnimation(
    "99%",
    2000,
    title2.isComplete ? 1400 : 0
  );

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/1FDSeBntVX/", // Replace with your actual Facebook URL
      bgColor: "bg-blue-600",
      hoverBg: "hover:bg-blue-700",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/dz_wood_kitchen?igsh=cTFpajlsazZiNzM=", // Replace with your actual Instagram URL
      bgColor: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600",
      hoverBg: "hover:from-purple-700 hover:via-pink-700 hover:to-orange-700",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/yourprofile", // Replace with your actual LinkedIn URL
      bgColor: "bg-blue-700",
      hoverBg: "hover:bg-blue-800",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      url: "https://vm.tiktok.com/ZMSqppp5g/", // Replace with your actual TikTok URL
      bgColor: "bg-black",
      hoverBg: "hover:bg-gray-800",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTeamSlide, setCurrentTeamSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();

  // Gallery images
  const galleryImages = [
    {
      id: 1,
      title: "Modern Kitchen Design",
      description: "Sleek contemporary kitchen with custom cabinetry",
      src: img1,
    },
    {
      id: 2,
      title: "Classic Wood Finish",
      description: "Traditional oak kitchen with modern appliances",
      src: img2,
    },
    {
      id: 3,
      title: "Luxury Kitchen Island",
      description: "Spacious island with granite countertops",
      src: img3,
    },
    {
      id: 4,
      title: "Minimalist Design",
      description: "Clean lines with premium materials",
      src: img4,
    },
    {
      id: 5,
      title: "Modern Kitchen Design",
      description: "Sleek contemporary kitchen with custom cabinetry",
      src: img5,
    },
    {
      id: 6,
      title: "Classic Wood Finish",
      description: "Traditional oak kitchen with modern appliances",
      src: img6,
    },
    {
      id: 7,
      title: "Luxury Kitchen Island",
      description: "Spacious island with granite countertops",
      src: img7,
    },
    {
      id: 8,
      title: "Minimalist Design",
      description: "Clean lines with premium materials",
      src: img8,
    },
  ];

  // Team members
  const teamMembers = [
    {
      id: 1,
      name: "أمين",
      role: t("manager"),
      bio: t("experienceModernKitchenInteriorExpert"),
    },
    {
      id: 2,
      name: "محمد الشلفي",
      role: t("workshopTeamLeader"),
      bio: t("experienceKitchenPassionate"),
    },
    {
      id: 3,
      name: "نبيل",
      role: t("workshopAssistant"),
      bio: t("disciplinedAndFunny"),
    },
    {
      id: 4,
      name: "عبد الجليل",
      role: t("workshopAssistant"),
      bio: t("strongAndLovesChallenges"),
      img: abdeldjalile,
    },
    {
      id: 5,
      name: "سمير",
      role: t("carpentryTechnician"),
      bio: t("seriousAndStrictInWork"),
      img: samir,
    },
    {
      id: 6,
      name: "أكرم",
      role: t("engineerAndDesigner"),
      bio: t("responsibleForDesignAndMedia"),
      img: akram,
    },
    {
      id: 7,
      name: "شهرازاد",
      role: t("commercialAgent"),
      bio: t("disciplinedAndDevelopmentLover"),
    },
    {
      id: 8,
      name: "بلال",
      role: t("driverAndAssistant"),
      bio: t("driverAndWorkshopHelper"),
    },
    {
      id: 9,
      name: "محمد",
      role: t("designerAnd3dEngineer"),
      bio: t("specializedIn3dAndInterior"),
    },
  ];

  useEffect(() => {
    const updateDirection = () => {
      document.documentElement.dir = i18next.dir();
    };

    updateDirection();

    i18next.on("languageChanged", updateDirection);

    return () => {
      i18next.off("languageChanged", updateDirection);
    };
  }, []);

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (languageCode) => {
    console.log("Selected language:", languageCode);
    i18next.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  //change page direction

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Animation trigger
      const elements = document.querySelectorAll("[data-animate]");
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !element.classList.contains("animated")) {
          element.classList.add("animated");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // Team carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTeamSlide((prev) => (prev + 1) % teamMembers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [teamMembers.length]);

  const toggleMode = () => setIsDarkMode(!isDarkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  const nextTeamSlide = () =>
    setCurrentTeamSlide((prev) => (prev + 1) % teamMembers.length);
  const prevTeamSlide = () =>
    setCurrentTeamSlide(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
    );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("hi there")
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiFetch("/api/v1/emails/send", 
        {
          fullName: formData.name,
          email: formData.email,
          message: formData.message,
        },
        true,
        "POST",
      );

      
      console.log("the data is this ", response)

      if (response.success) {
        setPopupMessage("Your message has been sent successfully!");
        setShowPopup(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        const errorMsg =
          response.message || "Failed to send message. Please try again later.";
        setPopupMessage(errorMsg);
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage(
        "Network error. Please check your connection and try again."
      );
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`   min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`p-6 rounded-xl max-w-md w-full ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3      // Check both the response status and the success flag in the data

                className={`text-lg font-medium mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {popupMessage.includes("success") ? "Success!" : "Error"}
              </h3>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                {popupMessage}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? `${
                isDarkMode ? "bg-black" : "bg-white/95"
              } backdrop-blur-md shadow-lg`
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-2 py-1 md:px-8 md:py-6 ">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={isDarkMode ? WLogo : Blogo}
                alt="the logo"
                className="w-[140px]"
              />
            </div>

            <div className="hidden lg:flex items-center space-x-6 md:space-x-8">
              {[
                { tag: t("home"), link: "home" },
                { tag: t("about"), link: "about" },
                { tag: t("mission"), link: "mission" },
                { tag: t("gallery"), link: "gallery" },
                { tag: t("team"), link: "team" },
                { tag: t("contact"), link: "contact" },
              ].map(({ tag, link }) => (
                <a
                  key={link}
                  href={`#${link}`}
                  className="hover:text-yellow-500 transition-colors duration-200 font-medium relative group"
                >
                  {tag}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              <button
                onClick={() => navigate("/profile")}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
                }`}
              >
                <User size={18} />
              </button>

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleLanguageDropdown}
                  className={`flex items-center space-x-2 p-2 md:p-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                    isDarkMode
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

                {/* Language Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-40 transition-all duration-200 ${
                    isLanguageDropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div
                    className={`rounded-lg shadow-xl border ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {[
                      { code: "en", name: "English", flag: "🇺🇸" },
                      { code: "ar", name: "العربية", flag: "🇸🇦" },
                      { code: "fr", name: "Français", flag: "🇫🇷" },
                    ].map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 ${
                          isDarkMode
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
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 md:px-8 md:py-3 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                onClick={() => navigate("/order")}
              >
                {t("orderNow")}
              </button>

              <button
                onClick={toggleMode}
                className={`p-2 md:p-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-50 text-gray-900"
                } hover:text-yellow-500`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-current"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 overflow-hidden ${
              isMobileMenuOpen
                ? "max-h-screen opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`py-4 rounded-lg mt-2 shadow-xl ${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              {[
                { tag: t("home"), link: "home" },
                { tag: t("about"), link: "about" },
                { tag: t("mission"), link: "mission" },
                { tag: t("gallery"), link: "gallery" },
                { tag: t("team"), link: "team" },
                { tag: t("contact"), link: "contact" },
              ].map(({ tag, link }) => (
                <a
                  key={link}
                  href={`#${link}`}
                  className="block px-4 py-2 hover:text-yellow-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {tag}
                </a>
              ))}

              {/* Mobile Language Selection */}
              <div className="px-4 py-2">
                <div className="mb-3">
                  <p
                    className={`text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Language
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { code: "en", name: "English", flag: "🇺🇸" },
                      { code: "ar", name: "العربية", flag: "🇸🇦" },
                      { code: "fr", name: "Français", flag: "🇫🇷" },
                    ].map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                        } hover:text-yellow-500`}
                      >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 flex space-x-3">
                <button
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 md:px-8 md:py-3 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  onClick={() => navigate("/order")}
                >
                  {t("orderNow")}
                </button>
                <button
                  onClick={toggleMode}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                  } hover:text-yellow-500`}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative w-full h-screen pt-20 overflow-hidden"
      >
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-900 to-black"
              : "bg-gradient-to-br from-gray-100 to-white"
          }`}
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="mt-4 relative z-10 flex h-full items-center">
          <div div className="pt-2 container mx-auto px-4 py-4 md:px-8">
            <div className="max-w-4xl">
              <div className="flex items-center mb-8 md:mb-12">
                <div>
                  <div className="text-yellow-500 text-base md:text-lg font-medium">
                    {t("craftingExcellence")}
                  </div>
                </div>
              </div>

              <h1
                className="font-bold text-4xl md:text-5xl lg:text-6xl font-bold leading-tight min-h-[16 0px] md:min-h-[180px]"
                data-animate
              >
                {title1.displayText}
                {title1.displayText && !title1.isComplete && (
                  <span className="animate-pulse">|</span>
                )}
                <br />
                <span className="text-yellow-500">
                  {title2.displayText}
                  {title2.displayText && !title2.isComplete && (
                    <span className="animate-pulse">|</span>
                  )}
                </span>
              </h1>

              <p
                className={`text-lg md:text-xl mb-8 md:mb-12 max-w-3xl leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                data-animate
              >
                {t("subTitle")}
              </p>

              <div
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-12 md:mb-16"
                data-animate
              >
                <button
                  onClick={() => navigate("/gallery")}
                  className="cursor-pointer bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 md:px-12 md:py-5 rounded-xl text-lg md:text-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                >
                  {t("exploreOurWork")}
                </button>
                <button
                  onClick={() => navigate("/order")}
                  className={`border-2 px-8 py-4 md:px-12 md:py-5 rounded-xl text-lg md:text-xl font-semibold transition-colors shadow-lg hover:shadow-xl ${
                    isDarkMode
                      ? "border-white text-white hover:bg-white hover:text-black"
                      : "border-black text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {t("orderNow")}
                </button>
              </div>

              <div
                className="w-[100vw] grid grid-cols-3 gap-6 md:gap-8 max-w-2xl"
                data-animate
              >
                {title2.isComplete &&
                  [
                    {
                      value: "500+",
                      label: t("projectsDone"),
                      count: projectsCount,
                      suffix: "+",
                    },
                    {
                      value: "15+",
                      label: t("yearsExperience"),
                      count: yearsCount,
                      suffix: "+",
                    },
                    {
                      value: "100%",
                      label: t("satisfaction"),
                      count: satisfactionCount,
                      suffix: "%",
                    },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold mb-1 hover:text-yellow-500 transition-colors">
                        {stat.count}
                      </div>
                      <div
                        className={`text-sm md:text-base ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className=" absolute bottom-8 left-1/2 transform -translate-y-10  animate-bounce">
          <ArrowDown
            size={24}
            className="opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className={`py-16 md:py-24 ${isDarkMode ? "bg-black" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-20" data-animate>
            <div className="text-yellow-500 text-xs md:text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("aboutUsTitle")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">{t("aboutUs")}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative" data-animate>
              <div className="relative" data-animate>
                <div className="w-full h-64 md:h-96 rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={workshop}
                    alt="Workshop"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6" data-animate>
              <div className="text-yellow-500 text-xs md:text-sm font-semibold uppercase tracking-wider">
                {t("ourStory")}
              </div>
              <h3 className="text-2xl md:text-4xl font-bold leading-tight">
                {t("weAlwaysMake")}
                <br />
                <span className="text-yellow-500">{t("theBest")}</span>
              </h3>

              <div className="space-y-4 text-base md:text-lg">
                <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  {t("aboutUsDescription1")}
                </p>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  {t("aboutUsDescription2")}
                </p>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  {t("aboutUsDescription3")}
                </p>
              </div>

              <a
                href="#contact"
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-colors"
              >
                {t("contactUs")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        id="gallery"
        className={`py-16 md:py-24 ${isDarkMode ? "bg-black" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-12" data-animate>
            <div className="text-yellow-500 text-xs md:text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("ourWork")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">{t("gallery")}</h2>
          </div>

          <div className="relative max-w-6xl mx-auto" data-animate>
            <div className="overflow-hidden rounded-xl shadow-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${
                    document.documentElement.dir === "rtl"
                      ? currentSlide * 100
                      : -currentSlide * 100
                  }%)`,
                }}
              >
                {galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className="w-full flex-shrink-0 relative group"
                  >
                    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden rounded-xl">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />

                      {/* Image overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
                          {image.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-200 mb-4">
                          {image.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className={`absolute ${
                document.documentElement.dir === "rtl" ? "right-2" : "left-2"
              } md:${
                document.documentElement.dir === "rtl" ? "right-4" : "left-4"
              } top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full shadow-md hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              } transition-all duration-300 opacity-80 hover:opacity-100`}
              aria-label="Previous image"
            >
              {document.documentElement.dir === "rtl" ? (
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              ) : (
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              )}
            </button>
            <button
              onClick={nextSlide}
              className={`absolute ${
                document.documentElement.dir === "rtl" ? "left-2" : "right-2"
              } md:${
                document.documentElement.dir === "rtl" ? "left-4" : "right-4"
              } top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full shadow-md hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              } transition-all duration-300 opacity-80 hover:opacity-100`}
              aria-label="Next image"
            >
              {document.documentElement.dir === "rtl" ? (
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              ) : (
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              )}
            </button>

            {/* Slide indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-yellow-500 w-4 md:w-6"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail navigation for larger screens */}
          <div className="hidden lg:block mt-8" data-animate>
            <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === currentSlide
                      ? "border-yellow-500 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* See All Button */}
          <div className="text-center mt-12" data-animate>
            <button
              onClick={() => navigate("/gallery")}
              className={`inline-flex items-center px-6 py-3 md:px-8 md:py-4 border-2 rounded-xl font-semibold text-base md:text-lg lg:text-xl transition-all duration-300 group ${
                isDarkMode
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              {t("seeAllProjects")}
              <ChevronRight
                size={20}
                className={`ml-2 transition-transform duration-300 ${
                  document.documentElement.dir === "rtl" ? "rotate-180" : ""
                } group-hover:translate-x-1`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="mission"
        className={`py-16 md:py-24 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Mission Content Column */}
            <div className="space-y-8" data-animate>
              <div className="text-yellow-500 text-xs md:text-sm font-semibold mb-4 uppercase tracking-wider">
                {t("ourMission")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">
                {t("ourMissionTitle")}
              </h2>

              <div className="space-y-4 text-base md:text-lg">
                <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  {t("ourMissionDescription1")}
                </p>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  {t("ourMissionDescription2")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    icon: Award,
                    title: t("quality"),
                    desc: t("qualityDescription"),
                  },
                  {
                    icon: Target,
                    title: t("innovation"),
                    desc: t("innovationDescription"),
                  },
                  {
                    icon: Users,
                    title: t("service"),
                    desc: t("serviceDescription"),
                  },
                ].map((value, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <value.icon size={18} className="text-black" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-center">
                      {value.title}
                    </h3>
                    <p
                      className={`text-sm text-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {value.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Gallery Column */}
            <div className="space-y-4" data-animate>
              {/* Large top image */}
              <div className="w-full h-64 rounded-xl shadow-lg overflow-hidden">
                <img
                  src={craftsmanshipImage}
                  alt="Craftsmanship in Action"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Two smaller bottom images */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-48 rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={precisionWorkImage}
                    alt="Precision Work"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-48 rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={designExcellenceImage}
                    alt="Design Excellence"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className={`py-[12px] md:py-24 ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            data-animate
          >
            {[
              { icon: Calendar, value: "15+", label: t("yearsExperience") },
              { icon: Wrench, value: "500+", label: t("projectsDone") },
              { icon: Star, value: "300+", label: t("satisfaction") },
              { icon: Users, value: "50+", label: t("expertTeam") },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className="flex justify-center mb-4">
                  <stat.icon size={32} className="text-yellow-500" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">
                  {stat.value}
                </div>
                <div
                  className={`text-sm md:text-base ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        id="team"
        className={`py-16 md:py-24 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-20" data-animate>
            <div className="text-yellow-500 text-xs md:text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("ourExperts")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              {t("meetOurTeam")}
            </h2>
          </div>

          <div className="relative max-w-6xl mx-auto" data-animate>
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${
                    document.documentElement.dir === "rtl"
                      ? currentTeamSlide * 100
                      : -currentTeamSlide * 100
                  }%)`,
                }}
              >
                {teamMembers.map((member) => (
                  <div key={member.id} className="w-full flex-shrink-0 px-4">
                    <div
                      className={`p-8 rounded-xl shadow-lg ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/3">
                          <div
                            className={`w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto flex items-center justify-center overflow-hidden ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            {member.img ? (
                              <img
                                src={member.img}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Users size={48} className="text-yellow-500" />
                            )}
                          </div>
                        </div>
                        <div
                          className={`w-full md:w-2/3 text-center ${
                            document.documentElement.dir === "rtl"
                              ? "md:text-right"
                              : "md:text-left"
                          }`}
                        >
                          <h3 className="text-2xl font-bold mb-2">
                            {member.name}
                          </h3>
                          <div className="text-yellow-500 font-medium mb-4">
                            {member.role}
                          </div>
                          <p
                            className={`mb-6 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {member.bio}
                          </p>
                          <div
                            className={`flex space-x-4 ${
                              document.documentElement.dir === "rtl"
                                ? "justify-center md:justify-end"
                                : "justify-center md:justify-start"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevTeamSlide}
              className={`absolute ${
                document.documentElement.dir === "rtl" ? "right-0" : "left-0"
              } top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-50 text-gray-900"
              }`}
            >
              {document.documentElement.dir === "rtl" ? (
                <ChevronRight size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </button>
            <button
              onClick={nextTeamSlide}
              className={`absolute ${
                document.documentElement.dir === "rtl" ? "left-0" : "right-0"
              } top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-50 text-gray-900"
              }`}
            >
              {document.documentElement.dir === "rtl" ? (
                <ChevronLeft size={24} />
              ) : (
                <ChevronRight size={24} />
              )}
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTeamSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTeamSlide ? "bg-yellow-500" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`py-16 md:py-24 ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-20" data-animate>
            <div className="text-yellow-500 text-xs md:text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("getInTouch")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">{t("contactUs")}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
            <div className="space-y-8" data-animate>
              <h3 className="text-2xl md:text-3xl font-bold">
                {t("tellUsMore")}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className={`block mb-2 font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("yourName")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`block mb-2 font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("emailAddress")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`block mb-2 font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("yourMessage")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-colors w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("sending")}
                    </>
                  ) : (
                    t("sendMessage")
                  )}
                </button>
              </form>
            </div>

            <div className="space-y-8" data-animate>
              <h3 className="text-2xl md:text-3xl font-bold">
                {t("contactInformation")}
              </h3>

              <div
                className={`space-y-6 p-6 rounded-xl shadow-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="flex items-start">
                  <div className="bg-yellow-500 p-3 rounded-full mx-4 flex-shrink-0">
                    <MapPin size={20} className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{t("ourLocation")}</h4>
                    <p
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      {t("address")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-500 p-3 rounded-full mx-4 flex-shrink-0">
                    <Phone size={20} className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{t("phoneNumber")}</h4>
                    <p
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      {t("phone")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-500 p-3 rounded-full mx-4 flex-shrink-0">
                    <Mail size={20} className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{t("email")}</h4>
                    <p
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      {t("emailValue")}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-6 rounded-xl shadow-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <h4 className="font-bold mb-4">{t("businessHours")}</h4>
                <ul className="space-y-3">
                  {[
                    { day: t("mondayFriday"), hours: t("hours1") },
                    { day: t("sunday"), hours: t("closed") },
                  ].map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        {item.day}
                      </span>
                      <span
                        className={
                          isDarkMode
                            ? "text-gray-300 font-medium"
                            : "text-gray-800 font-medium"
                        }
                      >
                        {item.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-16 md:py-24 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-3xl mx-auto" data-animate>
            <div className="text-yellow-500 text-xs md:text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("readyToStart")}
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              {t("alwaysReady")}
              <br />
              <span className="text-yellow-500">
                {t("createYourDreamKitchen")}
              </span>
            </h2>
            <p
              className={`text-base md:text-lg mb-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("getInTouchToday")}
            </p>
            <button
              onClick={() => navigate("/order")}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 md:px-12 md:py-5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-colors"
            >
              {t("getStartedToday")}
            </button>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-4">
        {/* WhatsApp Button */}
        <div className="relative group">
          <button
            onClick={() => window.open("https://wa.me/213561489657", "_blank")}
            className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
            style={{ boxShadow: "0 0 15px rgba(37, 211, 102, 0.7)" }}
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="text-white text-2xl"
            />
          </button>
        </div>

        {/* Phone Button */}
        <div className="relative group">
          <button
            onClick={async () => {
              await navigator.clipboard.writeText("+2130550347043");
              alert("Phone number copied to clipboard!");
            }}
            className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
            style={{ boxShadow: "0 0 15px rgba(234, 179, 8, 0.7)" }}
          >
            <FontAwesomeIcon icon={faPhone} className="text-white text-xl" />
          </button>
        </div>
      </div>
      {/* Footer */}
      <footer
        className={`py-12 border-t ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img
                  src={isDarkMode ? WLogo : Blogo}
                  alt="the logo"
                  className="w-[280px]"
                />
              </div>
              <p
                className={`mb-4 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("experienceTagline")}
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
        w-10 h-10 rounded-full flex items-center justify-center text-white
        shadow-md transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-lg
        ${social.bgColor} ${social.hoverBg}
      `}
                    title={`Visit our ${social.name} profile`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-yellow-500">
                {t("quickLinks")}
              </h4>
              <ul
                className={`space-y-2 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {[
                  { tag: t("home"), link: "home" },
                  { tag: t("about"), link: "about" },
                  { tag: t("mission"), link: "mission" },
                  { tag: t("gallery"), link: "gallery" },
                  { tag: t("team"), link: "team" },
                  { tag: t("contact"), link: "contact" },
                ].map(({ tag, link }) => (
                  <li key={link}>
                    <a
                      href={`#${link}`}
                      className="hover:text-yellow-500 transition-colors"
                    >
                      {tag}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-yellow-500">
                {t("contactInfo")}
              </h4>
              <div
                className={`space-y-3 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div className="flex items-start">
                  <MapPin size={16} className="mx-2 mt-0.5 text-yellow-500" />
                  <span>Ouled Slama, Blida</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mx-2 text-yellow-500" />
                  <span>+2130550347043</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mx-2 text-yellow-500" />
                  <span>info@dzwoodkitchen.com</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`border-t pt-6 text-center text-xs ${
              isDarkMode
                ? "border-gray-700 text-gray-400"
                : "border-gray-200 text-gray-600"
            }`}
          >
            <p>
              Copyright © {new Date().getFullYear()} DZ Wood Kitchen | Crafted
              with Excellence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Typing animation hook
const useTypingEffect = (text, speed = 50, delay = 0) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text || delay === 0) return;

    setDisplayText("");
    setIsComplete(false);

    const timer = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          setIsComplete(true);
          clearInterval(typingInterval);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  return { displayText, isComplete };
};

const useCountAnimation = (target, duration = 2000, delay = 0) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset states
    setIsVisible(false);
    setDisplayValue("");

    if (delay === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
      const startTime = Date.now();
      const startValue = 0;
      const targetValue = parseInt(target.replace(/[^\d]/g, "")) || 0;
      const suffix = target.replace(/\d/g, "");

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(
          startValue + (targetValue - startValue) * easeOutQuart
        );

        setDisplayValue(currentValue + suffix);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return displayValue;
};

export default App;
