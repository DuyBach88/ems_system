import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join("public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, and .png files are allowed"), false);
    }
  },
});

// Middleware to handle Multer errors
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ success: false, message: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

const addEmployee = async (req, res) => {
  let savedUser = null; // Declare savedUser at the top to ensure scope
  try {
    const {
      name,
      email,
      password,
      role,
      employeeId,
      dob,
      gender,
      phone,
      address,
      designation,
      department,
      salary,
    } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check for existing user
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists in the system" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (await Employee.findOne({ employeeId })) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID already exists" });
    }
    // Save User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: req.file ? req.file.filename : null,
    });

    savedUser = await newUser.save();
    console.log("Saved user:", savedUser._id); // Debug log

    // Save Employee
    const newEmployee = new Employee({
      employeeId,
      dob,
      gender,
      phone,
      address,
      designation,
      department,
      salary,
      userId: savedUser._id,
    });

    await newEmployee.save();
    console.log("Saved employee with userId:", savedUser._id); // Debug log

    return res
      .status(201)
      .json({ success: true, message: "Employee added successfully" });
  } catch (err) {
    // Clean up: Delete the uploaded file and User if created
    if (req.file && fs.existsSync(path.join(uploadDir, req.file.filename))) {
      fs.unlinkSync(path.join(uploadDir, req.file.filename));
      console.log("Cleaned up uploaded file:", req.file.filename);
    }
    if (savedUser) {
      await User.deleteOne({ _id: savedUser._id });
      console.log("Cleaned up user:", savedUser._id);
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error("Error adding employee:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate({ path: "userId", select: "-password" })
      .populate("department");

    res.status(200).json({ success: true, employees });
  } catch (err) {}
};
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee;
    employee = await Employee.findById({ _id: id })
      .populate({ path: "userId", select: "-password" })
      .populate("department");
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate({ path: "userId", select: "-password" })
        .populate("department");
    }
    res.status(200).json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Since FormData is used, fields are in req.body after multer parsing
    const { name, designation, department, salary } = req.body;

    // Validate required fields
    if (!name || !designation || !department) {
      return res.status(400).json({
        success: false,
        message: "Name, designation, and department are required",
      });
    }

    // Find employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Find associated user
    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user (name)
    const updatedUser = await User.findByIdAndUpdate(
      employee.userId,
      { name },
      { new: true }
    );

    // Update employee (designation, department, salary)
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        designation,
        department,
        salary: salary ? Number(salary) : employee.salary,
      },
      { new: true }
    );

    if (!updatedUser || !updatedEmployee) {
      return res.status(500).json({
        success: false,
        message: "Failed to update employee or user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
const fetchEmployeesByDepId = async (req, res) => {
  try {
    const { id } = req.params;
    const employees = await Employee.find({ department: id });
    res.status(200).json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export {
  addEmployee,
  upload,
  handleMulterErrors,
  getEmployee,
  getEmployees,
  updateEmployee,
  fetchEmployeesByDepId,
};
