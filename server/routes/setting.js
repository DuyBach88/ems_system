import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import x from "../controllers/settingController.js";
const router = express.Router();

router.put("/change-password", authMiddleware, x.changeSetting);
router.post("/forgot-password", x.forgotPassword);
router.post("/reset-password", x.resetPassword);
export default router;
