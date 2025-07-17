import mongoose from "mongoose";
import { Schema } from "mongoose";

const salarySchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    basicSalary: { type: Number },
    allowances: { type: Number },
    deductions: { type: Number },
    netSalary: { type: Number, required: true },
    payDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Create a model based on the schema
const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
