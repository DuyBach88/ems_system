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
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const EmployeeNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update time every second for employee
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentDate(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Mapping routes to readable names with icons for employee
  const routeNames = {
    "/employee-dashboard": { name: "My Dashboard", icon: "🏠" },
    [`/employee-dashboard/profile/${user._id}`]: {
      name: "Profile",
      icon: "👤",
    },
    "/employee-dashboard/leaves": { name: "Leave Requests", icon: "📅" },
    "/employee-dashboard/add-leave": {
      name: "Leave Requests",
      icon: "➕",
    },
    "/employee-dashboard/attendance": { name: "Attendance", icon: "⏰" },
    [`/employee-dashboard/salary/${user._id}`]: {
      name: "Salary Information",
      icon: "💰",
    },
    "/employee-dashboard/change-password": { name: "Settings", icon: "⚙️" },
  };

  // Get dynamic title based on route
  const getTitle = () => {
    const route = routeNames[location.pathname];
    return route ? route.name : "Employee Portal";
  };

  const getTitleIcon = () => {
    const route = routeNames[location.pathname];
    return route ? route.icon : "🌟";
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <header className="w-full bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-900 shadow-xl text-white fixed top-0 z-30 backdrop-blur-sm border-b border-emerald-700/50 md:left-64 md:w-[calc(100%-16rem)]">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Title & Welcome */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-bounce">{getTitleIcon()}</span>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">
                {getTitle()}
              </h1>
              <p className="text-xs text-emerald-300 hidden md:block">
                Welcome back, {user?.name || "Employee"}!
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Date & Time */}
        <div className="hidden md:flex items-center space-x-4 bg-teal-700/30 px-4 py-2 rounded-lg border border-teal-600/30">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-emerald-400" />
            <span className="text-sm text-emerald-200">
              {formatDate(currentDate)}
            </span>
          </div>
          <div className="w-px h-4 bg-teal-600"></div>
          <div className="flex items-center space-x-2">
            <FaClock className="text-emerald-400" />
            <span className="text-sm text-emerald-200 font-mono">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Right Section - Quick Actions & User */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => navigate("/employee-dashboard/leaves")}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-emerald-700/50 hover:bg-emerald-600/50 transition-all duration-300 hover:scale-105"
              title="Request Leave"
            >
              <FaCalendarAlt className="text-emerald-400" />
              <span className="text-xs text-emerald-200">Leave</span>
            </button>

            <button
              onClick={() => navigate("/employee-dashboard/attendance")}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-emerald-700/50 hover:bg-emerald-600/50 transition-all duration-300 hover:scale-105"
              title="Check Attendance"
            >
              <FaCheckCircle className="text-emerald-400" />
              <span className="text-xs text-emerald-200">Attendance</span>
            </button>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-emerald-700/50 hover:bg-emerald-600/50 transition-all duration-300 hover:scale-110">
            <FaBell className="text-emerald-400 hover:text-yellow-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-2 rounded-lg bg-emerald-700/50 hover:bg-emerald-600/50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <span className="hidden md:block text-white font-medium">
                {user?.name || "Employee"}
              </span>
              <FaChevronDown
                className={`text-emerald-400 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-emerald-800 border border-emerald-700 rounded-lg shadow-xl z-50 animate-fade-in">
                <div className="p-3 border-b border-emerald-700 bg-gradient-to-r from-emerald-700 to-teal-700">
                  <p className="text-white font-semibold">
                    {user?.name || "Employee"}
                  </p>
                  <p className="text-emerald-300 text-sm">
                    {user?.email || ""}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-xs text-emerald-200">Online</span>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate(`/employee-dashboard/profile/${user?._id}`);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-emerald-300 hover:bg-emerald-700 hover:text-white transition-colors"
                  >
                    <FaUserCircle />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/employee-dashboard/change-password");
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-emerald-300 hover:bg-emerald-700 hover:text-white transition-colors"
                  >
                    <FaCog />
                    <span>Settings</span>
                  </button>

                  <hr className="my-2 border-emerald-700" />

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

      {/* Mobile Date & Time */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex items-center justify-between text-xs text-emerald-200">
          <span>{formatDate(currentDate)}</span>
          <span className="font-mono">{formatTime(currentTime)}</span>
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

export default EmployeeNavbar;
