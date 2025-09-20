import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllDepartments } from "../../services/departmentService";
import { getEmployeesByDepartment } from "../../services/employeeService";
import { createSalary } from "../../services/salaryService";

const AddSalary = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    employeeId: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });

  // 🔹 load departments khi mount
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await getAllDepartments({ page: 1, limit: 100 });
        if (res.data.success) {
          setDepartments(res.data.data.docs);
        }
      } catch (err) {
        toast.error("Không load được danh sách phòng ban");
      }
    };
    loadDepartments();
  }, []);

  // 🔹 change input chung
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = async (e) => {
    const depId = e.target.value;
    setFormData((prev) => ({ ...prev, department: depId, employeeId: "" }));
    if (!depId) {
      setEmployees([]);
      return;
    }
    try {
      const emps = await getEmployeesByDepartment(depId);
      setEmployees(emps || []);
    } catch (err) {
      toast.error("Do not load employees for this department");
    }
  };

  // 🔹 submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createSalary(formData);
      if (res.data.success) {
        toast.success("Salary added successfully");
        navigate("/admin-dashboard/employees"); 
      } else {
        toast.error(res.data.message || "Failed to add salary");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add salary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">
            Add New Salary
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Department + Employee */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleDepartmentChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.dep_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Employee
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeId} - {emp.userId?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Basic Salary + Allowances */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Basic Salary
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Insert Salary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Allowances
                </label>
                <input
                  type="number"
                  name="allowances"
                  value={formData.allowances}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Monthly Allowances"
                />
              </div>
            </div>

            {/* Deductions + Pay Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Deductions
                </label>
                <input
                  type="number"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Monthly Deductions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pay Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="payDate"
                    value={formData.payDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <FaCalendarAlt className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                {loading ? "Saving..." : "Add Salary"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSalary;
