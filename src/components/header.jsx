import { useNavigate } from "react-router-dom";
import WLogo from "../assets/images/whiteLogo.webp";
import Blogo from "../assets/images/blackLogo.webp";
import { Sun, Moon, Globe, ChevronDown, User } from "lucide-react";

function Header({
  darkMode,
  toggleDarkMode,
  toggleLanguageDropdown,
  isLanguageDropdownOpen,
  handleLanguageChange,
  showProfileButton = false,
}) {
  const navigate = useNavigate();

  return (
    <header
      className={`backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 border-b transition-all duration-300 ${
        darkMode
          ? "bg-gray-900/80 border-gray-700/50"
          : "bg-white/80 border-gray-200/50"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center min-w-0">
        <div className="flex items-center flex-shrink-0">
          <button onClick={() => navigate("/")} className="focus:outline-none">
            <img
              src={darkMode ? WLogo : Blogo}
              alt="the logo"
              className="w-[80px] xs:w-[90px] sm:w-[100px] md:w-[120px] lg:w-[140px] h-auto cursor-pointer"
            />
          </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">
          {showProfileButton && (
            <button
              onClick={() => navigate("/profile")}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
              }`}
            >
              <User size={18} />
            </button>
          )}

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
                  { code: "fr", name: "Français", flag: "🇫🇷" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      darkMode
                        ? "hover:bg-gray-700 text-white"
                        : "hover:bg-gray-50 text-gray-900"
                    }`}
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
  );
}

export default Header;