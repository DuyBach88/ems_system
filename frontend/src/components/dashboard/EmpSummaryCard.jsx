import React, { useContext } from "react";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const EmpSummaryCard = () => {
  const { user } = useContext(AuthContext);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative overflow-hidden">
      {/* Main Card */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <FaUser className="text-2xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">
                {getGreeting()}
              </p>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.role || "Employee"}</p>
            </div>
          </div>

          {/* Decorative accent line */}
          <div className="mt-6 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
export default EmpSummaryCard;
