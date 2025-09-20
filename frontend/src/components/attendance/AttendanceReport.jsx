// src/pages/AttendanceReport.jsx
import React, { useState, useEffect } from "react";
import { getDailyReport } from "../../services/attendanceService";

export default function AttendanceReport() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // số record mỗi trang
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [statusCounts, setStatusCounts] = useState([]);
  const [approvalCounts, setApprovalCounts] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getDailyReport(date, page, limit);
      if (res.data.success) {
        const {
          records: recs,
          totalPages,
          statusCounts,
          approvalCounts,
        } = res.data;
        setRecords(recs);
        setTotalPages(totalPages);
        setStatusCounts(statusCounts);
        setApprovalCounts(approvalCounts);
      }
    } catch (err) {
      console.error(err);
      alert("Không tải được báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  // reload khi đổi date hoặc page
  useEffect(() => {
    load();
  }, [date, page]);

  // Tổng hợp thống kê từ records của trang hiện tại
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
                onChange={(e) => {
                  setPage(1); // reset về trang đầu
                  setDate(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Records */}
          <StatCard
            icon="👥"
            label="Total Records"
            value={totalRecords}
            color="blue"
          />
          <StatCard
            icon="✅"
            label="Approved"
            value={approvedCount}
            percent={
              totalRecords > 0
                ? Math.round((approvedCount / totalRecords) * 100)
                : 0
            }
            color="green"
          />
          <StatCard
            icon="❌"
            label="Rejected"
            value={rejectedCount}
            percent={
              totalRecords > 0
                ? Math.round((rejectedCount / totalRecords) * 100)
                : 0
            }
            color="red"
          />
          <StatCard
            icon="⏳"
            label="Pending"
            value={pendingCount}
            percent={
              totalRecords > 0
                ? Math.round((pendingCount / totalRecords) * 100)
                : 0
            }
            color="yellow"
          />
        </div>

        {/* Additional Statistics */}
        {(statusCounts.length > 0 || approvalCounts.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {statusCounts.length > 0 && (
              <BreakdownCard
                title="📈 Status Breakdown"
                data={statusCounts}
                colors={{ default: "bg-blue-500" }}
              />
            )}
            {approvalCounts.length > 0 && (
              <BreakdownCard
                title="📋 Approval Breakdown"
                data={approvalCounts}
                colors={{
                  Approved: "bg-green-500",
                  Rejected: "bg-red-500",
                  Pending: "bg-yellow-500",
                }}
              />
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
                      {(page - 1) * limit + i + 1}
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

          <div className="flex justify-center items-center space-x-2 mt-6">
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

// 🔹 Component nhỏ để gọn code
function StatCard({ icon, label, value, percent, color }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p
            className={`text-2xl font-bold ${
              color === "green"
                ? "text-green-600"
                : color === "red"
                ? "text-red-600"
                : color === "yellow"
                ? "text-yellow-600"
                : "text-gray-900"
            }`}
          >
            {value}
          </p>
          {percent !== undefined && (
            <p className="text-xs text-gray-500">{percent}%</p>
          )}
        </div>
      </div>
    </div>
  );
}

function BreakdownCard({ title, data, colors }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d._id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  colors[d._id] || colors.default
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700">{d._id}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
