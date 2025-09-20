import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmpSalary } from "../../services/salaryService";

const MySalary = () => {
  const { id } = useParams(); // Employee ID from URL (or take from AuthContext/localStorage if self)
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Filter
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const fetchSalary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getEmpSalary(id, page, limit);
      if (response.data.success) {
        const salaryData = response.data.salaries || [];
        setSalaries(salaryData);
        setFilteredSalaries(salaryData);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError(response.data.message || "Failed to fetch salary data");
        setSalaries([]);
        setFilteredSalaries([]);
      }
    } catch (err) {
      setError("An error occurred while fetching salary data");
      setSalaries([]);
      setFilteredSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, [id, page]);

  // Filter by period
  const filterByPeriod = (period) => {
    if (!salaries) return;

    const now = new Date();
    let filtered = salaries;

    switch (period) {
      case "thisMonth":
        filtered = salaries.filter((s) => {
          const d = new Date(s.payDate);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        });
        break;
      case "lastMonth":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        filtered = salaries.filter((s) => {
          const d = new Date(s.payDate);
          return (
            d.getMonth() === lastMonth.getMonth() &&
            d.getFullYear() === lastMonth.getFullYear()
          );
        });
        break;
      case "last3Months":
        const threeMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          1
        );
        filtered = salaries.filter(
          (s) => new Date(s.payDate) >= threeMonthsAgo
        );
        break;
      default:
        filtered = salaries;
    }

    setFilteredSalaries(filtered);
    setSelectedPeriod(period);
  };

  // Format currency (USD like Admin page)
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);

  // Latest salary
  const latestSalary =
    filteredSalaries && filteredSalaries.length > 0
      ? filteredSalaries.reduce((latest, curr) =>
          new Date(curr.payDate) > new Date(latest.payDate) ? curr : latest
        )
      : null;

  let sno = (page - 1) * limit + 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Salary</h1>
          <p className="text-gray-600">View and manage your salary records</p>
        </div>

        {/* Filter */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className="text-sm font-semibold text-gray-700">
              Filter by Period:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "thisMonth", label: "This Month" },
                { value: "lastMonth", label: "Last Month" },
                { value: "last3Months", label: "Last 3 Months" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => filterByPeriod(p.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedPeriod === p.value
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading salary data...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        ) : filteredSalaries && filteredSalaries.length > 0 ? (
          <div className="space-y-6">
            {/* Latest salary highlight */}
            {latestSalary && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Latest Salary</h2>
                  <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                    {new Date(latestSalary.payDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/20 rounded-lg p-4">
                    <p>Basic Salary</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(latestSalary.basicSalary)}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p>Allowances</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(latestSalary.allowances)}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p>Deductions</p>
                    <p className="text-xl font-bold">
                      -{formatCurrency(latestSalary.deductions)}
                    </p>
                  </div>
                  <div className="bg-white/30 rounded-lg p-4 border border-white/50">
                    <p>Net Salary</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(latestSalary.netSalary)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p>Total Records</p>
                  <p className="text-2xl font-bold">
                    {filteredSalaries.length}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p>Total Net Salary</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      filteredSalaries.reduce((sum, s) => sum + s.netSalary, 0)
                    )}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p>Average Net Salary</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      filteredSalaries.reduce(
                        (sum, s) => sum + s.netSalary,
                        0
                      ) / filteredSalaries.length
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Salary records */}
            <div className="grid gap-6">
              {filteredSalaries.map((s) => (
                <div
                  key={s._id || `salary-${sno}`}
                  className="bg-white shadow-sm rounded-lg"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 flex justify-between items-center">
                    <h3 className="text-lg text-white">Record #{sno++}</h3>
                    <span className="text-sm text-white">
                      {new Date(s.payDate).toLocaleDateString("en-US")}
                    </span>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <p>Basic Salary</p>
                      <p className="font-bold text-green-600">
                        {formatCurrency(s.basicSalary)}
                      </p>
                    </div>
                    <div>
                      <p>Allowances</p>
                      <p className="font-bold text-blue-600">
                        {formatCurrency(s.allowances)}
                      </p>
                    </div>
                    <div>
                      <p>Deductions</p>
                      <p className="font-bold text-red-600">
                        -{formatCurrency(s.deductions)}
                      </p>
                    </div>
                    <div className="col-span-full bg-gray-50 rounded-lg p-4">
                      <p>Net Salary</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(s.netSalary)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
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
                )
              )}

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
        ) : (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              No salary records
            </h3>
            <p className="text-gray-600">
              You don’t have any salary records yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySalary;
