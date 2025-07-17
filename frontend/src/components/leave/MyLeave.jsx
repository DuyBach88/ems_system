import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const badgeColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const pageSize = 5; // records per page

const LeaveList = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  /* ---------------- State ---------------- */
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  /* ---------------- Fetch ---------------- */
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
        // mongoose-paginate-v2 style { docs, totalPages }
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

  /* ------------- Admin status change ------------- */
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

  /* ---------------- Pagination helpers ---------------- */
  const nextPage = () => page < totalPages && setPage((p) => p + 1);
  const prevPage = () => page > 1 && setPage((p) => p - 1);

  /* ---------------- Render ---------------- */
  return (
    <div className="max-w-7xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex-shrink-0">
          {isAdmin ? "All Leave Requests" : "My Leave Requests"}
        </h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by type / reason…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-grow md:flex-grow-0 border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
          />

          {/* Status filter for admin */}
          {isAdmin && (
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          )}

          {/* New request (employee only) */}
          {!isAdmin && (
            <button
              onClick={() => navigate("/employee-dashboard/add-leave")}
              className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md"
            >
              + New
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-center mt-10">Loading…</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-10">{error}</p>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    From
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    To
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {leaves.map((lv, idx) => (
                  <tr key={lv._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lv.employeeId?.userId?.name || "-"}
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lv.leaveType}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{lv.reason}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(lv.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(lv.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          badgeColors[lv.status]
                        }`}
                      >
                        {lv.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 whitespace-nowrap space-x-2">
                        {lv.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(lv._id, "approved")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(lv._id, "rejected")
                              }
                              className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-3 rounded"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaveList;
