import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllEmployees } from "../../services/employeeService";
import { EmployeeButton } from "../../utils/EmployeeeHelper";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const fetchEmployees = useCallback(async (pageNum = page, pageSize = limit, search = searchTerm) => {
    try {
      setLoading(true);
      const res = await getAllEmployees({ page: pageNum, limit: pageSize, search });
      if (res.data.success) {
        setEmployees(res.data.data.docs);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Extract unique departments for filter
  const departments = useMemo(() => {
    const depts = employees.map(emp => emp.department?.dep_name).filter(Boolean);
    return [...new Set(depts)];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (filterDepartment === "all") return employees;
    return employees.filter(emp => emp.department?.dep_name === filterDepartment);
  }, [employees, filterDepartment]);

  // Employee Grid Card Component
  const EmployeeGridCard = React.memo(({ emp, index }) => (
    <div className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-full -translate-y-16 translate-x-16 opacity-60 group-hover:scale-110 transition-transform duration-500"></div>
      
      {/* Card Content */}
      <div className="relative p-8 text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-emerald-400 to-teal-500 mx-auto">
            <img
              className="w-full h-full object-cover"
              src={emp.userId?.profileImage || "/api/placeholder/96/96"}
              alt={emp.userId?.name || "Employee"}
              onError={(e) => {
                e.target.src = "/api/placeholder/96/96";
              }}
            />
          </div>
          {/* Online Status */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white shadow-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          {/* Employee Number Badge */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            #{(page - 1) * limit + index + 1}
          </div>
        </div>

        {/* Employee Info */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
            {emp.userId?.name || "Unknown Employee"}
          </h3>
          
          <p className="text-gray-500 font-medium">
            {emp.userId?.email || "No email provided"}
          </p>

          {/* Department Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-full shadow-md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {emp.department?.dep_name || "No Department"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex justify-center space-x-2">
            <EmployeeButton EmpId={emp._id} />
          </div>
        </div>
      </div>
    </div>
  ));

  // Employee List Card Component
  const EmployeeListCard = React.memo(({ emp, index }) => (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-6">
          {/* Avatar & Status */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-100 shadow-md">
              <img
                className="w-full h-full object-cover"
                src={emp.userId?.profileImage || "/api/placeholder/64/64"}
                alt={emp.userId?.name || "Employee"}
                onError={(e) => {
                  e.target.src = "/api/placeholder/64/64";
                }}
              />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>

          {/* Employee Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                    {emp.userId?.name || "Unknown"}
                  </h3>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    #{(page - 1) * limit + index + 1}
                  </span>
                </div>
                
                <p className="text-gray-500 font-medium">
                  {emp.userId?.email || "No email"}
                </p>

                <div className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  {emp.department?.dep_name || "No Department"}
                </div>
              </div>

              {/* Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <EmployeeButton EmpId={emp._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  const LoadingSkeleton = React.memo(() => (
    <div className="animate-pulse">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gray-200 rounded-2xl mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-8 bg-gray-200 rounded-full w-24 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ));

  const EmptyState = React.memo(() => (
    <div className="text-center py-16">
      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
        <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Team Members Found</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">Start building your team by adding your first employee to get things rolling.</p>
      <Link
        to="/admin-dashboard/add-employee"
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 space-x-3"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Your First Employee</span>
      </Link>
    </div>
  ));

  const statsData = useMemo(() => ({
    total: employees.length,
    active: employees.length,
    showing: `${(page - 1) * limit + 1}-${Math.min(page * limit, employees.length)} of ${employees.length}`
  }), [employees.length, page, limit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-black">Team Directory</h1>
              </div>
              <p className="text-xl text-emerald-100 font-medium">Discover and connect with your amazing team members</p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-black">{statsData.total}</div>
                <div className="text-emerald-200 font-semibold">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black">{departments.length}</div>
                <div className="text-emerald-200 font-semibold">Departments</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Department Filter */}
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700 font-medium"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => handleViewModeChange("grid")}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-emerald-600 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    viewMode === "list"
                      ? "bg-white text-emerald-600 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </button>
              </div>

              {/* Add Button */}
              <Link
                to="/admin-dashboard/add-employee"
                className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Member</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : filteredEmployees.length === 0 ? (
          <EmptyState />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEmployees.map((emp, index) => (
              <EmployeeGridCard key={emp._id} emp={emp} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEmployees.map((emp, index) => (
              <EmployeeListCard key={emp._id} emp={emp} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className={`flex items-center px-4 py-3 rounded-2xl font-bold transition-all ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-md hover:shadow-lg"
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`px-4 py-3 rounded-2xl font-bold transition-all ${
                    page === num
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-md hover:shadow-lg"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className={`flex items-center px-4 py-3 rounded-2xl font-bold transition-all ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-md hover:shadow-lg"
                }`}
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;