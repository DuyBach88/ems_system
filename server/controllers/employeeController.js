import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// Helper function sinh Employee ID

const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });
  if (!lastEmployee) return "EMP-0001";

  const lastId = lastEmployee.employeeId; // ví dụ EMP-0007
  const lastNum = parseInt(lastId.split("-")[1], 10); // 7
  const newNum = lastNum + 1;
  return `EMP-${String(newNum).padStart(4, "0")}`; // EMP-0008
};
// Tạo trước Employee ID tiếp theo (preview)
const getNextEmployeeId = async (req, res) => {
  try {
    const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });
    let nextId = "EMP-0001";

    if (lastEmployee) {
      const lastNum = parseInt(lastEmployee.employeeId.split("-")[1], 10);
      nextId = `EMP-${String(lastNum + 1).padStart(4, "0")}`;
    }

    res.status(200).json({ success: true, nextId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addEmployee = async (req, res) => {
  let savedUser = null;
  try {
    const {
      name,
      email,
      password,
      role,
      dob,
      gender,
      phone,
      address,
      designation,
      department,
      salary,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (await User.findOne({ email })) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // 🔹 Sinh Employee ID tự động
    const employeeId = await generateEmployeeId();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload avatar lên Cloudinary nếu có
    let profileImageUrl = null;
    let profileImagePublicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "employees");
      console.log("Cloudinary upload result:", result);
      profileImageUrl = result.secure_url;
      profileImagePublicId = result.public_id;
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: profileImageUrl,
      profileImagePublicId,
    });

    savedUser = await newUser.save();

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

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employeeId, // trả về để FE hiển thị
    });
  } catch (err) {
    if (savedUser) await User.deleteOne({ _id: savedUser._id });
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

// GET ALL EMPLOYEES

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate({ path: "userId", select: "-password" })
      .populate("department");

    res.status(200).json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SINGLE EMPLOYEE

const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = null;

    if (mongoose.isValidObjectId(id)) {
      employee = await Employee.findById(id)
        .populate({ path: "userId", select: "-password" })
        .populate("department");
    }

    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate({ path: "userId", select: "-password" })
        .populate("department");
    }

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE EMPLOYEE
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, department, salary } = req.body;

    if (!name || !designation || !department) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, designation, and department are required",
        });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 🔹 Upload ảnh mới nếu có
    let profileImageUrl = user.profileImage;
    let profileImagePublicId = user.profileImagePublicId;

    if (req.file) {
      // Xoá ảnh cũ trên Cloudinary nếu có
      if (profileImagePublicId) {
        await cloudinary.uploader.destroy(profileImagePublicId);
      }

      // Upload ảnh mới
      const result = await uploadToCloudinary(req.file.buffer, "employees");
      profileImageUrl = result.secure_url;
      profileImagePublicId = result.public_id;
    }

    // Update user
    await User.findByIdAndUpdate(
      employee.userId,
      { name, profileImage: profileImageUrl, profileImagePublicId },
      { new: true }
    );

    // Update employee
    await Employee.findByIdAndUpdate(
      id,
      {
        designation,
        department,
        salary: salary ? Number(salary) : employee.salary,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "Employee updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Internal server error",
      });
  }
};

// GET EMPLOYEES BY DEPARTMENT
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
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
  getNextEmployeeId,
};
