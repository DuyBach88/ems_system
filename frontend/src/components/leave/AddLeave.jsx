import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const leaveTypes = [
  "Sick Leave",
  "Casual Leave",
  "Annual Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Other",
];

const AddLeave = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [leave, setLeave] = useState({
    userId: user._id,
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) =>
    setLeave((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/leave/add",
        leave,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        navigate("/employee-dashboard/leaves");
      } else {
        setError(res.data.message || "Failed to apply leave");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Request for Leave
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leave Type */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Leave Type
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
            value={leave.leaveType}
            onChange={(e) => handleChange("leaveType", e.target.value)}
            required
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
              value={leave.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
              value={leave.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows="4"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            value={leave.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            placeholder="Enter reason for leave"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="
    w-full 
    bg-gradient-to-r from-green-500 to-green-600 
    hover:from-green-700 hover:to-green-700 
    text-white font-medium 
    py-3 rounded-xl 
    transition-transform transform 
    hover:scale-105 
    shadow-lg 
    disabled:opacity-60
  "
        >
          {loading ? "Submitting..." : "Add Leave"}
        </button>
      </form>
    </div>
  );
};

export default AddLeave;
