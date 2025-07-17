import mongoose from "mongoose";
import Employee from "./Employee.js";
import LeaveRequest from "./Leave.js";
import Attendance from "./Attendance.js";
import Salary from "./Salary.js";
const departmentSchema = new mongoose.Schema(
  {
    dep_name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      minlength: [3, "Department name must be at least 3 characters long"],
      maxlength: [100, "Department name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
  },
  { timestamps: true }
);
departmentSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const employees = await Employee.find({ department: this._id });
      const empIds = employees.map((emp) => emp._id);
      await Employee.deleteMany({ _id: { $in: empIds } });
      await LeaveRequest.deleteMany({ employeeId: { $in: empIds } });
      await Attendance.deleteMany({ employeeId: { $in: empIds } });
      await Salary.deleteMany({ employeeId: { $in: empIds } });
      next();
    } catch (error) {
      next(error);
    }
  }
);
const Department = mongoose.model("Department", departmentSchema);
export default Department;
