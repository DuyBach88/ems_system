import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    status: { type: String, enum: ["present", "absent"], default: "absent" },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    times: { type: [{ in: Date, out: Date }], default: [] },
    inOutStatus: { type: String, enum: ["in", "out"], default: "out" },
    totalHours: { type: Number, default: 0 },
    checkInCount: { type: Number, default: 0 },
    checkOutCount: { type: Number, default: 0 },
    date: { type: Date, required: true },
    shiftStart: { type: Date, default: null },
    shiftEnd: { type: Date, default: null },
    approveBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
