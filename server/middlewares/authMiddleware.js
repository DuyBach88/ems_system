import jwt from "jsonwebtoken";
import User from "../models/User.js"; // đường dẫn model user

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(404).json({
        success: false,
        error: "Token Not Provided",
      });
    }

    // Sử dụng đúng biến môi trường JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(404).json({
        success: false,
        error: "Token Not Valid",
      });
    }

    // Sử dụng đúng trường _id
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }

    req.user = user; // đính user vào req để các route sau dùng được
    next(); // cho phép đi tiếp
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }
};

export default verifyUser;
