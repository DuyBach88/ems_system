import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    dob: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    phone: {
      type: String,
      match: [/^\d{9,15}$/, "Invalid phone number"],
    },
    address: { type: String, maxlength: 100 },
    designation: { type: String },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    salary: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
