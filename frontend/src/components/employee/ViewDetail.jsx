import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeByUserId } from "../../services/employeeService";

const ViewDetail = () => {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border border-red-100">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Error Occurred</h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md mx-4">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-600 mb-4"></div>
            <p className="text-slate-600 font-medium">Loading employee details...</p>
          </div>
        </div>
      </div>
    );
  }

  const InfoCard = ({ icon, label, value, accent = false }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border ${accent ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50' : 'border-slate-100'} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${accent ? 'bg-blue-100' : 'bg-slate-100'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-lg font-semibold text-slate-800 mt-1 break-words">{value || "Not specified"}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200 group"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Employee Profile</h1>
                <p className="text-slate-600 mt-1">Comprehensive employee information</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <span>Export</span>
              </button>
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
            <div className="relative flex items-center space-x-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-slate-400 to-slate-600">
                  <img
                    className="w-full h-full object-cover"
                    src={employee.userId?.profileImage || "/api/placeholder/128/128"}
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
              
              <div className="flex-1 text-white">
                <h2 className="text-3xl font-bold mb-2">{employee.userId?.name || "Unknown Employee"}</h2>
                <p className="text-xl text-slate-200 mb-1">{employee.department?.dep_name || "No Department"}</p>
                <p className="text-slate-300 mb-4">Employee ID: {employee.employeeId || "N/A"}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-200">{employee.userId?.email || "No email"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            accent
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>}
            label="Full Name"
            value={employee.userId?.name}
          />

          <InfoCard
            icon={<svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>}
            label="Employee ID"
            value={employee.employeeId}
          />

          <InfoCard
            icon={<svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>}
            label="Email Address"
            value={employee.userId?.email}
          />

          <InfoCard
            icon={<svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7l4 8 4-8m-4 8v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" />
            </svg>}
            label="Gender"
            value={employee.gender}
          />

          <InfoCard
            icon={<svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-6 0V7" />
            </svg>}
            label="Department"
            value={employee.department?.dep_name}
          />

          <InfoCard
            icon={<svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-6 0V7" />
            </svg>}
            label="Date of Birth"
            value={employee.dob ? new Date(employee.dob).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }) : null}
          />
        </div>

        {/* Additional Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-6 py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl transition-colors duration-200 space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Generate Report</span>
            </button>
            <button className="flex items-center justify-center px-6 py-4 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-xl transition-colors duration-200 space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Send Message</span>
            </button>
            <button className="flex items-center justify-center px-6 py-4 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-xl transition-colors duration-200 space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Schedule Meeting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetail;