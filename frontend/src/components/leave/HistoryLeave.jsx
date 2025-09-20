import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const badgeColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const pageSize = 5;

const EmployeeLeaveHistory = () => {
  const { empId } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: pageSize, search });
      if (statusFilter !== "all") params.append("status", statusFilter);
      const res = await axios.get(
        `http://localhost:3000/api/leave/employee/${empId}?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const { employee: empInfo, leaves: lv } = res.data.data;
        setEmployee(empInfo);
        setLeaves(lv.docs || lv);
        setTotalPages(lv.totalPages || 1);
      } else setError(res.data.message || "Failed to fetch data");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, search]);

  const nextPage = () => page < totalPages && setPage((p) => p + 1);
  const prevPage = () => page > 1 && setPage((p) => p - 1);

  if (loading) return <p className="text-center mt-10">Loading…</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={employee?.userId.profileImage}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {employee?.userId.name}
          </h2>
          <p className="text-sm text-gray-600">{employee?.userId.email}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search reason…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-grow md:flex-grow-0 border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
          />
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
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
        >
          ← Back
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reason
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                From
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {leaves.map((lv, idx) => {
              const start = new Date(lv.startDate);
              const end = new Date(lv.endDate);
              const diffDays = Math.round((end - start) / 86400000) + 1;
              return (
                <tr key={lv._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap max-w-xs truncate"
                    title={lv.reason}
                  >
                    {lv.reason}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {start.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {end.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {diffDays}
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
                </tr>
              );
            })}
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
    </div>
  );
};

export default EmployeeLeaveHistory;
