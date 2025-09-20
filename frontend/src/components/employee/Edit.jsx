import React, { useState, useEffect } from "react";
import { fetchDepartments } from "../../utils/EmployeeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEmployeeByUserId,
  updateEmployee,
} from "../../services/employeeService";
import { toast } from "react-toastify";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    salary: "",
    department: "",
  });
  const [photoFile, setPhotoFile] = useState(null); // ảnh mới nếu có
  const [currentPhoto, setCurrentPhoto] = useState(""); // ảnh hiện tại

  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const response = await getEmployeeByUserId(id);
        const data = response.data.employee;

        setFormData({
          name: data.userId.name,
          designation: data.designation,
          salary: data.salary,
          department: data.department?._id || "",
        });

        // 🔹 lưu ảnh hiện tại để hiển thị
        setCurrentPhoto(data.userId.profileImage || "");
      } catch (err) {
        console.error("Failed to load employee data:", err);
        setError("Error fetching employee data.");
      }
    };

    const loadDepartments = async () => {
      try {
        const deptData = await fetchDepartments();
        setDepartments(deptData || []);
      } catch (err) {
        console.error("Failed to load departments:", err);
        setDepartments([]);
      }
    };

    loadEmployeeData();
    loadDepartments();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        payload.append(key, formData[key]);
      }
    });

    if (photoFile) {
      payload.append("photo", photoFile); // 🔹 thêm ảnh mới nếu có
    }

    try {
      const res = await updateEmployee(id, payload);

      if (res.data.success) {
        toast.success("Employee updated successfully 🎉");
        navigate("/admin-dashboard/employees");
      } else {
        setError(res.data.message || "Failed to update employee");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin-dashboard/employees");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-xl mb-8 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit Employee
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Update employee details below
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Employee Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Designation */}
              <div>
                <label
                  htmlFor="designation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Designation *
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Department */}
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.dep_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary */}
              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Salary
                </label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Profile Photo */}
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Photo
                </label>
                {currentPhoto && (
                  <div className="mb-3">
                    <img
                      src={currentPhoto}
                      alt="Current avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Updating..." : "Update Employee"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
