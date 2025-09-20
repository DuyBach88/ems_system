import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmpSalary } from "../../services/salaryService";

const ViewSalary = () => {
  const { id } = useParams();
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // số record mỗi trang

  // Fetch salary data
  const fetchSalary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmpSalary(id, page, limit); // truyền page + limit
      if (response.data.success) {
        const salaryData = response.data.salaries || [];
        setSalaries(salaryData);
        setFilteredSalaries(salaryData);
        setTotalPages(response.data.pagination?.totalPages || 1);

        if (salaryData.length === 0) {
          setError(null);
        }
      } else {
        setError(response.data.message || "Failed to fetch salary data");
      }
    } catch (error) {
      setError("An error occurred while fetching salary data");
      setSalaries([]);
      setFilteredSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, [id, page]); // khi đổi page thì gọi lại

  // Filtering
  const filterSalaries = (employeeId) => {
    if (employeeId) {
      const filtered = salaries.filter((salary) =>
        salary?.employeeId?.employeeId
          ?.toLowerCase()
          ?.includes(employeeId.toLowerCase())
      );
      setFilteredSalaries(filtered);
    } else {
      setFilteredSalaries(salaries);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  let sno = (page - 1) * limit + 1; // STT theo trang

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Salary Information
          </h1>
          <p className="text-gray-600">
            View and manage employee salary records
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter by Employee ID:
            </label>
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Enter Employee ID to filter..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                onChange={(e) => filterSalaries(e.target.value)}
              />
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        ) : filteredSalaries && filteredSalaries.length > 0 ? (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {filteredSalaries.length}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">
                    Total Net Salary
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(
                      filteredSalaries.reduce(
                        (sum, salary) => sum + (salary?.netSalary || 0),
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">
                    Average Net Salary
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatCurrency(
                      filteredSalaries.length > 0
                        ? filteredSalaries.reduce(
                            (sum, salary) => sum + (salary?.netSalary || 0),
                            0
                          ) / filteredSalaries.length
                        : 0
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Salary Records */}
            <div className="grid gap-6">
              {filteredSalaries.map((salary) => (
                <div
                  key={salary?._id || `salary-${sno}`}
                  className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">
                        Record #{sno++}
                      </h3>
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                        {salary?.employeeId?.employeeId || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Pay Date
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {salary?.payDate
                          ? new Date(salary.payDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Basic Salary
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(salary?.basicSalary)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Allowances
                      </p>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatCurrency(salary?.allowances)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Deductions
                      </p>
                      <p className="text-lg font-semibold text-red-600">
                        -{formatCurrency(salary?.deductions)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 col-span-full">
                      <p className="text-sm font-medium text-gray-500">
                        Net Salary
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(salary?.netSalary)}
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No salary records found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {salaries && salaries.length === 0
                ? "No salary data available for this employee."
                : "No records match your current filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSalary;
