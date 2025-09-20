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
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let salaries = await Salary.find({ employeeId: id })
      .populate("employeeId", "employeeId")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ payDate: -1 });

    // Nếu không có, thử tìm theo userId
    if (!salaries || salaries.length < 1) {
      const employee = await Employee.findOne({ userId: id });
      if (employee) {
        salaries = await Salary.find({ employeeId: employee._id })
          .populate("employeeId", "employeeId")
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ payDate: -1 });
      }
    }

    const total = await Salary.countDocuments({ employeeId: id });
    const totalPages = Math.ceil(total / limit);

    // ✅ LUÔN trả về success, kể cả khi rỗng
    res.status(200).json({
      success: true,
      salaries: salaries || [],
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export { addSalary, getSalary };
