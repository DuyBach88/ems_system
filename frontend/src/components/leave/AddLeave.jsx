import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const leaveTypes = [
  { value: "Sick Leave", icon: "🏥", description: "Medical related absence" },
  { value: "Casual Leave", icon: "🌴", description: "Personal time off" },
  { value: "Annual Leave", icon: "✈️", description: "Vacation/Holiday leave" },
  { value: "Maternity Leave", icon: "👶", description: "Maternity care leave" },
  { value: "Paternity Leave", icon: "👨‍👩‍👧", description: "Paternity care leave" },
  { value: "Other", icon: "📋", description: "Other types of leave" },
];

const AddLeave = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [leave, setLeave] = useState({
    userId: user._id,
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) =>
    setLeave((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (new Date(leave.startDate) > new Date(leave.endDate)) {
      setError("End date cannot be earlier than start date");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/leave/add",
        leave,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        navigate("/employee-dashboard/leaves");
      } else {
        setError(res.data.message || "Failed to apply leave");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/leaves");
  };

  const calculateDays = () => {
    if (leave.startDate && leave.endDate) {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const selectedLeaveType = leaveTypes.find(type => type.value === leave.leaveType);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Request Leave</h1>
              <p className="text-gray-600 mt-1">Submit your leave application with details</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-teal-600 to-green-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Leave Application</h2>
                  <p className="text-teal-100">Fill in the details for your leave request</p>
                </div>
              </div>
              {calculateDays() > 0 && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{calculateDays()}</div>
                  <div className="text-teal-100 text-sm">Days Requested</div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Leave Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Leave Type
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaveTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      leave.leaveType === type.value
                        ? 'border-teal-500 bg-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleChange("leaveType", type.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{type.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{type.value}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                      {leave.leaveType === type.value && (
                        <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Leave Duration
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      value={leave.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      value={leave.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      min={leave.startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Duration Summary */}
              {leave.startDate && leave.endDate && (
                <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-teal-800">
                        Leave duration: {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-teal-600">
                      {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reason/Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Reason for Leave
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <textarea
                  rows={5}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  value={leave.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  placeholder={`Please provide details about your ${selectedLeaveType ? selectedLeaveType.value.toLowerCase() : 'leave'} request...`}
                  required
                />
              </div>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span>Provide clear and detailed reason for your leave request</span>
                <span>{leave.reason.length}/500</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setLeave({
                      userId: user._id,
                      leaveType: "",
                      startDate: "",
                      endDate: "",
                      reason: "",
                    });
                    setError("");
                  }}
                  className="px-6 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading || !leave.leaveType || !leave.startDate || !leave.endDate || !leave.reason}
                  className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    loading || !leave.leaveType || !leave.startDate || !leave.endDate || !leave.reason
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 focus:ring-teal-500 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Submit Request</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-teal-800 mb-2">Leave Application Guidelines</h3>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Submit your leave request at least 3 days in advance (except for sick leave)</li>
                <li>• Provide detailed reason for your leave request</li>
                <li>• Check your leave balance before submitting</li>
                <li>• You will receive a notification once your request is processed</li>
                <li>• For urgent matters, contact your supervisor directly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeave;