import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const badgeColors = {
  pending: "bg-amber-100 text-amber-800 border border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  rejected: "bg-rose-100 text-rose-800 border border-rose-200",
};

const leaveTypeColors = {
  "Sick Leave": "bg-red-50 text-red-700 border-red-200",
  "Casual Leave": "bg-blue-50 text-blue-700 border-blue-200",
  "Annual Leave": "bg-purple-50 text-purple-700 border-purple-200",
  "Maternity Leave": "bg-pink-50 text-pink-700 border-pink-200",
  "Paternity Leave": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Other": "bg-gray-50 text-gray-700 border-gray-200",
};

const leaveTypeIcons = {
  "Sick Leave": "🏥",
  "Casual Leave": "🌴",
  "Annual Leave": "✈️",
  "Maternity Leave": "👶",
  "Paternity Leave": "👨‍👩‍👧",
  "Other": "📋",
};

const pageSize = 5;

const LeaveList = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = isAdmin ? "/all" : "/my";
      const params = new URLSearchParams({
        search,
        page,
        limit: pageSize,
      });
      if (isAdmin && statusFilter !== "all")
        params.append("status", statusFilter);

      const res = await axios.get(
        `http://localhost:3000/api/leave${endpoint}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const data = res.data.data;
        setLeaves(data.docs || data);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(res.data.message || "Failed to fetch leaves");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, search, statusFilter, page]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Confirm to ${newStatus} this request?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:3000/api/leave/${id}/${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) fetchLeaves();
      else alert(res.data.message || "Failed to update status");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const nextPage = () => page < totalPages && setPage((p) => p + 1);
  const prevPage = () => page > 1 && setPage((p) => p - 1);

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isAdmin ? "Leave Management" : "My Leave Requests"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isAdmin ? "Manage all employee leave requests" : "Track and manage your leave applications"}
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={() => navigate("/employee-dashboard/add-leave")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Request
              </button>
            )}
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by type, reason, or employee..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Status Filter for Admin */}
            {isAdmin && (
              <div className="lg:w-48">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Leave Cards */}
        <div className="space-y-4">
          {leaves.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Leave Requests Found</h3>
              <p className="text-gray-600 mb-4">
                {search ? "No results match your search criteria." : "You haven't submitted any leave requests yet."}
              </p>
              {!isAdmin && !search && (
                <button
                  onClick={() => navigate("/employee-dashboard/add-leave")}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Your First Request
                </button>
              )}
            </div>
          ) : (
            leaves.map((lv, idx) => (
              <div key={lv._id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {/* Left Section */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl ${leaveTypeColors[lv.leaveType] || leaveTypeColors["Other"]}`}>
                          {leaveTypeIcons[lv.leaveType] || "📋"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{lv.leaveType}</h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeColors[lv.status]}`}>
                            {lv.status.charAt(0).toUpperCase() + lv.status.slice(1)}
                          </span>
                        </div>
                        {isAdmin && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Employee:</span> {lv.employeeId?.userId?.name || "Unknown"}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 mb-2">{lv.reason}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(lv.startDate).toLocaleDateString()} - {new Date(lv.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{calculateDays(lv.startDate, lv.endDate)} days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                        #{(page - 1) * pageSize + idx + 1}
                      </span>
                      {isAdmin && lv.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(lv._id, "approved")}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(lv._id, "rejected")}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for approved/rejected status */}
                  {lv.status !== "pending" && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Request Status</span>
                        <span className={`font-semibold ${
                          lv.status === "approved" ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {lv.status === "approved" ? "✓ Approved" : "✗ Rejected"}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            lv.status === "approved" ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gradient-to-r from-rose-500 to-red-500"
                          }`}
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-md hover:shadow-lg"
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                    page === pageNum
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            
            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-md hover:shadow-lg"
              }`}
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveList;