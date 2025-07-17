import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmpSalary } from "../../services/salaryService";
// Mock service

const MySalary = () => {
  const { id } = useParams(); // Extract the employee ID from URL
  const [salaries, setSalaries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [filteredSalaries, setFilteredSalaries] = useState(null);

  // Fetch salary data for the employee
  const fetchSalary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmpSalary(id);
      console.log(response.data);
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while fetching salary data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, [id]);

  // Filter salaries by period
  const filterByPeriod = (period) => {
    if (!salaries) return;

    const now = new Date();
    let filtered = salaries;

    switch (period) {
      case "thisMonth":
        filtered = salaries.filter((salary) => {
          const payDate = new Date(salary.payDate);
          return (
            payDate.getMonth() === now.getMonth() &&
            payDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      case "lastMonth":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        filtered = salaries.filter((salary) => {
          const payDate = new Date(salary.payDate);
          return (
            payDate.getMonth() === lastMonth.getMonth() &&
            payDate.getFullYear() === lastMonth.getFullYear()
          );
        });
        break;
      case "last3Months":
        const threeMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          1
        );
        filtered = salaries.filter((salary) => {
          const payDate = new Date(salary.payDate);
          return payDate >= threeMonthsAgo;
        });
        break;
      default:
        filtered = salaries;
    }

    setFilteredSalaries(filtered);
    setSelectedPeriod(period);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get latest salary for highlight
  const getLatestSalary = () => {
    if (!filteredSalaries || filteredSalaries.length === 0) return null;
    return filteredSalaries.reduce((latest, current) =>
      new Date(current.payDate) > new Date(latest.payDate) ? current : latest
    );
  };

  const latestSalary = getLatestSalary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Salary
              </h1>
              <p className="text-gray-600 text-lg">
                View and manage your salary records
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl">
                <div className="text-center">
                  <p className="text-sm opacity-90">Total Salaries</p>
                  <p className="text-2xl font-bold">
                    {filteredSalaries ? filteredSalaries.length : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Filter by Period:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "thisMonth", label: "This Month" },
                { value: "lastMonth", label: "Last Month" },
                { value: "last3Months", label: "three Months" },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => filterByPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === period.value
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 text-lg">Loading...</span>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-400"
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
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredSalaries && filteredSalaries.length > 0 ? (
          <div className="space-y-8">
            {/* Latest Salary Highlight */}
            {latestSalary && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Latest Salary</h2>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
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
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-sm opacity-90">Basic Salary</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(latestSalary.basicSalary)}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-sm opacity-90">Allowances</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(latestSalary.allowances)}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-sm opacity-90">Deductions</p>
                    <p className="text-2xl font-bold">
                      -{formatCurrency(latestSalary.deductions)}
                    </p>
                  </div>
                  <div className="bg-white/30 rounded-xl p-4 border-2 border-white/50">
                    <p className="text-sm opacity-90">Net Salary</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(latestSalary.netSalary)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Salaries</p>
                      <p className="text-3xl font-bold">
                        {filteredSalaries.length}
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Net Salary</p>
                      <p className="text-3xl font-bold">
                        {formatCurrency(
                          filteredSalaries.reduce(
                            (sum, salary) => sum + salary.netSalary,
                            0
                          )
                        )}
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Average Net Salary</p>
                      <p className="text-3xl font-bold">
                        {formatCurrency(
                          filteredSalaries.reduce(
                            (sum, salary) => sum + salary.netSalary,
                            0
                          ) / filteredSalaries.length
                        )}
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary History */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Lịch Sử Lương
              </h2>
              <div className="space-y-4">
                {filteredSalaries
                  .sort((a, b) => new Date(b.payDate) - new Date(a.payDate))
                  .map((salary, index) => (
                    <div
                      key={salary._id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Tháng {new Date(salary.payDate).getMonth() + 1}/
                              {new Date(salary.payDate).getFullYear()}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(salary.payDate).toLocaleDateString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(salary.netSalary)}
                          </p>
                          <p className="text-sm text-gray-500"> Net Salary</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">
                            Lương Cơ Bản
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(salary.basicSalary)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">
                            Phụ Cấp
                          </p>
                          <p className="text-lg font-semibold text-blue-600">
                            {formatCurrency(salary.allowances)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">
                            Khấu Trừ
                          </p>
                          <p className="text-lg font-semibold text-red-600">
                            -{formatCurrency(salary.deductions)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No salary
            </h3>
            <p className="text-gray-600">
              {salaries && salaries.length === 0
                ? "Chưa có thông tin lương cho nhân viên này."
                : "Không có bản ghi nào khớp với bộ lọc hiện tại."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySalary;
