import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeByUserId } from "../../services/employeeService";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await getEmployeeByUserId(id);
        if (response.data.success) {
          setEmployee(response.data.employee);
        } else {
          setError("Employee not found.");
        }
      } catch (error) {
        setError(
          error.response
            ? error.response.data.message
            : "Error fetching employee details."
        );
      }
    };

    fetchEmployee();
  }, [id]);

  const handleEditProfile = () => {
    navigate("/employee-dashboard/profile");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="text-gray-600 font-medium">
            Loading employee details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Employee Profile
            </h1>
            <p className="text-gray-600">
              Comprehensive employee information and details
            </p>
          </div>
          <button
            onClick={handleEditProfile}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-8">
        {/* Profile Header - Matching the teal theme */}
        <div className="bg-gradient-to-r from-teal-600 to-green-600 px-8 py-12 relative">
          <div className="flex items-center space-x-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                <img
                  className="w-full h-full object-cover"
                  src={
                    employee.userId?.profileImage || "/api/placeholder/128/128"
                  }
                  alt={employee.userId?.name || "Employee"}
                  onError={(e) => {
                    e.target.src = "/api/placeholder/128/128";
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-white">
              <h2 className="text-4xl font-bold mb-2">
                {employee.userId?.name || "N/A"}
              </h2>
              <p className="text-teal-100 text-lg font-medium mb-1">
                Employee ID: {employee.employeeId || "N/A"}
              </p>
              <p className="text-teal-100 text-lg">
                {employee.department?.dep_name || "No Department"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Personal Information
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Full Name
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {employee.userId?.name || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Email Address
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {employee.userId?.email || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Date of Birth
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {employee.dob
                        ? new Date(employee.dob).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Gender
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {employee.gender || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Professional Information
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6 border border-teal-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-teal-700 uppercase tracking-wide">
                      Employee ID
                    </span>
                    <span className="text-2xl font-bold text-teal-800">
                      {employee.employeeId || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700 uppercase tracking-wide">
                      Department
                    </span>
                    <span className="text-xl font-bold text-green-800">
                      {employee.department?.dep_name || "No Department"}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700 uppercase tracking-wide">
                      Status
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xl font-bold text-blue-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Actions
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 font-medium rounded-xl transition-colors duration-200">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send Email
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-xl transition-colors duration-200">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-teal-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Account Status
          </h4>
          <p className="text-2xl font-bold text-teal-600 mb-1">Active</p>
          <p className="text-sm text-gray-600">Account is in good standing</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Join Date
          </h4>
          <p className="text-2xl font-bold text-green-600 mb-1">
            {employee.createdAt
              ? new Date(employee.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </p>
          <p className="text-sm text-gray-600">Member since</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Profile Score
          </h4>
          <p className="text-2xl font-bold text-blue-600 mb-1">95%</p>
          <p className="text-sm text-gray-600">Profile completion</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
