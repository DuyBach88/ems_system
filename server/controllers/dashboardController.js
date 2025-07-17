import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import LeaveRequest from "../models/Leave.js";

const getDashboard = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({});
    const totalDepartments = await Department.countDocuments({});
    const totalSalaries = await Employee.aggregate([
      { $group: { _id: "null", totalSalaries: { $sum: "$salary" } } },
    ]);
    const employeeAppliedForLeave = await LeaveRequest.countDocuments({});
    const leaveStatus = await LeaveRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const leaveSummary = {
      appliedFor: employeeAppliedForLeave,
      pending: leaveStatus.find((item) => item._id === "pending")?.count || 0,
      approved: leaveStatus.find((item) => item._id === "approved")?.count || 0,
      rejected: leaveStatus.find((item) => item._id === "rejected")?.count || 0,
    };
    res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalaries: totalSalaries[0]?.totalSalaries || 0,
      employeeAppliedForLeave,
      leaveSummary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error);
  }
};
export { getDashboard };
