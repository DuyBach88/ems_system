// src/pages/AttendanceReport.jsx
import React, { useState, useEffect } from "react";
import { getDailyReport } from "../../services/attendanceService";

export default function AttendanceReport() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(1);
  const [loading, setLoading] = useState(false);

  const [statusCounts, setStatusCounts] = useState([]);
  const [approvalCounts, setApprovalCounts] = useState([]);

  const load = async (reset = false) => {
    setLoading(true);
    try {
      const res = await getDailyReport(date, reset ? 1 : page);
      if (res.data.success) {
        const {
          records: recs,
          totalPages,
          statusCounts,
          approvalCounts,
        } = res.data;
        setTotal(totalPages);
        setStatusCounts(statusCounts);
        setApprovalCounts(approvalCounts);
        setRecords((r) => (reset ? recs : [...r, ...recs]));
      }
    } catch (err) {
      console.error(err);
      alert("Không tải được báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  // reload on date change
  useEffect(() => {
    load(true);
  }, [date]);

  // load more on page++
  useEffect(() => {
    if (page > 1) load();
  }, [page]);

  // Calculate statistics
  const totalRecords = records.length;
  const approvedCount = records.filter(
    (r) => r.approvalStatus === "Approved"
  ).length;
  const rejectedCount = records.filter(
    (r) => r.approvalStatus === "Rejected"
  ).length;
  const pendingCount = records.filter(
    (r) => r.approvalStatus === "Pending"
  ).length;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return "✓";
      case "Rejected":
        return "✗";
      default:
        return "⏳";
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "Approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Attendance Report
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage employee attendance records
              </p>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
              <label className="text-sm font-medium text-gray-700">
                📅 Filter Date:
              </label>
              <input
                type="date"
                className="border border-gray-300 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Records */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Records
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRecords}
                </p>
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {approvedCount}
                </p>
                <p className="text-xs text-gray-500">
                  {totalRecords > 0
                    ? Math.round((approvedCount / totalRecords) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {rejectedCount}
                </p>
                <p className="text-xs text-gray-500">
                  {totalRecords > 0
                    ? Math.round((rejectedCount / totalRecords) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
                <p className="text-xs text-gray-500">
                  {totalRecords > 0
                    ? Math.round((pendingCount / totalRecords) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        {(statusCounts.length > 0 || approvalCounts.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Breakdown */}
            {statusCounts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📈 Status Breakdown
                </h3>
                <div className="space-y-3">
                  {statusCounts.map((sc) => (
                    <div
                      key={sc._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {sc._id}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {sc.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval Breakdown */}
            {approvalCounts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 Approval Breakdown
                </h3>
                <div className="space-y-3">
                  {approvalCounts.map((ac) => (
                    <div
                      key={ac._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-3 ${
                            ac._id === "Approved"
                              ? "bg-green-500"
                              : ac._id === "Rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">
                          {ac._id}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {ac.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              📝 Attendance Records
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {records.length} records for{" "}
              {new Date(date).toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((rec, i) => (
                  <tr
                    key={`${date}-${i}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rec.empCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rec.empName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rec.deptName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(rec.approvalStatus)}>
                        {getStatusIcon(rec.approvalStatus)} {rec.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More */}
          {page < totalPages && (
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Load More Records"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {records.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No records found
            </h3>
            <p className="text-gray-600">
              No attendance records found for the selected date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
