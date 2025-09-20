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
  Other: "bg-gray-50 text-gray-700 border-gray-200",
};

const leaveTypeIcons = {
  "Sick Leave": "🏥",
  "Casual Leave": "🌴",
  "Annual Leave": "✈️",
  "Maternity Leave": "👶",
  "Paternity Leave": "👨‍👩‍👧",
  Other: "📋",
};

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
  const [limit, setLimit] = useState(10); // mặc định 10
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = isAdmin ? "/all" : "/my";
      const params = new URLSearchParams({
        search,
        page,
        limit,
      });
      if (isAdmin && statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const res = await axios.get(
        `http://localhost:3000/api/leave${endpoint}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const data = res.data.data;
        setLeaves(data.docs || []);
        setTotalPages(data.totalPages || 1);
        setLimit(data.limit || 10);
        setTotalDocs(data.totalDocs || 0);
      } else {
        setError(res.data.message || "Failed to fetch leaves");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, search, statusFilter, page, limit]);

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isAdmin ? "Leave Management" : "My Leave Requests"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isAdmin
                ? `Manage all employee leave requests (${totalDocs} total)`
                : `Track and manage your leave applications (${totalDocs} total)`}
            </p>
          </div>
          {!isAdmin && (
            <button
              onClick={() => navigate("/employee-dashboard/add-leave")}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Request
            </button>
          )}
        </div>

        {/* Leave Cards */}
        <div className="space-y-4">
          {leaves.length === 0 ? (
            <p>No leave requests found.</p>
          ) : (
            leaves.map((lv, idx) => (
              <div
                key={lv._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      {leaveTypeIcons[lv.leaveType] || "📋"} {lv.leaveType}
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          badgeColors[lv.status]
                        }`}
                      >
                        {lv.status}
                      </span>
                    </h3>
                    {isAdmin && (
                      <p className="text-sm text-gray-600">
                        Employee: {lv.employeeId?.userId?.name || "Unknown"}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">{lv.reason}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(lv.startDate).toLocaleDateString()} -{" "}
                      {new Date(lv.endDate).toLocaleDateString()} •{" "}
                      {calculateDays(lv.startDate, lv.endDate)} days
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                      #{(page - 1) * limit + idx + 1}
                    </span>
                    {isAdmin && lv.status === "pending" && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleStatusChange(lv._id, "approved")}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(lv._id, "rejected")}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 rounded-lg border ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-700"
            }`}
          >
            Prev
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded-lg border ${
                page === num
                  ? "bg-blue-500 text-white font-semibold"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
            >
              {num}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded-lg border ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveList;
