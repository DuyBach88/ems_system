import React, { useState, useContext } from "react";
import {
  FaTachometerAlt,
  FaUserCircle,
  FaUsers,
  FaCheckCircle,
  FaClipboardCheck,
  FaBars,
  FaBuilding,
  FaMoneyBillWave,
  FaCog,
  FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const role = "Admin";
  const userName = user?.name || "Admin";
  const workTitle = user?.email || "";

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { text: "Dashboard", icon: <FaTachometerAlt />, path: "/admin-dashboard" },
    { text: "Employee", icon: <FaUsers />, path: "/admin-dashboard/employees" },
    {
      text: "Department",
      icon: <FaBuilding />,
      path: "/admin-dashboard/departments",
    },
    {
      text: "Leave",
      icon: <FaClipboardCheck />,
      path: "/admin-dashboard/employees/leaves",
    },
    {
      text: "Attendance",
      icon: <FaCheckCircle />,
      path: "/admin-dashboard/attendance",
    },
    {
      text: "Attendance Report",
      icon: <FaCheckCircle />,
      path: "/admin-dashboard/attendance-report",
    },

    {
      text: "Salary",
      icon: <FaMoneyBillWave />,
      path: "/admin-dashboard/salary/add",
    },
    { text: "Setting", icon: <FaCog />, path: "/setting" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white w-64 shadow-2xl backdrop-blur-sm border-r border-slate-700/50">
      <div>
        {/* Header with close button for mobile */}
        <div className="relative text-center py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-lg">
          <button
            onClick={toggleMobile}
            className="absolute right-4 top-4 md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <FaTimes className="text-white text-lg" />
          </button>
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
            <h2 className="text-xl font-bold text-white tracking-wide drop-shadow-lg">
              {role} Panel
            </h2>
          </div>
          <div className="w-16 h-1 bg-white/30 rounded-full mx-auto"></div>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <div
                key={item.text}
                className="relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <a
                  href={item.path}
                  onClick={() => {
                    setSelected(item.path);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105
                     ${
                       selected === item.path
                         ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
                         : "hover:bg-slate-700/50 hover:text-indigo-300 hover:shadow-md hover:border-slate-600 border border-transparent"
                     }`}
                >
                  <span
                    className={`text-xl transition-transform duration-300 ${
                      selected === item.path
                        ? "scale-110"
                        : "group-hover:scale-110"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.text}</span>

                  {/* Active indicator */}
                  {selected === item.path && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </a>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <FaUserCircle className="text-white text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {userName}
            </p>
            <p className="text-slate-400 text-xs truncate">{workTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-3 fixed top-0 left-0 w-full z-50 shadow-lg backdrop-blur-sm border-b border-slate-700/50">
        <button
          onClick={toggleMobile}
          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
        >
          <FaBars className="text-indigo-400 text-xl" />
        </button>
        <h1 className="text-lg font-semibold">{role} Panel</h1>
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <FaUserCircle className="text-white text-lg" />
        </div>
      </div>

      {/* Desktop Sidebar - Fixed z-index */}
      <div className="hidden md:block fixed left-0 top-0 h-screen z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={toggleMobile}
        >
          <div
            className="absolute left-0 top-0 h-full w-64 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gradient-to-r from-slate-900 to-slate-800 z-40 border-t border-slate-700/50 shadow-lg">
        <div className="flex justify-around px-2 py-2">
          {menuItems.slice(0, 4).map((item) => (
            <a
              key={item.text}
              href={item.path}
              onClick={() => setSelected(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${
                selected === item.path
                  ? "text-indigo-400 font-bold bg-slate-700/50 scale-105"
                  : "text-slate-400 hover:text-indigo-300 hover:bg-slate-700/30"
              }`}
            >
              <span
                className={`text-lg mb-1 transition-transform duration-300 ${
                  selected === item.path ? "scale-110" : ""
                }`}
              >
                {item.icon}
              </span>
              <span className="text-xs">{item.text}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
