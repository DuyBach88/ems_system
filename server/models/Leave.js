import mongoose from "mongoose";
import { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
const leaveSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      enum: [
        "Sick Leave",
        "Casual Leave",
        "Annual Leave",
        "Maternity Leave",
        "Paternity Leave",
        "Other",
      ],
      required: true,
    },
    startDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create a model based on the schema
const LeaveRequest = mongoose.model("Leave", leaveSchema);

export default LeaveRequest;
