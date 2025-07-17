import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";

const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } =
      req.body;
    const totalSalary =
      parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);
    const newSalary = await Salary.create({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary: totalSalary,
      payDate,
    });
    if (!newSalary) {
      return res.status(400).json({
        success: false,
        message: "Error adding salary",
      });
    }
    res.status(201).json({
      success: true,
      message: "Salary added successfully",
      salary: newSalary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getSalary = async (req, res) => {
  let salary;
  try {
    const { id } = req.params;
    salary = await Salary.find({ employeeId: id }).populate(
      "employeeId",
      "employeeId"
    );
    if (!salary || salary.length < 1) {
      const employee = await Employee.findOne({ userId: id });
      salary = await Salary.find({ employeeId: employee._id }).populate(
        "employeeId",
        "employeeId"
      );
      console.log(salary);
    }
    res.status(200).json({
      success: true,
      salary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export { addSalary, getSalary };
