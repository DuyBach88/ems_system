import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong password" });
    }
    // Đảm bảo role trả về là chữ thường
    const role = user.role ? user.role.toLowerCase() : "employee";
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};
const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // 1. Kiểm tra đầu vào
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Kiểm tra người dùng đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo người dùng
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
    });

    // 6. Phản hồi
    res.status(201).json({
      message: "User and employee registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export { login, verify, register };
