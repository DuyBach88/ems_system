import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmpSalary } from "../../services/salaryService";

const ViewSalary = () => {
  const { id } = useParams(); // Extract the employee ID from URL
  const [salaries, setSalaries] = useState([]); // Initialize as empty array instead of null
  const [filteredSalaries, setFilteredSalaries] = useState([]); // Initialize as empty array instead of null
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  let sno = 1; // Serial number for salary entries

  // Fetch salary data for the employee
  const fetchSalary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmpSalary(id); // Fetch data using the `id` parameter
      console.log(response.data);
      if (response.data.success) {
        // Handle case where salary data might be null or empty
        const salaryData = response.data.salary || [];
        setSalaries(salaryData); // Set salaries state with the data
        setFilteredSalaries(salaryData); // Set filtered salaries
      } else {
        // Handle case where API returns success: false
        setError(response.data.message || "Failed to fetch salary data");
        setSalaries([]);
        setFilteredSalaries([]);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.message); // Set error message if the request fails
      } else {
        setError("An error occurred while fetching salary data");
      }
      setSalaries([]);
      setFilteredSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary(); // Fetch salary data when the component mounts
  }, [id]); // Dependency on `id`, refetch if the `id` changes

  // Filtering function (can be adjusted for more complex filters)
  const filterSalaries = (employeeId) => {
    if (employeeId) {
      const filtered = salaries.filter((salary) =>
        salary?.employeeId?.employeeId
          ?.toLowerCase()
          ?.includes(employeeId.toLowerCase())
      );
      setFilteredSalaries(filtered); // Update state with filtered results
    } else {
      setFilteredSalaries(salaries); // If no filter, show all salaries
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Mapping through filtered salaries to display them
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

        {/* Filter Section */}
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
                onChange={(e) => filterSalaries(e.target.value)} // Trigger filter on change
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading salary data...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredSalaries && filteredSalaries.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Stats */}
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

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Employee ID
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {salary?.employeeId?.employeeId || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
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
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Basic Salary
                          </p>
                          <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(salary?.basicSalary)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Allowances
                          </p>
                          <p className="text-lg font-semibold text-blue-600">
                            {formatCurrency(salary?.allowances)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Deductions
                          </p>
                          <p className="text-lg font-semibold text-red-600">
                            -{formatCurrency(salary?.deductions)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Net Salary
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(salary?.netSalary)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
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
