import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSignOutAlt,
  FaUserCircle,
  FaBell,
  FaChevronDown,
  FaSearch,
  FaCog,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Mapping routes to readable names with icons
  const routeNames = {
    "/admin-dashboard": { name: "Admin Dashboard", icon: "🏠" },
    "/admin-dashboard/employees": { name: "Employee Management", icon: "👥" },
    "/admin-dashboard/departments": {
      name: "Department Management",
      icon: "🏢",
    },
    "/leave": { name: "Leave Management", icon: "📋" },
    "/admin-dashboard/salary/add": { name: "Salary Management", icon: "💰" },
    "/setting": { name: "Settings", icon: "⚙️" },
  };

  // Get dynamic title based on route
  const getTitle = () => {
    const route = routeNames[location.pathname];
    return route ? route.name : "Admin Panel";
  };

  const getTitleIcon = () => {
    const route = routeNames[location.pathname];
    return route ? route.icon : "🏢";
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <header className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl text-white fixed top-0 z-30 backdrop-blur-sm border-b border-slate-700/50 md:left-64 md:w-[calc(100%-16rem)]">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Home Button & Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTitleIcon()}</span>
            <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">
              {getTitle()}
            </h1>
          </div>
        </div>

        {/* Center Section - Search (hidden on mobile) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Section - User Info & Actions */}
        <div className="flex items-center space-x-3">
          {/* Time Display (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-2 text-slate-300">
            <span className="text-sm">{formatTime(currentTime)}</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300 hover:scale-110">
            <FaBell className="text-slate-400 hover:text-indigo-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <span className="hidden md:block text-white font-medium">
                {user?.name || "Admin"}
              </span>
              <FaChevronDown
                className={`text-slate-400 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 animate-fade-in">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-white font-semibold">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-slate-400 text-sm">{user?.email || ""}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <FaUserCircle />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => navigate("/setting")}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <FaCog />
                    <span>Settings</span>
                  </button>

                  <hr className="my-2 border-slate-700" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
          />
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default TopBar;
