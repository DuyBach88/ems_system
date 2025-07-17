import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import transporter from "../config/email.js";
import sendEmail from "../utils/sendEmail.js";
const changeSetting = async (req, res) => {
  try {
    // 1) Get userId from JWT (authMiddleware must populate req.user.id)
    const userId = req.user.id;

    // 2) Extract old & new passwords from body
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both oldPassword and newPassword are required",
      });
    }

    // 3) Find user and compare
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong old password",
      });
    }

    // 4) Hash & save the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ success: false, message: "Email not found" });

  // generate a token & expiry
  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // send email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const text = `You requested a password reset. Click here:\n\n${resetUrl}\n\nIf you didn't, ignore this email.`;
  await sendEmail({ to: user.email, subject: "Reset your password", text });

  res.json({ success: true, message: "Reset link sent to your email" });
};
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Token and new password required" });
    }

    // Find user by valid, non-expired token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Hash & save
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ success: true, message: "Password has been reset" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export default { changeSetting, forgotPassword, resetPassword };
