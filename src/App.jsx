import "./App.css";
import React, { useState, useEffect } from "react";
import WLogo from "./assets/images/whiteLogo.png";
import Blogo from "./assets/images/blackLogo.png";
import "./utils/i18n/i18next";

import {
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

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTeamSlide, setCurrentTeamSlide] = useState(0);
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
    },
    {
      id: 2,
      title: "Classic Wood Finish",
      description: "Traditional oak kitchen with modern appliances",
    },
    {
      id: 3,
      title: "Luxury Kitchen Island",
      description: "Spacious island with granite countertops",
    },
    {
      id: 4,
      title: "Minimalist Design",
      description: "Clean lines with premium materials",
    },
    {
      id: 5,
      title: "Custom Storage Solutions",
      description: "Optimized storage with elegant design",
    },
  ];

  // Team members
  const teamMembers = [
    {
      id: 1,
      name: "David Zhang",
      role: "Founder & Master Carpenter",
      bio: "With over 20 years of experience, David brings precision and artistry to every project.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Design Consultant",
      bio: "Sarah transforms ideas into beautiful, functional kitchen designs that clients love.",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Project Manager",
      bio: "Michael ensures every project runs smoothly from start to finish with meticulous attention to detail.",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "Customer Relations",
      bio: "Emily is your dedicated point of contact, ensuring your experience with us is exceptional.",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      className={`   min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
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
              <div
                className={`w-full h-64 md:h-96 rounded-xl shadow-lg overflow-hidden flex items-center justify-center ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={24} className="text-black" />
                  </div>
                  <p
                    className={`text-base ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Workshop Image Placeholder
                  </p>
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
          <div className="text-center mb-12 md:mb-20" data-animate>
            <div className="text-yellow-500 text-xs md:text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("ourWork")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">{t("gallery")}</h2>
          </div>

          <div className="relative max-w-4xl mx-auto" data-animate>
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
                    <div
                      className={`w-full h-64 md:h-96 flex items-center justify-center ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Palette size={24} className="text-black" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {image.title}
                        </h3>
                        <p
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {image.description}
                        </p>
                      </div>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {t("viewProject")}
                      </button>
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
              } top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-50 text-gray-900 hover:bg-gray-100"
              } transition-colors`}
            >
              {document.documentElement.dir === "rtl" ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
            <button
              onClick={nextSlide}
              className={`absolute ${
                document.documentElement.dir === "rtl" ? "left-2" : "right-2"
              } top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-50 text-gray-900 hover:bg-gray-100"
              } transition-colors`}
            >
              {document.documentElement.dir === "rtl" ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>

            {/* Slide indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-yellow-500 w-6"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* See All Button */}
          <div className="text-center mt-12" data-animate>
            <button
              onClick={() => navigate("/gallery")}
              className={`inline-flex items-center px-8 py-4 border-2 rounded-xl font-semibold text-lg md:text-xl transition-all duration-300 group ${
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
              <div
                className={`w-full h-64 rounded-xl shadow-lg overflow-hidden flex items-center justify-center ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={24} className="text-black" />
                  </div>
                  <p
                    className={`text-base ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Craftsmanship in Action
                  </p>
                </div>
              </div>

              {/* Two smaller bottom images */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`h-48 rounded-xl shadow-lg overflow-hidden flex items-center justify-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Wrench size={20} className="text-black" />
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Precision Work
                    </p>
                  </div>
                </div>
                <div
                  className={`h-48 rounded-xl shadow-lg overflow-hidden flex items-center justify-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Palette size={20} className="text-black" />
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Design Excellence
                    </p>
                  </div>
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
                            className={`w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto flex items-center justify-center ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            <Users size={48} className="text-yellow-500" />
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
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-colors w-full"
                >
                  {t("sendMessage")}
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
                  <div className="bg-yellow-500 p-3 rounded-full mr-4 flex-shrink-0">
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
                    { day: t("saturday"), hours: t("hours2") },
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
            onClick={() => {
              const phoneNumber = "4029799718"; // Replace with your actual number
              window.open(`https://wa.me/${phoneNumber}`, "_blank");
            }}
            className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
            style={{
              boxShadow: "0 0 15px rgba(37, 211, 102, 0.7)",
              animation: "pulse 2s infinite",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-8 h-8"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29 3.617c-.545 0-1.06-.113-1.534-.338-.416-.195-.727-.456-.92-.707-.05-.074-.089-.165-.114-.272a.687.687 0 0 1 .466-.793c.272-.1.714-.235.93-.05.148.124.594.605.711.772.075.1.149.149.223.074.074-.074.05-.149.025-.223-.025-.074-1.262-3.238-1.733-4.42-.04-.124-.008-.235.033-.347.074-.173.198-.248.322-.248h.595c.173 0 .26.024.347.074.086.05.099.124.136.272v.004c.231.694.784 2.365.841 2.538.058.173.115.26.202.26h.012c.074 0 .149-.05.198-.173.124-.248.512-1.262.594-1.724a.42.42 0 0 0-.033-.272.347.347 0 0 0-.124-.174c-.05-.041-.434-.322-.644-.433-.198-.099-.347-.124-.446-.124-.099 0-.198.05-.297.149-.099.099-.372.372-.409.413-.074.074-.148.074-.272.025-.124-.05-.521-.198-.993-.198-.744 0-1.416.248-1.901.694-.446.421-.702.959-.744 1.538-.033.446.099.882.384 1.23.198.248.446.446.744.595.52.273 1.115.421 1.74.446.446.016.882-.058 1.29-.215.446-.174.793-.446 1.04-.793.149-.198.124-.347.074-.471-.05-.124-.223-.198-.47-.347" />
            </svg>
          </button>
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Contact us on WhatsApp
          </div>
        </div>

        {/* Phone Button */}
        <div className="relative group">
          <button
            onClick={async () => {
              try {
                const phoneNumber = "4029799718"; // Replace with your actual number
                await navigator.clipboard.writeText(phoneNumber);
                alert("Phone number copied to clipboard!");

                // Optionally open phone dialer
                window.open(`tel:${phoneNumber}`);
              } catch (err) {
                console.error("Failed to copy: ", err);
              }
            }}
            className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
            style={{
              boxShadow: "0 0 15px rgba(234, 179, 8, 0.7)",
              animation: "pulse 2s infinite",
            }}
          >
            <Phone size={24} className="text-white" />
          </button>
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Call us: 402-979-9718
          </div>
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
                {[Facebook, Instagram, Linkedin].map((Icon, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-yellow-500 hover:text-black transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
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
                  <MapPin size={16} className="mr-2 mt-0.5 text-yellow-500" />
                  <span>2458 Oak Ridge Omaha, NE 68105</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-yellow-500" />
                  <span>402-979-9718</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-yellow-500" />
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
