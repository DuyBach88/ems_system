import express from "express";
import settingController from "../controllers/settingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.put("/change-password", authMiddleware, settingController.changeSetting);
router.post("/forgot-password", settingController.forgotPassword);
router.post("/reset-password", settingController.resetPassword);
router.get("/me", authMiddleware, settingController.getProfile);
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("photo"),
  settingController.updateProfile
);

export default router;
