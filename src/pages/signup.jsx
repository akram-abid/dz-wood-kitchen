import React, { useState } from "react";
import { Mail, Lock, User, Github, ChevronDown, Sun, Moon, Globe, CheckCircle} from "lucide-react";

const SignupPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-md py-4 px-6 lg:px-8 sticky top-0 z-50 border-b transition-all duration-300 ${
        darkMode 
          ? "bg-gray-900/80 border-gray-700/50" 
          : "bg-white/80 border-gray-200/50"
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
              darkMode ? "bg-amber-500 text-gray-900" : "bg-gray-900 text-white"
            }`}>
              K
            </div>
            <span className={`ml-3 text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              KitchenCraft
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700" 
                  : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
              }`}
            >
              <Globe size={18} />
              <span className="text-sm font-medium">
                {language === "en" ? "EN" : "AR"}
              </span>
            </button>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700" 
                  : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 shadow-sm"
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className={`lg:w-1/2 rounded-2xl p-8 border transition-all duration-300 ${
            darkMode 
              ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm" 
              : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
          }`}>
            <h1 className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Sign Up Account
            </h1>
            <p className={`mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Enter your details to create your account
            </p>

            {/* Social Login Buttons */}
            <div className="flex flex-col space-y-4 mb-6">
              <button className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white" 
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-800"
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.177-2.664-6.735-2.664-5.521 0-10 4.479-10 10s4.479 10 10 10c8.396 0 10-7.496 10-9.634 0-0.768-0.085-1.354-0.189-1.939h-9.811z"></path>
                </svg>
                <span>Continue with Google</span>
              </button>
              <button className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white" 
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-800"
              }`}>
                <Github size={20} />
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${
                  darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
                }`}>
                  Or sign up with email
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`} size={16} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="eg. John Francisco"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`} size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="eg. printing@gmail.com"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`} size={16} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
                <p className={`mt-2 text-sm ${
                  darkMode ? "text-gray-500" : "text-gray-600"
                }`}>
                  Use at least 8 characters with a mix of letters and numbers
                </p>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  darkMode
                    ? "bg-yellow-500 hover:bg-yellow-400 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                Sign Up
              </button>
            </form>

            <div className={`mt-6 text-center ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Already have an account?{' '}
              <a href="/login" className={`font-medium ${
                darkMode ? "text-amber-400 hover:text-amber-300" : "text-blue-600 hover:text-blue-500"
              }`}>
                Log in
              </a>
            </div>
          </div>

          {/* Image/Message Section */}
          <div className={`lg:w-1/2 rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-center ${
            darkMode 
              ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm" 
              : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
          }`}>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba" 
                alt="Kitchen Design"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h2 className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                Create Your Dream Kitchen
              </h2>
              <p className={`mb-6 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Join thousands of satisfied customers who have transformed their homes with our premium kitchen solutions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className={`mr-2 ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`} size={20} />
                  <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    Custom designs tailored to your space
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`mr-2 ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`} size={20} />
                  <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    Premium materials and craftsmanship
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`mr-2 ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`} size={20} />
                  <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    Expert support throughout your project
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;