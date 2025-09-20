import React, { useState, useEffect } from "react";
import {
  getAllAttendance,
  approveAttendance,
  approveMultiple,
  deleteAttendance,
  manualCheckout,
} from "../../services/attendanceService";

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const STATUS = {
    Approved: "Approved",
    Pending: "Pending",
    Rejected: "Rejected",
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAllAttendance(page, limit);
      if (res.data.success) {
        setRecords(res.data.records);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error(err);
      alert("Không tải được dữ liệu chấm công.");
    } finally {
      setLoading(false);
    }
  };

  //  Reload khi page thay đổi
  useEffect(() => {
    loadData();
  }, [page]);

  // Thống kê (chỉ trong trang hiện tại)
  const statCount = (s) => records.filter((r) => r.approvalStatus === s).length;
  const stats = {
    total: records.length,
    approved: statCount(STATUS.Approved),
    pending: statCount(STATUS.Pending),
    rejected: statCount(STATUS.Rejected),
  };

  // Lọc & chọn
  const filtered = records.filter((r) =>
    filterStatus === "All" ? true : r.approvalStatus === filterStatus
  );
  const toggleOne = (id) =>
    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  const toggleAll = (c) =>
    setSelectedIds(c ? new Set(filtered.map((r) => r._id)) : new Set());

  // Hành động
  const doApprove = (id) =>
    approveAttendance(id, STATUS.Approved).then(loadData);
  const doReject = (id) =>
    approveAttendance(id, STATUS.Rejected).then(loadData);
  const doBulkApprove = () =>
    approveMultiple([...selectedIds], STATUS.Approved).then(() => {
      setSelectedIds(new Set());
      loadData();
    });
  const doDelete = (id) => deleteAttendance(id).then(loadData);
  const doManualCheckout = (id) => manualCheckout(id).then(loadData);

  // Xuất CSV
  const exportCSV = () => {
    const rows = [
      [
        "EmpCode",
        "Name",
        "Date",
        "TotalHours",
        "Status",
        "CheckIn",
        "CheckOut",
      ].join(","),
      ...filtered.map((r) => {
        const ins = r.times
          .map((t) => (t.in ? new Date(t.in).toLocaleTimeString() : "-"))
          .join(" | ");
        const outs = r.times
          .map((t) => (t.out ? new Date(t.out).toLocaleTimeString() : "-"))
          .join(" | ");
        return [
          r.empCode,
          r.empName,
          new Date(r.date).toLocaleDateString(),
          r.totalHours.toFixed(2),
          r.approvalStatus,
          `"${ins}"`,
          `"${outs}"`,
        ].join(",");
      }),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "attendance_report.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Tiêu đề */}
        <div>
          <h1 className="text-3xl font-bold">MANAGER ATTENDANCE</h1>
          <p className="text-gray-600">Overview & approvals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <StatCard label="Total" value={stats.total} icon="📋" />
          <StatCard label="Approved" value={stats.approved} icon="✅" />
          <StatCard label="Pending" value={stats.pending} icon="⏳" />
          <StatCard label="Rejected" value={stats.rejected} icon="❌" />
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-wrap items-center gap-4">
          <button
            disabled={!selectedIds.size}
            onClick={doBulkApprove}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedIds.size
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Approve Selected ({selectedIds.size})
          </button>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option>All</option>
            <option>{STATUS.Approved}</option>
            <option>{STATUS.Pending}</option>
            <option>{STATUS.Rejected}</option>
          </select>

          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>

        {/* Records */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Records</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  filtered.length > 0 && selectedIds.size === filtered.length
                }
                onChange={(e) => toggleAll(e.target.checked)}
              />
              Select All
            </label>
          </div>

          {loading ? (
            <p>Loading…</p>
          ) : filtered.length === 0 ? (
            <p>No records found.</p>
          ) : (
            filtered.map((rec, i) => {
              const hasComplete = rec.times.some((t) => t.in && t.out);
              const isPending =
                rec.approvalStatus === STATUS.Pending && hasComplete;
              const isIncomplete =
                rec.approvalStatus === STATUS.Pending && !hasComplete;

              return (
                <div
                  key={rec._id}
                  className={`flex justify-between items-center rounded-lg border p-4 ${
                    selectedIds.has(rec._id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(rec._id)}
                      onChange={() => toggleOne(rec._id)}
                    />
                    <div>
                      <p className="font-medium">
                        {(page - 1) * limit + i + 1}. {rec.empName}
                      </p>
                      <p className="text-xs text-gray-600">
                        ID {rec.empCode} •{" "}
                        {new Date(rec.date).toLocaleDateString()}
                      </p>
                      {/* Hiển thị In/Out */}
                      <div className="mt-1 text-sm text-gray-700">
                        {rec.times.map((t, j) => (
                          <div key={j}>
                            <span>
                              In:{" "}
                              {t.in ? new Date(t.in).toLocaleTimeString() : "-"}
                            </span>
                            ,{" "}
                            <span>
                              Out:{" "}
                              {t.out
                                ? new Date(t.out).toLocaleTimeString()
                                : "-"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        rec.approvalStatus === STATUS.Approved
                          ? "bg-green-100 text-green-800"
                          : rec.approvalStatus === STATUS.Pending
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {rec.approvalStatus}
                    </span>

                    {/* Manual checkout nếu thiếu out */}
                    {isIncomplete && (
                      <button
                        onClick={() => doManualCheckout(rec._id)}
                        className="px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
                      >
                        Manual Checkout
                      </button>
                    )}

                    {/* Approve / Reject chỉ khi hoàn chỉnh */}
                    {isPending && (
                      <>
                        <button
                          onClick={() => doApprove(rec._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => doReject(rec._id)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {/* Delete chỉ khi hoàn chỉnh & pending */}
                    <button
                      onClick={() =>
                        window.confirm("Delete?") && doDelete(rec._id)
                      }
                      disabled={!isPending}
                      className={`px-2 py-1 rounded text-sm ${
                        isPending
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
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
    </div>
  );
}

// StatCard component
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <div className="text-3xl">{icon}</div>
      <p className="mt-2 text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
