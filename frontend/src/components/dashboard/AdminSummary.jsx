import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";
const AdminSummary = () => {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await axios.get(
          `http://localhost:3000/api/dashboard/summary`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(summary.data);
        console.log(summary);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        }
        console.log(error);
      }
    };
    fetchSummary();
  }, []);
  if (!summary) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
      {/* Dashboard Overview Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Dashboard Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <SummaryCard
            icon={<FaUsers />}
            text="Total Employees"
            number={`${summary.totalEmployees}`}
            bgColor="bg-teal-600"
          />
          <SummaryCard
            icon={<FaBuilding />}
            text="Total Departments"
            number={`${summary.totalDepartments}`}
            bgColor="bg-yellow-500"
          />
          <SummaryCard
            icon={<FaMoneyBillWave />}
            text="Monthly Pay"
            number={`${summary.totalSalaries}`}
            bgColor="bg-red-600"
          />
        </div>
      </div>

      {/* Leave Details Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Leave Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SummaryCard
            icon={<FaFileAlt />}
            text="Leave Applied"
            number={`${summary.employeeAppliedForLeave}`}
            bgColor="bg-gray-300"
            textColor="text-gray-800"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Leave Approved"
            number={summary.leaveSummary.approved}
            bgColor="bg-green-500"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Leave Pending"
            number={summary.leaveSummary.pending}
            bgColor="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={summary.leaveSummary.rejected}
            bgColor="bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
