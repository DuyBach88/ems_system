import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import authRole from "../middlewares/authRole.js";
import attendanceCtrl from "../controllers/attendance.js";
const router = express.Router();
// ===== Employee routes =====
router.post("/checkin", authMiddleware, attendanceCtrl.checkIn);

router.post("/checkout", authMiddleware, attendanceCtrl.checkOut);

router.get("/me", authMiddleware, attendanceCtrl.getMyAttendance);

// ===== Admin routes =====
router.patch(
  "/:id/approve",
  authMiddleware,
  authRole("admin"),
  attendanceCtrl.approveAttendance
);

router.patch(
  "/approve",
  authMiddleware,
  authRole("admin"),
  attendanceCtrl.approveMultiple
);

router.get(
  "/",
  authMiddleware,
  authRole("admin"),
  attendanceCtrl.getAllAttendance
);

router.delete(
  "/:id",
  authMiddleware,
  authRole("admin"),
  attendanceCtrl.deleteAttendance
);
router.patch(
  "/:id/manual-checkout",
  authMiddleware,
  authRole("admin"),
  attendanceCtrl.manualCheckOut
);
router.get(
  "/report/daily",
  authMiddleware,
  authRole("admin"),
  attendanceCtrl.dailyAttendanceReport
);
export default router;
